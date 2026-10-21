// perf/build-ch1-v4.mjs — build the final Chapter 1 .docx (v4)
//
//   node perf/build-ch1-v4.mjs <in.docx> <out.docx>
//
// Applies perf/ch1-edits-v4.mjs and inserts survey figures + new reference
// paragraphs. The source file is never modified.
//
// v4 additions over v3:
//   - NEW_PARAS: insert brand-new paragraphs (used for the reference list) after
//     a given source paragraph, cloning the paragraph formatting of a template
//     and supporting italic runs (journal / book titles).
//   - REF_REWRITE entries in EDITS may carry `runs` instead of `text`.
//   - IMAGE_WIDTH_IN raised to 6.4 (figures are also drawn larger).
import fs from 'node:fs';
import JSZip from 'jszip';
import { EDITS, INSERTS, NEW_PARAS } from './ch1-edits-v4.mjs';

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) { console.error('usage: node perf/build-ch1-v4.mjs <in.docx> <out.docx>'); process.exit(2); }

const FIGDIR = 'perf/figures';
const EMU_PER_INCH = 914400;
const IMAGE_WIDTH_IN = 6.4;

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const norm = (s) => s.replace(/[\u2018\u2019\u201B\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();

const pngSize = (file) => {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

// ---------------------------------------------------------------- read source
const zipIn = await JSZip.loadAsync(fs.readFileSync(SRC));
const xml = await zipIn.file('word/document.xml').async('string');

const tables = [];
{
  let m;
  const re = /<w:tbl(?:\s[^>]*)?>[\s\S]*?<\/w:tbl>/g;
  while ((m = re.exec(xml)) !== null) tables.push({ start: m.index, end: m.index + m[0].length });
}

const paras = [];
{
  let m;
  const re = /<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  while ((m = re.exec(xml)) !== null) {
    const px = m[0];
    const text = unesc([...px.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));
    const ti = tables.findIndex((t) => m.index > t.start && m.index < t.end);
    paras.push({ start: m.index, end: m.index + px.length, xml: px, text, tableIndex: ti < 0 ? null : ti });
  }
}
console.log(`source : ${SRC}`);
console.log(`paragraphs: ${paras.length}   tables: ${tables.length}   edits: ${EDITS.length}   figure groups: ${INSERTS.length}   ref blocks: ${NEW_PARAS.length}`);

// ---------------------------------------------------------------- run helpers
function paraShell(px) {
  const openTag = px.match(/^<w:p(?:\s[^>]*)?>/)[0];
  const pPr = px.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
  const run = px.match(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/);
  let rPr = '';
  if (run) { const rp = run[0].match(/<w:rPr>[\s\S]*?<\/w:rPr>/); if (rp) rPr = rp[0]; }
  return { openTag, pPr: pPr ? pPr[0] : '', rPr };
}
function rPrItalic(rPr) {
  if (!rPr) return '<w:rPr><w:i/></w:rPr>';
  if (/<w:i\/>|<w:i\s/.test(rPr)) return rPr;
  if (rPr.includes('<w:color')) return rPr.replace('<w:color', '<w:i/><w:color');
  return rPr.replace('</w:rPr>', '<w:i/></w:rPr>');
}
function runsXml(rPr, runs) {
  return runs.map((r) => {
    const pr = r.i ? rPrItalic(rPr) : rPr;
    return `<w:r>${pr}<w:t xml:space="preserve">${esc(r.t)}</w:t></w:r>`;
  }).join('');
}
const runsText = (runs) => runs.map((r) => r.t).join('');

function rebuild(px, newText) {
  const { openTag, pPr, rPr } = paraShell(px);
  return `${openTag}${pPr}<w:r>${rPr}<w:t xml:space="preserve">${esc(newText)}</w:t></w:r></w:p>`;
}
function rebuildRuns(px, runs) {
  const { openTag, pPr, rPr } = paraShell(px);
  return `${openTag}${pPr}${runsXml(rPr, runs)}</w:p>`;
}

// ---------------------------------------------------------------- match edits
const problems = [];
const plan = new Map();
for (let e = 0; e < EDITS.length; e++) {
  const edit = EDITS[e];
  const k = norm(edit.key);
  let found = [];
  for (let i = 0; i < paras.length; i++) {
    if (edit.inTable !== undefined && paras[i].tableIndex !== edit.inTable) continue;
    if (norm(paras[i].text).includes(k)) found.push(i);
  }
  if (found.length === 0) { problems.push(`MISS      [${e}] ${edit.inTable !== undefined ? 'T' + edit.inTable + ' ' : ''}"${edit.key.slice(0, 64)}"`); continue; }
  if (edit.occurrence) {
    const pick = found[edit.occurrence - 1];
    if (pick === undefined) { problems.push(`OCCURRENCE[${e}] wanted #${edit.occurrence} of "${edit.key.slice(0, 40)}" but only ${found.length} matched`); continue; }
    found = [pick];
  }
  if (found.length > 1) { problems.push(`AMBIG x${found.length} [${e}] "${edit.key.slice(0, 64)}" -> paras ${found.join(', ')}`); continue; }
  const pi = found[0];
  if (plan.has(pi)) { problems.push(`CONFLICT  [${e}] paragraph ${pi} already targeted by edit ${plan.get(pi).e}`); continue; }
  plan.set(pi, { e, text: edit.text, runs: edit.runs });
}

// ---------------------------------------------------------------- media + rels
const relsXml = await zipIn.file('word/_rels/document.xml.rels').async('string');
let maxRid = 0;
for (const m of relsXml.matchAll(/Id="rId(\d+)"/g)) maxRid = Math.max(maxRid, Number(m[1]));
let mediaCount = Object.keys(zipIn.files).filter((f) => /^word\/media\/image\d+\.png$/.test(f)).length;
let docPrId = 100;

const relsAdd = [];
const mediaAdd = [];
const figureInfo = {};

for (const group of INSERTS) {
  for (const name of group.figures) {
    const file = `${FIGDIR}/${name}.png`;
    if (!fs.existsSync(file)) throw new Error(`missing figure: ${file}`);
    const { w, h } = pngSize(file);
    const cx = Math.round(IMAGE_WIDTH_IN * EMU_PER_INCH);
    const cy = Math.round((cx * h) / w);
    maxRid += 1; mediaCount += 1; docPrId += 1;
    const rid = `rId${maxRid}`;
    const zipPath = `word/media/image${mediaCount}.png`;
    relsAdd.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${mediaCount}.png"/>`);
    mediaAdd.push({ zipPath, file });
    figureInfo[name] = { rid, zipPath, cx, cy, alt: name };
  }
}
console.log(`\nimages to embed: ${mediaAdd.length}`);
for (const [n, i] of Object.entries(figureInfo)) console.log(`  ${n}  ${i.rid}  ${i.zipPath}  ${(i.cx / EMU_PER_INCH).toFixed(2)}in x ${(i.cy / EMU_PER_INCH).toFixed(2)}in`);

function imageParagraph(info) {
  const name = esc(info.alt.replace(/_/g, ' '));
  return '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="200" w:after="80"/></w:pPr>'
    + '<w:r><w:drawing>'
    + '<wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0">'
    + `<wp:extent cx="${info.cx}" cy="${info.cy}"/>`
    + '<wp:effectExtent l="0" t="0" r="0" b="0"/>'
    + `<wp:docPr id="${docPrId++}" name="${name}" descr="${name}"/>`
    + '<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
    + '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
    + '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    + '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    + `<pic:nvPicPr><pic:cNvPr id="${docPrId}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr>`
    + '<pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
    + ` r:embed="${info.rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`
    + '<pic:spPr><a:xfrm><a:off x="0" y="0"/>'
    + `<a:ext cx="${info.cx}" cy="${info.cy}"/></a:xfrm>`
    + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
    + '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';
}

// new reference paragraphs, built from the template paragraph's formatting
const newParaXml = {};
const newParaText = [];
for (const block of NEW_PARAS) {
  const tpl = paras[block.templatePara];
  if (!tpl) throw new Error(`NEW_PARAS template paragraph ${block.templatePara} not found`);
  const list = [];
  for (const p of block.paras) {
    list.push(`${tpl.xml.match(/^<w:p(?:\s[^>]*)?>/)[0]}${paraShell(tpl.xml).pPr}${runsXml(paraShell(tpl.xml).rPr, p.runs)}</w:p>`);
    newParaText.push(runsText(p.runs));
  }
  newParaXml[block.afterPara] = (newParaXml[block.afterPara] || []).concat(list);
}

// ---------------------------------------------------------------- splice
let out = '';
let cursor = 0;
let inserted = 0;
let refsAdded = 0;
for (let i = 0; i < paras.length; i++) {
  const p = paras[i];
  out += xml.slice(cursor, p.start);
  if (plan.has(i)) {
    const pl = plan.get(i);
    out += pl.runs ? rebuildRuns(p.xml, pl.runs) : rebuild(p.xml, pl.text);
  } else out += p.xml;
  cursor = p.end;
  const group = INSERTS.find((g) => g.afterPara === i);
  if (group) for (const fname of group.figures) { out += imageParagraph(figureInfo[fname]); inserted++; }
  if (newParaXml[i]) for (const px of newParaXml[i]) { out += px; refsAdded++; }
}
out += xml.slice(cursor);

// ---------------------------------------------------------------- write package
const zipOut = await JSZip.loadAsync(fs.readFileSync(SRC));
zipOut.file('word/document.xml', out);
zipOut.file('word/_rels/document.xml.rels', relsXml.replace('</Relationships>', relsAdd.join('') + '</Relationships>'));
for (const m of mediaAdd) zipOut.file(m.zipPath, fs.readFileSync(m.file));
fs.writeFileSync(OUT, await zipOut.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));

// ---------------------------------------------------------------- verify
const vzip = await JSZip.loadAsync(fs.readFileSync(OUT));
const vxml = await vzip.file('word/document.xml').async('string');
const vtext = unesc([...vxml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join('\u0000'));
const vNorm = norm(vtext.replace(/\u0000/g, ' '));
const vParas = (vxml.match(/<w:p(?:\s[^>]*)?>/g) || []).length;
const vDraw = (vxml.match(/<w:drawing>/g) || []).length;
const vRels = await vzip.file('word/_rels/document.xml.rels').async('string');

console.log(`\napplied: ${plan.size}/${EDITS.length}   figures inserted: ${inserted}/${INSERTS.reduce((a, g) => a + g.figures.length, 0)}   references inserted: ${refsAdded}`);
console.log(`output -> ${OUT}`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); problems.forEach((p) => console.log('  ' + p)); }
else console.log('problems: none — every edit key matched exactly one paragraph.');

const missingNew = [];
for (let e = 0; e < EDITS.length; e++) {
  const pl = plan.get([...plan.entries()].find(([, v]) => v.e === e)?.[0]);
  const wanted = EDITS[e].runs ? runsText(EDITS[e].runs) : EDITS[e].text;
  if (!wanted) continue;
  if (!vNorm.includes(norm(wanted).slice(0, 60))) missingNew.push(e);
}
console.log(`new text present: ${EDITS.length - missingNew.length}/${EDITS.length}${missingNew.length ? '  MISSING ' + missingNew.join(',') : ''}`);

const missingRefs = (() => {
  // concatenate WITHOUT separators so run boundaries do not introduce spaces
  const vcat = norm(unesc([...vxml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join('')));
  return newParaText.filter((t) => !vcat.includes(norm(t)));
})();
console.log(`reference entries present: ${newParaText.length - missingRefs.length}/${newParaText.length}${missingRefs.length ? '\n  MISSING: ' + missingRefs.map((t) => t.slice(0, 40)).join(' | ') : ''}`);
console.log(`italic runs in output: ${(vxml.match(/<w:i\/>/g) || []).length}`);

const stale = [
  'Hono', 'Supabase', 'Cloudflare', 'PostgreSQL', 'MongoDB', 'searchable content', 'topic-based',
  '30 K-pop fans', 'includes only 30 respondents', '83.3%', '56.7%', '36.7%', '16.7%', '40.0%', '45.1%',
  '70% of respondents', '51 respondents', '51 K-pop fans', 'questionnaire completed by 51',
  'Question 24', 'Questions 24',
  '84.3%', '60.8%', '58.8%', '49.0%', '35.3%', '74.5%', '47.1%', '52.9%', '37.3%', '56.9%', '68.6%', '64.7%', '54.9%', '31.4%',
  'audit log', 'administrative audit records',
  'organise', 'organised', 'organising', 'generalised', 'disorganised', 'summarised',
];
const staleFound = stale.filter((t) => vNorm.includes(norm(t.replace(/'/g, ''))));
console.log(`stale terms remaining: ${staleFound.length ? staleFound.join(' | ') : 'none'}`);

const bal = (tag) => {
  const o = (vxml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g')) || []).length;
  const c = (vxml.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  return { o, c, ok: o === c };
};
const checks = ['w:p', 'w:r', 'w:tbl', 'w:tr', 'w:tc', 'w:drawing', 'wp:inline', 'pic:pic', 'a:graphic'];
let allOk = true;
console.log('\nstructure:');
for (const t of checks) { const b = bal(t); if (!b.ok) allOk = false; console.log(`  ${t.padEnd(12)} open=${String(b.o).padStart(3)} close=${String(b.c).padStart(3)} ${b.ok ? 'ok' : '*** UNBALANCED ***'}`); }
console.log(`  paragraphs ${paras.length} -> ${vParas}   drawings ${(xml.match(/<w:drawing>/g) || []).length} -> ${vDraw}   image rels ${(vRels.match(/relationships\/image/g) || []).length}`);
console.log(`  xml balance: ${allOk ? 'ok' : '*** FAILED ***'}`);

// dump the data tables from the output
const oTbls = [...vxml.matchAll(/<w:tbl(?:\s[^>]*)?>[\s\S]*?<\/w:tbl>/g)].slice(0, 2);
oTbls.forEach((t, ti) => {
  console.log(`\n--- output table ${ti} ---`);
  for (const r of t[0].matchAll(/<w:tr(?:\s[^>]*)?>[\s\S]*?<\/w:tr>/g)) {
    const cells = [...r[0].matchAll(/<w:tc(?:\s[^>]*)?>[\s\S]*?<\/w:tc>/g)].map((c) =>
      unesc([...c[0].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((x) => x[1]).join('')));
    console.log('   ' + cells.join(' | '));
  }
});
