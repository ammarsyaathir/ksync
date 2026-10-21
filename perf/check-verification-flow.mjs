// perf/check-verification-flow.mjs — what does the DB actually say about verification?
import Database from 'better-sqlite3';
const db = new Database('database/ksync.db', { readonly: true });

const cols = db.prepare('PRAGMA table_info(events)').all()
  .filter((c) => ['verification_status', 'trust_level', 'event_status', 'organizer_id'].includes(c.name));
console.log('column definitions (name | type | notnull | default):');
for (const c of cols) console.log(`  ${c.name} | ${c.type} | ${c.notnull} | ${c.dflt_value}`);

console.log('\ncounts by verification_status / trust_level:');
for (const r of db.prepare('SELECT verification_status, trust_level, COUNT(1) AS n FROM events GROUP BY verification_status, trust_level ORDER BY 1').all())
  console.log(`  ${r.verification_status} / ${r.trust_level} = ${r.n}`);

const vis = db.prepare("SELECT COUNT(1) AS n FROM events WHERE verification_status='VERIFIED'").get();
const tot = db.prepare('SELECT COUNT(1) AS n FROM events').get();
console.log(`\npublicly listed (VERIFIED only): ${vis.n} of ${tot.n} events`);

console.log('\nrows currently hidden from the public directory:');
for (const r of db.prepare("SELECT id, event_name, verification_status, tracking_code, submitter_name FROM events WHERE verification_status <> 'VERIFIED' ORDER BY id").all())
  console.log(`  #${r.id} [${r.verification_status}] ${r.event_name.slice(0, 55)} | ${r.tracking_code ?? '-'} | ${r.submitter_name ?? '-'}`);
