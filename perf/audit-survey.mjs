// perf/audit-survey.mjs — re-check the survey source: row count, anomalies, Q24
import { readWorkbook } from './xlsx-read.mjs';

const wb = await readWorkbook('C:/Users/ammar/AppData/Local/Temp/opencode/survey.xlsx');
const sheet = wb[0];
const [header, ...data] = sheet.rows;
const N = data.length;

const serialToDate = (s) => {
  const ms = Math.round((Number(s) - 25569) * 86400 * 1000);
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
};

console.log(`sheet "${sheet.sheetName}"  rows=${N}  cols=${header.length}`);
console.log(`headers: ${header.map((h, i) => i + ':' + String(h).slice(0, 30)).join(' | ')}\n`);

// answer completeness per row (columns 3..33 = Q1..Q31)
const blankCounts = data.map((r) => {
  let b = 0;
  for (let c = 3; c <= 33; c++) if (String(r[c] ?? '').trim() === '') b++;
  return b;
});
const withBlanks = blankCounts.filter((b) => b > 0).length;
console.log(`rows with at least one blank answer: ${withBlanks} / ${N}`);
blankCounts.forEach((b, i) => { if (b > 0) console.log(`   row ${i + 2} (response #${i + 1}): ${b} blank`); });

// duplicate answer vectors
const seen = new Map();
data.forEach((r, i) => {
  const key = r.slice(3, 34).map((x) => String(x ?? '').trim()).join('\u0001');
  if (seen.has(key)) console.log(`   DUPLICATE answer vector: response #${seen.get(key) + 1} and #${i + 1}`);
  else seen.set(key, i);
});

// timestamps
const ts = data.map((r) => Number(r[0])).filter((x) => !Number.isNaN(x));
console.log(`\ntimestamps: ${ts.length}   earliest ${serialToDate(Math.min(...ts))}   latest ${serialToDate(Math.max(...ts))}`);
const dayKeys = ts.map((t) => Math.floor(t));
const days = [...new Set(dayKeys)].sort((a, b) => a - b);
console.log(`distinct days: ${days.length}`);
for (const d of days) console.log(`   day ${d} (${serialToDate(d)}): ${dayKeys.filter((x) => x === d).length} responses`);

// Q24 distribution
console.log('\n--- Q24 (col 26) raw distinct values ---');
const q24 = new Map();
for (const r of data) q24.set(String(r[26] ?? '').trim(), (q24.get(String(r[26] ?? '').trim()) || 0) + 1);
for (const [v, n] of [...q24.entries()].sort((a, b) => b[1] - a[1])) console.log(`   ${String(n).padStart(3)}  ${v.slice(0, 120)}`);

// how many selected "I do not experience these difficulties" and nothing else
let onlyNone = 0;
for (const r of data) {
  const v = String(r[26] ?? '');
  if (v.includes('I do not experience these difficulties') && !v.includes('scattered')) onlyNone++;
}
console.log(`\nrespondents selecting ONLY "I do not experience these difficulties": ${onlyNone} / ${N}`);
