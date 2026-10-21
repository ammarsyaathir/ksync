// perf/check-repro.mjs — compare two .docx builds part by part
import fs from 'node:fs';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const h = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);
const load = async (p) => {
  const z = await JSZip.loadAsync(fs.readFileSync(p));
  const out = {};
  for (const n of Object.keys(z.files)) {
    if (z.files[n].dir) continue;
    out[n] = h(await z.file(n).async('nodebuffer'));
  }
  return out;
};

const [a, b] = [process.argv[2], process.argv[3]];
const A = await load(a), B = await load(b);
const keys = [...new Set([...Object.keys(A), ...Object.keys(B)])].sort();
let same = 0, diff = 0;
for (const k of keys) {
  const eq = A[k] && B[k] && A[k] === B[k];
  if (eq) same++; else { diff++; console.log(`  DIFF ${k.padEnd(30)} ${A[k] ?? '(absent)'} vs ${B[k] ?? '(absent)'}`); }
}
console.log(`\nparts identical: ${same}   differing: ${diff}`);
console.log(diff === 0 ? 'RESULT: byte-identical package' : 'RESULT: differences above (timestamps in the zip are ignored only if the part is listed)');
