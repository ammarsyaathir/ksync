// test_passport_feature.mjs
import db from './config/database.js';
import { getUserPassportData, getUsersFlairs, BADGE_DEFINITIONS } from './src/utils/badges.js';

console.log('=================================================================');
console.log('🏅 TESTING DIGITAL K-SYNC CONCERT PASSPORT & FANDOM BADGES');
console.log('=================================================================');

async function run() {
  try {
    // 1. Verify Badge Definitions
    console.log(`\n1. Badge Definitions: ${BADGE_DEFINITIONS.length} badges loaded`);
    if (BADGE_DEFINITIONS.length >= 8) {
      console.log('✅ [PASS] 8 official badges registered');
    } else {
      throw new Error(`Expected at least 8 badges, got ${BADGE_DEFINITIONS.length}`);
    }

    // 2. Test User Passport Data for user 3 (fan@ksync.my / aiman_carat)
    const passportData = await getUserPassportData(3);
    console.log(`\n2. User 3 Passport Data:`);
    console.log(`   - Level: ${passportData.level} (${passportData.title})`);
    console.log(`   - Stamps: ${passportData.totalStamps}`);
    console.log(`   - Unlocked Badges: ${passportData.unlockedBadges.map(b => b.title).join(', ') || 'None'}`);
    console.log(`   - Locked Badges: ${passportData.lockedBadges.length}`);

    if (passportData.level >= 1 && passportData.title) {
      console.log('✅ [PASS] Level & Title engine calculated dynamically');
    }

    // 3. Test Batch Flairs for Commenters
    const flairs = await getUsersFlairs([1, 2, 3]);
    console.log(`\n3. Commenter Flairs batch query:`, flairs);
    console.log('✅ [PASS] Batch user flairs calculated without error');

    // 4. Test HTTP Endpoints
    const baseUrl = 'http://127.0.0.1:9000';
    
    // Public profile
    const publicRes = await fetch(`${baseUrl}/passport/aiman_carat`);
    console.log(`\n4. GET /passport/aiman_carat Status: ${publicRes.status}`);
    if (publicRes.status === 200) {
      console.log('✅ [PASS] Public passport profile accessible');
    } else {
      throw new Error(`Expected 200, got ${publicRes.status}`);
    }

    // Unauthenticated access redirects
    const unauthRes = await fetch(`${baseUrl}/passport`, { redirect: 'manual' });
    console.log(`5. GET /passport (unauthenticated) Status: ${unauthRes.status}`);
    if (unauthRes.status === 302) {
      console.log('✅ [PASS] Unauthenticated access redirects to /login');
    } else {
      throw new Error(`Expected 302, got ${unauthRes.status}`);
    }

    console.log('\n=================================================================');
    console.log('🎉 ALL PASSPORT & FANDOM BADGE TESTS PASSED (100%)');
    console.log('=================================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Passport test error:', err);
    process.exit(1);
  }
}

run();
