// Read-only DB inspector for the performance audit (Section A + D).
// Does not modify any application file or the databases (readonly: true).
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const targets = [
  ['LIVE  database/ksync.db', path.join(repoRoot, 'database', 'ksync.db')],
  ['BACKUP REMOVED/database_versions/backups/ksync_23_tables_backup.db',
    path.join(repoRoot, 'REMOVED', 'database_versions', 'backups', 'ksync_23_tables_backup.db')]
];

for (const [label, file] of targets) {
  console.log('\n============================================================');
  console.log(label);
  if (!fs.existsSync(file)) { console.log('  MISSING FILE'); continue; }
  const st = fs.statSync(file);
  console.log(`  size bytes = ${st.size} (${(st.size / 1024).toFixed(1)} KB)`);
  let db;
  try {
    db = new Database(file, { readonly: true });
  } catch (e) {
    console.log('  OPEN FAILED:', e.message);
    continue;
  }
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  console.log(`  table count = ${tables.length}`);
  for (const t of tables) {
    let n = '?';
    try { n = db.prepare(`SELECT COUNT(*) AS n FROM "${t.name}"`).get().n; } catch (e) { n = 'ERR:' + e.message; }
    console.log(`    - ${t.name}: ${n} rows`);
  }
  const idx = db.prepare("SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' ORDER BY tbl_name, name").all();
  console.log(`  index count = ${idx.length} (excl. auto sqlite_autoindex)`);
  for (const i of idx) {
    console.log(`    - ${i.tbl_name}.${i.name}: ${i.sql ? i.sql.replace(/\s+/g, ' ').slice(0, 120) : '(auto)'}`);
  }
  const views = db.prepare("SELECT name FROM sqlite_master WHERE type='view'").all();
  console.log(`  view count = ${views.length}`);
  try {
    const pl = db.pragma('page_count', { simple: true });
    const ps = db.pragma('page_size', { simple: true });
    const jm = db.pragma('journal_mode', { simple: true });
    console.log(`  page_count=${pl} page_size=${ps} journal_mode=${jm}`);
  } catch (e) { console.log('  pragma err', e.message); }
  db.close();
}
