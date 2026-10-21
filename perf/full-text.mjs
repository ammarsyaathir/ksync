// perf/full-text.mjs — print full text of specific paragraph indices
//   node perf/full-text.mjs <paras.json> 24 30 32 ...
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const a of process.argv.slice(3)) {
  const p = d.paragraphs[Number(a)];
  if (!p) { console.log(`[${a}] (missing)`); continue; }
  console.log(`\n---------- P${p.i}  style=${p.style || '(none)'}  table=${p.tableIndex === null ? '-' : p.tableIndex}  len=${p.text.length}`);
  console.log(p.text);
}
