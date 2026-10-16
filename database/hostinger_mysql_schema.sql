-- ============================================================================
-- K-Sync Malaysia: Hostinger MySQL / MariaDB Production Schema & Data Dump
-- Compatible with phpMyAdmin, Hostinger MySQL 8.0, MariaDB 10.4+
-- Generated: 2026-10-13
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+08:00';

-- --------------------------------------------------------
-- Table structure for `roles`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `roles`
INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES (1, 'Admin', '2026-09-21 09:06:15');
INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES (2, 'Organizer', '2026-09-21 09:06:15');
INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES (3, 'Fan', '2026-09-21 09:06:15');

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
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
  `verification_proof` TEXT,
  `is_verified_organizer` TINYINT(1) DEFAULT 0,
  `verification_notes` TEXT,
  `location` VARCHAR(100) DEFAULT 'Kuala Lumpur',
  `buddy_preference` VARCHAR(150) DEFAULT 'Looking for event buddy',
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`, `updated_at`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `verification_proof`, `is_verified_organizer`, `verification_notes`, `location`, `buddy_preference`) VALUES (1, 1, 'System Admin', 'admin', 'admin@ksync.my', '$2y$10$wuYGFXOF2Pl4N1uhplTJCuxNURWpwYbIpib79nx4TUSwMon.2R2hO', 'Chief Administrator for K-Sync Malaysia.', NULL, 'ACTIVE', '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, 'Fanclub', NULL, NULL, NULL, 0, NULL, 'Kuala Lumpur', 'Looking for event buddy');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`, `updated_at`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `verification_proof`, `is_verified_organizer`, `verification_notes`, `location`, `buddy_preference`) VALUES (2, 2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2y$10$wuYGFXOF2Pl4N1uhplTJCuxNURWpwYbIpib79nx4TUSwMon.2R2hO', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', NULL, 'ACTIVE', '2026-09-21 09:06:15', '2026-09-21 09:06:15', 'Starline Events Malaysia', 'Concert Organizer', '@starline_my', 'https://x.com/starline_my', NULL, 1, NULL, 'Kuala Lumpur', 'Looking for event buddy');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`, `updated_at`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `verification_proof`, `is_verified_organizer`, `verification_notes`, `location`, `buddy_preference`) VALUES (3, 3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2y$10$wuYGFXOF2Pl4N1uhplTJCuxNURWpwYbIpib79nx4TUSwMon.2R2hO', 'Passionate K-Pop fan & SEVENTEEN Carat in KL!', '', 'ACTIVE', '2026-09-21 09:06:15', '2026-09-21 09:24:12', NULL, 'Fanclub', NULL, NULL, NULL, 0, NULL, 'Kuala Lumpur', 'Looking for event buddy');
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `status`, `created_at`, `updated_at`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `verification_proof`, `is_verified_organizer`, `verification_notes`, `location`, `buddy_preference`) VALUES (4, 3, 'Ammar Syaathir', 'ammarsyaathir', 'ammarsyaathir@gmail.com', '$2y$10$WMqmlRM9nQ0r7CVQXxl.X.vI/1qph7vg7yZqvvMbl1NN583r3YFF2', '', 'https://lh3.googleusercontent.com/a/ACg8ocLHfb6hc_aXwBT2Xp4IR4yq1yXkDbrXB7Du5yBRoJIY8wHuXZWZ=s96-c', 'ACTIVE', '2026-09-21 09:35:23', '2026-09-21 15:28:20', NULL, 'Fanclub', NULL, NULL, NULL, 0, NULL, 'Kuala Lumpur', 'Looking for event buddy');

-- --------------------------------------------------------
-- Table structure for `artists`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `group_type` VARCHAR(50) DEFAULT 'Boy Group',
  `image_url` VARCHAR(255),
  `agency` VARCHAR(100),
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `artists`
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (1, 'SEVENTEEN', 'Boy Group', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop', 'PLEDIS Entertainment', '13-member South Korean boy group known for self-producing music.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (2, 'TWICE', 'Girl Group', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop', 'JYP Entertainment', 'Global sensation 9-member South Korean girl group.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (3, 'IU (Lee Ji-eun)', 'Soloist', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop', 'EDAM Entertainment', 'Renowned South Korean singer-songwriter and actress.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (4, 'ENHYPEN', 'Boy Group', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop', 'BELIFT LAB', '7-member global powerhouse boy group.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (5, 'IVE', 'Girl Group', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop', 'Starship Entertainment', '6-member chart-topping girl group.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (6, 'TOMORROW X TOGETHER (TXT)', 'Boy Group', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop', 'BIGHIT MUSIC', 'Gen Z icons 5-member boy group.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (7, 'Stray Kids', 'Boy Group', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop', 'JYP Entertainment', '8-member self-producing powerhouse.', '2026-09-21 09:06:15');
INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`, `created_at`) VALUES (8, 'aespa', 'Girl Group', 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop', 'SM Entertainment', 'Futuristic 4-member girl group with avatar concept.', '2026-09-21 09:06:15');

-- --------------------------------------------------------
-- Table structure for `event_categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `badge_color` VARCHAR(30) DEFAULT 'purple',
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_categories`
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (1, 'Concert', 'concert', 'purple', 'Full-scale live musical performances and arena tours.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (2, 'Fan Meeting', 'fan-meeting', 'pink', 'Interactive stage shows with games, Q&A, and live stages.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (3, 'Cupsleeve Event', 'cupsleeve-event', 'rose', 'Fan-organized cafe gatherings celebrating birthdays and anniversaries.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (4, 'Birthday Event', 'birthday-event', 'amber', 'Special birthday celebrations with fan displays and giveaways.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (5, 'Fan Gathering', 'fan-gathering', 'indigo', 'Community meetups and lightstick fan projects.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (6, 'Exhibition', 'exhibition', 'cyan', 'Photo exhibitions, gallery pop-ups, and fan art displays.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (7, 'Pop-up Event', 'pop-up-event', 'emerald', 'Official merchandise pop-up stores and interactive zones.', '2026-09-21 09:06:15');
INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`, `created_at`) VALUES (8, 'Other K-Pop Events', 'other', 'slate', 'Miscellaneous K-Pop community activities and watch parties.', '2026-09-21 09:06:15');

-- --------------------------------------------------------
-- Table structure for `venues`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `venues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `map_link` VARCHAR(255),
  `capacity` INT DEFAULT 0,
  `transit_info` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `venues`
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (1, 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Axiata+Arena', 16000, '2026-09-21 09:06:15', 'LRT Sri Petaling Line -> Bukit Jalil Station (5-min covered walkway bridge)');
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (2, 'National Stadium Bukit Jalil', 'Bukit Jalil National Sports Complex', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=National+Stadium+Bukit+Jalil', 87000, '2026-09-21 09:06:15', 'LRT Sri Petaling Line -> Bukit Jalil Station (Direct Gate A walkway)');
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (3, 'Zepp Kuala Lumpur', 'BBCC, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Zepp+Kuala+Lumpur', 2500, '2026-09-21 09:06:15', 'LRT Sri Petaling / Monorail -> Hang Tuah Station (Direct BBCC link bridge)');
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (4, 'Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza, Jalan Sultan Ismail', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Mega+Star+Arena', 5000, '2026-09-21 09:06:15', 'MRT Kajang Line -> Bukit Bintang / Monorail Imbi Station (3-min walk)');
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (5, 'Subang Parade Cafe Zone', 'Jalan SS 16/1, Subang Jaya', 'Subang Jaya', 'Selangor', 'https://maps.google.com/?q=Subang+Parade', 200, '2026-09-21 09:06:15', NULL);
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (6, 'Gurney Paragon Mall Event Hall', 'Persiaran Gurney', 'George Town', 'Penang', 'https://maps.google.com/?q=Gurney+Paragon+Mall', 1500, '2026-09-21 09:06:15', NULL);
INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`, `created_at`, `transit_info`) VALUES (7, 'Mount Austin Cafe Street', 'Taman Mount Austin', 'Johor Bahru', 'Johor', 'https://maps.google.com/?q=Mount+Austin+Johor+Bahru', 150, '2026-09-21 09:06:15', NULL);

-- --------------------------------------------------------
-- Table structure for `events`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organizer_id` INT NOT NULL,
  `artist_id` INT,
  `category_id` INT NOT NULL,
  `venue_id` INT,
  `event_name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `event_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME,
  `venue_name` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
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
  `fan_chant_url` VARCHAR(255),
  `tour_name` VARCHAR(150),
  `promoter_name` VARCHAR(150),
  `country` VARCHAR(100) DEFAULT 'Malaysia',
  `official_ticket_url` VARCHAR(255),
  `official_source_url` VARCHAR(255),
  `agency_announcement_url` VARCHAR(255),
  `multiple_posters` TEXT,
  `promotional_requests` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `events`
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (1, 2, 1, 1, 1, 'SEVENTEEN [RIGHT HERE] WORLD TOUR IN KUALA LUMPUR', 'Global powerhouse SEVENTEEN returns to Malaysia for their massive [RIGHT HERE] World Tour! Experience unmatched energy, spectacular stage production, and 13-member harmony live at Axiata Arena Bukit Jalil.', '2026-11-14', '18:00', '21:30', 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Soundcheck: RM1,088 | CAT 1: RM888 | CAT 2: RM688 | CAT 3: RM488. Tickets available via official partner.', '1. Lightsticks allowed (Carat Bong v2/v3).\\n2. No professional cameras or recording equipment.\\n3. Water bottles under 500ml only.\\n4. Bags larger than A4 size strictly prohibited.', 'https://pledis.co.kr/seventeen-tour-kl', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-5DC99', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (2, 2, 2, 2, 1, 'TWICE 9TH ANNIVERSARY FAN MEETING [ONCE UPON A TIME] IN KL', 'Join TWICE in Kuala Lumpur for an unforgettable anniversary fan meeting featuring games, special stages, interactive Q&A, and exclusive soundcheck for VIP pass holders.', '2026-10-24', '17:00', '20:00', 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Fan Pass: RM799 | Standard Fan Pass: RM499 | Upper Tier: RM299.', '1. Candybong Z lightsticks encouraged.\\n2. Banners must not exceed 40x20cm.\\n3. Respect fellow fans and follow marshal instructions.', 'https://twice.jype.com/fanmeeting-kl', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-D59C8', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (3, 2, 3, 3, 5, 'Uaena Joy: IU 33rd Birthday Cupsleeve & Photo Exhibition', 'A cozy fan-organized cupsleeve event in Subang Jaya celebrating IU! Purchase any drink to receive a custom design cupsleeve, photo cards, mini poster, and sticker pack. Photo gallery wall and photo booth included!', '2026-05-16', '11:00', '18:00', 'Subang Parade Cafe Zone', 'Jalan SS 16/1, Subang Jaya', 'Subang Jaya', 'Selangor', 'Free Admission with drink order (RM 12 - RM 18 per drink).', '1. First 100 fans each day receive early-bird keyring.\\n2. Please dispose of trash responsibly.\\n3. Tag #IU_KL_Birthday on Twitter/X to win prizes.', 'https://twitter.com/malaysia_uaena', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-4DC42', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (4, 2, 6, 2, 3, 'TXT (TOMORROW X TOGETHER) SWEET MIRAGE FAN GATHERING KL', 'An intimate fan gathering celebrating TXT album release with MOA Malaysia! High-definition screening of world tour highlights, random play dance, and exclusive lucky draw prizes.', '2026-12-05', '14:00', '17:30', 'Zepp Kuala Lumpur', 'BBCC, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'MOA Ticket: RM120 (Includes official wristband & photocard set).', '1. MOABONG lightsticks permitted.\\n2. Random Play Dance session starts at 13:00 outside venue lobby.', 'https://txt-moa-malaysia.com', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-473D6', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (5, 2, 5, 1, 2, 'IVE 1ST WORLD TOUR [SHOW WHAT I HAVE] ENCORE IN KL', 'DIVE Malaysia! IVE is bringing their explosive encore concert to National Stadium Bukit Jalil. Don''t miss ELEVEN, LOVE DIVE, AFTER LIKE, and I AM performed live on the grandest stage.', '2026-12-19', '19:30', '22:30', 'National Stadium Bukit Jalil', 'Bukit Jalil National Sports Complex', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Floor: RM988 | CAT 1: RM788 | CAT 2: RM588 | CAT 3: RM388.', '1. Strict identity check at entrance.\\n2. Electronic lightsticks sync available at venue.', 'https://starship-ent.com/ive-tour', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-A2959', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (6, 2, 4, 1, 4, 'ENHYPEN [FATE PLUS] WORLD TOUR IN KUALA LUMPUR', 'ENHYPEN returns with FATE PLUS tour! High energy choreography, vampire aesthetics, and unforgettable fan interaction at Idea Live KL.', '2026-11-28', '18:30', '21:30', 'Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza, Jalan Sultan Ismail', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Soundcheck: RM899 | General Admission: RM599.', '1. Standard concert safety guidelines apply.', 'https://beliftlab.com/enhypen-kl', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-09-21 09:06:15', '2026-09-21 09:06:15', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-C9052', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (7, 2, 6, 1, NULL, 'Info', 'Info\r\nGENERAL INFORMATION  \r\n\r\nCity: Kuala Lumpur\r\n\r\nShow Date (s): 20 March 2027 (Saturday)\r\n\r\nShow Time: 5PM\r\n\r\nVenue Name: Idea Live Arena\r\n\r\nVenue Address: Level 2, 3 Damansara, 3, Jalan SS20/27, Damansara Intan, 47400, Petaling Jaya, Selangor.\r\n\r\nPayment Method: VISA & MASTERCARD CREDIT / DEBIT Card payments are accepted.\r\n\r\nMy Day Membership Presale: \r\n\r\n📆 13 October 2026, 10am - 1pm MYT\r\n\r\n* Please note that you may purchase up to 1 ticket per membership ID.\r\n\r\n \r\n\r\nMastercard Presale:\r\n\r\n📆 13 October 2026, 3pm - 11:59pm MYT\r\n\r\n* Please note that you may purchase up to 2 tickets per order.\r\n\r\n \r\n\r\nLive Nation Presale:\r\n\r\n📆 14 October 2026, 11am - 11:59pm MYT \r\n\r\n* Please note that you may purchase up to 2 tickets per order.\r\n\r\nGeneral On-sale:\r\n\r\n📆 15 October 2026, 11am MYT onwards\r\n\r\n* Please note that you may purchase up to 4 tickets per order.\r\n\r\nIMPORTANT INFORMATION\r\n\r\nThis is an all-seated event. Seated sections are open to ages 6 and above. All minors under 16 must be accompanied by a ticket-bearing legal guardian aged 18 or above.\r\n\r\nActual performance time is based on on-site situations. Show time on your tickets does not indicate VIP check-in and door time; please ensure to visit Live Nation Malaysia official website and socials for VIP time and regulations.\r\n\r\nPlease note that Golive Asia is the only officially authorized ticketing platform.\r\n\r\nPlease note that each presale provides exclusive or priority access to ticket purchases, but seat assignments are not guaranteed to be better than those in the general on-sale.\r\n\r\nPlease follow us on socials @livenation.my for more info on Event Timings and Guidelines.\r\n\r\nThere will be a security check upon entry. Except for mobile phones, all forms of photography, videography, and audio recording devices (including selfie sticks, tripods, etc.) are strictly prohibited from being brought in or used. Any form of live streaming is also strictly forbidden. The promoter has the right to deny entry if you violate regulations and can ask you to seek elsewhere to store items that aren’t allowed entry. Please arrive in advance for the security check to avoid late entry.\r\n\r\nThe promoter Live Nation Malaysia reserves the right to change these terms & conditions at any time and without prior notice.', '2026-10-17', '17:00', '21:00', 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP: RM588 | General Admission: RM288 | Freebie photocard pack included with every ticket.', '1. Fan lightstick synchronization supported.\r\n2. Official merchandise booth opens at 12:00 PM.\r\n3. Respect venue guidelines.', 'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537', 'https://networksites.livenationinternational.com/networksites/bdjegsvo/young-k-kl_vip_1920x1080_horizontal.jpg?format=webp&width=1080&quality=75', 'UPCOMING', 'VERIFIED', NULL, '2026-10-03 05:54:06', '2026-10-03 05:54:06', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-B58C6', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (8, 2, 6, 1, NULL, 'Info', 'Info\r\nGENERAL INFORMATION  \r\n\r\nCity: Kuala Lumpur\r\n\r\nShow Date (s): 20 March 2027 (Saturday)\r\n\r\nShow Time: 5PM\r\n\r\nVenue Name: Idea Live Arena\r\n\r\nVenue Address: Level 2, 3 Damansara, 3, Jalan SS20/27, Damansara Intan, 47400, Petaling Jaya, Selangor.\r\n\r\nPayment Method: VISA & MASTERCARD CREDIT / DEBIT Card payments are accepted.\r\n\r\nMy Day Membership Presale: \r\n\r\n📆 13 October 2026, 10am - 1pm MYT\r\n\r\n* Please note that you may purchase up to 1 ticket per membership ID.\r\n\r\n \r\n\r\nMastercard Presale:\r\n\r\n📆 13 October 2026, 3pm - 11:59pm MYT\r\n\r\n* Please note that you may purchase up to 2 tickets per order.\r\n\r\n \r\n\r\nLive Nation Presale:\r\n\r\n📆 14 October 2026, 11am - 11:59pm MYT \r\n\r\n* Please note that you may purchase up to 2 tickets per order.\r\n\r\nGeneral On-sale:\r\n\r\n📆 15 October 2026, 11am MYT onwards\r\n\r\n* Please note that you may purchase up to 4 tickets per order.\r\n\r\nIMPORTANT INFORMATION\r\n\r\nThis is an all-seated event. Seated sections are open to ages 6 and above. All minors under 16 must be accompanied by a ticket-bearing legal guardian aged 18 or above.\r\n\r\nActual performance time is based on on-site situations. Show time on your tickets does not indicate VIP check-in and door time; please ensure to visit Live Nation Malaysia official website and socials for VIP time and regulations.\r\n\r\nPlease note that Golive Asia is the only officially authorized ticketing platform.\r\n\r\nPlease note that each presale provides exclusive or priority access to ticket purchases, but seat assignments are not guaranteed to be better than those in the general on-sale.\r\n\r\nPlease follow us on socials @livenation.my for more info on Event Timings and Guidelines.\r\n\r\nThere will be a security check upon entry. Except for mobile phones, all forms of photography, videography, and audio recording devices (including selfie sticks, tripods, etc.) are strictly prohibited from being brought in or used. Any form of live streaming is also strictly forbidden. The promoter has the right to deny entry if you violate regulations and can ask you to seek elsewhere to store items that aren’t allowed entry. Please arrive in advance for the security check to avoid late entry.\r\n\r\nThe promoter Live Nation Malaysia reserves the right to change these terms & conditions at any time and without prior notice.', '2026-10-17', '17:00', '21:00', 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP: RM588 | General Admission: RM288 | Freebie photocard pack included with every ticket.', '1. Fan lightstick synchronization supported.\r\n2. Official merchandise booth opens at 12:00 PM.\r\n3. Respect venue guidelines.', 'https://www.livenation.my/event/young-k-solo-tour-youngest-in-kuala-lumpur-kuala-lumpur-tickets-edp1699537', 'https://networksites.livenationinternational.com/networksites/bdjegsvo/young-k-kl_vip_1920x1080_horizontal.jpg?format=webp&width=1080&quality=75', 'UPCOMING', 'VERIFIED', NULL, '2026-10-03 05:54:10', '2026-10-03 05:54:10', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-23420', 'Event Organizer', 'organizer@ksync.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (10, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang', 'Celebratory gathering for TXT comeback', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe', 'Jalan SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://x.com/MOAbasedMY/status/12345678', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'PENDING', NULL, '2026-10-12 19:00:22', '2026-10-12 19:00:22', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-CD6A6', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (11, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang', 'Celebratory gathering for TXT comeback', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe', 'Jalan SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://x.com/MOAbasedMY/status/12345678', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'PENDING', NULL, '2026-10-12 19:00:33', '2026-10-12 19:00:33', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-8E5BA', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (12, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang', 'Celebratory gathering for TXT comeback', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe Zone', 'Jalan SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://x.com/MOAbasedMY/status/12345678', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'PENDING', NULL, '2026-10-12 19:01:09', '2026-10-12 19:01:09', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-07B56', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (13, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang', 'Celebratory gathering for TXT comeback', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe Zone', 'Jalan SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://x.com/MOAbasedMY/status/12345678', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'PENDING', NULL, '2026-10-12 19:01:29', '2026-10-12 19:01:29', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-26025', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (14, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang', 'Celebratory gathering for TXT comeback', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe Zone', 'Jalan SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://x.com/MOAbasedMY/status/12345678', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'PENDING', NULL, '2026-10-12 19:02:54', '2026-10-12 19:02:54', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-F8BAF', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (15, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang', 'Celebratory gathering for TXT comeback', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe Zone', 'Jalan SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://x.com/MOAbasedMY/status/12345678', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'REJECTED', 'Please provide direct cafe reservation confirmation link.', '2026-10-12 19:03:46', '2026-10-12 19:03:46', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-A36F1', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');
INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `venue_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `rejection_reason`, `created_at`, `updated_at`, `fan_chant_url`, `tour_name`, `promoter_name`, `country`, `official_ticket_url`, `official_source_url`, `agency_announcement_url`, `multiple_posters`, `promotional_requests`, `tracking_code`, `submitter_name`, `submitter_email`) VALUES (16, 2, 6, 3, NULL, 'TXT MOA Fan Gathering in Subang (Confirmed)', 'Updated with verified booking proof', '2026-12-10', '14:00', '18:00', 'Subang Parade Cafe Zone', 'SS 16/1', 'Subang Jaya', 'Selangor', '', '', 'https://cafe-subang.com/txt-booking-receipt', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'UPCOMING', 'VERIFIED', NULL, '2026-10-12 19:06:00', '2026-10-12 19:06:00', NULL, NULL, NULL, 'Malaysia', NULL, NULL, NULL, NULL, NULL, 'KS-2026-1F768', 'Nurul Fanclub Admin', 'nurul@moamalaysia.my');

-- --------------------------------------------------------
-- Table structure for `saved_events`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `saved_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `saved_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_event_unique` (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `saved_events`
INSERT INTO `saved_events` (`id`, `user_id`, `event_id`, `saved_at`) VALUES (14, 4, 7, '2026-10-08 17:30:42');
INSERT INTO `saved_events` (`id`, `user_id`, `event_id`, `saved_at`) VALUES (15, 4, 1, '2026-10-08 17:33:54');

-- --------------------------------------------------------
-- Table structure for `event_updates`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_updates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `created_by` INT NOT NULL,
  `update_title` VARCHAR(255) NOT NULL,
  `update_description` TEXT NOT NULL,
  `update_type` VARCHAR(50) DEFAULT 'General Announcement',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_updates`
INSERT INTO `event_updates` (`id`, `event_id`, `created_by`, `update_title`, `update_description`, `update_type`, `created_at`) VALUES (1, 1, 2, 'VIP Soundcheck Schedule Released!', 'Soundcheck queueing starts at 14:00. Doors open at 15:30 for soundcheck session. Please have your ticket barcode ready.', 'General Announcement', '2026-09-21 09:06:15');

-- --------------------------------------------------------
-- Table structure for `notifications`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `update_id` INT,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`update_id`) REFERENCES `event_updates`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `event_verifications`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_verifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `status` VARCHAR(30) NOT NULL,
  `notes` TEXT,
  `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `activity_logs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50),
  `entity_id` INT,
  `description` TEXT,
  `ip_address` VARCHAR(45),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `activity_logs`
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (1, 3, 'USER_LOGIN', 'users', 3, 'User logged in', '::1', '2026-09-21 09:16:10');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (2, 3, 'UPDATE_PROFILE', 'users', 3, 'User updated profile information', '::1', '2026-09-21 09:23:54');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (3, 3, 'UPDATE_PROFILE', 'users', 3, 'User updated profile information', '::1', '2026-09-21 09:24:12');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (4, 4, 'GOOGLE_REGISTER', 'users', 4, 'New Fan registered via Firebase Google Auth', '::1', '2026-09-21 09:35:23');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (5, 4, 'GOOGLE_LOGIN', 'users', 4, 'User logged in via Firebase Google Auth', '::1', '2026-09-21 09:41:37');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (6, 4, 'SAVE_EVENT', 'events', 2, 'User saved event', '::1', '2026-09-21 09:43:26');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (7, 4, 'SAVE_EVENT', 'events', 1, 'User saved event', '::1', '2026-09-21 09:43:31');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (8, 4, 'UNSAVE_EVENT', 'events', 1, 'User removed saved event', '::1', '2026-09-21 09:43:32');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (9, 4, 'SAVE_EVENT', 'events', 3, 'User saved event', '::1', '2026-09-21 09:43:37');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (10, 4, 'UNSAVE_EVENT', 'events', 3, 'User removed saved event', '::1', '2026-09-21 09:43:39');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (11, 4, 'SAVE_EVENT', 'events', 3, 'User saved event', '::1', '2026-09-21 09:43:40');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (12, 4, 'UNSAVE_EVENT', 'events', 3, 'User removed saved event', '::1', '2026-09-21 09:43:41');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (13, 4, 'SAVE_EVENT', 'events', 3, 'User saved event', '::1', '2026-09-21 09:43:42');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (14, 4, 'UNSAVE_EVENT', 'events', 3, 'User removed saved event', '::1', '2026-09-21 09:43:42');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (15, 4, 'UNSAVE_EVENT', 'events', 2, 'User removed saved event', '::1', '2026-09-21 09:43:55');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (16, 4, 'SAVE_EVENT', 'events', 2, 'User saved event', '::1', '2026-09-21 09:43:55');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (17, 4, 'SAVE_EVENT', 'events', 1, 'User saved event', '::1', '2026-09-21 15:15:40');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (18, 4, 'UNSAVE_EVENT', 'events', 1, 'User removed saved event', '::1', '2026-09-21 15:15:41');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (19, 4, 'UPDATE_PROFILE', 'users', 4, 'User updated profile information', '::1', '2026-09-21 15:28:20');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (20, 1, 'USER_LOGIN', 'users', 1, 'User logged in', '::1', '2026-09-21 15:33:31');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (21, 4, 'UNSAVE_EVENT', 'events', 2, 'User removed saved event', '::1', '2026-09-21 16:17:43');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (22, 4, 'SAVE_EVENT', 'events', 3, 'User saved event', '::1', '2026-09-21 16:17:44');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (23, 4, 'UNSAVE_EVENT', 'events', 3, 'User removed saved event', '::1', '2026-09-21 16:17:46');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (24, 4, 'SAVE_EVENT', 'events', 4, 'User saved event', '::1', '2026-09-21 16:18:07');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (25, 4, 'UNSAVE_EVENT', 'events', 4, 'User removed saved event', '::1', '2026-09-21 16:18:08');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (26, 4, 'SAVE_EVENT', 'events', 3, 'User saved event', '::1', '2026-09-21 16:33:19');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (27, 4, 'UNSAVE_EVENT', 'events', 3, 'User removed saved event', '::1', '2026-09-21 16:33:21');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (28, 3, 'SAVE_EVENT', 'events', 5, 'User saved event', '::1', '2026-09-28 04:06:34');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (29, 3, 'UNSAVE_EVENT', 'events', 5, 'User removed saved event', '::1', '2026-09-28 04:06:36');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (30, 2, 'USER_LOGIN', 'users', 2, 'User logged in', '::1', '2026-10-03 05:50:36');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (31, 2, 'SUBMIT_EVENT', 'events', 7, 'Organizer submitted event ''Info'' for admin verification', '::1', '2026-10-03 05:54:06');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (32, 2, 'SUBMIT_EVENT', 'events', 8, 'Organizer submitted event ''Info'' for admin verification', '::1', '2026-10-03 05:54:10');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (33, 4, 'GOOGLE_LOGIN', 'users', 4, 'User logged in via Firebase Google Auth', '::1', '2026-10-06 14:37:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (34, 4, 'CHAT_MESSAGE', 'events', 1, 'Posted message in event #1 group chat', '::1', '2026-10-06 14:37:33');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (35, 3, 'UNSAVE_EVENT', 'events', 2, 'User removed saved event', '::1', '2026-10-07 07:47:46');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (36, 3, 'UNSAVE_EVENT', 'events', 1, 'User removed saved event', '::1', '2026-10-07 07:47:47');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (37, 3, 'USER_LOGOUT', 'users', 3, 'User logged out', '::1', '2026-10-08 15:51:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (38, 4, 'GOOGLE_LOGIN', 'users', 4, 'User logged in via Firebase Google Auth', '::1', '2026-10-08 15:51:51');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (39, 1, 'USER_LOGIN', 'users', 1, 'User logged in', '::1', '2026-10-08 15:55:27');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (40, 2, 'USER_LOGIN', 'users', 2, 'User logged in', '::1', '2026-10-08 16:24:06');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (41, 4, 'SAVE_EVENT', 'events', 7, 'User saved event', '::1', '2026-10-08 17:30:43');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (42, 4, 'SAVE_EVENT', 'events', 1, 'User saved event', '::1', '2026-10-08 17:33:54');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (43, 3, 'USER_LOGIN', 'users', 3, 'User logged in', '::1', '2026-10-08 17:36:52');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (44, 3, 'SAVE_EVENT', 'events', 1, 'User saved event', '::1', '2026-10-08 17:38:49');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (45, 3, 'UNSAVE_EVENT', 'events', 1, 'User removed saved event', '::1', '2026-10-08 17:38:49');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (46, 3, 'SAVE_EVENT', 'events', 1, 'User saved event', '::1', '2026-10-08 17:38:50');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (47, 3, 'UNSAVE_EVENT', 'events', 1, 'User removed saved event', '::1', '2026-10-08 17:38:52');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (48, 4, 'USER_LOGOUT', 'users', 4, 'User logged out', '::1', '2026-10-08 18:27:25');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (49, 4, 'GOOGLE_LOGIN', 'users', 4, 'User logged in via Firebase Google Auth', '::1', '2026-10-08 18:27:45');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (50, 1, 'SAVE_EVENT', 'events', 3, 'User saved event', '::1', '2026-10-11 04:21:39');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (51, 1, 'UNSAVE_EVENT', 'events', 3, 'User removed saved event', '::1', '2026-10-11 04:21:41');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (52, 2, 'SUBMIT_EVENT', 'events', 10, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-CD6A6] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:00:22');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (53, 2, 'SUBMIT_EVENT', 'events', 11, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-8E5BA] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:00:33');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (54, 2, 'SUBMIT_EVENT', 'events', 12, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-07B56] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:01:09');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (55, 2, 'SUBMIT_EVENT', 'events', 13, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-26025] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:01:29');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (56, 2, 'SUBMIT_EVENT', 'events', 14, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-F8BAF] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:02:54');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (57, 2, 'SUBMIT_EVENT', 'events', 15, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-A36F1] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:03:46');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (58, 1, 'USER_LOGIN', 'users', 1, 'User logged in', '::1', '2026-10-12 19:04:06');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (59, 1, 'USER_LOGIN', 'users', 1, 'User logged in', '::1', '2026-10-12 19:04:41');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (60, 1, 'REJECT_EVENT', 'events', 15, 'Admin rejected event #15', '::1', '2026-10-12 19:04:41');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (61, 2, 'SUBMIT_EVENT', 'events', 16, 'Event ''TXT MOA Fan Gathering in Subang'' [Ref: KS-2026-1F768] submitted by Nurul Fanclub Admin (nurul@moamalaysia.my) for admin review', '::1', '2026-10-12 19:06:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (62, 1, 'USER_LOGIN', 'users', 1, 'User logged in', '::1', '2026-10-12 19:06:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (63, NULL, 'REJECT_EVENT', 'events', 16, 'Admin rejected event #16', '::1', '2026-10-12 19:06:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (64, 2, 'RESUBMIT_EVENT', 'events', 16, 'Event ''TXT MOA Fan Gathering in Subang (Confirmed)'' [Ref: KS-2026-1F768] corrected and resubmitted by organizer', '::1', '2026-10-12 19:06:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (65, NULL, 'APPROVE_EVENT', 'events', 16, 'Admin approved event #16 live', '::1', '2026-10-12 19:06:00');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (66, 4, 'GOOGLE_LOGIN', 'users', 4, 'User logged in via Firebase Google Auth', '::1', '2026-10-12 19:08:57');
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `created_at`) VALUES (67, 4, 'USER_LOGOUT', 'users', 4, 'User logged out', '::1', '2026-10-12 19:09:26');

-- --------------------------------------------------------
-- Table structure for `event_reports`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT,
  `report_reason` VARCHAR(100) NOT NULL,
  `report_details` TEXT,
  `organizer_reply` TEXT,
  `status` VARCHAR(20) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_reports`
INSERT INTO `event_reports` (`id`, `event_id`, `user_id`, `report_reason`, `report_details`, `status`, `created_at`, `organizer_reply`) VALUES (1, 7, NULL, 'Fake / Suspicious Link', '', 'PENDING', '2026-10-08 17:01:01', NULL);
INSERT INTO `event_reports` (`id`, `event_id`, `user_id`, `report_reason`, `report_details`, `status`, `created_at`, `organizer_reply`) VALUES (2, 7, NULL, 'Fake / Suspicious Link', '', 'PENDING', '2026-10-08 17:01:05', NULL);
INSERT INTO `event_reports` (`id`, `event_id`, `user_id`, `report_reason`, `report_details`, `status`, `created_at`, `organizer_reply`) VALUES (3, 7, NULL, 'Impersonating Fanclub', '', 'PENDING', '2026-10-08 17:37:24', NULL);

-- --------------------------------------------------------
-- Table structure for `event_chat_messages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `is_organizer` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_chat_messages`
INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `message`, `is_organizer`, `created_at`) VALUES (1, 1, 3, 'Hi everyone! Anyone going to Axiata Arena from Subang Jaya? Looking to share a Grab ride!', 0, '2026-10-06 14:34:22');
INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `message`, `is_organizer`, `created_at`) VALUES (2, 1, 2, 'Hi Carats! VIP Soundcheck Queue begins strictly at 2:00 PM at Gate A. Make sure your Carat Bongs are ready!', 1, '2026-10-06 14:34:22');
INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `message`, `is_organizer`, `created_at`) VALUES (3, 1, 3, 'Thank you Starline Events! Can''t wait for the concert!', 0, '2026-10-06 14:34:22');
INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `message`, `is_organizer`, `created_at`) VALUES (4, 1, 4, 'anyone want share with me', 0, '2026-10-06 14:37:33');

-- --------------------------------------------------------
-- Table structure for `event_changes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_changes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `changed_by` INT NOT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `old_value` TEXT,
  `new_value` TEXT,
  `changed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `checkins`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `checkins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `checked_in_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_checkin_unique` (`event_id`, `user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `event_interest`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_interest` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `interest_status` VARCHAR(50) DEFAULT 'interested',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_interest_unique` (`event_id`, `user_id`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_interest`
INSERT INTO `event_interest` (`id`, `event_id`, `user_id`, `interest_status`, `created_at`) VALUES (3, 8, 3, 'interested', '2026-10-08 17:47:46');

-- --------------------------------------------------------
-- Table structure for `buddy_requests`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `buddy_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `responded_at` DATETIME,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `buddy_requests`
INSERT INTO `buddy_requests` (`id`, `event_id`, `sender_id`, `receiver_id`, `status`, `created_at`, `responded_at`) VALUES (2, 8, 4, 3, 'ACCEPTED', '2026-10-08 17:48:11', '2026-10-08 17:48:23');

-- --------------------------------------------------------
-- Table structure for `event_groups`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_groups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `group_name` VARCHAR(150) NOT NULL,
  `created_by` INT NOT NULL,
  `max_members` INT DEFAULT 5,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_groups`
INSERT INTO `event_groups` (`id`, `event_id`, `group_name`, `created_by`, `max_members`, `created_at`) VALUES (2, 7, 'bjh', 3, 5, '2026-10-08 17:48:52');

-- --------------------------------------------------------
-- Table structure for `event_group_members`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_group_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  UNIQUE KEY `group_user_unique` (`group_id`, `user_id`),
  FOREIGN KEY (`group_id`) REFERENCES `event_groups`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `event_group_members`
INSERT INTO `event_group_members` (`id`, `group_id`, `user_id`, `joined_at`, `status`) VALUES (2, 2, 3, '2026-10-08 17:48:52', 'ACTIVE');
INSERT INTO `event_group_members` (`id`, `group_id`, `user_id`, `joined_at`, `status`) VALUES (3, 2, 4, '2026-10-08 17:49:23', 'ACTIVE');

-- --------------------------------------------------------
-- Table structure for `conversations`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `group_id` INT,
  `conversation_type` VARCHAR(20) DEFAULT 'DIRECT',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`group_id`) REFERENCES `event_groups`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `conversations`
INSERT INTO `conversations` (`id`, `event_id`, `group_id`, `conversation_type`, `created_at`) VALUES (2, 8, NULL, 'DIRECT', '2026-10-08 17:48:23');
INSERT INTO `conversations` (`id`, `event_id`, `group_id`, `conversation_type`, `created_at`) VALUES (3, 7, 2, 'GROUP', '2026-10-08 17:48:52');

-- --------------------------------------------------------
-- Table structure for `conversation_members`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversation_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `conversation_user_unique` (`conversation_id`, `user_id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `conversation_members`
INSERT INTO `conversation_members` (`id`, `conversation_id`, `user_id`, `joined_at`) VALUES (3, 2, 4, '2026-10-08 17:48:23');
INSERT INTO `conversation_members` (`id`, `conversation_id`, `user_id`, `joined_at`) VALUES (4, 2, 3, '2026-10-08 17:48:23');
INSERT INTO `conversation_members` (`id`, `conversation_id`, `user_id`, `joined_at`) VALUES (5, 3, 3, '2026-10-08 17:48:52');
INSERT INTO `conversation_members` (`id`, `conversation_id`, `user_id`, `joined_at`) VALUES (6, 3, 4, '2026-10-08 17:49:23');

-- --------------------------------------------------------
-- Table structure for `buddy_messages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `buddy_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `message_text` TEXT NOT NULL,
  `sent_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `buddy_messages`
INSERT INTO `buddy_messages` (`id`, `conversation_id`, `sender_id`, `message_text`, `sent_at`) VALUES (2, 3, 4, 'hello', '2026-10-08 17:49:46');
INSERT INTO `buddy_messages` (`id`, `conversation_id`, `sender_id`, `message_text`, `sent_at`) VALUES (3, 3, 3, 'hi, i ticket A5', '2026-10-08 17:49:58');
INSERT INTO `buddy_messages` (`id`, `conversation_id`, `sender_id`, `message_text`, `sent_at`) VALUES (4, 3, 4, 'OHH ABY KAT WNKJ', '2026-10-08 17:50:08');
INSERT INTO `buddy_messages` (`id`, `conversation_id`, `sender_id`, `message_text`, `sent_at`) VALUES (5, 2, 4, 'WQIDH', '2026-10-08 17:50:33');
INSERT INTO `buddy_messages` (`id`, `conversation_id`, `sender_id`, `message_text`, `sent_at`) VALUES (6, 2, 3, 'WJQ', '2026-10-08 17:50:42');

-- --------------------------------------------------------
-- Table structure for `user_reports`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reporter_id` INT NOT NULL,
  `reported_user_id` INT NOT NULL,
  `event_id` INT,
  `reason` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `status` VARCHAR(20) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` DATETIME,
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reported_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `user_reports`
INSERT INTO `user_reports` (`id`, `reporter_id`, `reported_user_id`, `event_id`, `reason`, `description`, `status`, `created_at`, `resolved_at`) VALUES (2, 4, 3, 8, 'Scam / Fake Ticket Selling', 'WQH', 'PENDING', '2026-10-08 17:50:27', NULL);

SET FOREIGN_KEY_CHECKS = 1;