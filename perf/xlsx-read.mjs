// perf/xlsx-read.mjs — minimal, dependency-free .xlsx reader (jszip + XML)
// returns [{ sheetName, rows: [[cell,...],...] }]
import fs from 'node:fs';
import JSZip from 'jszip';

const unesc = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&amp;/g, '&');
const strip = (x) => x.replace(/<(\/?)(?:[A-Za-z0-9_]+:)/g, '<$1'); // drop namespace prefixes

export async function readWorkbook(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));

  let shared = [];
  if (zip.file('xl/sharedStrings.xml')) {
    const sx = strip(await zip.file('xl/sharedStrings.xml').async('string'));
    shared = [...sx.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
      [...m[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((t) => unesc(t[1])).join(''));
  }

  const wb = strip(await zip.file('xl/workbook.xml').async('string'));
  const sheets = [...wb.matchAll(/<sheet[^>]*?name="([^"]*)"[^>]*?r:id="([^"]*)"/g)].map((m) => ({ name: unesc(m[1]), rid: m[2] }));

  const relMap = {};
  const rels = strip(await zip.file('xl/_rels/workbook.xml.rels').async('string'));
  for (const m of rels.matchAll(/<Relationship\b[^>]*\/?>/g)) {
    const id = (m[0].match(/Id="([^"]*)"/) || [])[1];
    const tg = (m[0].match(/Target="([^"]*)"/) || [])[1];
    if (id && tg) relMap[id] = tg;
  }

  const colIndex = (l) => [...l].reduce((a, c) => a * 26 + (c.charCodeAt(0) - 64), 0) - 1;
  const out = [];

  for (const s of sheets) {
    const raw = relMap[s.rid] || '';
    const target = raw.startsWith('/') ? raw.slice(1) : 'xl/' + raw;
    const f = zip.file(target);
    if (!f) { out.push({ sheetName: s.name, rows: [] }); continue; }
    const xml = strip(await f.async('string'));
    const rows = [];
    for (const r of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const cells = [];
      for (const c of r[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
        const ref = (c[1].match(/r="([A-Z]+\d+)"/) || [])[1] || '';
        const type = (c[1].match(/t="([^"]+)"/) || [])[1] || '';
        const v = (c[2].match(/<v>([\s\S]*?)<\/v>/) || [])[1];
        const isx = c[2].match(/<is>([\s\S]*?)<\/is>/);
        const val = isx ? [...isx[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((t) => unesc(t[1])).join('')
          : v === undefined ? '' : type === 's' ? (shared[Number(v)] ?? '') : unesc(v);
        if (ref) cells[colIndex(ref.replace(/\d+/g, ''))] = val;
      }
      for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = '';
      rows.push(cells);
    }
    out.push({ sheetName: s.name, rows });
  }
  return out;
}
