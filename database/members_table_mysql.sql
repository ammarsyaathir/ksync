CREATE TABLE IF NOT EXISTS `members` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `artist_id`   INT(11)      NOT NULL,
  `stage_name`  VARCHAR(100) NOT NULL,
  `birth_name`  VARCHAR(150) DEFAULT NULL,
  `group_name`  VARCHAR(100) DEFAULT NULL,
  `position`    VARCHAR(200) DEFAULT NULL,
  `dob`         DATE         DEFAULT NULL,
  `zodiac`      VARCHAR(20)  DEFAULT NULL,
  `height_cm`   DECIMAL(5,1) DEFAULT NULL,
  `blood_type`  VARCHAR(5)   DEFAULT NULL,
  `mbti`        VARCHAR(20)  DEFAULT NULL,
  `nationality` VARCHAR(50)  DEFAULT NULL,
  `debut_year`  INT(11)      DEFAULT NULL,
  `photo`       VARCHAR(255) DEFAULT NULL,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `sort_order`  INT(11)      NOT NULL DEFAULT 0,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_members_artist_stage` (`artist_id`,`stage_name`),
  KEY `idx_members_artist` (`artist_id`),
  CONSTRAINT `fk_members_artist` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'RM', 'Kim Nam-joon (김남준)', 'BTS', 'Leader, Main Rapper', '1994-09-12', 'Virgo', 181, 'A', 'ENTP', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/RM.webp', 1 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jin', 'Kim Seok-jin (김석진)', 'BTS', 'Sub-Vocalist, Visual', '1992-12-04', 'Sagittarius', 179.5, 'O', 'INTP', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/Jin.webp', 2 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'SUGA', 'Min Yoon-gi (민윤기)', 'BTS', 'Lead Rapper', '1993-03-09', 'Pisces', 174, 'O', 'ISTP', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/Suga.webp', 3 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'j-hope', 'Jung Ho-seok (정호석)', 'BTS', 'Main Dancer, Sub-Rapper, Sub-Vocalist', '1994-02-18', 'Aquarius', 177, 'A', 'ESFJ', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/j-hope.webp', 4 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jimin', 'Park Ji-min (박지민)', 'BTS', 'Main Dancer, Lead Vocalist', '1995-10-13', 'Libra', 174, 'A', 'ESTP', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/Jimin.webp', 5 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'V', 'Kim Tae-hyung (김태형)', 'BTS', 'Sub-Vocalist, Visual', '1995-12-30', 'Capricorn', 179, 'AB', 'ENTP', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/V.webp', 6 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jungkook', 'Jeon Jeongguk (전정국)', 'BTS', 'Main Vocalist, Lead Dancer, Sub-Rapper, Center, Maknae', '1997-09-01', 'Virgo', 177, 'A', 'ISFP', 'South Korean', 2013, 'https://kprofiles.com/wp-content/uploads/2016/04/JungKook.webp', 7 FROM `artists` WHERE `name` = 'BTS (Bangtan Sonyeondan)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Ruka', 'Kawai Ruka (河井瑠花)', 'BABYMONSTER', 'Main Dancer, Main Rapper', '2002-03-20', 'Pisces', 158, 'O', 'ISTJ & ISFP', 'Japanese', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/RUKA-3.jpg', 1 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Pharita', 'Pharita Chaikong (ภาริตา ไชยคง)', 'BABYMONSTER', 'Vocalist', '2005-08-26', 'Virgo', 167, 'A', 'INTP', 'Thai', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/PHARITA-4.jpg', 2 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Asa', 'Enami Asa (榎並杏紗)', 'BABYMONSTER', 'Main Rapper, Vocalist, Dancer', '2006-04-17', 'Aries', 161, 'O', 'INFP', 'Japanese', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/ASA-3.jpg', 3 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Ahyeon', 'Jung Ahyeon (정아현)', 'BABYMONSTER', 'Main Vocalist, Rapper, Dancer, Visual, Center', '2007-04-11', 'Aries', 163, 'A', 'ISTJ', 'South Korean', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/AHYEON-4.jpg', 4 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Rami', 'Shin Haram (신하람)', 'BABYMONSTER', 'Main Vocalist', '2007-10-17', 'Libra', NULL, 'O', 'INFJ', 'South Korean', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/BABYMONSTER-1st-Full-Album-DRIP-Concept-Photo-documents-5-640x800.jpeg', 5 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Rora', 'Lee Dain (이다인)', 'BABYMONSTER', 'Lead Vocalist, Visual', '2008-08-14', 'Leo', 167, 'A', 'ENTP', 'South Korean', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/RORA-4.jpg', 6 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Chiquita', 'Riracha Phondechaphiphat (ริราชา พรเดชาพิพัฒน์)', 'BABYMONSTER', 'Vocalist, Dancer, Rapper, Maknae', '2009-02-17', 'Aquarius', 165, 'O', 'ISTP', 'Thai', 2023, 'https://kprofiles.com/wp-content/uploads/2022/12/CHIQUITA-3.jpg', 7 FROM `artists` WHERE `name` = 'BABYMONSTER';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Mai', 'Tomioka Mai (富岡茉衣)', 'izna', 'Visual', '2004-10-28', 'Scorpio', 167, NULL, 'ISTP', 'Japanese', 2024, 'https://kprofiles.com/wp-content/uploads/2024/07/MAI-3-534x800.jpeg', 1 FROM `artists` WHERE `name` = 'izna';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Bang Jeemin', 'Bang Jee-min (방지민)', 'izna', 'Visual, Center', '2005-05-08', 'Taurus', 172.5, 'B', 'INFP', 'South Korean', 2024, 'https://kprofiles.com/wp-content/uploads/2024/07/BANG-JEEMIN-3-543x800.jpeg', 2 FROM `artists` WHERE `name` = 'izna';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Koko', 'Narai Koko (楢井瑚々)', 'izna', 'Main Dancer', '2006-11-14', 'Scorpio', 174, 'O', 'ESFJ', 'Japanese', 2024, 'https://kprofiles.com/wp-content/uploads/2024/07/KOKO-3-534x800.jpeg', 3 FROM `artists` WHERE `name` = 'izna';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Ryu Sarang', 'Ryu Sa-rang (류사랑)', 'izna', NULL, '2007-04-18', 'Aries', 162, 'O', 'INFP', 'South Korean', 2024, 'https://kprofiles.com/wp-content/uploads/2024/07/RYU-SARANG-3-534x800.jpeg', 4 FROM `artists` WHERE `name` = 'izna';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Choi Jungeun', 'Choi Jung-eun (최정은)', 'izna', 'Main Vocalist', '2007-08-04', 'Leo', 170, NULL, 'INTJ', 'South Korean', 2024, 'https://kprofiles.com/wp-content/uploads/2024/07/CHOI-JUNGEUN-3-534x800.jpeg', 5 FROM `artists` WHERE `name` = 'izna';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Jeong Saebi', 'Jeong Sae-bi (정세비)', 'izna', 'Visual, Maknae', '2008-01-22', 'Aquarius', 172.5, 'O', 'ENFP', 'South Korean', 2024, 'https://kprofiles.com/wp-content/uploads/2024/07/JEONG-SAEBI-3-900x600.jpeg', 6 FROM `artists` WHERE `name` = 'izna';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Daniel Kim', 'Kim Daniel (김다니엘)', 'wave to earth', 'Guitar, Vocals, Songwriter', '1997-03-18', 'Pisces', 175, 'AB', 'INFJ', 'South Korean', 2019, 'https://kprofiles.com/wp-content/uploads/2021/07/e2a69d6d9a632e21b55c72a1e9b4a4fbcdd3f0489c4ec7ba58843c30f90aa7b6-640x800.jpg', 1 FROM `artists` WHERE `name` = 'wave to earth';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'John Cha', 'Cha Soonjong (차순종)', 'wave to earth', 'Bass', '1997-08-13', 'Leo', 170, 'AB', 'ENFJ', 'South Korean', 2019, 'https://kprofiles.com/wp-content/uploads/2021/07/5457f4ce4b034934b871e22520908cd7388bf1f8c7c00332b925d5d6db4c92f5-641x800.jpg', 2 FROM `artists` WHERE `name` = 'wave to earth';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Dong Q', 'Shin Donggyu (신동규)', 'wave to earth', 'Drums', '1998-01-23', 'Aquarius', 170, NULL, 'ENFJ', 'South Korean', 2019, 'https://kprofiles.com/wp-content/uploads/2021/07/b32a17611c0638f6e6a6cd25e2d50165a81a4f392076a50f4566f092c6eb6843-641x800.jpg', 3 FROM `artists` WHERE `name` = 'wave to earth';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Young K', 'Kang Young-hyun (강영현)', 'DAY6', 'Bass, Vocalist (DAY6); Soloist', '1993-12-19', 'Sagittarius', 180.2, 'B', 'ENTP', 'South Korean', 2015, 'https://kprofiles.com/wp-content/uploads/2016/07/IMG_1566-533x800.jpeg', 1 FROM `artists` WHERE `name` = 'Young K (DAY6)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Woosung', 'Kim Woo-sung (김우성)', 'The Rose', 'Vocals, Guitar', '1993-02-25', 'Pisces', 173, 'A', 'ENTJ', 'Korean-American', 2017, 'https://kprofiles.com/wp-content/uploads/2017/08/WOOSUNG-1-640x800.jpg', 1 FROM `artists` WHERE `name` = 'The Rose';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Dojoon', 'Park Do-joon (박도준)', 'The Rose', 'Vocals, Guitar, Keyboard', '1993-04-20', 'Taurus', 176, 'O', 'ENFP', 'South Korean', 2017, 'https://kprofiles.com/wp-content/uploads/2017/08/DOJOON-640x800.jpg', 2 FROM `artists` WHERE `name` = 'The Rose';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Hajoon', 'Lee Ha-joon (이하준)', 'The Rose', 'Drums', '1994-07-29', 'Leo', 178, 'AB', 'INFJ', 'South Korean', 2017, 'https://kprofiles.com/wp-content/uploads/2017/08/HAJOON-640x800.jpg', 3 FROM `artists` WHERE `name` = 'The Rose';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Taegyeom', 'Lee Taegyeom (이태겸), formerly Lee Jae-hyeong', 'The Rose', 'Bass, Sub-Vocalist, Maknae', '1994-11-03', 'Scorpio', 181, 'B', 'INFJ', 'South Korean', 2017, 'https://kprofiles.com/wp-content/uploads/2017/08/JAEHYEONG-640x800.jpg', 4 FROM `artists` WHERE `name` = 'The Rose';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Yves', 'Ha Soo-young (하수영)', 'LOONA (former)', 'Soloist, Vocalist, Dancer', '1997-05-24', 'Gemini', 166, 'B', 'INFJ', 'South Korean', 2017, 'https://kprofiles.com/wp-content/uploads/2017/05/loona-the-origin-album-0-zero-yves-teaser-photos-v0-jfiz2dslbr7a1-571x800.webp', 1 FROM `artists` WHERE `name` = 'Yves';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Yesung', 'Kim Jong-woon (김종운), legally Kim Kang-hoon (김강훈)', 'SUPER JUNIOR', 'Main Vocalist', '1984-08-24', 'Virgo', 178, 'AB', 'INFJ', 'South Korean', 2005, 'https://kprofiles.com/wp-content/uploads/2016/07/YESUNG-1-533x800.jpg', 1 FROM `artists` WHERE `name` = 'Yesung (SUPER JUNIOR)';
INSERT IGNORE INTO `members` (`artist_id`,`stage_name`,`birth_name`,`group_name`,`position`,`dob`,`zodiac`,`height_cm`,`blood_type`,`mbti`,`nationality`,`debut_year`,`photo`,`sort_order`)
SELECT `id`, 'Lee Junho', 'Lee Jun-ho (이준호)', '2PM', 'Main Vocalist, Lead Dancer (2PM); Actor', '1990-01-25', 'Aquarius', 177, 'A', 'INFJ', 'South Korean', 2008, 'https://kprofiles.com/wp-content/uploads/2016/04/5-Junho-533x800.jpg', 1 FROM `artists` WHERE `name` = 'Lee Junho (2PM)';

SELECT m.`id`, a.`name` AS artist, m.`stage_name`, m.`dob`, m.`height_cm`, m.`blood_type`, m.`mbti`
FROM `members` m JOIN `artists` a ON a.`id` = m.`artist_id` ORDER BY a.`name`, m.`sort_order`;
