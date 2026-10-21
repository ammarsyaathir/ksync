/* perf/members-util.mjs — shared conversion helpers.

   Turns the legacy 12-field member JSON shape
   (stage_name, birth_name, group, position, dob, zodiac, height, blood_type,
    mbti, nationality, years_active, photo)
   into a normalised `members` row, for both the MySQL generator and the SQLite
   migrator. Kept in one place so production MySQL and local SQLite can never
   drift apart. */

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Anything we do not actually know is stored as NULL, never invented.
export function isBlank(v) {
  if (v === null || v === undefined) return true;
  const s = String(v).trim();
  return s === '' || s.toUpperCase() === 'TBC' || s === '[]' || s === '{}';
}

// "September 12, 1994" (or an already-ISO "1994-09-12") -> "1994-09-12"
export function dobISO(value) {
  if (isBlank(value)) return null;
  const s = String(value).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m) return null;
  const mi = MONTHS.indexOf(m[1]) + 1;
  if (!mi) return null;
  return `${m[3]}-${String(mi).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

// "181 cm" / "181.5 cm / 5'11\"" -> 181 / 181.5 ; "TBC" -> null
export function heightNum(value) {
  if (isBlank(value)) return null;
  const m = String(value).match(/([\d.]+)\s*cm/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

// "2013–present" / "2015-present" -> 2013 / 2015
export function debutYear(value) {
  if (isBlank(value)) return null;
  const m = String(value).match(/(\d{4})/);
  return m ? Number(m[1]) : null;
}

// One legacy JSON member object -> one normalised `members` row.
export function memberRow(m, sortOrder) {
  return {
    stage_name: isBlank(m.stage_name) ? null : String(m.stage_name).trim(),
    birth_name: isBlank(m.birth_name) ? null : m.birth_name,
    group_name: isBlank(m.group) ? null : m.group,
    position: isBlank(m.position) ? null : m.position,
    dob: dobISO(m.dob),
    zodiac: isBlank(m.zodiac) ? null : m.zodiac,
    height_cm: heightNum(m.height),
    blood_type: isBlank(m.blood_type) ? null : m.blood_type,
    mbti: isBlank(m.mbti) ? null : m.mbti,
    nationality: isBlank(m.nationality) ? null : m.nationality,
    debut_year: debutYear(m.years_active),
    photo: isBlank(m.photo) ? null : m.photo,
    is_active: 1,
    sort_order: sortOrder
  };
}

// Column order shared by the MySQL INSERT, the SQLite INSERT and the app query.
export const MEMBER_COLUMNS = ['stage_name', 'birth_name', 'group_name', 'position', 'dob', 'zodiac',
  'height_cm', 'blood_type', 'mbti', 'nationality', 'debut_year', 'photo', 'is_active', 'sort_order'];

export const SQLITE_MEMBERS_DDL = `CREATE TABLE IF NOT EXISTS members (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id   INTEGER NOT NULL,
  stage_name  TEXT    NOT NULL,
  birth_name  TEXT,
  group_name  TEXT,
  position    TEXT,
  dob         TEXT,
  zodiac      TEXT,
  height_cm   REAL,
  blood_type  TEXT,
  mbti        TEXT,
  nationality TEXT,
  debut_year  INTEGER,
  photo       TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (artist_id, stage_name),
  FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_members_artist ON members (artist_id);`;

/* Translates the MySQL `members` DDL to its SQLite equivalent, so the two
   validators can replay the same statements against a SQLite mirror. */
export function mysqlDdlToSqlite(ddl) {
  return ddl
    .replace(/`id`\s+INT\(\d+\)\s+NOT NULL AUTO_INCREMENT,/, '`id` INTEGER PRIMARY KEY AUTOINCREMENT,')
    .replace(/INT\(\d+\)/g, 'INTEGER')
    .replace(/TINYINT\(\d+\)/g, 'INTEGER')
    .replace(/VARCHAR\(\d+\)/g, 'TEXT')
    .replace(/LONGTEXT/g, 'TEXT')
    .replace(/DATETIME/g, 'TEXT')
    .replace(/\bDATE\b/g, 'TEXT')
    .replace(/DECIMAL\(\d+,\d+\)/g, 'REAL')
    .replace(/UNIQUE KEY `[^`]+` \(([^)]+)\)/g, 'UNIQUE ($1)')
    .replace(/\n\s*KEY `[^`]+` \([^)]+\),/g, '')
    .replace(/,\s*\n\s*PRIMARY KEY \(`id`\)/, '')
    .replace(/\)\s*ENGINE=InnoDB[^\n]*;?/, ');');
}
