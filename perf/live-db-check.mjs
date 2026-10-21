import Database from 'better-sqlite3';
const d = new Database('database/ksync.db', { readonly: true });

for (const t of ['users', 'notifications']) {
  const r = d.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name = ?").get(t);
  console.log('--- ' + t + ' (CREATE) ---');
  console.log(r ? r.sql : '(missing)');
}

console.log('\n--- users rows ---');
console.table(d.prepare('SELECT id, username, role, role_id FROM users').all());

console.log('\n--- columns of users ---');
for (const c of d.prepare('PRAGMA table_info(users)').all()) {
  console.log(`  ${c.cid}  ${c.name.padEnd(18)} ${String(c.type).padEnd(10)} notnull=${c.notnull} default=${c.dflt_value}`);
}

console.log('\n--- indexes on users ---');
console.log(d.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='users'").all());

d.close();
