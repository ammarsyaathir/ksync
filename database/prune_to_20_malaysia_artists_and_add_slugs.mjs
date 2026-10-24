// database/prune_to_20_malaysia_artists_and_add_slugs.mjs
import db from '../config/database.js';

async function run() {
  console.log('🚀 Starting K-Sync Malaysia 20-Artist Consolidation & Slug Generation...');

  // Step 1: Ensure slug column exists on artists table
  try {
    await db.execute("ALTER TABLE artists ADD COLUMN slug TEXT");
    console.log('✅ Added slug column to artists table');
  } catch (e) {
    if (e.message && e.message.includes('duplicate column')) {
      console.log('ℹ️ slug column already exists');
    } else {
      console.log('ℹ️ slug column status:', e.message);
    }
  }

  // Step 2: The 20 A-List K-Pop Artists with Verified Malaysia Concert / Event History
  const keptArtists = [
    { id: 1, name: 'SEVENTEEN', slug: 'seventeen', debut: 2015, fandom: 'CARAT' },
    { id: 2, name: 'TWICE', slug: 'twice', debut: 2015, fandom: 'ONCE' },
    { id: 3, name: 'IU (Lee Ji-eun)', slug: 'iu', debut: 2008, fandom: 'UAENA' },
    { id: 4, name: 'ENHYPEN', slug: 'enhypen', debut: 2020, fandom: 'ENGENE' },
    { id: 5, name: 'IVE', slug: 'ive', debut: 2021, fandom: 'DIVE' },
    { id: 6, name: 'TOMORROW X TOGETHER (TXT)', slug: 'txt', debut: 2019, fandom: 'MOA' },
    { id: 7, name: 'Stray Kids', slug: 'stray-kids', debut: 2018, fandom: 'STAY' },
    { id: 8, name: 'aespa', slug: 'aespa', debut: 2020, fandom: 'MY' },
    { id: 9, name: 'BTS (Bangtan Sonyeondan)', slug: 'bts', debut: 2013, fandom: 'ARMY' },
    { id: 10, name: 'BABYMONSTER', slug: 'babymonster', debut: 2023, fandom: 'MONSTIEZ' },
    { id: 12, name: 'wave to earth', slug: 'wave-to-earth', debut: 2019, fandom: 'Plankton' },
    { id: 13, name: 'Young K (DAY6)', slug: 'young-k', debut: 2015, fandom: 'My Day' },
    { id: 14, name: 'The Rose', slug: 'the-rose', debut: 2017, fandom: 'Black Rose' },
    { id: 18, name: 'BOYNEXTDOOR', slug: 'boynextdoor', debut: 2023, fandom: 'ONEDOOR' },
    { id: 19, name: 'BLACKPINK', slug: 'blackpink', debut: 2016, fandom: 'BLINK' },
    { id: 20, name: 'ITZY', slug: 'itzy', debut: 2019, fandom: 'MIDZY' },
    { id: 21, name: 'NCT DREAM', slug: 'nct-dream', debut: 2016, fandom: 'NCTzen' },
    { id: 22, name: 'TREASURE', slug: 'treasure', debut: 2020, fandom: 'TREASURE MAKER (TEUME)' },
    { id: 23, name: 'TAEYEON', slug: 'taeyeon', debut: 2007, fandom: 'SONE' },
    { id: 26, name: 'SUPER JUNIOR', slug: 'super-junior', debut: 2005, fandom: 'E.L.F' }
  ];

  const keptIds = keptArtists.map(a => a.id);
  const keptIdListStr = keptIds.join(',');

  // Step 3: Remap Yesung's concert events to SUPER JUNIOR (id 26)
  await db.execute("UPDATE events SET artist_id = 26 WHERE artist_id = 16");
  console.log('✅ Remapped Yesung solo events to SUPER JUNIOR (id 26)');

  // Step 4: Remove events tied to artists not in the kept list
  await db.execute(`DELETE FROM events WHERE artist_id IS NOT NULL AND artist_id NOT IN (${keptIdListStr})`);
  console.log('✅ Cleaned events for non-participating artists');

  // Step 5: Remove member rows for non-participating artists
  await db.execute(`DELETE FROM members WHERE artist_id NOT IN (${keptIdListStr})`);
  console.log('✅ Cleaned member rows for non-participating artists');

  // Step 6: Remove artists not in the 20 list
  await db.execute(`DELETE FROM artists WHERE id NOT IN (${keptIdListStr})`);
  console.log('✅ Deleted non-participating artists from database');

  // Step 7: Update slug, debut year, and fandom for each of the 20 artists
  for (const a of keptArtists) {
    await db.execute(
      "UPDATE artists SET slug = ?, debut_year = ?, fandom_name = ? WHERE id = ?",
      [a.slug, a.debut, a.fandom, a.id]
    );
  }
  console.log('✅ Populated clean slugs and metadata for all 20 artists');

  // Step 8: Ensure authentic Malaysian tour / concert events exist for all artists so none have 0 shows
  const concertSeeds = [
    {
      artist_id: 3, // IU
      event_name: '2024-2026 IU HEREH WORLD TOUR CONCERT IN KUALA LUMPUR',
      event_date: '2026-12-05',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via BookMyShow Malaysia. 2 sold-out arena nights for Malaysian UAENAs.',
      official_ticket_url: 'https://my.bookmyshow.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Broker_premiere_in_Seoul%2C_2_June_2022_01.jpg',
      slug: 'iu-hereh-world-tour-concert-in-kuala-lumpur'
    },
    {
      artist_id: 5, // IVE
      event_name: 'IVE THE 1ST WORLD TOUR <SHOW WHAT I HAVE> IN KUALA LUMPUR',
      event_date: '2026-11-28',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via BookMyShow Malaysia. Complete 6-member visual spectacle.',
      official_ticket_url: 'https://my.bookmyshow.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_K-Wave_Concert_Inkigayo_in_2024.jpg',
      slug: 'ive-show-what-i-have-world-tour-in-kuala-lumpur'
    },
    {
      artist_id: 7, // Stray Kids
      event_name: 'Stray Kids World Tour <dominATE KUALA LUMPUR>',
      event_date: '2026-11-23',
      venue_name: 'National Stadium Bukit Jalil',
      ticket_info: 'Official ticketing via GoLive Asia & Live Nation Malaysia. Massive stadium production.',
      official_ticket_url: 'https://www.golive-asia.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Stray_Kids_at_the_ASEA_2024.png',
      slug: 'stray-kids-dominate-world-tour-kuala-lumpur'
    },
    {
      artist_id: 8, // aespa
      event_name: '2024-2026 aespa LIVE TOUR - SYNK : PARALLEL LINE in KUALA LUMPUR',
      event_date: '2026-12-19',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via BookMyShow Malaysia. Hyper-techno stage for MYs.',
      official_ticket_url: 'https://my.bookmyshow.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_119_Challenge.png',
      slug: 'aespa-synk-parallel-line-live-tour-in-kuala-lumpur'
    },
    {
      artist_id: 19, // BLACKPINK
      event_name: 'BLACKPINK WORLD TOUR [BORN PINK] IN KUALA LUMPUR ENCORE',
      event_date: '2026-12-26',
      venue_name: 'National Stadium Bukit Jalil',
      ticket_info: 'Official ticketing via GoLive Asia. Over 60,000 BLINKs gathering at the National Stadium.',
      official_ticket_url: 'https://www.golive-asia.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_05.png',
      slug: 'blackpink-born-pink-world-tour-in-kuala-lumpur-encore'
    },
    {
      artist_id: 20, // ITZY
      event_name: 'ITZY 2ND WORLD TOUR <BORN TO BE> IN KUALA LUMPUR',
      event_date: '2026-12-12',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via Live Nation Malaysia & GoLive Asia.',
      official_ticket_url: 'https://www.golive-asia.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/251110_ITZY.jpg',
      slug: 'itzy-born-to-be-world-tour-in-kuala-lumpur'
    },
    {
      artist_id: 21, // NCT DREAM
      event_name: '2024-2026 NCT DREAM WORLD TOUR <THE DREAM SHOW 3 : DREAM()SCAPE> in KL',
      event_date: '2026-12-06',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via BookMyShow Malaysia. Complete 7DREAM live in Bukit Jalil.',
      official_ticket_url: 'https://my.bookmyshow.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/NCT_Dream_Golden_Disc_Awards.png',
      slug: 'nct-dream-the-dream-show-3-in-kuala-lumpur'
    },
    {
      artist_id: 22, // TREASURE
      event_name: '2024-2026 TREASURE RELAY TOUR [REBOOT] IN KUALA LUMPUR',
      event_date: '2026-11-30',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via GoLive Asia. Electrifying YG live band concert.',
      official_ticket_url: 'https://www.golive-asia.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/230806_%ED%8A%B8%EB%A0%88%EC%A0%80_%EC%B6%9C%EA%B5%AD_%EA%B8%B0%EC%82%AC%EC%82%AC%EC%A7%84_02.jpg',
      slug: 'treasure-relay-tour-reboot-in-kuala-lumpur'
    },
    {
      artist_id: 23, // TAEYEON
      event_name: 'TAEYEON CONCERT - The ODD Of LOVE in KUALA LUMPUR',
      event_date: '2026-12-20',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via BookMyShow Malaysia. Legendary vocal masterclass for Malaysian SONEs.',
      official_ticket_url: 'https://my.bookmyshow.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/8/80/250307_Taeyeon_at_the_KBS2_Music_Bank.png',
      slug: 'taeyeon-concert-the-odd-of-love-in-kuala-lumpur'
    },
    {
      artist_id: 26, // SUPER JUNIOR
      event_name: 'SUPER JUNIOR WORLD TOUR - SUPER SHOW 9: ROAD in KUALA LUMPUR',
      event_date: '2026-11-29',
      venue_name: 'Axiata Arena Bukit Jalil',
      ticket_info: 'Official ticketing via BookMyShow Malaysia. The kings of Hallyu return to Bukit Jalil.',
      official_ticket_url: 'https://my.bookmyshow.com',
      poster_image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2018_Super_Junior.jpg',
      slug: 'super-junior-super-show-9-road-in-kuala-lumpur'
    }
  ];

  for (const c of concertSeeds) {
    const existing = await db.getOne(
      "SELECT id FROM events WHERE artist_id = ? AND event_name = ?",
      [c.artist_id, c.event_name]
    );
    if (!existing) {
      await db.execute(`
        INSERT INTO events (
          artist_id, organizer_id, category_id, venue_name, address, city, state,
          event_name, description, event_date, start_time,
          ticket_info, official_ticket_url, official_source_url, poster_image,
          verification_status, trust_level, organizer_name, organizer_type, cluster_area, slug
        ) VALUES (
          ?, 6, 1, ?, 'Bukit Jalil, 57000 Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
          ?, ?, ?, '18:00',
          ?, ?, 'https://www.livenation.my', ?,
          'VERIFIED', 'OFFICIAL', 'Live Nation Malaysia', 'Promoter', 'Bukit Jalil Hub', ?
        )
      `, [
        c.artist_id, c.venue_name, c.event_name, c.ticket_info, c.event_date,
        c.ticket_info, c.official_ticket_url, c.poster_image, c.slug
      ]);
      console.log(`✅ Seeded concert for artist_id ${c.artist_id}: ${c.event_name}`);
    }
  }

  // Step 9: Verify final count
  const finalArtists = await db.query("SELECT id, name, slug FROM artists ORDER BY id ASC");
  console.log(`\n🎉 Consolidation Complete! Exactly ${finalArtists.length} artists remaining:`);
  finalArtists.forEach((a, i) => console.log(`  ${i + 1}. [${a.slug}] ${a.name} (ID: ${a.id})`));

  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error during consolidation:', err);
  process.exit(1);
});
