import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
const bad = ['Bucher','Castillo','Eppler','Fletcher','Gillespie','Hwang','Suzor','Wasko','Zubiaga'];
const body = J.paragraphs.filter(p => p.i >= 6 && p.i <= 196);
let n = 0;
for (const p of body) {
  for (const b of bad) {
    const re = new RegExp(b + '[^.;]{0,60}?\\((?:19|20)\\d\\d[a-z]?\\)|' + b + '[^.;]{0,60}?\\((?:19|20)\\d\\d[a-z]?\\)|\\(' + b + '[^)]{0,80}\\)', 'g');
    let m;
    while ((m = re.exec(p.text)) !== null) {
      n++;
      const s = Math.max(0, m.index - 90), e = Math.min(p.text.length, m.index + m[0].length + 90);
      console.log(`p${p.i} [${m[0].trim()}]`);
      console.log('   ...' + p.text.slice(s, e).replace(/\s+/g,' ') + '...');
    }
  }
}
console.log('\ntotal out-of-range citation instances:', n);
