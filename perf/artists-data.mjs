/* Full per-member bios for the 9 K-Sync Malaysia artists.
   Field shape matches the existing SEVENTEEN row in the live DB:
   stage_name, birth_name, group, position, dob, zodiac, height,
   blood_type, mbti, nationality, years_active, photo

   Sources:
   - Profile facts (dob, zodiac, height, blood type, MBTI, positions): kprofiles.com
   - izna current line-up (6 members; Yoon Ji-yoon departed 19 Aug 2025): Wikipedia / WAKEONE
   - The Rose member now goes by Taegyeom (legal rename from Lee Jae-hyeong): Vogue SG / Forbes 2026
   - Yesung current legal name is Kim Kang-hoon (born Kim Jong-woon): Wikipedia
   - Super Junior official JP profile (height)

   photo URLs are the real member photos hosted by kprofiles.com (all verified HTTP 200). */

const K = 'https://kprofiles.com/wp-content/uploads/';

const BTS = (name) => 'BTS';

export const ARTIST_OVERRIDES = {
  'BTS (Bangtan Sonyeondan)': {
    members: [
      { stage_name: 'RM', birth_name: 'Kim Nam-joon (김남준)', group: 'BTS', position: 'Leader, Main Rapper', dob: 'September 12, 1994', zodiac: 'Virgo', height: '181 cm', blood_type: 'A', mbti: 'ENTP', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/RM.webp' },
      { stage_name: 'Jin', birth_name: 'Kim Seok-jin (김석진)', group: 'BTS', position: 'Sub-Vocalist, Visual', dob: 'December 4, 1992', zodiac: 'Sagittarius', height: '179.5 cm', blood_type: 'O', mbti: 'INTP', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/Jin.webp' },
      { stage_name: 'SUGA', birth_name: 'Min Yoon-gi (민윤기)', group: 'BTS', position: 'Lead Rapper', dob: 'March 9, 1993', zodiac: 'Pisces', height: '174 cm', blood_type: 'O', mbti: 'ISTP', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/Suga.webp' },
      { stage_name: 'j-hope', birth_name: 'Jung Ho-seok (정호석)', group: 'BTS', position: 'Main Dancer, Sub-Rapper, Sub-Vocalist', dob: 'February 18, 1994', zodiac: 'Aquarius', height: '177 cm', blood_type: 'A', mbti: 'ESFJ', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/j-hope.webp' },
      { stage_name: 'Jimin', birth_name: 'Park Ji-min (박지민)', group: 'BTS', position: 'Main Dancer, Lead Vocalist', dob: 'October 13, 1995', zodiac: 'Libra', height: '174 cm', blood_type: 'A', mbti: 'ESTP', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/Jimin.webp' },
      { stage_name: 'V', birth_name: 'Kim Tae-hyung (김태형)', group: 'BTS', position: 'Sub-Vocalist, Visual', dob: 'December 30, 1995', zodiac: 'Capricorn', height: '179 cm', blood_type: 'AB', mbti: 'ENTP', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/V.webp' },
      { stage_name: 'Jungkook', birth_name: 'Jeon Jeongguk (전정국)', group: 'BTS', position: 'Main Vocalist, Lead Dancer, Sub-Rapper, Center, Maknae', dob: 'September 1, 1997', zodiac: 'Virgo', height: '177 cm', blood_type: 'A', mbti: 'ISFP', nationality: 'South Korean', years_active: '2013–present', photo: K + '2016/04/JungKook.webp' }
    ]
  },
  BABYMONSTER: {
    members: [
      { stage_name: 'Ruka', birth_name: 'Kawai Ruka (河井瑠花)', group: 'BABYMONSTER', position: 'Main Dancer, Main Rapper', dob: 'March 20, 2002', zodiac: 'Pisces', height: '158 cm', blood_type: 'O', mbti: 'ISTJ & ISFP', nationality: 'Japanese', years_active: '2023–present', photo: K + '2022/12/RUKA-3.jpg' },
      { stage_name: 'Pharita', birth_name: 'Pharita Chaikong (ภาริตา ไชยคง)', group: 'BABYMONSTER', position: 'Vocalist', dob: 'August 26, 2005', zodiac: 'Virgo', height: '167 cm', blood_type: 'A', mbti: 'INTP', nationality: 'Thai', years_active: '2023–present', photo: K + '2022/12/PHARITA-4.jpg' },
      { stage_name: 'Asa', birth_name: 'Enami Asa (榎並杏紗)', group: 'BABYMONSTER', position: 'Main Rapper, Vocalist, Dancer', dob: 'April 17, 2006', zodiac: 'Aries', height: '161 cm', blood_type: 'O', mbti: 'INFP', nationality: 'Japanese', years_active: '2023–present', photo: K + '2022/12/ASA-3.jpg' },
      { stage_name: 'Ahyeon', birth_name: 'Jung Ahyeon (정아현)', group: 'BABYMONSTER', position: 'Main Vocalist, Rapper, Dancer, Visual, Center', dob: 'April 11, 2007', zodiac: 'Aries', height: '163 cm', blood_type: 'A', mbti: 'ISTJ', nationality: 'South Korean', years_active: '2023–present', photo: K + '2022/12/AHYEON-4.jpg' },
      { stage_name: 'Rami', birth_name: 'Shin Haram (신하람)', group: 'BABYMONSTER', position: 'Main Vocalist', dob: 'October 17, 2007', zodiac: 'Libra', height: 'TBC', blood_type: 'O', mbti: 'INFJ', nationality: 'South Korean', years_active: '2023–present', photo: K + '2022/12/BABYMONSTER-1st-Full-Album-DRIP-Concept-Photo-documents-5-640x800.jpeg' },
      { stage_name: 'Rora', birth_name: 'Lee Dain (이다인)', group: 'BABYMONSTER', position: 'Lead Vocalist, Visual', dob: 'August 14, 2008', zodiac: 'Leo', height: '167 cm', blood_type: 'A', mbti: 'ENTP', nationality: 'South Korean', years_active: '2023–present', photo: K + '2022/12/RORA-4.jpg' },
      { stage_name: 'Chiquita', birth_name: 'Riracha Phondechaphiphat (ริราชา พรเดชาพิพัฒน์)', group: 'BABYMONSTER', position: 'Vocalist, Dancer, Rapper, Maknae', dob: 'February 17, 2009', zodiac: 'Aquarius', height: '165 cm', blood_type: 'O', mbti: 'ISTP', nationality: 'Thai', years_active: '2023–present', photo: K + '2022/12/CHIQUITA-3.jpg' }
    ]
  },
  izna: {
    description: 'izna is a 6-member girl group under WAKEONE, formed through Mnet\'s I-LAND 2: N/a and produced by Teddy Park, debuted in November 2024. Yoon Ji-yoon left the group in August 2025. Their first concert tour "WHO DAT GIRL?" plays Kuala Lumpur in December 2026.',
    members: [
      { stage_name: 'Mai', birth_name: 'Tomioka Mai (富岡茉衣)', group: 'izna', position: 'Visual', dob: 'October 28, 2004', zodiac: 'Scorpio', height: '167 cm', blood_type: 'TBC', mbti: 'ISTP', nationality: 'Japanese', years_active: '2024–present', photo: K + '2024/07/MAI-3-534x800.jpeg' },
      { stage_name: 'Bang Jeemin', birth_name: 'Bang Jee-min (방지민)', group: 'izna', position: 'Visual, Center', dob: 'May 8, 2005', zodiac: 'Taurus', height: '172.5 cm', blood_type: 'B', mbti: 'INFP', nationality: 'South Korean', years_active: '2024–present', photo: K + '2024/07/BANG-JEEMIN-3-543x800.jpeg' },
      { stage_name: 'Koko', birth_name: 'Narai Koko (楢井瑚々)', group: 'izna', position: 'Main Dancer', dob: 'November 14, 2006', zodiac: 'Scorpio', height: '174 cm', blood_type: 'O', mbti: 'ESFJ', nationality: 'Japanese', years_active: '2024–present', photo: K + '2024/07/KOKO-3-534x800.jpeg' },
      { stage_name: 'Ryu Sarang', birth_name: 'Ryu Sa-rang (류사랑)', group: 'izna', position: 'TBC', dob: 'April 18, 2007', zodiac: 'Aries', height: '162 cm', blood_type: 'O', mbti: 'INFP', nationality: 'South Korean', years_active: '2024–present', photo: K + '2024/07/RYU-SARANG-3-534x800.jpeg' },
      { stage_name: 'Choi Jungeun', birth_name: 'Choi Jung-eun (최정은)', group: 'izna', position: 'Main Vocalist', dob: 'August 4, 2007', zodiac: 'Leo', height: '170 cm', blood_type: 'TBC', mbti: 'INTJ', nationality: 'South Korean', years_active: '2024–present', photo: K + '2024/07/CHOI-JUNGEUN-3-534x800.jpeg' },
      { stage_name: 'Jeong Saebi', birth_name: 'Jeong Sae-bi (정세비)', group: 'izna', position: 'Visual, Maknae', dob: 'January 22, 2008', zodiac: 'Aquarius', height: '172.5 cm', blood_type: 'O', mbti: 'ENFP', nationality: 'South Korean', years_active: '2024–present', photo: K + '2024/07/JEONG-SAEBI-3-900x600.jpeg' }
    ]
  },
  'wave to earth': {
    members: [
      { stage_name: 'Daniel Kim', birth_name: 'Kim Daniel (김다니엘)', group: 'wave to earth', position: 'Guitar, Vocals, Songwriter', dob: 'March 18, 1997', zodiac: 'Pisces', height: '175 cm', blood_type: 'AB', mbti: 'INFJ', nationality: 'South Korean', years_active: '2019–present', photo: K + '2021/07/e2a69d6d9a632e21b55c72a1e9b4a4fbcdd3f0489c4ec7ba58843c30f90aa7b6-640x800.jpg' },
      { stage_name: 'John Cha', birth_name: 'Cha Soonjong (차순종)', group: 'wave to earth', position: 'Bass', dob: 'August 13, 1997', zodiac: 'Leo', height: '170 cm', blood_type: 'AB', mbti: 'ENFJ', nationality: 'South Korean', years_active: '2019–present', photo: K + '2021/07/5457f4ce4b034934b871e22520908cd7388bf1f8c7c00332b925d5d6db4c92f5-641x800.jpg' },
      { stage_name: 'Dong Q', birth_name: 'Shin Donggyu (신동규)', group: 'wave to earth', position: 'Drums', dob: 'January 23, 1998', zodiac: 'Aquarius', height: '170 cm', blood_type: 'TBC', mbti: 'ENFJ', nationality: 'South Korean', years_active: '2019–present', photo: K + '2021/07/b32a17611c0638f6e6a6cd25e2d50165a81a4f392076a50f4566f092c6eb6843-641x800.jpg' }
    ]
  },
  'Young K (DAY6)': {
    members: [
      { stage_name: 'Young K', birth_name: 'Kang Young-hyun (강영현)', group: 'DAY6', position: 'Bass, Vocalist (DAY6); Soloist', dob: 'December 19, 1993', zodiac: 'Sagittarius', height: '180.2 cm', blood_type: 'B', mbti: 'ENTP', nationality: 'South Korean', years_active: '2015–present', photo: K + '2016/07/IMG_1566-533x800.jpeg' }
    ]
  },
  'The Rose': {
    members: [
      { stage_name: 'Woosung', birth_name: 'Kim Woo-sung (김우성)', group: 'The Rose', position: 'Vocals, Guitar', dob: 'February 25, 1993', zodiac: 'Pisces', height: '173 cm', blood_type: 'A', mbti: 'ENTJ', nationality: 'Korean-American', years_active: '2017–present', photo: K + '2017/08/WOOSUNG-1-640x800.jpg' },
      { stage_name: 'Dojoon', birth_name: 'Park Do-joon (박도준)', group: 'The Rose', position: 'Vocals, Guitar, Keyboard', dob: 'April 20, 1993', zodiac: 'Taurus', height: '176 cm', blood_type: 'O', mbti: 'ENFP', nationality: 'South Korean', years_active: '2017–present', photo: K + '2017/08/DOJOON-640x800.jpg' },
      { stage_name: 'Hajoon', birth_name: 'Lee Ha-joon (이하준)', group: 'The Rose', position: 'Drums', dob: 'July 29, 1994', zodiac: 'Leo', height: '178 cm', blood_type: 'AB', mbti: 'INFJ', nationality: 'South Korean', years_active: '2017–present', photo: K + '2017/08/HAJOON-640x800.jpg' },
      { stage_name: 'Taegyeom', birth_name: 'Lee Taegyeom (이태겸), formerly Lee Jae-hyeong', group: 'The Rose', position: 'Bass, Sub-Vocalist, Maknae', dob: 'November 3, 1994', zodiac: 'Scorpio', height: '181 cm', blood_type: 'B', mbti: 'INFJ', nationality: 'South Korean', years_active: '2017–present', photo: K + '2017/08/JAEHYEONG-640x800.jpg' }
    ]
  },
  Yves: {
    members: [
      { stage_name: 'Yves', birth_name: 'Ha Soo-young (하수영)', group: 'LOONA (former)', position: 'Soloist, Vocalist, Dancer', dob: 'May 24, 1997', zodiac: 'Gemini', height: '166 cm', blood_type: 'B', mbti: 'INFJ', nationality: 'South Korean', years_active: '2017–present', photo: K + '2017/05/loona-the-origin-album-0-zero-yves-teaser-photos-v0-jfiz2dslbr7a1-571x800.webp' }
    ]
  },
  'Yesung (SUPER JUNIOR)': {
    members: [
      { stage_name: 'Yesung', birth_name: 'Kim Jong-woon (김종운), legally Kim Kang-hoon (김강훈)', group: 'SUPER JUNIOR', position: 'Main Vocalist', dob: 'August 24, 1984', zodiac: 'Virgo', height: '178 cm', blood_type: 'AB', mbti: 'INFJ', nationality: 'South Korean', years_active: '2005–present', photo: K + '2016/07/YESUNG-1-533x800.jpg' }
    ]
  },
  'Lee Junho (2PM)': {
    members: [
      { stage_name: 'Lee Junho', birth_name: 'Lee Jun-ho (이준호)', group: '2PM', position: 'Main Vocalist, Lead Dancer (2PM); Actor', dob: 'January 25, 1990', zodiac: 'Aquarius', height: '177 cm', blood_type: 'A', mbti: 'INFJ', nationality: 'South Korean', years_active: '2008–present', photo: K + '2016/04/5-Junho-533x800.jpg' }
    ]
  }
};
