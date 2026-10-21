/* Quote-aware re-test: simulates a paste that collapses line breaks,
   the way the clipboard/phpMyAdmin box mangled it.
   A) collapsed, comments kept  -> what the user pasted
   B) collapsed, comments stripped -> what we want to work */
import Database from 'better-sqlite3';
import fs from 'node:fs';

const raw = fs.readFileSync('database/seed_kpop_2026_2027_mysql.sql', 'utf8');

function mirror() {
  const db = new Database(':memory:');
  db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL DEFAULT 'FAN', full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, bio TEXT,
    organization_name TEXT, organization_type TEXT, social_handle TEXT, social_url TEXT, location TEXT,
    status TEXT DEFAULT 'ACTIVE', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, group_type TEXT, agency TEXT,
    description TEXT, created_at TEXT);
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

// split on ';' only when not inside a quoted string (handles '' escapes and backslash escapes)
function splitStatements(t) {
  const out = []; let cur = ''; let q = null;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    cur += c;
    if (q) {
      if (c === '\\') { cur += t[++i] ?? ''; continue; }
      if (c === q) {
        if (t[i + 1] === q) { cur += t[++i]; continue; } // doubled quote
        q = null;
      }
    } else if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === ';') { out.push(cur.slice(0, -1)); cur = ''; }
  }
  if (cur.trim()) out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

const collapse = (s) => s.replace(/\s+/g, ' ').trim();
const stripComments = (s) => s.split(/\r?\n/).filter((l) => !/^\s*--/.test(l)).join('\n');

for (const [label, text] of [
  ['A) collapsed, comments KEPT  (exactly what you pasted)', collapse(raw)],
  ["B) collapsed, comments STRIPPED", collapse(stripComments(raw))]
]) {
  const db = mirror();
  const stmts = splitStatements(text).map((s) =>
    s.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO').replace(/^SET\s+NAMES\s+\w+/i, ''));
  let ok = 0, err = null;
  for (const st of stmts) { if (!st) continue; try { db.exec(st); ok++; } catch (e) { err = e.message; break; } }
  const n = db.prepare("SELECT COUNT(*) c FROM events WHERE event_date >= '2026-10-18'").get().c;
  const u = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  console.log(`\n${label}\n  statements found: ${stmts.length}   executed OK: ${ok}   events inserted: ${n}   users: ${u}`);
  if (err) console.log(`  -> ERROR: ${err}`);
}
console.log('\n(first 90 chars of the collapsed paste):');
console.log('  ' + JSON.stringify(collapse(raw).slice(0, 90)));
