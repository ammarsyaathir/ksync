import Database from 'better-sqlite3';
const d = new Database('database/ksync.db', { readonly: true });
for (const t of ['events', 'event_categories', 'venues', 'artists']) {
  const r = d.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name = ?").get(t);
  console.log('===== ' + t + ' =====');
  console.log(r ? r.sql : '(missing)');
  const n = d.prepare(`SELECT COUNT(*) c FROM "${t}"`).get().c;
  console.log(`-- rows: ${n}`);
}
console.log('\n===== event_categories rows =====');
console.table(d.prepare('SELECT * FROM event_categories').all());
console.log('\n===== venues rows =====');
console.table(d.prepare('SELECT id, name, city, state FROM venues').all());
console.log('\n===== artists rows =====');
console.table(d.prepare('SELECT id, name FROM artists').all());
console.log('\n===== existing events =====');
console.table(d.prepare('SELECT id, event_name, event_date, venue_name, city, category_id, verification_status FROM events').all());
d.close();
