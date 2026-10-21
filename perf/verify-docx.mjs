// perf/verify-docx.mjs — integrity check for the patched .docx
//   node perf/verify-docx.mjs <original.docx> <patched.docx>
import fs from 'node:fs';
import JSZip from 'jszip';
import { xml2js } from 'xml-js';

const [A, B] = process.argv.slice(2);
const za = await JSZip.loadAsync(fs.readFileSync(A));
const zb = await JSZip.loadAsync(fs.readFileSync(B));

const names = (z) => Object.keys(z.files).filter((n) => !z.files[n].dir).sort();
const na = names(za), nb = names(zb);
console.log(`parts original: ${na.length}   patched: ${nb.length}`);
const missing = na.filter((n) => !nb.includes(n));
const added = nb.filter((n) => !na.includes(n));
console.log(`missing parts: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`added parts:   ${added.length ? added.join(', ') : 'none'}`);

// well-formedness of every xml part in the patched file
let bad = 0;
for (const n of nb.filter((x) => x.endsWith('.xml') || x.endsWith('.rels'))) {
  const s = await zb.file(n).async('string');
  try { xml2js(s, { compact: true }); } catch (e) { bad++; console.log(`  MALFORMED ${n}: ${e.message}`); }
}
console.log(`malformed xml parts: ${bad}`);

// paragraph + table counts
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const stats = async (z) => {
  const x = await z.file('word/document.xml').async('string');
  const paras = [...x.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].length;
  const tables = [...x.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].length;
  const text = unesc([...x.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));
  return { paras, tables, text };
};
const sa = await stats(za), sb = await stats(zb);
console.log(`paragraphs ${sa.paras} -> ${sb.paras}   tables ${sa.tables} -> ${sb.tables}`);

// text-length sanity (whitespace-insensitive)
const flat = (s) => s.replace(/\s+/g, ' ').trim();
console.log(`visible text length: ${flat(sa.text).length} -> ${flat(sb.text).length}`);

const mustBeGone = [
  'Hono', 'Supabase', 'Cloudflare', 'PostgreSQL',
  'searchable content', 'topic-based discussion threads',
  'Organize discussions and information sharing by event',
  'Provide questions and answers and make previous responses easier to find',
  'Event discussions; general K-pop topics; questions and answers; share information',
  'Browse listings; search and filter events; view event details',
];
const mustExist = [
  'event-based fan community discussions',
  'Node.js with the Express framework',
  'Firebase Admin SDK',
  'SMTP mail service',
  'verified organizer',
  'reference number',
  'report incorrect or outdated listings',
  'add an event to a personal calendar',
];
const flatB = flat(sb.text);
for (const t of mustBeGone) console.log(`${(flatB.includes(flat(t)) ? 'STILL PRESENT' : 'gone        ')} | ${t}`);
for (const t of mustExist) console.log(`${(flatB.includes(flat(t)) ? 'present     ' : 'MISSING     ')} | ${t}`);
