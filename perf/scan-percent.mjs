// perf/scan-percent.mjs — list every paragraph containing a percentage or sample size
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const p of d.paragraphs) {
  const hasPct = /\d+(?:\.\d+)?\s?%/.test(p.text);
  const hasN = /\b(?:30|51)\s+(?:respondents|K-pop fans)/.test(p.text);
  if (hasPct || hasN) console.log(`\n[P${p.i}${p.tableIndex === null ? '' : ' T' + p.tableIndex}] ${p.text}`);
}
