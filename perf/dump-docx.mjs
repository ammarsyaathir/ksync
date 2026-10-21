// perf/dump-docx.mjs — dump paragraphs (+table membership) and tables from a .docx
//   node perf/dump-docx.mjs <in.docx> <out.json>
import fs from 'node:fs';
import JSZip from 'jszip';

const SRC = process.argv[2];
const OUTJ = process.argv[3];
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

const xml = await (await JSZip.loadAsync(fs.readFileSync(SRC))).file('word/document.xml').async('string');

// table spans (in document order)
const tbls = [];
{
  let m;
  const re = /<w:tbl(?:\s[^>]*)?>[\s\S]*?<\/w:tbl>/g;
  while ((m = re.exec(xml)) !== null) tbls.push({ start: m.index, end: m.index + m[0].length, xml: m[0] });
}

const paragraphs = [];
{
  let m;
  const re = /<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  while ((m = re.exec(xml)) !== null) {
    const px = m[0];
    const text = unesc([...px.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));
    const ti = tbls.findIndex((t) => m.index > t.start && m.index < t.end);
    paragraphs.push({ i: paragraphs.length, start: m.index, end: m.index + px.length, style: (px.match(/<w:pStyle w:val="([^"]+)"/) || [])[1] || '', tableIndex: ti < 0 ? null : ti, text });
  }
}

const tables = tbls.map((t, ti) => {
  const rows = [...t.xml.matchAll(/<w:tr(?:\s[^>]*)?>[\s\S]*?<\/w:tr>/g)].map((r) =>
    [...r[0].matchAll(/<w:tc(?:\s[^>]*)?>[\s\S]*?<\/w:tc>/g)].map((c) =>
      unesc([...c[0].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((x) => x[1]).join(''))));
  return { ti, rows };
});

fs.writeFileSync(OUTJ, JSON.stringify({ paragraphs, tables }, null, 1), 'utf8');
console.log(`paragraphs: ${paragraphs.length}   tables: ${tables.length}   -> ${OUTJ}`);
for (const t of tables) console.log(`  table ${t.ti}: ${t.rows.length} rows x ${t.rows[0].length} cols | r0: ${t.rows[0].map((c) => c.slice(0, 34)).join(' | ')}`);
