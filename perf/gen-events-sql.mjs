/* Generates database/seed_events_full_mysql.sql — every insertable column of the
   live `events` table (34 cols; `id` is AUTO_INCREMENT), for 14 K-pop events in
   Malaysia 18 Oct 2026 → 2027. Then validates the output against a SQLite mirror
   built to the same 35-column shape and runs it twice (idempotency).

   Confirmed venues come from the official promoters. Venues marked "best guess"
   are the most likely real Malaysian K-pop venues, flagged in
   admin_verification_notes. */
import Database from 'better-sqlite3';
import fs from 'node:fs';
import { ARTIST_OVERRIDES } from './artists-data.mjs';
import { mysqlDdlToSqlite } from './members-util.mjs';

const PH = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop'
];
const V = {
  unifi: { venue_name: 'Unifi Arena (Axiata Arena), Bukit Jalil', address: 'Kompleks Sukan Negara, Bukit Jalil, 57000 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' },
  stadium: { venue_name: 'TM Stadium Nasional (National Stadium Bukit Jalil)', address: 'Stadium Nasional Bukit Jalil, Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' },
  merdeka: { venue_name: 'Stadium Merdeka', address: 'Stadium Merdeka, Jalan Stadium, 50150 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' },
  zepp: { venue_name: 'Zepp Kuala Lumpur', address: 'Zepp Kuala Lumpur, BBCC, 2, Jalan Hang Tuah, 55100 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' },
  idea: { venue_name: 'Idea Live Arena', address: 'Level 2, 3 Damansara, Jalan SS20/27, Damansara Intan, 47400 Petaling Jaya, Selangor', city: 'Petaling Jaya', state: 'Selangor' },
  lalaport: { venue_name: 'LaLaport BBCC, Kuala Lumpur', address: 'LaLaport BBCC, 2, Jalan Hang Tuah, 55100 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' },
  pavilion: { venue_name: 'Pavilion Kuala Lumpur', address: 'Pavilion Kuala Lumpur, 168, Jalan Bukit Bintang, 55100 Kuala Lumpur', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur' }
};
const RULES_CONCERT = '1. Admission by ticket only; re-entry is not permitted.\n2. No professional cameras, DSLRs or telephoto lenses.\n3. Official artist lightsticks only; no laser pointers.\n4. Bags are subject to security screening; no outside food or drinks.\n5. No smoking, vaping, or alcohol inside the venue.';
const RULES_FAN = '1. Admission by registration or ticket only.\n2. No professional cameras or recording equipment.\n3. Please follow staff instructions and respect other fans.\n4. No outside food or drinks in the event area.';
const RULES_CAFE = '1. Walk-in with any purchase; no ticket required.\n2. Please keep the space tidy and respect other guests.\n3. No outside food or drinks.\n4. Photography for personal use only.';
const LN = { organizer_name: 'Live Nation Malaysia', organizer_social_url: 'https://www.instagram.com/livenation.my', organizer_type: 'Promoter', promoter_name: 'Live Nation Malaysia' };
const TA = { organizer_name: 'Three Angles Production', organizer_social_url: 'https://www.instagram.com/threeanglesproduction', organizer_type: 'Promoter', promoter_name: 'Three Angles Production' };
const IM = { organizer_name: 'K-Sync Imports (Community)', organizer_social_url: 'https://x.com/msiakpopfans', organizer_type: 'Community' };

const ARTISTS = [
  { name: 'BTS (Bangtan Sonyeondan)', korean_name: '방탄소년단', group_type: 'Boy Group', agency: 'BIGHIT MUSIC', debut_year: 2013, image_url: PH[3],
    description: 'BTS is a 7-member South Korean boy group under BIGHIT MUSIC, debuted in 2013. One of the best-selling music acts in the world; their ARIRANG world tour plays Kuala Lumpur in December 2026.',
    members: [
      { stage_name: 'RM', birth_name: 'Kim Nam-joon (김남준)', position: 'Leader, Main Rapper', nationality: 'South Korean' },
      { stage_name: 'Jin', birth_name: 'Kim Seok-jin (김석진)', position: 'Sub Vocalist, Visual', nationality: 'South Korean' },
      { stage_name: 'SUGA', birth_name: 'Min Yoon-gi (민윤기)', position: 'Lead Rapper', nationality: 'South Korean' },
      { stage_name: 'j-hope', birth_name: 'Jung Ho-seok (정호석)', position: 'Main Dancer, Lead Rapper', nationality: 'South Korean' },
      { stage_name: 'Jimin', birth_name: 'Park Ji-min (박지민)', position: 'Main Dancer, Lead Vocalist', nationality: 'South Korean' },
      { stage_name: 'V', birth_name: 'Kim Tae-hyung (김태형)', position: 'Sub Vocalist, Visual', nationality: 'South Korean' },
      { stage_name: 'Jungkook', birth_name: 'Jeon Jung-kook (전정국)', position: 'Main Vocalist, Maknae', nationality: 'South Korean' }
    ] },
  { name: 'BABYMONSTER', korean_name: '베이비몬스터', group_type: 'Girl Group', agency: 'YG Entertainment', debut_year: 2024, image_url: PH[0],
    description: 'BABYMONSTER is a 7-member girl group under YG Entertainment, debuted in 2024. Their first world tour [춤 (CHOOM)] reaches Kuala Lumpur in November 2026.',
    members: [
      { stage_name: 'Ruka', birth_name: 'Ruka Kawai (河井瑠花)', position: 'Main Rapper', nationality: 'Japanese' },
      { stage_name: 'Pharita', birth_name: 'Pharita Chaikong', position: 'Lead Vocalist', nationality: 'Thai' },
      { stage_name: 'Asa', birth_name: 'Asa Enami (榎並杏紗)', position: 'Main Rapper', nationality: 'Japanese' },
      { stage_name: 'Ahyeon', birth_name: 'Jung Ah-hyeon (정아현)', position: 'Main Vocalist, Rapper', nationality: 'South Korean' },
      { stage_name: 'Rami', birth_name: 'Shin Ha-ram (신하람)', position: 'Lead Vocalist', nationality: 'South Korean' },
      { stage_name: 'Rora', birth_name: 'Lee Da-in (이다인)', position: 'Vocalist', nationality: 'South Korean' },
      { stage_name: 'Chiquita', birth_name: 'Chiquita Riracha Phondechaphiphat', position: 'Vocalist, Maknae', nationality: 'Thai' }
    ] },
  { name: 'izna', korean_name: '이즈나', group_type: 'Girl Group', agency: 'WAKEONE', debut_year: 2024, image_url: PH[2],
    description: 'izna is a 7-member girl group formed through Mnet\'s I-LAND 2 and managed by WAKEONE, debuted in 2024. Their first concert tour "WHO DAT GIRL?" plays Kuala Lumpur in December 2026.',
    members: [
      { stage_name: 'Mai', birth_name: 'Tomioka Mai (富岡茉衣)', position: 'Vocalist', nationality: 'Japanese' },
      { stage_name: 'Bang Jieun', birth_name: 'Bang Jieun (방지은)', position: 'Vocalist', nationality: 'South Korean' },
      { stage_name: 'Yoon Jiyoon', birth_name: 'Yoon Jiyoon (윤지윤)', position: 'Vocalist', nationality: 'South Korean' },
      { stage_name: 'Jeong Saebi', birth_name: 'Jeong Saebi (정새비)', position: 'Vocalist', nationality: 'South Korean' },
      { stage_name: 'Choi Jungeun', birth_name: 'Choi Jungeun (최정은)', position: 'Vocalist', nationality: 'South Korean' },
      { stage_name: 'Ryu Sarang', birth_name: 'Ryu Sarang (류사랑)', position: 'Vocalist', nationality: 'South Korean' },
      { stage_name: 'Myung Jieun', birth_name: 'Myung Jieun (명지은)', position: 'Vocalist, Maknae', nationality: 'South Korean' }
    ] },
  { name: 'wave to earth', korean_name: '웨이브투어스', group_type: 'Band', agency: 'Wavy', debut_year: 2019, image_url: PH[1],
    description: 'wave to earth is a South Korean indie band formed in 2019, known for a soft jazz-influenced sound. Their "the pieces tour" reaches Kuala Lumpur in November 2026.',
    members: [
      { stage_name: 'Daniel Kim', birth_name: 'Kim Daniel (김다니엘)', position: 'Vocals, Guitar', nationality: 'South Korean' },
      { stage_name: 'John Cha', birth_name: 'Cha Soon-jong (차순종)', position: 'Bass', nationality: 'South Korean' },
      { stage_name: 'Dong Q', birth_name: 'Shin Dong-gyu (신동규)', position: 'Drums', nationality: 'South Korean' }
    ] },
  { name: 'Young K (DAY6)', korean_name: '영케이', group_type: 'Soloist', agency: 'JYP Entertainment', debut_year: 2021, image_url: PH[2],
    description: 'Young K is the bassist and vocalist of DAY6 (JYP Entertainment). As a solo artist he debuted in 2021; his solo tour <YOUNGEST> plays Kuala Lumpur in March 2027.',
    members: [
      { stage_name: 'Young K', birth_name: 'Kang Young-hyun (강영현)', position: 'Bass, Vocals (DAY6)', nationality: 'South Korean' }
    ] },
  { name: 'The Rose', korean_name: '더로즈', group_type: 'Band', agency: 'Windfall', debut_year: 2017, image_url: PH[6],
    description: 'The Rose is a 4-member South Korean indie rock band formed in 2017, now operating under their own label Windfall. ROSETOPIA reaches Kuala Lumpur in October 2026.',
    members: [
      { stage_name: 'Woosung', birth_name: 'Kim Woo-sung (김우성)', position: 'Vocals, Guitar', nationality: 'Korean-American' },
      { stage_name: 'Dojoon', birth_name: 'Park Do-joon (박도준)', position: 'Vocals, Guitar', nationality: 'South Korean' },
      { stage_name: 'Hajoon', birth_name: 'Lee Ha-joon (이하준)', position: 'Drums', nationality: 'South Korean' },
      { stage_name: 'Jaehyeong', birth_name: 'Lee Jae-hyeong (이재형)', position: 'Bass', nationality: 'South Korean' }
    ] },
  { name: 'Yves', korean_name: '이브', group_type: 'Soloist', agency: '', debut_year: 2024, image_url: PH[2],
    description: 'Yves is a South Korean solo artist and former member of LOONA, who debuted as a soloist in 2024. (Agency to be confirmed.)',
    members: [
      { stage_name: 'Yves', birth_name: 'Ha Soo-young (하수영)', position: 'Soloist (former LOONA)', nationality: 'South Korean' }
    ] },
  { name: 'Yesung (SUPER JUNIOR)', korean_name: '예성', group_type: 'Soloist', agency: 'SM Entertainment', debut_year: 2016, image_url: PH[5],
    description: 'Yesung is the main vocalist of SUPER JUNIOR (SM Entertainment). He debuted as a solo artist in 2016; he performs in Kuala Lumpur in November 2026.',
    members: [
      { stage_name: 'Yesung', birth_name: 'Kim Jong-woon (김종운)', position: 'Main Vocalist (SUPER JUNIOR)', nationality: 'South Korean' }
    ] },
  { name: 'Lee Junho (2PM)', korean_name: '이준호', group_type: 'Soloist', agency: 'JYP Entertainment', debut_year: 2013, image_url: PH[3],
    description: 'Lee Junho is a member of 2PM (JYP Entertainment) and an award-winning actor. He debuted as a solo artist in 2013 and headlines CUCKOOTOPIA 2026 in Kuala Lumpur.',
    members: [
      { stage_name: 'Lee Junho', birth_name: 'Lee Jun-ho (이준호)', position: 'Vocalist (2PM), Actor', nationality: 'South Korean' }
    ] }
];

// Overlay the full per-member bios (see perf/artists-data.mjs)
for (const a of ARTISTS) {
  const ov = ARTIST_OVERRIDES[a.name];
  if (!ov) continue;
  if (ov.members) a.members = ov.members;
  if (ov.description) a.description = ov.description;
}

const E = [
  { org: 'livenation_my', artist: 'BABYMONSTER', cat: 'concert', ...LN,
    event_name: '2026-27 BABYMONSTER WORLD TOUR [춤 (CHOOM)] IN KUALA LUMPUR', slug: '2026-27-babymonster-world-tour-choom-in-kuala-lumpur',
    description: 'BABYMONSTER bring their first world tour [춤 (CHOOM)] to Kuala Lumpur. Presented by Live Nation Malaysia.',
    event_date: '2026-11-14', start_time: '17:00:00', end_time: '20:00:00', ...V.unifi,
    ticket_info: 'SOLD OUT. Official ticketing: GoLive Asia only.',
    event_rules: RULES_CONCERT, official_url: 'https://www.livenation.my/event/2026-27-babymonster-world-tour-%EC%B6%A4-choom-in-kuala-lumpur-kuala-lumpur-tickets-edp1682916',
    poster_image: 'https://networksites.livenationinternational.com/networksites/5cabpce0/babymonster-group_press.jpg',
    gallery_images: [PH[0], PH[1]], evidence_link: 'https://www.livenation.my/event/2026-27-babymonster-world-tour-%EC%B6%A4-choom-in-kuala-lumpur-kuala-lumpur-tickets-edp1682916',
    verification_status: 'VERIFIED', trust_level: 'VERIFIED', tracking_code: 'KSYNC-IMP-2026-0001',
    admin_verification_notes: 'Verified from official promoter (Live Nation Malaysia). Sold out at time of import.' },

  { org: 'livenation_my', artist: 'wave to earth', cat: 'concert', ...LN,
    event_name: 'wave to earth - the pieces tour', slug: 'wave-to-earth-the-pieces-tour',
    description: 'Korean indie band wave to earth on "the pieces tour", with support act Milena. Presented by Live Nation Malaysia.',
    event_date: '2026-11-22', start_time: '20:00:00', end_time: '23:00:00', ...V.idea,
    ticket_info: 'Official ticketing: GoLive Asia & Fantopia. Category prices were not published on the official page.',
    event_rules: RULES_CONCERT, official_url: 'https://www.livenation.my/event/wave-to-earth-the-pieces-tour-kuala-lumpur-tickets-edp1674881',
    poster_image: 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg',
    gallery_images: [PH[1], PH[2]], evidence_link: 'https://www.livenation.my/event/wave-to-earth-the-pieces-tour-kuala-lumpur-tickets-edp1674881',
    verification_status: 'VERIFIED', trust_level: 'VERIFIED', tracking_code: 'KSYNC-IMP-2026-0002',
    admin_verification_notes: 'Verified from official promoter (Live Nation Malaysia). Ticket prices not published.' },

  { org: 'threeangles', artist: 'izna', cat: 'concert', ...TA,
    event_name: '2026-2027 izna Concert Tour: WHO DAT GIRL? in Kuala Lumpur', slug: '2026-2027-izna-concert-tour-who-dat-girl-in-kuala-lumpur',
    description: 'izna first concert tour "WHO DAT GIRL?" in Kuala Lumpur. Presented by Three Angles Production.',
    event_date: '2026-12-05', start_time: '19:00:00', end_time: '22:00:00', ...V.zepp,
    ticket_info: 'RM698 / RM598 / RM498. Official ticketing: etix.my. General sale opened 8 Oct 2026, 12PM.',
    event_rules: RULES_CONCERT, official_url: 'https://www.etix.my/Event/SNTIZ26',
    poster_image: PH[0], gallery_images: [PH[0], PH[2]],
    evidence_link: 'https://www.etix.my/Event/SNTIZ26',
    verification_status: 'VERIFIED', trust_level: 'VERIFIED', tracking_code: 'KSYNC-IMP-2026-0003',
    admin_verification_notes: 'Verified from official ticketing (etix.my). poster_image is a placeholder - official poster not published on the ticketing page.' },

  { org: 'livenation_my', artist: 'BTS (Bangtan Sonyeondan)', cat: 'concert', ...LN,
    event_name: "BTS WORLD TOUR 'ARIRANG' IN KUALA LUMPUR (Day 1)", slug: 'bts-world-tour-arirang-in-kuala-lumpur-day-1',
    description: "BTS WORLD TOUR 'ARIRANG'. Day 1 of 2 at the National Stadium. All-seated, open-air stadium show on a 360-degree stage. Presented by Live Nation Malaysia.",
    event_date: '2026-12-12', start_time: '19:30:00', end_time: '23:00:00', ...V.stadium,
    ticket_info: 'SOLD OUT. Official ticketing: GoLive Asia only.',
    event_rules: RULES_CONCERT, official_url: 'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
    poster_image: 'https://dynamicmedia.livenationinternational.com/p/i/r/0545f243-606d-4d8a-acb7-bb7210f21353.jpg',
    gallery_images: [PH[3], PH[4]], evidence_link: 'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
    verification_status: 'VERIFIED', trust_level: 'VERIFIED', tracking_code: 'KSYNC-IMP-2026-0004',
    admin_verification_notes: 'Verified from official promoter (Live Nation Malaysia). Day 1 of 2.' },

  { org: 'livenation_my', artist: 'BTS (Bangtan Sonyeondan)', cat: 'concert', ...LN,
    event_name: "BTS WORLD TOUR 'ARIRANG' IN KUALA LUMPUR (Day 2)", slug: 'bts-world-tour-arirang-in-kuala-lumpur-day-2',
    description: "BTS WORLD TOUR 'ARIRANG'. Day 2 of 2 at the National Stadium. All-seated, open-air stadium show on a 360-degree stage. Presented by Live Nation Malaysia.",
    event_date: '2026-12-13', start_time: '19:30:00', end_time: '23:00:00', ...V.stadium,
    ticket_info: 'SOLD OUT. Official ticketing: GoLive Asia only.',
    event_rules: RULES_CONCERT, official_url: 'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
    poster_image: 'https://dynamicmedia.livenationinternational.com/p/i/r/0545f243-606d-4d8a-acb7-bb7210f21353.jpg',
    gallery_images: [PH[3], PH[5]], evidence_link: 'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
    verification_status: 'VERIFIED', trust_level: 'VERIFIED', tracking_code: 'KSYNC-IMP-2026-0005',
    admin_verification_notes: 'Verified from official promoter (Live Nation Malaysia). Day 2 of 2.' },

  { org: 'livenation_my', artist: 'Young K (DAY6)', cat: 'concert', ...LN,
    event_name: 'Young K Solo Tour <YOUNGEST> in KUALA LUMPUR', slug: 'young-k-solo-tour-youngest-in-kuala-lumpur',
    description: 'Young K of DAY6 brings his solo tour <YOUNGEST> to Kuala Lumpur. Presented by Live Nation Malaysia.',
    event_date: '2027-03-20', start_time: '17:00:00', end_time: '20:00:00', ...V.idea,
    ticket_info: 'Official ticketing: GoLive Asia & fantopia.io. Category prices were not published on the official page.',
    event_rules: RULES_CONCERT, official_url: 'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537',
    poster_image: 'https://networksites.livenationinternational.com/networksites/dfbjl3iz/young-k.webp',
    gallery_images: [PH[2], PH[6]], evidence_link: 'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537',
    verification_status: 'VERIFIED', trust_level: 'VERIFIED', tracking_code: 'KSYNC-IMP-2027-0006',
    admin_verification_notes: 'Verified from official promoter (Live Nation Malaysia). Ticket prices not published.' },

  { org: 'ksync_imports', artist: null, cat: 'cupsleeve', ...IM,
    event_name: 'Cupsleeve Event in Kuala Lumpur (Cupsleeve Malaysia)', slug: 'cupsleeve-event-in-kuala-lumpur-cupsleeve-malaysia',
    description: 'Cupsleeve event in Kuala Lumpur, running 24-25 October 2026, 10AM-9PM. Walk-in fan gathering with themed drinks, photocards and freebies.',
    event_date: '2026-10-24', start_time: '10:00:00', end_time: '21:00:00', ...V.lalaport,
    ticket_info: 'Early bird RM8 (register online); walk-in with any purchase.',
    event_rules: RULES_CAFE, official_url: 'https://x.com/cupsleeveMY',
    poster_image: PH[6], gallery_images: [PH[6]],
    evidence_link: 'https://x.com/cupsleeveMY',
    promoter_name: 'Cupsleeve Malaysia', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0007',
    admin_verification_notes: 'Community import - verify before publishing. Date/time from @cupsleeveMY. Venue (LaLaport BBCC) is the most likely location - confirm with the organiser.' },

  { org: 'ksync_imports', artist: 'Lee Junho (2PM)', cat: 'concert', ...IM,
    event_name: "CUCKOOTOPIA 2026 - 12th Anniversary Appreciation Concert (2PM's Lee Junho)", slug: 'cuckootopia-2026-12th-anniversary-appreciation-concert-2pms-lee-junho',
    description: "CUCKOO's 12th anniversary appreciation concert featuring 2PM's Lee Junho at Stadium Merdeka. Wristband redemption 21-24 Oct 2026, 10AM-6PM.",
    event_date: '2026-10-24', start_time: '19:00:00', end_time: '22:00:00', ...V.merdeka,
    ticket_info: 'Wristband redemption 21-24 Oct 2026, 10AM-6PM. Show time to be confirmed by the organiser.',
    event_rules: RULES_CONCERT, official_url: 'https://x.com/msiakpopfans',
    poster_image: PH[3], gallery_images: [PH[3], PH[0]],
    evidence_link: 'https://x.com/msiakpopfans',
    promoter_name: 'CUCKOO Malaysia', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0008',
    admin_verification_notes: 'Community import - verify before publishing. Venue (Stadium Merdeka) from @msiakpopfans. Show time is an estimate - confirm.' },

  { org: 'ksync_imports', artist: 'Lee Junho (2PM)', cat: 'pop-up-event', ...IM,
    event_name: "CUCKOOTOPIA 2026 POP-UP (2PM's Lee Junho)", slug: 'cuckootopia-2026-pop-up-2pms-lee-junho',
    description: "CUCKOOTOPIA 2026 merchandise pop-up featuring 2PM's Lee Junho, with exclusive goods and interactive zones.",
    event_date: '2026-10-25', start_time: '10:00:00', end_time: '22:00:00', ...V.pavilion,
    ticket_info: 'Free entry (walk-in). Official schedule to be confirmed.',
    event_rules: RULES_CAFE, official_url: 'https://x.com/msiakpopfans',
    poster_image: PH[4], gallery_images: [PH[4]],
    evidence_link: 'https://x.com/msiakpopfans',
    promoter_name: 'CUCKOO Malaysia', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0009',
    admin_verification_notes: 'Community import - verify before publishing. Time and venue (Pavilion KL) are best guesses - official pop-up details not published.' },

  { org: 'ksync_imports', artist: 'The Rose', cat: 'concert', ...IM,
    event_name: 'ROSETOPIA in Kuala Lumpur (The Rose)', slug: 'rosetopia-in-kuala-lumpur-the-rose',
    description: 'Korean indie rock band The Rose bring ROSETOPIA to Kuala Lumpur.',
    event_date: '2026-10-25', start_time: '19:00:00', end_time: '22:00:00', ...V.zepp,
    ticket_info: 'Official ticketing details to be announced.',
    event_rules: RULES_CONCERT, official_url: 'https://x.com/msiakpopfans',
    poster_image: PH[1], gallery_images: [PH[1], PH[6]],
    evidence_link: 'https://x.com/msiakpopfans',
    promoter_name: 'TBC', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0010',
    admin_verification_notes: 'Community import - verify before publishing. Venue (Zepp KL) and time are best guesses - confirm with the promoter.' },

  { org: 'ksync_imports', artist: 'Yves', cat: 'concert', ...IM,
    event_name: 'Yves in Kuala Lumpur', slug: 'yves-in-kuala-lumpur',
    description: 'Yves, former LOONA member, performs live in Kuala Lumpur.',
    event_date: '2026-11-07', start_time: '19:00:00', end_time: '22:00:00', ...V.zepp,
    ticket_info: 'Official ticketing details to be announced.',
    event_rules: RULES_CONCERT, official_url: 'https://x.com/msiakpopfans',
    poster_image: PH[2], gallery_images: [PH[2]],
    evidence_link: 'https://x.com/msiakpopfans',
    promoter_name: 'TBC', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0011',
    admin_verification_notes: 'Community import - verify before publishing. Venue (Zepp KL) and time are best guesses - confirm with the promoter.' },

  { org: 'ksync_imports', artist: 'Yesung (SUPER JUNIOR)', cat: 'concert', ...IM,
    event_name: 'YESUNG - "About the Things We Called Ordinary" in Kuala Lumpur', slug: 'yesung-about-the-things-we-called-ordinary-in-kuala-lumpur',
    description: "SUPER JUNIOR's Yesung brings his solo show to Kuala Lumpur.",
    event_date: '2026-11-07', start_time: '19:00:00', end_time: '22:00:00', ...V.zepp,
    ticket_info: 'Official ticketing details to be announced.',
    event_rules: RULES_CONCERT, official_url: 'https://x.com/msiakpopfans',
    poster_image: PH[5], gallery_images: [PH[5], PH[3]],
    evidence_link: 'https://x.com/msiakpopfans',
    promoter_name: 'TBC', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0012',
    admin_verification_notes: 'Community import - verify before publishing. Venue (Zepp KL) and time are best guesses - confirm with the promoter.' },

  { org: 'ksync_imports', artist: 'Yesung (SUPER JUNIOR)', cat: 'fan-meeting', ...IM,
    event_name: 'YESUNG [Where We Are] - Fansign & 1v1 Photo Event in Malaysia', slug: 'yesung-where-we-are-fansign-1v1-photo-event-in-malaysia',
    description: "Fansign and 1:1 photo event with SUPER JUNIOR's Yesung in Kuala Lumpur. Registration via Megatix.",
    event_date: '2026-11-08', start_time: '13:00:00', end_time: '18:00:00', ...V.pavilion,
    ticket_info: 'Applications via megatix.asia. Application deadline 20 October 2026.',
    event_rules: RULES_FAN, official_url: 'https://megatix.asia',
    poster_image: PH[5], gallery_images: [PH[5]],
    evidence_link: 'https://megatix.asia',
    promoter_name: 'Megatix Asia', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2026-0013',
    admin_verification_notes: 'Community import - verify before publishing. Time and venue (Pavilion KL) are best guesses - confirm with the organiser.' },

  { org: 'ksync_imports', artist: 'TOMORROW X TOGETHER (TXT)', cat: 'concert', ...IM,
    event_name: 'TXT World Tour 2027 STEAL THE WIND - Kuala Lumpur', slug: 'txt-world-tour-2027-steal-the-wind-kuala-lumpur',
    description: 'TOMORROW X TOGETHER (TXT) World Tour 2027 "STEAL THE WIND" in Kuala Lumpur. Officially announced as "Kuala Lumpur"; full details to follow.',
    event_date: '2027-03-13', start_time: '19:00:00', end_time: '22:00:00', ...V.unifi,
    ticket_info: 'Official ticketing details to be announced.',
    event_rules: RULES_CONCERT, official_url: 'https://kpopofficial.com/schedule/malaysia',
    poster_image: PH[4], gallery_images: [PH[4], PH[1]],
    evidence_link: 'https://kpopofficial.com/schedule/malaysia',
    promoter_name: 'TBC', verification_status: 'PENDING', trust_level: 'PENDING', tracking_code: 'KSYNC-IMP-2027-0014',
    admin_verification_notes: 'Community import - verify before publishing. Only "Kuala Lumpur" announced; venue (Unifi Arena) and time are best guesses.' }
];

const q = (v) => (v === null || v === undefined) ? 'NULL' : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;

const COLS = ['organizer_id', 'artist_id', 'category_id', 'event_name', 'slug', 'description', 'event_date', 'start_time', 'end_time',
  'venue_name', 'address', 'city', 'state', 'ticket_info', 'event_rules', 'official_url', 'poster_image', 'gallery_images',
  'event_status', 'verification_status', 'trust_level', 'rejection_reason', 'admin_verification_notes', 'tracking_code',
  'promoter_name', 'submitter_name', 'submitter_email', 'evidence_link', 'organizer_name', 'organizer_social_url',
  'organizer_type', 'submitter_social', 'created_at', 'updated_at'];

function eventSql(e) {
  const gallery = JSON.stringify(e.gallery_images || []);
  const vals = [
    `(SELECT \`id\` FROM \`users\` WHERE \`username\` = ${q(e.org)})`,
    e.artist ? `(SELECT \`id\` FROM \`artists\` WHERE \`name\` = ${q(e.artist)})` : 'NULL',
    `(SELECT \`id\` FROM \`event_categories\` WHERE \`slug\` = ${q(e.cat)})`,
    q(e.event_name), q(e.slug), q(e.description), q(e.event_date), q(e.start_time), q(e.end_time),
    q(e.venue_name), q(e.address), q(e.city), q(e.state), q(e.ticket_info), q(e.event_rules),
    q(e.official_url), q(e.poster_image), q(gallery),
    q('UPCOMING'), q(e.verification_status), q(e.trust_level), 'NULL', q(e.admin_verification_notes), q(e.tracking_code),
    q(e.promoter_name), q('K-Sync Editorial'), q('imports@ksync.my'), q(e.evidence_link), q(e.organizer_name),
    q(e.organizer_social_url), q(e.organizer_type), q('@ksyncmalaysia'), 'NOW()', 'NOW()'
  ];
  return `INSERT INTO \`events\`\n  (${COLS.map((c) => '`' + c + '`').join(', ')})\nSELECT\n  ${vals.join(', ')}\nFROM DUAL\nWHERE NOT EXISTS (SELECT 1 FROM \`events\` WHERE \`event_name\` = ${q(e.event_name)} AND \`event_date\` = ${q(e.event_date)});`;
}

const sql = [
  'INSERT INTO `users` (`role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `location`, `status`)',
  "VALUES ('ORGANIZER', 'Live Nation Malaysia Sdn. Bhd.', 'livenation_my', 'info@livenation.my', '$2b$10$PD6b2P5bcz8oTO6SCf5PFOXAED4VL315mRTOyEeDNED5ZnFMD3DEK', 'Official promoter. Website: https://www.livenation.my | X: https://x.com/livenationmy | Facebook: https://www.facebook.com/livenationmy | Reg. no. 1336528-A, Suite 805, PJ Tower, Amcorp Trade Centre, 18 Jalan Persiaran Barat, 46060 Petaling Jaya, Selangor.', 'Live Nation Malaysia', 'Promoter', '@livenation.my', 'https://www.instagram.com/livenation.my', 'Petaling Jaya, Selangor', 'ACTIVE');",
  '',
  'INSERT INTO `users` (`role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `location`, `status`)',
  "VALUES ('ORGANIZER', 'Three Angles Production', 'threeangles', 'media@threeangles.asia', '$2b$10$PD6b2P5bcz8oTO6SCf5PFOXAED4VL315mRTOyEeDNED5ZnFMD3DEK', 'Concert promoter / show producer since 2004. Website: https://threeangles.asia | X: https://x.com/Threeanglespro | Facebook: https://www.facebook.com/ThreeAngles', 'Three Angles Production', 'Promoter', '@threeanglesproduction', 'https://www.instagram.com/threeanglesproduction', 'Kuala Lumpur', 'ACTIVE');",
  '',
  'INSERT INTO `users` (`role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `location`, `status`)',
  "VALUES ('ORGANIZER', 'K-Sync Imports (Community)', 'ksync_imports', 'imports@ksync.my', '$2b$10$PD6b2P5bcz8oTO6SCf5PFOXAED4VL315mRTOyEeDNED5ZnFMD3DEK', 'Internal account for community-sourced event imports (sources: Malaysian Kpop Fans @msiakpopfans, Cupsleeve Malaysia, Megatix). Not a promoter.', 'K-Sync Imports (Community)', 'Community', '@msiakpopfans', 'https://x.com/msiakpopfans', 'Kuala Lumpur', 'ACTIVE');",
  '',
  ...ARTISTS.flatMap((a) => [
    `INSERT INTO \`artists\` (\`name\`, \`korean_name\`, \`group_type\`, \`agency\`, \`debut_year\`, \`image_url\`, \`description\`, \`members\`)`,
    `SELECT ${q(a.name)}, ${q(a.korean_name)}, ${q(a.group_type)}, ${q(a.agency)}, ${a.debut_year}, ${q(a.image_url)}, ${q(a.description)}, ${q(JSON.stringify(a.members))}`,
    `WHERE NOT EXISTS (SELECT 1 FROM \`artists\` WHERE \`name\` = ${q(a.name)});`,
    ''
  ]),
  ...E.flatMap((e) => [eventSql(e), ''])
].join('\n').replace(/\n{3,}/g, '\n\n');

// the INSERT IGNORE users -> keep idempotent
let out = sql.replace(/INSERT INTO `users`/g, 'INSERT IGNORE INTO `users`');

// Append the normalised `members` table (DDL + 31 member rows) so that a fresh
// install is one paste. Generated by perf/gen-members-table.mjs - run that first.
const MEMBERS_SQL_FILE = 'database/members_table_mysql.sql';
let membersSql = '';
if (fs.existsSync(MEMBERS_SQL_FILE)) {
  membersSql = fs.readFileSync(MEMBERS_SQL_FILE, 'utf8').trim();
} else {
  console.warn(`WARNING: ${MEMBERS_SQL_FILE} not found - run "node perf/gen-members-table.mjs" first; the seed will not create the members table.`);
}
const full = membersSql ? `${out}\n${membersSql}\n` : `${out}\n`;
fs.writeFileSync('database/seed_events_full_mysql.sql', full, 'utf8');
console.log(`wrote database/seed_events_full_mysql.sql (${full.split('\n').length} lines, incl. ${membersSql ? 'members table + 31 member rows' : 'NO members table'})`);

// ---------------- validate against a 35-column mirror ----------------
const db = new Database(':memory:');
db.exec(`
CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, full_name TEXT, username TEXT UNIQUE, email TEXT UNIQUE,
  password_hash TEXT, bio TEXT, organization_name TEXT, organization_type TEXT, social_handle TEXT, social_url TEXT,
  location TEXT, status TEXT, created_at TEXT, updated_at TEXT);
CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, korean_name TEXT, group_type TEXT, agency TEXT, debut_year INTEGER, image_url TEXT, description TEXT, members TEXT, created_at TEXT);
CREATE TABLE event_categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, slug TEXT UNIQUE, badge_color TEXT, description TEXT, created_at TEXT);
CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT,
  organizer_id INTEGER, artist_id INTEGER, category_id INTEGER NOT NULL, event_name TEXT NOT NULL, slug TEXT, description TEXT,
  event_date TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT, venue_name TEXT NOT NULL, address TEXT, city TEXT NOT NULL,
  state TEXT NOT NULL, ticket_info TEXT, event_rules TEXT, official_url TEXT, poster_image TEXT, gallery_images TEXT,
  event_status TEXT, verification_status TEXT, trust_level TEXT, rejection_reason TEXT, admin_verification_notes TEXT,
  tracking_code TEXT UNIQUE, promoter_name TEXT, submitter_name TEXT, submitter_email TEXT, evidence_link TEXT,
  organizer_name TEXT, organizer_social_url TEXT, organizer_type TEXT, submitter_social TEXT, created_at TEXT, updated_at TEXT);
INSERT INTO event_categories (id,name,slug) VALUES (1,'Concert','concert'),(2,'Fan Meeting','fan-meeting'),(3,'Festival','festival'),(4,'Cupsleeve Event','cupsleeve'),(8,'Pop-up Event','pop-up-event');
INSERT INTO artists (id,name) VALUES (6,'TOMORROW X TOGETHER (TXT)');
INSERT INTO users (id,role,full_name,username,email,password_hash) VALUES (1,'ADMIN','A','admin','admin@ksync.my','h');
`);
const stmts = full.split(/;\s*(?:\r?\n|$)/).map((s) => s.trim()).filter(Boolean)
  .map((s) => {
    if (/^CREATE TABLE IF NOT EXISTS `members`/.test(s)) return mysqlDdlToSqlite(s);
    return s.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO').replace(/NOW\(\)/g, "datetime('now')").replace(/\s+FROM\s+DUAL\b/gi, '');
  });

for (const pass of [1, 2]) {
  for (const st of stmts) { try { db.exec(st); } catch (e) { console.log(`PASS ${pass} FAIL:\n${st.slice(0, 200)}\n-> ${e.message}`); process.exit(1); } }
  console.log(`  pass ${pass}: ${db.prepare("SELECT COUNT(*) c FROM events WHERE event_date >= '2026-10-18'").get().c} events, ${db.prepare('SELECT COUNT(*) c FROM members').get().c} members`);
}
const row = db.prepare("SELECT COUNT(*) c FROM events WHERE venue_name IS NULL OR address IS NULL OR description IS NULL OR event_rules IS NULL OR ticket_info IS NULL OR poster_image IS NULL OR tracking_code IS NULL OR promoter_name IS NULL OR submitter_name IS NULL OR submitter_social IS NULL OR created_at IS NULL").get();
console.log(`\nrows with any NULL in a should-be-filled column: ${row.c}`);
console.log('null promoter_name rows:', db.prepare('SELECT COUNT(*) c FROM events WHERE promoter_name IS NULL').get().c);
console.log('BABYMONSTER rows:', db.prepare("SELECT COUNT(*) c FROM events WHERE event_name LIKE '%BABYMONSTER%'").get().c);
const anull = db.prepare("SELECT COUNT(*) c FROM artists WHERE id > 6 AND (korean_name IS NULL OR group_type IS NULL OR agency IS NULL OR debut_year IS NULL OR image_url IS NULL OR description IS NULL OR members IS NULL)").get().c;
console.log('new artists with a NULL field:', anull);
console.table(db.prepare('SELECT id, name, korean_name, group_type, agency, debut_year, members FROM artists WHERE id > 6 ORDER BY id').all()
  .map((a) => ({ id: a.id, name: a.name, korean_name: a.korean_name, group_type: a.group_type, agency: a.agency, debut_year: a.debut_year, members: JSON.parse(a.members).length })));
console.table(db.prepare(`SELECT e.id, e.event_date, e.start_time AS t, substr(e.event_name,1,38) AS event_name, e.venue_name, e.city, e.verification_status
  FROM events e WHERE e.event_date >= '2026-10-18' ORDER BY e.id`).all());
db.close();
