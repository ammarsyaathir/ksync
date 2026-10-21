// perf/trust-level-audit.mjs — audit trust_level values on VERIFIED events
import Database from 'better-sqlite3';
const db = new Database('database/ksync.db', { readonly: true });

const rows = db.prepare(`
  SELECT id, event_name, organizer_name, organizer_type, official_url, trust_level, category_id
  FROM events WHERE verification_status = 'VERIFIED' ORDER BY id
`).all();

for (const r of rows) {
  console.log(`#${r.id} [${r.trust_level}] cat=${r.category_id}`);
  console.log(`   name      : ${r.event_name}`);
  console.log(`   organizer : ${r.organizer_name ?? '-'}  (type: ${r.organizer_type ?? '-'})`);
  console.log(`   source    : ${r.official_url ?? '-'}`);
}
console.log(`\nstray rows (trust_level not in OFFICIAL/COMMUNITY): ${rows.filter((r) => !['OFFICIAL', 'COMMUNITY'].includes(r.trust_level)).map((r) => r.id).join(', ') || 'none'}`);
