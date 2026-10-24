-- ============================================================================
-- K-Sync Malaysia: Hostinger MySQL Migration for Artists & Slugs
-- Compatible with Hostinger MySQL / phpMyAdmin
-- Run this in phpMyAdmin on Hostinger if you want immediate manual execution.
-- ============================================================================

-- 1. Add slug, debut_year, fandom_name, header_image to artists table if not present
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `slug` VARCHAR(100) NULL AFTER `name`;
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `debut_year` INT NULL AFTER `agency`;
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `fandom_name` VARCHAR(100) NULL AFTER `debut_year`;
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `header_image` VARCHAR(255) NULL AFTER `image_url`;

-- 2. Populate Slugs and Fandom Names for the 20 Official Malaysia K-Pop Artists
UPDATE `artists` SET `slug` = 'seventeen', `debut_year` = 2015, `fandom_name` = 'CARAT' WHERE `name` LIKE '%SEVENTEEN%';
UPDATE `artists` SET `slug` = 'twice', `debut_year` = 2015, `fandom_name` = 'ONCE' WHERE `name` LIKE '%TWICE%';
UPDATE `artists` SET `slug` = 'iu', `debut_year` = 2008, `fandom_name` = 'UAENA' WHERE `name` LIKE '%IU%';
UPDATE `artists` SET `slug` = 'enhypen', `debut_year` = 2020, `fandom_name` = 'ENGENE' WHERE `name` LIKE '%ENHYPEN%';
UPDATE `artists` SET `slug` = 'ive', `debut_year` = 2021, `fandom_name` = 'DIVE' WHERE `name` LIKE '%IVE%';
UPDATE `artists` SET `slug` = 'txt', `debut_year` = 2019, `fandom_name` = 'MOA' WHERE `name` LIKE '%TXT%' OR `name` LIKE '%TOMORROW%';
UPDATE `artists` SET `slug` = 'stray-kids', `debut_year` = 2018, `fandom_name` = 'STAY' WHERE `name` LIKE '%Stray Kids%';
UPDATE `artists` SET `slug` = 'aespa', `debut_year` = 2020, `fandom_name` = 'MY' WHERE `name` LIKE '%aespa%';
UPDATE `artists` SET `slug` = 'bts', `debut_year` = 2013, `fandom_name` = 'ARMY' WHERE `name` LIKE '%BTS%';
UPDATE `artists` SET `slug` = 'babymonster', `debut_year` = 2023, `fandom_name` = 'MONSTIEZ' WHERE `name` LIKE '%BABYMONSTER%';
UPDATE `artists` SET `slug` = 'wave-to-earth', `debut_year` = 2019, `fandom_name` = 'Plankton' WHERE `name` LIKE '%wave to earth%';
UPDATE `artists` SET `slug` = 'young-k', `debut_year` = 2015, `fandom_name` = 'My Day' WHERE `name` LIKE '%Young K%';
UPDATE `artists` SET `slug` = 'the-rose', `debut_year` = 2017, `fandom_name` = 'Black Rose' WHERE `name` LIKE '%The Rose%';
UPDATE `artists` SET `slug` = 'boynextdoor', `debut_year` = 2023, `fandom_name` = 'ONEDOOR' WHERE `name` LIKE '%BOYNEXTDOOR%';
UPDATE `artists` SET `slug` = 'blackpink', `debut_year` = 2016, `fandom_name` = 'BLINK' WHERE `name` LIKE '%BLACKPINK%';
UPDATE `artists` SET `slug` = 'itzy', `debut_year` = 2019, `fandom_name` = 'MIDZY' WHERE `name` LIKE '%ITZY%';
UPDATE `artists` SET `slug` = 'nct-dream', `debut_year` = 2016, `fandom_name` = 'NCTzen' WHERE `name` LIKE '%NCT DREAM%';
UPDATE `artists` SET `slug` = 'treasure', `debut_year` = 2020, `fandom_name` = 'TREASURE MAKER (TEUME)' WHERE `name` LIKE '%TREASURE%';
UPDATE `artists` SET `slug` = 'taeyeon', `debut_year` = 2007, `fandom_name` = 'SONE' WHERE `name` LIKE '%TAEYEON%';
UPDATE `artists` SET `slug` = 'super-junior', `debut_year` = 2005, `fandom_name` = 'E.L.F' WHERE `name` LIKE '%SUPER JUNIOR%';

-- 3. Ensure members table exists in MySQL
CREATE TABLE IF NOT EXISTS `members` (
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
  KEY `idx_members_artist` (`artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
