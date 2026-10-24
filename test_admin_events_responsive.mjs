import db from './config/database.js';
import bcrypt from 'bcryptjs';

async function run() {
  console.log('🧪 Testing Admin Events Responsive View...');

  let adminUser = await db.getOne("SELECT * FROM users WHERE role = 'ADMIN' LIMIT 1");
  if (!adminUser) {
    console.error('❌ No admin user found in database!');
    process.exit(1);
  }
  console.log(`👤 Using admin user: ${adminUser.email}`);

  // Ensure password is password123
  const hash = await bcrypt.hash('password123', 10);
  await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [hash, adminUser.id]);

  // Authenticate with 'username' field (which login form expects)
  const loginRes = await fetch('http://localhost:9000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: adminUser.email, password: 'password123' }),
    redirect: 'manual'
  });

  const rawCookie = loginRes.headers.get('set-cookie');
  const cookie = rawCookie ? rawCookie.split(';')[0] : null;
  if (!cookie) {
    console.error('❌ Could not obtain login session cookie');
    process.exit(1);
  }
  console.log('🍪 Session cookie established successfully');

  // Request /admin/events
  const res = await fetch('http://localhost:9000/admin/events', {
    headers: { Cookie: cookie }
  });

  console.log(`📡 Response Status: ${res.status}`);
  if (res.status !== 200) {
    console.error(`❌ Expected HTTP 200, got ${res.status}`);
    process.exit(1);
  }

  const html = await res.text();

  const checks = [
    { name: 'Contains mobile card list container (eventsMobileList)', pass: html.includes('id="eventsMobileList"') },
    { name: 'Contains mobile card items (event-mobile-card)', pass: html.includes('event-mobile-card') },
    { name: 'Contains desktop table container (eventsTableContainer)', pass: html.includes('id="eventsTableContainer"') },
    { name: 'Contains desktop rows (event-desktop-row)', pass: html.includes('event-desktop-row') },
    { name: 'Contains zero-results dynamic notice (noEventsMatchNotice)', pass: html.includes('id="noEventsMatchNotice"') },
    { name: 'Contains client-side filtering script (filterEventsTable)', pass: html.includes('function filterEventsTable') },
    { name: 'Contains status filter dropdown (eventStatusFilter)', pass: html.includes('id="eventStatusFilter"') },
    { name: 'Contains search input (eventSearchInput)', pass: html.includes('id="eventSearchInput"') },
    { name: 'Contains status update form action (/admin/events/update-status)', pass: html.includes('/admin/events/update-status') },
    { name: 'Contains event delete form action (/admin/events/delete)', pass: html.includes('/admin/events/delete') }
  ];

  let allPassed = true;
  for (const check of checks) {
    if (check.pass) {
      console.log(`  ✅ [PASS] ${check.name}`);
    } else {
      console.log(`  ❌ [FAIL] ${check.name}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL CHECKS PASSED: /admin/events is fully responsive and interactive!');
    process.exit(0);
  } else {
    console.error('\n❌ Some checks failed.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test crashed:', err);
  process.exit(1);
});
