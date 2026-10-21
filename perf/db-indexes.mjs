import Database from 'better-sqlite3';
const db = new Database('database/ksync.db', { readonly: true });
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('table'.padEnd(24) + 'rows'.padStart(7) + '  indexes');
for (const { name } of tables) {
  const idx = db.prepare(`PRAGMA index_list("${name}")`).all();
  const custom = idx.filter((i) => !i.name.startsWith('sqlite_autoindex'));
  let rows = 0;
  try { rows = db.prepare(`SELECT COUNT(*) c FROM "${name}"`).get().c; } catch {}
  console.log(
    name.padEnd(24) + String(rows).padStart(7) + '  ' +
    (idx.length ? idx.map((i) => i.name + (i.origin === 'u' ? '(u)' : '')).join(', ') : 'NONE') +
    (custom.length ? '   <-- custom index' : '')
  );
}
const allIdx = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_autoindex%'").all();
console.log('\nCustom CREATE INDEX statements found:', allIdx.length);
