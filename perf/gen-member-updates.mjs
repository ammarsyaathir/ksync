/* Emits database/update_artist_members_mysql.sql — UPDATE statements that replace
   the `members` column (and fix izna's description) with the full per-member bios.

   Works whether or not the artist rows already exist (it matches on name).
   Validates: JSON parses, every member has all 12 fields, and the SQL applies
   cleanly twice against a SQLite mirror of the live `artists` table. */
import Database from 'better-sqlite3';
import fs from 'node:fs';
import { ARTIST_OVERRIDES } from './artists-data.mjs';

const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
const FIELDS = ['stage_name', 'birth_name', 'group', 'position', 'dob', 'zodiac', 'height', 'blood_type', 'mbti', 'nationality', 'years_active', 'photo'];

let bad = 0;
for (const [artist, ov] of Object.entries(ARTIST_OVERRIDES)) {
  for (const m of ov.members) {
    const missing = FIELDS.filter((f) => !(f in m));
    const extra = Object.keys(m).filter((f) => !FIELDS.includes(f));
    if (missing.length || extra.length) { console.log(`SCHEMA PROBLEM ${artist} / ${m.stage_name}: missing=${missing} extra=${extra}`); bad++; }
  }
}
const totalMembers = Object.values(ARTIST_OVERRIDES).reduce((n, o) => n + o.members.length, 0);
console.log(`artists=${Object.keys(ARTIST_OVERRIDES).length} members=${totalMembers} schemaProblems=${bad}`);

const lines = [];
for (const [artist, ov] of Object.entries(ARTIST_OVERRIDES)) {
  const sets = [`\`members\` = ${q(JSON.stringify(ov.members))}`];
  if (ov.description) sets.push(`\`description\` = ${q(ov.description)}`);
  lines.push(`UPDATE \`artists\` SET ${sets.join(', ')} WHERE \`name\` = ${q(artist)};`);
}
lines.push('');
lines.push('SELECT `id`, `name`, CHAR_LENGTH(`members`) AS members_chars FROM `artists` ORDER BY `id`;');
const out = lines.join('\n') + '\n';
fs.writeFileSync('database/update_artist_members_mysql.sql', out, 'utf8');
console.log(`wrote database/update_artist_members_mysql.sql (${out.split('\n').length - 1} lines, ${out.length} chars)`);

// ---- validate against a SQLite mirror of the live artists table ----
const db = new Database(':memory:');
db.exec(`CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, korean_name TEXT, group_type TEXT,
  agency TEXT, debut_year INTEGER, image_url TEXT, description TEXT, members TEXT, created_at TEXT);
INSERT INTO artists (id,name,members) VALUES
 (1,'SEVENTEEN','[{"stage_name":"S.Coups"}]'),
 (7,'BTS (Bangtan Sonyeondan)','old'),(8,'BABYMONSTER','old'),(9,'izna','old'),
 (10,'wave to earth','old'),(11,'Young K (DAY6)','old'),(12,'The Rose','old'),
 (13,'Yves','old'),(14,'Yesung (SUPER JUNIOR)','old'),(15,'Lee Junho (2PM)','old');`);

const updateStmts = out.split(/;\s*(?:\r?\n|$)/).map((s) => s.trim()).filter((s) => s && !/^SELECT/i.test(s));
for (const pass of [1, 2]) {
  for (const st of updateStmts) { try { db.exec(st); } catch (e) { console.log(`PASS ${pass} FAIL: ${e.message}`); process.exit(1); } }
  const nulls = db.prepare("SELECT COUNT(*) c FROM artists WHERE members IS NULL OR members = 'old' OR members = ''").get().c;
  console.log(`  pass ${pass}: applied ${updateStmts.length} UPDATEs, rows still stale/null = ${nulls}`);
}

console.log('\nupdated rows:');
console.table(db.prepare('SELECT id, name, description IS NOT NULL AS has_desc, members FROM artists WHERE id > 1 ORDER BY id').all()
  .map((r) => ({ id: r.id, name: r.name, desc: r.has_desc, members: JSON.parse(r.members).length, first: JSON.parse(r.members)[0].stage_name })));

const all = db.prepare('SELECT name, members FROM artists WHERE id > 1').all();
let fieldOk = true;
for (const r of all) {
  for (const m of JSON.parse(r.members)) {
    const missing = FIELDS.filter((f) => !m[f]);
    if (missing.length) { fieldOk = false; console.log(`EMPTY ${r.name}/${m.stage_name}: ${missing.join(',')}`); }
  }
}
console.log(`every member has all 12 fields non-empty: ${fieldOk}`);
db.close();
