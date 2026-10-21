// Precise per-file SQL token counts for the schema audit (read-only).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const files = [
  'database/hostinger_mysql_schema.sql',
  'REMOVED/database_versions/ksync_mysql.sql',
  'REMOVED/database_versions/azure_mysql_schema.sql',
  'REMOVED/database_versions/azure_sql_schema.sql',
  'REMOVED/database_versions/postgres_schema.sql',
  'REMOVED/database_versions/backups/hostinger_mysql_schema_23_tables.sql'
];
const count = (s, re) => (s.match(re) || []).length;
for (const rel of files) {
  const t = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
  const lines = t.split(/\r?\n/).length;
  console.log('\n=== ' + rel);
  console.log('  lines                       : ' + lines);
  console.log('  CREATE TABLE                : ' + count(t, /CREATE\s+TABLE/gi));
  console.log('  CREATE INDEX (any case)     : ' + count(t, /CREATE\s+INDEX/gi));
  console.log('  literal "CREATE INDEX"      : ' + count(t, /CREATE INDEX/g));
  console.log('  word INDEX (any case)       : ' + count(t, /\bINDEX\b/gi));
  console.log('  literal "INDEX " (idx+space): ' + count(t, /INDEX /gi));
  console.log('  word KEY (any case)         : ' + count(t, /\bKEY\b/gi));
  console.log('  literal "KEY " (key+space)  : ' + count(t, /KEY /gi));
  console.log('  PRIMARY KEY                 : ' + count(t, /PRIMARY\s+KEY/gi));
  console.log('  FOREIGN KEY                 : ' + count(t, /FOREIGN\s+KEY/gi));
  console.log('  UNIQUE KEY                  : ' + count(t, /UNIQUE\s+KEY/gi));
  console.log('  standalone KEY nn ( )       : ' + count(t, /^\s*KEY\s/gi + 'm') * 0 + (t.match(/^\s*KEY\s/gim) || []).length);
  console.log('  inline UNIQUE (col)         : ' + count(t, /\bUNIQUE\b/gi));
  console.log('  ENGINE= values              : ' + JSON.stringify([...new Set((t.match(/ENGINE=\w+/gi) || []))]));
}
