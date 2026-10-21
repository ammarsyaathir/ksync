/* perf/migrate-members-sqlite.mjs

   Migrates the LOCAL database/ksync.db to the normalised `members` table:

     1. creates `members` (FK -> artists.id, UNIQUE(artist_id, stage_name))
     2. re-syncs `artists.members` JSON for the 9 artists curated in
        perf/artists-data.mjs, so local dev data matches production MySQL
     3. unpacks every artist's JSON biodata into `members` rows
        (INSERT OR IGNORE -> safe to re-run)

   Run:  node perf/migrate-members-sqlite.mjs                                        */
import Database from 'better-sqlite3';
import fs from 'node:fs';
import { ARTIST_OVERRIDES } from './artists-data.mjs';
import { memberRow, SQLITE_MEMBERS_DDL, MEMBER_COLUMNS } from './members-util.mjs';

const DB_FILE = process.env.SQLITE_DB_PATH || 'database/ksync.db';
if (!fs.existsSync(DB_FILE)) { console.error(`No database at ${DB_FILE}`); process.exit(1); }

const db = new Database(DB_FILE);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// ---------- 1. table ----------
const before = db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='members'").get().c;
db.exec(SQLITE_MEMBERS_DDL);
console.log(`1. members table ${before ? 'already present' : 'created'}`);

// ---------- 2. re-sync artists.members JSON from the curated module ----------
let synced = [];
const upd = db.prepare('UPDATE artists SET members = ? WHERE name = ? AND (members IS NULL OR members <> ?)');
for (const [name, ov] of Object.entries(ARTIST_OVERRIDES)) {
  const json = JSON.stringify(ov.members);
  const res = upd.run(json, name, json);
  if (res.changes > 0) synced.push(`${name} (${ov.members.length})`);
}
console.log(synced.length ? `2. artists.members JSON re-synced: ${synced.join(', ')}` : '2. artists.members JSON already in sync');

// ---------- 3. unpack JSON -> members rows ----------
const artists = db.prepare('SELECT id, name, members FROM artists ORDER BY id').all();
const ins = db.prepare(
  `INSERT OR IGNORE INTO members (artist_id, ${MEMBER_COLUMNS.join(', ')})
   VALUES (?${', ?'.repeat(MEMBER_COLUMNS.length)})`
);
let inserted = 0, skipped = 0, badJson = [];
const run = db.transaction(() => {
  for (const a of artists) {
    if (!a.members) continue;
    let list;
    try { list = JSON.parse(a.members); } catch (e) { badJson.push(`${a.name}: ${e.message}`); continue; }
    if (!Array.isArray(list)) continue;
    list.forEach((m, i) => {
      const r = memberRow(m, i + 1);
      if (!r.stage_name) { skipped++; return; }
      const args = [a.id, ...MEMBER_COLUMNS.map((c) => r[c])];
      const res = ins.run(...args);
      if (res.changes > 0) inserted++; else skipped++;
    });
  }
});
run();
console.log(`3. unpacked: ${inserted} inserted, ${skipped} already present / skipped`);
if (badJson.length) console.log(`   invalid JSON: ${badJson.join(' | ')}`);

// ---------- 4. validate ----------
const total = db.prepare('SELECT COUNT(*) c FROM members').get().c;
const orphans = db.prepare('SELECT COUNT(*) c FROM members m LEFT JOIN artists a ON a.id = m.artist_id WHERE a.id IS NULL').get().c;
const nullStage = db.prepare('SELECT COUNT(*) c FROM members WHERE stage_name IS NULL').get().c;
const fk = db.pragma('foreign_key_check').length;
const emptyDob = db.prepare('SELECT COUNT(*) c FROM members WHERE dob IS NOT NULL AND dob NOT GLOB \'[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]\'').get().c;
console.log(`\n4. validation: total=${total} orphans=${orphans} null stage_name=${nullStage} FK violations=${fk} bad dob format=${emptyDob}`);

// count cross-check: members rows vs the JSON arrays they came from
let expected = 0;
for (const a of db.prepare('SELECT members FROM artists').all()) {
  if (!a.members) continue;
  try { const l = JSON.parse(a.members); if (Array.isArray(l)) expected += l.length; } catch (e) {}
}
console.log(`   expected (JSON arrays) = ${expected} vs table rows = ${total} ${expected === total ? 'OK' : 'MISMATCH'}`);

console.log('\nby artist:');
console.table(db.prepare(`SELECT a.id, a.name AS artist, COUNT(m.id) AS members FROM artists a LEFT JOIN members m ON m.artist_id = a.id GROUP BY a.id ORDER BY a.id`).all());

console.log('nullable fields that are NULL (TBC in the source, never invented):');
console.table(db.prepare(`SELECT
  SUM(dob IS NULL) AS dob, SUM(height_cm IS NULL) AS height, SUM(blood_type IS NULL) AS blood,
  SUM(mbti IS NULL) AS mbti, SUM(nationality IS NULL) AS nationality, SUM(debut_year IS NULL) AS debut,
  SUM(photo IS NULL) AS photo, SUM(position IS NULL) AS position FROM members`).get());

console.log('sample:');
console.table(db.prepare('SELECT id, artist_id, stage_name, group_name, dob, height_cm, blood_type, mbti, nationality, debut_year FROM members ORDER BY id LIMIT 8').all());
db.close();
