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

    // Self-healing schema enhancement for Hostinger MySQL
    setTimeout(async () => {
      try {
        const [colRows] = await mysqlPool.query("SHOW COLUMNS FROM `events` LIKE 'cluster_area'");
        if (!colRows || colRows.length === 0) {
          await mysqlPool.query("ALTER TABLE `events` ADD COLUMN `cluster_area` VARCHAR(100) NULL AFTER `state`");
          console.log("✅ Auto-migrated MySQL: Added cluster_area to events.");
          await mysqlPool.query("UPDATE events SET cluster_area = 'Bukit Jalil Hub' WHERE venue_name LIKE '%Axiata%' OR venue_name LIKE '%Bukit Jalil%' OR venue_name LIKE '%National Stadium%' OR venue_name LIKE '%Unifi Arena%'");
          await mysqlPool.query("UPDATE events SET cluster_area = 'BBCC & Downtown KL' WHERE venue_name LIKE '%Zepp%' OR venue_name LIKE '%Bukit Bintang%' OR venue_name LIKE '%KLCC%'");
          await mysqlPool.query("UPDATE events SET cluster_area = 'KL Sentral & Brickfields' WHERE venue_name LIKE '%Mega Star Arena%' OR venue_name LIKE '%Sentral%'");
          await mysqlPool.query("UPDATE events SET cluster_area = 'Petaling Jaya & Sunway' WHERE venue_name LIKE '%Sunway%' OR city LIKE '%Petaling Jaya%' OR city LIKE '%Subang%'");
          await mysqlPool.query("UPDATE events SET cluster_area = 'Penang & Northern Region' WHERE city LIKE '%Penang%' OR city LIKE '%George Town%'");
          await mysqlPool.query("UPDATE events SET cluster_area = 'Kuala Lumpur Metro Hub' WHERE cluster_area IS NULL OR cluster_area = ''");
        }

        await mysqlPool.query(`
          CREATE TABLE IF NOT EXISTS \`venues\` (
            \`id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`name\` VARCHAR(150) NOT NULL,
            \`address\` TEXT NULL,
            \`city\` VARCHAR(100) NOT NULL,
            \`state\` VARCHAR(100) NOT NULL,
            \`capacity\` INT NULL,
            \`transit_info\` TEXT NULL,
            \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        const [venueCount] = await mysqlPool.query("SELECT COUNT(*) as cnt FROM venues");
        if (venueCount[0].cnt === 0) {
          await mysqlPool.query(`
            INSERT INTO \`venues\` (\`id\`, \`name\`, \`city\`, \`state\`, \`capacity\`, \`transit_info\`) VALUES
            (1, 'Axiata Arena Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 16000, 'LRT Sri Petaling Line (Bukit Jalil PH5). 5-min covered walkway.'),
            (2, 'National Stadium Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 87000, 'LRT Sri Petaling Line (Bukit Jalil PH5). Covered pedestrian plaza.'),
            (3, 'Zepp Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 2500, 'Direct connection from Hang Tuah station (LRT/Monorail) via LaLaport BBCC.'),
            (4, 'Idea Live KL (Mega Star Arena)', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 5000, 'Inside Sungei Wang Plaza Level 4. Direct walkway from MRT Bukit Bintang.');
          `);
          console.log("✅ Auto-seeded venues table in MySQL.");
        }

        // 3. Ensure user_passport_stamps table exists in MySQL
        await mysqlPool.query(`
          CREATE TABLE IF NOT EXISTS \`user_passport_stamps\` (
            \`id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`user_id\` INT NOT NULL,
            \`event_id\` INT NOT NULL,
            \`seat_section\` VARCHAR(100) DEFAULT 'General Seated / Standing',
            \`attendance_status\` VARCHAR(20) DEFAULT 'ATTENDED',
            \`fan_review\` TEXT NULL,
            \`stamped_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY \`user_event_stamp\` (\`user_id\`, \`event_id\`),
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
            FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // 4. Ensure email_otp_verifications table exists in MySQL
        await mysqlPool.query(`
          CREATE TABLE IF NOT EXISTS \`email_otp_verifications\` (
            \`id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`email\` VARCHAR(255) NOT NULL,
            \`otp_code\` VARCHAR(10) NOT NULL,
            \`purpose\` VARCHAR(50) DEFAULT 'REGISTRATION',
            \`expires_at\` DATETIME NOT NULL,
            \`is_used\` TINYINT(1) DEFAULT 0,
            \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX \`idx_email_otp\` (\`email\`, \`otp_code\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // 5. Ensure artists table has slug, debut_year, fandom_name, header_image in MySQL
        try {
          const [artistCols] = await mysqlPool.query("SHOW COLUMNS FROM `artists`");
          const existingColNames = (artistCols || []).map(c => c.Field.toLowerCase());

          if (!existingColNames.includes('slug')) {
            await mysqlPool.query("ALTER TABLE `artists` ADD COLUMN `slug` VARCHAR(100) NULL AFTER `name`");
            console.log("✅ Auto-migrated MySQL: Added slug to artists.");
          }
          if (!existingColNames.includes('debut_year')) {
            await mysqlPool.query("ALTER TABLE `artists` ADD COLUMN `debut_year` INT NULL");
            console.log("✅ Auto-migrated MySQL: Added debut_year to artists.");
          }
          if (!existingColNames.includes('fandom_name')) {
            await mysqlPool.query("ALTER TABLE `artists` ADD COLUMN `fandom_name` VARCHAR(100) NULL");
            console.log("✅ Auto-migrated MySQL: Added fandom_name to artists.");
          }
          if (!existingColNames.includes('header_image')) {
            await mysqlPool.query("ALTER TABLE `artists` ADD COLUMN `header_image` VARCHAR(255) NULL");
            console.log("✅ Auto-migrated MySQL: Added header_image to artists.");
          }

          // 5. Ensure all 20 Official Malaysia Artists exist in MySQL
          const { OFFICIAL_20_ARTISTS, OFFICIAL_120_MEMBERS } = await import('../database/official_20_artists_data.js');
          for (const a of OFFICIAL_20_ARTISTS) {
            await mysqlPool.query(
              `INSERT INTO \`artists\` (\`id\`, \`name\`, \`slug\`, \`group_type\`, \`agency\`, \`debut_year\`, \`fandom_name\`, \`image_url\`, \`header_image\`, \`description\`)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE
                 \`name\` = VALUES(\`name\`),
                 \`slug\` = VALUES(\`slug\`),
                 \`group_type\` = VALUES(\`group_type\`),
                 \`agency\` = VALUES(\`agency\`),
                 \`debut_year\` = VALUES(\`debut_year\`),
                 \`fandom_name\` = VALUES(\`fandom_name\`),
                 \`image_url\` = VALUES(\`image_url\`),
                 \`header_image\` = VALUES(\`header_image\`),
                 \`description\` = VALUES(\`description\`)`,
              [a.id, a.name, a.slug, a.group_type || 'Boy Group', a.agency, a.debut_year, a.fandom_name, a.image_url, a.header_image || a.image_url, a.description]
            );
          }
          
          // Prune any legacy artists not in the 20 official Malaysia roster
          const validSlugs = OFFICIAL_20_ARTISTS.map(a => a.slug);
          const validIds = OFFICIAL_20_ARTISTS.map(a => a.id);
          await mysqlPool.query(
            `DELETE FROM \`artists\` WHERE \`slug\` NOT IN (?) AND \`id\` NOT IN (?)`,
            [validSlugs, validIds]
          );
          console.log("✅ Auto-migrated MySQL: Synced all 20 Malaysia Artists.");
        } catch (colErr) {
          console.warn("MySQL artists columns check note:", colErr.message);
        }

        // 6. Ensure members table exists in MySQL
        await mysqlPool.query(`
          CREATE TABLE IF NOT EXISTS \`members\` (
            \`id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`artist_id\` INT NOT NULL,
            \`stage_name\` VARCHAR(100) NOT NULL,
            \`birth_name\` VARCHAR(150) DEFAULT NULL,
            \`group_name\` VARCHAR(100) DEFAULT NULL,
            \`position\` VARCHAR(200) DEFAULT NULL,
            \`dob\` DATE DEFAULT NULL,
            \`zodiac\` VARCHAR(20) DEFAULT NULL,
            \`height_cm\` DECIMAL(5,1) DEFAULT NULL,
            \`blood_type\` VARCHAR(5) DEFAULT NULL,
            \`mbti\` VARCHAR(20) DEFAULT NULL,
            \`nationality\` VARCHAR(50) DEFAULT NULL,
            \`debut_year\` INT DEFAULT NULL,
            \`photo\` VARCHAR(255) DEFAULT NULL,
            \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
            \`sort_order\` INT NOT NULL DEFAULT 0,
            \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY \`uniq_members_artist_stage\` (\`artist_id\`, \`stage_name\`),
            KEY \`idx_members_artist\` (\`artist_id\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // 7. Upsert all 120 Members in MySQL with verified local photos
        const { OFFICIAL_120_MEMBERS } = await import('../database/official_20_artists_data.js');
        for (const m of OFFICIAL_120_MEMBERS) {
          await mysqlPool.query(
            `INSERT INTO \`members\` (\`artist_id\`, \`stage_name\`, \`birth_name\`, \`group_name\`, \`position\`, \`dob\`, \`zodiac\`, \`height_cm\`, \`blood_type\`, \`mbti\`, \`nationality\`, \`debut_year\`, \`photo\`, \`is_active\`, \`sort_order\`)
             SELECT a.id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?
             FROM \`artists\` a WHERE a.slug = ?
             ON DUPLICATE KEY UPDATE
               \`birth_name\` = VALUES(\`birth_name\`),
               \`position\` = VALUES(\`position\`),
               \`dob\` = VALUES(\`dob\`),
               \`zodiac\` = VALUES(\`zodiac\`),
               \`height_cm\` = VALUES(\`height_cm\`),
               \`blood_type\` = VALUES(\`blood_type\`),
               \`mbti\` = VALUES(\`mbti\`),
               \`nationality\` = VALUES(\`nationality\`),
               \`debut_year\` = VALUES(\`debut_year\`),
               \`photo\` = VALUES(\`photo\`),
               \`sort_order\` = VALUES(\`sort_order\`)`,
            [m.stage_name, m.birth_name, m.group_name, m.position, m.dob, m.zodiac, m.height_cm, m.blood_type, m.mbti, m.nationality, m.debut_year, m.photo, m.sort_order, m.artist_slug]
          );
        }
        await mysqlPool.query("DELETE FROM `members` WHERE `artist_id` NOT IN (SELECT `id` FROM `artists`)");
        console.log("✅ Auto-migrated MySQL: Synced all 120 Members with local photos.");
      } catch (migErr) {
        console.warn("MySQL auto-migration check note:", migErr.message);
      }
    }, 1000);
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
