import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
for (const i of [10,14]) {
  const p = J.paragraphs[i];
  console.log(`--- p${i} (${p.text.length})`);
  console.log(p.text.replace(/\s+/g,' '));
  console.log();
}
console.log("========== 1.8 / 1.9 ==========");
J.paragraphs.filter(p=>p.i>=171&&p.i<=196&&p.text.trim()).forEach(p=>{
  console.log(`--- p${p.i} [${p.style}] (${p.text.length})`);
  console.log(p.text.replace(/\s+/g,' '));
});
