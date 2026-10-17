-- ==============================================================================
-- K-Sync Malaysia: Full Artist & Idol Biodata Synchronization Script
-- Compatible with Hostinger phpMyAdmin (Database: u476442312_ksync -> Table: artists)
-- Includes:
--   1. SEVENTEEN (All 13 Member Profiles)
--   2. TOMORROW X TOGETHER (TXT - All 5 Member Profiles)
--   3. BTS (All 7 Member Profiles)
-- ==============================================================================

-- 1. Ensure table structure supports korean_name and debut_year
ALTER TABLE `artists` 
  ADD COLUMN IF NOT EXISTS `korean_name` VARCHAR(100) NULL AFTER `name`,
  ADD COLUMN IF NOT EXISTS `debut_year` INT NULL AFTER `agency`;

-- 2. Update SEVENTEEN (ID 1) with 13 Members
UPDATE `artists` SET 
  `name` = 'SEVENTEEN',
  `korean_name` = '세븐틴',
  `group_type` = 'Boy Group',
  `agency` = 'PLEDIS Entertainment',
  `debut_year` = 2015,
  `image_url` = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
  `description` = '13-member South Korean self-producing performance powerhouse boy group.',
  `members` = '[{"stage_name":"S.Coups","birth_name":"Choi Seung-cheol (최승철)","group":"SEVENTEEN","position":"Leader, Hip-Hop Team Leader, Rapper","dob":"August 8, 1995","zodiac":"Leo","height":"178 cm","blood_type":"AB","mbti":"INFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"},{"stage_name":"Jeonghan","birth_name":"Yoon Jeong-han (윤정한)","group":"SEVENTEEN","position":"Lead Vocalist, Visual","dob":"October 4, 1995","zodiac":"Libra","height":"178 cm","blood_type":"B","mbti":"ISFJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300"},{"stage_name":"Joshua","birth_name":"Joshua Hong / Hong Ji-soo (홍지수)","group":"SEVENTEEN","position":"Lead Vocalist, Visual","dob":"December 30, 1995","zodiac":"Capricorn","height":"177 cm","blood_type":"A","mbti":"ENFJ","nationality":"Korean-American","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"},{"stage_name":"Jun","birth_name":"Wen Junhui (文俊辉) / Moon Jun-hwi (문준휘)","group":"SEVENTEEN","position":"Lead Dancer, Sub Vocalist","dob":"June 10, 1996","zodiac":"Gemini","height":"182 cm","blood_type":"B","mbti":"INFP","nationality":"Chinese","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300"},{"stage_name":"Hoshi","birth_name":"Kwon Soon-young (권순영)","group":"SEVENTEEN","position":"Performance Team Leader, Main Dancer, Lead Vocalist","dob":"June 15, 1996","zodiac":"Gemini","height":"177 cm","blood_type":"B","mbti":"INFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300"},{"stage_name":"Wonwoo","birth_name":"Jeon Won-woo (전원우)","group":"SEVENTEEN","position":"Lead Rapper, Sub Vocalist","dob":"July 17, 1996","zodiac":"Cancer","height":"182 cm","blood_type":"A","mbti":"INFJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"},{"stage_name":"Woozi","birth_name":"Lee Ji-hoon (이지훈)","group":"SEVENTEEN","position":"Vocal Team Leader, Lead Vocalist, Main Producer","dob":"November 22, 1996","zodiac":"Sagittarius","height":"164 cm","blood_type":"A","mbti":"INFJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300"},{"stage_name":"DK","birth_name":"Lee Seok-min (이석민)","group":"SEVENTEEN","position":"Main Vocalist","dob":"February 18, 1997","zodiac":"Aquarius","height":"179 cm","blood_type":"O","mbti":"INFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300"},{"stage_name":"Mingyu","birth_name":"Kim Min-gyu (김민규)","group":"SEVENTEEN","position":"Lead Rapper, Visual, Face of the Group","dob":"April 6, 1997","zodiac":"Aries","height":"187 cm","blood_type":"B","mbti":"ENTJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"},{"stage_name":"The8","birth_name":"Xu Minghao (徐明浩) / Seo Myung-ho (서명호)","group":"SEVENTEEN","position":"Lead Dancer, Sub Vocalist, Sub Rapper","dob":"November 7, 1997","zodiac":"Scorpio","height":"178 cm","blood_type":"O","mbti":"INFJ","nationality":"Chinese","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"},{"stage_name":"Seungkwan","birth_name":"Boo Seung-kwan (부승관)","group":"SEVENTEEN","position":"Main Vocalist, Face of the Group","dob":"January 16, 1998","zodiac":"Capricorn","height":"174 cm","blood_type":"B","mbti":"ENFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"},{"stage_name":"Vernon","birth_name":"Hansol Vernon Chwe (최한솔)","group":"SEVENTEEN","position":"Main Rapper, Sub Vocalist, Visual","dob":"February 18, 1998","zodiac":"Aquarius","height":"178 cm","blood_type":"A","mbti":"ENTP","nationality":"Korean-American","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300"},{"stage_name":"Dino","birth_name":"Lee Chan (이찬)","group":"SEVENTEEN","position":"Main Dancer, Sub Vocalist, Sub Rapper, Maknae","dob":"February 11, 1999","zodiac":"Aquarius","height":"174 cm","blood_type":"A","mbti":"ENFJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"}]'
WHERE `id` = 1;

-- 3. Update TXT (ID 6) with 5 Members
UPDATE `artists` SET 
  `name` = 'TOMORROW X TOGETHER (TXT)',
  `korean_name` = '투모로우바이투게더',
  `group_type` = 'Boy Group',
  `agency` = 'BIGHIT MUSIC',
  `debut_year` = 2019,
  `image_url` = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600',
  `description` = 'Gen Z icons 5-member boy group.',
  `members` = '[{"stage_name":"Soobin","birth_name":"Choi Soo-bin (최수빈)","group":"TOMORROW X TOGETHER (TXT)","position":"Leader, Vocalist, Rapper","dob":"December 5, 2000","zodiac":"Sagittarius","height":"185 cm / 6''1\\"","blood_type":"A","mbti":"ISFP","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"},{"stage_name":"Yeonjun","birth_name":"Choi Yeon-jun (최연준)","group":"TOMORROW X TOGETHER (TXT)","position":"Main Rapper, Main Dancer, Vocalist","dob":"September 13, 1999","zodiac":"Virgo","height":"181.5 cm / 5''11\\"","blood_type":"A","mbti":"ENFP","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"},{"stage_name":"Beomgyu","birth_name":"Choi Beom-gyu (최범규)","group":"TOMORROW X TOGETHER (TXT)","position":"Vocalist, Dancer, Rapper, Center, Visual","dob":"March 13, 2001","zodiac":"Pisces","height":"180 cm / 5''11\\"","blood_type":"AB","mbti":"INFJ","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300"},{"stage_name":"Taehyun","birth_name":"Kang Tae-hyun (강태현)","group":"TOMORROW X TOGETHER (TXT)","position":"Main Vocalist, Dancer","dob":"February 5, 2002","zodiac":"Aquarius","height":"177 cm / 5''10\\"","blood_type":"A","mbti":"ESTP","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"},{"stage_name":"HueningKai","birth_name":"Kai Kamal Huening (카이 카말 휴닝)","group":"TOMORROW X TOGETHER (TXT)","position":"Main Vocalist, Dancer, Maknae","dob":"August 14, 2002","zodiac":"Leo","height":"183 cm / 6''0\\"","blood_type":"A","mbti":"ISTP","nationality":"Korean-American","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"}]'
WHERE `id` = 6;

-- 4. Insert or Update BTS (All 7 Members)
INSERT INTO `artists` (`id`, `name`, `korean_name` , `group_type`, `agency`, `debut_year`, `image_url`, `description`, `members`)
VALUES (
  9,
  'BTS (Bangtan Sonyeondan)',
  '방탄소년단',
  'Boy Group',
  'BIGHIT MUSIC / HYBE',
  2013,
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
  'Global 21st century pop icons 7-member boy group.',
  '[{"stage_name":"RM","birth_name":"Kim Nam-joon (김남준)","group":"BTS","position":"Leader, Main Rapper","dob":"September 12, 1994","zodiac":"Virgo","height":"181 cm / 5''11\\"","blood_type":"A","mbti":"ENFP","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"},{"stage_name":"Jin","birth_name":"Kim Seok-jin (김석진)","group":"BTS","position":"Sub Vocalist, Visual","dob":"December 4, 1992","zodiac":"Sagittarius","height":"179 cm / 5''10.5\\"","blood_type":"O","mbti":"INTP","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"},{"stage_name":"SUGA","birth_name":"Min Yoon-gi (민윤기)","group":"BTS","position":"Lead Rapper","dob":"March 9, 1993","zodiac":"Pisces","height":"174 cm / 5''8.5\\"","blood_type":"O","mbti":"ISTP","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300"},{"stage_name":"J-Hope","birth_name":"Jung Ho-seok (정호석)","group":"BTS","position":"Main Dancer, Sub Rapper, Sub Vocalist","dob":"February 18, 1994","zodiac":"Aquarius","height":"177 cm / 5''10\\"","blood_type":"A","mbti":"INFJ","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300"},{"stage_name":"Jimin","birth_name":"Park Ji-min (박지민)","group":"BTS","position":"Main Dancer, Lead Vocalist","dob":"October 13, 1995","zodiac":"Libra","height":"174 cm / 5''8.5\\"","blood_type":"A","mbti":"ESTP","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"},{"stage_name":"V","birth_name":"Kim Tae-hyung (김태형)","group":"BTS","position":"Sub Vocalist, Visual","dob":"December 30, 1995","zodiac":"Capricorn","height":"179 cm / 5''10.5\\"","blood_type":"AB","mbti":"INFP","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"},{"stage_name":"Jungkook","birth_name":"Jeon Jung-kook (전정국)","group":"BTS","position":"Main Vocalist, Lead Dancer, Sub Rapper, Center, Maknae","dob":"September 1, 1997","zodiac":"Virgo","height":"179 cm / 5''10.5\\"","blood_type":"A","mbti":"INTP","nationality":"South Korean","years_active":"2013–present","photo":"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300"}]'
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `korean_name` = VALUES(`korean_name`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `image_url` = VALUES(`image_url`),
  `description` = VALUES(`description`),
  `members` = VALUES(`members`);