// perf/extract-docx.mjs — dump exact paragraph/table text of a .docx to JSON (utf8)
import fs from 'node:fs';
import JSZip from 'jszip';

const file = process.argv[2];
const outFile = process.argv[3];
const zip = await JSZip.loadAsync(fs.readFileSync(file));
const xml = await zip.file('word/document.xml').async('string');

const kids = (el) => (el.elements || []).filter((e) => e.type === 'element');
const tText = (t) => (t.elements || []).map((x) => x.text || '').join('');

function rawParagraphs(x) {
  const out = [];
  const re = /<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(x)) !== null) out.push({ start: m.index, xml: m[0] });
  return out;
}

const paras = rawParagraphs(xml);
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

const list = paras.map((p, i) => {
  const styleMatch = p.xml.match(/<w:pStyle w:val="([^"]+)"/);
  const text = unesc([...p.xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]).join(''));
  return { i, style: styleMatch ? styleMatch[1] : '', text };
});

const tables = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((m, ti) => ({
  ti,
  rows: [...m[0].matchAll(/<w:tr(?:\s[^>]*)?>[\s\S]*?<\/w:tr>/g)].map((r) => ({
    cells: [...r[0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)].map((c) =>
      unesc([...c[0].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((x) => x[1]).join('')))
  }))
}));

fs.writeFileSync(outFile, JSON.stringify({ paragraphs: list.filter((p) => p.text.trim()), tables }, null, 1), 'utf8');
console.log(`paragraphs=${list.filter((p) => p.text.trim()).length} tables=${tables.length} -> ${outFile}`);
