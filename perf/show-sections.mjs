// perf/show-sections.mjs — print all headings and the problem/solution mapping table
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

console.log('===== HEADINGS =====');
for (const p of d.paragraphs) {
  if (/^Heading/.test(p.style)) console.log(`  [${p.style}] ${p.text}`);
}

console.log('\n===== TABLES =====');
for (const t of d.tables) {
  console.log(`\n--- table ${t.ti} ---`);
  for (const [ri, row] of t.rows.entries()) console.log(`  r${ri}: ${row.map((c) => '[' + c + ']').join(' ')}`);
}

console.log('\n===== PROBLEM / SOLUTION PROSE (first 2 sentences each) =====');
const first = (s, n = 2) => s.split(/(?<=\.)\s+/).slice(0, n).join(' ');
for (const p of d.paragraphs) {
  if (/^(K-pop event information in Malaysia is published|K-pop fans use group chats|Finding an event announcement|The first proposed solution|The second proposed solution|The third proposed solution)/.test(p.text)) {
    console.log(`\n[P${p.i}] ${first(p.text)}`);
  }
}
