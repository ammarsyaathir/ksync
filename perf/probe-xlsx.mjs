// perf/probe-xlsx.mjs — dump an .xlsx (namespace-tolerant) : sheets, headers, sample rows
import fs from 'node:fs';
import JSZip from 'jszip';

const zip = await JSZip.loadAsync(fs.readFileSync(process.argv[2]));
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const strip = (x) => x.replace(/<(\/?)(?:[A-Za-z0-9_]+:)/g, '<$1'); // drop namespace prefixes

let shared = [];
if (zip.file('xl/sharedStrings.xml')) {
  const sx = strip(await zip.file('xl/sharedStrings.xml').async('string'));
  shared = [...sx.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => [...m[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((t) => unesc(t[1])).join(''));
}

const wb = strip(await zip.file('xl/workbook.xml').async('string'));
const sheets = [...wb.matchAll(/<sheet[^>]*?name="([^"]*)"[^>]*?r:id="([^"]*)"/g)].map((m) => ({ name: unesc(m[1]), rid: m[2] }));
const rels = strip(await zip.file('xl/_rels/workbook.xml.rels').async('string'));
const relMap = {};
for (const m of rels.matchAll(/<Relationship\b[^>]*\/?>/g)) {
  const id = (m[0].match(/Id="([^"]*)"/) || [])[1];
  const tg = (m[0].match(/Target="([^"]*)"/) || [])[1];
  if (id && tg) relMap[id] = tg;
}

const colIndex = (l) => [...l].reduce((a, c) => a * 26 + (c.charCodeAt(0) - 64), 0) - 1;

for (const s of sheets) {
  const rawTarget = relMap[s.rid] || '';
  const target = rawTarget.startsWith('/') ? rawTarget.slice(1) : 'xl/' + rawTarget;
  const f = zip.file(target);
  if (!f) { console.log(`\n[${s.name}] MISSING ${target}`); continue; }
  const xml = strip(await f.async('string'));
  const rows = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((r) => {
    const cells = [];
    for (const c of r[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
      const ref = (c[1].match(/r="([A-Z]+\d+)"/) || [])[1] || 'A1';
      const type = (c[1].match(/t="([^"]+)"/) || [])[1] || '';
      const v = (c[2].match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      const isx = c[2].match(/<is>([\s\S]*?)<\/is>/);
      const val = isx ? [...isx[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((t) => unesc(t[1])).join('')
        : v === undefined ? '' : type === 's' ? (shared[Number(v)] ?? '') : unesc(v);
      cells[colIndex(ref.replace(/\d+/g, ''))] = val;
    }
    return cells;
  });
  console.log(`\n===== sheet "${s.name}" — ${rows.length} rows =====`);
  const n = Math.min(rows.length, Number(process.env.ROWS || 6));
  for (let i = 0; i < n; i++) console.log(`  r${i + 1}: ${rows[i].map((c, j) => `${j}=${String(c ?? '').slice(0, 34)}`).join(' | ')}`);
  if (process.env.HEADERS_ONLY && rows.length > 1) console.log(`  ... ${rows.length - 1} data rows`);
}
