import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('perf/_v4.json','utf8'));
const show = (a,b) => J.paragraphs.filter(p=>p.i>=a&&p.i<=b).forEach(p=>{
  if(!p.text.trim()) return;
  console.log(`--- p${p.i} [${p.style}] (${p.text.length})`);
  console.log(p.text.replace(/\s+/g,' '));
});
console.log("========== 1.4 AIM / 1.5 OBJ / 1.6 SCOPE ==========");
show(122,151);
