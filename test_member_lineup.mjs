import db from './config/database.js';

async function testMemberLineup() {
  console.log('🧪 Testing Artist Member Lineup in Event Details...\n');

  // Query events that have artists with members
  const rawEvents = await db.query(`
    SELECT e.id, e.event_name, a.name as artist_name, a.slug as artist_slug
    FROM events e
    JOIN artists a ON e.artist_id = a.id
    WHERE a.slug = 'babymonster'
    LIMIT 1
  `);
  const events = Array.isArray(rawEvents) ? (Array.isArray(rawEvents[0]) ? rawEvents[0] : rawEvents) : [];

  if (!events || events.length === 0) {
    console.error('No BABYMONSTER event found.');
    process.exit(1);
  }

  const event = events[0];
  console.log(`Testing event ID ${event.id}: "${event.event_name}" (Artist: ${event.artist_name})`);

  const res = await fetch(`http://localhost:9000/events/${event.id}`);
  console.log(`Response status: ${res.status}`);
  if (res.status !== 200) {
    console.error('Failed to load event page!');
    process.exit(1);
  }

  const html = await res.text();

  const hasLineupHeading = html.includes(`${event.artist_name} line-up`);
  const hasFullProfilesBtn = html.includes('Full profiles');
  const hasLookingForBirth = html.includes(`Open the full ${event.artist_name} profile`);
  const hasMemberRuka = html.includes('Ruka');
  const hasMemberAhyeon = html.includes('Ahyeon');
  const hasMemberChiquita = html.includes('Chiquita');

  // Check that member cards are NOT rendered as <a> links / buttons
  const memberLinkRegex = /<a[^>]+href="\/artists\/babymonster"[^>]*class="[^"]*p-3 rounded-2xl[^"]*"[^>]*>/i;
  const isMemberCardALink = memberLinkRegex.test(html);

  // Check that member cards are rendered as clean <div> cards
  const memberDivRegex = /<div[^>]*class="[^"]*p-3 rounded-2xl bg-slate-50\/70[^"]*"[^>]*>/i;
  const isMemberCardADiv = memberDivRegex.test(html);

  console.log(`Lineup heading present: ${hasLineupHeading}`);
  console.log(`"Full profiles" button present: ${hasFullProfilesBtn}`);
  console.log(`"Open the full ${event.artist_name} profile" hyperlink present: ${hasLookingForBirth}`);
  console.log(`Member Ruka present: ${hasMemberRuka}`);
  console.log(`Member Ahyeon present: ${hasMemberAhyeon}`);
  console.log(`Member Chiquita present: ${hasMemberChiquita}`);
  console.log(`Member card is an <a> button (MUST BE FALSE): ${isMemberCardALink}`);
  console.log(`Member card is a static <div> display card (MUST BE TRUE): ${isMemberCardADiv}`);

  const passed = hasLineupHeading &&
                 hasFullProfilesBtn &&
                 hasLookingForBirth &&
                 hasMemberRuka &&
                 hasMemberAhyeon &&
                 hasMemberChiquita &&
                 !isMemberCardALink &&
                 isMemberCardADiv;

  if (passed) {
    console.log('\n✅ ALL CHECKS PASSED: Member cards are now clean static display cards without duplicate/redundant button behavior!');
    process.exit(0);
  } else {
    console.error('\n❌ Test failed!');
    process.exit(1);
  }
}

testMemberLineup().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
