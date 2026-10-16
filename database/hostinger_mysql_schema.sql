-- ============================================================================
-- K-Sync Malaysia: Hostinger MySQL Production Schema (Chapter 1 Aligned)
-- Total Tables: 10 Essential Tables
-- Compatible with Hostinger MySQL 8.0 / MariaDB 10.4+ / phpMyAdmin
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+08:00';

-- --------------------------------------------------------
-- 1. Table structure for `roles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`) VALUES 
(1, 'Admin'),
(2, 'Organizer'),
(3, 'Fan');

-- --------------------------------------------------------
-- 2. Table structure for `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL DEFAULT 3,
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
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (1, 1, 'System Admin', 'admin', 'admin@ksync.my', '$2y$10$wuYGFXOF2Pl4N1uhplTJCuxNURWpwYbIpib79nx4TUSwMon.2R2hO', 'Chief Administrator for K-Sync Malaysia.', '', 'ACTIVE', '2026-09-21 09:06:15');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (2, 2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2y$10$wuYGFXOF2Pl4N1uhplTJCuxNURWpwYbIpib79nx4TUSwMon.2R2hO', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', '', 'ACTIVE', '2026-09-21 09:06:15');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (3, 3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2y$10$wuYGFXOF2Pl4N1uhplTJCuxNURWpwYbIpib79nx4TUSwMon.2R2hO', 'Passionate K-Pop fan & SEVENTEEN Carat in KL!', '', 'ACTIVE', '2026-09-21 09:06:15');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (4, 3, 'Ammar Syaathir', 'ammarsyaathir', 'ammarsyaathir@gmail.com', '$2y$10$WMqmlRM9nQ0r7CVQXxl.X.vI/1qph7vg7yZqvvMbl1NN583r3YFF2', '', 'https://lh3.googleusercontent.com/a/ACg8ocLHfb6hc_aXwBT2Xp4IR4yq1yXkDbrXB7Du5yBRoJIY8wHuXZWZ=s96-c', 'ACTIVE', '2026-09-21 09:35:23');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`) VALUES (5, 3, 'Google Test Fan', 'kpopfan_google_test', 'kpopfan_google_test@gmail.com', '$2b$10$jU2vKYEREwrsBHQLUmfj2eBWx3MPgEQ.RAbJPXW8IVApt9BjyO8dS', '', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', 'ACTIVE', '2026-10-16 14:52:53');

-- --------------------------------------------------------
-- 3. Table structure for `artists` (With Idol Member Biodata JSON)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `group_type` VARCHAR(50) DEFAULT 'Boy Group',
  `image_url` VARCHAR(255),
  `agency` VARCHAR(100),
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
  `organizer_id` INT NOT NULL DEFAULT 2,
  `artist_id` INT,
  `category_id` INT NOT NULL,
  `event_name` VARCHAR(200) NOT NULL,
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
  `event_status` VARCHAR(30) DEFAULT 'UPCOMING',
  `verification_status` VARCHAR(30) DEFAULT 'PENDING',
  `rejection_reason` TEXT,
  `tracking_code` VARCHAR(50) UNIQUE,
  `submitter_name` VARCHAR(150),
  `submitter_email` VARCHAR(150),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
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
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
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
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255),
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
