// perf/verify-v4.mjs — verify the built Chapter 1 .docx (v4) end to end
//   node perf/verify-v4.mjs <docx>
import fs from 'node:fs';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const SRC = process.argv[2];
const zip = await JSZip.loadAsync(fs.readFileSync(SRC));
const xml = await zip.file('word/document.xml').async('string');
const rels = await zip.file('word/_rels/document.xml.rels').async('string');
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const h = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);
const norm = (s) => s.replace(/[\u2018\u2019\u201B\u2032]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();

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
const EXPECTED_FIGURES = [
  'Figure_1_1_platforms_checked.png',
  'Figure_1_2_missed_events.png',
  'Figure_1_3_where_fans_discuss.png',
  'Figure_1_4_community_usefulness.png',
  'Figure_1_5_conflicting_information.png',
  'Figure_1_6_importance_reliable_source.png',
];
const order = embedRids.map((rid) => imgRels.find((r) => r.id === rid).target);
console.log(`\nfigure order in document:\n  ${order.join('\n  ')}`);
// order[0] is the original document image; the six survey figures must follow in order
// (which figure is which is proven by the byte comparison below)
const expectedTargets = EXPECTED_FIGURES.map((_, i) => `media/image${i + 2}.png`);
const figOk = order.length === EXPECTED_FIGURES.length + 1
  && expectedTargets.every((t, i) => order[i + 1] === t);

// ---- compare embedded media with the generated figure files ----
const local = Object.fromEntries(
  fs.readdirSync('perf/figures').filter((f) => f.endsWith('.png'))
    .map((f) => [h(fs.readFileSync('perf/figures/' + f)), f]));
console.log('\nembedded media vs perf/figures (sha256 prefix):');
let byteOk = true;
for (const n of media) {
  const b = await zip.file(n).async('nodebuffer');
  const match = local[h(b)];
  if (n === 'word/media/image1.png') console.log(`  ${n.padEnd(24)} (original document image — untouched)`);
  else { console.log(`  ${n.padEnd(24)} ${match ? '== ' + match : '*** NOT FROM perf/figures'}`); if (!match) byteOk = false; }
}

// ---- text checks ----
const text = unesc([...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join(' '));
const T = norm(text);

const mustHave = [
  // n = 50 data
  'a questionnaire completed by 50 respondents',
  'Among the 50 questionnaire respondents, 42 (84%)',
  '31 (62%) used Instagram',
  '29 respondents (58%)',
  'Telegram channels by 24 (48%)',
  '17 respondents (34%)',
  '42 respondents (84%) reported checking two or more platforms',
  '16 (32%) who checked four or more',
  '38 respondents (76%)',
  'as summarized in Figure 1.1',
  'as shown in Figure 1.2',
  'Table 1.1: Questionnaire findings on platforms used to discover K-pop event information (Question 6, n = 50',
  // Question 24 removed, Q22 / Q25 / Q26 used
  'Question 22 shows where the respondents currently discuss events',
  'summarized in Figure 1.3',
  '27 respondents (54%) rated it 4 or 5 out of 5, with a mean rating of 3.52',
  'as shown in Figure 1.4',
  'Evidence from the questionnaire (n = 50)',
  'Event discussion forums, where a specific event is discussed in one organized space, were selected by 28 respondents (56%)',
  // 1.2.3
  '31 of the 50 respondents (62%)',
  '30 respondents (60%), with a mean rating of 3.72',
  'as presented in Figure 1.5',
  'as presented in Figure 1.6',
  // scope / limitations / summary
  'questionnaire involving 50 K-pop fans',
  'aged between 18 and 24 (30 respondents, 60%)',
  '22 respondents (44%)',
  'questionnaire includes only 50 respondents',
  'questionnaire findings from 50 respondents',
  // interviews kept
  'MKF Malaysia Instagram administrator',
  'Syazwani from Cupsleeve Malaysia',
  // new in-text citations
  '(Fletcher & Nielsen, 2017)',
  '(Bucher, 2017)',
  '(Eppler & Mengis, 2004)',
  'Arnold et al., 2023)',
  '(Wasko & Faraj, 2005)',
  '(Hwang et al., 2015)',
  '(Castillo et al., 2011)',
  '(Zubiaga et al., 2018)',
  'Majerczak and Strzelecki (2022)',
  'Gillespie (2018)',
  // reference entries
  'Arnold, M., Goldschmitt, M., & Rigotti, T. (2023)',
  'Bucher, T. (2017)',
  'Castillo, C., Mendoza, M., & Poblete, B. (2011)',
  'Eppler, M. J., & Mengis, J. (2004)',
  'Fletcher, R., & Nielsen, R. K. (2017)',
  'Gillespie, T. (2018)',
  'Hwang, E. H., Singh, P. V., & Argote, L. (2015)',
  'Majerczak, P., & Strzelecki, A. (2022)',
  'Wasko, M. M., & Faraj, S. (2005)',
  'Zubiaga, A., Aker, A., Bontcheva, K., Liakata, M., & Procter, R. (2018)',
  // audit log removed from scope/significance
  'Standard verification criteria and recorded decision reasons can improve the traceability',
];
const mustNot = [
  // withdrawn question / figures
  'Question 24', 'Questions 24',
  'Theme reported in Question 24',
  'Table 1.2: Community discussion issues',
  // audit log feature
  'audit log', 'audit logs', 'administrative audit records',
  // old respondent counts and figures (n = 51 and n = 30)
  '51 respondents', '51 K-pop fans', 'questionnaire completed by 51', 'n = 51',
  '30 respondents)', '30 K-pop fans', 'includes only 30 respondents',
  '83.3%', '56.7%', '36.7%', '16.7%', '40.0%', '45.1%', '31.4%',
  '84.3%', '60.8%', '58.8%', '49.0%', '35.3%', '74.5%', '39.2%', '47.1%', '52.9%', '37.3%', '56.9%', '68.6%', '64.7%', '54.9%',
  'mean rating of 3.55', 'mean rating of 3.75',
  'as summarised in Figure', 'as shown in Figure 1.3',
  'no overall percentage or average rating is claimed',
  '70% of respondents',
  // wrong stack / wrong scope
  'Hono', 'Supabase', 'Cloudflare', 'PostgreSQL', 'MongoDB',
  'searchable questions and answers and a separate general K-pop discussion area', 'searchable content',
  // spelling
  'organise', 'organised', 'organising', 'generalised', 'disorganised',
];
console.log('\ntext checks:');
let textOk = true;
for (const s of mustHave) if (!T.includes(norm(s))) { console.log(`  *** MISSING: ${s}`); textOk = false; }
for (const s of mustNot) if (T.includes(norm(s))) { console.log(`  *** STALE:   ${s}`); textOk = false; }
console.log(`  required strings present: ${mustHave.filter((s) => T.includes(norm(s))).length}/${mustHave.length}`);
console.log(`  stale strings remaining : ${mustNot.filter((s) => T.includes(norm(s))).length}`);

// ---- reference list order ----
const paras = [...xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map((m) =>
  unesc([...m[0].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((t) => t[1]).join('')));
const ri = paras.findIndex((p) => /^REFERENCES$/i.test(p.trim()));
const refs = paras.slice(ri + 1).filter((p) => p.trim().length > 40);
const key = (s) => s.replace(/^[^A-Za-z]+/, '').toLowerCase();
const sorted = refs.every((s, i) => i === 0 || key(refs[i - 1]) <= key(s));
console.log(`\nreference list (${refs.length} entries) — alphabetical: ${sorted ? 'yes' : '*** NO ***'}`);
refs.forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)}. ${r.slice(0, 96)}`));

// ---- structure ----
const count = (re) => (xml.match(new RegExp(re, 'g')) || []).length;
const bal = [
  ['w:p', '<w:p(?:\\s[^>]*)?>|</w:p>'],
  ['w:r', '<w:r(?:\\s[^>]*)?>|</w:r>'],
  ['w:tbl', '<w:tbl(?:\\s[^>]*)?>|</w:tbl>'],
  ['w:tr', '<w:tr(?:\\s[^>]*)?>|</w:tr>'],
  ['w:tc', '<w:tc(?:\\s[^>]*)?>|</w:tc>'],
  ['w:drawing', '<w:drawing>|</w:drawing>'],
  ['wp:inline', '<wp:inline(?:\\s[^>]*)?>|</wp:inline>'],
  ['pic:pic', '<pic:pic(?:\\s[^>]*)?>|</pic:pic>'],
  ['a:graphic', '<a:graphic(?:\\s[^>]*)?>|</a:graphic>'],
];
console.log('\nstructure:');
let structOk = true;
for (const [label, b] of bal) {
  const [o, c] = b.split('|');
  const n1 = count(o), n2 = count(c);
  if (n1 !== n2) structOk = false;
  console.log(`  ${label.padEnd(16)} open=${String(n1).padStart(3)} close=${String(n2).padStart(3)} ${n1 === n2 ? 'ok' : '*** UNBALANCED ***'}`);
}
console.log(`  w:t open/close ${count('<w:t(?:\\s[^>]*)?>')}/${count('</w:t>')}   italic runs ${count('<w:i/>')}`);

console.log(`\nRESULT: wiring ${wiringOk ? 'ok' : 'FAILED'} | figures ${figOk ? 'ok' : 'FAILED'} | bytes ${byteOk ? 'ok' : 'FAILED'} | text ${textOk ? 'ok' : 'FAILED'} | refs ${sorted ? 'ok' : 'FAILED'} | structure ${structOk ? 'ok' : 'FAILED'}`);
