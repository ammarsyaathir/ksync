import fs from 'fs';

async function testArtists() {
  const testSlugs = [
    'seventeen', 'twice', 'iu', 'enhypen', 'ive', 'txt', 'stray-kids', 'aespa',
    'bts', 'babymonster', 'wave-to-earth', 'young-k', 'the-rose', 'boynextdoor',
    'blackpink', 'itzy', 'nct-dream', 'treasure', 'taeyeon', 'super-junior'
  ];
  
  for (const slug of testSlugs) {
    const res = await fetch(`http://localhost:9000/artists/${slug}`);
    if (res.status !== 200) {
      console.error(`❌ /artists/${slug} returned HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    const matches = html.match(/\/images\/members\/[a-z0-9\-]+\.(?:jpg|png|webp)/g) || [];
    const unique = [...new Set(matches)];
    
    // Check that each referenced image actually exists on disk in ./public
    let allExist = true;
    for (const p of unique) {
      const localPath = './public' + p;
      if (!fs.existsSync(localPath)) {
        console.error(`  ❌ Missing local file: ${localPath}`);
        allExist = false;
      }
    }
    
    console.log(`✅ [${slug}] HTTP 200 | Members rendered: ${unique.length} | All local files exist: ${allExist}`);
  }

  // Also test fetching one member image directly from the server
  const imgRes = await fetch('http://localhost:9000/images/members/babymonster-ruka.jpg');
  console.log(`\nDirect Image Fetch [/images/members/babymonster-ruka.jpg]: HTTP ${imgRes.status} | Content-Type: ${imgRes.headers.get('content-type')} | Size: ${imgRes.headers.get('content-length')} bytes`);

  process.exit(0);
}

testArtists();
