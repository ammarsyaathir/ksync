import fs from 'fs';
import db from '../config/database.js';

async function generate() {
  const artists = await db.query('SELECT * FROM artists ORDER BY id');
  const members = await db.query('SELECT m.*, a.slug as artist_slug FROM members m JOIN artists a ON m.artist_id = a.id ORDER BY a.id, m.sort_order');

  console.log(`Found ${artists.length} artists and ${members.length} members in SQLite.`);

  let sql = `-- ============================================================================
-- K-Sync Malaysia: Full 20 Artists & 120 Members Sync for Hostinger MySQL
-- Run this in phpMyAdmin on Hostinger, or let config/database.js auto-run it.
-- ============================================================================

-- 1. Ensure required columns exist in artists table
ALTER TABLE \`artists\` ADD COLUMN IF NOT EXISTS \`slug\` VARCHAR(100) NULL AFTER \`name\`;
ALTER TABLE \`artists\` ADD COLUMN IF NOT EXISTS \`debut_year\` INT NULL AFTER \`agency\`;
ALTER TABLE \`artists\` ADD COLUMN IF NOT EXISTS \`fandom_name\` VARCHAR(100) NULL AFTER \`debut_year\`;
ALTER TABLE \`artists\` ADD COLUMN IF NOT EXISTS \`header_image\` VARCHAR(255) NULL AFTER \`image_url\`;

-- 2. Upsert the 20 Official Malaysia Touring Artists
`;

  const validSlugs = artists.map(a => `'${a.slug}'`).join(', ');

  for (const a of artists) {
    const escName = a.name.replace(/'/g, "\\'");
    const escType = a.group_type ? `'${a.group_type.replace(/'/g, "\\'")}'` : "'Boy Group'";
    const escAgency = a.agency ? `'${a.agency.replace(/'/g, "\\'")}'` : 'NULL';
    const escDebut = a.debut_year || 'NULL';
    const escFandom = a.fandom_name ? `'${a.fandom_name.replace(/'/g, "\\'")}'` : 'NULL';
    const escImage = a.image_url ? `'${a.image_url.replace(/'/g, "\\'")}'` : 'NULL';
    const escHeader = a.header_image ? `'${a.header_image.replace(/'/g, "\\'")}'` : (a.image_url ? `'${a.image_url.replace(/'/g, "\\'")}'` : 'NULL');
    const escDesc = a.description ? `'${a.description.replace(/'/g, "\\'")}'` : 'NULL';

    sql += `INSERT INTO \`artists\` (\`id\`, \`name\`, \`slug\`, \`group_type\`, \`agency\`, \`debut_year\`, \`fandom_name\`, \`image_url\`, \`header_image\`, \`description\`)
VALUES (${a.id}, '${escName}', '${a.slug}', ${escType}, ${escAgency}, ${escDebut}, ${escFandom}, ${escImage}, ${escHeader}, ${escDesc})
ON DUPLICATE KEY UPDATE
  \`name\` = VALUES(\`name\`),
  \`slug\` = VALUES(\`slug\`),
  \`group_type\` = VALUES(\`group_type\`),
  \`agency\` = VALUES(\`agency\`),
  \`debut_year\` = VALUES(\`debut_year\`),
  \`fandom_name\` = VALUES(\`fandom_name\`),
  \`image_url\` = VALUES(\`image_url\`),
  \`header_image\` = VALUES(\`header_image\`),
  \`description\` = VALUES(\`description\`);\n`;
  }

  sql += `\n-- 3. Prune any legacy artists not in the 20 official Malaysia roster
DELETE FROM \`artists\` WHERE \`slug\` NOT IN (${validSlugs}) AND \`id\` NOT IN (${artists.map(a => a.id).join(', ')});\n`;

  sql += `\n-- 4. Ensure members table exists in MySQL
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`;

  sql += `\n-- 5. Upsert All 120 Members with Local Portrait Photos
`;

  for (const m of members) {
    const escStage = m.stage_name.replace(/'/g, "\\'");
    const escBirth = m.birth_name ? `'${m.birth_name.replace(/'/g, "\\'")}'` : 'NULL';
    const escGroup = m.group_name ? `'${m.group_name.replace(/'/g, "\\'")}'` : 'NULL';
    const escPos = m.position ? `'${m.position.replace(/'/g, "\\'")}'` : 'NULL';
    const escDob = m.dob ? `'${m.dob}'` : 'NULL';
    const escZodiac = m.zodiac ? `'${m.zodiac}'` : 'NULL';
    const escHeight = m.height_cm || 'NULL';
    const escBlood = m.blood_type ? `'${m.blood_type}'` : 'NULL';
    const escMbti = m.mbti ? `'${m.mbti}'` : 'NULL';
    const escNat = m.nationality ? `'${m.nationality.replace(/'/g, "\\'")}'` : 'NULL';
    const escDebut = m.debut_year || 'NULL';
    const escPhoto = m.photo ? `'${m.photo}'` : 'NULL';

    sql += `INSERT INTO \`members\` (\`artist_id\`, \`stage_name\`, \`birth_name\`, \`group_name\`, \`position\`, \`dob\`, \`zodiac\`, \`height_cm\`, \`blood_type\`, \`mbti\`, \`nationality\`, \`debut_year\`, \`photo\`, \`is_active\`, \`sort_order\`)
SELECT a.id, '${escStage}', ${escBirth}, ${escGroup}, ${escPos}, ${escDob}, ${escZodiac}, ${escHeight}, ${escBlood}, ${escMbti}, ${escNat}, ${escDebut}, ${escPhoto}, 1, ${m.sort_order}
FROM \`artists\` a WHERE a.slug = '${m.artist_slug}'
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
  \`sort_order\` = VALUES(\`sort_order\`);\n`;
  }

  sql += `\n-- 6. Remove orphaned members
DELETE FROM \`members\` WHERE \`artist_id\` NOT IN (SELECT \`id\` FROM \`artists\`);\n`;

  fs.writeFileSync('database/hostinger_mysql_artists_slug_migration.sql', sql, 'utf8');
  console.log('✅ Generated database/hostinger_mysql_artists_slug_migration.sql with all 20 artists and 120 members!');

  // Also write a standalone JS module that exports this data for config/database.js to auto-run
  const jsData = `// Auto-generated 20 artists & 120 members dataset for MySQL auto-migration
export const OFFICIAL_20_ARTISTS = ${JSON.stringify(artists, null, 2)};

export const OFFICIAL_120_MEMBERS = ${JSON.stringify(members, null, 2)};
`;
  fs.writeFileSync('database/official_20_artists_data.js', jsData, 'utf8');
  console.log('✅ Generated database/official_20_artists_data.js');

  // Also update database/hostinger_mysql_schema.sql
  let schema = fs.readFileSync('database/hostinger_mysql_schema.sql', 'utf8');
  let artistsSql = 'DROP TABLE IF EXISTS `artists`;\nCREATE TABLE `artists` (\n  `id` INT AUTO_INCREMENT PRIMARY KEY,\n  `name` VARCHAR(100) NOT NULL,\n  `slug` VARCHAR(100) DEFAULT NULL,\n  `korean_name` VARCHAR(100) DEFAULT NULL,\n  `group_type` VARCHAR(50) DEFAULT \'Boy Group\',\n  `agency` VARCHAR(100),\n  `debut_year` INT DEFAULT NULL,\n  `fandom_name` VARCHAR(100) DEFAULT NULL,\n  `image_url` VARCHAR(255),\n  `header_image` VARCHAR(255),\n  `description` TEXT,\n  `members` LONGTEXT,\n  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n';
  
  for (const a of artists) {
    const escName = a.name.replace(/'/g, "\\'");
    const escType = a.group_type ? `'${a.group_type.replace(/'/g, "\\'")}'` : "'Boy Group'";
    const escAgency = a.agency ? `'${a.agency.replace(/'/g, "\\'")}'` : 'NULL';
    const escDebut = a.debut_year || 'NULL';
    const escFandom = a.fandom_name ? `'${a.fandom_name.replace(/'/g, "\\'")}'` : 'NULL';
    const escImage = a.image_url ? `'${a.image_url.replace(/'/g, "\\'")}'` : 'NULL';
    const escHeader = a.header_image ? `'${a.header_image.replace(/'/g, "\\'")}'` : 'NULL';
    const escDesc = a.description ? `'${a.description.replace(/'/g, "\\'")}'` : 'NULL';
    artistsSql += `INSERT INTO \`artists\` (\`id\`, \`name\`, \`slug\`, \`group_type\`, \`agency\`, \`debut_year\`, \`fandom_name\`, \`image_url\`, \`header_image\`, \`description\`) VALUES (${a.id}, '${escName}', '${a.slug}', ${escType}, ${escAgency}, ${escDebut}, ${escFandom}, ${escImage}, ${escHeader}, ${escDesc});\n`;
  }
  
  const startIdx = schema.indexOf('DROP TABLE IF EXISTS `artists`;');
  const endIdx = schema.indexOf('DROP TABLE IF EXISTS `members`;');
  if (startIdx !== -1 && endIdx !== -1) {
    schema = schema.substring(0, startIdx) + artistsSql + '\n' + schema.substring(endIdx);
    fs.writeFileSync('database/hostinger_mysql_schema.sql', schema, 'utf8');
    console.log('✅ Updated database/hostinger_mysql_schema.sql with all 20 artists!');
  }

  process.exit(0);
}

generate();
