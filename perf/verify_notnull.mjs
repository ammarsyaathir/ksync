// Read-only verification (fixed): copy .db + -wal + -shm so committed WAL state is preserved,
// then test whether the app's INSERT (auth.js:275/536, omit role_id) is accepted.
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const base = path.join(repoRoot, 'database', 'ksync.db');
const dstBase = path.join(__dirname, '_tmp_notnull_test.db');
for (const suffix of ['', '-wal', '-shm']) {
  const s = base + suffix, t = dstBase + suffix;
  if (fs.existsSync(s)) fs.copyFileSync(s, t);
}
const d = new Database(dstBase);
console.log('role column present in copy:', d.prepare('PRAGMA table_info(users)').all().map(c => c.name + (c.notnull ? '*' : '') + (c.dflt_value ? '=' + c.dflt_value : '')).join(', '));
d.pragma('foreign_keys = ON');
try {
  d.prepare("INSERT INTO users (role, full_name, username, email, password_hash, bio, status) VALUES ('FAN', ?, ?, ?, ?, ?, 'ACTIVE')")
    .run('Audit Injected User', 'audit_inj_' + Date.now(), 'audit_' + Date.now() + '@example.com', 'x', 'y');
  console.log('APP INSERT (auth.js:275) => SUCCEEDED');
} catch (e) {
  console.log('APP INSERT (auth.js:275) => FAILED ->', e.code, '|', e.message);
}
d.close();
for (const suffix of ['', '-wal', '-shm']) { try { fs.unlinkSync(dstBase + suffix); } catch {} }
