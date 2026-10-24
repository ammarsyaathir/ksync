import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import db from '../config/database.js';

// Dictionary of all 120 members across all 20 artists
const MEMBER_IMAGE_SOURCES = {
  // 1. SEVENTEEN (13 members)
  seventeen: {
    'S.Coups': 'https://kprofiles.com/wp-content/uploads/2016/04/S.COUPS_-3-593x800.jpg',
    'Jeonghan': 'https://kprofiles.com/wp-content/uploads/2016/04/JEONGHAN-1-640x800.jpg',
    'Joshua': 'https://kprofiles.com/wp-content/uploads/2016/04/JOSHUA-2-593x800.jpg',
    'Jun': 'https://kprofiles.com/wp-content/uploads/2016/04/JUN-2-593x800.jpg',
    'Hoshi': 'https://kprofiles.com/wp-content/uploads/2016/04/HOSHI-2-593x800.jpg',
    'Wonwoo': 'https://kprofiles.com/wp-content/uploads/2016/04/WONWOO-2-593x800.jpg',
    'Woozi': 'https://kprofiles.com/wp-content/uploads/2016/04/WOOZI-2-900x667.jpg',
    'DK': 'https://kprofiles.com/wp-content/uploads/2016/04/DK-2-593x800.jpg',
    'Mingyu': 'https://kprofiles.com/wp-content/uploads/2016/04/MINGYU-2-593x800.jpg',
    'The8': 'https://kprofiles.com/wp-content/uploads/2016/04/THE8-2-593x800.jpg',
    'Seungkwan': 'https://kprofiles.com/wp-content/uploads/2016/04/SEUNGKWAN-2-593x800.jpg',
    'Vernon': 'https://kprofiles.com/wp-content/uploads/2016/04/VERNON-3-593x800.jpg',
    'Dino': 'https://kprofiles.com/wp-content/uploads/2016/04/DINO-2-900x667.jpg'
  },

  // 2. TWICE (9 members)
  twice: {
    'Nayeon': 'https://kprofiles.com/wp-content/uploads/2016/05/NAYEON-1-900x643.jpeg',
    'Jeongyeon': 'https://kprofiles.com/wp-content/uploads/2016/05/JEONGYEON-1-572x800.jpeg',
    'Momo': 'https://kprofiles.com/wp-content/uploads/2016/05/MOMO-1-572x800.jpeg',
    'Sana': 'https://kprofiles.com/wp-content/uploads/2016/05/SANA-1-572x800.jpeg',
    'Jihyo': 'https://kprofiles.com/wp-content/uploads/2016/05/JIHYO-1-900x643.jpeg',
    'Mina': 'https://kprofiles.com/wp-content/uploads/2016/05/MINA-1-572x800.jpeg',
    'Dahyun': 'https://kprofiles.com/wp-content/uploads/2016/05/DAHYUN-1-572x800.jpeg',
    'Chaeyoung': 'https://kprofiles.com/wp-content/uploads/2016/05/CHAEYOUNG-1-572x800.jpeg',
    'Tzuyu': 'https://kprofiles.com/wp-content/uploads/2016/05/TZUYU-1-572x800.jpeg'
  },

  // 3. IU (1 member)
  iu: {
    'IU': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png/330px-IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png'
  },

  // 4. ENHYPEN (7 members)
  enhypen: {
    'Jungwon': 'https://kprofiles.com/wp-content/uploads/2020/08/JUNGWON-1-900x600.jpeg',
    'Heeseung': 'https://kprofiles.com/wp-content/uploads/2020/08/HEESEUNG-600x800.jpeg',
    'Jay': 'https://kprofiles.com/wp-content/uploads/2020/08/JAY-1-534x800.jpeg',
    'Jake': 'https://kprofiles.com/wp-content/uploads/2020/08/JAKE-1-900x600.jpeg',
    'Sunghoon': 'https://kprofiles.com/wp-content/uploads/2020/08/SUNGHOON-1-534x800.jpeg',
    'Sunoo': 'https://kprofiles.com/wp-content/uploads/2020/08/SUNOO-1-534x800.jpeg',
    'Ni-ki': 'https://kprofiles.com/wp-content/uploads/2020/08/NI-KI-1-534x800.jpeg'
  },

  // 5. IVE (6 members)
  ive: {
    'An Yu-jin': 'https://kprofiles.com/wp-content/uploads/2021/11/YUJIN-2.jpg',
    'Gaeul': 'https://kprofiles.com/wp-content/uploads/2021/11/GAEUL-11.jpg',
    'Rei': 'https://kprofiles.com/wp-content/uploads/2021/11/REI-10.jpg',
    'Jang Won-young': 'https://kprofiles.com/wp-content/uploads/2021/11/WONYOUNG-3.jpg',
    'Liz': 'https://kprofiles.com/wp-content/uploads/2021/11/LIZ-10.jpg',
    'Leeseo': 'https://kprofiles.com/wp-content/uploads/2021/11/LEESEO-10.jpg'
  },

  // 6. TOMORROW X TOGETHER (5 members)
  txt: {
    'Soobin': 'https://kprofiles.com/wp-content/uploads/2019/01/SOOBIN-1-533x800.jpeg',
    'Yeonjun': 'https://kprofiles.com/wp-content/uploads/2019/01/YEONJUN-1-900x600.jpeg',
    'Beomgyu': 'https://kprofiles.com/wp-content/uploads/2019/01/BEOMGYU-1-900x600.jpeg',
    'Taehyun': 'https://kprofiles.com/wp-content/uploads/2019/01/TAEHYUN-1-900x600.jpeg',
    'HueningKai': 'https://kprofiles.com/wp-content/uploads/2019/01/HUENINGKAI-1-533x800.jpeg'
  },

  // 7. Stray Kids (8 members)
  'stray-kids': {
    'Bang Chan': 'https://kprofiles.com/wp-content/uploads/2017/11/BANG-CHAN-3-640x800.jpeg',
    'Lee Know': 'https://kprofiles.com/wp-content/uploads/2017/11/LEE-KNOW-4-640x800.jpeg',
    'Changbin': 'https://kprofiles.com/wp-content/uploads/2017/11/CHANGBIN-4-640x800.jpeg',
    'Hyunjin': 'https://kprofiles.com/wp-content/uploads/2017/11/HYUNJIN-4-640x800.jpeg',
    'Han': 'https://kprofiles.com/wp-content/uploads/2017/11/HAN-4-640x800.jpeg',
    'Felix': 'https://kprofiles.com/wp-content/uploads/2017/11/FELIX-4-640x800.jpeg',
    'Seungmin': 'https://kprofiles.com/wp-content/uploads/2017/11/SEUNGMIN-4-640x800.jpeg',
    'I.N': 'https://kprofiles.com/wp-content/uploads/2017/11/I.N-4-900x647.jpeg'
  },

  // 8. aespa (4 members)
  aespa: {
    'Karina': 'https://kprofiles.com/wp-content/uploads/2020/10/rina.jpg',
    'Giselle': 'https://kprofiles.com/wp-content/uploads/2020/10/giselle-4.jpg',
    'Winter': 'https://kprofiles.com/wp-content/uploads/2020/10/winter-4.jpg',
    'Ningning': 'https://kprofiles.com/wp-content/uploads/2020/10/ning2.jpg'
  },

  // 9. BTS (7 members)
  bts: {
    'RM': 'https://kprofiles.com/wp-content/uploads/2016/04/RM.webp',
    'Jin': 'https://kprofiles.com/wp-content/uploads/2016/04/Jin.webp',
    'SUGA': 'https://kprofiles.com/wp-content/uploads/2016/04/Suga.webp',
    'j-hope': 'https://kprofiles.com/wp-content/uploads/2016/04/j-hope.webp',
    'Jimin': 'https://kprofiles.com/wp-content/uploads/2016/04/Jimin.webp',
    'V': 'https://kprofiles.com/wp-content/uploads/2016/04/V.webp',
    'Jungkook': 'https://kprofiles.com/wp-content/uploads/2016/04/JungKook.webp'
  },

  // 10. BABYMONSTER (7 members)
  babymonster: {
    'Ruka': 'https://kprofiles.com/wp-content/uploads/2022/12/RUKA-3.jpg',
    'Pharita': 'https://kprofiles.com/wp-content/uploads/2022/12/PHARITA-4.jpg',
    'Asa': 'https://kprofiles.com/wp-content/uploads/2022/12/ASA-3.jpg',
    'Ahyeon': 'https://kprofiles.com/wp-content/uploads/2022/12/AHYEON-4.jpg',
    'Rami': 'https://kprofiles.com/wp-content/uploads/2022/12/BABYMONSTER-1st-Full-Album-DRIP-Concept-Photo-documents-5-640x800.jpeg',
    'Rora': 'https://kprofiles.com/wp-content/uploads/2022/12/RORA-4.jpg',
    'Chiquita': 'https://kprofiles.com/wp-content/uploads/2022/12/CHIQUITA-3.jpg'
  },

  // 11. wave to earth (3 members)
  'wave-to-earth': {
    'Daniel Kim': 'https://kprofiles.com/wp-content/uploads/2021/07/e2a69d6d9a632e21b55c72a1e9b4a4fbcdd3f0489c4ec7ba58843c30f90aa7b6-640x800.jpg',
    'John Cha': 'https://kprofiles.com/wp-content/uploads/2021/07/5457f4ce4b034934b871e22520908cd7388bf1f8c7c00332b925d5d6db4c92f5-641x800.jpg',
    'Dong Q': 'https://kprofiles.com/wp-content/uploads/2021/07/b32a17611c0638f6e6a6cd25e2d50165a81a4f392076a50f4566f092c6eb6843-641x800.jpg'
  },

  // 12. Young K (DAY6) (4 members)
  'young-k': {
    'Sungjin': 'https://kprofiles.com/wp-content/uploads/2016/07/IMG_1567-533x800.jpeg',
    'Young K': 'https://kprofiles.com/wp-content/uploads/2016/07/IMG_1566-533x800.jpeg',
    'Wonpil': 'https://kprofiles.com/wp-content/uploads/2016/07/IMG_1565-533x800.jpeg',
    'Dowoon': 'https://kprofiles.com/wp-content/uploads/2016/07/IMG_1564-533x800.jpeg'
  },

  // 13. The Rose (4 members)
  'the-rose': {
    'Woosung': 'https://kprofiles.com/wp-content/uploads/2017/08/WOOSUNG-1-640x800.jpg',
    'Dojoon': 'https://kprofiles.com/wp-content/uploads/2017/08/DOJOON-640x800.jpg',
    'Hajoon': 'https://kprofiles.com/wp-content/uploads/2017/08/HAJOON-640x800.jpg',
    'Jaehyeong': 'https://kprofiles.com/wp-content/uploads/2017/08/JAEHYEONG-640x800.jpg'
  },

  // 14. BOYNEXTDOOR (6 members)
  boynextdoor: {
    'Sungho': 'https://kprofiles.com/wp-content/uploads/2023/05/SUNGHO-4-533x800.jpeg',
    'Riwoo': 'https://kprofiles.com/wp-content/uploads/2023/05/RIWOO-4-533x800.jpeg',
    'Jaehyun': 'https://kprofiles.com/wp-content/uploads/2023/05/JAEHYUN-4-900x600.jpeg',
    'Taesan': 'https://kprofiles.com/wp-content/uploads/2023/05/TAESAN-4-900x600.jpeg',
    'Leehan': 'https://kprofiles.com/wp-content/uploads/2023/05/LEEHAN-4-900x600.jpeg',
    'Woonhak': 'https://kprofiles.com/wp-content/uploads/2023/05/WOONHAK-4-533x800.jpeg'
  },

  // 15. BLACKPINK (4 members)
  blackpink: {
    'Jisoo': 'https://kprofiles.com/wp-content/uploads/2016/08/Jisoo-Blackpink-2025.jpg',
    'Jennie': 'https://kprofiles.com/wp-content/uploads/2016/08/Jennie-Blackpink-2025.jpg',
    'Rosé': 'https://kprofiles.com/wp-content/uploads/2016/08/Rose-Blackpink-2025.jpg',
    'Lisa': 'https://kprofiles.com/wp-content/uploads/2016/08/Lisa-Blackpink-2025.jpg'
  },

  // 16. ITZY (5 members)
  itzy: {
    'Yeji': 'https://kprofiles.com/wp-content/uploads/2019/01/YEJI-593x800.png',
    'Lia': 'https://kprofiles.com/wp-content/uploads/2019/01/LIA-593x800.png',
    'Ryujin': 'https://kprofiles.com/wp-content/uploads/2019/01/RYUJIN-593x800.png',
    'Chaeryeong': 'https://kprofiles.com/wp-content/uploads/2019/01/CHAERYEONG-593x800.png',
    'Yuna': 'https://kprofiles.com/wp-content/uploads/2019/01/YUNA-593x800.png'
  },

  // 17. NCT DREAM (7 members)
  'nct-dream': {
    'Mark': 'https://kprofiles.com/wp-content/uploads/2016/09/Mark-12.jpg',
    'Renjun': 'https://kprofiles.com/wp-content/uploads/2016/09/Renjun-11.jpg',
    'Jeno': 'https://kprofiles.com/wp-content/uploads/2016/09/Jeno-12.jpg',
    'Haechan': 'https://kprofiles.com/wp-content/uploads/2016/09/Haechan-13.jpg',
    'Jaemin': 'https://kprofiles.com/wp-content/uploads/2016/09/Jaemin-12.jpg',
    'Chenle': 'https://kprofiles.com/wp-content/uploads/2016/09/Chanle.jpg',
    'Jisung': 'https://kprofiles.com/wp-content/uploads/2016/09/Jisung-10.jpg'
  },

  // 18. TREASURE (10 members)
  treasure: {
    'Choi Hyun-suk': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4120-533x800.jpeg',
    'Jihoon': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4118-534x800.jpeg',
    'Yoshi': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4119-534x800.jpeg',
    'Junkyu': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4125-533x800.jpeg',
    'Yoon Jae-hyuk': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4121-534x800.jpeg',
    'Asahi': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4127-533x800.jpeg',
    'Doyoung': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4123-534x800.jpeg',
    'Haruto': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4122-533x800.jpeg',
    'Park Jeong-woo': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4128-533x800.jpeg',
    'So Jung-hwan': 'https://kprofiles.com/wp-content/uploads/2019/02/IMG_4126-533x800.jpeg'
  },

  // 19. TAEYEON (1 member)
  taeyeon: {
    'TAEYEON': 'https://kprofiles.com/wp-content/uploads/2018/05/TAEYEON-4-560x800.jpg'
  },

  // 20. SUPER JUNIOR (9 members)
  'super-junior': {
    'Leeteuk': 'https://kprofiles.com/wp-content/uploads/2016/07/LEETEUK-1-533x800.jpg',
    'Kim Hee-chul': 'https://kprofiles.com/wp-content/uploads/2016/07/HEECHUL-1-533x800.jpg',
    'Yesung': 'https://kprofiles.com/wp-content/uploads/2016/07/YESUNG-1-533x800.jpg',
    'Shindong': 'https://kprofiles.com/wp-content/uploads/2016/07/SHINDONG-533x800.jpg',
    'Eunhyuk': 'https://kprofiles.com/wp-content/uploads/2016/07/EUNHYUK-533x800.jpg',
    'Siwon': 'https://kprofiles.com/wp-content/uploads/2016/07/SIWON-1-533x800.jpg',
    'Donghae': 'https://kprofiles.com/wp-content/uploads/2016/07/DONGHAE-533x800.jpg',
    'Ryeowook': 'https://kprofiles.com/wp-content/uploads/2016/07/RYEOWOOK-1-533x800.jpg',
    'Kyuhyun': 'https://kprofiles.com/wp-content/uploads/2016/07/KYUHYUN-1-533x800.jpg'
  }
};

const outputDir = path.resolve('public', 'images', 'members');
fs.mkdirSync(outputDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // If file already exists and > 5KB, reuse
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      return resolve({ cached: true, size: fs.statSync(dest).size });
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    if (url.includes('kprofiles.com')) {
      headers['Referer'] = 'https://kprofiles.com/';
    } else if (url.includes('wikimedia.org')) {
      headers['User-Agent'] = 'KSyncBot/1.0 (https://ksync.my; admin@ksync.my)';
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve({ cached: false, size: fs.statSync(dest).size });
      });
      fileStream.on('error', reject);
    });
    req.on('error', reject);
  });
}

function cleanSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function run() {
  console.log('🚀 Starting download of all 120 member portraits into public/images/members/...');
  const allMembers = await db.query('SELECT m.id, m.stage_name, a.slug as artist_slug FROM members m JOIN artists a ON m.artist_id = a.id');
  console.log(`Found ${allMembers.length} members in database.`);

  let downloadedCount = 0;
  let cachedCount = 0;
  let errorCount = 0;

  for (const m of allMembers) {
    const artistSlug = m.artist_slug;
    const stageName = m.stage_name;
    const groupMap = MEMBER_IMAGE_SOURCES[artistSlug];

    if (!groupMap || !groupMap[stageName]) {
      console.warn(`⚠️ No source URL configured for [${artistSlug}] ${stageName}`);
      errorCount++;
      continue;
    }

    const sourceUrl = groupMap[stageName];
    const ext = sourceUrl.includes('.png') ? '.png' : (sourceUrl.includes('.webp') ? '.webp' : '.jpg');
    const memberSlug = cleanSlug(stageName);
    const filename = `${artistSlug}-${memberSlug}${ext}`;
    const destPath = path.join(outputDir, filename);
    const publicUrl = `/images/members/${filename}`;

    try {
      const res = await downloadFile(sourceUrl, destPath);
      if (res.cached) {
        cachedCount++;
      } else {
        downloadedCount++;
        console.log(`✅ [${artistSlug}] ${stageName} -> ${filename} (${(res.size / 1024).toFixed(1)} KB)`);
      }

      // Update SQLite database
      await db.execute('UPDATE members SET photo = ? WHERE id = ?', [publicUrl, m.id]);
    } catch (err) {
      console.error(`❌ Failed downloading [${artistSlug}] ${stageName}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Process Complete!`);
  console.log(`   - Newly downloaded: ${downloadedCount}`);
  console.log(`   - Cached/reused:    ${cachedCount}`);
  console.log(`   - Errors/Missing:   ${errorCount}`);
  console.log(`   - Total Processed:  ${downloadedCount + cachedCount}/${allMembers.length}`);

  process.exit(0);
}

run();
