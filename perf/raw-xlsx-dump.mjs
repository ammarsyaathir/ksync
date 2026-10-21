// perf/raw-xlsx-dump.mjs — print raw parts of an xlsx to fix the parser
import fs from 'node:fs';
import JSZip from 'jszip';
const zip = await JSZip.loadAsync(fs.readFileSync(process.argv[2]));
const show = async (n, len = 1500) => {
  const f = zip.file(n);
  if (!f) { console.log(`\n### ${n} — MISSING`); return; }
  const s = await f.async('string');
  console.log(`\n### ${n}  (${s.length} chars)\n${s.slice(0, len)}`);
};
await show('xl/workbook.xml');
await show('xl/_rels/workbook.xml.rels');
await show('xl/sharedStrings.xml', 800);
await show('xl/worksheets/sheet1.xml', 1200);
