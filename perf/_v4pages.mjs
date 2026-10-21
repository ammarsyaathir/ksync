import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
const p = J.paragraphs;
const heads = p.filter(x => /^(Heading1|Heading2)$/.test(x.style));
const bounds = heads.map((h,k) => [h.i, h.text, (k+1<heads.length? heads[k+1].i : p.length)]);
const tot = p.reduce((a,b)=>a+b.text.length,0);
// calibrate: 24 pages total, ~1.7 pages consumed by 6 figures
const charsPerPage = tot / (24 - 1.7);
console.log('total chars', tot, '| est chars/page', Math.round(charsPerPage), '\n');
let rows=[];
for (const [i,txt,end] of bounds) {
  const seg = p.slice(i,end);
  const c = seg.reduce((a,b)=>a+b.text.length,0);
  rows.push([txt.slice(0,52), seg.length, c, (c/charsPerPage).toFixed(2)]);
}
console.log('section'.padEnd(54),'paras','chars','pages');
for (const r of rows) console.log(String(r[0]).padEnd(54), String(r[1]).padStart(5), String(r[2]).padStart(6), String(r[3]).padStart(6));
const sum = rows.reduce((a,r)=>a+Number(r[3]),0);
console.log('\nsum of section estimates', sum.toFixed(2), 'pages (text) + 1.7 figures = 24');
