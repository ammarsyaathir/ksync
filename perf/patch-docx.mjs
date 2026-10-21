// perf/patch-docx.mjs — apply perf/ch1-edits.mjs to a .docx and emit a corrected copy.
//
//   node perf/patch-docx.mjs <in.docx> <out.docx>
//
// For every edit it finds the paragraph whose text CONTAINS the edit key (must be
// unique) and rewrites that paragraph as a single run, keeping the original
// <w:pPr> (paragraph style) and the first run's <w:rPr> (character formatting).
// The original file is never modified.
import fs from 'node:fs';
import JSZip from 'jszip';
import { EDITS } from './ch1-edits.mjs';

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) { console.error('usage: node perf/patch-docx.mjs <in.docx> <out.docx>'); process.exit(2); }

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// tolerant comparison: unify typographic quotes/dashes and whitespace
const norm = (s) => s
  .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
  .replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u2013\u2014]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

const zip = await JSZip.loadAsync(fs.readFileSync(SRC));
const xml = await zip.file('word/document.xml').async('string');

// ---- index every paragraph (this also picks up paragraphs inside table cells) ----
const PARA_RE = /<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
const paras = [];
{
  let m;
  while ((m = PARA_RE.exec(xml)) !== null) {
    const px = m[0];
    const text = unesc([...px.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));
    paras.push({ start: m.index, end: m.index + px.length, xml: px, text });
  }
}
console.log(`source: ${SRC}`);
console.log(`paragraphs found: ${paras.length}   edits to apply: ${EDITS.length}`);

// ---- match every edit ----
const problems = [];
const plan = new Map(); // paragraphIndex -> new text
for (let e = 0; e < EDITS.length; e++) {
  const edit = EDITS[e];
  const k = norm(edit.key);
  const found = [];
  for (let i = 0; i < paras.length; i++) if (norm(paras[i].text).includes(k)) found.push(i);

  if (found.length === 0) { problems.push(`MISS     [${e}] "${edit.key.slice(0, 70)}"`); continue; }
  if (found.length > 1) { problems.push(`AMBIG x${found.length} [${e}] "${edit.key.slice(0, 70)}" -> paras ${found.join(', ')}`); continue; }
  const pi = found[0];
  if (plan.has(pi)) { problems.push(`CONFLICT [${e}] two edits target paragraph ${pi}`); continue; }
  plan.set(pi, { e, text: edit.text });
}

// ---- rebuild a paragraph as one run ----
function rebuild(px, newText) {
  const openTag = px.match(/^<w:p(?:\s[^>]*)?>/)[0];
  const pPr = px.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
  let rPr = '';
  const run = px.match(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/);
  if (run) { const rp = run[0].match(/<w:rPr>[\s\S]*?<\/w:rPr>/); if (rp) rPr = rp[0]; }
  return `${openTag}${pPr ? pPr[0] : ''}<w:r>${rPr}<w:t xml:space="preserve">${esc(newText)}</w:t></w:r></w:p>`;
}

// ---- splice replacements into the document xml ----
let out = '';
let cursor = 0;
for (const pi of [...plan.keys()].sort((a, b) => a - b)) {
  const p = paras[pi];
  out += xml.slice(cursor, p.start) + rebuild(p.xml, plan.get(pi).text);
  cursor = p.end;
}
out += xml.slice(cursor);

// ---- write the new package ----
const zipOut = await JSZip.loadAsync(fs.readFileSync(SRC));
zipOut.file('word/document.xml', out);
fs.writeFileSync(OUT, await zipOut.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));

// ---- verify against the OUTPUT ----
const vxml = await (await JSZip.loadAsync(fs.readFileSync(OUT))).file('word/document.xml').async('string');
const vtext = unesc([...vxml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join('\u0000'));
const vNorm = norm(vtext);

const missingNew = [];
for (let e = 0; e < EDITS.length; e++) if (!vNorm.includes(norm(EDITS[e].text).slice(0, 60))) missingNew.push(e);

const staleTerms = ['Hono', 'Supabase', 'Cloudflare', 'PostgreSQL', 'MongoDB', 'searchable content', 'topic-based', 'questions and answers', 'without logging in to search'];
const staleFound = staleTerms.filter((t) => vNorm.includes(norm(t)));

console.log(`\napplied: ${plan.size}/${EDITS.length}   output -> ${OUT}`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); problems.forEach((p) => console.log('  ' + p)); }
else console.log('problems: none — every key matched exactly one paragraph.');
console.log(`new-text present: ${EDITS.length - missingNew.length}/${EDITS.length}${missingNew.length ? ' missing edits ' + missingNew.join(',') : ''}`);
console.log(`stale terms remaining: ${staleFound.length ? staleFound.join(' | ') : 'none'}`);

// ---- before/after diff preview ----
for (const pi of [...plan.keys()].sort((a, b) => a - b)) {
  console.log(`\n--- para ${pi} (edit ${plan.get(pi).e}) ---`);
  console.log(`OLD: ${paras[pi].text.slice(0, 220)}`);
  console.log(`NEW: ${plan.get(pi).text.slice(0, 220)}`);
}
