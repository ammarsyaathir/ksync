// perf/survey-stats.mjs — exact statistics from the real survey
// Source: "🥤 K-Sync Malaysia_ Fan Research Survey (1).xlsx" (Form Responses 1)
// The export contains one fully blank response row (no timestamp, no answers);
// it is dropped so all percentages use the real n.
import fs from 'node:fs';
import { readWorkbook } from './xlsx-read.mjs';

const FILE = 'C:/Users/ammar/AppData/Local/Temp/opencode/survey.xlsx';
const wb = await readWorkbook(FILE);
const [header, ...allRows] = wb[0].rows[0] ? wb[0].rows : [[]];

// a row is valid if at least one of Q1..Q31 (cols 3..33) is answered OR it has a timestamp
const isBlankRow = (r) => {
  const anyAnswer = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]
    .some((c) => String(r[c] ?? '').trim() !== '');
  return !anyAnswer && String(r[0] ?? '').trim() === '';
};

const data = allRows.filter((r) => !isBlankRow(r));
const dropped = allRows.length - data.length;
const N = data.length;
const col = (i) => data.map((r) => String(r[i] ?? '').trim());
const pct = (n) => Math.round((n / N) * 1000) / 10;

console.log(`rows in export : ${allRows.length}`);
console.log(`blank rows     : ${dropped}  (dropped)`);
console.log(`analysed n     : ${N}`);

// per-column answered counts (blank answers leave the question unanswered)
console.log('\n--- unanswered per question ---');
for (let c = 3; c <= 33; c++) {
  const blank = col(c).filter((v) => v === '').length;
  if (blank) console.log(`   col ${c}  ${String(header[c]).slice(0, 60)}  unanswered=${blank}`);
}

const MULTI = {
  6: ['Official Concerts / Fan Meetings', 'Cupsleeve Events (Cafe events)', 'Fan Streaming Parties / Viewing Parties', 'Random Dance Play (RDP)', 'Birthday Ads / Exhibitions', 'None of the above'],
  8: ['X (Twitter)', 'Instagram', 'TikTok', 'Telegram Channels', 'Word of mouth / Friends', 'Official Event Organizer Websites'],
  12: ['Event date and time', 'Venue and location', 'Organizer and participating artist', 'Registration or ticket information', 'Event changes, cancellation, or updated announcements'],
  19: ['Search by artist, group, or event name', 'Browse upcoming and recently added events', 'Filter by date, location, or event category', 'View complete event information on one page', 'View the original announcement source and latest update date'],
  26: ['Event information is scattered across different groups', 'The same questions are repeatedly asked in different groups', 'Important messages get buried among other messages', 'It is difficult to find previous discussions or shared information', 'I do not experience these difficulties'],
  28: ['Event discussion forums: Discuss a specific event in one organized space', 'General K-Pop forum: Chat about groups, artists, and K-Pop topics', 'Questions and answers: Ask questions and find previous answers', 'Group discussions: Join a shared discussion with fans who have similar interests', 'Event information sharing: Share useful event updates and announcements with other fans'],
};

const splitMulti = (cell, options) => {
  const sorted = [...options].sort((a, b) => b.length - a.length);
  const found = [];
  let rest = cell;
  while (rest.trim()) {
    const hit = sorted.find((o) => rest.startsWith(o));
    if (!hit) { found.push('UNMATCHED<<' + rest + '>>'); break; }
    found.push(hit);
    rest = rest.slice(hit.length).replace(/^\s*,\s*/, '');
  }
  return found;
};

const out = { n: N, source: FILE, single: {}, multi: {}, rating: {}, unmatched: [] };

for (const i of [3, 4, 5, 7, 9, 10, 13, 14, 15, 16, 20, 22, 23, 24, 25, 29, 30]) {
  const counts = new Map();
  for (const v of col(i)) if (v !== '') counts.set(v, (counts.get(v) || 0) + 1);
  out.single[i] = { header: header[i], answered: N - col(i).filter((v) => v === '').length, items: [...counts.entries()].map(([k, n]) => ({ label: k, n, pct: pct(n) })).sort((a, b) => b.n - a.n) };
}

for (const [k, options] of Object.entries(MULTI)) {
  const i = Number(k);
  const counts = new Map(options.map((o) => [o, 0]));
  for (const v of col(i)) {
    if (!v) continue;
    for (const opt of splitMulti(v, options)) {
      if (opt.startsWith('UNMATCHED')) out.unmatched.push({ col: i, value: opt.slice(11, -2) });
      else counts.set(opt, counts.get(opt) + 1);
    }
  }
  out.multi[i] = { header: header[i], items: [...counts.entries()].map(([k2, n]) => ({ label: k2, n, pct: pct(n) })).sort((a, b) => b.n - a.n) };
}

for (const i of [11, 17, 18, 21, 27, 31, 32]) {
  const vals = col(i).map(Number).filter((x) => !Number.isNaN(x));
  const counts = [1, 2, 3, 4, 5].map((s) => ({ label: `${s}`, n: vals.filter((v) => v === s).length }));
  const mean = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
  const top2 = vals.filter((v) => v >= 4).length;
  const bottom2 = vals.filter((v) => v <= 2).length;
  out.rating[i] = { header: header[i], answered: vals.length, mean, top2, top2Pct: pct(top2), bottom2, bottom2Pct: pct(bottom2), counts };
}

fs.writeFileSync('perf/survey-stats.json', JSON.stringify(out, null, 1), 'utf8');

const L = [];
L.push(`n = ${N} respondents (dropped ${dropped} blank row)`);
if (out.unmatched.length) L.push(`\n!! UNMATCHED: ${JSON.stringify(out.unmatched)}`);
L.push('\n================ SINGLE CHOICE ================');
for (const [, v] of Object.entries(out.single)) {
  L.push(`\n${v.header.replace(/\s+/g, ' ')}   [answered ${v.answered}/${N}]`);
  for (const it of v.items) L.push(`   ${String(it.n).padStart(3)}  ${String(it.pct).padStart(5)}%  ${it.label}`);
}
L.push('\n\n================ MULTI SELECT (% of n) ================');
for (const [, v] of Object.entries(out.multi)) {
  L.push(`\n${v.header.replace(/\s+/g, ' ')}`);
  for (const it of v.items) L.push(`   ${String(it.n).padStart(3)}  ${String(it.pct).padStart(5)}%  ${it.label}`);
}
L.push('\n\n================ RATINGS (1-5) ================');
for (const [, v] of Object.entries(out.rating)) {
  L.push(`\n${v.header.replace(/\s+/g, ' ')}   [answered ${v.answered}]`);
  L.push(`   mean=${v.mean}  rated 4-5: ${v.top2} (${v.top2Pct}%)  rated 1-2: ${v.bottom2} (${v.bottom2Pct}%)   dist: ${v.counts.map((c) => `${c.label}=${c.n}`).join(' ')}`);
}

// flag any "negative / no problem" option that is large — a weak-evidence warning
L.push('\n\n================ WEAK-EVIDENCE WATCH (>25% negative option) ================');
for (const [, v] of Object.entries({ ...out.single, ...out.multi })) {
  for (const it of v.items) {
    if (/(do not|rarely|never|none of the above|no difficulties)/i.test(it.label) && it.pct > 25) {
      L.push(`   ${String(it.pct).padStart(5)}%  ${it.label}   <-- ${v.header.replace(/\s+/g, ' ').slice(0, 60)}`);
    }
  }
}

fs.writeFileSync('C:/Users/ammar/AppData/Local/Temp/opencode/survey-stats.txt', L.join('\n'), 'utf8');
console.log('\n' + L.join('\n'));
