// perf/make-flowchart.mjs -- rebuild the "current business process" figure as a
// clean vector diagram (SVG + PNG + .drawio) so it can be edited by hand.
//
//   node perf/make-flowchart.mjs
import fs from 'node:fs';
import sharp from 'sharp';

const OUT = 'perf/figures';
const W = 920, H = 650;

const INK = '#243247', LINE = '#6b7c93';
const BOX_FILL = '#eef3f9', BOX_LINE = '#8296ad';
const DIA_FILL = '#fdf6e4', DIA_LINE = '#c9a227';
const BAD_FILL = '#fdeeee', BAD_LINE = '#c98b8b';
const OK_FILL = '#eef7ee', OK_LINE = '#7fa87f';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const nodes = [
  { id: 'n1', kind: 'box', x: 250, y: 18, w: 420, h: 56, lines: ['Event organizer or fan community', 'publishes an announcement'] },
  { id: 'n2', kind: 'box', x: 250, y: 104, w: 420, h: 56, lines: ['Information appears across separate platforms', '(X, Instagram, TikTok, Telegram and websites)'] },
  { id: 'n3', kind: 'box', x: 250, y: 190, w: 420, h: 56, lines: ['Fan searches and compares event details', 'across sources'] },
  { id: 'n4', kind: 'box', x: 250, y: 276, w: 420, h: 56, lines: ['Fan uses group chats or community posts to ask', 'questions and look for previous answers'] },
  { id: 'n5', kind: 'diamond', cx: 460, cy: 406, hw: 190, hh: 62, lines: ['Are complete and current details', 'easy to find and confirm?'] },
  { id: 'n6', kind: 'box', x: 90, y: 506, w: 330, h: 64, fill: BAD_FILL, stroke: BAD_LINE, lines: ['Fan searches other posts, revisits sources,', 'or asks the same question again'] },
  { id: 'n7', kind: 'box', x: 490, y: 506, w: 330, h: 64, fill: OK_FILL, stroke: OK_LINE, lines: ['Fan uses the information found', 'to plan attendance'] },
];

const edges = [
  { from: 'n1', to: 'n2', path: 'M460,74 L460,96' },
  { from: 'n2', to: 'n3', path: 'M460,160 L460,182' },
  { from: 'n3', to: 'n4', path: 'M460,246 L460,268' },
  { from: 'n4', to: 'n5', path: 'M460,332 L460,344' },
  { from: 'n5', to: 'n6', path: 'M270,406 L220,406 L220,498' },
  { from: 'n5', to: 'n7', path: 'M650,406 L700,406 L700,498' },
  { from: 'n6', to: 'n3', path: 'M90,538 L48,538 L48,218 L242,218', dashed: false },
];

const p = [];
p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
p.push('<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
  + `<path d="M0,1 L9,5 L0,9 z" fill="${LINE}"/></marker></defs>`);
p.push(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
p.push(`<text x="${W / 2}" y="34" font-family="Arial" font-size="21" font-weight="bold" fill="${INK}" text-anchor="middle">How fans currently find, discuss and confirm K-pop event information</text>`);
p.push('<g transform="translate(0,50)">');

const TY = 16;         // node type size
const LH = 21;         // line height

for (const n of nodes) {
  if (n.kind === 'box') {
    const fill = n.fill || BOX_FILL, stroke = n.stroke || BOX_LINE;
    p.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="13" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`);
    const cy = n.y + n.h / 2;
    n.lines.forEach((ln, i) => {
      const y = cy + (i - (n.lines.length - 1) / 2) * LH + TY * 0.35;
      p.push(`<text x="${n.x + n.w / 2}" y="${y}" font-family="Arial" font-size="${TY}" fill="${INK}" text-anchor="middle">${esc(ln)}</text>`);
    });
  } else {
    const { cx, cy, hw, hh } = n;
    p.push(`<polygon points="${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}" fill="${DIA_FILL}" stroke="${DIA_LINE}" stroke-width="1.6"/>`);
    n.lines.forEach((ln, i) => {
      const y = cy + (i - (n.lines.length - 1) / 2) * LH + TY * 0.35;
      p.push(`<text x="${cx}" y="${y}" font-family="Arial" font-size="${TY}" fill="${INK}" text-anchor="middle">${esc(ln)}</text>`);
    });
  }
}

for (const e of edges) {
  p.push(`<path d="${e.path}" fill="none" stroke="${LINE}" stroke-width="1.6" marker-end="url(#ah)"/>`);
}

p.push(`<text x="262" y="394" font-family="Arial" font-size="15" fill="${LINE}" text-anchor="end">No</text>`);
p.push(`<text x="662" y="394" font-family="Arial" font-size="15" fill="${LINE}" text-anchor="start">Yes</text>`);
p.push('</g>');
p.push('</svg>');

const svg = p.join('');
fs.writeFileSync(`${OUT}/Figure_1_1_business_process.svg`, svg, 'utf8');
const png = await sharp(Buffer.from(svg), { density: 144 }).png({ compressionLevel: 9 }).toBuffer();
fs.writeFileSync(`${OUT}/Figure_1_1_business_process.png`, png);
const meta = await sharp(png).metadata();
console.log(`Figure_1_1_business_process.png ${meta.width}x${meta.height} ${(png.length / 1024).toFixed(1)} KB`);

// ------------------------------------------------------------------ .drawio
const htm = (lines) => lines.join('&lt;br&gt;');
const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>',
  '<mxCell id="h1" value="How fans currently find, discuss and confirm K-pop event information" style="text;html=1;align=left;verticalAlign=middle;fontSize=14;fontStyle=1;fontFamily=Arial;" vertex="1" parent="1"><mxGeometry x="0" y="0" width="700" height="30" as="geometry"/></mxCell>'];
for (const n of nodes) {
  const style = n.kind === 'diamond'
    ? `rhombus;whiteSpace=wrap;html=1;fillColor=${DIA_FILL};strokeColor=${DIA_LINE};fontSize=13;fontFamily=Arial;`
    : `rounded=1;whiteSpace=wrap;html=1;arcSize=18;fillColor=${n.fill || BOX_FILL};strokeColor=${n.stroke || BOX_LINE};fontSize=13;fontFamily=Arial;`;
  const g = n.kind === 'diamond'
    ? { x: n.cx - n.hw, y: n.cy - n.hh, w: n.hw * 2, h: n.hh * 2 }
    : { x: n.x, y: n.y, w: n.w, h: n.h };
  cells.push(`<mxCell id="${n.id}" value="${htm(n.lines)}" style="${style}" vertex="1" parent="1">`
    + `<mxGeometry x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" as="geometry"/></mxCell>`);
}
edges.forEach((e, i) => {
  const pts = e.path.replace(/^M/, '').trim().split(/\s*L\s*/).map((s) => s.split(',').map(Number));
  const way = pts.slice(1, -1).map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('');
  const geo = way ? `<mxGeometry relative="1" as="geometry"><Array as="points">${way}</Array></mxGeometry>` : '<mxGeometry relative="1" as="geometry"/>';
  cells.push(`<mxCell id="e${i + 1}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;" edge="1" parent="1" source="${e.from}" target="${e.to}">${geo}</mxCell>`);
});
const drawio = '<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" type="device">'
  + '<diagram id="bp1" name="Current business process"><mxGraphModel dx="1100" dy="760" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="826" math="0" shadow="0"><root>'
  + cells.join('') + '</root></mxGraphModel></diagram></mxfile>\n';
fs.writeFileSync('docs/diagrams/current_business_process.drawio', drawio, 'utf8');
console.log('docs/diagrams/current_business_process.drawio written');
