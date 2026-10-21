// perf/verify-v3.mjs — verify the built Chapter 1 .docx end to end
//   node perf/verify-v3.mjs <docx>
import fs from 'node:fs';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const SRC = process.argv[2];
const zip = await JSZip.loadAsync(fs.readFileSync(SRC));
const xml = await zip.file('word/document.xml').async('string');
const rels = await zip.file('word/_rels/document.xml.rels').async('string');
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const h = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);

console.log(`file: ${SRC}  (${fs.statSync(SRC).size} bytes)\n`);

// ---- media ----
const media = Object.keys(zip.files).filter((f) => /^word\/media\/.+/.test(f) && !zip.files[f].dir).sort();
console.log(`media in package (${media.length}):`);
for (const n of media) {
  const b = await zip.file(n).async('nodebuffer');
  console.log(`  ${n.padEnd(24)} ${String(b.length).padStart(7)} bytes  sha=${h(b)}`);
}

// ---- every embedded image has a rel, and vice versa ----
const embedRids = [...xml.matchAll(/r:embed="([^"]+)"/g)].map((m) => m[1]);
const imgRels = [...rels.matchAll(/<Relationship Id="([^"]+)" Type="[^"]*\/image" Target="([^"]+)"/g)].map((m) => ({ id: m[1], target: m[2] }));
console.log(`\nembedded pictures: ${embedRids.length}   image relationships: ${imgRels.length}`);
let wiringOk = true;
for (const rid of embedRids) {
  const rel = imgRels.find((r) => r.id === rid);
  if (!rel) { console.log(`  *** ${rid} has no relationship`); wiringOk = false; continue; }
  const exists = media.includes('word/' + rel.target);
  console.log(`  ${rid} -> ${rel.target} ${exists ? 'ok' : '*** MISSING PART'}`);
  if (!exists) wiringOk = false;
}
for (const r of imgRels) if (!embedRids.includes(r.id)) console.log(`  (unused rel ${r.id} -> ${r.target})`);

// ---- figure order matches expected ----
const order = embedRids.map((rid) => imgRels.find((r) => r.id === rid).target);
console.log(`\nfigure order in document: ${order.join(' , ')}`);

// ---- compare embedded media with the generated figure files ----
const local = Object.fromEntries(
  fs.readdirSync('perf/figures').filter((f) => f.endsWith('.png'))
    .map((f) => [h(fs.readFileSync('perf/figures/' + f)), f]));
console.log('\nembedded media vs perf/figures (sha256 prefix):');
for (const n of media) {
  const b = await zip.file(n).async('nodebuffer');
  const match = local[h(b)];
  console.log(`  ${n.padEnd(24)} ${match ? '== ' + match : '(not from perf/figures — original document image)'}`);
}

// ---- text checks ----
const text = unesc([...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(' '));
const norm = (s) => s.replace(/[\u2018\u2019\u201B\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();
const T = norm(text);

const mustHave = [
  'a questionnaire completed by 51 respondents',
  'Among the 51 questionnaire respondents, 43 (84.3%)',
  '31 (60.8%) used Instagram',
  '30 respondents (58.8%)',
  'Telegram channels by 25 (49.0%)',
  '18 respondents (35.3%)',
  '43 respondents (84.3%) reported checking two or more platforms',
  '16 (31.4%) who checked four or more',
  '38 respondents (74.5%)',
  'as summarised in Figure 1.1',
  'as shown in Figure 1.2',
  'each reported by 27 respondents (52.9%)',
  '24 respondents (47.1%)',
  '19 respondents (37.3%)',
  'Twenty respondents (39.2%)',
  'as summarised in Figure 1.3',
  'Figure 1.4 shows where the respondents currently discuss events',
  'mean rating of 3.55',
  'as presented in Figure 1.5',
  'mean rating of 3.75, as presented in Figure 1.6',
  'questionnaire involving 51 K-pop fans',
  'aged between 18 and 24 (31 respondents, 60.8%)',
  '23 respondents (45.1%)',
  'questionnaire includes only 51 respondents',
  'questionnaire findings from 51 respondents',
  'Table 1.1: Questionnaire findings on platforms used to discover K-pop event information (Question 6, n = 51',
  'Theme reported in Question 24 (n = 51',
];
const mustNot = [
  'Hono', 'Supabase', 'Cloudflare', 'PostgreSQL', 'MongoDB',
  '83.3%', '56.7%', '36.7%', '16.7%', '40.0%',
  'questionnaire completed by 30 respondents',
  'Among the 30 questionnaire respondents',
  'findings from 30 respondents',
  'includes only 30 respondents',
  'involving 30 K-pop fans',
  'no overall percentage or average rating is claimed',
  '70% of respondents',
  'searchable questions and answers and a separate general K-pop discussion area',
  'generalized',
];
console.log('\ntext checks:');
let textOk = true;
for (const s of mustHave) if (!T.includes(norm(s))) { console.log(`  *** MISSING: ${s}`); textOk = false; }
for (const s of mustNot) if (T.includes(norm(s))) { console.log(`  *** STALE:   ${s}`); textOk = false; }
console.log(`  required strings present: ${mustHave.filter((s) => T.includes(norm(s))).length}/${mustHave.length}`);
console.log(`  stale strings remaining : ${mustNot.filter((s) => T.includes(norm(s))).length}`);

// ---- structure ----
const count = (re) => (xml.match(new RegExp(re, 'g')) || []).length;
console.log('\nstructure:');
console.log(`  paragraphs ${count('<w:p(?:\\s[^>]*)?>')}/${count('</w:p>')}   tables ${count('<w:tbl(?:\\s[^>]*)?>')}/${count('</w:tbl>')}   rows ${count('<w:tr(?:\\s[^>]*)?>')}/${count('</w:tr>')}   cells ${count('<w:tc(?:\\s[^>]*)?>')}/${count('</w:tc>')}`);
console.log(`  drawings ${count('<w:drawing>')}/${count('</w:drawing>')}   runs ${count('<w:r(?:\\s[^>]*)?>')}/${count('</w:r>')}`);
console.log(`  w:t open/close ${count('<w:t(?:\\s[^>]*)?>')}/${count('</w:t>')}`);

console.log(`\nRESULT: wiring ${wiringOk ? 'ok' : 'FAILED'} | text ${textOk ? 'ok' : 'FAILED'}`);
