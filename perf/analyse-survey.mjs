// perf/analyse-survey.mjs — per-column distinct values + counts for the real survey
import { readWorkbook } from './xlsx-read.mjs';

const wb = await readWorkbook('C:/Users/ammar/AppData/Local/Temp/opencode/survey.xlsx');
const sheet = wb[0];
const [header, ...data] = sheet.rows;
console.log(`sheet "${sheet.sheetName}": ${data.length} response rows, ${header.length} columns\n`);

const tally = (arr) => {
  const m = new Map();
  for (const v of arr) m.set(v, (m.get(v) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

for (let c = 0; c < header.length; c++) {
  const vals = data.map((r) => String(r[c] ?? '').trim());
  const empty = vals.filter((v) => v === '').length;
  const distinct = tally(vals.filter((v) => v !== ''));
  console.log(`--- col ${c}: ${String(header[c]).replace(/\s+/g, ' ')}`);
  console.log(`    non-empty=${vals.length - empty} blank=${empty} distinct=${distinct.length}`);
  for (const [v, n] of distinct.slice(0, 30)) {
    const show = v.length > 130 ? v.slice(0, 130) + '…' : v;
    console.log(`      ${String(n).padStart(3)}  ${show}`);
  }
  if (distinct.length > 30) console.log(`      ... +${distinct.length - 30} more`);
  console.log();
}
