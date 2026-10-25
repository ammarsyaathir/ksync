-- ============================================================================
-- K-SYNC MALAYSIA: COMPLETE PRODUCTION DATABASE SCHEMA & SEED DATA
-- Version: 2.0 (Clean Architecture & Chapter 1/2 Aligned)
-- Compatible with: MySQL 8.0+, MariaDB 10.4+, SQLite 3.35+, phpMyAdmin
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+08:00';

-- ============================================================================
-- 1. TABLE: `users` (RBAC: ADMIN, ORGANIZER, FAN + Verified Fanclub Governance)
-- ============================================================================
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
  `is_verified_organizer` TINYINT(1) DEFAULT 0,
  `verification_proof` VARCHAR(255) DEFAULT NULL,
  `verification_notes` TEXT DEFAULT NULL,
  `buddy_preference` VARCHAR(50) DEFAULT 'ANY',
  `location` VARCHAR(100) DEFAULT 'Kuala Lumpur',
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  `notify_event_updates` TINYINT(1) DEFAULT 1,
  `notify_countdown_reminders` TINYINT(1) DEFAULT 1,
  `notify_discussion_replies` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Realistic Seed Users (Default password for all test accounts: 'password123')
INSERT INTO `users` (`id`, `role`, `full_name`, `username`, `email`, `password_hash`, `bio`, `organization_name`, `organization_type`, `is_verified_organizer`, `location`, `status`, `created_at`) VALUES
(1, 'ADMIN', 'System Admin', 'admin', 'admin@ksync.my', '$2b$10$nMaKST9oUz6BKd9Qyh5M9ufJwS.eUjFTgUlpImV2JklR8jvFJtjcu', 'Chief Administrator & Compliance Sentinel for K-Sync Malaysia.', NULL, NULL, 0, 'Kuala Lumpur', 'ACTIVE', '2026-09-01 10:00:00'),
(2, 'ORGANIZER', 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2b$10$OFB/P0kZB9KHXf/Ygx2EO.W81zfiVw.QVtBHD86XtlSsAtIN7d5Dy', 'Official licensed K-Pop concert promoter and showcase producer in Kuala Lumpur.', 'Starline Entertainment Sdn Bhd', 'Promoter', 1, 'Kuala Lumpur', 'ACTIVE', '2026-09-05 14:30:00'),
(3, 'FAN', 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2b$10$XBZtbMFaFExmTqUrbfDF9edXz4JLKa4bsmnojT0vjoVra8lqcgg9i', 'SEVENTEEN Carat & aespa MY based in Bukit Jalil. Concert lightstick enthusiast!', NULL, NULL, 0, 'Bukit Jalil, KL', 'ACTIVE', '2026-09-10 18:20:00'),
(4, 'ORGANIZER', 'MY Carat Union', 'my_carat_union', 'carat@fanclub.my', '$2b$10$OFB/P0kZB9KHXf/Ygx2EO.W81zfiVw.QVtBHD86XtlSsAtIN7d5Dy', 'Official verified Malaysian fanclub union for SEVENTEEN.', 'MY Carat Union Malaysia', 'Fanclub', 1, 'Petaling Jaya', 'ACTIVE', '2026-09-12 11:15:00'),
(5, 'FAN', 'Nurul Blink', 'nurul_blink', 'nurul@gmail.com', '$2b$10$XBZtbMFaFExmTqUrbfDF9edXz4JLKa4bsmnojT0vjoVra8lqcgg9i', 'BLACKPINK & BABYMONSTER stan in Penang. Attended Born Pink KL 2023!', NULL, NULL, 0, 'George Town, Penang', 'ACTIVE', '2026-09-15 09:45:00');

-- ============================================================================
-- 2. TABLE: `event_categories` (Taxonomy & Live Badge Colors)
-- ============================================================================
DROP TABLE IF EXISTS `event_categories`;
CREATE TABLE `event_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `badge_color` VARCHAR(30) DEFAULT 'purple',
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES
(1, 'Concert', 'concert', 'purple', 'Full-scale live musical performances, world arena tours, and stadium stages.'),
(2, 'Fan Meeting', 'fan-meeting', 'pink', 'Interactive stage shows with games, Q&A sessions, soundchecks, and hi-touch.'),
(3, 'Cupsleeve Event', 'cupsleeve-event', 'rose', 'Fanclub cafe gatherings celebrating idol birthdays, debut milestones, and cup sleeve giveaways.'),
(4, 'Birthday Event', 'birthday-event', 'amber', 'Dedicated member birthday celebrations with photo walls and fan project displays.'),
(5, 'Fan Gathering', 'fan-gathering', 'indigo', 'Community meetups, synchronized lightstick testings, and concert ticket buddy sessions.'),
(6, 'Exhibition', 'exhibition', 'cyan', 'Official and fan curated photo exhibitions, costume archives, and gallery pop-ups.'),
(7, 'Pop-up Event', 'pop-up-event', 'emerald', 'Official merchandise pop-up stores, album signing corners, and interactive photo booths.');

-- ============================================================================
-- 3. TABLE: `venues` (Malaysian Arenas & Transit Navigation Guides)
-- ============================================================================
DROP TABLE IF EXISTS `venues`;
CREATE TABLE `venues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `capacity` INT NULL,
  `map_url` VARCHAR(255) NULL,
  `transit_info` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `capacity`, `map_url`, `transit_info`) VALUES
(1, 'Axiata Arena Bukit Jalil', 'Kompleks Sukan Negara, Jalan Barat, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 16000, 'https://maps.google.com/?q=Axiata+Arena+Bukit+Jalil', 'LRT Sri Petaling Line (Bukit Jalil PH5). 5-minute sheltered pedestrian skybridge directly to Gate A & B.'),
(2, 'National Stadium Bukit Jalil', 'Jalan Barat, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 87000, 'https://maps.google.com/?q=National+Stadium+Bukit+Jalil', 'LRT Sri Petaling Line (Bukit Jalil PH5). Direct access through covered Olympic plaza. RapidKL event express buses operate on concert nights.'),
(3, 'Zepp Kuala Lumpur', 'Level B2 Entertainment Hub, BBCC, 2 Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 2500, 'https://maps.google.com/?q=Zepp+Kuala+Lumpur', 'Direct indoor interchange from Hang Tuah station (LRT Ampang/Sri Petaling & KL Monorail) via LaLaport BBCC Lower Ground.'),
(4, 'Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza Level 4, Jalan Sultan Ismail, Bukit Bintang', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 5000, 'https://maps.google.com/?q=Mega+Star+Arena+Kuala+Lumpur', 'Underground pedestrian link from MRT Bukit Bintang (KG18A Exit C) and KL Monorail Bukit Bintang.');

-- ============================================================================
-- 4. TABLE: `artists` (Top Official Malaysia K-Pop Artists)
-- ============================================================================
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `korean_name` VARCHAR(100) DEFAULT NULL,
  `group_type` VARCHAR(50) DEFAULT 'Boy Group',
  `agency` VARCHAR(100),
  `debut_year` INT DEFAULT NULL,
  `fandom_name` VARCHAR(100) DEFAULT NULL,
  `image_url` VARCHAR(255),
  `header_image` VARCHAR(255),
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `artists` (`id`, `name`, `slug`, `korean_name`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES
(1, 'SEVENTEEN', 'seventeen', '세븐틴', 'Boy Group', 'PLEDIS Entertainment / HYBE', 2015, 'CARAT', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg', '13-member South Korean self-producing boy group under PLEDIS Entertainment. Celebrated for razor-sharp synchronized choreography at Axiata Arena Bukit Jalil with their fandom CARAT.'),
(2, 'TWICE', 'twice', '트와이스', 'Girl Group', 'JYP Entertainment', 2015, 'ONCE', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg', 'Renowned 9-member South Korean girl group under JYP Entertainment. The Nations Girl Group has thrilled Malaysian ONCE with historic sold-out tours Ready To Be at Axiata Arena.'),
(3, 'IU (Lee Ji-eun)', 'iu', '아이유', 'Soloist', 'EDAM Entertainment', 2008, 'UAENA', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png', 'South Koreas premier singer-songwriter and actress. Mesmerized Malaysian UAENAs across two sold-out nights at Axiata Arena Bukit Jalil during her record-setting HEREH World Tour.'),
(4, 'ENHYPEN', 'enhypen', '엔하이픈', 'Boy Group', 'BELIFT LAB / HYBE', 2020, 'ENGENE', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png', '7-member powerhouse under BELIFT LAB. Renowned for dark fantasy storylines and powerful choreography, selling out arena stops on their FATE and WALK THE LINE world tours.'),
(5, 'IVE', 'ive', '아이브', 'Girl Group', 'Starship Entertainment', 2021, 'DIVE', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png', '6-member sensation under Starship Entertainment (An Yu-jin, Jang Won-young, Rei, Gaeul, Liz, Leeseo). Swept daesangs with Love Dive, I AM, and Baddie, performing for Malaysian DIVE at Axiata Arena.'),
(6, 'TOMORROW X TOGETHER (TXT)', 'txt', '투모로우바이투게더', 'Boy Group', 'BIGHIT MUSIC / HYBE', 2019, 'MOA', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png', '5-member group under BIGHIT MUSIC (Soobin, Yeonjun, Beomgyu, Taehyun, HueningKai). The Voice of Gen Z has performed unforgettable concerts in KL on their ACT : PROMISE World Tour.'),
(7, 'aespa', 'aespa', '에스파', 'Girl Group', 'SM Entertainment', 2020, 'MY', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg', 'Futuristic 4-member metaverse girl group under SM Entertainment (Karina, Giselle, Winter, Ningning). Broke global charts with viral anthems Supernova and Whiplash, headlining at Axiata Arena Bukit Jalil.');

-- ============================================================================
-- 5. TABLE: `members` (Normalized Idol Biodata & Lineup)
-- ============================================================================
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `artist_id` INT NOT NULL,
  `stage_name` VARCHAR(100) NOT NULL,
  `birth_name` VARCHAR(150) DEFAULT NULL,
  `position` VARCHAR(200) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `zodiac` VARCHAR(20) DEFAULT NULL,
  `height_cm` DECIMAL(5,1) DEFAULT NULL,
  `blood_type` VARCHAR(5) DEFAULT NULL,
  `mbti` VARCHAR(20) DEFAULT NULL,
  `nationality` VARCHAR(50) DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `photo`, `sort_order`) VALUES
(1, 'S.Coups', 'Choi Seung-cheol (최승철)', 'Leader, Hip-Hop Team Leader, Rapper', '1995-08-08', 'Leo', 178.0, 'AB', 'INFP', 'South Korean', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 1),
(1, 'Jeonghan', 'Yoon Jeong-han (윤정한)', 'Lead Vocalist, Visual', '1995-10-04', 'Libra', 178.0, 'B', 'ISFJ', 'South Korean', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300', 2),
(1, 'Hoshi', 'Kwon Soon-young (권순영)', 'Performance Leader, Main Dancer, Vocalist', '1996-06-15', 'Gemini', 177.0, 'B', 'INFP', 'South Korean', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', 3),
(5, 'An Yujin', 'An Yu-jin (안유진)', 'Leader, Main Vocalist, Lead Dancer', '2003-09-01', 'Virgo', 173.0, 'A', 'ISTP', 'South Korean', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', 1),
(5, 'Jang Wonyoung', 'Jang Won-young (장원영)', 'Vocalist, Visual, Center', '2004-08-31', 'Virgo', 173.0, 'O', 'ENTP', 'South Korean', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', 2),
(6, 'Yeonjun', 'Choi Yeon-jun (최연준)', 'Main Rapper, Main Dancer, Vocalist', '1999-09-13', 'Virgo', 181.5, 'A', 'ENFP', 'South Korean', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 1),
(6, 'Soobin', 'Choi Soo-bin (최수빈)', 'Leader, Vocalist, Rapper', '2000-12-05', 'Sagittarius', 185.0, 'A', 'ISFP', 'South Korean', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300', 2),
(7, 'Karina', 'Yu Ji-min (유지민)', 'Leader, Main Dancer, Lead Rapper, Center', '2000-04-11', 'Aries', 167.8, 'B', 'ENFP', 'South Korean', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', 1),
(7, 'Winter', 'Kim Min-jeong (김민정)', 'Main Vocalist, Lead Dancer, Visual', '2001-01-01', 'Capricorn', 164.0, 'A', 'ISFJ', 'South Korean', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', 2);

-- ============================================================================
-- 6. TABLE: `events` (Central Event Registry & Verification State)
-- ============================================================================
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organizer_id` INT NULL,
  `venue_id` INT NULL,
  `category_id` INT NOT NULL,
  `artist_id` INT NULL,
  `event_name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) UNIQUE NOT NULL,
  `description` TEXT,
  `event_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME,
  `venue_name` VARCHAR(150) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `cluster_area` VARCHAR(100) DEFAULT 'Kuala Lumpur Metro Hub',
  `ticket_info` TEXT,
  `event_rules` TEXT,
  `official_url` VARCHAR(255),
  `poster_image` VARCHAR(255),
  `gallery_images` LONGTEXT NULL,
  `event_status` VARCHAR(30) DEFAULT 'UPCOMING',
  `verification_status` VARCHAR(30) DEFAULT 'VERIFIED',
  `trust_level` VARCHAR(30) DEFAULT 'OFFICIAL_VERIFIED',
  `tracking_code` VARCHAR(50) UNIQUE,
  `submitter_name` VARCHAR(150),
  `submitter_email` VARCHAR(150),
  `evidence_link` VARCHAR(255),
  `organizer_name` VARCHAR(150),
  `organizer_type` VARCHAR(50) DEFAULT 'Promoter',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`id`, `organizer_id`, `venue_id`, `category_id`, `artist_id`, `event_name`, `slug`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `cluster_area`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `trust_level`, `tracking_code`, `submitter_name`, `submitter_email`, `organizer_name`) VALUES
(1, 2, 3, 1, 6, 'TXT (TOMORROW X TOGETHER) WORLD TOUR IN KUALA LUMPUR', 'txt-world-tour-in-kuala-lumpur', 'Experience spectacular live stages, fan chants, and exclusive VIP soundcheck sessions with MOA Malaysia at Zepp KL.', '2026-12-12', '19:30:00', '22:30:00', 'Zepp Kuala Lumpur', 'BBCC, 2 Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'BBCC & Downtown KL', 'VIP Soundcheck: RM888 | Cat 1: RM688 | Cat 2: RM488 | Cat 3: RM288', '1. MOABONG lightsticks permitted.\n2. No DSLR cameras.\n3. Bags under 30x30cm.', 'https://ibighit.com/txt', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'UPCOMING', 'VERIFIED', 'OFFICIAL_VERIFIED', 'KS-2026-TXT001', 'Starline Events Malaysia', 'organizer@ksync.my', 'Starline Entertainment'),
(2, 4, 1, 1, 1, 'SEVENTEEN [FOLLOW AGAIN] TOUR IN KUALA LUMPUR', 'seventeen-follow-again-tour-kuala-lumpur', 'SEVENTEEN returns to Axiata Arena with their full 13-member spectacle and Rose Quartz & Serenity lightstick ocean.', '2026-11-28', '18:00:00', '21:30:00', 'Axiata Arena Bukit Jalil', 'Jalan Barat, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'Bukit Jalil Hub', 'VIP Floor: RM988 | Cat 1: RM788 | Cat 2: RM588 | Cat 3: RM388', '1. CARAT BONG pairing enabled.\n2. Water bottles permitted up to 500ml.', 'https://pledis.co.kr/seventeen', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'UPCOMING', 'VERIFIED', 'OFFICIAL_VERIFIED', 'KS-2026-SVT002', 'MY Carat Union', 'carat@fanclub.my', 'MY Carat Union Malaysia'),
(3, 4, NULL, 3, 1, 'SEVENTEEN 11TH DEBUT ANNIVERSARY CUPSLEEVE & EXHIBITION', 'seventeen-11th-anniversary-cupsleeve-kl', 'Join fellow CARATs at VCR Cafe Bangsar for free cupsleeve kits, photocard trades, and life-size member photo cutouts.', '2026-05-26', '11:00:00', '17:00:00', 'VCR Cafe Bangsar', '31 Jalan Telawi 3, Bangsar', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'Kuala Lumpur Metro Hub', 'Free Admission with purchase of any signature drink.', 'First 100 fans daily receive special anniversary postcard set.', 'https://twitter.com/mycaratunion', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 'UPCOMING', 'VERIFIED', 'COMMUNITY_TRUSTED', 'KS-2026-CUP003', 'MY Carat Union', 'carat@fanclub.my', 'MY Carat Union Malaysia');

-- ============================================================================
-- 7. TABLE: `event_artists` (M:N Junction: Multi-Artist & Festival Lineups)
-- ============================================================================
DROP TABLE IF EXISTS `event_artists`;
CREATE TABLE `event_artists` (
  `event_id` INT NOT NULL,
  `artist_id` INT NOT NULL,
  `performance_order` INT DEFAULT 1,
  PRIMARY KEY (`event_id`, `artist_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_artists` (`event_id`, `artist_id`, `performance_order`) VALUES
(1, 6, 1),
(2, 1, 1),
(3, 1, 1);

-- ============================================================================
-- 8. TABLE: `saved_events` (Fan Bookmarks & Wishlist)
-- ============================================================================
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

INSERT INTO `saved_events` (`user_id`, `event_id`, `saved_at`) VALUES
(3, 1, '2026-10-18 10:15:00'),
(3, 2, '2026-10-18 10:16:00'),
(5, 2, '2026-10-19 14:22:00');

-- ============================================================================
-- 9. TABLE: `event_chat_messages` (Threaded Discussion Forum & Q&A)
-- ============================================================================
DROP TABLE IF EXISTS `event_chat_messages`;
CREATE TABLE `event_chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_id` INT DEFAULT NULL,
  `message` TEXT NOT NULL,
  `is_organizer` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `event_chat_messages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `parent_id`, `message`, `is_organizer`, `created_at`) VALUES
(1, 1, 3, NULL, 'Hello fellow MOAs! Who is queued up for VIP Soundcheck at Zepp KL?', 0, '2026-10-20 12:00:00'),
(2, 1, 2, 1, 'Official announcement: VIP wristband collection starts at 2:00 PM at Entrance B!', 1, '2026-10-20 12:15:00');

-- ============================================================================
-- 10. TABLE: `event_recommendations` (UC018 Crowdsourced Anti-Scalper Reliability)
-- ============================================================================
DROP TABLE IF EXISTS `event_recommendations`;
CREATE TABLE `event_recommendations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `vote_type` VARCHAR(10) DEFAULT 'UP',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_user_event_rec` (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_recommendations` (`user_id`, `event_id`, `vote_type`, `created_at`) VALUES
(3, 1, 'UP', '2026-10-21 08:30:00'),
(5, 1, 'UP', '2026-10-21 09:15:00'),
(3, 2, 'UP', '2026-10-21 09:45:00');

-- ============================================================================
-- 11. TABLE: `event_updates` (Official Organizer Broadcast Bulletins)
-- ============================================================================
DROP TABLE IF EXISTS `event_updates`;
CREATE TABLE `event_updates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `created_by` INT NOT NULL,
  `update_title` VARCHAR(255) NOT NULL,
  `update_description` TEXT,
  `update_type` VARCHAR(50) DEFAULT 'General Announcement',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_updates` (`event_id`, `created_by`, `update_title`, `update_description`, `update_type`, `created_at`) VALUES
(1, 2, 'Transit Advisory: RapidKL Extended Operation', 'LRT Hang Tuah operations will be extended until 12:30 AM on concert night to assist fans returning home.', 'Transit Notice', '2026-10-22 15:00:00'),
(2, 4, 'Fan Project Banner Distribution Guide', 'Official slogan banners will be handed out free at Gate 3 from 1:00 PM to 4:30 PM. Show your CARAT Bong to claim.', 'Fan Project', '2026-10-23 11:30:00');

-- ============================================================================
-- 12. TABLE: `user_passport_stamps` (Fan Digital Concert Attendance Passport)
-- ============================================================================
DROP TABLE IF EXISTS `user_passport_stamps`;
CREATE TABLE `user_passport_stamps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `seat_section` VARCHAR(100) DEFAULT 'General Seated / Standing',
  `attendance_status` VARCHAR(20) DEFAULT 'ATTENDED',
  `fan_review` TEXT NULL,
  `stamped_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_event_stamp` (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_passport_stamps` (`user_id`, `event_id`, `seat_section`, `attendance_status`, `fan_review`, `stamped_at`) VALUES
(3, 1, 'VIP Standing Pen A (Row 3)', 'ATTENDED', 'Incredible energy! The acoustics at Zepp KL were crystal clear and soundcheck was unforgettable.', '2026-10-23 23:00:00');

-- ============================================================================
-- 13. TABLE: `reports` (Community Incident & Scam Moderation Queue)
-- ============================================================================
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `event_id` INT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `evidence_url` VARCHAR(255) DEFAULT NULL,
  `admin_action` VARCHAR(100) DEFAULT NULL,
  `admin_notes` TEXT DEFAULT NULL,
  `resolved_by` INT DEFAULT NULL,
  `resolved_at` DATETIME DEFAULT NULL,
  `status` VARCHAR(30) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reports` (`id`, `user_id`, `event_id`, `reason`, `details`, `evidence_url`, `status`, `created_at`) VALUES
(1, 3, 1, 'SCAM_TICKETS', 'Suspected scalper Telegram bot circulating fake Cat 1 barcodes under unauthorized payment links.', 'https://t.me/fake_kl_kpop_ticket_warning', 'PENDING', '2026-10-24 14:00:00');

-- ============================================================================
-- 14. TABLE: `notifications` (Fan Push & System Alerts)
-- ============================================================================
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

INSERT INTO `notifications` (`user_id`, `event_id`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES
(3, 1, 'Transit Advisory Released', 'Starline Events posted a new transit advisory for TXT World Tour at Zepp KL.', '/events/txt-world-tour-in-kuala-lumpur', 0, '2026-10-25 09:00:00');

-- ============================================================================
-- 15. TABLE: `activity_logs` (Immutable Administrative Forensic Audit Trail)
-- ============================================================================
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `action` VARCHAR(50) NOT NULL,
  `entity_type` VARCHAR(50),
  `entity_id` INT,
  `description` TEXT,
  `ip_address` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activity_logs` (`user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES
(1, 'VERIFY_EVENT', 'events', 1, 'Admin verified official promoter listing and confirmed GoLive ticketing endpoint.', '127.0.0.1', '2026-10-25 10:00:00'),
(1, 'VERIFY_FANCLUB', 'users', 4, 'Granted official [Verified Fanclub] badge to MY Carat Union after verifying ROS document.', '127.0.0.1', '2026-10-25 10:30:00');

SET FOREIGN_KEY_CHECKS = 1;
