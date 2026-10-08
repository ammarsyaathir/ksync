import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ksync';

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let __dirname = '';
try {
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.url) {
    const __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  }
} catch (e) {
  // Safe fallback for Cloudflare Workers / Edge environments
}

export async function initPostgresDatabase() {
  if (!__dirname) return;
  try {
    const client = await pool.connect();
    try {
      const sqlPath = path.join(__dirname, '../database/postgres_schema.sql');
      if (fs.existsSync && fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await client.query(sql);
        console.log('✅ PostgreSQL database schema verified & initialized successfully.');
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('⚠️ Warning: PostgreSQL auto-initialization skipped or connection error:', err.message);
  }
}
