-- ============================================================================
-- K-Sync Malaysia: Hostinger MySQL 3D Arena & 4D Radar Schema Migration
-- Run this in phpMyAdmin or MySQL Workbench if tables/columns are missing
-- ============================================================================

-- 1. Ensure `cluster_area` column exists in `events` table
SET @dbname = DATABASE();
SET @tablename = "events";
SET @columnname = "cluster_area";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE `events` ADD COLUMN `cluster_area` VARCHAR(100) NULL AFTER `state`;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Populate Cluster Precincts for 4D Radar
UPDATE `events` SET `cluster_area` = 'Bukit Jalil Hub' 
WHERE `venue_name` LIKE '%Axiata%' OR `venue_name` LIKE '%Bukit Jalil%' OR `venue_name` LIKE '%National Stadium%' OR `venue_name` LIKE '%Unifi Arena%';

UPDATE `events` SET `cluster_area` = 'BBCC & Downtown KL' 
WHERE `venue_name` LIKE '%Zepp%' OR `venue_name` LIKE '%Bukit Bintang%' OR `venue_name` LIKE '%KLCC%';

UPDATE `events` SET `cluster_area` = 'KL Sentral & Brickfields' 
WHERE `venue_name` LIKE '%Mega Star Arena%' OR `venue_name` LIKE '%Sentral%';

UPDATE `events` SET `cluster_area` = 'Petaling Jaya & Sunway' 
WHERE `venue_name` LIKE '%Sunway%' OR `city` LIKE '%Petaling Jaya%' OR `city` LIKE '%Subang%';

UPDATE `events` SET `cluster_area` = 'Bangsar & Mid Valley' 
WHERE `venue_name` LIKE '%Bangsar%' OR `venue_name` LIKE '%Mid Valley%' OR `venue_name` LIKE '%VCR%';

UPDATE `events` SET `cluster_area` = 'Penang & Northern Region' 
WHERE `city` LIKE '%Penang%' OR `city` LIKE '%George Town%';

UPDATE `events` SET `cluster_area` = 'Kuala Lumpur Metro Hub' 
WHERE `cluster_area` IS NULL OR `cluster_area` = '';

-- 3. Create `venues` table for 3D Stadium & Seating POV Simulator
CREATE TABLE IF NOT EXISTS `venues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `capacity` INT NULL,
  `transit_info` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seed Standard Malaysian Concert Venues
INSERT IGNORE INTO `venues` (`id`, `name`, `city`, `state`, `capacity`, `transit_info`) VALUES
(1, 'Axiata Arena Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 16000, 'LRT Sri Petaling Line (Bukit Jalil PH5). 5-min covered walkway directly into arena.'),
(2, 'National Stadium Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 87000, 'LRT Sri Petaling Line (Bukit Jalil PH5). Covered pedestrian plaza directly outside gates.'),
(3, 'Zepp Kuala Lumpur', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 2500, 'Direct connection from Hang Tuah station (LRT/Monorail) through Mitsui LaLaport BBCC into Zepp lobby.'),
(4, 'Idea Live KL (Mega Star Arena)', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 5000, 'Inside Sungei Wang Plaza Level 4. Direct covered walkway from MRT Bukit Bintang (MR6).');
