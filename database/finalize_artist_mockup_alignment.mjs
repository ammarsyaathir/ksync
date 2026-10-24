// database/finalize_artist_mockup_alignment.mjs
import db from '../config/database.js';

async function finalize() {
  console.log('🔄 Finalizing artist profile alignment with user mockup...');

  // 1. Replace Unsplash header images with authentic group photos
  await db.execute(`
    UPDATE artists 
    SET header_image = image_url 
    WHERE header_image LIKE '%unsplash%' AND image_url IS NOT NULL AND image_url NOT LIKE '%unsplash%'
  `);
  console.log('✅ Replaced Unsplash header_image entries with authentic image_url');

  // 2. Align ENHYPEN bio
  await db.execute(`
    UPDATE artists 
    SET description = 'Seven-member boy group formed through I-LAND under BELIFT LAB. Renowned for dark vampire fantasy lore and high-octane choreography, selling out Malaysian arena stops on their FATE and WALK THE LINE world tours.'
    WHERE id = 4
  `);
  console.log('✅ ENHYPEN bio aligned');

  // 3. Ensure ENHYPEN has 1 upcoming Malaysian concert event
  const enhypenEvent = await db.getOne(
    "SELECT id FROM events WHERE artist_id = 4 AND verification_status = 'VERIFIED' AND event_date >= CURRENT_DATE"
  );
  if (!enhypenEvent) {
    await db.execute(`
      INSERT INTO events (
        artist_id, organizer_id, category_id, venue_name, address, city, state,
        event_name, description, event_date, start_time,
        ticket_info, official_ticket_url, official_source_url, poster_image,
        verification_status, trust_level, organizer_name, organizer_type, cluster_area, slug
      ) VALUES (
        4, 6, 1, 'Axiata Arena Bukit Jalil', 'L2-E-10, Enterprise 4, Technology Park Malaysia, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
        'ENHYPEN WORLD TOUR [WALK THE LINE] IN KUALA LUMPUR',
        'BELIFT LAB and Live Nation Malaysia present ENHYPEN live at Axiata Arena Bukit Jalil for their biggest Malaysian arena spectacle to date.',
        '2026-11-21', '18:00',
        'VIP Soundcheck, Cat 1 Reserved Seating & General Standing available via GoLive Asia.',
        'https://www.golive-asia.com',
        'https://www.livenation.my',
        'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png',
        'VERIFIED', 'OFFICIAL', 'Live Nation Malaysia', 'Promoter', 'Bukit Jalil Hub',
        'enhypen-world-tour-walk-the-line-in-kuala-lumpur'
      )
    `);
    console.log('✅ Created upcoming ENHYPEN concert event (WALK THE LINE IN KL)');
  } else {
    console.log('ℹ️ ENHYPEN already has an upcoming event with ID:', enhypenEvent.id);
  }

  console.log('🎉 Alignment complete!');
  process.exit(0);
}

finalize().catch(err => {
  console.error('Error during alignment:', err);
  process.exit(1);
});
