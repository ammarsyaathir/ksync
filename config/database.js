// config/database.js - Tri-Database Connector (MSSQL, MySQL & SQLite)
// Clean synchronous ESM module with ZERO top-level await for 100% Hostinger/LiteSpeed compatibility
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import mssql from 'mssql';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../database/ksync.db');

let mssqlPool = null;
let mysqlPool = null;
let sqliteDb = null;

const isUsingMSSQL = Boolean(process.env.DB_SERVER && (process.env.DB_DATABASE || process.env.DB_NAME) && process.env.DB_USER);
const isUsingMySQL = Boolean(!isUsingMSSQL && process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER);

// 1. Synchronous initialization for MySQL Pool (if configured)
if (isUsingMySQL) {
  try {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      dateStrings: true,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
    console.log(`🔌 Initialized MySQL Pool [${process.env.DB_NAME}] at ${process.env.DB_HOST}`);
  } catch (err) {
    console.error('⚠️ Failed to initialize MySQL pool:', err.message);
  }
} else if (!isUsingMSSQL) {
  // 2. Synchronous initialization for Local SQLite (Default)
  try {
    sqliteDb = new Database(dbFile);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');
    console.log(`📦 Connected to Local SQLite Database at ${dbFile}`);
  } catch (err) {
    console.error('❌ Failed to initialize SQLite Database:', err.message);
  }
}

// 3. Lazy connector for MSSQL (if configured)
async function getMSSQLPool() {
  if (!mssqlPool) {
    const dbName = process.env.DB_DATABASE || process.env.DB_NAME;
    const config = {
      server: process.env.DB_SERVER,
      database: dbName,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 1433,
      options: {
        encrypt: true,
        trustServerCertificate: false
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };
    mssqlPool = await mssql.connect(config);
    console.log(`🔌 Connected to Azure SQL Database [${dbName}] at ${process.env.DB_SERVER}`);
  }
  return mssqlPool;
}

/**
 * Execute a query that returns multiple rows
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<Array>}
 */
export async function query(sql, params = []) {
  if (isUsingMSSQL) {
    const pool = await getMSSQLPool();
    const request = pool.request();
    let paramIdx = 1;
    const mssqlSql = sql.replace(/\?/g, () => `@p${paramIdx++}`);
    params.forEach((val, i) => {
      request.input(`p${i + 1}`, val);
    });
    const result = await request.query(mssqlSql);
    return result.recordset || [];
  } else if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  } else {
    if (!sqliteDb) {
      sqliteDb = new Database(dbFile);
    }
    return sqliteDb.prepare(sql).all(...params);
  }
}

/**
 * Execute a query that returns a single row
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<Object|null>}
 */
export async function getOne(sql, params = []) {
  if (isUsingMSSQL) {
    const pool = await getMSSQLPool();
    const request = pool.request();
    let paramIdx = 1;
    const mssqlSql = sql.replace(/\?/g, () => `@p${paramIdx++}`);
    params.forEach((val, i) => {
      request.input(`p${i + 1}`, val);
    });
    const result = await request.query(mssqlSql);
    return result.recordset && result.recordset.length > 0 ? result.recordset[0] : null;
  } else if (isUsingMySQL && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows && rows.length > 0 ? rows[0] : null;
  } else {
    if (!sqliteDb) {
      sqliteDb = new Database(dbFile);
    }
    const row = sqliteDb.prepare(sql).get(...params);
    return row || null;
  }
}

/**
 * Execute an INSERT, UPDATE, or DELETE statement
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<{ insertId: number|null, affectedRows: number }>}
 */
export async function execute(sql, params = []) {
  if (isUsingMSSQL) {
    const pool = await getMSSQLPool();
    const request = pool.request();
    let paramIdx = 1;
    let mssqlSql = sql.replace(/\?/g, () => `@p${paramIdx++}`);
    params.forEach((val, i) => {
      request.input(`p${i + 1}`, val);
    });

    const isInsert = /^\s*INSERT\s+INTO/i.test(sql);
    if (isInsert) {
      mssqlSql += '; SELECT SCOPE_IDENTITY() AS insertId;';
    }

    const result = await request.query(mssqlSql);
    const insertId = result.recordset && result.recordset[0] && result.recordset[0].insertId 
      ? Number(result.recordset[0].insertId) 
      : null;

    return {
      insertId,
      affectedRows: result.rowsAffected ? result.rowsAffected[0] : 0
    };
  } else if (isUsingMySQL && mysqlPool) {
    const [result] = await mysqlPool.execute(sql, params);
    return {
      insertId: result.insertId || null,
      affectedRows: result.affectedRows || 0
    };
  } else {
    if (!sqliteDb) {
      sqliteDb = new Database(dbFile);
    }
    const info = sqliteDb.prepare(sql).run(...params);
    return {
      insertId: Number(info.lastInsertRowid) || null,
      affectedRows: info.changes || 0
    };
  }
}

export function isMySQL() {
  return isUsingMySQL;
}

export function isMSSQL() {
  return isUsingMSSQL;
}

export default {
  query,
  getOne,
  execute,
  isMySQL,
  isMSSQL
};
