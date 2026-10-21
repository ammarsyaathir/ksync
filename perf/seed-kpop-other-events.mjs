/* Batch 2 — K-pop events in Malaysia (18 Oct 2026 → 2027) that are NOT full arena concerts,
   plus two concerts sourced from the MKF fan aggregator.
   Times/venues that are not published are marked TBC (start_time 12:00 + "(time TBC)" in the text).

   Usage:  node perf/seed-kpop-other-events.mjs            (DRY RUN)
           APPLY=1 node perf/seed-kpop-other-events.mjs    (writes database/ksync.db)
*/
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const APPLY = process.env.APPLY === '1';
const DB_PATH = process.env.SQLITE_DB_PATH || 'database/ksync.db';
const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

const ROLE_ORGANIZER_ID = db.prepare("SELECT id FROM roles WHERE name = 'ORGANIZER'").get()?.id ?? 2;
const CAT = { concert: 1, fanmeeting: 2, cupsleeve: 3, birthday: 4, fan_gathering: 5, exhibition: 6, popup: 7, other: 8 };
const TBC = '12:00'; // placeholder time; the description states the real time is TBC

const IMPORT_ORG = {
  username: 'ksync_imports',
  email: 'imports@ksync.local',
  full_name: 'K-Sync Imports (Community)',
  organization_name: 'K-Sync Imports (Community)',
  organization_type: 'Community',
  social_handle: '@msiakpopfans',
  social_url: 'https://x.com/msiakpopfans',
  bio: 'Internal account for community-sourced event imports (sources: Malaysian Kpop Fans @msiakpopfans, Cupsleeve Malaysia, Megatix). Not a promoter.',
  location: 'Kuala Lumpur'
};

const VENUES = [
  { name: 'Stadium Merdeka', address: 'Jalan Stadium, 50150 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur', map_link: 'https://maps.google.com/?q=Stadium+Merdeka+Kuala+Lumpur' }
];

const ARTISTS = [
  { name: 'The Rose', group_type: 'Band', agency: 'Windfall' },
  { name: 'Yves', group_type: 'Solo', agency: 'PaiD' },
  { name: 'Yesung (SUPER JUNIOR)', group_type: 'Solo', agency: 'SM Entertainment' },
  { name: 'Lee Junho (2PM)', group_type: 'Solo', agency: 'JYP Entertainment' }
];

const KL_TBC = { venue_name: 'Venue TBC (Kuala Lumpur)', address: 'To be confirmed', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' };

const EVENTS = [
  {
    org_cat: 'popup', artist: 'Lee Junho (2PM)',
    event_name: "CUCKOOTOPIA 2026 POP-UP (2PM's Lee Junho)",
    event_date: '2026-10-25', start_time: TBC, ...KL_TBC,
    organizer_name: 'CUCKOO Malaysia', source: 'https://x.com/msiakpopfans', ticket: null,
    description: 'CUCKOOTOPIA 2026 pop-up event featuring 2PM\'s Lee Junho. (Time TBC; official schedule not published.)',
    ticket_info: 'TBC'
  },
  {
    org_cat: 'cupsleeve', artist: null,
    event_name: 'Cupsleeve Event in Kuala Lumpur (Cupsleeve Malaysia)',
    event_date: '2026-10-24', start_time: '10:00', ...KL_TBC,
    organizer_name: 'Cupsleeve Malaysia (@cupsleeveMY)', source: 'https://x.com/cupsleeveMY', ticket: null,
    description: 'Cupsleeve event in Kuala Lumpur, running 24–25 October 2026, 10AM–9PM. Walk-in; exact venue TBC.',
    ticket_info: 'Early bird RM8 (register online). Venue TBC.'
  },
  {
    org_cat: 'concert', artist: 'Lee Junho (2PM)',
    event_name: "CUCKOOTOPIA 2026 – 12th Anniversary Appreciation Concert (2PM's Lee Junho)",
    event_date: '2026-10-24', start_time: TBC,
    venue_name: 'Stadium Merdeka', address: 'Jalan Stadium, 50150 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur',
    organizer_name: 'CUCKOO Malaysia', source: 'https://x.com/msiakpopfans', ticket: null,
    description: "CUCKOO's 12th anniversary appreciation concert featuring 2PM's Lee Junho at Stadium Merdeka. Wristband redemption 21–24 Oct 2026, 10AM–6PM. (Show time TBC.)",
    ticket_info: 'Wristband redemption 21–24 Oct 2026, 10AM–6PM. Show time TBC.'
  },
  {
    org_cat: 'concert', artist: 'The Rose',
    event_name: 'ROSETOPIA in Kuala Lumpur (The Rose)',
    event_date: '2026-10-25', start_time: TBC, ...KL_TBC,
    organizer_name: 'TBC', source: 'https://x.com/msiakpopfans', ticket: null,
    description: 'The Rose live in Kuala Lumpur. (Venue and time TBC.)',
    ticket_info: 'TBC'
  },
  {
    org_cat: 'concert', artist: 'Yves',
    event_name: 'Yves in Kuala Lumpur',
    event_date: '2026-11-07', start_time: TBC, ...KL_TBC,
    organizer_name: 'TBC', source: 'https://x.com/msiakpopfans', ticket: null,
    description: 'Yves (former LOONA) live in Kuala Lumpur. (Venue and time TBC.)',
    ticket_info: 'TBC'
  },
  {
    org_cat: 'concert', artist: 'Yesung (SUPER JUNIOR)',
    event_name: 'YESUNG – "About the Things We Called Ordinary" in Kuala Lumpur',
    event_date: '2026-11-07', start_time: TBC, ...KL_TBC,
    organizer_name: 'TBC', source: 'https://x.com/msiakpopfans', ticket: null,
    description: 'Super Junior\'s Yesung live in Kuala Lumpur. (Venue and time TBC.)',
    ticket_info: 'TBC'
  },
  {
    org_cat: 'fanmeeting', artist: 'Yesung (SUPER JUNIOR)',
    event_name: 'YESUNG [Where We Are] – Fansign & 1v1 Photo Event in Malaysia',
    event_date: '2026-11-08', start_time: TBC, ...KL_TBC,
    organizer_name: 'Megatix Asia', source: 'https://megatix.asia/events/yesung-', ticket: 'https://megatix.asia/events/yesung-',
    description: 'Fansign and 1:1 photo event with Super Junior\'s Yesung in Kuala Lumpur. (Time and venue TBC.)',
    ticket_info: 'Applications via megatix.asia; deadline 20 October 2026.'
  },
  {
    org_cat: 'concert', artist: 'TOMORROW X TOGETHER (TXT)',
    event_name: 'TXT World Tour 2027 STEAL THE WIND – Kuala Lumpur',
    event_date: '2027-03-13', start_time: TBC, ...KL_TBC,
    organizer_name: 'TBC', source: 'https://kpopofficial.com/event/txt-world-tour-2027-kuala-lumpur/', ticket: null,
    description: 'TOMORROW X TOGETHER (TXT) World Tour 2027 "STEAL THE WIND" in Kuala Lumpur. (Venue and time TBC — officially announced only as "Kuala Lumpur".)',
    ticket_info: 'TBC'
  }
];

const slugify = (s) => s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const noLoginHash = () => bcrypt.hashSync(crypto.randomUUID() + crypto.randomUUID(), 10);

const apply = () => {
  // organiser
  let org = db.prepare('SELECT id FROM users WHERE username = ?').get(IMPORT_ORG.username);
  if (org) console.log(`  organiser exists  #${org.id} ${IMPORT_ORG.organization_name}`);
  else {
    const r = db.prepare(`INSERT INTO users
      (role_id, role, full_name, username, email, password_hash, bio, status,
       organization_name, organization_type, social_handle, social_url, is_verified_organizer, location, created_at, updated_at)
      VALUES (@role_id,'ORGANIZER',@full_name,@username,@email,@password_hash,@bio,'ACTIVE',
       @organization_name,@organization_type,@social_handle,@social_url,0,@location, datetime('now'), datetime('now'))`)
      .run({ role_id: ROLE_ORGANIZER_ID, password_hash: noLoginHash(), ...IMPORT_ORG });
    org = { id: r.lastInsertRowid };
    console.log(`  organiser ${APPLY ? 'INSERT' : 'WOULD INSERT'}  #${org.id} ${IMPORT_ORG.organization_name} <${IMPORT_ORG.email}>`);
  }

  // venues
  for (const v of VENUES) {
    const row = db.prepare('SELECT id FROM venues WHERE name = ?').get(v.name);
    if (row) { console.log(`  venue exists   #${row.id} ${v.name}`); continue; }
    const r = db.prepare("INSERT INTO venues (name, address, city, state, map_link, created_at) VALUES (?,?,?,?,?,datetime('now'))").run(v.name, v.address, v.city, v.state, v.map_link);
    console.log(`  venue ${APPLY ? 'INSERT' : 'WOULD INSERT'}   #${r.lastInsertRowid} ${v.name}`);
  }

  // artists
  for (const a of ARTISTS) {
    const row = db.prepare('SELECT id FROM artists WHERE name = ?').get(a.name);
    if (row) { console.log(`  artist exists  #${row.id} ${a.name}`); continue; }
    const r = db.prepare("INSERT INTO artists (name, group_type, agency, created_at) VALUES (?,?,?,datetime('now'))").run(a.name, a.group_type, a.agency);
    console.log(`  artist ${APPLY ? 'INSERT' : 'WOULD INSERT'}  #${r.lastInsertRowid} ${a.name}`);
  }

  // events
  const ins = db.prepare(`INSERT INTO events
    (organizer_id, artist_id, category_id, venue_id, event_name, description, event_date, start_time,
     venue_name, address, city, state, ticket_info, official_url, official_ticket_url, official_source_url, evidence_link,
     poster_image, event_status, verification_status, trust_level, promoter_name, organizer_name,
     organizer_social_url, organizer_type, country, slug, admin_verification_notes, created_at)
    VALUES (@organizer_id,@artist_id,@category_id,@venue_id,@event_name,@description,@event_date,@start_time,
     @venue_name,@address,@city,@state,@ticket_info,@official_url,@official_ticket_url,@official_source_url,@official_source_url,
     NULL,'UPCOMING','PENDING','PENDING',@promoter_name,@organizer_name,
     NULL,'Community','Malaysia',@slug,@admin_verification_notes, datetime('now'))`);

  for (const e of EVENTS) {
    if (db.prepare('SELECT id FROM events WHERE event_name = ? AND event_date = ?').get(e.event_name, e.event_date)) {
      console.log(`  event exists   ${e.event_date}  ${e.event_name}`); continue;
    }
    const v = db.prepare('SELECT id FROM venues WHERE name = ?').get(e.venue_name);
    const a = e.artist ? db.prepare('SELECT id FROM artists WHERE name = ?').get(e.artist) : null;
    const r = ins.run({
      organizer_id: org.id,
      artist_id: a ? a.id : null,
      category_id: CAT[e.org_cat],
      venue_id: v ? v.id : null,
      event_name: e.event_name,
      description: e.description,
      event_date: e.event_date,
      start_time: e.start_time,
      venue_name: e.venue_name,
      address: e.address,
      city: e.city,
      state: e.state,
      ticket_info: e.ticket_info,
      official_url: e.source,
      official_ticket_url: e.ticket,
      official_source_url: e.source,
      promoter_name: e.organizer_name,
      organizer_name: e.organizer_name,
      slug: slugify(e.event_name),
      admin_verification_notes: `Community import — verify before publishing. Source: ${e.source}`
    });
    console.log(`  event ${APPLY ? 'INSERT' : 'WOULD INSERT'}   #${r.lastInsertRowid} ${e.event_date} ${e.start_time}  [${e.org_cat}] ${e.event_name}`);
  }
};

console.log(`\nDB: ${DB_PATH}   mode: ${APPLY ? 'APPLY' : 'DRY RUN'}\n`);
if (APPLY) db.transaction(apply)();
else { db.exec('BEGIN'); try { apply(); } finally { db.exec('ROLLBACK'); } console.log('\n  -> rolled back; database/ksync.db unchanged.'); }

console.log('\n=== all events 18 Oct 2026 → 2027 ===');
console.table(db.prepare(`SELECT e.id, e.event_date, e.start_time, substr(e.event_name,1,46) AS event_name,
  c.name AS category, e.organizer_name, e.verification_status
  FROM events e JOIN event_categories c ON c.id = e.category_id
  WHERE e.event_date >= '2026-10-18' AND e.verification_status <> 'REJECTED' ORDER BY e.event_date, e.start_time`).all());
db.close();
