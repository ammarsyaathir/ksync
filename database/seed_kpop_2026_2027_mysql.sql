-- ============================================================================
-- K-Sync Malaysia — K-Pop events in Malaysia, 18 Oct 2026 → 2027
-- Target: MySQL 8.0 / MariaDB 10.4+ (phpMyAdmin), schema: hostinger_mysql_schema.sql
--
-- Safe to run more than once (idempotent):
--   * organisers  -> INSERT IGNORE (unique username / email)
--   * artists     -> INSERT ... SELECT ... WHERE NOT EXISTS (by name)
--   * events      -> INSERT ... SELECT ... WHERE NOT EXISTS (by name + date)
-- Foreign keys are resolved by lookup (username / artist name / category slug),
-- so this works no matter what IDs already exist in your database.
--
-- 6 rows  = VERIFIED (official promoter sources: Live Nation Malaysia, etix.my)
-- 8 rows  = PENDING  (community aggregator sources: @msiakpopfans, Cupsleeve MY, Megatix)
-- Unknown show times use 12:00:00 as an explicit placeholder -> "(time TBC)" in the text.
--
-- NOTE: this MySQL schema has NO `venues` table (the venue is stored inside
-- `events`), so there are no venue rows to insert.
-- ============================================================================

SET NAMES utf8mb4;

-- ----------------------------------------------------------------------------
-- 1) ORGANISERS  (real accounts: real email / website / socials)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO `users`
  (`role`, `full_name`, `username`, `email`, `password_hash`, `bio`,
   `organization_name`, `organization_type`, `social_handle`, `social_url`, `location`, `status`)
VALUES
  ('ORGANIZER', 'Live Nation Malaysia Sdn. Bhd.', 'livenation_my', 'info@livenation.my',
   '$2b$10$PD6b2P5bcz8oTO6SCf5PFOXAED4VL315mRTOyEeDNED5ZnFMD3DEK',
   'Official promoter. Website: https://www.livenation.my | X: https://x.com/livenationmy | Facebook: https://www.facebook.com/livenationmy | Reg. no. 1336528-A, Suite 805, PJ Tower, Amcorp Trade Centre, 18 Jalan Persiaran Barat, 46060 Petaling Jaya, Selangor.',
   'Live Nation Malaysia', 'Promoter', '@livenation.my', 'https://www.instagram.com/livenation.my',
   'Petaling Jaya, Selangor', 'ACTIVE'),
  ('ORGANIZER', 'Three Angles Production', 'threeangles', 'media@threeangles.asia',
   '$2b$10$PD6b2P5bcz8oTO6SCf5PFOXAED4VL315mRTOyEeDNED5ZnFMD3DEK',
   'Concert promoter / show producer since 2004. Website: https://threeangles.asia | X: https://x.com/Threeanglespro | Facebook: https://www.facebook.com/ThreeAngles',
   'Three Angles Production', 'Promoter', '@threeanglesproduction', 'https://www.instagram.com/threeanglesproduction',
   'Kuala Lumpur', 'ACTIVE'),
  ('ORGANIZER', 'K-Sync Imports (Community)', 'ksync_imports', 'imports@ksync.local',
   '$2b$10$PD6b2P5bcz8oTO6SCf5PFOXAED4VL315mRTOyEeDNED5ZnFMD3DEK',
   'Internal account for community-sourced event imports (sources: Malaysian Kpop Fans @msiakpopfans, Cupsleeve Malaysia, Megatix). Not a promoter.',
   'K-Sync Imports (Community)', 'Community', '@msiakpopfans', 'https://x.com/msiakpopfans',
   'Kuala Lumpur', 'ACTIVE');

-- ----------------------------------------------------------------------------
-- 2) ARTISTS
-- ----------------------------------------------------------------------------
INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'BTS (Bangtan Sonyeondan)', 'Boy Group', 'BIGHIT MUSIC', 'Global 7-member boy group. World Tour ARIRANG.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'BABYMONSTER', 'Girl Group', 'YG Entertainment', 'YG Entertainment girl group. World Tour [CHOOM].'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'BABYMONSTER');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'izna', 'Girl Group', 'WAKEONE', 'Project girl group. First concert tour "WHO DAT GIRL?".'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'izna');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'wave to earth', 'Band', 'Wavy', 'Korean indie band.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'wave to earth');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'Young K (DAY6)', 'Soloist', 'JYP Entertainment', 'DAY6 bassist and vocalist, solo artist.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'Young K (DAY6)');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'The Rose', 'Band', 'Windfall', 'Korean indie rock band.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'The Rose');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'Yves', 'Soloist', 'PaiD', 'Solo artist, former LOONA member.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'Yves');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'Yesung (SUPER JUNIOR)', 'Soloist', 'SM Entertainment', 'SUPER JUNIOR main vocalist, solo artist.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'Yesung (SUPER JUNIOR)');

INSERT INTO `artists` (`name`, `group_type`, `agency`, `description`)
SELECT 'Lee Junho (2PM)', 'Soloist', 'JYP Entertainment', '2PM member, solo singer and actor.'
WHERE NOT EXISTS (SELECT 1 FROM `artists` WHERE `name` = 'Lee Junho (2PM)');

-- ----------------------------------------------------------------------------
-- 3) EVENTS — VERIFIED (official promoter sources)
-- ----------------------------------------------------------------------------

-- BABYMONSTER
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'livenation_my'),
  (SELECT `id` FROM `artists` WHERE `name` = 'BABYMONSTER'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  '2026-27 BABYMONSTER WORLD TOUR [춤 (CHOOM)] IN KUALA LUMPUR',
  '2026-27-babymonster-world-tour-choom-in-kuala-lumpur',
  'BABYMONSTER bring their first world tour [춤 (CHOOM)] to Kuala Lumpur.',
  '2026-11-14', '17:00:00', NULL,
  'Unifi Arena Bukit Jalil', 'Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'SOLD OUT. Official ticketing: GoLive Asia only.',
  'https://www.livenation.my/event/2026-27-babymonster-world-tour-%EC%B6%A4-choom-in-kuala-lumpur-kuala-lumpur-tickets-edp1682916',
  'https://networksites.livenationinternational.com/networksites/5cabpce0/babymonster-group_press.jpg',
  'UPCOMING', 'VERIFIED', 'VERIFIED',
  'https://www.livenation.my/event/2026-27-babymonster-world-tour-%EC%B6%A4-choom-in-kuala-lumpur-kuala-lumpur-tickets-edp1682916',
  'Live Nation Malaysia', 'https://www.instagram.com/livenation.my', 'Promoter',
  'Imported from official source: https://www.livenation.my/event/2026-27-babymonster-world-tour-%EC%B6%A4-choom-in-kuala-lumpur-kuala-lumpur-tickets-edp1682916'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = '2026-27 BABYMONSTER WORLD TOUR [춤 (CHOOM)] IN KUALA LUMPUR' AND `event_date` = '2026-11-14');

-- wave to earth
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'livenation_my'),
  (SELECT `id` FROM `artists` WHERE `name` = 'wave to earth'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'wave to earth - the pieces tour',
  'wave-to-earth-the-pieces-tour',
  'Korean indie band wave to earth on "the pieces tour", with support act Milena.',
  '2026-11-22', '20:00:00', NULL,
  'Idea Live Arena', 'Level 2, 3 Damansara, 3, Jalan SS20/27, Damansara Intan, 47400 Petaling Jaya, Selangor', 'Petaling Jaya', 'Selangor',
  'Official ticketing: GoLive Asia & Fantopia. Price not published on official page (TBC).',
  'https://www.livenation.my/event/wave-to-earth-the-pieces-tour-kuala-lumpur-tickets-edp1674881',
  'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg',
  'UPCOMING', 'VERIFIED', 'VERIFIED',
  'https://www.livenation.my/event/wave-to-earth-the-pieces-tour-kuala-lumpur-tickets-edp1674881',
  'Live Nation Malaysia', 'https://www.instagram.com/livenation.my', 'Promoter',
  'Imported from official source: https://www.livenation.my/event/wave-to-earth-the-pieces-tour-kuala-lumpur-tickets-edp1674881'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'wave to earth - the pieces tour' AND `event_date` = '2026-11-22');

-- izna
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'threeangles'),
  (SELECT `id` FROM `artists` WHERE `name` = 'izna'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  '2026-2027 izna Concert Tour: WHO DAT GIRL? in Kuala Lumpur',
  '2026-2027-izna-concert-tour-who-dat-girl-in-kuala-lumpur',
  'izna first concert tour "WHO DAT GIRL?" in Kuala Lumpur. Presented by Three Angles Production.',
  '2026-12-05', '19:00:00', NULL,
  'Zepp Kuala Lumpur', 'BBCC, 2, Jalan Hang Tuah, 55100 Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'RM698 / RM598 / RM498. Official ticketing: etix.my. General sale opened 8 Oct 2026, 12PM.',
  'https://www.etix.my/Event/SNTIZ26', NULL,
  'UPCOMING', 'VERIFIED', 'VERIFIED',
  'https://www.etix.my/Event/SNTIZ26',
  'Three Angles Production', 'https://www.instagram.com/threeanglesproduction', 'Promoter',
  'Imported from official source: https://www.etix.my/Event/SNTIZ26'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = '2026-2027 izna Concert Tour: WHO DAT GIRL? in Kuala Lumpur' AND `event_date` = '2026-12-05');

-- BTS Day 1
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'livenation_my'),
  (SELECT `id` FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'BTS WORLD TOUR ''ARIRANG'' IN KUALA LUMPUR (Day 1)',
  'bts-world-tour-arirang-in-kuala-lumpur-day-1',
  'BTS WORLD TOUR ''ARIRANG''. Day 1 of 2. All-seated, open-air stadium show on a 360-degree stage.',
  '2026-12-12', '19:30:00', NULL,
  'TM Stadium Nasional (National Stadium Bukit Jalil)', 'Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'SOLD OUT. Official ticketing: GoLive Asia only.',
  'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
  'https://dynamicmedia.livenationinternational.com/p/i/r/0545f243-606d-4d8a-acb7-bb7210f21353.jpg',
  'UPCOMING', 'VERIFIED', 'VERIFIED',
  'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
  'Live Nation Malaysia', 'https://www.instagram.com/livenation.my', 'Promoter',
  'Imported from official source: https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'BTS WORLD TOUR ''ARIRANG'' IN KUALA LUMPUR (Day 1)' AND `event_date` = '2026-12-12');

-- BTS Day 2
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'livenation_my'),
  (SELECT `id` FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'BTS WORLD TOUR ''ARIRANG'' IN KUALA LUMPUR (Day 2)',
  'bts-world-tour-arirang-in-kuala-lumpur-day-2',
  'BTS WORLD TOUR ''ARIRANG''. Day 2 of 2. All-seated, open-air stadium show on a 360-degree stage.',
  '2026-12-13', '19:30:00', NULL,
  'TM Stadium Nasional (National Stadium Bukit Jalil)', 'Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'SOLD OUT. Official ticketing: GoLive Asia only.',
  'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
  'https://dynamicmedia.livenationinternational.com/p/i/r/0545f243-606d-4d8a-acb7-bb7210f21353.jpg',
  'UPCOMING', 'VERIFIED', 'VERIFIED',
  'https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786',
  'Live Nation Malaysia', 'https://www.instagram.com/livenation.my', 'Promoter',
  'Imported from official source: https://www.livenation.my/event/bts-world-tour-arirang-in-kuala-lumpur-kuala-lumpur-tickets-edp1675786'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'BTS WORLD TOUR ''ARIRANG'' IN KUALA LUMPUR (Day 2)' AND `event_date` = '2026-12-13');

-- Young K
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'livenation_my'),
  (SELECT `id` FROM `artists` WHERE `name` = 'Young K (DAY6)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'Young K Solo Tour <YOUNGEST> in KUALA LUMPUR',
  'young-k-solo-tour-youngest-in-kuala-lumpur',
  'Young K of DAY6, solo tour <YOUNGEST>, in Kuala Lumpur.',
  '2027-03-20', '17:00:00', NULL,
  'Idea Live Arena', 'Level 2, 3 Damansara, 3, Jalan SS20/27, Damansara Intan, 47400 Petaling Jaya, Selangor', 'Petaling Jaya', 'Selangor',
  'Official ticketing: GoLive Asia & fantopia.io. Price not published on official page (TBC).',
  'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537',
  'https://networksites.livenationinternational.com/networksites/dfbjl3iz/young-k.webp',
  'UPCOMING', 'VERIFIED', 'VERIFIED',
  'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537',
  'Live Nation Malaysia', 'https://www.instagram.com/livenation.my', 'Promoter',
  'Imported from official source: https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'Young K Solo Tour <YOUNGEST> in KUALA LUMPUR' AND `event_date` = '2027-03-20');

-- ----------------------------------------------------------------------------
-- 4) EVENTS — PENDING (community sources; verify before publishing)
-- ----------------------------------------------------------------------------

-- Cupsleeve Event in KL (24–25 Oct, time known)
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  NULL,
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'cupsleeve'),
  'Cupsleeve Event in Kuala Lumpur (Cupsleeve Malaysia)',
  'cupsleeve-event-in-kuala-lumpur-cupsleeve-malaysia',
  'Cupsleeve event in Kuala Lumpur, running 24-25 October 2026, 10AM-9PM. Walk-in. Exact venue TBC.',
  '2026-10-24', '10:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'Early bird RM8 (register online). Venue TBC.',
  'https://x.com/cupsleeveMY', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://x.com/cupsleeveMY',
  'Cupsleeve Malaysia (@cupsleeveMY)', NULL, 'Community',
  'Community import - verify before publishing. Source: https://x.com/cupsleeveMY'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'Cupsleeve Event in Kuala Lumpur (Cupsleeve Malaysia)' AND `event_date` = '2026-10-24');

-- CUCKOOTOPIA 2026 concert
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'Lee Junho (2PM)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'CUCKOOTOPIA 2026 - 12th Anniversary Appreciation Concert (2PM''s Lee Junho)',
  'cuckootopia-2026-12th-anniversary-appreciation-concert-2pms-lee-junho',
  'CUCKOO''s 12th anniversary appreciation concert featuring 2PM''s Lee Junho at Stadium Merdeka. Wristband redemption 21-24 Oct 2026, 10AM-6PM. (Show time TBC.)',
  '2026-10-24', '12:00:00', NULL,
  'Stadium Merdeka', 'Jalan Stadium, 50150 Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'Wristband redemption 21-24 Oct 2026, 10AM-6PM. Show time TBC.',
  'https://x.com/msiakpopfans', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://x.com/msiakpopfans',
  'CUCKOO Malaysia', NULL, 'Promoter',
  'Community import - verify before publishing. Time TBC. Source: https://x.com/msiakpopfans'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'CUCKOOTOPIA 2026 - 12th Anniversary Appreciation Concert (2PM''s Lee Junho)' AND `event_date` = '2026-10-24');

-- CUCKOOTOPIA POP-UP
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'Lee Junho (2PM)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'pop-up-event'),
  'CUCKOOTOPIA 2026 POP-UP (2PM''s Lee Junho)',
  'cuckootopia-2026-pop-up-2pms-lee-junho',
  'CUCKOOTOPIA 2026 pop-up event featuring 2PM''s Lee Junho. (Time and venue TBC. Official schedule not published.)',
  '2026-10-25', '12:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'TBC',
  'https://x.com/msiakpopfans', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://x.com/msiakpopfans',
  'CUCKOO Malaysia', NULL, 'Promoter',
  'Community import - verify before publishing. Time and venue TBC. Source: https://x.com/msiakpopfans'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'CUCKOOTOPIA 2026 POP-UP (2PM''s Lee Junho)' AND `event_date` = '2026-10-25');

-- ROSETOPIA in KL (The Rose)
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'The Rose'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'ROSETOPIA in Kuala Lumpur (The Rose)',
  'rosetopia-in-kuala-lumpur-the-rose',
  'The Rose live in Kuala Lumpur. (Venue and time TBC.)',
  '2026-10-25', '12:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'TBC',
  'https://x.com/msiakpopfans', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://x.com/msiakpopfans',
  'TBC', NULL, 'Community',
  'Community import - verify before publishing. Venue and time TBC. Source: https://x.com/msiakpopfans'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'ROSETOPIA in Kuala Lumpur (The Rose)' AND `event_date` = '2026-10-25');

-- Yves in KL
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'Yves'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'Yves in Kuala Lumpur',
  'yves-in-kuala-lumpur',
  'Yves (former LOONA) live in Kuala Lumpur. (Venue and time TBC.)',
  '2026-11-07', '12:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'TBC',
  'https://x.com/msiakpopfans', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://x.com/msiakpopfans',
  'TBC', NULL, 'Community',
  'Community import - verify before publishing. Venue and time TBC. Source: https://x.com/msiakpopfans'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'Yves in Kuala Lumpur' AND `event_date` = '2026-11-07');

-- Yesung concert
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'Yesung (SUPER JUNIOR)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'YESUNG - "About the Things We Called Ordinary" in Kuala Lumpur',
  'yesung-about-the-things-we-called-ordinary-in-kuala-lumpur',
  'Super Junior''s Yesung live in Kuala Lumpur. (Venue and time TBC.)',
  '2026-11-07', '12:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'TBC',
  'https://x.com/msiakpopfans', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://x.com/msiakpopfans',
  'TBC', NULL, 'Community',
  'Community import - verify before publishing. Venue and time TBC. Source: https://x.com/msiakpopfans'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'YESUNG - "About the Things We Called Ordinary" in Kuala Lumpur' AND `event_date` = '2026-11-07');

-- Yesung fansign / fan meeting
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'Yesung (SUPER JUNIOR)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'fan-meeting'),
  'YESUNG [Where We Are] - Fansign & 1v1 Photo Event in Malaysia',
  'yesung-where-we-are-fansign-1v1-photo-event-in-malaysia',
  'Fansign and 1:1 photo event with Super Junior''s Yesung in Kuala Lumpur. (Time and venue TBC.)',
  '2026-11-08', '12:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'Applications via megatix.asia. Deadline 20 October 2026.',
  'https://megatix.asia', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://megatix.asia',
  'Megatix Asia', NULL, 'Promoter',
  'Community import - verify before publishing. Time and venue TBC. Source: https://megatix.asia'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'YESUNG [Where We Are] - Fansign & 1v1 Photo Event in Malaysia' AND `event_date` = '2026-11-08');

-- TXT World Tour 2027
INSERT INTO `events`
  (`organizer_id`, `artist_id`, `category_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`,
   `venue_name`, `address`, `city`, `state`, `ticket_info`, `official_url`, `poster_image`,
   `event_status`, `verification_status`, `trust_level`, `evidence_link`,
   `organizer_name`, `organizer_social_url`, `organizer_type`, `admin_verification_notes`)
SELECT
  (SELECT `id` FROM `users` WHERE `username` = 'ksync_imports'),
  (SELECT `id` FROM `artists` WHERE `name` = 'TOMORROW X TOGETHER (TXT)'),
  (SELECT `id` FROM `event_categories` WHERE `slug` = 'concert'),
  'TXT World Tour 2027 STEAL THE WIND - Kuala Lumpur',
  'txt-world-tour-2027-steal-the-wind-kuala-lumpur',
  'TOMORROW X TOGETHER (TXT) World Tour 2027 "STEAL THE WIND" in Kuala Lumpur. (Venue and time TBC - officially announced only as "Kuala Lumpur".)',
  '2027-03-13', '12:00:00', NULL,
  'Venue TBC (Kuala Lumpur)', 'To be confirmed', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
  'TBC',
  'https://kpopofficial.com/schedule/malaysia', NULL,
  'UPCOMING', 'PENDING', 'PENDING',
  'https://kpopofficial.com/schedule/malaysia',
  'TBC', NULL, 'Community',
  'Community import - verify before publishing. Venue and time TBC. Source: https://kpopofficial.com/schedule/malaysia'
WHERE NOT EXISTS (SELECT 1 FROM `events` WHERE `event_name` = 'TXT World Tour 2027 STEAL THE WIND - Kuala Lumpur' AND `event_date` = '2027-03-13');

-- ----------------------------------------------------------------------------
-- 5) VERIFY
-- ----------------------------------------------------------------------------
SELECT e.id, e.event_date, e.start_time, e.event_name, c.name AS category,
       e.organizer_name, e.verification_status
FROM `events` e
JOIN `event_categories` c ON c.id = e.category_id
WHERE e.event_date >= '2026-10-18'
ORDER BY e.event_date, e.start_time;
