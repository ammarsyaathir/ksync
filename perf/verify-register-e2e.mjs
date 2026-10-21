/* End-to-end proof, using the app's OWN db connector, against a COPY of the live DB.
   The real database/ksync.db is never opened read-write. */
import { copyFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = join(tmpdir(), 'ksync-e2e-' + Date.now());
mkdirSync(dir, { recursive: true });
for (const ext of ['', '-wal', '-shm']) {
  if (existsSync('database/ksync.db' + ext)) copyFileSync('database/ksync.db' + ext, join(dir, 'ksync.db' + ext));
}

process.env.SQLITE_DB_PATH = join(dir, 'ksync.db');
process.env.NODE_ENV = 'development';

const { default: db } = await import('../config/database.js');

console.log('\n=== app connector says ===');
console.log('isMySQL:', db.isMySQL(), '| file:', process.env.SQLITE_DB_PATH);

const tryRun = async (label, fn) => {
  try {
    const r = await fn();
    console.log(`  PASS  ${label}  -> ${JSON.stringify(r)}`);
  } catch (e) {
    console.log(`  FAIL  ${label}  -> [${e.code || e.name}] ${e.message}`);
  }
};

// 1. EXACT registration insert from src/routes/auth.js:275
console.log('\n[1] registration  auth.js:275  (the real code path)');
await tryRun(
  "INSERT INTO users (role, full_name, username, email, password_hash, bio, status) VALUES ('FAN', ...)",
  () => db.execute(
    `INSERT INTO users (role, full_name, username, email, password_hash, bio, status)
     VALUES ('FAN', ?, ?, ?, ?, ?, 'ACTIVE')`,
    ['E2E Test', 'e2e_' + Date.now(), 'e2e@test.local', 'x', 'bio']
  )
);

// 2. Same insert but WITH role_id supplied -> should pass
console.log('\n[2] registration with role_id added  (the fix)');
await tryRun(
  "INSERT INTO users (role_id, role, full_name, username, email, password_hash, bio, status) VALUES (3, 'FAN', ...)",
  () => db.execute(
    `INSERT INTO users (role_id, role, full_name, username, email, password_hash, bio, status)
     VALUES (3, 'FAN', ?, ?, ?, ?, ?, 'ACTIVE')`,
    ['E2E Test 2', 'e2e2_' + Date.now(), 'e2e2@test.local', 'x', 'bio']
  )
);

// 3. EXACT notification insert from src/utils/helpers.js:249
console.log('\n[3] createNotification  helpers.js:249');
await tryRun(
  'INSERT INTO notifications (user_id, event_id, message, is_read, created_at)',
  () => db.execute(
    'INSERT INTO notifications (user_id, event_id, message, is_read, created_at) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)',
    [1, 1, 'hello']
  )
);

// 4. Same insert without the dangling FK
console.log('\n[4] notification insert after dropping the bad FK  (the fix)');
await tryRun('rebuild notifications without event_updates FK', async () => {
  await db.execute('PRAGMA foreign_keys = OFF');
  await db.execute(`CREATE TABLE notifications_fixed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )`);
  await db.execute('DROP TABLE notifications');
  await db.execute('ALTER TABLE notifications_fixed RENAME TO notifications');
  await db.execute('PRAGMA foreign_keys = ON');
  return db.execute(
    'INSERT INTO notifications (user_id, event_id, message, is_read, created_at) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)',
    [1, 1, 'hello']
  );
});

db.query && console.log('\n(done — copy discarded)');
rmSync(dir, { recursive: true, force: true });
process.exit(0);
