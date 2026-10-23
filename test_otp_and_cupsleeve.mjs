// test_otp_and_cupsleeve.mjs - Automated Verification of Organizer OTP & Fanclub Cupsleeve Engine
import db from './config/database.js';

const BASE_URL = 'http://localhost:9000';

async function run() {
  console.log('=================================================================');
  console.log('🧪 TESTING ORGANIZER EMAIL OTP & AUTONOMOUS CUPSLEEVE ENGINE');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  const testEmail = `txt_moa_test_${Date.now()}@ksync.my`;
  const testUsername = `mymoa_${Date.now().toString().slice(-4)}`;

  // -------------------------------------------------------------
  // TEST 1: Register as Organizer with Email OTP Dispatch
  // -------------------------------------------------------------
  console.log('\n--- 1. ORGANIZER REGISTRATION WITH 6-DIGIT EMAIL OTP ---');
  let regRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      account_type: 'organizer',
      full_name: 'Nur Aina (MY MOA Lead)',
      username: testUsername,
      email: testEmail,
      password: 'password123',
      organization_name: 'MY MOA Union (TXT Fanclub Malaysia)',
      organization_type: 'Fanclub',
      social_handle: '@mymoatxt',
      social_url: 'https://t.me/mymoatxt'
    }),
    redirect: 'manual'
  });

  assert(regRes.status === 302, 'POST /register initiates registration and redirects to /verify-email');
  const regLocation = regRes.headers.get('location');
  assert(regLocation && regLocation.includes('/verify-email'), `Redirect location is /verify-email (Got: ${regLocation})`);

  const regCookie = regRes.headers.get('set-cookie')?.split(';')[0];

  // Verify OTP was recorded in email_otp_verifications database table
  const otpRecord = await db.getOne(
    "SELECT * FROM email_otp_verifications WHERE email = ? AND purpose = 'REGISTRATION' ORDER BY id DESC LIMIT 1",
    [testEmail]
  );
  assert(otpRecord && otpRecord.otp_code && otpRecord.otp_code.length === 6, 
    `6-digit OTP code successfully generated and stored in DB (Code: ${otpRecord?.otp_code})`);

  const generatedOtp = otpRecord.otp_code;

  // -------------------------------------------------------------
  // TEST 2: Submit 6-digit OTP to Activate Organizer Account
  // -------------------------------------------------------------
  console.log('\n--- 2. VERIFY 6-DIGIT OTP AND ACTIVATE ORGANIZER PRIVILEGES ---');
  let verifyRes = await fetch(`${BASE_URL}/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: regCookie || ''
    },
    body: new URLSearchParams({
      email: testEmail,
      otp: generatedOtp
    }),
    redirect: 'manual'
  });

  assert(verifyRes.status === 302, 'POST /verify-email validates OTP code');
  const verifyLocation = verifyRes.headers.get('location');
  assert(verifyLocation === '/organizer/dashboard', 
    `Organizer automatically authenticated and welcomed directly to /organizer/dashboard (Got: ${verifyLocation})`);

  const activeUserCookie = verifyRes.headers.get('set-cookie')?.split(';')[0] || regCookie;

  // Check database user row
  const createdUser = await db.getOne("SELECT * FROM users WHERE email = ?", [testEmail]);
  assert(createdUser !== null, `User record created in database for ${testEmail}`);
  assert(createdUser.role === 'ORGANIZER', `User role is 'ORGANIZER' (Got: ${createdUser?.role})`);
  assert(createdUser.is_verified_organizer === 1, `is_verified_organizer is 1 (Autonomous Email OTP Verified)`);
  assert(createdUser.organization_name === 'MY MOA Union (TXT Fanclub Malaysia)', 
    `Organization name saved: '${createdUser?.organization_name}'`);
  assert(createdUser.social_url === 'https://t.me/mymoatxt', `Telegram channel saved: '${createdUser?.social_url}'`);

  // -------------------------------------------------------------
  // TEST 3: Passwordless Sign In with Email OTP
  // -------------------------------------------------------------
  console.log('\n--- 3. PASSWORDLESS SIGN IN WITH 6-DIGIT EMAIL OTP ---');
  let reqOtpRes = await fetch(`${BASE_URL}/request-login-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email: testEmail }),
    redirect: 'manual'
  });
  assert(reqOtpRes.status === 302, 'POST /request-login-otp dispatches OTP and redirects to /verify-login-otp');

  const loginOtpCookie = reqOtpRes.headers.get('set-cookie')?.split(';')[0];
  const loginOtpRecord = await db.getOne(
    "SELECT * FROM email_otp_verifications WHERE email = ? AND purpose = 'LOGIN' ORDER BY id DESC LIMIT 1",
    [testEmail]
  );
  assert(loginOtpRecord && loginOtpRecord.otp_code, `Login OTP recorded in DB (Code: ${loginOtpRecord?.otp_code})`);

  // Verify Login OTP
  let authOtpRes = await fetch(`${BASE_URL}/verify-login-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: loginOtpCookie || ''
    },
    body: new URLSearchParams({
      email: testEmail,
      otp: loginOtpRecord.otp_code
    }),
    redirect: 'manual'
  });
  assert(authOtpRes.status === 302, 'POST /verify-login-otp verifies code');
  const loginRedirect = authOtpRes.headers.get('location');
  assert(loginRedirect === '/organizer/dashboard', `Organizer routed directly to /organizer/dashboard upon OTP login`);

  // -------------------------------------------------------------
  // TEST 4: Autonomous Fanclub Trust Engine (TXT Cupsleeve via Telegram)
  // -------------------------------------------------------------
  console.log('\n--- 4. AUTONOMOUS FANCLUB TRUST ENGINE (TXT CUPSLEEVE & TELEGRAM) ---');
  // Clean up any test events from previous test runs so duplicate detector doesn't collide
  await db.execute("DELETE FROM events WHERE event_name LIKE '%TXT 6th Anniversary Cupsleeve%'");

  let cupsleeveRes = await fetch(`${BASE_URL}/organizer/events/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: activeUserCookie
    },
    body: new URLSearchParams({
      event_name: `TXT 6th Anniversary Cupsleeve & MOA Gathering KL ${Date.now().toString().slice(-4)}`,
      artist_id: '6', // TXT
      category_id: '3', // Cupsleeve Event
      event_date: '2027-03-04',
      start_time: '11:00',
      end_time: '18:00',
      venue_name: 'VCR Cafe Bangsar',
      address: '2, Jalan Telawi 3, Bangsar Baru, 59100 Kuala Lumpur',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan Kuala Lumpur',
      ticket_info: 'Free entry with any beverage order (RM 12 - RM 18). Free TXT anniversary cupsleeve & photocard set included with drink receipt.',
      event_rules: 'Photocard trading allowed in outdoor patio. 1 tier pack per beverage transaction.',
      official_url: 'https://t.me/mymoatxt',
      evidence_link: 'https://t.me/mymoatxt',
      poster_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop',
      organizer_type: 'Fanclub'
    }),
    redirect: 'manual'
  });

  assert(cupsleeveRes.status === 302, 'POST /organizer/events/new processes cupsleeve submission');

  // Verify created event in database has been auto-verified without admin queue!
  const cupsleeveEvent = await db.getOne(
    "SELECT * FROM events WHERE organizer_id = ? ORDER BY id DESC LIMIT 1",
    [createdUser.id]
  );

  assert(cupsleeveEvent !== null, 'TXT Cupsleeve event saved in database');
  assert(cupsleeveEvent.verification_status === 'VERIFIED', 
    `Autonomous Trust Engine Result: verification_status is 'VERIFIED' (0 Admin queues!) - Got: ${cupsleeveEvent?.verification_status}`);
  assert(cupsleeveEvent.trust_level === 'COMMUNITY', 
    `Autonomous Trust Engine Result: trust_level is 'COMMUNITY' (Got: ${cupsleeveEvent?.trust_level})`);
  assert(cupsleeveEvent.admin_verification_notes && cupsleeveEvent.admin_verification_notes.includes('Autonomous Fanclub'), 
    `Verification notes reflect autonomous engine: "${cupsleeveEvent?.admin_verification_notes}"`);

  console.log('\n=================================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
