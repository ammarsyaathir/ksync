import Database from 'better-sqlite3';
const db = new Database('database/ksync.db', { readonly: true });
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map((r) => r.name);
const names = new Set(tables);

console.log('=== Broken foreign keys (target table does not exist) ===');
let broken = 0;
for (const t of tables) {
  const fks = db.prepare(`PRAGMA foreign_key_list("${t}")`).all();
  for (const fk of fks) {
    if (!names.has(fk.table)) {
      broken++;
      console.log(`  ${t}.${fk.from} -> ${fk.table}.${fk.to}   ** TARGET TABLE MISSING **`);
    }
  }
}
console.log(broken === 0 ? '  (none)' : `  ${broken} broken FK(s)`);

console.log('\n=== notifications table schema ===');
console.log(db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='notifications'").get()?.sql);

console.log('\n=== activity_logs table schema ===');
console.log(db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='activity_logs'").get()?.sql);

console.log('\n=== users table columns ===');
console.log(db.prepare('PRAGMA table_info(users)').all().map((c) => c.name).join(', '));
