// src/utils/badges.js - Fandom Badges & Digital Concert Passport Engine
import db from '../../config/database.js';

export const BADGE_DEFINITIONS = [
  {
    id: 'axiata_veteran',
    title: 'Axiata Arena Veteran',
    description: 'Stamped 2+ concerts at Axiata Arena Bukit Jalil',
    icon: 'fa-landmark-dome',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    category: 'Venue Loyalty'
  },
  {
    id: 'barricade_vip',
    title: 'Barricade VIP',
    description: 'Secured VIP Rock Zone / Soundcheck barricade access',
    icon: 'fa-bolt',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    category: 'Concert Tier'
  },
  {
    id: 'national_stadium',
    title: 'National Stadium Legend',
    description: 'Attended the 87,000-capacity mega stage at National Stadium Bukit Jalil',
    icon: 'fa-crown',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    category: 'Mega Stage'
  },
  {
    id: 'live_hall_hopper',
    title: 'Live Hall Hopper',
    description: 'Experienced intimate live shows at Zepp KL or Mega Star Arena',
    icon: 'fa-guitar',
    color: 'cyan',
    gradient: 'from-cyan-400 to-blue-500',
    category: 'Acoustics'
  },
  {
    id: 'lightstick_sync',
    title: 'Lightstick Synchronizer',
    description: 'Attended multiple verified live tours with official lightsticks',
    icon: 'fa-wand-magic-sparkles',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    category: 'Fandom Spirit'
  },
  {
    id: 'anti_scalper',
    title: 'Anti-Scalper Guardian',
    description: 'Voted on crowdsourced reliability recommendations to protect fans',
    icon: 'fa-shield-halved',
    color: 'emerald',
    gradient: 'from-emerald-400 to-teal-500',
    category: 'Community'
  },
  {
    id: 'community_voice',
    title: 'Top Community Voice',
    description: 'Contributed logistics & transit tips in concert discussions',
    icon: 'fa-comments',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    category: 'Community'
  },
  {
    id: 'stadium_royalty',
    title: 'Stadium Royalty',
    description: 'Concert elite with 4+ official concert stamps across Malaysia',
    icon: 'fa-trophy',
    color: 'yellow',
    gradient: 'from-amber-400 to-yellow-500',
    category: 'Mastery'
  }
];

export async function getUserPassportData(userId) {
  // 1. Fetch stamps with event details
  let stamps = [];
  try {
    stamps = await db.query(`
      SELECT ups.*, e.event_name, e.event_date, e.venue_name, e.city, e.state, e.poster_image,
             a.name as artist_name, a.image_url as artist_image
      FROM user_passport_stamps ups
      JOIN events e ON ups.event_id = e.id
      LEFT JOIN artists a ON e.artist_id = a.id
      WHERE ups.user_id = ?
      ORDER BY e.event_date DESC
    `, [userId]);
  } catch (e) {
    stamps = [];
  }

  // 2. Count metrics for badges
  const totalStamps = stamps.length;

  let axiataCount = 0;
  let hasBarricade = false;
  let hasNationalStadium = false;
  let hasLiveHall = false;

  for (const s of stamps) {
    const venue = (s.venue_name || '').toLowerCase();
    const seat = (s.seat_section || '').toLowerCase();

    if (venue.includes('axiata')) axiataCount++;
    if (venue.includes('national stadium')) hasNationalStadium = true;
    if (venue.includes('zepp') || venue.includes('mega star') || venue.includes('idea live')) hasLiveHall = true;
    if (seat.includes('vip') || seat.includes('rock') || seat.includes('pit') || seat.includes('barricade') || seat.includes('standing')) {
      hasBarricade = true;
    }
  }

  // Check recommendations count
  let recCount = 0;
  try {
    const recRow = await db.getOne("SELECT COUNT(*) as cnt FROM event_recommendations WHERE user_id = ?", [userId]);
    recCount = recRow ? recRow.cnt : 0;
  } catch (e) {}

  // Check discussion comments count
  let chatCount = 0;
  try {
    const chatRow = await db.getOne("SELECT COUNT(*) as cnt FROM event_chat_messages WHERE user_id = ?", [userId]);
    chatCount = chatRow ? chatRow.cnt : 0;
  } catch (e) {}

  // Evaluate badges
  const unlockedBadges = [];
  const lockedBadges = [];

  for (const def of BADGE_DEFINITIONS) {
    let unlocked = false;
    let progress = 0;
    let max = 1;

    switch (def.id) {
      case 'axiata_veteran':
        unlocked = axiataCount >= 2;
        progress = Math.min(axiataCount, 2);
        max = 2;
        break;
      case 'barricade_vip':
        unlocked = hasBarricade;
        progress = hasBarricade ? 1 : 0;
        break;
      case 'national_stadium':
        unlocked = hasNationalStadium;
        progress = hasNationalStadium ? 1 : 0;
        break;
      case 'live_hall_hopper':
        unlocked = hasLiveHall;
        progress = hasLiveHall ? 1 : 0;
        break;
      case 'lightstick_sync':
        unlocked = totalStamps >= 2;
        progress = Math.min(totalStamps, 2);
        max = 2;
        break;
      case 'anti_scalper':
        unlocked = recCount >= 1;
        progress = Math.min(recCount, 1);
        break;
      case 'community_voice':
        unlocked = chatCount >= 2;
        progress = Math.min(chatCount, 2);
        max = 2;
        break;
      case 'stadium_royalty':
        unlocked = totalStamps >= 4;
        progress = Math.min(totalStamps, 4);
        max = 4;
        break;
    }

    if (unlocked) {
      unlockedBadges.push({ ...def, unlocked: true });
    } else {
      lockedBadges.push({ ...def, unlocked: false, progress, max });
    }
  }

  // Level & Title Calculation
  let level = 1;
  let title = 'Fandom Rookie';
  let nextLevelThreshold = 1;

  if (totalStamps >= 6) {
    level = 5;
    title = 'Stadium Royalty';
    nextLevelThreshold = 6;
  } else if (totalStamps >= 4) {
    level = 4;
    title = 'Axiata Veteran';
    nextLevelThreshold = 6;
  } else if (totalStamps >= 2) {
    level = 3;
    title = 'Concert Hopper';
    nextLevelThreshold = 4;
  } else if (totalStamps >= 1) {
    level = 2;
    title = 'Stage Explorer';
    nextLevelThreshold = 2;
  }

  return {
    stamps,
    totalStamps,
    unlockedBadges,
    lockedBadges,
    level,
    title,
    nextLevelThreshold,
    progressPct: Math.min(Math.round((totalStamps / nextLevelThreshold) * 100), 100)
  };
}

export async function getUsersFlairs(userIds) {
  if (!userIds || userIds.length === 0) return {};
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
  if (uniqueIds.length === 0) return {};

  const placeholders = uniqueIds.map(() => '?').join(',');
  const flairs = {};

  try {
    const stampRows = await db.query(`
      SELECT ups.user_id, ups.seat_section, e.venue_name
      FROM user_passport_stamps ups
      JOIN events e ON ups.event_id = e.id
      WHERE ups.user_id IN (${placeholders})
    `, uniqueIds);

    const userStampsMap = new Map();
    for (const r of stampRows) {
      if (!userStampsMap.has(r.user_id)) userStampsMap.set(r.user_id, []);
      userStampsMap.get(r.user_id).push(r);
    }

    for (const uid of uniqueIds) {
      const uStamps = userStampsMap.get(uid) || [];
      const count = uStamps.length;

      let flair = null;
      if (count >= 4) {
        flair = { title: 'Stadium Royalty', icon: 'fa-trophy', color: 'amber', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      } else if (uStamps.some(s => (s.venue_name || '').toLowerCase().includes('axiata') && count >= 2)) {
        flair = { title: 'Axiata Veteran', icon: 'fa-landmark-dome', color: 'purple', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      } else if (uStamps.some(s => /vip|rock|barricade|pit/i.test(s.seat_section || ''))) {
        flair = { title: 'Barricade VIP', icon: 'fa-bolt', color: 'pink', bg: 'bg-pink-100 text-pink-700 border-pink-300' };
      } else if (uStamps.some(s => (s.venue_name || '').toLowerCase().includes('national stadium'))) {
        flair = { title: 'National Stadium Legend', icon: 'fa-crown', color: 'amber', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      } else if (count >= 2) {
        flair = { title: 'Concert Hopper', icon: 'fa-ticket', color: 'cyan', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
      } else if (count === 1) {
        flair = { title: 'Stage Explorer', icon: 'fa-passport', color: 'slate', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
      }

      flairs[uid] = flair;
    }
  } catch (e) {
    console.error('Error calculating user flairs:', e.message);
  }

  return flairs;
}

export default {
  BADGE_DEFINITIONS,
  getUserPassportData,
  getUsersFlairs
};

