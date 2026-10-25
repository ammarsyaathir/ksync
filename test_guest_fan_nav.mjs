// test_guest_fan_nav.mjs - Automated Verification of Guest / Fan Navigation Structure
import assert from 'assert';
import db from './config/database.js';
import bcrypt from 'bcryptjs';

const BASE_URL = 'http://localhost:9000';

async function runTest() {
  console.log('--- Testing Guest & Fan Navbar Navigation (Discovery, Event, Radar, Artist) ---');

  // 1. Guest View (Public)
  console.log('1. Checking Guest / Public View at / ...');
  const guestRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(guestRes.status, 200, 'Home page returns HTTP 200');
  const guestHtml = await guestRes.text();

  // Extract navigation block from HTML
  const navMatch = guestHtml.match(/<nav[^>]*aria-label="Main Navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert(navMatch, 'Main navigation block present');
  const navHtml = navMatch[1];

  assert(navHtml.includes('Discovery'), 'Guest nav includes "Discovery"');
  assert(navHtml.includes('Event'), 'Guest nav includes "Event"');
  assert(navHtml.includes('Radar'), 'Guest nav includes "Radar"');
  assert(navHtml.includes('Artist'), 'Guest nav includes "Artist"');
  assert(!navHtml.includes('For Organizers'), 'Guest nav DOES NOT include "For Organizers"');
  console.log('✓ Guest nav verified: Discovery, Event, Radar, Artist present; "For Organizers" removed!');

  // 2. Fan View (Logged in)
  console.log('2. Checking Authenticated Fan View at /dashboard ...');
  const fanUser = await db.getOne("SELECT * FROM users WHERE role = 'FAN' LIMIT 1");
  assert(fanUser, 'Fan user exists');
  const fanHash = await bcrypt.hash('password123', 10);
  await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [fanHash, fanUser.id]);

  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: fanUser.email,
      password: 'password123'
    }),
    redirect: 'manual'
  });
  const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];
  assert(cookie, 'Fan login cookie received');

  const fanHomeRes = await fetch(`${BASE_URL}/`, { headers: { Cookie: cookie } });
  const fanHtml = await fanHomeRes.text();
  const fanNavMatch = fanHtml.match(/<nav[^>]*aria-label="Main Navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert(fanNavMatch, 'Fan main navigation block present');
  const fanNavHtml = fanNavMatch[1];

  assert(fanNavHtml.includes('Discovery'), 'Fan nav includes "Discovery"');
  assert(fanNavHtml.includes('Event'), 'Fan nav includes "Event"');
  assert(fanNavHtml.includes('Radar'), 'Fan nav includes "Radar"');
  assert(fanNavHtml.includes('Artist'), 'Fan nav includes "Artist"');
  assert(!fanNavHtml.includes('For Organizers'), 'Fan nav DOES NOT include "For Organizers"');
  console.log('✓ Fan nav verified: Discovery, Event, Radar, Artist present; "For Organizers" removed!');

  // 3. Organizer View (Logged in)
  console.log('3. Checking Authenticated Organizer View at /organizer/dashboard ...');
  const orgUser = await db.getOne("SELECT * FROM users WHERE role = 'ORGANIZER' LIMIT 1");
  assert(orgUser, 'Organizer user exists');
  const orgHash = await bcrypt.hash('password123', 10);
  await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [orgHash, orgUser.id]);

  const orgLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: orgUser.email,
      password: 'password123'
    }),
    redirect: 'manual'
  });
  const orgCookie = orgLoginRes.headers.get('set-cookie')?.split(';')[0];
  assert(orgCookie, 'Organizer login cookie received');

  const orgRes = await fetch(`${BASE_URL}/organizer/dashboard`, { headers: { Cookie: orgCookie } });
  const orgHtml = await orgRes.text();
  const orgNavMatch = orgHtml.match(/<nav[^>]*aria-label="Main Navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert(orgNavMatch, 'Organizer main navigation block present');
  const orgNavHtml = orgNavMatch[1];

  assert(orgNavHtml.includes('Dashboard'), 'Organizer nav has Dashboard');
  assert(orgNavHtml.includes('My Events'), 'Organizer nav has My Events');
  assert(orgNavHtml.includes('Submit Event'), 'Organizer nav has Submit Event');
  console.log('✓ Organizer nav verified: Dedicated Dashboard, My Events, Submit Event!');

  console.log('\n🎉 ALL GUEST, FAN & ORGANIZER NAVBAR TESTS PASSED 100%!\n');
}

runTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
