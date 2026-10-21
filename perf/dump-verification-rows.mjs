// perf/dump-verification-rows.mjs — dump every event's verification + trust data
import Database from 'better-sqlite3';
const db = new Database('database/ksync.db', { readonly: true });

const rows = db.prepare(`
  SELECT id, event_name, verification_status AS vs, trust_level AS tl, tracking_code,
         submitter_name, organizer_name, official_url, event_date, category_id
  FROM events ORDER BY verification_status, id
`).all();

console.log('id | vs | tl | code | date | cat | organizer | name');
console.log('-'.repeat(150));
for (const r of rows) {
  console.log(`${String(r.id).padStart(3)} | ${String(r.vs).padEnd(8)} | ${String(r.tl).padEnd(8)} | ${String(r.tracking_code ?? '-').padEnd(16)} | ${r.event_date} | ${r.category_id} | ${String(r.organizer_name ?? r.submitter_name ?? '-').slice(0, 28).padEnd(28)} | ${r.event_name.slice(0, 48)}`);
}
console.log(`\ntotal rows: ${rows.length}`);
console.log(`trust_level values in use: ${[...new Set(rows.map((r) => r.tl))].join(', ')}`);
console.log(`verification values in use: ${[...new Set(rows.map((r) => r.vs))].join(', ')}`);
