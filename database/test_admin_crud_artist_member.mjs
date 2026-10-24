import assert from 'assert';

async function testAdminCRUD() {
  console.log('🧪 Testing Admin Artist & Member CRUD Suite...');

  // 1. Authenticate as Admin (admin@ksync.my / password123)
  const loginRes = await fetch('http://localhost:9000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: 'admin@ksync.my', password: 'password123' }),
    redirect: 'manual'
  });
  const rawCookie = loginRes.headers.get('set-cookie');
  assert(rawCookie, 'Admin login must set session cookie');
  const cookie = rawCookie.split(';')[0];
  console.log('✅ Admin login session established');

  // 2. GET /admin/artists
  const artistsRes = await fetch('http://localhost:9000/admin/artists', {
    headers: { cookie }
  });
  assert.strictEqual(artistsRes.status, 200, '/admin/artists must return HTTP 200');
  const artistsHtml = await artistsRes.text();
  assert(artistsHtml.includes('Talent Directory & Lineup Hub'), 'Must render talent directory title');
  assert(artistsHtml.includes('BABYMONSTER'), 'Must list BABYMONSTER');
  assert(artistsHtml.includes('SEVENTEEN'), 'Must list SEVENTEEN');
  assert(artistsHtml.includes('Lineup'), 'Must render Lineup buttons');
  console.log('✅ GET /admin/artists returns HTTP 200 with full artist catalog & lineup management');

  // 3. GET /admin/artists/10/members (BABYMONSTER)
  const membersRes = await fetch('http://localhost:9000/admin/artists/10/members', {
    headers: { cookie }
  });
  assert.strictEqual(membersRes.status, 200, 'Member API must return HTTP 200');
  const membersData = await membersRes.json();
  assert(membersData.success, 'Member API must be successful');
  assert.strictEqual(membersData.members.length, 7, 'BABYMONSTER must have 7 members');
  assert(membersData.members.some(m => m.stage_name === 'Ruka'), 'Ruka must be in lineup');
  console.log('✅ GET /admin/artists/:id/members returned 7 members for BABYMONSTER via API');

  // 4. Test Editing Artist
  const editRes = await fetch('http://localhost:9000/admin/artists/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie
    },
    body: new URLSearchParams({
      id: '10',
      name: 'BABYMONSTER',
      slug: 'babymonster',
      group_type: 'Girl Group',
      agency: 'YG Entertainment',
      debut_year: '2023',
      fandom_name: 'MONSTIEZ',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png',
      header_image: 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png',
      description: 'YG Entertainment 7-member powerhouse girl group. High-energy hits BATTER UP, SHEESH, and DRIP.'
    }),
    redirect: 'manual'
  });
  assert(editRes.status === 302 || editRes.status === 200, 'Edit artist must succeed');
  console.log('✅ POST /admin/artists/edit successfully modified artist record');

  // 5. Test Adding Member
  const addMemberRes = await fetch('http://localhost:9000/admin/members/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', cookie },
    body: new URLSearchParams({
      artist_id: '10',
      stage_name: 'TestMember',
      birth_name: 'Test Full Name',
      position: 'Sub-Vocalist',
      dob: '2005-01-01',
      zodiac: 'Capricorn',
      height_cm: '168',
      blood_type: 'O',
      mbti: 'ENFP',
      nationality: 'Malaysian',
      debut_year: '2024',
      photo: '/images/members/babymonster-ruka.jpg',
      sort_order: '99'
    }),
    redirect: 'manual'
  });
  assert(addMemberRes.status === 302 || addMemberRes.status === 200, 'Add member must succeed');
  console.log('✅ POST /admin/members/add successfully added member');

  // Verify member exists
  const membersAfterAdd = await (await fetch('http://localhost:9000/admin/artists/10/members', { headers: { cookie } })).json();
  const testMember = membersAfterAdd.members.find(m => m.stage_name === 'TestMember');
  assert(testMember, 'Newly added member must exist');
  assert.strictEqual(testMember.mbti, 'ENFP');
  console.log(`✅ Verified newly added member ID ${testMember.id}`);

  // 6. Test Editing Member
  const editMemberRes = await fetch('http://localhost:9000/admin/members/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', cookie },
    body: new URLSearchParams({
      id: String(testMember.id),
      stage_name: 'TestMemberUpdated',
      birth_name: 'Updated Name',
      position: 'Main Vocalist',
      dob: '2005-01-01',
      zodiac: 'Capricorn',
      height_cm: '170',
      blood_type: 'A',
      mbti: 'INFJ',
      nationality: 'Malaysian',
      debut_year: '2024',
      photo: '/images/members/babymonster-ruka.jpg',
      sort_order: '99'
    }),
    redirect: 'manual'
  });
  assert(editMemberRes.status === 302 || editMemberRes.status === 200, 'Edit member must succeed');
  console.log('✅ POST /admin/members/edit successfully updated member');

  // 7. Test Deleting Member
  const deleteMemberRes = await fetch('http://localhost:9000/admin/members/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', cookie },
    body: new URLSearchParams({ id: String(testMember.id) }),
    redirect: 'manual'
  });
  assert(deleteMemberRes.status === 302 || deleteMemberRes.status === 200, 'Delete member must succeed');
  console.log('✅ POST /admin/members/delete successfully deleted member');

  // Verify cleanup
  const membersAfterCleanup = await (await fetch('http://localhost:9000/admin/artists/10/members', { headers: { cookie } })).json();
  assert(!membersAfterCleanup.members.some(m => m.id === testMember.id), 'Test member must be deleted');
  assert.strictEqual(membersAfterCleanup.members.length, 7, 'Member count must be restored to 7');
  console.log('✅ Verified member cleanup - member count returned to 7');

  console.log('\n🎉 ALL ADMIN ARTIST & MEMBER CRUD TESTS PASSED!');
  process.exit(0);
}

testAdminCRUD().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
