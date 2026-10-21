import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
const p = J.paragraphs;
const isHead = (s) => /^(Heading|heading|Title|Subtitle)/.test(s);
const heads = p.filter(x => isHead(x.style));
console.log('heading-styled paragraphs:', heads.length);
for (const h of heads) console.log(String(h.i).padStart(4), '|', h.style.padEnd(12), '|', h.text.slice(0,80));
console.log('\n--- paragraphs whose text starts like a number ---');
p.filter(x => /^\d+(\.\d+)*\s+\S/.test(x.text)).slice(0,60).forEach(h =>
  console.log(String(h.i).padStart(4), '|', h.style.padEnd(12), '|', h.text.slice(0,80)));
const tot = p.reduce((a,b)=>a+b.text.length,0);
console.log('\ntotal chars:', tot, ' paragraphs:', p.length, ' tables:', J.tables.length);
