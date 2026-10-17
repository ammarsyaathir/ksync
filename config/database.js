// config/database.js - Tri-Database Connector (Azure SQL Database, MySQL & SQLite)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../database/ksync.db');

let mssqlPool = null;
let isUsingMSSQL = false;
let mysqlPool = null;
let isUsingMySQL = false;
let sqliteDb = null;

// 1. Check if Azure SQL Database (MSSQL) is configured
if (process.env.DB_SERVER && (process.env.DB_DATABASE || process.env.DB_NAME) && process.env.DB_USER) {
  try {
    const mssql = (await import('mssql')).default;
    const dbName = process.env.DB_DATABASE || process.env.DB_NAME;
    const config = {
      server: process.env.DB_SERVER, // e.g. ksync-sql-server.database.windows.net
      database: dbName,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 1433,
      options: {
        encrypt: true, // Mandatory for Azure SQL Database
        trustServerCertificate: false
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };
    mssqlPool = await mssql.connect(config);
    isUsingMSSQL = true;
    console.log(`🔌 Connected to Azure SQL Database [${dbName}] at ${process.env.DB_SERVER}`);
  } catch (err) {
    console.error('⚠️ Failed to connect to Azure SQL Database:', err.message);
  }
}

// 2. Check if MySQL is configured (if not using MSSQL)
if (!isUsingMSSQL && process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
  try {
    const mysql = await import('mysql2/promise');
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
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
    isUsingMySQL = true;
    console.log(`🔌 Connected to MySQL Database [${process.env.DB_NAME}] at ${process.env.DB_HOST}`);
  } catch (err) {
    console.error('⚠️ Failed to connect to MySQL:', err.message);
  }
}

// 3. Fallback to Local SQLite if neither cloud DB is configured or connection failed
if (!isUsingMSSQL && !isUsingMySQL) {
  try {
    const Database = (await import('better-sqlite3')).default;
    sqliteDb = new Database(dbFile);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');
    console.log(`📦 Connected to Local SQLite Database at ${dbFile}`);
  } catch (err) {
    console.error('❌ Failed to initialize SQLite Database:', err.message);
    throw err;
  }
}

/**
 * Execute a query that returns multiple rows
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<Array>}
 */
export async function query(sql, params = []) {
  if (isUsingMSSQL && mssqlPool) {
    const request = mssqlPool.request();
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
  if (isUsingMSSQL && mssqlPool) {
    const request = mssqlPool.request();
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
  if (isUsingMSSQL && mssqlPool) {
    const request = mssqlPool.request();
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
