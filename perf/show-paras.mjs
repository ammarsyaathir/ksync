// perf/show-paras.mjs — print paragraph index / style / table / text
//   node perf/show-paras.mjs <paras.json> [from] [to]
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const from = Number(process.argv[3] ?? 0);
const to = Number(process.argv[4] ?? d.paragraphs.length - 1);
for (const p of d.paragraphs) {
  if (p.i < from || p.i > to) continue;
  const t = p.text.length > 118 ? p.text.slice(0, 118) + '…' : p.text;
  console.log(`${String(p.i).padStart(4)} ${p.style.padEnd(12)} ${p.tableIndex === null ? '-' : 'T' + p.tableIndex}  ${t}`);
}
