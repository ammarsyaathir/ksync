// perf/build-ch1-v6.mjs -- build Chapter 1 v6 (.docx)
//
//   node perf/build-ch1-v6.mjs <in.docx> <out.docx>
//
// Differences from the v4 builder:
//   - removes whole tables (the two questionnaire tables are replaced by figures)
//   - DELETE_BETWEEN: drop every paragraph between two anchor headings
//   - AFTER: insert new paragraphs, figures and captions after an anchor heading
//   - every figure gets a Word caption (Arial 10, "Figure 1.x:" bold)
//   - figures are embedded as PNG + SVG so they can be converted to editable
//     shapes in Word (right-click -> Convert to Shape)
import fs from 'node:fs';
import JSZip from 'jszip';
import { REPLACE, DELETE_BETWEEN, DROP_TABLES, AFTER, REFS, FIGURE_SWAP } from './ch1-edits-v6.mjs';

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) { console.error('usage: node perf/build-ch1-v6.mjs <in.docx> <out.docx>'); process.exit(2); }

const FIGDIR = 'perf/figures';
const EMU_PER_INCH = 914400;
const IMAGE_WIDTH_IN = 6.4;
const EMBED_SVG = true;

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const norm = (s) => s.replace(/[\u2018\u2019\u201B\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();

const pngSize = (file) => {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

// ---------------------------------------------------------------- read source
const zipIn = await JSZip.loadAsync(fs.readFileSync(SRC));
let xml = await zipIn.file('word/document.xml').async('string');

// ---- drop whole tables (keep document order of everything else)
{
  const spans = [];
  let m;
  const re = /<w:tbl(?:\s[^>]*)?>[\s\S]*?<\/w:tbl>/g;
  while ((m = re.exec(xml)) !== null) spans.push({ start: m.index, end: m.index + m[0].length });
  const drop = DROP_TABLES.map((i) => spans[i]).filter(Boolean).sort((a, b) => b.start - a.start);
  for (const s of drop) xml = xml.slice(0, s.start) + xml.slice(s.end);
  console.log(`tables dropped: ${drop.length} of ${spans.length}`);
}

const paras = [];
{
  let m;
  const re = /<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  while ((m = re.exec(xml)) !== null) {
    const px = m[0];
    const text = unesc([...px.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(''));
    paras.push({ start: m.index, end: m.index + px.length, xml: px, text });
  }
}
console.log(`source paragraphs after table removal: ${paras.length}`);

const findIdx = (key, from = 0) => {
  const k = norm(key);
  for (let i = from; i < paras.length; i++) if (norm(paras[i].text).includes(k)) return i;
  return -1;
};
const findUnique = (key) => {
  const k = norm(key);
  const hits = [];
  for (let i = 0; i < paras.length; i++) if (norm(paras[i].text).includes(k)) hits.push(i);
  return hits;
};

// ---------------------------------------------------------------- deletions
const drop = new Set();
const problems = [];
for (const rule of DELETE_BETWEEN) {
  const a = findIdx(rule.from);
  if (a < 0) { problems.push(`ANCHOR missing "${rule.from}"`); continue; }
  const b = rule.to === null ? paras.length : findIdx(rule.to, a + 1);
  if (b < 0) { problems.push(`ANCHOR missing "${rule.to}"`); continue; }
  for (let i = a + 1; i < b; i++) drop.add(i);
  console.log(`delete ${b - a - 1} paragraph(s): "${rule.from.slice(0, 34)}" .. "${(rule.to || 'END').slice(0, 34)}"`);
}

// ---------------------------------------------------------------- replacements
const plan = new Map();
REPLACE.forEach((e, n) => {
  const hits = findUnique(e.key).filter((i) => !drop.has(i));
  if (hits.length === 0) return problems.push(`MISS [${n}] "${e.key.slice(0, 60)}"`);
  if (hits.length > 1) return problems.push(`AMBIG x${hits.length} [${n}] "${e.key.slice(0, 60)}" -> ${hits.join(',')}`);
  plan.set(hits[0], e.capLabel ? { cap: [e.capLabel, e.capTitle] } : { text: e.text });
});

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
  const zipPath = `word/media/image${mediaN}.png`;
  relsAdd.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${mediaN}.png"/>`);
  mediaAdd.push({ zipPath, file: png });
  let ridSvg = null;
  if (EMBED_SVG && fs.existsSync(svg)) {
    maxRid += 1; mediaN += 1;
    ridSvg = `rId${maxRid}`;
    const svgZip = `word/media/image${mediaN}.svg`;
    relsAdd.push(`<Relationship Id="${ridSvg}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${mediaN}.svg"/>`);
    mediaAdd.push({ zipPath: svgZip, file: svg });
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
  return '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="160" w:after="0"/></w:pPr>'
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
  return '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="220"/></w:pPr>'
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
function newParaFrom(templateXml, text) {
  const { openTag, pPr, rPr } = paraShell(templateXml);
  return `${openTag}${pPr}<w:r>${rPr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

// body template: use the paragraph right after the 1.2 heading (body style)
const bodyTplIdx = findIdx('Difficulty Discovering K-pop Event Information Across Multiple Platforms') + 1;
const bodyTpl = paras[bodyTplIdx] ? paras[bodyTplIdx].xml : null;

// ---------------------------------------------------------------- insertions
const afterXml = new Map();      // idx -> [xml strings]
const afterText = new Map();
const figurePlan = [];

for (const block of AFTER) {
  const idx = findIdx(block.key);
  if (idx < 0) { problems.push(`AFTER anchor missing "${block.key}"`); continue; }
  const chunks = [];
  for (const c of block.chunks) {
    if (c.para !== undefined) {
      if (!bodyTpl) throw new Error('no body paragraph template found');
      chunks.push(newParaFrom(bodyTpl, c.para));
    } else if (c.fig) {
      const info = register(c.fig);
      figurePlan.push({ name: c.fig, h: info.cy / EMU_PER_INCH });
      chunks.push(imageParagraph(info));
      if (c.cap) chunks.push(captionParagraph(c.cap, c.title));
    }
  }
  afterXml.set(idx, (afterXml.get(idx) || []).concat(chunks));
}

// ---------------------------------------------------------------- references
// ------------------------------------------------ replace existing pictures
for (const sw of FIGURE_SWAP) {
  const ci = findIdx(sw.beforeCaption);
  if (ci < 0) { problems.push(`SWAP caption missing "${sw.beforeCaption.slice(0, 40)}"`); continue; }
  const ti = ci - 1;
  if (!paras[ti] || !paras[ti].xml.includes('<w:drawing>')) {
    problems.push(`SWAP target above "${sw.beforeCaption.slice(0, 30)}" is not a picture`);
    continue;
  }
  if (drop.has(ti)) { problems.push('SWAP target is inside a deleted range'); continue; }
  plan.set(ti, { figure: sw.fig });
  register(sw.fig);
}

const refsIdx = findIdx('REFERENCES');
if (refsIdx < 0) problems.push('REFERENCES heading not found');
const refTplIdx = refsIdx + 1;
const refTpl = paras[refTplIdx] ? paras[refTplIdx].xml : null;
const refXml = [];
const refTexts = [];
if (refTpl) {
  for (const r of REFS) {
    const shell = paraShell(refTpl);
    const pPr = shell.pPr.replace(/w:after="\d+"/, 'w:after="60"').replace(/w:line="\d+"/, 'w:line="264"');
    refXml.push(`${shell.openTag}${pPr}${runsXml(shell.rPr, r.runs)}</w:p>`);
    refTexts.push(r.runs.map((x) => x.t).join(''));
  }
} else problems.push('reference template paragraph not found');
afterXml.set(refsIdx, (afterXml.get(refsIdx) || []).concat(refXml));


// keep a caption together with its table, and never split a table row
const withKeepNext = (px) => px.includes('<w:pPr>')
  ? px.replace('<w:pPr>', '<w:pPr><w:keepNext/>')
  : px.replace(/^(<w:p(?:\s[^>]*)?>)/, '$1<w:pPr><w:keepNext/></w:pPr>');

function keepTableTogether(xml, marker) {
  const ti = xml.indexOf(marker);
  if (ti < 0) return xml;
  const start = xml.indexOf('<w:tbl>', ti);
  if (start < 0) return xml;
  const end = xml.indexOf('</w:tbl>', start) + '</w:tbl>'.length;
  let tbl = xml.slice(start, end);
  const rows = [...tbl.matchAll(/<w:tr(?:\s[^>]*)?>[\s\S]*?<\/w:tr>/g)];
  for (let i = 0; i < rows.length; i++) {
    const orig = rows[i][0];
    let row = orig.includes('<w:trPr>')
      ? orig.replace('<w:trPr>', '<w:trPr><w:cantSplit/>')
      : orig.replace(/^(<w:tr(?:\s[^>]*)?>)/, '$1<w:trPr><w:cantSplit/></w:trPr>');
    if (i < rows.length - 1) {
      row = row.replace(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g, (px) => withKeepNext(px));
    }
    tbl = tbl.replace(orig, row);
  }
  return xml.slice(0, start) + tbl + xml.slice(end);
}

// ---------------------------------------------------------------- splice
let out = '';
let cursor = 0;
let kept = 0, del = 0, rep = 0, insFig = 0, insPara = 0;
for (let i = 0; i < paras.length; i++) {
  const p = paras[i];
  out += xml.slice(cursor, p.start);
  cursor = p.end;
  if (drop.has(i)) { del++; }
  else {
    if (norm(p.text) === 'REFERENCES') {
      out += p.xml.replace('<w:pPr>', '<w:pPr><w:pageBreakBefore/>');
      kept++;
      const extra0 = afterXml.get(i);
      if (extra0) for (const x of extra0) out += x;
      continue;
    }
    if (plan.has(i)) {
      const pl = plan.get(i);
      if (pl.figure) out += imageParagraph(figureInfo[pl.figure]);
      else if (pl.cap) out += captionParagraph(pl.cap[0], pl.cap[1]);
      else {
        const nx = rebuild(p.xml, pl.text);
        out += (/^Table 1\.\d:/.test(pl.text) ? withKeepNext(nx) : nx);
      }
      rep++;
    }
    else out += (/^Table 1\.\d:/.test(p.text) ? withKeepNext(p.xml) : p.xml);
    kept++;
    const extra = afterXml.get(i);
    if (extra) {
      for (const x of extra) {
        out += x;
        if (x.startsWith('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="160"')) insFig++;
        else if (x.includes('<w:drawing>')) insFig++;
        else insPara++;
      }
    }
  }
}
out += xml.slice(cursor);
out = keepTableTogether(out, 'Table 1.1: Alignment between problem statements');
out = keepTableTogether(out, 'Table 1.2: Outline of the thesis');

// ---------------------------------------------------------------- package
const zipOut = await JSZip.loadAsync(fs.readFileSync(SRC));
zipOut.file('word/document.xml', out);
zipOut.file('word/_rels/document.xml.rels', relsXml.replace('</Relationships>', relsAdd.join('') + '</Relationships>'));
for (const m of mediaAdd) zipOut.file(m.zipPath, fs.readFileSync(m.file));
if (EMBED_SVG) {
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

console.log(`\nkept ${kept} | deleted ${del} | replaced ${rep} | figures ${figurePlan.length} | reference entries ${refXml.length}`);
console.log(`output -> ${OUT}`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); problems.forEach((p) => console.log('  ' + p)); }
else console.log('problems: none');

const missingRefs = refTexts.filter((t) => !vcat.includes(norm(t)));
console.log(`references present: ${refTexts.length - missingRefs.length}/${refTexts.length}`);
const missingNew = REPLACE.filter((e) => e.text && !vcat.includes(norm(e.text).slice(0, 60)));
console.log(`replacement text present: ${REPLACE.length - missingNew.length}/${REPLACE.length}`);

const stale = ['Hono', 'Supabase', 'Cloudflare', 'PostgreSQL', 'MongoDB', 'audit log',
  'Bucher', 'Castillo', 'Eppler', 'Fletcher', 'Gillespie', 'Hwang', 'Suzor', 'Wasko', 'Zubiaga',
  'Question 7', 'Question 8', 'Question 11', 'Question 16', 'Question 22', 'Question 25',
  'Table 1.3:', 'Table 1.4:', 'Firebase Admin SDK'];
const staleFound = stale.filter((t) => vcat.includes(norm(t)));
console.log(`stale terms remaining: ${staleFound.length ? staleFound.join(' | ') : 'none'}`);

const years = [...new Set([...vcat.matchAll(/\((19|20)\d\d\)/g)].map((m) => m[0]))].sort();
console.log(`reference years present: ${years.join(' ')}`);

const bal = (tag) => {
  const o = (vxml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g')) || []).length;
  const c = (vxml.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  return o === c ? 'ok' : `MISMATCH ${o}/${c}`;
};
console.log(`drawings ${(vxml.match(/<w:drawing>/g) || []).length} | tables ${(vxml.match(/<w:tbl>/g) || []).length} | svgBlip ${(vxml.match(/svgBlip/g) || []).length}`);
console.log(`xml balance: p ${bal('w:p')} r ${bal('w:r')} tbl ${bal('w:tbl')} tc ${bal('w:tc')}`);
