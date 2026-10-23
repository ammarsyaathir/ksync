// test_profile_and_actors.mjs - Comprehensive Test Suite for Profile Views & Actor Separation
import db from './config/database.js';
import bcrypt from 'bcryptjs';

const BASE_URL = 'http://localhost:9000';

async function setupTestUsers() {
  const hash = await bcrypt.hash('password123', 10);
  await db.execute("UPDATE users SET password_hash = ? WHERE email IN ('fan@ksync.my', 'organizer@ksync.my', 'admin@ksync.my')", [hash]);
}

async function loginUser(email, password) {
  const params = new URLSearchParams();
  params.append('username', email); // login accepts username or email
  params.append('password', password);

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    redirect: 'manual'
  });

  const cookie = res.headers.get('set-cookie');
  if (!cookie) {
    throw new Error(`Failed to log in as ${email}. Status: ${res.status}`);
  }
  return cookie.split(';')[0];
}

async function runTests() {
  console.log('🧪 Starting Profile & Actor-Separation Test Suite...\n');
  await setupTestUsers();

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Fan Profile Inspection
    console.log('--- Test Group 1: Fan Profile View & Update ---');
    const fanCookie = await loginUser('fan@ksync.my', 'password123');
    const fanGetRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Cookie: fanCookie }
    });
    const fanHtml = await fanGetRes.text();

    assert(fanGetRes.status === 200, 'GET /profile as Fan returns HTTP 200');
    assert(fanHtml.includes('Fan Profile'), 'Header displays "Fan Profile"');
    assert(fanHtml.includes('360° Radar'), 'Fan profile displays 360° Radar link');
    assert(fanHtml.includes('Saved Wishlist'), 'Fan profile displays Saved Wishlist link');
    assert(!fanHtml.includes('Maintainer Hub'), 'Fan profile does NOT leak Admin Maintainer Hub');
    assert(fanHtml.includes('Favorite K-Pop Bias / Interests'), 'Fan profile displays bias/interests field');

    // Update Fan profile
    const fanUpdateParams = new URLSearchParams();
    fanUpdateParams.append('full_name', 'Verified K-Pop Fan MY');
    fanUpdateParams.append('location', 'Petaling Jaya, Selangor');
    fanUpdateParams.append('buddy_preference', 'SEVENTEEN, TWICE, NewJeans');
    fanUpdateParams.append('bio', 'Proud CARAT & ONCE attending concerts since 2018!');

    const fanPostRes = await fetch(`${BASE_URL}/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: fanCookie 
      },
      body: fanUpdateParams.toString(),
      redirect: 'manual'
    });

    assert([302, 303].includes(fanPostRes.status), 'POST /profile returns redirect');
    
    // Verify in DB
    const updatedFan = await db.getOne("SELECT full_name, location, buddy_preference, bio FROM users WHERE email = 'fan@ksync.my'");
    assert(updatedFan.full_name === 'Verified K-Pop Fan MY', 'DB updated full_name correctly');
    assert(updatedFan.location === 'Petaling Jaya, Selangor', 'DB updated location correctly');
    assert(updatedFan.buddy_preference === 'SEVENTEEN, TWICE, NewJeans', 'DB updated buddy_preference correctly');

    // 2. Organizer Profile Inspection
    console.log('\n--- Test Group 2: Organizer Profile View & Update ---');
    const orgCookie = await loginUser('organizer@ksync.my', 'password123');
    const orgGetRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Cookie: orgCookie }
    });
    const orgHtml = await orgGetRes.text();

    assert(orgGetRes.status === 200, 'GET /profile as Organizer returns HTTP 200');
    assert(orgHtml.includes('Organization Profile'), 'Header displays "Organization Profile"');
    assert(orgHtml.includes('Organizer Portal'), 'Organizer profile displays Organizer Portal link');
    assert(orgHtml.includes('Publish Concert / Event'), 'Organizer profile displays Publish Concert link');
    assert(orgHtml.includes('Organization Credentials & Official Channels'), 'Organizer profile displays Organization Credentials form');

    // Update Organizer profile
    const orgUpdateParams = new URLSearchParams();
    orgUpdateParams.append('full_name', 'Starline Entertainment Representative');
    orgUpdateParams.append('organization_name', 'Starline Events Malaysia');
    orgUpdateParams.append('organization_type', 'Promoter');
    orgUpdateParams.append('social_handle', '@Starline_MY');
    orgUpdateParams.append('social_url', 'https://starline.my');
    orgUpdateParams.append('location', 'Kuala Lumpur Metro');
    orgUpdateParams.append('bio', 'Official concert and fan meeting promoters in Southeast Asia.');

    const orgPostRes = await fetch(`${BASE_URL}/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: orgCookie 
      },
      body: orgUpdateParams.toString(),
      redirect: 'manual'
    });

    assert([302, 303].includes(orgPostRes.status), 'POST /profile as Organizer returns redirect');

    // Verify in DB
    const updatedOrg = await db.getOne("SELECT organization_name, organization_type, social_handle, social_url FROM users WHERE email = 'organizer@ksync.my'");
    assert(updatedOrg.organization_name === 'Starline Events Malaysia', 'DB updated organization_name correctly');
    assert(updatedOrg.organization_type === 'Promoter', 'DB updated organization_type correctly');
    assert(updatedOrg.social_handle === '@Starline_MY', 'DB updated social_handle correctly');
    assert(updatedOrg.social_url === 'https://starline.my', 'DB updated social_url correctly');

    // 3. Admin Profile Inspection
    console.log('\n--- Test Group 3: Admin Profile View ---');
    const adminCookie = await loginUser('admin@ksync.my', 'password123');
    const adminGetRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Cookie: adminCookie }
    });
    const adminHtml = await adminGetRes.text();

    assert(adminGetRes.status === 200, 'GET /profile as Admin returns HTTP 200');
    assert(adminHtml.includes('Administrator Profile'), 'Header displays "Administrator Profile"');
    assert(adminHtml.includes('Maintainer Hub'), 'Admin profile displays Maintainer Hub link');
    assert(adminHtml.includes('Scam Reports'), 'Admin profile displays Scam Reports link');

    // 4. Edge Cases: Missing full_name in body & Null Safety
    console.log('\n--- Test Group 4: Edge Cases & Null Safety ---');
    // POST with empty body (should not crash with TypeError: Cannot read properties of undefined)
    const emptyPostRes = await fetch(`${BASE_URL}/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: fanCookie 
      },
      body: '',
      redirect: 'manual'
    });
    assert([302, 303].includes(emptyPostRes.status), 'POST /profile with empty body gracefully redirects without crashing');

    // Password validation checks
    const shortPwParams = new URLSearchParams();
    shortPwParams.append('current_password', 'password123');
    shortPwParams.append('new_password', '123');
    shortPwParams.append('confirm_password', '123');

    const shortPwRes = await fetch(`${BASE_URL}/profile/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: fanCookie 
      },
      body: shortPwParams.toString(),
      redirect: 'manual'
    });
    assert([302, 303].includes(shortPwRes.status), 'POST /profile/change-password rejects short password safely');

    // Notifications update test
    const notifParams = new URLSearchParams();
    notifParams.append('notify_event_updates', '1');
    notifParams.append('notify_countdown_reminders', '1');
    notifParams.append('notify_discussion_replies', '0');

    const notifRes = await fetch(`${BASE_URL}/profile/notifications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: fanCookie 
      },
      body: notifParams.toString(),
      redirect: 'manual'
    });
    assert([302, 303].includes(notifRes.status), 'POST /profile/notifications successfully updates preferences');
    
    const fanNotifs = await db.getOne("SELECT notify_event_updates, notify_countdown_reminders, notify_discussion_replies FROM users WHERE email = 'fan@ksync.my'");
    assert(fanNotifs.notify_event_updates === 1 && fanNotifs.notify_discussion_replies === 0, 'DB stores notification toggles accurately');

  } catch (err) {
    console.error('Test execution error:', err);
  }

  console.log(`\n==========================================`);
  console.log(`🏁 Test Summary: ${passed}/${total} assertions passed (${Math.round(passed/total * 100)}%)`);
  console.log(`==========================================\n`);

  process.exit(passed === total ? 0 : 1);
}

runTests();
