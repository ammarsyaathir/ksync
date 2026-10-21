// perf/peek-refs.mjs — print the raw XML of reference paragraphs in the original docx
import fs from 'node:fs';
import JSZip from 'jszip';

const SRC = process.argv[2];
const zip = await JSZip.loadAsync(fs.readFileSync(SRC));
const xml = await zip.file('word/document.xml').async('string');

const paras = [...xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map((m) => m[0]);
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const textOf = (px) => unesc([...px.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));

let idx = 0;
for (const px of paras) {
  const t = textOf(px);
  if (/^REFERENCES$/i.test(t.trim()) || /^(Geels|Roslan|Schaffner|Suzor)[, ]/.test(t.trim())) {
    console.log(`\n===== paragraph #${idx}  text: ${t.slice(0, 70)}`);
    console.log(px);
    if (/^REFERENCES$/i.test(t.trim())) console.log('\n--- next paragraph (first reference) ---');
  }
  idx++;
}
