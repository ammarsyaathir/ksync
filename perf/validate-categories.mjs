/* Validates database/update_event_categories_mysql.sql against the user's
   actual live rows (ids 1-4: Concert / Fan Meeting / Festival / Cupsleeve).
   Runs it twice to prove idempotency. */
import Database from 'better-sqlite3';
import fs from 'node:fs';

const sql = fs.readFileSync('database/update_event_categories_mysql.sql', 'utf8');
const db = new Database(':memory:');
db.exec(`CREATE TABLE event_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL,
  badge_color TEXT DEFAULT 'purple', description TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
db.exec(`INSERT INTO event_categories (id,name,slug,badge_color,description) VALUES
 (1,'Concert','concert','pink','Full-scale live stadium and arena concert tours.'),
 (2,'Fan Meeting','fan-meeting','purple','Intimate stage sessions, hi-touch, and interactive...'),
 (3,'Festival','festival','indigo','Multi-artist K-pop celebrations, music bank, and o...'),
 (4,'Cupsleeve Event','cupsleeve','amber','Fanbase cafe gatherings, photo exhibitions, and an...');`);

const stmts = sql.split(/;\s*(?:\r?\n|$)/).map((s) => s.replace(/^\s*--.*$/gm, '').trim()).filter(Boolean);
console.log(`statements: ${stmts.length}`);

for (const pass of [1, 2]) {
  for (const st of stmts) { try { db.exec(st); } catch (e) { console.log(`PASS ${pass} FAIL: ${e.message}`); process.exit(1); } }
  console.log(`  pass ${pass}: ${db.prepare('SELECT COUNT(*) c FROM event_categories').get().c} categories`);
}
console.log('\n=== final event_categories ===');
console.table(db.prepare('SELECT id, name, slug, badge_color, description FROM event_categories ORDER BY id').all());
db.close();
