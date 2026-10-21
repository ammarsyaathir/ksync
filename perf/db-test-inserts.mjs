/* Empirically test the exact INSERT statements the app runs, on a COPY of the DB. */
import Database from 'better-sqlite3';
import { copyFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = join(tmpdir(), 'ksync-dbtest-' + Date.now());
mkdirSync(dir, { recursive: true });
for (const ext of ['', '-wal', '-shm']) {
  const src = 'database/ksync.db' + ext;
  if (existsSync(src)) copyFileSync(src, join(dir, 'ksync.db' + ext));
}
const db = new Database(join(dir, 'ksync.db'));

const run = (label, sql, params) => {
  try {
    const info = db.prepare(sql).run(...params);
    console.log(`  PASS  ${label}  -> changes=${info.changes} id=${info.lastInsertRowid}`);
    return true;
  } catch (e) {
    console.log(`  FAIL  ${label}  -> ${e.message}`);
    return false;
  }
};

console.log('foreign_keys pragma =', db.prepare('PRAGMA foreign_keys').get().foreign_keys);

console.log('\n[1] helpers.createNotification  PRIMARY insert (helpers.js:249)');
run('primary  (user_id, event_id, message, is_read, created_at)', 
  'INSERT INTO notifications (user_id, event_id, message, is_read, created_at) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)',
  [1, 1, 'test notification']);

console.log('\n[2] helpers.createNotification  FALLBACK insert (helpers.js:256)');
run('fallback (user_id, title, message, link, is_read, created_at)',
  'INSERT INTO notifications (user_id, title, message, link, is_read, created_at) VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)',
  [1, 'Title', 'test', '/events/1']);

console.log('\n[3] helpers.logActivity insert (helpers.js:145-148)');
run('activity_logs (user_id, action, entity_type, entity_id, description, ip_address)',
  'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
  [1, 'TEST', 'event', 1, 'test log', '127.0.0.1']);

console.log('\n[4] auth middleware user query (auth.js:21-25)');
try {
  const u = db.prepare(`SELECT u.*, COALESCE(u.role, 'FAN') as role, COALESCE(u.role, 'FAN') as role_name FROM users u WHERE u.id = ?`).get(1);
  console.log('  PASS  returned columns:', Object.keys(u || {}).length);
} catch (e) { console.log('  FAIL  ->', e.message); }

console.log('\n[5] reminder lookup LIKE query (helpers.js:339)');
try {
  const r = db.prepare("SELECT id FROM notifications WHERE user_id = ? AND event_id = ? AND message LIKE ? AND created_at LIKE ?").get(1, 1, '%D-7%', '2026-10-18%');
  console.log('  PASS  rows:', r ? 1 : 0);
} catch (e) { console.log('  FAIL  ->', e.message); }

console.log('\n[6] Does the broken FK actually block a notification insert with NULL update_id?');
console.log('  (test 1 above inserted with update_id omitted = NULL)');

db.close();
rmSync(dir, { recursive: true, force: true });
