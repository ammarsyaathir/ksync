// perf/apply-trust-fix-sqlite.mjs — apply the trust_level fix to the local SQLite DB
// (idempotent; mirrors database/fix_trust_level_mysql.sql)
import Database from 'better-sqlite3';
const db = new Database('database/ksync.db');

const before = db.prepare("SELECT trust_level, COUNT(1) n FROM events WHERE verification_status='VERIFIED' GROUP BY 1 ORDER BY 1").all();
console.log('BEFORE:', JSON.stringify(before));

const rows = db.prepare("SELECT id, event_name, organizer_type, trust_level FROM events WHERE verification_status='VERIFIED' AND trust_level='VERIFIED'").all();
console.log(`rows to fix: ${rows.length}`);
for (const r of rows) console.log(`  #${r.id} [${r.organizer_type}] ${r.event_name.slice(0, 60)}`);

const info = db.prepare("UPDATE events SET trust_level='OFFICIAL', updated_at=CURRENT_TIMESTAMP WHERE verification_status='VERIFIED' AND trust_level='VERIFIED'").run();
console.log(`rows updated: ${info.changes}`);

const after = db.prepare("SELECT trust_level, COUNT(1) n FROM events WHERE verification_status='VERIFIED' GROUP BY 1 ORDER BY 1").all();
console.log('AFTER :', JSON.stringify(after));

// idempotency re-run
console.log(`re-run changes: ${db.prepare("UPDATE events SET trust_level='OFFICIAL' WHERE verification_status='VERIFIED' AND trust_level='VERIFIED'").run().changes}`);

// nothing else moved
console.log('verification_status counts:', JSON.stringify(db.prepare("SELECT verification_status, COUNT(1) n FROM events GROUP BY 1 ORDER BY 1").all()));
console.log('trust_level values in use:', db.prepare("SELECT DISTINCT trust_level FROM events ORDER BY 1").all().map((r) => r.trust_level).join(', '));
