/* Writes database/seed_kpop_2026_2027_mysql_plain.sql:
   identical to the main seed file but with ALL `--` comment lines removed,
   so it still executes correctly even if a paste box collapses line breaks.
   Then verifies the plain version by running it fully collapsed. */
import fs from 'node:fs';
import Database from 'better-sqlite3';

const src = 'database/seed_kpop_2026_2027_mysql.sql';
const out = 'database/seed_kpop_2026_2027_mysql_plain.sql';
const raw = fs.readFileSync(src, 'utf8');

const plain = raw
  .split(/\r?\n/)
  .filter((l) => !/^\s*--/.test(l))
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

fs.writeFileSync(out, plain + '\n', 'utf8');
console.log(`wrote ${out}  (${plain.split('\n').length} lines, ${plain.length} bytes)`);

// ---- verify: run the plain file fully collapsed on one line ----
function mirror() {
  const db = new Database(':memory:');
  db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL DEFAULT 'FAN', full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, bio TEXT,
    organization_name TEXT, organization_type TEXT, social_handle TEXT, social_url TEXT, location TEXT,
    status TEXT DEFAULT 'ACTIVE', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, group_type TEXT, agency TEXT, description TEXT, created_at TEXT);
  CREATE TABLE event_categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL);
  CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT, organizer_id INTEGER, artist_id INTEGER, category_id INTEGER NOT NULL,
    event_name TEXT NOT NULL, slug TEXT, description TEXT, event_date TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT,
    venue_name TEXT NOT NULL, address TEXT, city TEXT NOT NULL, state TEXT NOT NULL, ticket_info TEXT, event_rules TEXT,
    official_url TEXT, poster_image TEXT, gallery_images TEXT, event_status TEXT, verification_status TEXT, trust_level TEXT,
    rejection_reason TEXT, admin_verification_notes TEXT, tracking_code TEXT UNIQUE, submitter_name TEXT, submitter_email TEXT,
    evidence_link TEXT, organizer_name TEXT, organizer_social_url TEXT, organizer_type TEXT, created_at TEXT, updated_at TEXT);
  INSERT INTO users (id, role, full_name, username, email, password_hash) VALUES (1,'ADMIN','A','admin','admin@ksync.my','h');
  INSERT INTO artists (id,name,group_type) VALUES (6,'TOMORROW X TOGETHER (TXT)','Boy Group');
  INSERT INTO event_categories (id,name,slug) VALUES (1,'Concert','concert'),(2,'Fan Meeting','fan-meeting'),(3,'Festival','festival'),(4,'Cupsleeve Event','cupsleeve'),(7,'Pop-up Event','pop-up-event');
  `);
  return db;
}
function splitStatements(t) {
  const out = []; let cur = ''; let q = null;
  for (let i = 0; i < t.length; i++) {
    const c = t[i]; cur += c;
    if (q) { if (c === '\\') { cur += t[++i] ?? ''; continue; } if (c === q) { if (t[i + 1] === q) { cur += t[++i]; continue; } q = null; } }
    else if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === ';') { out.push(cur.slice(0, -1)); cur = ''; }
  }
  if (cur.trim()) out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

const db = mirror();
const stmts = splitStatements(plain.replace(/\s+/g, ' ')).map((s) =>
  s.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO').replace(/^SET\s+NAMES\s+\w+/i, ''));
let ok = 0;
for (const st of stmts) { if (!st) continue; try { db.exec(st); ok++; } catch (e) { console.log('FAIL: ' + e.message); process.exit(1); } }
console.log(`collapsed paste of the plain file: ${ok}/${stmts.length} statements OK, ` +
  `events>=2026-10-18 = ${db.prepare("SELECT COUNT(*) c FROM events WHERE event_date >= '2026-10-18'").get().c}`);
db.close();
