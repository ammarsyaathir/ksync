/* Validates database/seed_kpop_2026_2027_mysql.sql.
   Builds SQLite tables that mirror the EXACT MySQL column list from
   database/hostinger_mysql_schema.sql, then executes the .sql file twice
   to prove (a) it runs and (b) it is idempotent.
   MySQL-only syntax is translated: INSERT IGNORE -> INSERT OR IGNORE. */
import Database from 'better-sqlite3';
import fs from 'node:fs';

const sqlText = fs.readFileSync('database/seed_kpop_2026_2027_mysql.sql', 'utf8');

const db = new Database(':memory:');
db.exec(`
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL DEFAULT 'FAN', full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, bio TEXT,
  profile_image TEXT, organization_name TEXT, organization_type TEXT DEFAULT 'Fanclub',
  social_handle TEXT, social_url TEXT, location TEXT DEFAULT 'Kuala Lumpur', status TEXT DEFAULT 'ACTIVE',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, korean_name TEXT, group_type TEXT DEFAULT 'Boy Group',
  agency TEXT, debut_year INTEGER, image_url TEXT, description TEXT, members TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE event_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL,
  badge_color TEXT DEFAULT 'purple', description TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, organizer_id INTEGER DEFAULT NULL, artist_id INTEGER,
  category_id INTEGER NOT NULL, event_name TEXT NOT NULL, slug TEXT, description TEXT,
  event_date TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT, venue_name TEXT NOT NULL,
  address TEXT, city TEXT NOT NULL, state TEXT NOT NULL, ticket_info TEXT, event_rules TEXT,
  official_url TEXT, poster_image TEXT, gallery_images TEXT, event_status TEXT DEFAULT 'UPCOMING',
  verification_status TEXT DEFAULT 'PENDING', trust_level TEXT DEFAULT 'PENDING', rejection_reason TEXT,
  admin_verification_notes TEXT, tracking_code TEXT UNIQUE, submitter_name TEXT, submitter_email TEXT,
  evidence_link TEXT, organizer_name TEXT, organizer_social_url TEXT, organizer_type TEXT DEFAULT 'Fanclub',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES event_categories(id) ON DELETE RESTRICT);
`);

// pre-existing production rows (ids 1-5 users, 1-8 artists, 1-8 categories, event 1)
db.exec(`
INSERT INTO users (id, role, full_name, username, email, password_hash) VALUES
 (1,'ADMIN','System Admin','admin','admin@ksync.my','h'),(2,'ORGANIZER','Starline Events Malaysia','starline','organizer@ksync.my','h'),
 (3,'FAN','Aiman K-Pop Fan','aiman_carat','fan@ksync.my','h'),(4,'ADMIN','Ammar Syaathir','ammarsyaathir','ammarsyaathir@gmail.com','h'),
 (5,'FAN','Google Test Fan','kpopfan_google_test','kpopfan_google_test@gmail.com','h');
INSERT INTO artists (id, name, group_type, agency) VALUES
 (1,'SEVENTEEN','Boy Group','PLEDIS'),(2,'TWICE','Girl Group','JYP'),(3,'IU (Lee Ji-eun)','Soloist','EDAM'),
 (4,'ENHYPEN','Boy Group','BELIFT'),(5,'IVE','Girl Group','Starship'),(6,'TOMORROW X TOGETHER (TXT)','Boy Group','BIGHIT'),
 (7,'Stray Kids','Boy Group','JYP'),(8,'aespa','Girl Group','SM');
INSERT INTO event_categories (id, name, slug) VALUES
 (1,'Concert','concert'),(2,'Fan Meeting','fan-meeting'),(3,'Festival','festival'),
 (4,'Cupsleeve Event','cupsleeve'),(7,'Pop-up Event','pop-up-event');
INSERT INTO events (id, organizer_id, artist_id, category_id, event_name, event_date, start_time, venue_name, city, state, verification_status)
 VALUES (1,2,6,1,'TXT (TOMORROW X TOGETHER) WORLD TOUR IN KUALA LUMPUR','2026-12-12','19:30:00','Zepp Kuala Lumpur','Kuala Lumpur','W.P. Kuala Lumpur','VERIFIED');
`);

// Split the file into statements (naive: split on ';' at end of line), translate MySQL-isms
const statements = sqlText
  .split(/;\s*(?:\r?\n|$)/)
  .map((s) => s.replace(/^\s*--.*$/gm, '').trim())
  .filter(Boolean)
  .map((s) => s.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO').replace(/SET\s+NAMES\s+\w+/gi, ''))
  .filter((s) => s.trim().length > 0);

console.log(`statements: ${statements.length}\n`);

for (const pass of [1, 2]) {
  console.log(`--- PASS ${pass} ---`);
  for (const st of statements) {
    try { db.exec(st); }
    catch (e) { console.log('FAILED STATEMENT:\n' + st.split('\n').slice(0, 6).join('\n') + '\n  -> ' + e.message); process.exit(1); }
  }
  const n = db.prepare("SELECT COUNT(*) c FROM events WHERE event_date >= '2026-10-18'").get().c;
  const u = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  const a = db.prepare('SELECT COUNT(*) c FROM artists').get().c;
  console.log(`  events>=2026-10-18: ${n}   users: ${u}   artists: ${a}`);
}

console.log('\n=== resulting events (18 Oct 2026 → 2027) ===');
console.table(db.prepare(`SELECT e.id, e.event_date, e.start_time AS time, substr(e.event_name,1,44) AS event_name,
  c.name AS category, e.organizer_name, e.verification_status
  FROM events e JOIN event_categories c ON c.id = e.category_id
  WHERE e.event_date >= '2026-10-18' ORDER BY e.event_date, e.start_time`).all());

console.log('=== organisers added ===');
console.table(db.prepare("SELECT id, username, email, organization_name, role FROM users WHERE username IN ('livenation_my','threeangles','ksync_imports')").all());
console.log('=== FK integrity ===');
console.log('  events with unresolvable organizer_id:', db.prepare('SELECT COUNT(*) c FROM events e WHERE e.organizer_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id=e.organizer_id)').get().c);
console.log('  events with unresolvable artist_id   :', db.prepare('SELECT COUNT(*) c FROM events e WHERE e.artist_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM artists a WHERE a.id=e.artist_id)').get().c);
console.log('  events with unresolvable category_id :', db.prepare('SELECT COUNT(*) c FROM events e WHERE NOT EXISTS (SELECT 1 FROM event_categories c WHERE c.id=e.category_id)').get().c);
db.close();
