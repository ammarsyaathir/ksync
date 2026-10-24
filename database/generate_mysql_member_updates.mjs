import fs from 'fs';
import db from '../config/database.js';

async function generate() {
  const members = await db.query('SELECT m.id, m.stage_name, m.birth_name, m.group_name, m.position, m.dob, m.zodiac, m.height_cm, m.blood_type, m.mbti, m.nationality, m.debut_year, m.photo, m.is_active, m.sort_order, a.slug as artist_slug FROM members m JOIN artists a ON m.artist_id = a.id ORDER BY a.id, m.sort_order');
  
  let baseSql = fs.readFileSync('database/hostinger_mysql_artists_slug_migration.sql', 'utf8');
  // strip existing section 4 if already present
  if (baseSql.includes('-- 4. Sync All 120 Member')) {
    baseSql = baseSql.split('-- 4. Sync All 120 Member')[0].trim() + '\n';
  }
  
  let appendSql = '\n-- 4. Sync All 120 Member Local Portrait Images\n';
  for (const m of members) {
    const escPhoto = m.photo ? `'${m.photo}'` : 'NULL';
    const escStage = m.stage_name.replace(/'/g, "\\'");
    appendSql += `UPDATE \`members\` m JOIN \`artists\` a ON m.artist_id = a.id SET m.photo = ${escPhoto} WHERE a.slug = '${m.artist_slug}' AND m.stage_name = '${escStage}';\n`;
  }

  // Also include full INSERT IGNORE statements so if members table is completely empty on Hostinger, it gets populated
  appendSql += '\n-- 5. Seed Members if Table is Fresh\n';
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

    appendSql += `INSERT INTO \`members\` (\`artist_id\`, \`stage_name\`, \`birth_name\`, \`group_name\`, \`position\`, \`dob\`, \`zodiac\`, \`height_cm\`, \`blood_type\`, \`mbti\`, \`nationality\`, \`debut_year\`, \`photo\`, \`is_active\`, \`sort_order\`) ` +
      `SELECT a.id, '${escStage}', ${escBirth}, ${escGroup}, ${escPos}, ${escDob}, ${escZodiac}, ${escHeight}, ${escBlood}, ${escMbti}, ${escNat}, ${escDebut}, ${escPhoto}, 1, ${m.sort_order} ` +
      `FROM \`artists\` a WHERE a.slug = '${m.artist_slug}' ` +
      `ON DUPLICATE KEY UPDATE \`photo\` = VALUES(\`photo\`), \`position\` = VALUES(\`position\`);\n`;
  }

  fs.writeFileSync('database/hostinger_mysql_artists_slug_migration.sql', baseSql + appendSql, 'utf8');
  console.log('✅ Generated hostinger_mysql_artists_slug_migration.sql with 120 member updates and seed statements!');
  process.exit(0);
}

generate();
