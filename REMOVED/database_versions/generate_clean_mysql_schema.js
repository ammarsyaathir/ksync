// database/generate_clean_mysql_schema.js
import fs from 'fs';
import db from '../config/database.js';

async function generate() {
  const roles = await db.query("SELECT * FROM roles ORDER BY id ASC");
  const users = await db.query("SELECT * FROM users ORDER BY id ASC");
  const artists = await db.query("SELECT * FROM artists ORDER BY id ASC");
  const categories = await db.query("SELECT * FROM event_categories ORDER BY id ASC");
  const events = await db.query("SELECT * FROM events ORDER BY id ASC");
  const chats = await db.query("SELECT * FROM event_chat_messages ORDER BY id ASC");

  const sql = `-- ============================================================================
-- K-Sync Malaysia: Hostinger MySQL Production Schema (Chapter 1 Aligned)
-- Total Tables: 10 Essential Tables
-- Compatible with Hostinger MySQL 8.0 / MariaDB 10.4+ / phpMyAdmin
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+08:00';

-- --------------------------------------------------------
-- 1. Table structure for \`roles\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`roles\`;
CREATE TABLE \`roles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(50) UNIQUE NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`roles\` (\`id\`, \`name\`) VALUES 
(1, 'Admin'),
(2, 'Organizer'),
(3, 'Fan');

-- --------------------------------------------------------
-- 2. Table structure for \`users\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`role_id\` INT NOT NULL DEFAULT 3,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) UNIQUE NOT NULL,
  \`email\` VARCHAR(100) UNIQUE NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`bio\` TEXT,
  \`profile_image\` VARCHAR(255),
  \`organization_name\` VARCHAR(150),
  \`organization_type\` VARCHAR(50) DEFAULT 'Fanclub',
  \`social_handle\` VARCHAR(50),
  \`social_url\` VARCHAR(255),
  \`location\` VARCHAR(100) DEFAULT 'Kuala Lumpur',
  \`status\` VARCHAR(20) DEFAULT 'ACTIVE',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

${users.map(u => `INSERT INTO \`users\` (\`id\`, \`role_id\`, \`full_name\`, \`username\`, \`email\`, \`password_hash\`, \`bio\`, \`profile_image\`, \`status\`, \`created_at\`) VALUES (${u.id}, ${u.role_id}, '${(u.full_name || '').replace(/'/g, "\\'")}', '${u.username}', '${u.email}', '${u.password_hash}', '${(u.bio || '').replace(/'/g, "\\'")}', '${u.profile_image || ''}', '${u.status || 'ACTIVE'}', '${u.created_at || '2026-09-21 09:06:15'}');`).join('\n')}

-- --------------------------------------------------------
-- 3. Table structure for \`artists\` (With Idol Member Biodata JSON)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`artists\`;
CREATE TABLE \`artists\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`group_type\` VARCHAR(50) DEFAULT 'Boy Group',
  \`image_url\` VARCHAR(255),
  \`agency\` VARCHAR(100),
  \`description\` TEXT,
  \`members\` LONGTEXT,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

${artists.map(a => `INSERT INTO \`artists\` (\`id\`, \`name\`, \`group_type\`, \`image_url\`, \`agency\`, \`description\`, \`members\`, \`created_at\`) VALUES (${a.id}, '${(a.name || '').replace(/'/g, "\\'")}', '${a.group_type || ''}', '${a.image_url || ''}', '${(a.agency || '').replace(/'/g, "\\'")}', '${(a.description || '').replace(/'/g, "\\'")}', '${(a.members || '[]').replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', '${a.created_at || '2026-09-21 09:06:15'}');`).join('\n')}

-- --------------------------------------------------------
-- 4. Table structure for \`event_categories\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`event_categories\`;
CREATE TABLE \`event_categories\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) UNIQUE NOT NULL,
  \`slug\` VARCHAR(100) UNIQUE NOT NULL,
  \`badge_color\` VARCHAR(30) DEFAULT 'purple',
  \`description\` TEXT,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

${categories.map(c => `INSERT INTO \`event_categories\` (\`id\`, \`name\`, \`slug\`, \`badge_color\`, \`description\`) VALUES (${c.id}, '${c.name}', '${c.slug}', '${c.badge_color}', '${(c.description || '').replace(/'/g, "\\'")}');`).join('\n')}

-- --------------------------------------------------------
-- 5. Table structure for \`events\` (Central Table with Venue embedded)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`events\`;
CREATE TABLE \`events\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`organizer_id\` INT NOT NULL DEFAULT 2,
  \`artist_id\` INT,
  \`category_id\` INT NOT NULL,
  \`event_name\` VARCHAR(200) NOT NULL,
  \`description\` TEXT,
  \`event_date\` DATE NOT NULL,
  \`start_time\` TIME NOT NULL,
  \`end_time\` TIME,
  \`venue_name\` VARCHAR(150) NOT NULL,
  \`address\` TEXT,
  \`city\` VARCHAR(100) NOT NULL,
  \`state\` VARCHAR(100) NOT NULL,
  \`ticket_info\` TEXT,
  \`event_rules\` TEXT,
  \`official_url\` VARCHAR(255),
  \`poster_image\` VARCHAR(255),
  \`event_status\` VARCHAR(30) DEFAULT 'UPCOMING',
  \`verification_status\` VARCHAR(30) DEFAULT 'PENDING',
  \`rejection_reason\` TEXT,
  \`tracking_code\` VARCHAR(50) UNIQUE,
  \`submitter_name\` VARCHAR(150),
  \`submitter_email\` VARCHAR(150),
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`organizer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`artist_id\`) REFERENCES \`artists\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`category_id\`) REFERENCES \`event_categories\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

${events.map(e => `INSERT INTO \`events\` (\`id\`, \`organizer_id\`, \`artist_id\`, \`category_id\`, \`event_name\`, \`description\`, \`event_date\`, \`start_time\`, \`end_time\`, \`venue_name\`, \`address\`, \`city\`, \`state\`, \`ticket_info\`, \`event_rules\`, \`official_url\`, \`poster_image\`, \`event_status\`, \`verification_status\`, \`rejection_reason\`, \`tracking_code\`, \`submitter_name\`, \`submitter_email\`, \`created_at\`, \`updated_at\`) VALUES (${e.id}, ${e.organizer_id}, ${e.artist_id || 'NULL'}, ${e.category_id}, '${(e.event_name || '').replace(/'/g, "\\'")}', '${(e.description || '').replace(/'/g, "\\'")}', '${e.event_date}', '${e.start_time}', ${e.end_time ? `'${e.end_time}'` : 'NULL'}, '${(e.venue_name || '').replace(/'/g, "\\'")}', '${(e.address || '').replace(/'/g, "\\'")}', '${(e.city || '').replace(/'/g, "\\'")}', '${(e.state || '').replace(/'/g, "\\'")}', '${(e.ticket_info || '').replace(/'/g, "\\'")}', '${(e.event_rules || '').replace(/'/g, "\\'")}', '${e.official_url || ''}', '${e.poster_image || ''}', '${e.event_status}', '${e.verification_status}', ${e.rejection_reason ? `'${e.rejection_reason.replace(/'/g, "\\'")}'` : 'NULL'}, '${e.tracking_code}', '${(e.submitter_name || '').replace(/'/g, "\\'")}', '${e.submitter_email || ''}', '${e.created_at || '2026-09-21 09:06:15'}', '${e.updated_at || '2026-09-21 09:06:15'}');`).join('\n')}

-- --------------------------------------------------------
-- 6. Table structure for \`saved_events\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`saved_events\`;
CREATE TABLE \`saved_events\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`event_id\` INT NOT NULL,
  \`saved_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`user_event_unique\` (\`user_id\`, \`event_id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Table structure for \`event_chat_messages\` (Event Public Forum & Q&A)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`event_chat_messages\`;
CREATE TABLE \`event_chat_messages\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`event_id\` INT NOT NULL,
  \`user_id\` INT NOT NULL,
  \`message\` TEXT NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

${chats.map(cm => `INSERT INTO \`event_chat_messages\` (\`id\`, \`event_id\`, \`user_id\`, \`message\`, \`created_at\`) VALUES (${cm.id}, ${cm.event_id}, ${cm.user_id}, '${(cm.message || '').replace(/'/g, "\\'")}', '${cm.created_at}');`).join('\n')}

-- --------------------------------------------------------
-- 8. Table structure for \`reports\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`reports\`;
CREATE TABLE \`reports\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT,
  \`event_id\` INT,
  \`report_type\` VARCHAR(50) DEFAULT 'EVENT',
  \`reason\` VARCHAR(255) NOT NULL,
  \`details\` TEXT,
  \`status\` VARCHAR(30) DEFAULT 'PENDING',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Table structure for \`activity_logs\` (Administrative Audit Trail)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`activity_logs\`;
CREATE TABLE \`activity_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT,
  \`action\` VARCHAR(50) NOT NULL,
  \`target_type\` VARCHAR(50),
  \`target_id\` INT,
  \`details\` TEXT,
  \`ip_address\` VARCHAR(50),
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Table structure for \`notifications\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`notifications\`;
CREATE TABLE \`notifications\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`link\` VARCHAR(255),
  \`is_read\` TINYINT(1) DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
`;

  fs.writeFileSync('database/hostinger_mysql_schema.sql', sql, 'utf8');
  console.log('✓ Successfully generated clean 10-table Hostinger MySQL schema!');
}

generate().catch(console.error);
