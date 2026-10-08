-- K-Sync Malaysia MySQL Database Dump for Laragon / phpMyAdmin
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB

CREATE DATABASE IF NOT EXISTS `ksync_malaysia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ksync_malaysia`;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Organizer'),
(3, 'Fan')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- 2. Users Table
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
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `role_id`, `full_name`, `username`, `email`, `password_hash`, `bio`, `organization_name`, `organization_type`, `social_handle`, `social_url`, `is_verified_organizer`) VALUES
(1, 1, 'System Administrator', 'admin', 'admin@ksync.my', '$2y$10$e.Z.yK6O9Zf4GZf4GZf4G.e1gH1gH1gH1gH1gH1gH1gH1gH1gH1g', 'Primary administrator for K-Sync Malaysia.', NULL, NULL, NULL, NULL, 0),
(2, 2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2y$10$e.Z.yK6O9Zf4GZf4GZf4G.e1gH1gH1gH1gH1gH1gH1gH1gH1g', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', 'Starline Events Malaysia', 'Concert Organizer', '@starline_my', 'https://x.com/starline_my', 1),
(3, 3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2y$10$e.Z.yK6O9Zf4GZf4GZf4G.e1gH1gH1gH1gH1gH1gH1gH1gH1g', 'Passionate K-Pop fan & SEVENTEEN Carat in KL!', NULL, NULL, NULL, NULL, 0),
(4, 2, 'MOAbasedMY (TXT Malaysia Fanclub)', 'moabasedmy', 'txt_fanclub@ksync.my', '$2y$10$e.Z.yK6O9Zf4GZf4GZf4G.e1gH1gH1gH1gH1gH1gH1gH1gH1g', 'Official Malaysian fanclub community for TOMORROW X TOGETHER (TXT).', 'MOAbasedMY - TXT Fanclub Malaysia', 'Official Fanclub', '@MOAbasedMY', 'https://x.com/MOAbasedMY', 1)
ON DUPLICATE KEY UPDATE `username`=`username`;

-- 3. Artists Table
CREATE TABLE IF NOT EXISTS `artists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `group_type` VARCHAR(50) DEFAULT 'Boy Group',
  `image_url` VARCHAR(255),
  `agency` VARCHAR(100),
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `artists` (`id`, `name`, `group_type`, `image_url`, `agency`, `description`) VALUES
(1, 'SEVENTEEN', 'Boy Group', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop', 'PLEDIS Entertainment', '13-member South Korean boy group known for self-producing music.'),
(2, 'TWICE', 'Girl Group', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop', 'JYP Entertainment', 'Global sensation 9-member South Korean girl group.'),
(3, 'IU (Lee Ji-eun)', 'Soloist', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop', 'EDAM Entertainment', 'Renowned South Korean singer-songwriter and actress.'),
(4, 'IVE', 'Girl Group', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop', 'Starship Entertainment', '6-member chart-topping girl group.'),
(5, 'Stray Kids', 'Boy Group', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop', 'JYP Entertainment', '8-member self-producing powerhouse.'),
(6, 'aespa', 'Girl Group', 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop', 'SM Entertainment', 'Futuristic 4-member girl group with avatar concept.')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- 4. Event Categories Table
CREATE TABLE IF NOT EXISTS `event_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `badge_color` VARCHAR(30) DEFAULT 'purple',
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `event_categories` (`id`, `name`, `slug`, `badge_color`, `description`) VALUES
(1, 'Concert', 'concert', 'pink', 'Live stadium, arena, and hall musical performances.'),
(2, 'Fan Meeting', 'fan-meeting', 'purple', 'Interactive fan meets, hi-touch, and Q&A sessions.'),
(3, 'Cupsleeve Event', 'cupsleeve-event', 'emerald', 'Café gatherings celebrating member birthdays and anniversaries.'),
(4, 'Pop-Up Store', 'pop-up-store', 'amber', 'Official merchandise pop-up exhibits and photo zones.')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- 5. Venues Table
CREATE TABLE IF NOT EXISTS `venues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `map_link` VARCHAR(255),
  `capacity` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `venues` (`id`, `name`, `address`, `city`, `state`, `map_link`, `capacity`) VALUES
(1, 'Axiata Arena', 'Jalan Barat, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Axiata+Arena+Bukit+Jalil', 13000),
(2, 'Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza, Jalan Sultan Ismail', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Mega+Star+Arena', 5000),
(3, 'K-Fan Cafe Bukit Bintang', 'No 45, Jalan Bukit Bintang', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Bukit+Bintang+Kuala+Lumpur', 150)
ON DUPLICATE KEY UPDATE `name`=`name`;

-- 6. Events Table
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
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`),
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Saved Events Table
CREATE TABLE IF NOT EXISTS `saved_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `saved_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_event_unique` (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Event Updates Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Notifications Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Event Verifications Table
CREATE TABLE IF NOT EXISTS `event_verifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `status` VARCHAR(30) NOT NULL,
  `notes` TEXT,
  `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Activity Logs Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Event Reports Table (Community Moderation)
CREATE TABLE IF NOT EXISTS `event_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `user_id` INT,
  `report_reason` VARCHAR(100) NOT NULL,
  `report_details` TEXT,
  `status` VARCHAR(20) DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
