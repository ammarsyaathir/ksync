// perf/build-ch1-v7.mjs -- build Chapter 1 v7 from the v4 file
//
//   node perf/build-ch1-v7.mjs <v4.docx> <v7.docx>
//
// v4 is kept exactly as it is. Only these things change:
//   - the business-process picture and the six survey pictures are replaced by
//     the new headerless vector versions
//   - every survey picture gets a Word caption underneath (Arial 10)
//   - the six survey figures are numbered 1.2-1.7 (1.1 is the flowchart)
//   - numbered "Question N" wording is removed from the text
//   - citations and the reference list are restricted to 2023-2026
import fs from 'node:fs';
import JSZip from 'jszip';
import { PATCHES, FIGURES, FLOWCHART, REFS } from './ch1-edits-v7.mjs';

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) { console.error('usage: node perf/build-ch1-v7.mjs <in.docx> <out.docx>'); process.exit(2); }

const FIGDIR = 'perf/figures';
const EMU_PER_INCH = 914400;
const IMAGE_WIDTH_IN = 6.4;

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const norm = (s) => s.replace(/[\u2018\u2019\u201B\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();

const pngSize = (file) => {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

// ---------------------------------------------------------------- read source
const zipIn = await JSZip.loadAsync(fs.readFileSync(SRC));
let xml = await zipIn.file('word/document.xml').async('string');

const paras = [];
{
  const re = /<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const px = m[0];
    const text = unesc([...px.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));
    paras.push({ start: m.index, end: m.index + px.length, xml: px, text });
  }
}
console.log(`source paragraphs: ${paras.length}`);

const findIdx = (key, from = 0) => {
  const k = norm(key);
  for (let i = from; i < paras.length; i++) if (norm(paras[i].text).includes(k)) return i;
  return -1;
};

// ---------------------------------------------------------------- media
const relsXml = await zipIn.file('word/_rels/document.xml.rels').async('string');
let maxRid = 0;
for (const m of relsXml.matchAll(/Id="rId(\d+)"/g)) maxRid = Math.max(maxRid, Number(m[1]));
let mediaN = Object.keys(zipIn.files).filter((f) => /^word\/media\/image\d+\.(png|svg)$/.test(f)).length;

const relsAdd = [];
const mediaAdd = [];
const figureInfo = {};
let docPrId = 400;

function register(name) {
  if (figureInfo[name]) return figureInfo[name];
  const png = `${FIGDIR}/${name}.png`;
  const svg = `${FIGDIR}/${name}.svg`;
  if (!fs.existsSync(png)) throw new Error(`missing figure: ${png}`);
  const { w, h } = pngSize(png);
  const cx = Math.round(IMAGE_WIDTH_IN * EMU_PER_INCH);
  const cy = Math.round((cx * h) / w);
  maxRid += 1; mediaN += 1;
  const rid = `rId${maxRid}`;
  relsAdd.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${mediaN}.png"/>`);
  mediaAdd.push({ zipPath: `word/media/image${mediaN}.png`, file: png });
  let ridSvg = null;
  if (fs.existsSync(svg)) {
    maxRid += 1; mediaN += 1;
    ridSvg = `rId${maxRid}`;
    relsAdd.push(`<Relationship Id="${ridSvg}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${mediaN}.svg"/>`);
    mediaAdd.push({ zipPath: `word/media/image${mediaN}.svg`, file: svg });
  }
  figureInfo[name] = { rid, ridSvg, cx, cy, alt: name };
  return figureInfo[name];
}

function imageParagraph(info) {
  const name = esc(info.alt.replace(/_/g, ' '));
  const svgExt = info.ridSvg
    ? `<a:extLst><a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}">`
      + `<asvg:svgBlip xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="${info.ridSvg}"/>`
      + `</a:ext></a:extLst>`
    : '';
  return '<w:p><w:pPr><w:keepNext/><w:jc w:val="center"/><w:spacing w:before="200" w:after="0"/></w:pPr>'
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
    + ` r:embed="${info.rid}">${svgExt}</a:blip>`
    + '<a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
    + '<pic:spPr><a:xfrm><a:off x="0" y="0"/>'
    + `<a:ext cx="${info.cx}" cy="${info.cy}"/></a:xfrm>`
    + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
    + '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';
}

const FONT = '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>';
function captionParagraph(label, title) {
  return '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="240"/></w:pPr>'
    + `<w:r><w:rPr>${FONT}<w:b/><w:bCs/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>`
    + `<w:t xml:space="preserve">${esc(label)}:</w:t></w:r>`
    + `<w:r><w:rPr>${FONT}<w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>`
    + `<w:t xml:space="preserve"> ${esc(title)}</w:t></w:r></w:p>`;
}

// ---------------------------------------------------------------- paragraph shell
function paraShell(px) {
  const openTag = px.match(/^<w:p(?:\s[^>]*)?>/)[0];
  const pPr = px.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
  const run = px.match(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/);
  let rPr = '';
  if (run) { const rp = run[0].match(/<w:rPr>[\s\S]*?<\/w:rPr>/); if (rp) rPr = rp[0]; }
  return { openTag, pPr: pPr ? pPr[0] : '', rPr };
}
function rebuild(px, newText) {
  const { openTag, pPr, rPr } = paraShell(px);
  return `${openTag}${pPr}<w:r>${rPr}<w:t xml:space="preserve">${esc(newText)}</w:t></w:r></w:p>`;
}
function rPrItalic(rPr) {
  if (!rPr) return '<w:rPr><w:i/></w:rPr>';
  if (/<w:i\/>|<w:i\s/.test(rPr)) return rPr;
  return rPr.replace('</w:rPr>', '<w:i/></w:rPr>');
}
function runsXml(rPr, runs) {
  return runs.map((r) => `<w:r>${r.i ? rPrItalic(rPr) : rPr}<w:t xml:space="preserve">${esc(r.t)}</w:t></w:r>`).join('');
}

// ---------------------------------------------------------------- figures
const problems = [];
const drawings = [];
paras.forEach((p, i) => { if (p.xml.includes('<w:drawing>')) drawings.push(i); });
console.log(`pictures found: ${drawings.length} (expected 7)`);
if (drawings.length !== FIGURES.length + 1) problems.push(`expected ${FIGURES.length + 1} pictures, found ${drawings.length}`);

const plan = new Map();
if (drawings.length === FIGURES.length + 1) {
  plan.set(drawings[0], { figure: FLOWCHART.fig });
  register(FLOWCHART.fig);
  FIGURES.forEach((f, k) => {
    plan.set(drawings[k + 1], { figure: f.fig, label: f.label, title: f.title });
    register(f.fig);
  });
}

// ---------------------------------------------------------------- references
const refsIdx = findIdx('REFERENCES');
if (refsIdx < 0) problems.push('REFERENCES heading not found');
const refTplIdx = refsIdx + 1;
const refTpl = paras[refTplIdx] ? paras[refTplIdx].xml : null;
if (!refTpl) problems.push('reference template paragraph not found');

const refXml = [];
const refTexts = [];
if (refTpl) {
  const shell = paraShell(refTpl);
  for (const r of REFS) {
    refXml.push(`${shell.openTag}${shell.pPr}${runsXml(shell.rPr, r.runs)}</w:p>`);
    refTexts.push(r.runs.map((x) => x.t).join(''));
  }
}

// every paragraph after the REFERENCES heading is replaced by the new list
const drop = new Set();
for (let i = refsIdx + 1; i < paras.length; i++) drop.add(i);

// ---------------------------------------------------------------- patch engine
const rxEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function patchRegex(find) {
  let p = rxEsc(find)
    .replace(/'/g, "[\u2018\u2019']")
    .replace(/"/g, '[\u201C\u201D"]')
    .replace(/\u2013/g, '[\u2013\u2014]')
    .replace(/ /g, '\\s+');
  return new RegExp(p);
}
const patchCount = new Array(PATCHES.length).fill(0);

// ---------------------------------------------------------------- splice
let out = '';
let cursor = 0;
let insFig = 0, insCap = 0;
for (let i = 0; i < paras.length; i++) {
  const p = paras[i];
  out += xml.slice(cursor, p.start);
  cursor = p.end;
  if (drop.has(i)) continue;

  if (plan.has(i)) {
    const pl = plan.get(i);
    out += imageParagraph(figureInfo[pl.figure]);
    insFig++;
    if (pl.label) { out += captionParagraph(pl.label, pl.title); insCap++; }
    continue;
  }

  let text = p.text;
  PATCHES.forEach((pt, n) => {
    const rx = patchRegex(pt.find);
    if (!rx.test(text)) return;
    text = text.replace(rx, () => pt.replace);
    patchCount[n] += 1;
  });
  out += text === p.text ? p.xml : rebuild(p.xml, text);

  if (i === refsIdx && refXml.length) for (const x of refXml) out += x;
}
out += xml.slice(cursor);

PATCHES.forEach((p, n) => {
  if (patchCount[n] === 0) problems.push(`PATCH not applied: "${p.find.slice(0, 70)}"`);
});

// ---------------------------------------------------------------- package
const zipOut = await JSZip.loadAsync(fs.readFileSync(SRC));
zipOut.file('word/document.xml', out);
zipOut.file('word/_rels/document.xml.rels', relsXml.replace('</Relationships>', relsAdd.join('') + '</Relationships>'));
for (const m of mediaAdd) zipOut.file(m.zipPath, fs.readFileSync(m.file));
{
  const ct = await zipOut.file('[Content_Types].xml').async('string');
  if (!/Extension="svg"/i.test(ct)) {
    zipOut.file('[Content_Types].xml', ct.replace('</Types>', '<Default Extension="svg" ContentType="image/svg+xml"/></Types>'));
  }
}
fs.writeFileSync(OUT, await zipOut.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));

// ---------------------------------------------------------------- verify
const vzip = await JSZip.loadAsync(fs.readFileSync(OUT));
const vxml = await vzip.file('word/document.xml').async('string');
const vcat = norm(unesc([...vxml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join('')));

console.log(`\nfigures replaced ${insFig} | captions added ${insCap} | reference entries ${refXml.length}`);
console.log(`output -> ${OUT}`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); problems.forEach((p) => console.log('  ' + p)); }
else console.log('problems: none');

const missingRefs = refTexts.filter((t) => !vcat.includes(norm(t)));
console.log(`references present: ${refTexts.length - missingRefs.length}/${refTexts.length}`);
const patchOk = patchCount.filter((c) => c > 0).length;
console.log(`patches applied: ${patchOk}/${PATCHES.length}`);

const oldNames = ['Bucher', 'Castillo', 'Eppler', 'Fletcher', 'Gillespie', 'Hwang', 'Majerczak', 'Suzor', 'Wasko', 'Zubiaga'];
const found = oldNames.filter((t) => vcat.includes(t));
console.log(`pre-2023 author names remaining: ${found.length ? found.join(' | ') : 'none'}`);
const qnums = [...vcat.matchAll(/Questions?\s+\d+/g)].map((m) => m[0]);
console.log(`"Question N" wording remaining: ${qnums.length ? [...new Set(qnums)].join(' | ') : 'none'}`);
const figRefs = [...new Set([...vcat.matchAll(/Figure\s+1\.\d/g)].map((m) => m[0]))].sort();
console.log(`figure references: ${figRefs.join(' | ')}`);
const tabRefs = [...new Set([...vcat.matchAll(/Table\s+1\.\d/g)].map((m) => m[0]))].sort();
console.log(`table references: ${tabRefs.join(' | ')}`);
const years = [...new Set([...vcat.matchAll(/\((19|20)\d\d\)/g)].map((m) => m[0]))].sort();
console.log(`years present: ${years.join(' ')}`);

const bal = (tag) => {
  const o = (vxml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g')) || []).length;
  const c = (vxml.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  return o === c ? 'ok' : `MISMATCH ${o}/${c}`;
};
console.log(`drawings ${(vxml.match(/<w:drawing>/g) || []).length} | tables ${(vxml.match(/<w:tbl>/g) || []).length} | svgBlip ${(vxml.match(/svgBlip/g) || []).length}`);
console.log(`xml balance: p ${bal('w:p')} r ${bal('w:r')} tbl ${bal('w:tbl')} tc ${bal('w:tc')}`);
