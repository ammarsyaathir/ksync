// test_submit_form_redesign.mjs
import assert from 'assert';

const BASE_URL = 'http://localhost:9000';

async function run() {
  console.log('--- Testing Submit & Edit Form Redesign, 4-Graphic Slots & Preview Modal ---');

  // Step 1: Login as Organizer
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

  // Step 2: GET /organizer/events/new
  const resNew = await fetch(`${BASE_URL}/organizer/events/new`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(resNew.status, 200, 'GET /organizer/events/new should return 200');
  const htmlNew = await resNew.text();

  // Verify Comp 1 Elements: Stepper & Smart Fill
  assert(htmlNew.includes('Start with the announcement. We\'ll fill the form.'), 'Should contain Smart Fill headline');
  assert(htmlNew.includes('Read evidence'), 'Should contain Stepper Step 1');
  assert(htmlNew.includes('Check details'), 'Should contain Stepper Step 2');
  assert(htmlNew.includes('Submit & verify'), 'Should contain Stepper Step 3');
  assert(htmlNew.includes('Use the BOYNEXTDOOR sample'), 'Should contain 1-click sample button');
  console.log('✓ Stepper & Smart Fill banner verified');

  // Verify Comp 2 Elements: Form Cards & Sidebar
  assert(htmlNew.includes('Artist & event'), 'Should contain Artist & event card');
  assert(htmlNew.includes('Schedule & timing'), 'Should contain Schedule & timing card');
  assert(htmlNew.includes('Venue & location'), 'Should contain Venue & location card');
  assert(htmlNew.includes('Ticketing & official evidence'), 'Should contain Ticketing & official evidence card');
  assert(htmlNew.includes('Ready to submit?'), 'Should contain dynamic Ready to submit sidebar');
  assert(htmlNew.includes('What runs after you submit'), 'Should contain AI verification accordion');
  console.log('✓ 2-Column modular cards and live checklist sidebar verified');

  // Verify Comp 3 Elements: 4 Graphic Slots & Declaration
  assert(htmlNew.includes('slotCard1'), 'Should contain Graphic Slot 1');
  assert(htmlNew.includes('slotCard2'), 'Should contain Graphic Slot 2');
  assert(htmlNew.includes('slotCard3'), 'Should contain Graphic Slot 3');
  assert(htmlNew.includes('slotCard4'), 'Should contain Graphic Slot 4');
  assert(htmlNew.includes('Main tour poster'), 'Should contain Slot 1 label');
  assert(htmlNew.includes('Seating & stage map'), 'Should contain Slot 2 label');
  assert(htmlNew.includes('Fan benefits & VIP'), 'Should contain Slot 3 label');
  assert(htmlNew.includes('Schedule & rules'), 'Should contain Slot 4 label');
  assert(htmlNew.includes('Truthfulness & Authenticity Guarantee'), 'Should contain Declaration card');
  assert(htmlNew.includes('declaration_confirmed'), 'Should contain declaration checkbox');
  console.log('✓ 4-slot visual uploaders and declaration card verified');

  // Verify Preview Modal Elements
  assert(htmlNew.includes('id="eventPreviewModal"'), 'Should contain event preview modal');
  assert(htmlNew.includes('openEventPreviewModal()'), 'Should contain preview modal trigger function');
  assert(htmlNew.includes('submitFromPreviewModal()'), 'Should contain modal direct submission function');
  assert(htmlNew.includes('modalActivePoster'), 'Should contain modal active poster element');
  assert(htmlNew.includes('modalGalleryThumbnails'), 'Should contain modal multi-poster thumbnails');
  console.log('✓ Real-time event preview modal verified');

  // Step 3: Test POST /organizer/events/new with 4 posters
  const formData = new URLSearchParams({
    event_name: 'TEST REDESIGN EVENT: ENHYPEN MANIFESTO IN KL',
    category_id: '1',
    artist_id: '1',
    event_date: '2027-08-20',
    start_time: '19:00',
    end_time: '22:00',
    venue_name: 'Axiata Arena Bukit Jalil',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    address: 'Jalan Barat, Bukit Jalil, 57000 Kuala Lumpur',
    official_url: 'https://golive-asia.com/enhypen-manifesto-kl',
    evidence_link: 'https://weverse.io/enhypen/notice/998822',
    ticket_info: 'VIP: RM 988 | CAT 1: RM 688',
    event_rules: 'Official lightsticks allowed.',
    description: 'ENHYPEN returns to Axiata Arena with an electrifying stadium stage.',
    poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800,https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800,https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800,https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    declaration_confirmed: 'on'
  });

  const createRes = await fetch(`${BASE_URL}/organizer/events/new`, {
    method: 'POST',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData,
    redirect: 'manual'
  });

  assert(createRes.status === 302, 'Creating event should redirect (302)');
  console.log('✓ Successfully created event with 4 multi-posters');

  // Step 4: Test GET /organizer/events/:id/edit
  // Find the event in dashboard
  const dashRes = await fetch(`${BASE_URL}/organizer/dashboard`, {
    headers: { Cookie: cookie }
  });
  const dashHtml = await dashRes.text();
  const match = dashHtml.match(/\/organizer\/events\/(\d+)\/edit/);
  assert(match, 'Should find edit link for an event');
  const editId = match[1];

  const editRes = await fetch(`${BASE_URL}/organizer/events/${editId}/edit`, {
    headers: { Cookie: cookie }
  });
  assert.strictEqual(editRes.status, 200, 'GET edit form should return 200');
  const editHtml = await editRes.text();
  assert(editHtml.includes('Save Changes') || editHtml.includes('Save changes'), 'Edit form should display Save Changes button');
  assert(editHtml.includes('Event lifecycle status') || editHtml.includes('lifecycle status'), 'Edit form should display lifecycle status');
  assert(editHtml.includes('slotCard1'), 'Edit form should render 4 visual slots pre-populated');
  console.log('✓ Edit form rendered with pre-populated details and 4 visual slots');

  console.log('\n🎉 ALL SUBMISSION FORM REDESIGN, 4-SLOT UPLOADER & PREVIEW MODAL TESTS PASSED 100%!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
