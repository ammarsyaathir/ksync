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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initPostgresDatabase() {
  try {
    const client = await pool.connect();
    try {
      const sqlPath = path.join(__dirname, '../database/postgres_schema.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await client.query(sql);
        console.log('✅ PostgreSQL database schema verified & initialized successfully.');
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('⚠️ Warning: PostgreSQL auto-initialization skipped or connection error:', err.message);
    console.warn('   (Make sure DATABASE_URL is correctly set in your environment if connecting to cloud/local PostgreSQL).');
  }
}
