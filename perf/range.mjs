// perf/range.mjs — print paragraphs in an index range
//   node perf/range.mjs <paras.json> <from> <to>
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const from = Number(process.argv[3]);
const to = Number(process.argv[4]);
for (const p of d.paragraphs) {
  if (p.i >= from && p.i <= to) console.log(`[P${p.i}${p.tableIndex === null ? '' : ' T' + p.tableIndex}] ${p.text}\n`);
}
