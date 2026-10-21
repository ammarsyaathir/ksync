import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
const byTable = {};
for (const p of J.paragraphs) if (p.tableIndex !== null) (byTable[p.tableIndex] ||= []).push(p.i);
for (const [t, idx] of Object.entries(byTable)) console.log(`table ${t}: paragraphs ${Math.min(...idx)}..${Math.max(...idx)}  (${idx.length} paragraphs)  first: ${J.tables[t].rows[0].join(' | ').slice(0,70)}`);
console.log('\n--- paragraph ranges around tables ---');
const all = J.paragraphs.map(p=>p.i);
for (const [t, idx] of Object.entries(byTable)) {
  const a = Math.min(...idx), b = Math.max(...idx);
  const before = J.paragraphs[a-1], after = J.paragraphs[b+1];
  console.log(`table ${t}: before p${a}="${(before?.text||'').slice(0,60)}"  after p${b}="${(after?.text||'').slice(0,60)}"`);
}
