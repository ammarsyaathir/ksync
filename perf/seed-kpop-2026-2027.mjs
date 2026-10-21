/* Seeds REAL, sourced K-pop events in Malaysia from 18 Oct 2026 → 2027.
   - Creates REAL organiser accounts (real email / website / socials) and attributes events to them.
   - Every event carries official_source_url.
   - Idempotent: matches organiser by username, artist/venue by name, event by (name,date).

   Usage:  node perf/seed-kpop-2026-2027.mjs            (DRY RUN)
           APPLY=1 node perf/seed-kpop-2026-2027.mjs    (writes database/ksync.db)
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

/* ---------- REAL organisers (sourced) ---------- */
const ORGANISERS = [
  {
    username: 'livenation_my',
    email: 'info@livenation.my',
    full_name: 'Live Nation Malaysia Sdn. Bhd.',
    organization_name: 'Live Nation Malaysia',
    organization_type: 'Promoter',
    social_handle: '@livenation.my',
    social_url: 'https://www.instagram.com/livenation.my',
    bio: 'Official promoter. Website: https://www.livenation.my | X: https://x.com/livenationmy | Facebook: https://www.facebook.com/livenationmy | Reg. no. 1336528-A, Suite 805, PJ Tower, Amcorp Trade Centre, 18 Jalan Persiaran Barat, 46060 Petaling Jaya, Selangor.',
    location: 'Petaling Jaya, Selangor'
  },
  {
    username: 'threeangles',
    email: 'media@threeangles.asia',
    full_name: 'Three Angles Production',
    organization_name: 'Three Angles Production',
    organization_type: 'Promoter',
    social_handle: '@threeanglesproduction',
    social_url: 'https://www.instagram.com/threeanglesproduction',
    bio: 'Concert promoter / show producer since 2004. Website: https://threeangles.asia | X: https://x.com/Threeanglespro | Facebook: https://www.facebook.com/ThreeAngles',
    location: 'Kuala Lumpur'
  }
];

/* ---------- venues (added only if missing) ---------- */
const VENUES = [
  { name: 'Unifi Arena Bukit Jalil', address: 'Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur', map_link: 'https://maps.google.com/?q=Unifi+Arena+Bukit+Jalil' },
  { name: 'Idea Live Arena', address: 'Level 2, 3 Damansara, 3, Jalan SS20/27, Damansara Intan, 47400 Petaling Jaya, Selangor', city: 'Petaling Jaya', state: 'Selangor', map_link: 'https://maps.google.com/?q=Idea+Live+Arena+Damansara' },
  { name: 'TM Stadium Nasional (National Stadium Bukit Jalil)', address: 'Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur', map_link: 'https://maps.google.com/?q=National+Stadium+Bukit+Jalil' }
];

/* ---------- artists (added only if missing) ---------- */
const ARTISTS = [
  { name: 'BABYMONSTER', group_type: 'Girl Group', agency: 'YG Entertainment' },
  { name: 'izna', group_type: 'Girl Group', agency: 'WAKEONE' },
  { name: 'wave to earth', group_type: 'Band', agency: 'Wavy' },
  { name: 'Young K (DAY6)', group_type: 'Solo', agency: 'JYP Entertainment' }
];

/* ---------- events ---------- */
const BTS_TITLE = "BTS WORLD TOUR 'ARIRANG' IN KUALA LUMPUR";
const BTS_SRC = 'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786';
const BTS_POSTER = 'https://dynamicmedia.livenationinternational.com/p/i/r/0545f243-606d-4d8a-acb7-bb7210f21353.jpg';

const EVENTS = [
  {
    org: 'livenation_my', cat: 'concert',
    event_name: '2026-27 BABYMONSTER WORLD TOUR [춤 (CHOOM)] IN KUALA LUMPUR',
    artist: 'BABYMONSTER', event_date: '2026-11-14', start_time: '17:00', venue: 'Unifi Arena Bukit Jalil',
    description: 'BABYMONSTER bring their first world tour [춤 (CHOOM)] to Kuala Lumpur.',
    ticket_info: 'SOLD OUT. Official ticketing: GoLive Asia only.',
    ticket_url: 'https://www.golive-asia.com/event-detail/176/2026-27-BABYMONSTER-WORLD-TOUR-%EC%B6%A4-CHOOM-IN-KUALA-LUMPUR',
    source_url: 'https://www.livenation.my/event/2026-27-babymonster-world-tour-%EC%B6%A4-choom-in-kuala-lumpur-kuala-lumpur-tickets-edp1682916',
    poster: 'https://networksites.livenationinternational.com/networksites/5cabpce0/babymonster-group_press.jpg'
  },
  {
    org: 'livenation_my', cat: 'concert',
    event_name: 'wave to earth - the pieces tour',
    artist: 'wave to earth', event_date: '2026-11-22', start_time: '20:00', venue: 'Idea Live Arena',
    description: 'Korean indie band wave to earth on "the pieces tour", with support act Milena.',
    ticket_info: 'Official ticketing: GoLive Asia & Fantopia. Price not published on official page (TBC).',
    ticket_url: 'https://www.golive-asia.com/event-detail/174/wave-to-earth-the-pieces-tour',
    source_url: 'https://www.livenation.my/event/wave-to-earth-the-pieces-tour-kuala-lumpur-tickets-edp1674881',
    poster: 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg'
  },
  {
    org: 'threeangles', cat: 'concert',
    event_name: '2026-2027 izna Concert Tour: WHO DAT GIRL? in Kuala Lumpur',
    artist: 'izna', event_date: '2026-12-05', start_time: '19:00', venue: 'Zepp Kuala Lumpur',
    description: 'izna first concert tour "WHO DAT GIRL?" in Kuala Lumpur. Presented by Three Angles Production.',
    ticket_info: 'RM698 / RM598 / RM498. Official ticketing: etix.my. General sale opened 8 Oct 2026, 12PM.',
    ticket_url: 'https://www.etix.my/Event/SNTIZ26',
    source_url: 'https://www.etix.my/Event/SNTIZ26',
    poster: null
  },
  {
    org: 'livenation_my', cat: 'concert',
    event_name: BTS_TITLE + ' (Day 1)',
    artist: 'BTS (Bangtan Sonyeondan)', event_date: '2026-12-12', start_time: '19:30', venue: 'TM Stadium Nasional (National Stadium Bukit Jalil)',
    description: "BTS WORLD TOUR 'ARIRANG'. Day 1 of 2. All-seated, open-air stadium show on a 360-degree stage.",
    ticket_info: 'SOLD OUT. Official ticketing: GoLive Asia only.',
    ticket_url: 'https://www.golive-asia.com',
    source_url: BTS_SRC, poster: BTS_POSTER
  },
  {
    org: 'livenation_my', cat: 'concert',
    event_name: BTS_TITLE + ' (Day 2)',
    artist: 'BTS (Bangtan Sonyeondan)', event_date: '2026-12-13', start_time: '19:30', venue: 'TM Stadium Nasional (National Stadium Bukit Jalil)',
    description: "BTS WORLD TOUR 'ARIRANG'. Day 2 of 2. All-seated, open-air stadium show on a 360-degree stage.",
    ticket_info: 'SOLD OUT. Official ticketing: GoLive Asia only.',
    ticket_url: 'https://www.golive-asia.com',
    source_url: BTS_SRC, poster: BTS_POSTER
  },
  {
    org: 'livenation_my', cat: 'concert',
    event_name: 'Young K Solo Tour <YOUNGEST> in KUALA LUMPUR',
    artist: 'Young K (DAY6)', event_date: '2027-03-20', start_time: '17:00', venue: 'Idea Live Arena',
    description: 'Young K of DAY6, solo tour <YOUNGEST>, in Kuala Lumpur.',
    ticket_info: 'Official ticketing: GoLive Asia & fantopia.io. Price not published on official page (TBC).',
    ticket_url: 'https://www.golive-asia.com/event-detail/182/Young-K-Solo-Tour-YOUNGEST-in-KUALA-LUMPUR',
    source_url: 'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537',
    poster: 'https://networksites.livenationinternational.com/networksites/dfbjl3iz/young-k.webp'
  }
];

const slugify = (s) => s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const noLoginHash = () => bcrypt.hashSync(crypto.randomUUID() + crypto.randomUUID(), 10);

const apply = () => {
  /* organisers */
  const orgId = {};
  const findOrg = db.prepare('SELECT id, username FROM users WHERE username = ?');
  const findEmail = db.prepare('SELECT id FROM users WHERE email = ?');
  const insOrg = db.prepare(`INSERT INTO users
    (role_id, role, full_name, username, email, password_hash, bio, status,
     organization_name, organization_type, social_handle, social_url, is_verified_organizer, location, created_at, updated_at)
    VALUES (@role_id,'ORGANIZER',@full_name,@username,@email,@password_hash,@bio,'ACTIVE',
     @organization_name,@organization_type,@social_handle,@social_url,1,@location, datetime('now'), datetime('now'))`);
  for (const o of ORGANISERS) {
    const found = findOrg.get(o.username);
    if (found) { orgId[o.username] = found.id; console.log(`  organiser exists  #${found.id} ${o.organization_name}`); continue; }
    if (findEmail.get(o.email)) throw new Error(`email already used: ${o.email}`);
    const r = insOrg.run({ role_id: ROLE_ORGANIZER_ID, password_hash: noLoginHash(), ...o });
    orgId[o.username] = r.lastInsertRowid;
    console.log(`  organiser ${APPLY ? 'INSERT' : 'WOULD INSERT'}  #${r.lastInsertRowid} ${o.organization_name} <${o.email}>`);
  }

  /* venues */
  const findVenue = db.prepare('SELECT id FROM venues WHERE name = ?');
  const insVenue = db.prepare("INSERT INTO venues (name, address, city, state, map_link, created_at) VALUES (?,?,?,?,?,datetime('now'))");
  for (const v of VENUES) {
    const row = findVenue.get(v.name);
    if (row) { console.log(`  venue exists   #${row.id} ${v.name}`); continue; }
    const r = insVenue.run(v.name, v.address, v.city, v.state, v.map_link);
    console.log(`  venue ${APPLY ? 'INSERT' : 'WOULD INSERT'}   #${r.lastInsertRowid} ${v.name}`);
  }

  /* artists */
  const findArtist = db.prepare('SELECT id FROM artists WHERE name = ?');
  const insArtist = db.prepare("INSERT INTO artists (name, group_type, agency, created_at) VALUES (?,?,?,datetime('now'))");
  for (const a of ARTISTS) {
    const row = findArtist.get(a.name);
    if (row) { console.log(`  artist exists  #${row.id} ${a.name}`); continue; }
    const r = insArtist.run(a.name, a.group_type, a.agency);
    console.log(`  artist ${APPLY ? 'INSERT' : 'WOULD INSERT'}  #${r.lastInsertRowid} ${a.name}`);
  }

  /* events */
  const findEvent = db.prepare('SELECT id FROM events WHERE event_name = ? AND event_date = ?');
  const insEvent = db.prepare(`INSERT INTO events
    (organizer_id, artist_id, category_id, venue_id, event_name, description, event_date, start_time, end_time,
     venue_name, address, city, state, ticket_info, official_url, official_ticket_url, official_source_url, evidence_link,
     poster_image, event_status, verification_status, trust_level, promoter_name, organizer_name,
     organizer_social_url, organizer_type, country, slug, admin_verification_notes, created_at)
    VALUES (@organizer_id,@artist_id,@category_id,@venue_id,@event_name,@description,@event_date,@start_time,NULL,
     @venue_name,@address,@city,@state,@ticket_info,@official_url,@official_ticket_url,@official_source_url,@official_source_url,
     @poster_image,'UPCOMING','VERIFIED','VERIFIED',@promoter_name,@organizer_name,
     @organizer_social_url,'Promoter','Malaysia',@slug,@admin_verification_notes, datetime('now'))`);
  for (const e of EVENTS) {
    if (findEvent.get(e.event_name, e.event_date)) { console.log(`  event exists   ${e.event_date}  ${e.event_name}`); continue; }
    const v = db.prepare('SELECT id, name, address, city, state FROM venues WHERE name = ?').get(e.venue);
    if (!v) throw new Error(`venue not found: ${e.venue}`);
    const org = ORGANISERS.find((o) => o.username === e.org);
    const a = findArtist.get(e.artist);
    const r = insEvent.run({
      organizer_id: orgId[e.org],
      artist_id: a ? a.id : null,
      category_id: CAT[e.cat],
      venue_id: v.id,
      event_name: e.event_name,
      description: e.description,
      event_date: e.event_date,
      start_time: e.start_time,
      venue_name: v.name,
      address: v.address || 'Kuala Lumpur, Malaysia',
      city: v.city || 'Kuala Lumpur',
      state: v.state || 'W.P. Kuala Lumpur',
      ticket_info: e.ticket_info,
      official_url: e.source_url,
      official_ticket_url: e.ticket_url,
      official_source_url: e.source_url,
      poster_image: e.poster,
      promoter_name: org.organization_name,
      organizer_name: org.organization_name,
      organizer_social_url: org.social_url,
      slug: slugify(e.event_name),
      admin_verification_notes: `Imported from official source: ${e.source_url}`
    });
    console.log(`  event ${APPLY ? 'INSERT' : 'WOULD INSERT'}   #${r.lastInsertRowid} ${e.event_date} ${e.start_time}  ${e.event_name}`);
  }
};

console.log(`\nDB: ${DB_PATH}   mode: ${APPLY ? 'APPLY' : 'DRY RUN'}   ORGANIZER role_id: ${ROLE_ORGANIZER_ID}\n`);
if (APPLY) db.transaction(apply)();
else { db.exec('BEGIN'); try { apply(); } finally { db.exec('ROLLBACK'); } console.log('\n  -> rolled back; database/ksync.db unchanged.'); }

console.log('\n=== events from 18 Oct 2026 onward ===');
console.table(db.prepare(`SELECT e.id, e.event_date, e.start_time, substr(e.event_name,1,52) AS event_name,
  e.promoter_name, e.verification_status FROM events e WHERE e.event_date >= '2026-10-18' ORDER BY e.event_date`).all());
db.close();
