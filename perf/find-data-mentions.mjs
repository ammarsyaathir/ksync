// perf/find-data-mentions.mjs — locate every paragraph/table cell carrying survey data
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2] || 'C:/Users/ammar/AppData/Local/Temp/opencode/ch1_final_paras.json', 'utf8'));

const re = /(\d+(?:\.\d+)?\s?%)|(\brespondents?\b)|(\bquestionnaire\b)|(\bQ\d+)|(\bQuestions?\s+\d)/i;
const show = (tag, txt) => console.log(`${tag} :: ${txt.replace(/\s+/g, ' ').slice(0, 300)}`);

console.log('===== paragraphs =====');
for (const p of d.paragraphs) if (re.test(p.text)) show(`P${p.i}`, p.text);

console.log('\n===== table cells =====');
for (const t of d.tables) {
  for (const [ri, row] of t.rows.entries()) {
    for (const [ci, c] of row.cells.entries()) {
      if (re.test(c)) show(`T${t.ti}r${ri}c${ci}`, c);
    }
  }
}
console.log('\n===== table shapes =====');
for (const t of d.tables) console.log(`T${t.ti}: ${t.rows.length} rows x ${t.rows[0].cells.length} cols — first row: ${t.rows[0].cells.map((c) => c.slice(0, 40)).join(' | ')}`);
