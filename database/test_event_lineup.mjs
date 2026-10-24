import assert from 'assert';

async function testEventLineup() {
  console.log('Testing Event Details Lineup View...');
  const res = await fetch('http://localhost:9000/events/23');
  assert.strictEqual(res.status, 200, 'GET /events/23 must return 200');
  const html = await res.text();

  assert(html.includes('line-up'), 'Must display "line-up" heading');
  assert(html.includes('Full profiles'), 'Must display "Full profiles" button');
  assert(html.includes('/artists/seventeen'), 'Must link to artist profile');
  assert(html.includes('Looking for birth names, heights, MBTI or blood type?'), 'Must display footer prompt to artist profile');
  assert(html.includes('S.Coups'), 'Must display member S.Coups');
  assert(html.includes('Leader, Hip-Hop Team'), 'Must display member position');
  assert(!html.includes('uppercase">DOB</div>'), 'Must NOT display redundant DOB biodata box in event page');

  console.log('✅ Event details lineup successfully updated to clean compact cards with direct links to artist profile!');
  process.exit(0);
}

testEventLineup().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
