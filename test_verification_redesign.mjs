// test_verification_redesign.mjs
import assert from 'assert';

const BASE_URL = 'http://localhost:9000';

async function run() {
  console.log('--- Testing Verification Redesign & Flexible URL Routing ---');

  // Step 1: Login as Organizer (Owner of Event 76: user 2, starline)
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
  assert(rawCookie, 'Login should succeed and return session cookie');
  const cookie = rawCookie.split(';')[0];
  console.log('✓ Successfully logged in as organizer@ksync.my');

  // Step 2: Fetch verification report via Numeric ID (76)
  const resNumeric = await fetch(`${BASE_URL}/organizer/events/76/verification`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(resNumeric.status, 200, 'GET /organizer/events/76/verification should return 200');
  const htmlNumeric = await resNumeric.text();
  assert(htmlNumeric.includes('Submission tracker'), 'Should contain "Submission tracker" heading');
  assert(htmlNumeric.includes('Find a submission'), 'Should contain "Find a submission" card');
  assert(htmlNumeric.includes('Verification snapshot'), 'Should contain "Verification snapshot"');
  assert(htmlNumeric.includes('Evidence examined'), 'Should contain "Evidence examined"');
  assert(htmlNumeric.includes('AI CONSENSUS'), 'Should contain "AI CONSENSUS"');
  assert(htmlNumeric.includes('Progress'), 'Should contain "Progress" timeline');
  assert(htmlNumeric.includes('Submission details'), 'Should contain "Submission details"');
  assert(htmlNumeric.includes('Sources'), 'Should contain "Sources"');
  console.log('✓ Verification report accessible via Numeric ID (76)');

  // Step 3: Fetch verification report via Tracking Code (KS-2026-F6E5B0)
  const resTracking = await fetch(`${BASE_URL}/organizer/events/KS-2026-F6E5B0/verification`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(resTracking.status, 200, 'GET /organizer/events/KS-2026-F6E5B0/verification should return 200');
  const htmlTracking = await resTracking.text();
  assert(htmlTracking.includes('CARAT Blossom'), 'Should display event title for tracking code');
  assert(htmlTracking.includes('KS-2026-F6E5B0'), 'Should contain tracking code pill');
  console.log('✓ Verification report accessible via Tracking Code (KS-2026-F6E5B0)');

  // Step 4: Fetch verification report via Slug
  const slug = 'carat-blossom-seventeen-10th-anniversary-cupsleeve-photocard-gathering';
  const resSlug = await fetch(`${BASE_URL}/organizer/events/${slug}/verification`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(resSlug.status, 200, `GET /organizer/events/${slug}/verification should return 200`);
  const htmlSlug = await resSlug.text();
  assert(htmlSlug.includes('CARAT Blossom'), 'Should display event title for slug');
  console.log('✓ Verification report accessible via Event Slug');

  // Step 5: Test submission lookup route
  const resLookup = await fetch(`${BASE_URL}/organizer/events/lookup?code=KS-2026-F6E5B0`, {
    headers: { Cookie: cookie },
    redirect: 'manual'
  });
  assert.strictEqual(resLookup.status, 302, 'Lookup should redirect (302)');
  const redirectLocation = resLookup.headers.get('location');
  assert.strictEqual(redirectLocation, '/organizer/events/KS-2026-F6E5B0/verification', 'Should redirect to code verification URL');
  console.log('✓ Submission lookup redirect works perfectly');

  // Step 6: Verify dashboard links use tracking code or slug
  const resDash = await fetch(`${BASE_URL}/organizer/dashboard`, {
    headers: { Cookie: cookie }
  });
  const htmlDash = await resDash.text();
  assert(htmlDash.includes('/organizer/events/KS-2026-'), 'Dashboard should link to verification using tracking code or slug');
  console.log('✓ Organizer dashboard links verified with tracking code / slug');

  console.log('\n🎉 ALL VERIFICATION REDESIGN TESTS PASSED WITH 100% SUCCESS!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
