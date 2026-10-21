// perf/check-submitter-cols.mjs — do the submitter/identity columns actually exist?
import Database from 'better-sqlite3';
import fs from 'node:fs';
const db = new Database('database/ksync.db', { readonly: true });

const cols = db.prepare('PRAGMA table_info(events)').all().map((c) => c.name);
console.log(`local SQLite events columns (${cols.length}):`);
console.log('  ' + cols.join(', '));

const identity = ['organizer_id', 'organizer_name', 'organizer_social_url', 'organizer_type', 'submitter_name', 'submitter_email', 'submitter_social', 'promoter_name', 'evidence_link', 'official_url'];
console.log('\nidentity-related columns present locally:');
for (const c of identity) console.log(`  ${cols.includes(c) ? 'YES' : 'NO '}  ${c}`);

// what does the MySQL schema declare?
const sql = fs.readFileSync('database/hostinger_mysql_schema.sql', 'utf8');
const block = sql.match(/CREATE TABLE `events` \(([\s\S]*?)\) ENGINE/)[1];
const myCols = [...block.matchAll(/`([a-z_]+)`/g)].map((m) => m[1]);
console.log(`\nMySQL schema events columns (${myCols.length}):`);
console.log('  ' + myCols.join(', '));
console.log('\nin MySQL schema but code references it?');
for (const c of ['submitter_social', 'promoter_name']) {
  console.log(`  ${myCols.includes(c) ? 'present' : 'MISSING'} in schema | ${c}`);
}
