-- ============================================================================
-- K-Sync Malaysia: Azure Database for MySQL (Flexible Server) Schema
-- Fully Compatible with Azure MySQL 8.0, Hostinger MySQL & MariaDB
-- Total Tables: 10 Core Tables
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+08:00';

-- --------------------------------------------------------
-- 1. Table: roles
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
-- 2. Table: users
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
  `is_verified_organizer` TINYINT DEFAULT 0,
  `verification_proof` TEXT,
  `verification_notes` TEXT,
  `location` VARCHAR(100) DEFAULT 'Kuala Lumpur',
  `buddy_preference` VARCHAR(255) DEFAULT 'Looking for event buddy',
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seeded Accounts (admin123, organizer123, fan123)
INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `profile_image`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `is_verified_organizer`, `status`) VALUES 
(1, 1, 'System Administrator', 'admin', 'admin@ksync.my', '$2b$10$nMaKST9oUz6BKd9Qyh5M9ufJwS.eUjFTgUlpImV2JklR8jvFJtjcu', 'Chief Platform Administrator for K-Sync Malaysia.', '', 'K-Sync Platform Authority', 'Promoter', '@ksync_my', 'https://ksync.my', 1, 'ACTIVE'),
(2, 2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2b$10$OFB/P0kZB9KHXf/Ygx2EO.W81zfiVw.QVtBHD86XtlSsAtIN7d5Dy', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', '', 'Starline Events Malaysia', 'Promoter', '@Starline_MY', 'https://starline.my', 1, 'ACTIVE'),
(3, 3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2b$10$XBZtbMFaFExmTqUrbfDF9edXz4JLKa4bsmnojT0vjoVra8lqcgg9i', 'SEVENTEEN Carat Malaysia Fan Union Lead', '', 'CARAT Malaysia Fan Union', 'Fanclub', '@Carat_MY', 'https://caratmalaysia.carrd.co', 1, 'ACTIVE'),
(4, 1, 'Ammar Syaathir', 'ammarsyaathir', 'ammarsyaathir@gmail.com', '$2b$10$nMaKST9oUz6BKd9Qyh5M9ufJwS.eUjFTgUlpImV2JklR8jvFJtjcu', 'Platform Admin & Lead Developer.', '', 'K-Sync Malaysia Core', 'Promoter', '@ammarsyaathir', 'https://ksync.my', 1, 'ACTIVE');

-- --------------------------------------------------------
-- 3. Table: artists
-- --------------------------------------------------------
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `korean_name` VARCHAR(100),
  `group_type` VARCHAR(50) DEFAULT 'Boy Group',
  `agency` VARCHAR(100),
  `debut_year` INT,
  `image_url` VARCHAR(255),
  `description` TEXT,
  `members` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `artists` (`id`, `name`, `korean_name`, `group_type`, `agency`, `debut_year`, `image_url`, `description`, `members`) VALUES 
(1, 'SEVENTEEN', '세븐틴', 'Boy Group', 'PLEDIS Entertainment', 2015, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', '13-member self-producing powerhouse under Pledis Entertainment.', '[{"name":"S.Coups","role":"Leader, Rapper"},{"name":"Jeonghan","role":"Vocalist"},{"name":"Joshua","role":"Vocalist"},{"name":"Jun","role":"Dancer"},{"name":"Hoshi","role":"Performance Leader"},{"name":"Wonwoo","role":"Rapper"},{"name":"Woozi","role":"Vocal Leader, Producer"},{"name":"DK","role":"Main Vocalist"},{"name":"Mingyu","role":"Rapper"},{"name":"The8","role":"Dancer"},{"name":"Seungkwan","role":"Main Vocalist"},{"name":"Vernon","role":"Rapper"},{"name":"Dino","role":"Main Dancer"}]'),
(2, 'TWICE', '트와이스', 'Girl Group', 'JYP Entertainment', 2015, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'Globally acclaimed 9-member girl group under JYP Entertainment.', '[{"name":"Nayeon","role":"Lead Vocalist"},{"name":"Jeongyeon","role":"Lead Vocalist"},{"name":"Momo","role":"Main Dancer"},{"name":"Sana","role":"Sub Vocalist"},{"name":"Jihyo","role":"Leader, Main Vocalist"},{"name":"Mina","role":"Main Dancer"},{"name":"Dahyun","role":"Lead Rapper"},{"name":"Chaeyoung","role":"Main Rapper"},{"name":"Tzuyu","role":"Lead Dancer, Maknae"}]'),
(3, 'TXT (TOMORROW X TOGETHER)', '투모로우바이투게더', 'Boy Group', 'BIGHIT MUSIC', 2019, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'Fourth-generation leaders under BIGHIT MUSIC.', '[{"name":"Soobin","role":"Leader"},{"name":"Yeonjun","role":"Dancer, Rapper, Vocalist"},{"name":"Beomgyu","role":"Vocalist, Dancer"},{"name":"Taehyun","role":"Main Vocalist"},{"name":"Huening Kai","role":"Vocalist, Maknae"}]');

-- --------------------------------------------------------
-- 4. Table: event_categories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `event_categories`;
CREATE TABLE `event_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `badge_color` VARCHAR(50) DEFAULT 'pink',
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES 
(1, 'Concert', 'concert', 'pink', 'Full-scale live stadium and arena concert tours.'),
(2, 'Fan Meeting', 'fan-meeting', 'purple', 'Intimate stage sessions, hi-touch, and interactive fan moments.'),
(3, 'Festival', 'festival', 'indigo', 'Multi-artist K-pop celebrations, music bank, and open-air festivals.'),
(4, 'Cupsleeve Event', 'cupsleeve', 'amber', 'Fanbase cafe gatherings, photo exhibitions, and anniversary celebrations.');

-- --------------------------------------------------------
-- 5. Table: events
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
  `verification_status` VARCHAR(30) DEFAULT 'VERIFIED',
  `rejection_reason` TEXT,
  `tracking_code` VARCHAR(50) UNIQUE,
  `promoter_name` VARCHAR(150),
  `submitter_name` VARCHAR(150),
  `submitter_email` VARCHAR(150),
  `submitter_social` VARCHAR(100),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`id`, `organizer_id`, `artist_id`, `category_id`, `event_name`, `description`, `event_date`, `start_time`, `end_time`, `venue_name`, `address`, `city`, `state`, `ticket_info`, `event_rules`, `official_url`, `poster_image`, `event_status`, `verification_status`, `tracking_code`, `promoter_name`, `submitter_name`, `submitter_email`, `submitter_social`) VALUES 
(1, 2, 3, 1, 'TXT (TOMORROW X TOGETHER) WORLD TOUR IN KUALA LUMPUR', 'BIGHIT MUSIC and Starline Events are thrilled to announce TXT in Kuala Lumpur! Experience spectacular live stages, fan chants, and exclusive soundcheck sessions with MOA Malaysia.', '2026-12-12', '19:30', '22:30', 'Zepp Kuala Lumpur', 'BBCC, 2, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Soundcheck: RM888 | Cat 1: RM688 | Cat 2: RM488 | Cat 3: RM288', '1. MOABONG official lightsticks allowed.\n2. No professional telephoto cameras.\n3. Queue starts at 15:00 at Entrance A.', 'https://ibighit.com/txt', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'UPCOMING', 'VERIFIED', 'KS-2026-TXT001', 'Starline Events Malaysia', 'Starline Events Malaysia', 'noreply@ksync.my', '@Starline_MY'),
(23, 3, 1, 4, 'CARAT Malaysia: SEVENTEEN 9th Anniversary Cafe Cupsleeve & Photocard Gathering', 'Celebrate SEVENTEEN 9th Debut Anniversary with fellow Malaysian CARATs! Free special edition cupsleeves, fan-designed photocard sets, lucky draw photobooks, and SEVENTEEN playlist playing all afternoon.', '2026-11-28', '11:00', '18:00', 'After Black Cafe, Sunway Geo Avenue', 'A-01-02, Sunway Geo Avenue, Jalan Lagoon Selatan, Bandar Sunway', 'Subang Jaya', 'Selangor', 'FREE ENTRY (Purchase 1 drink at cafe counter to receive official cupsleeve + photocard pack)', '1. Open to all Malaysian CARATs and K-Pop fans.\n2. Trading of official photocards welcome.\n3. Respect cafe staff and keep seating areas clean.', 'https://x.com/Carat_MY', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'UPCOMING', 'VERIFIED', 'KS-2026-SVT009', 'CARAT Malaysia Fan Union', 'CARAT Malaysia Fan Union', 'carat.malaysia.fanbase@gmail.com', '@Carat_MY');

-- --------------------------------------------------------
-- 6. Table: saved_events
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
-- 7. Table: event_chat_messages
-- --------------------------------------------------------
DROP TABLE IF EXISTS `event_chat_messages`;
CREATE TABLE `event_chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `is_organizer` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_chat_messages` (`id`, `event_id`, `user_id`, `message`, `is_organizer`) VALUES 
(1, 23, 3, 'Annyeong CARATs! Welcome to our 9th Anniversary Gathering discussion room!', 1);

-- --------------------------------------------------------
-- 8. Table: reports
-- --------------------------------------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `event_id` INT,
  `report_type` VARCHAR(50) DEFAULT 'EVENT',
  `reason` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `evidence_url` TEXT,
  `admin_action` VARCHAR(100),
  `admin_notes` TEXT,
  `resolved_by` INT,
  `resolved_at` DATETIME,
  `status` VARCHAR(30) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Table: activity_logs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(50) NOT NULL,
  `entity_type` VARCHAR(50),
  `entity_id` INT,
  `description` TEXT,
  `ip_address` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Table: notifications
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
