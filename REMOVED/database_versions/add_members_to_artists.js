// database/add_members_to_artists.js - Add and seed members JSON column in artists table
import db from '../config/database.js';

async function migrate() {
  console.log('--- Migrating `artists` table: Adding `members` JSON column ---');

  // 1. Add column if not exists
  try {
    await db.execute("ALTER TABLE artists ADD COLUMN members TEXT DEFAULT '[]'");
    console.log('✓ Added column `members` to `artists` table');
  } catch (err) {
    if (err.message && (err.message.includes('duplicate column') || err.message.includes('already exists'))) {
      console.log('ℹ Column `members` already exists, proceeding to update data...');
    } else {
      console.warn('Notice when altering table:', err.message);
    }
  }

  // 2. Member data definitions with rich bio
  const txtMembers = [
    {
      stage_name: "Yeonjun",
      birth_name: "Choi Yeon-jun (최연준)",
      group: "TOMORROW X TOGETHER (TXT)",
      position: "Main Rapper, Main Dancer, Vocalist",
      dob: "September 13, 1999",
      zodiac: "Virgo",
      height: "181.5 cm / 5'11\"",
      blood_type: "A",
      mbti: "ENFP",
      nationality: "South Korean",
      years_active: "2019–present",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Soobin",
      birth_name: "Choi Soo-bin (최수빈)",
      group: "TOMORROW X TOGETHER (TXT)",
      position: "Leader, Vocalist, Rapper",
      dob: "December 5, 2000",
      zodiac: "Sagittarius",
      height: "185 cm / 6'1\"",
      blood_type: "A",
      mbti: "ISFP",
      nationality: "South Korean",
      years_active: "2019–present",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Beomgyu",
      birth_name: "Choi Beom-gyu (최범규)",
      group: "TOMORROW X TOGETHER (TXT)",
      position: "Vocalist, Dancer, Rapper, Center, Visual",
      dob: "March 13, 2001",
      zodiac: "Pisces",
      height: "180 cm / 5'11\"",
      blood_type: "AB",
      mbti: "INFJ",
      nationality: "South Korean",
      years_active: "2019–present",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Taehyun",
      birth_name: "Kang Tae-hyun (강태현)",
      group: "TOMORROW X TOGETHER (TXT)",
      position: "Main Vocalist, Dancer",
      dob: "February 5, 2002",
      zodiac: "Aquarius",
      height: "177 cm / 5'10\"",
      blood_type: "A",
      mbti: "ESTP",
      nationality: "South Korean",
      years_active: "2019–present",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "HueningKai",
      birth_name: "Kai Kamal Huening (카이 카말 휴닝)",
      group: "TOMORROW X TOGETHER (TXT)",
      position: "Main Vocalist, Dancer, Maknae",
      dob: "August 14, 2002",
      zodiac: "Leo",
      height: "183 cm / 6'0\"",
      blood_type: "A",
      mbti: "ISTP",
      nationality: "Korean-American",
      years_active: "2019–present",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
    }
  ];

  const seventeenMembers = [
    {
      stage_name: "S.Coups",
      birth_name: "Choi Seung-cheol (최승철)",
      group: "SEVENTEEN",
      position: "Leader, Hip-Hop Team Leader, Rapper",
      dob: "August 8, 1995",
      zodiac: "Leo",
      height: "178 cm",
      blood_type: "AB",
      mbti: "INFP",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Jeonghan",
      birth_name: "Yoon Jeong-han (윤정한)",
      group: "SEVENTEEN",
      position: "Lead Vocalist, Visual",
      dob: "October 4, 1995",
      zodiac: "Libra",
      height: "178 cm",
      blood_type: "B",
      mbti: "ISFJ",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Hoshi",
      birth_name: "Kwon Soon-young (권순영)",
      group: "SEVENTEEN",
      position: "Performance Team Leader, Main Dancer, Vocalist",
      dob: "June 15, 1996",
      zodiac: "Gemini",
      height: "177 cm",
      blood_type: "B",
      mbti: "INFP",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Woozi",
      birth_name: "Lee Ji-hoon (이지훈)",
      group: "SEVENTEEN",
      position: "Vocal Team Leader, Lead Vocalist, Main Producer",
      dob: "November 22, 1996",
      zodiac: "Sagittarius",
      height: "164 cm",
      blood_type: "A",
      mbti: "INFJ",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Mingyu",
      birth_name: "Kim Min-gyu (김민규)",
      group: "SEVENTEEN",
      position: "Lead Rapper, Visual, Face of the Group",
      dob: "April 6, 1997",
      zodiac: "Aries",
      height: "187 cm",
      blood_type: "B",
      mbti: "ENTJ",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"
    }
  ];

  const twiceMembers = [
    {
      stage_name: "Nayeon",
      birth_name: "Im Na-yeon (임나연)",
      group: "TWICE",
      position: "Lead Vocalist, Lead Dancer, Center",
      dob: "September 22, 1995",
      zodiac: "Virgo",
      height: "163 cm",
      blood_type: "A",
      mbti: "ISTP",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Jihyo",
      birth_name: "Park Ji-hyo (박지효)",
      group: "TWICE",
      position: "Leader, Main Vocalist",
      dob: "February 1, 1997",
      zodiac: "Aquarius",
      height: "160 cm",
      blood_type: "O",
      mbti: "ESFP",
      nationality: "South Korean",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Sana",
      birth_name: "Minatozaki Sana (湊崎 紗夏)",
      group: "TWICE",
      position: "Sub Vocalist",
      dob: "December 29, 1996",
      zodiac: "Capricorn",
      height: "163 cm",
      blood_type: "B",
      mbti: "ENFP",
      nationality: "Japanese",
      years_active: "2015–present",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop"
    }
  ];

  const iuBio = [
    {
      stage_name: "IU",
      birth_name: "Lee Ji-eun (이지은)",
      group: "Soloist",
      position: "Singer-Songwriter, Producer, Actress",
      dob: "May 16, 1993",
      zodiac: "Taurus",
      height: "161.8 cm / 5'4\"",
      blood_type: "A",
      mbti: "INFJ",
      nationality: "South Korean",
      years_active: "2008–present",
      photo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop"
    }
  ];

  const enhypenMembers = [
    {
      stage_name: "Jungwon",
      birth_name: "Yang Jung-won (양정원)",
      group: "ENHYPEN",
      position: "Leader, Lead Vocalist, Lead Dancer",
      dob: "February 9, 2004",
      zodiac: "Aquarius",
      height: "175 cm",
      blood_type: "AB",
      mbti: "ISTJ",
      nationality: "South Korean",
      years_active: "2020–present",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Heeseung",
      birth_name: "Lee Hee-seung (이희승)",
      group: "ENHYPEN",
      position: "Main Vocalist, Lead Dancer, Center",
      dob: "October 15, 2001",
      zodiac: "Libra",
      height: "183 cm",
      blood_type: "A",
      mbti: "INFP",
      nationality: "South Korean",
      years_active: "2020–present",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Ni-ki",
      birth_name: "Nishimura Riki (西村力)",
      group: "ENHYPEN",
      position: "Main Dancer, Sub Vocalist, Maknae",
      dob: "December 9, 2005",
      zodiac: "Sagittarius",
      height: "183 cm",
      blood_type: "B",
      mbti: "ESFP",
      nationality: "Japanese",
      years_active: "2020–present",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
    }
  ];

  const iveMembers = [
    {
      stage_name: "An Yujin",
      birth_name: "An Yu-jin (안유진)",
      group: "IVE",
      position: "Leader, Main Vocalist, Lead Dancer",
      dob: "September 1, 2003",
      zodiac: "Virgo",
      height: "173 cm",
      blood_type: "A",
      mbti: "ISTP",
      nationality: "South Korean",
      years_active: "2018–present",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Jang Wonyoung",
      birth_name: "Jang Won-young (장원영)",
      group: "IVE",
      position: "Vocalist, Visual, Center",
      dob: "August 31, 2004",
      zodiac: "Virgo",
      height: "173 cm",
      blood_type: "O",
      mbti: "E***",
      nationality: "South Korean",
      years_active: "2018–present",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"
    }
  ];

  const strayKidsMembers = [
    {
      stage_name: "Bang Chan",
      birth_name: "Christopher Bang (방찬)",
      group: "Stray Kids",
      position: "Leader, Producer, Vocalist, Dancer, Rapper",
      dob: "October 3, 1997",
      zodiac: "Libra",
      height: "171 cm",
      blood_type: "O",
      mbti: "ENFJ",
      nationality: "Korean-Australian",
      years_active: "2017–present",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Felix",
      birth_name: "Felix Lee (이용복)",
      group: "Stray Kids",
      position: "Lead Dancer, Lead Rapper, Visual",
      dob: "September 15, 2000",
      zodiac: "Virgo",
      height: "171 cm",
      blood_type: "AB",
      mbti: "ESFJ",
      nationality: "Korean-Australian",
      years_active: "2017–present",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"
    }
  ];

  const aespaMembers = [
    {
      stage_name: "Karina",
      birth_name: "Yu Ji-min (유지민)",
      group: "aespa",
      position: "Leader, Main Dancer, Lead Rapper, Visual, Face",
      dob: "April 11, 2000",
      zodiac: "Aries",
      height: "167.8 cm",
      blood_type: "B",
      mbti: "ENFP",
      nationality: "South Korean",
      years_active: "2020–present",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"
    },
    {
      stage_name: "Winter",
      birth_name: "Kim Min-jeong (김민정)",
      group: "aespa",
      position: "Lead Vocalist, Lead Dancer, Visual",
      dob: "January 1, 2001",
      zodiac: "Capricorn",
      height: "164 cm",
      blood_type: "A",
      mbti: "ISFJ",
      nationality: "South Korean",
      years_active: "2020–present",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"
    }
  ];

  // 3. Update artists with their members JSON
  const updates = [
    { id: 6, name: "TOMORROW X TOGETHER (TXT)", members: txtMembers },
    { id: 1, name: "SEVENTEEN", members: seventeenMembers },
    { id: 2, name: "TWICE", members: twiceMembers },
    { id: 3, name: "IU (Lee Ji-eun)", members: iuBio },
    { id: 4, name: "ENHYPEN", members: enhypenMembers },
    { id: 5, name: "IVE", members: iveMembers },
    { id: 7, name: "Stray Kids", members: strayKidsMembers },
    { id: 8, name: "aespa", members: aespaMembers }
  ];

  for (const item of updates) {
    const jsonStr = JSON.stringify(item.members);
    await db.execute("UPDATE artists SET members = ? WHERE id = ?", [jsonStr, item.id]);
    console.log(`✓ Updated artist #${item.id} (${item.name}) with ${item.members.length} member biodatas.`);
  }

  console.log('--- Migration completed successfully! Total tables remain 23. ---');
}

migrate().catch(console.error);
