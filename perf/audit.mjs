/* ==========================================================================
   K-Sync Malaysia — performance audit harness
   Drives headless Chrome over CDP, with Lighthouse-like conditions:
     cold cache + Slow 4G (1.6 Mbps / 150ms RTT) + 4x CPU throttling
   Collects: FCP, LCP, CLS, TBT (long tasks), navigation + resource timing,
             render-blocking resources, and per-origin transfer sizes.
   Usage:  node perf/audit.mjs
   ========================================================================== */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = 9555;
const BASE = process.env.AUDIT_BASE || 'http://localhost:8000';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));
if (!CHROME) { console.error('No Chrome found'); process.exit(1); }

const PAGES = (process.env.AUDIT_PAGES || '/,/events,/submit-event,/login')
  .split(',').map((s) => s.trim()).filter(Boolean);

const OBSERVER = `
window.__perf = { lcp: 0, lcpEl: '', lcpSize: 0, cls: 0, shifts: [], longtasks: [], fcp: 0, tbt: 0 };
try {
  new PerformanceObserver(function (l) {
    l.getEntries().forEach(function (e) {
      if (e.startTime > window.__perf.lcp) {
        window.__perf.lcp = e.startTime;
        window.__perf.lcpSize = e.size || 0;
        var el = e.element;
        window.__perf.lcpEl = el ? (el.tagName + (el.className ? '.' + String(el.className).trim().split(/\\s+/)[0] : '') + (el.id ? '#' + el.id : '')) : String(e.url || '');
      }
    });
  }).observe({ type: 'largest-contentful-paint', buffered: true });
} catch (e) {}
try {
  new PerformanceObserver(function (l) {
    l.getEntries().forEach(function (e) {
      if (e.hadRecentInput) return;
      window.__perf.cls += e.value;
      window.__perf.shifts.push({
        value: e.value, time: e.startTime,
        sources: (e.sources || []).map(function (s) {
          var n = s.node;
          return n ? (n.tagName || '') + (n.className ? '.' + String(n.className).trim().split(/\\s+/)[0] : '') : '?';
        })
      });
    });
  }).observe({ type: 'layout-shift', buffered: true });
} catch (e) {}
try {
  new PerformanceObserver(function (l) {
    l.getEntries().forEach(function (e) {
      window.__perf.longtasks.push({ start: e.startTime, dur: e.duration });
      if (e.duration > 50) window.__perf.tbt += e.duration - 50;
    });
  }).observe({ type: 'longtask', buffered: true });
} catch (e) {}
try {
  new PerformanceObserver(function (l) {
    l.getEntries().forEach(function (e) { if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime; });
  }).observe({ type: 'paint', buffered: true });
} catch (e) {}
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDevtools() {
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) return; } catch {}
    await sleep(250);
  }
  throw new Error('DevTools never came up');
}

function cdp(ws) {
  let id = 0; const pending = new Map(); const events = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id); pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    } else if (m.method) events.push(m);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id; pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  return { send, events };
}

async function measure(path) {
  const created = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(created.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  const { send, events } = cdp(ws);

  await send('Page.enable'); await send('Network.enable'); await send('Runtime.enable');
  await send('Performance.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Network.emulateNetworkConditions', {
    offline: false, latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    connectionType: 'cellular4g',
  });
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: OBSERVER });

  const url = BASE + path;
  await send('Page.navigate', { url });
  await sleep(9000);

  const evalExpr = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

  const vitals = await evalExpr('JSON.stringify(window.__perf || null)').then((s) => JSON.parse(s || 'null'));
  const nav = await evalExpr('JSON.stringify((function(){var n=performance.getEntriesByType("navigation")[0]||{};return {ttfb:n.responseStart,domInteractive:n.domInteractive,domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd,transferSize:n.transferSize,encodedBodySize:n.encodedBodySize,decodedBodySize:n.decodedBodySize,nextHop:n.nextHopProtocol};})())').then((s) => JSON.parse(s || '{}'));
  const paints = await evalExpr('JSON.stringify(performance.getEntriesByType("paint").map(function(p){return {name:p.name,t:p.startTime};}))').then((s) => JSON.parse(s || '[]'));
  const resources = await evalExpr(`JSON.stringify(performance.getEntriesByType("resource").map(function (r) {
      return { name: r.name, initiator: r.initiatorType, transferSize: r.transferSize, encoded: r.encodedBodySize,
               decoded: r.decodedBodySize, duration: r.duration, start: r.startTime, blocking: r.renderBlockingStatus || '',
               proto: r.nextHopProtocol || '' };
    }))`).then((s) => JSON.parse(s || '[]'));
  const metrics = await send('Performance.getMetrics');
  const m = Object.fromEntries(metrics.metrics.map((x) => [x.name, x.value]));

  // Real byte sizes incl. cross-origin CDNs (Resource Timing hides these).
  const meta = new Map(); const type = new Map();
  for (const ev of events) {
    if (ev.method === 'Network.requestWillBeSent') {
      type.set(ev.params.requestId, ev.params.type);
    } else if (ev.method === 'Network.responseReceived') {
      const { requestId, response, type: t } = ev.params;
      meta.set(requestId, {
        url: response.url, status: response.status, mime: response.mimeType,
        type: t, protocol: response.protocol,
        encoding: response.headers['content-encoding'] || '',
        cache: response.headers['cache-control'] || '',
        fromCache: !!(response.fromDiskCache || response.fromServiceWorker),
      });
    }
  }
  const network = [];
  for (const ev of events) {
    if (ev.method !== 'Network.loadingFinished') continue;
    const info = meta.get(ev.params.requestId);
    if (!info) continue;
    network.push({ ...info, bytes: ev.params.encodedDataLength, reqType: type.get(ev.params.requestId) });
  }

  ws.close();
  await fetch(`http://127.0.0.1:${PORT}/json/close/${created.id}`).catch(() => {});

  return { path, url, vitals, nav, paints, resources, network, metrics: m };
}

async function main() {
  // Fail fast if the app is not reachable.
  const probe = await fetch(BASE + '/').catch(() => null);
  if (!probe || !probe.ok) { console.error(`App not reachable at ${BASE}`); process.exit(1); }

  const profile = join(tmpdir(), `ksync-perf-${Date.now()}`);
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });

  const results = [];
  try {
    await waitForDevtools();
    for (const p of PAGES) {
      process.stdout.write(`  measuring ${p} ... `);
      const r = await measure(p);
      results.push(r);
      console.log(`LCP ${Math.round(r.vitals?.lcp || 0)}ms  CLS ${(r.vitals?.cls || 0).toFixed(3)}  TBT ${Math.round(r.vitals?.tbt || 0)}ms  xfer ${Math.round(r.resources.reduce((a, x) => a + (x.transferSize || 0), 0) / 1024)}KB / ${r.resources.length} reqs`);
    }
  } finally {
    chrome.kill(); await sleep(400);
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }

  if (!existsSync(HERE)) mkdirSync(HERE, { recursive: true });
  writeFileSync(join(HERE, 'raw.json'), JSON.stringify(results, null, 2));
  console.log(`\nRaw data -> perf/raw.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
