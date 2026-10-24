// test_artist_slugs.mjs
import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('🧪 Testing artist slugs and redirects...');

  // Test /artists/4 (should redirect 301 to /artists/enhypen)
  const r4 = await get('http://localhost:9000/artists/4');
  console.log('GET /artists/4 -> Status:', r4.status, '| Location:', r4.headers.location);

  // Test /artists/enhypen (should return 200)
  const rEnhypen = await get('http://localhost:9000/artists/enhypen');
  console.log('GET /artists/enhypen -> Status:', rEnhypen.status);

  // Test /artists/1 (should redirect 301 to /artists/seventeen)
  const r1 = await get('http://localhost:9000/artists/1');
  console.log('GET /artists/1 -> Status:', r1.status, '| Location:', r1.headers.location);

  // Test /artists/seventeen (should return 200)
  const rSeventeen = await get('http://localhost:9000/artists/seventeen');
  console.log('GET /artists/seventeen -> Status:', rSeventeen.status);

  // Test /artists directory
  const rList = await get('http://localhost:9000/artists');
  console.log('GET /artists -> Status:', rList.status);
  
  const matches = [...rList.data.matchAll(/href="\/artists\/([^"]+)"/g)].map(m => m[1]);
  const uniqueSlugs = [...new Set(matches)];
  console.log(`Unique artist slugs on /artists (${uniqueSlugs.length}):`, uniqueSlugs);

  process.exit(0);
}

run().catch(console.error);
