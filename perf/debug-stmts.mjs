import fs from 'node:fs';
const t = fs.readFileSync('database/seed_events_full_mysql.sql', 'utf8');

function splitStatements(t) {
  const out = []; let cur = ''; let q = null;
  for (let i = 0; i < t.length; i++) {
    const c = t[i]; cur += c;
    if (q) { if (c === '\\') { cur += t[++i] ?? ''; continue; } if (c === q) { if (t[i + 1] === q) { cur += t[++i]; continue; } q = null; } }
    else if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === ';') { out.push(cur.slice(0, -1)); cur = ''; }
  }
  if (cur.trim()) out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

const stmts = splitStatements(t);
console.log(`statements: ${stmts.length}`);
stmts.forEach((s, i) => {
  const first = s.split('\n').find((l) => l.trim()) ?? '';
  const hasBaby = s.includes('BABYMONSTER');
  const events = /INSERT INTO `events`/i.test(s);
  const cats = /INSERT INTO `event_categories`/i.test(s);
  const users = /INSERT IGNORE INTO `users`/i.test(s);
  const kind = events ? 'EVENT' : cats ? 'CAT' : users ? 'USER' : /artists/i.test(s) ? 'ARTIST' : '?';
  console.log(`${String(i).padStart(2)} ${kind.padEnd(6)} ${hasBaby ? '<== BABYMONSTER' : ''}  ${first.slice(0, 62)}`);
});
