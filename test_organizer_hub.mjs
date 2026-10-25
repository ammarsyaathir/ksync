// test_organizer_hub.mjs
import assert from 'assert';

const BASE_URL = 'http://localhost:9000';

async function run() {
  console.log('--- Testing Organizer Hub, Workspace, My Events & Broadcast Updates ---');

  // Step 1: Login as Organizer (user 2, starline / organizer@ksync.my)
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: 'organizer@ksync.my',
      password: 'password123'
    }),
    redirect: 'manual'
  });

  const rawCookie = loginRes.headers.get('set-cookie');
  assert(rawCookie, 'Login should succeed');
  const cookie = rawCookie.split(';')[0];
  console.log('✓ Successfully logged in as organizer');

  // Step 2: Test Workspace Dashboard (GET /organizer/dashboard)
  const dashRes = await fetch(`${BASE_URL}/organizer/dashboard`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(dashRes.status, 200, 'Dashboard should return HTTP 200');
  const dashHtml = await dashRes.text();
  assert(dashHtml.includes('Organiser workspace'), 'Should contain "Organiser workspace"');
  assert(dashHtml.includes('Next on your calendar'), 'Should contain "Next on your calendar"');
  assert(dashHtml.includes('LIVE LISTINGS'), 'Should contain "LIVE LISTINGS" metric');
  assert(dashHtml.includes('NEEDS ACTION'), 'Should contain "NEEDS ACTION" metric');
  assert(dashHtml.includes('FAN INTEREST'), 'Should contain "FAN INTEREST" metric');
  assert(dashHtml.includes('Research tools'), 'Should contain "Research tools"');
  assert(dashHtml.includes('Artist directory'), 'Should contain "Artist directory" tool');
  assert(dashHtml.includes('Event Radar'), 'Should contain "Event Radar" tool');
  console.log('✓ Organizer Workspace Dashboard rendered cleanly with all comp modules');

  // Step 3: Test My Events (GET /organizer/events)
  const eventsRes = await fetch(`${BASE_URL}/organizer/events`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(eventsRes.status, 200, 'My Events should return HTTP 200');
  const eventsHtml = await eventsRes.text();
  assert(eventsHtml.includes('My events'), 'Should contain "My events" heading');
  assert(eventsHtml.includes('TOTAL'), 'Should contain "TOTAL" metric');
  assert(eventsHtml.includes('AVG. SCORE'), 'Should contain "AVG. SCORE" metric');
  assert(eventsHtml.includes('Verification report'), 'Should contain "Verification report" button');
  assert(eventsHtml.includes('View public page'), 'Should contain "View public page" button');
  assert(eventsHtml.includes('Post update'), 'Should contain "Post update" button');
  assert(eventsHtml.includes('upvotes'), 'Should display upvotes metric');
  console.log('✓ My Events page rendered cleanly with 5-metric bar & listings');

  // Step 4: Test Post Event Update (POST /organizer/events/76/update)
  const updateRes = await fetch(`${BASE_URL}/organizer/events/76/update`, {
    method: 'POST',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      update_title: 'Hall Doors Open at 4:30 PM',
      update_description: 'Soundcheck and photocard tier redemption booths open at Hall B entrance.'
    }),
    redirect: 'manual'
  });
  assert.strictEqual(updateRes.status, 302, 'Post update should redirect on success (302)');
  console.log('✓ Organizer successfully posted official logistical update');

  // Step 5: Test Profile & Logo Update (POST /organizer/profile)
  const profileRes = await fetch(`${BASE_URL}/organizer/profile`, {
    method: 'POST',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      organization_name: 'Starline Live Entertainment',
      organization_type: 'Official Promoter',
      bio: 'Leading K-Pop arena and concert promoter in Malaysia.',
      social_url: 'https://instagram.com/starline_my'
    }),
    redirect: 'manual'
  });
  assert.strictEqual(profileRes.status, 302, 'Profile update should redirect (302)');
  console.log('✓ Organizer workspace profile & brand information updated successfully');

  console.log('\n🎉 ALL ORGANIZER WORKSPACE, MY EVENTS & UPDATE TESTS PASSED 100%!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
