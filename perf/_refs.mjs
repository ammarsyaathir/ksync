import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
for (const p of J.paragraphs) {
  if (p.i >= 190 && p.text.trim()) console.log(String(p.i).padStart(4), '|', p.style.padEnd(9), '|', p.text.slice(0,150));
}
