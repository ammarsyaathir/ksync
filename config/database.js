// config/database.js - Dual Hostinger MySQL & Local SQLite Database Connector
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.resolve(__dirname, '../database/ksync.db');

let mysqlPool = null;
let sqliteDb = null;
let isUsingMySQL = false;

// Check if MySQL credentials are provided in environment
if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
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
      charset: 'utf8mb4'
    });
    isUsingMySQL = true;
    console.log(`🔌 Connected to Hostinger MySQL Database [${process.env.DB_NAME}] at ${process.env.DB_HOST}`);
  } catch (err) {
    console.error('⚠️ Failed to connect to MySQL, falling back to local SQLite:', err.message);
  }
}

// Fallback to local SQLite if MySQL not configured or connection failed
if (!isUsingMySQL) {
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
  if (isUsingMySQL && mysqlPool) {
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
  if (isUsingMySQL && mysqlPool) {
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
  if (isUsingMySQL && mysqlPool) {
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

export default {
  query,
  getOne,
  execute,
  isMySQL
};
