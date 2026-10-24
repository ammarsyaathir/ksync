-- ============================================================================
-- K-Sync Malaysia: Hostinger MySQL Production Schema (Chapter 1 Aligned)
-- Total Tables: 11 Essential Tables
-- Compatible with Hostinger MySQL 8.0 / MariaDB 10.4+ / phpMyAdmin
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+08:00';

-- --------------------------------------------------------
-- 1. Table structure for `users` (Simplified direct role: ADMIN, ORGANIZER, FAN)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role` VARCHAR(20) NOT NULL DEFAULT 'FAN',
  `full_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `bio` TEXT,
  `profile_image` VARCHAR(255),
  `organization_name` VARCHAR(150),
  `organization_type` VARCHAR(50) DEFAULT 'Fanclub',
  `social_handle` VARCHAR(50),
  `social_url` VARCHAR(255),
  `location` VARCHAR(100) DEFAULT 'Kuala Lumpur',
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (1, 'ADMIN', 'System Admin', 'admin', 'admin@ksync.my', '$2b$10$nMaKST9oUz6BKd9Qyh5M9ufJwS.eUjFTgUlpImV2JklR8jvFJtjcu', 'Chief Administrator for K-Sync Malaysia.', '', 'ACTIVE', '2026-09-21 09:06:15');
INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (2, 'ORGANIZER', 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2b$10$OFB/P0kZB9KHXf/Ygx2EO.W81zfiVw.QVtBHD86XtlSsAtIN7d5Dy', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', '', 'ACTIVE', '2026-09-21 09:06:15');
INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (3, 'FAN', 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2b$10$XBZtbMFaFExmTqUrbfDF9edXz4JLKa4bsmnojT0vjoVra8lqcgg9i', 'Passionate K-Pop fan & SEVENTEEN Carat in KL!', '', 'ACTIVE', '2026-09-21 09:06:15');
INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (4, 'ADMIN', 'Ammar Syaathir', 'ammarsyaathir', 'ammarsyaathir@gmail.com', '$2b$10$nMaKST9oUz6BKd9Qyh5M9ufJwS.eUjFTgUlpImV2JklR8jvFJtjcu', 'Platform Admin & Lead Developer.', 'https://lh3.googleusercontent.com/a/ACg8ocLHfb6hc_aXwBT2Xp4IR4yq1yXkDbrXB7Du5yBRoJIY8wHuXZWZ=s96-c', 'ACTIVE', '2026-09-21 09:35:23');
INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (5, 'FAN', 'Google Test Fan', 'kpopfan_google_test', 'kpopfan_google_test@gmail.com', '$2b$10$XBZtbMFaFExmTqUrbfDF9edXz4JLKa4bsmnojT0vjoVra8lqcgg9i', '', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', 'ACTIVE', '2026-10-16 14:52:53');

-- --------------------------------------------------------
-- 3. Table structure for `artists` (`members` LONGTEXT is a legacy JSON mirror of the `members` table)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) DEFAULT NULL,
  `korean_name` VARCHAR(100) DEFAULT NULL,
  `group_type` VARCHAR(50) DEFAULT 'Boy Group',
  `agency` VARCHAR(100),
  `debut_year` INT DEFAULT NULL,
  `fandom_name` VARCHAR(100) DEFAULT NULL,
  `image_url` VARCHAR(255),
  `header_image` VARCHAR(255),
  `description` TEXT,
  `members` LONGTEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (1, 'SEVENTEEN', 'Boy Group', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop', 'PLEDIS Entertainment', '13-member South Korean boy group known for self-producing music.', '[{"stage_name":"S.Coups","birth_name":"Choi Seung-cheol (최승철)","group":"SEVENTEEN","position":"Leader, Hip-Hop Team Leader, Rapper","dob":"August 8, 1995","zodiac":"Leo","height":"178 cm","blood_type":"AB","mbti":"INFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"},{"stage_name":"Jeonghan","birth_name":"Yoon Jeong-han (윤정한)","group":"SEVENTEEN","position":"Lead Vocalist, Visual","dob":"October 4, 1995","zodiac":"Libra","height":"178 cm","blood_type":"B","mbti":"ISFJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop"},{"stage_name":"Hoshi","birth_name":"Kwon Soon-young (권순영)","group":"SEVENTEEN","position":"Performance Team Leader, Main Dancer, Vocalist","dob":"June 15, 1996","zodiac":"Gemini","height":"177 cm","blood_type":"B","mbti":"INFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"},{"stage_name":"Woozi","birth_name":"Lee Ji-hoon (이지훈)","group":"SEVENTEEN","position":"Vocal Team Leader, Lead Vocalist, Main Producer","dob":"November 22, 1996","zodiac":"Sagittarius","height":"164 cm","blood_type":"A","mbti":"INFJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop"},{"stage_name":"Mingyu","birth_name":"Kim Min-gyu (김민규)","group":"SEVENTEEN","position":"Lead Rapper, Visual, Face of the Group","dob":"April 6, 1997","zodiac":"Aries","height":"187 cm","blood_type":"B","mbti":"ENTJ","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (2, 'TWICE', 'Girl Group', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop', 'JYP Entertainment', 'Global sensation 9-member South Korean girl group.', '[{"stage_name":"Nayeon","birth_name":"Im Na-yeon (임나연)","group":"TWICE","position":"Lead Vocalist, Lead Dancer, Center","dob":"September 22, 1995","zodiac":"Virgo","height":"163 cm","blood_type":"A","mbti":"ISTP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"},{"stage_name":"Jihyo","birth_name":"Park Ji-hyo (박지효)","group":"TWICE","position":"Leader, Main Vocalist","dob":"February 1, 1997","zodiac":"Aquarius","height":"160 cm","blood_type":"O","mbti":"ESFP","nationality":"South Korean","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"},{"stage_name":"Sana","birth_name":"Minatozaki Sana (湊崎 紗夏)","group":"TWICE","position":"Sub Vocalist","dob":"December 29, 1996","zodiac":"Capricorn","height":"163 cm","blood_type":"B","mbti":"ENFP","nationality":"Japanese","years_active":"2015–present","photo":"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (3, 'IU (Lee Ji-eun)', 'Soloist', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop', 'EDAM Entertainment', 'Renowned South Korean singer-songwriter and actress.', '[{"stage_name":"IU","birth_name":"Lee Ji-eun (이지은)","group":"Soloist","position":"Singer-Songwriter, Producer, Actress","dob":"May 16, 1993","zodiac":"Taurus","height":"161.8 cm / 5\'4\\"","blood_type":"A","mbti":"INFJ","nationality":"South Korean","years_active":"2008–present","photo":"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (4, 'ENHYPEN', 'Boy Group', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop', 'BELIFT LAB', '7-member global powerhouse boy group.', '[{"stage_name":"Jungwon","birth_name":"Yang Jung-won (양정원)","group":"ENHYPEN","position":"Leader, Lead Vocalist, Lead Dancer","dob":"February 9, 2004","zodiac":"Aquarius","height":"175 cm","blood_type":"AB","mbti":"ISTJ","nationality":"South Korean","years_active":"2020–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"},{"stage_name":"Heeseung","birth_name":"Lee Hee-seung (이희승)","group":"ENHYPEN","position":"Main Vocalist, Lead Dancer, Center","dob":"October 15, 2001","zodiac":"Libra","height":"183 cm","blood_type":"A","mbti":"INFP","nationality":"South Korean","years_active":"2020–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"},{"stage_name":"Ni-ki","birth_name":"Nishimura Riki (西村力)","group":"ENHYPEN","position":"Main Dancer, Sub Vocalist, Maknae","dob":"December 9, 2005","zodiac":"Sagittarius","height":"183 cm","blood_type":"B","mbti":"ESFP","nationality":"Japanese","years_active":"2020–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (5, 'IVE', 'Girl Group', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop', 'Starship Entertainment', '6-member chart-topping girl group.', '[{"stage_name":"An Yujin","birth_name":"An Yu-jin (안유진)","group":"IVE","position":"Leader, Main Vocalist, Lead Dancer","dob":"September 1, 2003","zodiac":"Virgo","height":"173 cm","blood_type":"A","mbti":"ISTP","nationality":"South Korean","years_active":"2018–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"},{"stage_name":"Jang Wonyoung","birth_name":"Jang Won-young (장원영)","group":"IVE","position":"Vocalist, Visual, Center","dob":"August 31, 2004","zodiac":"Virgo","height":"173 cm","blood_type":"O","mbti":"E***","nationality":"South Korean","years_active":"2018–present","photo":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (6, 'TOMORROW X TOGETHER (TXT)', 'Boy Group', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop', 'BIGHIT MUSIC', 'Gen Z icons 5-member boy group.', '[{"stage_name":"Yeonjun","birth_name":"Choi Yeon-jun (최연준)","group":"TOMORROW X TOGETHER (TXT)","position":"Main Rapper, Main Dancer, Vocalist","dob":"September 13, 1999","zodiac":"Virgo","height":"181.5 cm / 5\'11\\"","blood_type":"A","mbti":"ENFP","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"},{"stage_name":"Soobin","birth_name":"Choi Soo-bin (최수빈)","group":"TOMORROW X TOGETHER (TXT)","position":"Leader, Vocalist, Rapper","dob":"December 5, 2000","zodiac":"Sagittarius","height":"185 cm / 6\'1\\"","blood_type":"A","mbti":"ISFP","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"},{"stage_name":"Beomgyu","birth_name":"Choi Beom-gyu (최범규)","group":"TOMORROW X TOGETHER (TXT)","position":"Vocalist, Dancer, Rapper, Center, Visual","dob":"March 13, 2001","zodiac":"Pisces","height":"180 cm / 5\'11\\"","blood_type":"AB","mbti":"INFJ","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop"},{"stage_name":"Taehyun","birth_name":"Kang Tae-hyun (강태현)","group":"TOMORROW X TOGETHER (TXT)","position":"Main Vocalist, Dancer","dob":"February 5, 2002","zodiac":"Aquarius","height":"177 cm / 5\'10\\"","blood_type":"A","mbti":"ESTP","nationality":"South Korean","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop"},{"stage_name":"HueningKai","birth_name":"Kai Kamal Huening (카이 카말 휴닝)","group":"TOMORROW X TOGETHER (TXT)","position":"Main Vocalist, Dancer, Maknae","dob":"August 14, 2002","zodiac":"Leo","height":"183 cm / 6\'0\\"","blood_type":"A","mbti":"ISTP","nationality":"Korean-American","years_active":"2019–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (7, 'Stray Kids', 'Boy Group', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop', 'JYP Entertainment', '8-member self-producing powerhouse.', '[{"stage_name":"Bang Chan","birth_name":"Christopher Bang (방찬)","group":"Stray Kids","position":"Leader, Producer, Vocalist, Dancer, Rapper","dob":"October 3, 1997","zodiac":"Libra","height":"171 cm","blood_type":"O","mbti":"ENFJ","nationality":"Korean-Australian","years_active":"2017–present","photo":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"},{"stage_name":"Felix","birth_name":"Felix Lee (이용복)","group":"Stray Kids","position":"Lead Dancer, Lead Rapper, Visual","dob":"September 15, 2000","zodiac":"Virgo","height":"171 cm","blood_type":"AB","mbti":"ESFJ","nationality":"Korean-Australian","years_active":"2017–present","photo":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `members`, `created_at`) VALUES (8, 'aespa', 'Girl Group', 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop', 'SM Entertainment', 'Futuristic 4-member girl group with avatar concept.', '[{"stage_name":"Karina","birth_name":"Yu Ji-min (유지민)","group":"aespa","position":"Leader, Main Dancer, Lead Rapper, Visual, Face","dob":"April 11, 2000","zodiac":"Aries","height":"167.8 cm","blood_type":"B","mbti":"ENFP","nationality":"South Korean","years_active":"2020–present","photo":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"},{"stage_name":"Winter","birth_name":"Kim Min-jeong (김민정)","group":"aespa","position":"Lead Vocalist, Lead Dancer, Visual","dob":"January 1, 2001","zodiac":"Capricorn","height":"164 cm","blood_type":"A","mbti":"ISFJ","nationality":"South Korean","years_active":"2020–present","photo":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop"}]', '2026-09-21 09:06:15');

-- >> GENERATED by perf/gen-schema-members.mjs - do not edit by hand >>
-- Normalised idol biodata: the 11th table, one row per member of the artists above.
-- Regenerate with: node perf/gen-schema-members.mjs
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `artist_id` INT NOT NULL,
  `stage_name` VARCHAR(100) NOT NULL,
  `birth_name` VARCHAR(150) DEFAULT NULL,
  `group_name` VARCHAR(100) DEFAULT NULL,
  `position` VARCHAR(200) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `zodiac` VARCHAR(20) DEFAULT NULL,
  `height_cm` DECIMAL(5,1) DEFAULT NULL,
  `blood_type` VARCHAR(5) DEFAULT NULL,
  `mbti` VARCHAR(20) DEFAULT NULL,
  `nationality` VARCHAR(50) DEFAULT NULL,
  `debut_year` INT DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_members_artist_stage` (`artist_id`, `stage_name`),
  KEY `idx_members_artist` (`artist_id`),
  CONSTRAINT `fk_members_artist` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'S.Coups', 'Choi Seung-cheol (최승철)', 'SEVENTEEN', 'Leader, Hip-Hop Team Leader, Rapper', '1995-08-08', 'Leo', 178, 'AB', 'INFP', 'South Korean', 2015, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'SEVENTEEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jeonghan', 'Yoon Jeong-han (윤정한)', 'SEVENTEEN', 'Lead Vocalist, Visual', '1995-10-04', 'Libra', 178, 'B', 'ISFJ', 'South Korean', 2015, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'SEVENTEEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Hoshi', 'Kwon Soon-young (권순영)', 'SEVENTEEN', 'Performance Team Leader, Main Dancer, Vocalist', '1996-06-15', 'Gemini', 177, 'B', 'INFP', 'South Korean', 2015, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop', 3 FROM `artists` WHERE `name` = 'SEVENTEEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Woozi', 'Lee Ji-hoon (이지훈)', 'SEVENTEEN', 'Vocal Team Leader, Lead Vocalist, Main Producer', '1996-11-22', 'Sagittarius', 164, 'A', 'INFJ', 'South Korean', 2015, 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop', 4 FROM `artists` WHERE `name` = 'SEVENTEEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Mingyu', 'Kim Min-gyu (김민규)', 'SEVENTEEN', 'Lead Rapper, Visual, Face of the Group', '1997-04-06', 'Aries', 187, 'B', 'ENTJ', 'South Korean', 2015, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop', 5 FROM `artists` WHERE `name` = 'SEVENTEEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Nayeon', 'Im Na-yeon (임나연)', 'TWICE', 'Lead Vocalist, Lead Dancer, Center', '1995-09-22', 'Virgo', 163, 'A', 'ISTP', 'South Korean', 2015, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'TWICE';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jihyo', 'Park Ji-hyo (박지효)', 'TWICE', 'Leader, Main Vocalist', '1997-02-01', 'Aquarius', 160, 'O', 'ESFP', 'South Korean', 2015, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'TWICE';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Sana', 'Minatozaki Sana (湊崎 紗夏)', 'TWICE', 'Sub Vocalist', '1996-12-29', 'Capricorn', 163, 'B', 'ENFP', 'Japanese', 2015, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop', 3 FROM `artists` WHERE `name` = 'TWICE';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'IU', 'Lee Ji-eun (이지은)', 'Soloist', 'Singer-Songwriter, Producer, Actress', '1993-05-16', 'Taurus', 161.8, 'A', 'INFJ', 'South Korean', 2008, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'IU (Lee Ji-eun)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jungwon', 'Yang Jung-won (양정원)', 'ENHYPEN', 'Leader, Lead Vocalist, Lead Dancer', '2004-02-09', 'Aquarius', 175, 'AB', 'ISTJ', 'South Korean', 2020, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'ENHYPEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Heeseung', 'Lee Hee-seung (이희승)', 'ENHYPEN', 'Main Vocalist, Lead Dancer, Center', '2001-10-15', 'Libra', 183, 'A', 'INFP', 'South Korean', 2020, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'ENHYPEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Ni-ki', 'Nishimura Riki (西村力)', 'ENHYPEN', 'Main Dancer, Sub Vocalist, Maknae', '2005-12-09', 'Sagittarius', 183, 'B', 'ESFP', 'Japanese', 2020, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop', 3 FROM `artists` WHERE `name` = 'ENHYPEN';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'An Yujin', 'An Yu-jin (안유진)', 'IVE', 'Leader, Main Vocalist, Lead Dancer', '2003-09-01', 'Virgo', 173, 'A', 'ISTP', 'South Korean', 2018, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'IVE';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jang Wonyoung', 'Jang Won-young (장원영)', 'IVE', 'Vocalist, Visual, Center', '2004-08-31', 'Virgo', 173, 'O', 'E***', 'South Korean', 2018, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'IVE';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Yeonjun', 'Choi Yeon-jun (최연준)', 'TOMORROW X TOGETHER (TXT)', 'Main Rapper, Main Dancer, Vocalist', '1999-09-13', 'Virgo', 181.5, 'A', 'ENFP', 'South Korean', 2019, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'TOMORROW X TOGETHER (TXT)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Soobin', 'Choi Soo-bin (최수빈)', 'TOMORROW X TOGETHER (TXT)', 'Leader, Vocalist, Rapper', '2000-12-05', 'Sagittarius', 185, 'A', 'ISFP', 'South Korean', 2019, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'TOMORROW X TOGETHER (TXT)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Beomgyu', 'Choi Beom-gyu (최범규)', 'TOMORROW X TOGETHER (TXT)', 'Vocalist, Dancer, Rapper, Center, Visual', '2001-03-13', 'Pisces', 180, 'AB', 'INFJ', 'South Korean', 2019, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop', 3 FROM `artists` WHERE `name` = 'TOMORROW X TOGETHER (TXT)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Taehyun', 'Kang Tae-hyun (강태현)', 'TOMORROW X TOGETHER (TXT)', 'Main Vocalist, Dancer', '2002-02-05', 'Aquarius', 177, 'A', 'ESTP', 'South Korean', 2019, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop', 4 FROM `artists` WHERE `name` = 'TOMORROW X TOGETHER (TXT)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'HueningKai', 'Kai Kamal Huening (카이 카말 휴닝)', 'TOMORROW X TOGETHER (TXT)', 'Main Vocalist, Dancer, Maknae', '2002-08-14', 'Leo', 183, 'A', 'ISTP', 'Korean-American', 2019, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop', 5 FROM `artists` WHERE `name` = 'TOMORROW X TOGETHER (TXT)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Bang Chan', 'Christopher Bang (방찬)', 'Stray Kids', 'Leader, Producer, Vocalist, Dancer, Rapper', '1997-10-03', 'Libra', 171, 'O', 'ENFJ', 'Korean-Australian', 2017, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'Stray Kids';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Felix', 'Felix Lee (이용복)', 'Stray Kids', 'Lead Dancer, Lead Rapper, Visual', '2000-09-15', 'Virgo', 171, 'AB', 'ESFJ', 'Korean-Australian', 2017, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'Stray Kids';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Karina', 'Yu Ji-min (유지민)', 'aespa', 'Leader, Main Dancer, Lead Rapper, Visual, Face', '2000-04-11', 'Aries', 167.8, 'B', 'ENFP', 'South Korean', 2020, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop', 1 FROM `artists` WHERE `name` = 'aespa';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Winter', 'Kim Min-jeong (김민정)', 'aespa', 'Lead Vocalist, Lead Dancer, Visual', '2001-01-01', 'Capricorn', 164, 'A', 'ISFJ', 'South Korean', 2020, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop', 2 FROM `artists` WHERE `name` = 'aespa';
-- << END GENERATED <<

-- --------------------------------------------------------
-- 4. Table structure for `event_categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `event_categories`;
CREATE TABLE `event_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `badge_color` VARCHAR(30) DEFAULT 'purple',
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (1, 'Concert', 'concert', 'purple', 'Full-scale live musical performances and arena tours.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (2, 'Fan Meeting', 'fan-meeting', 'pink', 'Interactive stage shows with games, Q&A, and live stages.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (3, 'Cupsleeve Event', 'cupsleeve-event', 'rose', 'Fan-organized cafe gatherings celebrating birthdays and anniversaries.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (4, 'Birthday Event', 'birthday-event', 'amber', 'Special birthday celebrations with fan displays and giveaways.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (5, 'Fan Gathering', 'fan-gathering', 'indigo', 'Community meetups and lightstick fan projects.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (6, 'Exhibition', 'exhibition', 'cyan', 'Photo exhibitions, gallery pop-ups, and fan art displays.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (7, 'Pop-up Event', 'pop-up-event', 'emerald', 'Official merchandise pop-up stores and interactive zones.');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES (8, 'Other K-Pop Events', 'other', 'slate', 'Miscellaneous K-Pop community activities and watch parties.');

-- --------------------------------------------------------
-- 5. Table structure for `events` (Central Table with Venue embedded)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organizer_id` INT NULL DEFAULT NULL,
  `artist_id` INT,
  `category_id` INT NOT NULL,
  `event_name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) DEFAULT NULL,
  `description` TEXT,
  `event_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME,
  `venue_name` VARCHAR(150) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `ticket_info` TEXT,
  `event_rules` TEXT,
  `official_url` VARCHAR(255),
  `poster_image` VARCHAR(255),
  `gallery_images` LONGTEXT NULL,
  `event_status` VARCHAR(30) DEFAULT 'UPCOMING',
  `verification_status` VARCHAR(30) DEFAULT 'PENDING',
  `trust_level` VARCHAR(30) DEFAULT 'PENDING',
  `rejection_reason` TEXT,
  `admin_verification_notes` TEXT,
  `tracking_code` VARCHAR(50) UNIQUE,
  `submitter_name` VARCHAR(150),
  `submitter_email` VARCHAR(150),
  `evidence_link` VARCHAR(255),
  `organizer_name` VARCHAR(150),
  `organizer_social_url` VARCHAR(255),
  `organizer_type` VARCHAR(50) DEFAULT 'Fanclub',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `tracking_code`, `submitter_name`, `submitter_email`, `created_at`, `updated_at`) VALUES (1, 2, 6, 1, 'TXT (TOMORROW X TOGETHER) WORLD TOUR IN KUALA LUMPUR', 'BIGHIT MUSIC and Starline Events are thrilled to announce TXT in Kuala Lumpur! Experience spectacular live stages, fan chants, and exclusive soundcheck sessions with MOA Malaysia.', '2026-12-12', '19:30', '22:30', 'Zepp Kuala Lumpur', 'BBCC, 2, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Soundcheck: RM888 | Cat 1: RM688 | Cat 2: RM488 | Cat 3: RM288', '1. MOABONG official lightsticks allowed.
2. No professional DSLRs or telephoto lenses permitted.
3. Soundcheck queue starts at 15:00 at Entrance A.', 'https://ibighit.com/txt', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, 'KS-2026-TXT001', 'Starline Events Malaysia', 'noreply@ksync.my', '2026-10-16 16:41:09', '2026-10-16 16:41:09');

-- --------------------------------------------------------
-- 6. Table structure for `saved_events`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `saved_events`;
CREATE TABLE `saved_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `saved_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_event_unique` (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Table structure for `event_chat_messages` (Event Public Forum & Q&A)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `event_chat_messages`;
CREATE TABLE `event_chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_id` INT DEFAULT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `event_chat_messages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `message`, `created_at`) VALUES (6, 1, 3, 'Hello fellow MOAs! Who is going to VIP Soundcheck at Zepp KL?', '2026-10-16 14:41:09');

-- --------------------------------------------------------
-- 8. Table structure for `reports`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `event_id` INT,
  `report_type` VARCHAR(50) DEFAULT 'EVENT',
  `reason` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `status` VARCHAR(30) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Table structure for `activity_logs` (Administrative Audit Trail)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(50) NOT NULL,
  `target_type` VARCHAR(50),
  `target_id` INT,
  `details` TEXT,
  `ip_address` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Table structure for `notifications`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NULL,
  `title` VARCHAR(150) NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
