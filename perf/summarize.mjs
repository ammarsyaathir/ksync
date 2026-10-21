/* Summarise perf/raw.json into a readable breakdown. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(HERE, 'raw.json'), 'utf8'));

const kb = (n) => (n / 1024).toFixed(1) + 'KB';
const short = (u) => u.replace(/^https?:\/\/(www\.)?/, '').split('?')[0].slice(0, 78);

for (const r of data) {
  const v = r.vitals || {};
  const nav = r.nav || {};
  const net = r.network || [];
  const blocking = r.resources.filter((x) => x.blocking === 'blocking');
  const total = net.reduce((a, x) => a + (x.bytes || 0), 0);

  console.log('\n' + '='.repeat(100));
  console.log(`PAGE ${r.path}   (${r.url})`);
  console.log('='.repeat(100));
  console.log(`  TTFB ${Math.round(nav.ttfb || 0)}ms | FCP ${Math.round(v.fcp || 0)}ms | LCP ${Math.round(v.lcp || 0)}ms | CLS ${(v.cls || 0).toFixed(3)} | TBT ${Math.round(v.tbt || 0)}ms`);
  console.log(`  LCP element: ${v.lcpEl || '-'}   (size ${v.lcpSize || 0})`);
  console.log(`  Long tasks: ${(v.longtasks || []).length}   total blocking ${Math.round(v.tbt || 0)}ms`);
  console.log(`  Document: transferred ${kb(nav.transferSize || 0)} encoded ${kb(nav.encodedBodySize || 0)} decoded ${kb(nav.decodedBodySize || 0)} via ${nav.nextHop || '-'}`);
  console.log(`  Requests: ${net.length}   total transferred: ${kb(total)}`);
  console.log(`  Protocol counts: ${JSON.stringify(net.reduce((a, x) => { a[x.protocol || '?'] = (a[x.protocol || '?'] || 0) + 1; return a; }, {}))}`);

  if (blocking.length) {
    console.log(`\n  RENDER-BLOCKING (${blocking.length}):`);
    for (const b of blocking) console.log(`    - ${short(b.name)}  ${b.initiator}`);
  }

  const byOrigin = net.reduce((a, x) => {
    const o = new URL(x.url).origin; a[o] = a[o] || { n: 0, bytes: 0 };
    a[o].n++; a[o].bytes += x.bytes || 0; return a;
  }, {});
  console.log('\n  BY ORIGIN:');
  for (const [o, s] of Object.entries(byOrigin).sort((a, b) => b[1].bytes - a[1].bytes))
    console.log(`    ${String(s.n).padStart(2)} req  ${kb(s.bytes).padStart(9)}  ${o}`);

  console.log('\n  REQUESTS (largest first):');
  console.log('    ' + 'bytes'.padStart(9) + '  ' + 'type'.padEnd(11) + 'enc'.padEnd(6) + 'cache-control'.padEnd(28) + 'url');
  for (const x of net.slice().sort((a, b) => (b.bytes || 0) - (a.bytes || 0)))
    console.log('    ' + kb(x.bytes || 0).padStart(9) + '  ' + String(x.type || '').padEnd(11) + String(x.encoding || '-').padEnd(6) + String(x.cache || '-').padEnd(28) + short(x.url));

  if (v.shifts && v.shifts.length) {
    console.log('\n  CLS SOURCES (top shifts):');
    for (const s of v.shifts.sort((a, b) => b.value - a.value).slice(0, 6))
      console.log(`    ${s.value.toFixed(4)} @ ${Math.round(s.time)}ms  ${s.sources.join(', ') || '(no node)'}`);
  }
}

// Cross-page origin totals
const totals = {};
for (const r of data) for (const x of r.network || []) {
  const o = new URL(x.url).origin; totals[o] = totals[o] || { n: 0, bytes: 0 };
  totals[o].n++; totals[o].bytes += x.bytes || 0;
}
console.log('\n' + '='.repeat(100));
console.log('THIRD-PARTY ORIGINS ACROSS ALL PAGES');
console.log('='.repeat(100));
for (const [o, s] of Object.entries(totals).sort((a, b) => b[1].bytes - a[1].bytes))
  console.log(`  ${String(s.n).padStart(3)} req  ${kb(s.bytes).padStart(10)}  ${o}`);
