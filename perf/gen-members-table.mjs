/* Emits database/members_table_mysql.sql — creates a normalised `members` table
   (FK -> artists.id) and unpacks the per-member bios (perf/artists-data.mjs)
   into rows, resolving artist_id from `artists`.`name`.

   Comment-free and paste-safe. Idempotent via CREATE TABLE IF NOT EXISTS +
   INSERT IGNORE against UNIQUE(artist_id, stage_name).

   Validated against a SQLite mirror with foreign keys ON: applies twice, the
   same row count both times, no NULL artist_id, no orphans, no FK violations. */
import Database from 'better-sqlite3';
import fs from 'node:fs';
import { ARTIST_OVERRIDES } from './artists-data.mjs';
import { memberRow, MEMBER_COLUMNS, mysqlDdlToSqlite } from './members-util.mjs';

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`);

const CREATE = `CREATE TABLE IF NOT EXISTS \`members\` (
  \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
  \`artist_id\`   INT(11)      NOT NULL,
  \`stage_name\`  VARCHAR(100) NOT NULL,
  \`birth_name\`  VARCHAR(150) DEFAULT NULL,
  \`group_name\`  VARCHAR(100) DEFAULT NULL,
  \`position\`    VARCHAR(200) DEFAULT NULL,
  \`dob\`         DATE         DEFAULT NULL,
  \`zodiac\`      VARCHAR(20)  DEFAULT NULL,
  \`height_cm\`   DECIMAL(5,1) DEFAULT NULL,
  \`blood_type\`  VARCHAR(5)   DEFAULT NULL,
  \`mbti\`        VARCHAR(20)  DEFAULT NULL,
  \`nationality\` VARCHAR(50)  DEFAULT NULL,
  \`debut_year\`  INT(11)      DEFAULT NULL,
  \`photo\`       VARCHAR(255) DEFAULT NULL,
  \`is_active\`   TINYINT(1)   NOT NULL DEFAULT 1,
  \`sort_order\`  INT(11)      NOT NULL DEFAULT 0,
  \`created_at\`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_members_artist_stage\` (\`artist_id\`,\`stage_name\`),
  KEY \`idx_members_artist\` (\`artist_id\`),
  CONSTRAINT \`fk_members_artist\` FOREIGN KEY (\`artist_id\`) REFERENCES \`artists\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

// `is_active` is omitted so it takes its DEFAULT 1 (keeps the delivered SQL stable).
const INSERT_COLS = MEMBER_COLUMNS.filter((c) => c !== 'is_active');
const COLS = `(\`artist_id\`,${INSERT_COLS.map((c) => '`' + c + '`').join(',')})`;

const inserts = [];
for (const [artist, ov] of Object.entries(ARTIST_OVERRIDES)) {
  ov.members.forEach((m, i) => {
    const row = memberRow(m, i + 1);
    const vals = [q(row.stage_name), q(row.birth_name), q(row.group_name), q(row.position), q(row.dob), q(row.zodiac),
      row.height_cm === null ? 'NULL' : String(row.height_cm), q(row.blood_type), q(row.mbti), q(row.nationality),
      row.debut_year === null ? 'NULL' : String(row.debut_year), q(row.photo), row.sort_order];
    inserts.push(`INSERT IGNORE INTO \`members\` ${COLS}\nSELECT \`id\`, ${vals.join(', ')} FROM \`artists\` WHERE \`name\` = ${q(artist)};`);
  });
}

const out = [CREATE, '', ...inserts, '',
  'SELECT m.`id`, a.`name` AS artist, m.`stage_name`, m.`dob`, m.`height_cm`, m.`blood_type`, m.`mbti`',
  'FROM `members` m JOIN `artists` a ON a.`id` = m.`artist_id` ORDER BY a.`name`, m.`sort_order`;'
].join('\n') + '\n';

fs.writeFileSync('database/members_table_mysql.sql', out, 'utf8');
console.log(`wrote database/members_table_mysql.sql (${out.split('\n').length - 1} lines, ${out.length} chars, ${inserts.length} member rows)`);

// ---------- static checks on the emitted MySQL text ----------
let bad = 0;
const lines = out.split('\n');
if (lines.some((l) => l.length > 1500)) { bad++; console.log('FAIL: a line exceeds 1500 chars (paste/transcription risk)'); }
if (/^\s*--/m.test(out) || /\/\*/.test(out)) { bad++; console.log('FAIL: SQL comments present (collapsed paste swallows statements)'); }
if ((out.match(/INSERT IGNORE INTO/g) || []).length !== 31) { bad++; console.log('FAIL: expected 31 INSERT IGNORE statements'); }
if (!/FOREIGN KEY \(`artist_id`\) REFERENCES `artists` \(`id`\)/.test(out)) { bad++; console.log('FAIL: FK clause missing'); }
if (!/UNIQUE KEY `uniq_members_artist_stage` \(`artist_id`,`stage_name`\)/.test(out)) { bad++; console.log('FAIL: UNIQUE clause missing'); }
if ((out.match(/\(/g) || []).length !== (out.match(/\)/g) || []).length) { bad++; console.log('FAIL: unbalanced parentheses'); }
console.log(bad === 0 ? 'static checks: OK (31 inserts, no comments, longest line ' + Math.max(...lines.map((l) => l.length)) + ' chars)' : `static checks: ${bad} FAILED`);

// ---------- validate on a SQLite mirror with FKs on ----------
const db = new Database(':memory:');
db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE);
CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT, artist_id INTEGER);`);
const insA = db.prepare('INSERT INTO artists (name) VALUES (?)');
for (const a of Object.keys(ARTIST_OVERRIDES)) insA.run(a);

const stmts = out.split(/;\s*(?:\r?\n|$)/).map((s) => s.trim()).filter(Boolean).map((s) => {
  if (/^CREATE TABLE/.test(s)) return mysqlDdlToSqlite(s);
  return s.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO');
});
for (const pass of [1, 2]) {
  let failed = 0;
  for (const st of stmts) { try { db.exec(st); } catch (e) { failed++; console.log(`PASS ${pass} FAIL: ${e.message}\n  ${st.slice(0, 90)}`); } }
  const n = db.prepare('SELECT COUNT(*) c FROM members').get().c;
  console.log(`  pass ${pass}: statements=${stmts.length} failed=${failed} members=${n}`);
}

const orphans = db.prepare('SELECT COUNT(*) c FROM members m LEFT JOIN artists a ON a.id = m.artist_id WHERE a.id IS NULL').get().c;
const noArtist = db.prepare('SELECT COUNT(*) c FROM members WHERE artist_id IS NULL').get().c;
console.log(`orphans=${orphans}  null artist_id=${noArtist}  null stage_name=${db.prepare('SELECT COUNT(*) c FROM members WHERE stage_name IS NULL').get().c}  FK violations=${db.pragma('foreign_key_check').length}`);

console.log('\nby artist:');
console.table(db.prepare(`SELECT a.name AS artist, COUNT(m.id) AS members FROM artists a LEFT JOIN members m ON m.artist_id = a.id GROUP BY a.id ORDER BY a.id`).all());
console.table(db.prepare('SELECT id, stage_name, group_name, dob, height_cm, blood_type, mbti, nationality, debut_year FROM members ORDER BY artist_id, sort_order').all());
db.close();
