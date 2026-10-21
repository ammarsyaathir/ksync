// Read-only: dump sqlite_master SQL (tables + indexes) for live DB and backup.
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const files = [
  ['LIVE', path.join(repoRoot, 'database', 'ksync.db')],
  ['BACKUP23', path.join(repoRoot, 'REMOVED', 'database_versions', 'backups', 'ksync_23_tables_backup.db')]
];
for (const [label, file] of files) {
  console.log('\n############ ' + label + ' : ' + file);
  const d = new Database(file, { readonly: true });
  const rows = d.prepare("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE type IN ('table','index','trigger','view') ORDER BY type, name").all();
  for (const r of rows) {
    if (r.name && r.name.startsWith('sqlite_')) continue;
    console.log('--[' + r.type + '] ' + r.name + (r.tbl_name ? ' (on ' + r.tbl_name + ')' : ''));
    console.log((r.sql || '(auto)').replace(/\s+/g, ' '));
  }
  d.close();
}
