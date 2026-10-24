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

INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (1, 'SEVENTEEN', 'seventeen', 'Boy Group', 'PLEDIS Entertainment', 2015, 'CARAT', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg', '13-member South Korean self-producing boy group under PLEDIS Entertainment (HYBE). Divided into Hip-Hop, Vocal, and Performance units. Celebrated for razor-sharp synchronization choreography and mega Malaysian concerts at Axiata Arena Bukit Jalil (Ode to You, Be the Sun) with their fandom CARAT (official colors: Rose Quartz & Serenity).');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (2, 'TWICE', 'twice', 'Girl Group', 'JYP Entertainment', 2015, 'ONCE', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg', 'Renowned 9-member South Korean girl group under JYP Entertainment (Nayeon, Jeongyeon, Momo, Sana, Jihyo, Mina, Dahyun, Chaeyoung, Tzuyu). "The Nation\'s Girl Group" has thrilled Malaysian ONCE with historic sold-out tours at Axiata Arena Bukit Jalil (Twicelights, Ready To Be) with official colors Apricot & Neon Magenta.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (3, 'IU (Lee Ji-eun)', 'iu', 'Soloist', 'EDAM Entertainment', 2008, 'UAENA', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png', 'South Korea\'s premier singer-songwriter and actress under EDAM Entertainment. "The Nation\'s Sweetheart" mesmerized Malaysian UAENAs across two sold-out nights at Axiata Arena Bukit Jalil during her record-setting HEREH World Tour, featuring live acoustic renditions of "Love wins all", "Blueming", and "Celebrity".');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (4, 'ENHYPEN', 'enhypen', 'Boy Group', 'BELIFT LAB', 2020, 'ENGENE', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png', 'Seven-member boy group formed through I-LAND under BELIFT LAB. Renowned for dark vampire fantasy lore and high-octane choreography, selling out Malaysian arena stops on their FATE and WALK THE LINE world tours.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (5, 'IVE', 'ive', 'Girl Group', 'Starship Entertainment', 2021, 'DIVE', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png', '6-member sensation under Starship Entertainment (An Yu-jin, Gaeul, Rei, Jang Won-young, Liz, Leeseo). Swept Rookie of the Year and Song of the Year daesangs with "Love Dive", "I AM", and "Baddie", selling out Axiata Arena Bukit Jalil during their SHOW WHAT I HAVE 1st World Tour for Malaysian DIVE.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (6, 'TOMORROW X TOGETHER (TXT)', 'txt', 'Boy Group', 'BIGHIT MUSIC / HYBE', 2019, 'MOA', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png', '5-member boy group under BIGHIT MUSIC (HYBE) comprising Soobin, Yeonjun, Beomgyu, Taehyun, and HueningKai. Hailed as the "Voice of Gen Z", they have performed unforgettable Malaysian concerts at Axiata Arena Bukit Jalil (ACT : LOVESICK, ACT : SWEET MIRAGE, ACT : PROMISE) with an active community led by MY MOA Union.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (7, 'Stray Kids', 'stray-kids', 'Boy Group', 'JYP Entertainment', 2018, 'STAY', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Stray_Kids_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%281%29.png', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Stray_Kids_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%281%29.png', '8-member self-producing powerhouse under JYP Entertainment (Bang Chan, Lee Know, Changbin, Hyunjin, Han, Felix, Seungmin, I.N). Produced by in-house unit 3RACHA, famous for stadium anthems like "God\'s Menu" and "Chk Chk Boom" during their MANIAC and dominATE world tours at Axiata Arena and National Stadium Bukit Jalil.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (8, 'aespa', 'aespa', 'Girl Group', 'SM Entertainment', 2020, 'MY', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg', 'Futuristic 4-member metaverse girl group under SM Entertainment (Karina, Giselle, Winter, Ningning). Broke global charts with viral anthems "Supernova", "Whiplash", and "Next Level", bringing their spectacular SYNK : PARALLEL LINE live tour to Malaysian MYs at Axiata Arena Bukit Jalil.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (9, 'BTS (Bangtan Sonyeondan)', 'bts', 'Boy Group', 'BIGHIT MUSIC / HYBE', 2013, 'ARMY', 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg', '21st century pop icons (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook) under BIGHIT MUSIC. Multiple Grammy-nominated global phenomenon with deep Malaysian ties dating back to their iconic Red Bullet tour and an active nationwide Malaysian ARMY community that regularly organizes charity and cup sleeve projects.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (10, 'BABYMONSTER', 'babymonster', 'Girl Group', 'YG Entertainment', 2023, 'MONSTIEZ', 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png', 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png', 'YG Entertainment\'s 7-member monster rookie girl group (Ruka, Pharita, Asa, Ahyeon, Rami, Rora, Chiquita). Known for phenomenal live vocals and dynamic hip-hop performances on hits "SHEESH", "BATTER UP", and "DRIP", headlining their Malaysian fan concert debut at Zepp Kuala Lumpur for Malaysian MONSTIEZ.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (12, 'wave to earth', 'wave-to-earth', 'Band', 'Wavy', 2019, 'Plankton', 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg', 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg', '3-member Korean indie jazz-rock sensation under Wavy (Daniel Kim, John Cha, Dong Q). Masterpieces of lo-fi indie melodies like "bad", "seasons", and "love." brought them to sold-out Malaysian showcases at Zepp Kuala Lumpur and Mega Star Arena KL.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (13, 'Young K (DAY6)', 'young-k', 'Band', 'JYP Entertainment', 2015, 'My Day', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/180628_Day6.jpg', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/180628_Day6.jpg', 'Virtuoso bassist, vocalist, and prolific songwriter of DAY6 under JYP Entertainment. Famous for authoring chart-topping hits across K-Pop, Young K held his solo world tour <Letters with notes> and <YOUNGEST> in Kuala Lumpur alongside DAY6\'s sold-out concerts at Mega Star Arena KL for Malaysian My Day.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (14, 'The Rose', 'the-rose', 'Band', 'Windfall', 2017, 'Black Rose', 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Rose_2023.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Rose_2023.jpg', 'Beloved 4-member Korean indie rock band (Woosung, Dojoon, Hajoon, Jaehyeong). Renowned for emotionally resonant anthems like "She\'s In The Rain", "Sour", and "Back To Me", performing sold-out concerts at Mega Star Arena KL on their HEAL Together and DAWN TO DUSK World Tours for Malaysian Black Roses.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (18, 'BOYNEXTDOOR', 'boynextdoor', 'Boy Group', 'KOZ Entertainment', 2023, 'ONEDOOR', 'https://upload.wikimedia.org/wikipedia/commons/0/04/2026-01-16_BOYNEXTDOOR_at_Golden_Disc_Awards_05_%28cropped%29.png', 'https://upload.wikimedia.org/wikipedia/commons/0/04/2026-01-16_BOYNEXTDOOR_at_Golden_Disc_Awards_05_%28cropped%29.png', '6-member boy group under KOZ Entertainment / HYBE (Sungho, Riwoo, Jaehyun, Taesan, Leehan, Woonhak). Produced by ZICO, beloved for relatable charm and catchy tracks like "Nice Guy", "Earth, Wind & Fire", and "One and Only", bringing their KNOCK ON tour to Malaysian ONEDOOR.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (19, 'BLACKPINK', 'blackpink', 'Girl Group', 'YG Entertainment', 2016, 'BLINK', 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png', 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png', 'Global superstar 4-member girl group under YG Entertainment (Jisoo, Jennie, Rosé, Lisa). Made history in Malaysia with their record-breaking BORN PINK World Tour at Bukit Jalil National Stadium, electrifying over 60,000 Malaysian BLINKs in an iconic ocean of pink lightsticks.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (20, 'ITZY', 'itzy', 'Girl Group', 'JYP Entertainment', 2019, 'MIDZY', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/251110_ITZY.png', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/251110_ITZY.png', '5-member powerhouse girl group under JYP Entertainment (Yeji, Lia, Ryujin, Chaeryeong, Yuna). Renowned for crown choreographies and self-love anthems like "WANNABE", "DALLA DALLA", and "Untouchable", headlining multiple Malaysian concerts at Mega Star Arena KL for Malaysian MIDZY.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (21, 'NCT DREAM', 'nct-dream', 'Boy Group', 'SM Entertainment', 2016, 'NCTzen', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/NCT_Dream_at_DREAM%28%29SCAPE_Press_Conference.png', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/NCT_Dream_at_DREAM%28%29SCAPE_Press_Conference.png', '7-member youthful powerhouse under SM Entertainment (Mark, Renjun, Jeno, Haechan, Jaemin, Chenle, Jisung). Filled Axiata Arena Bukit Jalil with a glowing sea of pearl neon green lightsticks during their sold-out THE DREAM SHOW 2 and THE DREAM SHOW 3: DREAM( )SCAPE tours.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (22, 'TREASURE', 'treasure', 'Boy Group', 'YG Entertainment', 2020, 'TREASURE MAKER (TEUME)', 'https://upload.wikimedia.org/wikipedia/commons/8/8a/230806_%ED%8A%B8%EB%A0%88%EC%A0%80_%28TREASURE%29_SBS_%ED%8C%8C%EC%9B%8CFM_%EB%91%90%EC%8B%9C%ED%83%88%EC%B6%9C_%EC%BB%AC%ED%88%AC%EC%87%BC.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8a/230806_%ED%8A%B8%EB%A0%88%EC%A0%80_%28TREASURE%29_SBS_%ED%8C%8C%EC%9B%8CFM_%EB%91%90%EC%8B%9C%ED%83%88%EC%B6%9C_%EC%BB%AC%ED%88%AC%EC%87%BC.jpg', '10-member high-energy boy group under YG Entertainment. Famous for crowd-shaking hits "JIKJIN", "DARARI", and "BONA BONA", performing massive arena concerts in Malaysia at Malawati Stadium and Axiata Arena for Malaysian Treasure Makers (Teume).');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (23, 'TAEYEON', 'taeyeon', 'Soloist', 'SM Entertainment', 2007, 'SONE', 'https://upload.wikimedia.org/wikipedia/commons/8/80/250307_Taeyeon_%40_-The_Tense-_in_Seoul_Day_1_%2854371295597%29_%28cropped%29.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/80/250307_Taeyeon_%40_-The_Tense-_in_Seoul_Day_1_%2854371295597%29_%28cropped%29.jpg', 'Leader and main vocalist of Girls\' Generation and legendary solo artist under SM Entertainment. Renowned for supreme vocal artistry on masterpieces like "INVU", "Four Seasons", and "To. X", selling out Axiata Arena Bukit Jalil with Malaysian SONEs.');
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`) VALUES (26, 'SUPER JUNIOR', 'super-junior', 'Boy Group', 'SM Entertainment', 2005, 'E.L.F', 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2015_Super_Junior_DSC02998_%2820357930851%29.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2015_Super_Junior_DSC02998_%2820357930851%29.jpg', 'The "Kings of Hallyu" under SM Entertainment (Leeteuk, Heechul, Yesung, Shindong, Eunhyuk, Donghae, Siwon, Ryeowook, Kyuhyun). Pioneers of global K-Pop who have performed historic editions of their signature SUPER SHOW world tour (Super Show 2, 5, 9, and 10) in Malaysia at Axiata Arena Bukit Jalil and Stadium Putra for Malaysian E.L.F.');

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
