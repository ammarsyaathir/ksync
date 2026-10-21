// perf/make-figures.mjs — generate thesis figures (SVG -> PNG via sharp) from the real survey
//
// v4 changes:
//   - the Question 24 figure is REMOVED (Q24's "I do not experience these
//     difficulties" option reached 40%, so the question no longer carries the
//     argument);
//   - the "where fans discuss" figure is now Figure 1.3 (was 1.4);
//   - a new Figure 1.4 shows Question 25 (usefulness of a centralized community space);
//   - all type sizes and the raster density are increased so the figures are
//     easy to read on screen and in print;
//   - long subtitles wrap onto a second line instead of running off the canvas.
import fs from 'node:fs';
import sharp from 'sharp';

const S = JSON.parse(fs.readFileSync('perf/survey-stats.json', 'utf8'));
const OUT = 'perf/figures';
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const INK = '#1e293b', MUTED = '#64748b', GRID = '#e2e8f0', VIOLET = '#7c3aed', PINK = '#ec4899', SLATE = '#94a3b8';
const DENSITY = 144; // 2x the base 72 dpi -> crisp at 6.4 in in Word

const pick = (col, label) => {
  const g = S.single[col] || S.multi[col];
  const it = g.items.find((x) => x.label === label);
  if (!it) throw new Error(`label not found in col ${col}: "${label}"`);
  return it;
};
const pickAll = (col, order) => order.map((l) => pick(col, l));

// wrap a long label into up to 2 lines
function wrap(s, max) {
  if (s.length <= max) return [s];
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= max) cur = (cur + ' ' + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) { lines[1] = lines.slice(1).join(' ').slice(0, max - 1) + '\u2026'; lines.length = 2; }
  return lines;
}

// split a subtitle into at most 2 balanced lines that both fit `max`
function wrap2(s, max) {
  if (s.length <= max) return [s];
  const words = s.split(' ');
  let best = null, bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    if (a.length <= max && b.length <= max) {
      const score = Math.abs(a.length - b.length); // prefer the most balanced split
      if (score < bestScore) { bestScore = score; best = [a, b]; }
    }
  }
  if (best) return best;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

// Short heading at the top of the figure that states what the question is
// about. It never contains the word "Question" or a figure number: the caption
// below the figure in the Word document carries "Figure 1.x: <title>".
function headerBlock(heading, W) {
  const p = [];
  if (heading) {
    p.push(`<text x="20" y="40" font-family="Arial" font-size="24" font-weight="bold" fill="${INK}">${esc(heading)}</text>`);
  }
  return { p, divY: heading ? 62 : 16 };
}

function hbar({ heading, items, colour = VIOLET, highlight = [] }) {
  const W = 1180, LAB = 610, X0 = 640, MAXW = 500;
  const { p, divY } = headerBlock(heading, W);
  const rowH = 76, top = divY + 30;
  const axisY = top + items.length * rowH + 10;
  const H = axisY + 56;
  p.unshift(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
  for (let t = 0; t <= 100; t += 20) {
    const x = X0 + (MAXW * t) / 100;
    p.push(`<line x1="${x}" y1="${top - 12}" x2="${x}" y2="${top + items.length * rowH - 20}" stroke="${GRID}" stroke-width="1"/>`);
    p.push(`<text x="${x}" y="${axisY}" font-family="Arial" font-size="19" fill="${MUTED}" text-anchor="middle">${t}%</text>`);
  }
  items.forEach((it, i) => {
    const y = top + i * rowH;
    const cy = y + 16;
    const bw = Math.max(4, (MAXW * it.pct) / 100);
    const lines = wrap(it.label, 40);
    const label = lines.map((ln, li) =>
      `<text x="${LAB - 8}" y="${cy + (li - (lines.length - 1) / 2) * 25 + 8}" font-family="Arial" font-size="21" fill="${INK}" text-anchor="end">${esc(ln)}</text>`).join('');
    const fill = highlight.includes(it.label) ? SLATE : colour;
    p.push(label);
    p.push(`<rect x="${X0}" y="${cy - 9}" width="${bw}" height="34" rx="5" fill="${fill}"/>`);
    p.push(`<text x="${X0 + bw + 12}" y="${cy + 18}" font-family="Arial" font-size="22" font-weight="bold" fill="${INK}">${it.pct}%</text>`);
  });
  p.push(`<text x="20" y="${H - 20}" font-family="Arial" font-size="17" fill="${MUTED}">Source: K-Sync Malaysia fan survey (n = ${S.n}). Percentages are of all respondents.</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join('')}</svg>`;
}

function donut({ heading, items }) {
  const W = 1180;
  const { p, divY } = headerBlock(heading, W);
  const H = divY + 356;
  const cx = 300, cy = divY + 162, R = 130, r = 78;
  const total = items.reduce((a, b) => a + b.n, 0);
  p.unshift(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
  const cols = [VIOLET, SLATE];
  let a0 = -Math.PI / 2;
  items.forEach((it, i) => {
    const frac = it.n / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
    const x3 = cx + r * Math.cos(a0), y3 = cy + r * Math.sin(a0);
    p.push(`<path d="M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 ${large} 0 ${x3} ${y3} Z" fill="${cols[i % cols.length]}"/>`);
    const mid = (a0 + a1) / 2;
    const lx = cx + (R + 44) * Math.cos(mid), ly = cy + (R + 44) * Math.sin(mid);
    p.push(`<text x="${lx}" y="${ly + 9}" font-family="Arial" font-size="27" font-weight="bold" fill="${INK}" text-anchor="${Math.cos(mid) < 0 ? 'end' : 'start'}">${it.pct}%</text>`);
    a0 = a1;
  });
  p.push(`<text x="${cx}" y="${cy - 3}" font-family="Arial" font-size="22" font-weight="bold" fill="${INK}" text-anchor="middle">n = ${S.n}</text>`);
  p.push(`<text x="${cx}" y="${cy + 26}" font-family="Arial" font-size="17" fill="${MUTED}" text-anchor="middle">respondents</text>`);
  const lx = 600;
  items.forEach((it, i) => {
    const y = cy - 40 + i * 72;
    p.push(`<rect x="${lx}" y="${y - 22}" width="30" height="30" rx="5" fill="${cols[i % cols.length]}"/>`);
    p.push(`<text x="${lx + 46}" y="${y}" font-family="Arial" font-size="22" fill="${INK}">${esc(it.label)} \u2014 ${it.n} respondents (${it.pct}%)</text>`);
  });
  p.push(`<text x="20" y="${H - 20}" font-family="Arial" font-size="17" fill="${MUTED}">Source: K-Sync Malaysia fan survey (n = ${S.n}).</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join('')}</svg>`;
}

function vbar({ heading, note, counts, mean }) {
  const W = 1180, BW = 170, GAP = 56;
  const p = [];
  let y = 18;
  if (heading) {
    p.push(`<text x="20" y="${y + 22}" font-family="Arial" font-size="24" font-weight="bold" fill="${INK}">${esc(heading)}</text>`);
    y += 62;
  }
  if (note) {
    p.push(`<text x="20" y="${y + 14}" font-family="Arial" font-size="18" fill="${INK}">${esc(note)}</text>`);
    y += 44;
  }
  const divY = y + 8;
  const base = divY + 300, maxH = 250;
  const H = base + 92;
  p.unshift(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
  const X0 = (W - (counts.length * BW + (counts.length - 1) * GAP)) / 2;
  const max = Math.max(...counts.map((c) => c.n));
  p.push(`<line x1="${X0 - 34}" y1="${base}" x2="${W - (X0 - 34)}" y2="${base}" stroke="#cbd5e1" stroke-width="1.5"/>`);
  counts.forEach((c, i) => {
    const h = max ? (maxH * c.n) / max : 0;
    const x = X0 + i * (BW + GAP);
    const pct = Math.round((c.n / S.n) * 1000) / 10;
    p.push(`<rect x="${x}" y="${base - h}" width="${BW}" height="${h}" rx="6" fill="${i >= 3 ? VIOLET : '#c4b5fd'}"/>`);
    p.push(`<text x="${x + BW / 2}" y="${base - h - 40}" font-family="Arial" font-size="24" font-weight="bold" fill="${INK}" text-anchor="middle">${pct}%</text>`);
    p.push(`<text x="${x + BW / 2}" y="${base - h - 14}" font-family="Arial" font-size="17" fill="${MUTED}" text-anchor="middle">n = ${c.n}</text>`);
    p.push(`<text x="${x + BW / 2}" y="${base + 40}" font-family="Arial" font-size="26" font-weight="bold" fill="${INK}" text-anchor="middle">${c.label}</text>`);
  });
  p.push(`<text x="20" y="${H - 20}" font-family="Arial" font-size="17" fill="${MUTED}">Source: K-Sync Malaysia fan survey (n = ${S.n}). Mean rating = ${mean} out of 5.</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${p.join('')}</svg>`;
}

const figures = {
  'Figure_1_1_platforms_checked': hbar({
    heading: 'How many platforms fans usually check to find K-pop event information',
    items: pickAll('9', ['Four or more platforms', 'Three platforms', 'Two platforms', 'One platform', 'I rarely search for event information']),
    highlight: ['I rarely search for event information'],
  }),
  'Figure_1_2_missed_events': hbar({
    heading: 'How often fans miss an event because the post appeared too late',
    items: pickAll('10', ['Sometimes', 'Often', 'Very Often', 'Rarely', 'Never']),
    colour: PINK,
    highlight: ['Rarely', 'Never'],
  }),
  'Figure_1_3_where_fans_discuss': hbar({
    heading: 'Where fans usually discuss K-pop events and communicate with other fans',
    items: pickAll('24', [
      'Telegram groups',
      'X (Twitter) replies or group chats',
      'WhatsApp groups',
      'Facebook groups or online forums',
      'I rarely participate in group discussions']),
    colour: PINK,
    highlight: ['I rarely participate in group discussions'],
  }),
  'Figure_1_4_community_usefulness': vbar({
    heading: 'How useful a centralized K-pop community space would be',
    note: 'Scale: 1 = not useful, 2 = slightly useful, 3 = moderately useful, 4 = useful, 5 = very useful',
    counts: S.rating['27'].counts,
    mean: S.rating['27'].mean,
  }),
  'Figure_1_5_conflicting_information': donut({
    heading: 'Whether fans have found conflicting or outdated event information',
    items: pickAll('13', ['Yes', 'No']),
  }),
  'Figure_1_6_importance_reliable_source': vbar({
    heading: 'How important it is that event information is current and from a reliable source',
    note: 'Scale: 1 = not important, 2 = slightly important, 3 = moderately important, 4 = important, 5 = very important',
    counts: S.rating['18'].counts,
    mean: S.rating['18'].mean,
  }),
};

const meta = {};
for (const [name, svg] of Object.entries(figures)) {
  fs.writeFileSync(`${OUT}/${name}.svg`, svg, 'utf8');
  const png = await sharp(Buffer.from(svg), { density: DENSITY }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(`${OUT}/${name}.png`, png);
  const m = await sharp(png).metadata();
  meta[name] = { w: m.width, h: m.height, bytes: png.length };
  console.log(`${name}.png  ${m.width}x${m.height}  ${(png.length / 1024).toFixed(1)} KB`);
}
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(meta, null, 1), 'utf8');
console.log('\nfigures written to', OUT);
