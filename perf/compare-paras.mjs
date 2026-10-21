// perf/compare-paras.mjs — diff paragraph text between two dumps
import fs from 'node:fs';
const a = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const b = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const norm = (s) => s.replace(/[\u2018\u2019\u201B\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();
let n = 0;
for (let i = 0; i < Math.max(a.paragraphs.length, b.paragraphs.length); i++) {
  const ta = a.paragraphs[i]?.text ?? '<missing>';
  const tb = b.paragraphs[i]?.text ?? '<missing>';
  if (norm(ta) !== norm(tb)) {
    n++;
    console.log(`\n### P${i} CHANGED`);
    console.log(`  A: ${ta.slice(0, 150)}`);
    console.log(`  B: ${tb.slice(0, 150)}`);
  }
}
console.log(`\n${n} paragraph(s) differ`);
