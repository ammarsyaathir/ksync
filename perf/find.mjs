// perf/find.mjs — search paragraphs of a dumped docx
//   node perf/find.mjs <paras.json> <regex> [flags]
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const re = new RegExp(process.argv[3], process.argv[4] || 'i');
for (const p of d.paragraphs) {
  if (re.test(p.text)) console.log(`[P${p.i}${p.tableIndex === null ? '' : ' T' + p.tableIndex}] ${p.text}\n`);
}
