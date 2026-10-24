-- ============================================================================
-- K-Sync Malaysia: Full 20 Artists & 120 Members Sync for Hostinger MySQL
-- Run this in phpMyAdmin on Hostinger, or let config/database.js auto-run it.
-- ============================================================================

-- 1. Ensure required columns exist in artists table
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `slug` VARCHAR(100) NULL AFTER `name`;
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `debut_year` INT NULL AFTER `agency`;
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `fandom_name` VARCHAR(100) NULL AFTER `debut_year`;
ALTER TABLE `artists` ADD COLUMN IF NOT EXISTS `header_image` VARCHAR(255) NULL AFTER `image_url`;

-- 2. Upsert the 20 Official Malaysia Touring Artists
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (1, 'SEVENTEEN', 'seventeen', 'Boy Group', 'PLEDIS Entertainment', 2015, 'CARAT', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Seventeen_Carat_Land_24.jpg', '13-member South Korean self-producing boy group under PLEDIS Entertainment (HYBE). Divided into Hip-Hop, Vocal, and Performance units. Celebrated for razor-sharp synchronization choreography and mega Malaysian concerts at Axiata Arena Bukit Jalil (Ode to You, Be the Sun) with their fandom CARAT (official colors: Rose Quartz & Serenity).')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (2, 'TWICE', 'twice', 'Girl Group', 'JYP Entertainment', 2015, 'ONCE', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Twice_260618.jpg', 'Renowned 9-member South Korean girl group under JYP Entertainment (Nayeon, Jeongyeon, Momo, Sana, Jihyo, Mina, Dahyun, Chaeyoung, Tzuyu). "The Nation\'s Girl Group" has thrilled Malaysian ONCE with historic sold-out tours at Axiata Arena Bukit Jalil (Twicelights, Ready To Be) with official colors Apricot & Neon Magenta.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (3, 'IU (Lee Ji-eun)', 'iu', 'Soloist', 'EDAM Entertainment', 2008, 'UAENA', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/IU_at_the_Est%C3%A9e_Lauder_launch_event%2C_26_February_2026_%2810%29.png', 'South Korea\'s premier singer-songwriter and actress under EDAM Entertainment. "The Nation\'s Sweetheart" mesmerized Malaysian UAENAs across two sold-out nights at Axiata Arena Bukit Jalil during her record-setting HEREH World Tour, featuring live acoustic renditions of "Love wins all", "Blueming", and "Celebrity".')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (4, 'ENHYPEN', 'enhypen', 'Boy Group', 'BELIFT LAB', 2020, 'ENGENE', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Enhypen_at_Golden_disc_awards.png', 'Seven-member boy group formed through I-LAND under BELIFT LAB. Renowned for dark vampire fantasy lore and high-octane choreography, selling out Malaysian arena stops on their FATE and WALK THE LINE world tours.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (5, 'IVE', 'ive', 'Girl Group', 'Starship Entertainment', 2021, 'DIVE', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ive_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%282%29.png', '6-member sensation under Starship Entertainment (An Yu-jin, Gaeul, Rei, Jang Won-young, Liz, Leeseo). Swept Rookie of the Year and Song of the Year daesangs with "Love Dive", "I AM", and "Baddie", selling out Axiata Arena Bukit Jalil during their SHOW WHAT I HAVE 1st World Tour for Malaysian DIVE.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (6, 'TOMORROW X TOGETHER (TXT)', 'txt', 'Boy Group', 'BIGHIT MUSIC / HYBE', 2019, 'MOA', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tomorrow_X_Together_at_a_Dior_event%2C_April_18%2C_2025.png', '5-member boy group under BIGHIT MUSIC (HYBE) comprising Soobin, Yeonjun, Beomgyu, Taehyun, and HueningKai. Hailed as the "Voice of Gen Z", they have performed unforgettable Malaysian concerts at Axiata Arena Bukit Jalil (ACT : LOVESICK, ACT : SWEET MIRAGE, ACT : PROMISE) with an active community led by MY MOA Union.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (7, 'Stray Kids', 'stray-kids', 'Boy Group', 'JYP Entertainment', 2018, 'STAY', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Stray_Kids_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%281%29.png', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Stray_Kids_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%281%29.png', '8-member self-producing powerhouse under JYP Entertainment (Bang Chan, Lee Know, Changbin, Hyunjin, Han, Felix, Seungmin, I.N). Produced by in-house unit 3RACHA, famous for stadium anthems like "God\'s Menu" and "Chk Chk Boom" during their MANIAC and dominATE world tours at Axiata Arena and National Stadium Bukit Jalil.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (8, 'aespa', 'aespa', 'Girl Group', 'SM Entertainment', 2020, 'MY', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Aespa_Love_Your_W_2025_1.jpg', 'Futuristic 4-member metaverse girl group under SM Entertainment (Karina, Giselle, Winter, Ningning). Broke global charts with viral anthems "Supernova", "Whiplash", and "Next Level", bringing their spectacular SYNK : PARALLEL LINE live tour to Malaysian MYs at Axiata Arena Bukit Jalil.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (9, 'BTS (Bangtan Sonyeondan)', 'bts', 'Boy Group', 'BIGHIT MUSIC / HYBE', 2013, 'ARMY', 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/73/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg', '21st century pop icons (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook) under BIGHIT MUSIC. Multiple Grammy-nominated global phenomenon with deep Malaysian ties dating back to their iconic Red Bullet tour and an active nationwide Malaysian ARMY community that regularly organizes charity and cup sleeve projects.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (10, 'BABYMONSTER', 'babymonster', 'Girl Group', 'YG Entertainment', 2023, 'MONSTIEZ', 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png', 'https://upload.wikimedia.org/wikipedia/commons/5/57/BabyMonster_Promoting_drip_on_2024112.png', 'YG Entertainment\'s 7-member monster rookie girl group (Ruka, Pharita, Asa, Ahyeon, Rami, Rora, Chiquita). Known for phenomenal live vocals and dynamic hip-hop performances on hits "SHEESH", "BATTER UP", and "DRIP", headlining their Malaysian fan concert debut at Zepp Kuala Lumpur for Malaysian MONSTIEZ.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (12, 'wave to earth', 'wave-to-earth', 'Band', 'Wavy', 2019, 'Plankton', 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg', 'https://dynamicmedia.livenationinternational.com/y/b/e/f2d49dce-7266-4487-a111-6323bb0dbfa4.jpg', '3-member Korean indie jazz-rock sensation under Wavy (Daniel Kim, John Cha, Dong Q). Masterpieces of lo-fi indie melodies like "bad", "seasons", and "love." brought them to sold-out Malaysian showcases at Zepp Kuala Lumpur and Mega Star Arena KL.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (13, 'Young K (DAY6)', 'young-k', 'Band', 'JYP Entertainment', 2015, 'My Day', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/180628_Day6.jpg', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/180628_Day6.jpg', 'Virtuoso bassist, vocalist, and prolific songwriter of DAY6 under JYP Entertainment. Famous for authoring chart-topping hits across K-Pop, Young K held his solo world tour <Letters with notes> and <YOUNGEST> in Kuala Lumpur alongside DAY6\'s sold-out concerts at Mega Star Arena KL for Malaysian My Day.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (14, 'The Rose', 'the-rose', 'Band', 'Windfall', 2017, 'Black Rose', 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Rose_2023.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Rose_2023.jpg', 'Beloved 4-member Korean indie rock band (Woosung, Dojoon, Hajoon, Jaehyeong). Renowned for emotionally resonant anthems like "She\'s In The Rain", "Sour", and "Back To Me", performing sold-out concerts at Mega Star Arena KL on their HEAL Together and DAWN TO DUSK World Tours for Malaysian Black Roses.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (18, 'BOYNEXTDOOR', 'boynextdoor', 'Boy Group', 'KOZ Entertainment', 2023, 'ONEDOOR', 'https://upload.wikimedia.org/wikipedia/commons/0/04/2026-01-16_BOYNEXTDOOR_at_Golden_Disc_Awards_05_%28cropped%29.png', 'https://upload.wikimedia.org/wikipedia/commons/0/04/2026-01-16_BOYNEXTDOOR_at_Golden_Disc_Awards_05_%28cropped%29.png', '6-member boy group under KOZ Entertainment / HYBE (Sungho, Riwoo, Jaehyun, Taesan, Leehan, Woonhak). Produced by ZICO, beloved for relatable charm and catchy tracks like "Nice Guy", "Earth, Wind & Fire", and "One and Only", bringing their KNOCK ON tour to Malaysian ONEDOOR.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (19, 'BLACKPINK', 'blackpink', 'Girl Group', 'YG Entertainment', 2016, 'BLINK', 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png', 'https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png', 'Global superstar 4-member girl group under YG Entertainment (Jisoo, Jennie, Rosé, Lisa). Made history in Malaysia with their record-breaking BORN PINK World Tour at Bukit Jalil National Stadium, electrifying over 60,000 Malaysian BLINKs in an iconic ocean of pink lightsticks.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (20, 'ITZY', 'itzy', 'Girl Group', 'JYP Entertainment', 2019, 'MIDZY', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/251110_ITZY.png', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/251110_ITZY.png', '5-member powerhouse girl group under JYP Entertainment (Yeji, Lia, Ryujin, Chaeryeong, Yuna). Renowned for crown choreographies and self-love anthems like "WANNABE", "DALLA DALLA", and "Untouchable", headlining multiple Malaysian concerts at Mega Star Arena KL for Malaysian MIDZY.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (21, 'NCT DREAM', 'nct-dream', 'Boy Group', 'SM Entertainment', 2016, 'NCTzen', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/NCT_Dream_at_DREAM%28%29SCAPE_Press_Conference.png', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/NCT_Dream_at_DREAM%28%29SCAPE_Press_Conference.png', '7-member youthful powerhouse under SM Entertainment (Mark, Renjun, Jeno, Haechan, Jaemin, Chenle, Jisung). Filled Axiata Arena Bukit Jalil with a glowing sea of pearl neon green lightsticks during their sold-out THE DREAM SHOW 2 and THE DREAM SHOW 3: DREAM( )SCAPE tours.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (22, 'TREASURE', 'treasure', 'Boy Group', 'YG Entertainment', 2020, 'TREASURE MAKER (TEUME)', 'https://upload.wikimedia.org/wikipedia/commons/8/8a/230806_%ED%8A%B8%EB%A0%88%EC%A0%80_%28TREASURE%29_SBS_%ED%8C%8C%EC%9B%8CFM_%EB%91%90%EC%8B%9C%ED%83%88%EC%B6%9C_%EC%BB%AC%ED%88%AC%EC%87%BC.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8a/230806_%ED%8A%B8%EB%A0%88%EC%A0%80_%28TREASURE%29_SBS_%ED%8C%8C%EC%9B%8CFM_%EB%91%90%EC%8B%9C%ED%83%88%EC%B6%9C_%EC%BB%AC%ED%88%AC%EC%87%BC.jpg', '10-member high-energy boy group under YG Entertainment. Famous for crowd-shaking hits "JIKJIN", "DARARI", and "BONA BONA", performing massive arena concerts in Malaysia at Malawati Stadium and Axiata Arena for Malaysian Treasure Makers (Teume).')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (23, 'TAEYEON', 'taeyeon', 'Soloist', 'SM Entertainment', 2007, 'SONE', 'https://upload.wikimedia.org/wikipedia/commons/8/80/250307_Taeyeon_%40_-The_Tense-_in_Seoul_Day_1_%2854371295597%29_%28cropped%29.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/80/250307_Taeyeon_%40_-The_Tense-_in_Seoul_Day_1_%2854371295597%29_%28cropped%29.jpg', 'Leader and main vocalist of Girls\' Generation and legendary solo artist under SM Entertainment. Renowned for supreme vocal artistry on masterpieces like "INVU", "Four Seasons", and "To. X", selling out Axiata Arena Bukit Jalil with Malaysian SONEs.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);
INSERT INTO `artists` (`id`, `name`, `slug`, `group_type`, `agency`, `debut_year`, `fandom_name`, `image_url`, `header_image`, `description`)
VALUES (26, 'SUPER JUNIOR', 'super-junior', 'Boy Group', 'SM Entertainment', 2005, 'E.L.F', 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2015_Super_Junior_DSC02998_%2820357930851%29.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/52/KCON_2015_Super_Junior_DSC02998_%2820357930851%29.jpg', 'The "Kings of Hallyu" under SM Entertainment (Leeteuk, Heechul, Yesung, Shindong, Eunhyuk, Donghae, Siwon, Ryeowook, Kyuhyun). Pioneers of global K-Pop who have performed historic editions of their signature SUPER SHOW world tour (Super Show 2, 5, 9, and 10) in Malaysia at Axiata Arena Bukit Jalil and Stadium Putra for Malaysian E.L.F.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `group_type` = VALUES(`group_type`),
  `agency` = VALUES(`agency`),
  `debut_year` = VALUES(`debut_year`),
  `fandom_name` = VALUES(`fandom_name`),
  `image_url` = VALUES(`image_url`),
  `header_image` = VALUES(`header_image`),
  `description` = VALUES(`description`);

-- 3. Prune any legacy artists not in the 20 official Malaysia roster
DELETE FROM `artists` WHERE `slug` NOT IN ('seventeen', 'twice', 'iu', 'enhypen', 'ive', 'txt', 'stray-kids', 'aespa', 'bts', 'babymonster', 'wave-to-earth', 'young-k', 'the-rose', 'boynextdoor', 'blackpink', 'itzy', 'nct-dream', 'treasure', 'taeyeon', 'super-junior') AND `id` NOT IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 18, 19, 20, 21, 22, 23, 26);

-- 4. Ensure members table exists in MySQL
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

-- 5. Upsert All 120 Members with Local Portrait Photos
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'S.Coups', 'Choi Seung-cheol (최승철)', 'SEVENTEEN', 'Leader, Hip-Hop Team Leader, Rapper', '1995-08-08', 'Leo', 178, 'AB', 'INFP', 'South Korean', 2015, '/images/members/seventeen-s-coups.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jeonghan', 'Yoon Jeong-han (윤정한)', 'SEVENTEEN', 'Lead Vocalist, Visual', '1995-10-04', 'Libra', 178, 'B', 'ISFJ', 'South Korean', 2015, '/images/members/seventeen-jeonghan.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Joshua', 'Joshua Hong / Hong Ji-soo (홍지수)', 'SEVENTEEN', 'Lead Vocalist, Visual', '1995-12-30', 'Capricorn', 177, 'A', 'ENFJ', 'Korean-American', 2015, '/images/members/seventeen-joshua.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jun', 'Wen Junhui (文俊辉) / Moon Jun-hwi (문준휘)', 'SEVENTEEN', 'Lead Dancer, Sub Vocalist', '1996-06-10', 'Gemini', 182, 'B', 'INFP', 'Chinese', 2015, '/images/members/seventeen-jun.jpg', 1, 4
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Hoshi', 'Kwon Soon-young (권순영)', 'SEVENTEEN', 'Performance Team Leader, Main Dancer, Lead Vocalist', '1996-06-15', 'Gemini', 177, 'B', 'INFP', 'South Korean', 2015, '/images/members/seventeen-hoshi.jpg', 1, 5
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Wonwoo', 'Jeon Won-woo (전원우)', 'SEVENTEEN', 'Lead Rapper, Sub Vocalist', '1996-07-17', 'Cancer', 182, 'A', 'INFJ', 'South Korean', 2015, '/images/members/seventeen-wonwoo.jpg', 1, 6
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Woozi', 'Lee Ji-hoon (이지훈)', 'SEVENTEEN', 'Vocal Team Leader, Lead Vocalist, Main Producer', '1996-11-22', 'Sagittarius', 164, 'A', 'INFJ', 'South Korean', 2015, '/images/members/seventeen-woozi.jpg', 1, 7
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'DK', 'Lee Seok-min (이석민)', 'SEVENTEEN', 'Main Vocalist', '1997-02-18', 'Aquarius', 179, 'O', 'INFP', 'South Korean', 2015, '/images/members/seventeen-dk.jpg', 1, 8
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Mingyu', 'Kim Min-gyu (김민규)', 'SEVENTEEN', 'Lead Rapper, Visual, Face of the Group', '1997-04-06', 'Aries', 187, 'B', 'ENTJ', 'South Korean', 2015, '/images/members/seventeen-mingyu.jpg', 1, 9
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'The8', 'Xu Minghao (徐明浩) / Seo Myung-ho (서명호)', 'SEVENTEEN', 'Lead Dancer, Sub Vocalist, Sub Rapper', '1997-11-07', 'Scorpio', 178, 'O', 'INFJ', 'Chinese', 2015, '/images/members/seventeen-the8.jpg', 1, 10
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Seungkwan', 'Boo Seung-kwan (부승관)', 'SEVENTEEN', 'Main Vocalist, Face of the Group', '1998-01-16', 'Capricorn', 174, 'B', 'ENFP', 'South Korean', 2015, '/images/members/seventeen-seungkwan.jpg', 1, 11
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Vernon', 'Hansol Vernon Chwe (최한솔)', 'SEVENTEEN', 'Main Rapper, Sub Vocalist, Visual', '1998-02-18', 'Aquarius', 178, 'A', 'ENTP', 'Korean-American', 2015, '/images/members/seventeen-vernon.jpg', 1, 12
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Dino', 'Lee Chan (이찬)', 'SEVENTEEN', 'Main Dancer, Sub Vocalist, Sub Rapper, Maknae', '1999-02-11', 'Aquarius', 174, 'A', 'ENFJ', 'South Korean', 2015, '/images/members/seventeen-dino.jpg', 1, 13
FROM `artists` a WHERE a.slug = 'seventeen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jeongyeon', 'Yoo Jeong-yeon (유정연)', 'TWICE', 'Lead Vocalist', '1996-11-01', 'Scorpio', 168, 'O', 'ISFJ', 'South Korean', 2015, '/images/members/twice-jeongyeon.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Momo', 'Hirai Momo (平井 もも)', 'TWICE', 'Main Dancer, Sub Vocalist, Sub Rapper', '1996-11-09', 'Scorpio', 162, 'A', 'INFP', 'Japanese', 2015, '/images/members/twice-momo.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Mina', 'Myoui Mina (名井 南)', 'TWICE', 'Main Dancer, Sub Vocalist', '1997-03-24', 'Aries', 163, 'A', 'ISFP', 'Japanese-American', 2015, '/images/members/twice-mina.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Dahyun', 'Kim Da-hyun (김다현)', 'TWICE', 'Lead Rapper, Sub Vocalist', '1998-05-28', 'Gemini', 159, 'O', 'ISFJ', 'South Korean', 2015, '/images/members/twice-dahyun.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Chaeyoung', 'Son Chae-young (손채영)', 'TWICE', 'Main Rapper, Sub Vocalist', '1999-04-23', 'Taurus', 159, 'B', 'INFP', 'South Korean', 2015, '/images/members/twice-chaeyoung.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Tzuyu', 'Chou Tzu-yu (周子瑜)', 'TWICE', 'Lead Dancer, Sub Vocalist, Visual, Maknae', '1999-06-14', 'Gemini', 170, 'A', 'ISFP', 'Taiwanese', 2015, '/images/members/twice-tzuyu.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Nayeon', 'Im Na-yeon (임나연)', 'TWICE', 'Lead Vocalist, Lead Dancer, Center', '1995-09-22', 'Virgo', 163, 'A', 'ISTP', 'South Korean', 2015, '/images/members/twice-nayeon.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jihyo', 'Park Ji-hyo (박지효)', 'TWICE', 'Leader, Main Vocalist', '1997-02-01', 'Aquarius', 160, 'O', 'ESFP', 'South Korean', 2015, '/images/members/twice-jihyo.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Sana', 'Minatozaki Sana (湊崎 紗夏)', 'TWICE', 'Sub Vocalist', '1996-12-29', 'Capricorn', 163, 'B', 'ENFP', 'Japanese', 2015, '/images/members/twice-sana.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'twice'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'IU', 'Lee Ji-eun (이지은)', 'Soloist', 'Singer-Songwriter, Producer, Actress', '1993-05-16', 'Taurus', 161.8, 'A', 'INFJ', 'South Korean', 2008, '/images/members/iu-iu.png', 1, 1
FROM `artists` a WHERE a.slug = 'iu'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jay', 'Jay Park / Park Jong-seong (박종성)', 'ENHYPEN', 'Main Rapper, Lead Vocalist, Lead Dancer', '2002-04-20', 'Taurus', 180, 'B', 'INTP', 'Korean-American', 2020, '/images/members/enhypen-jay.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jake', 'Jake Sim / Sim Jae-yun (심재윤)', 'ENHYPEN', 'Lead Vocalist, Lead Dancer', '2002-11-15', 'Scorpio', 176, 'O', 'ISTJ', 'Korean-Australian', 2020, '/images/members/enhypen-jake.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Sunghoon', 'Park Sung-hoon (박성훈)', 'ENHYPEN', 'Lead Vocalist, Lead Dancer, Visual', '2002-12-08', 'Sagittarius', 181, 'O', 'ISTJ', 'South Korean', 2020, '/images/members/enhypen-sunghoon.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Sunoo', 'Kim Sun-woo (김선우)', 'ENHYPEN', 'Lead Vocalist', '2003-06-24', 'Cancer', 177, 'O', 'ENFP', 'South Korean', 2020, '/images/members/enhypen-sunoo.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jungwon', 'Yang Jung-won (양정원)', 'ENHYPEN', 'Leader, Lead Vocalist, Lead Dancer', '2004-02-09', 'Aquarius', 174, 'AB', 'ISTJ', 'South Korean', 2020, '/images/members/enhypen-jungwon.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Heeseung', 'Lee Hee-seung (이희승)', 'ENHYPEN', 'Main Vocalist, Lead Dancer, Center', '2001-10-15', 'Libra', 183, 'A', 'INFP', 'South Korean', 2020, '/images/members/enhypen-heeseung.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Ni-ki', 'Nishimura Riki (西村力)', 'ENHYPEN', 'Main Dancer, Lead Vocalist, Maknae', '2005-12-09', 'Sagittarius', 183, 'B', 'ENTJ', 'Japanese', 2020, '/images/members/enhypen-ni-ki.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'enhypen'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'An Yu-jin', 'An Yu-jin (안유진)', 'IVE', 'Leader, Main Vocalist, Lead Dancer', '2003-09-01', 'Virgo', 173, 'A', 'ISTP', 'South Korean', 2021, '/images/members/ive-an-yu-jin.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'ive'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Gaeul', 'Kim Ga-eul (김가을)', 'IVE', 'Main Dancer, Lead Rapper, Sub Vocalist', '2002-09-24', 'Libra', 164, 'B', 'ISTJ', 'South Korean', 2021, '/images/members/ive-gaeul.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'ive'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Rei', 'Naoi Rei (直井 怜) / Kim Rei', 'IVE', 'Main Rapper, Sub Vocalist', '2004-02-03', 'Aquarius', 170, 'A', 'INFJ', 'Japanese', 2021, '/images/members/ive-rei.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'ive'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jang Won-young', 'Jang Won-young (장원영)', 'IVE', 'Vocalist, Visual, Center', '2004-08-31', 'Virgo', 173, 'O', 'E', 'South Korean', 2021, '/images/members/ive-jang-won-young.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'ive'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Liz', 'Kim Ji-won (김지원)', 'IVE', 'Main Vocalist', '2004-11-21', 'Scorpio', 170, 'AB', 'INFP', 'South Korean', 2021, '/images/members/ive-liz.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'ive'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Leeseo', 'Lee Hyun-seo (이현서)', 'IVE', 'Lead Dancer, Sub Vocalist, Visual, Maknae', '2007-02-21', 'Pisces', 166, 'O', 'ENFP', 'South Korean', 2021, '/images/members/ive-leeseo.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'ive'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Soobin', 'Choi Soo-bin (최수빈)', 'TOMORROW X TOGETHER (TXT)', 'Leader, Vocalist, Rapper, Dancer', '2000-12-05', 'Sagittarius', 185, 'A', 'ISFP', 'South Korean', 2019, '/images/members/txt-soobin.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'txt'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Yeonjun', 'Choi Yeon-jun (최연준)', 'TOMORROW X TOGETHER (TXT)', 'Rapper, Dancer, Vocalist', '1999-09-13', 'Virgo', 181, 'A', 'ENFP', 'South Korean', 2019, '/images/members/txt-yeonjun.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'txt'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Beomgyu', 'Choi Beom-gyu (최범규)', 'TOMORROW X TOGETHER (TXT)', 'Vocalist, Dancer, Rapper, Center, Visual', '2001-03-13', 'Pisces', 180, 'AB', 'INFJ', 'South Korean', 2019, '/images/members/txt-beomgyu.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'txt'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Taehyun', 'Kang Tae-hyun (강태현)', 'TOMORROW X TOGETHER (TXT)', 'Vocalist, Dancer, Rapper', '2002-02-05', 'Aquarius', 177, 'A', 'ESTP', 'South Korean', 2019, '/images/members/txt-taehyun.jpg', 1, 4
FROM `artists` a WHERE a.slug = 'txt'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'HueningKai', 'Kai Kamal Huening / Jung Kai (정카이)', 'TOMORROW X TOGETHER (TXT)', 'Vocalist, Dancer, Rapper, Visual, Maknae', '2002-08-14', 'Leo', 183, 'A', 'ISTP', 'Korean-American', 2019, '/images/members/txt-hueningkai.jpg', 1, 5
FROM `artists` a WHERE a.slug = 'txt'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Lee Know', 'Lee Min-ho (이민호)', 'Stray Kids', 'Dance Leader, Dancer, Vocalist, Rapper', '1998-10-25', 'Scorpio', 172, 'O', 'ISFP', 'South Korean', 2018, '/images/members/stray-kids-lee-know.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Changbin', 'Seo Chang-bin (서창빈)', 'Stray Kids', 'Rapper, Vocalist, Producer', '1999-08-11', 'Leo', 167, 'O', 'ESFP', 'South Korean', 2018, '/images/members/stray-kids-changbin.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Hyunjin', 'Hwang Hyun-jin (황현진)', 'Stray Kids', 'Dancer, Rapper, Vocalist, Visual', '2000-03-20', 'Pisces', 179, 'B', 'ESTP', 'South Korean', 2018, '/images/members/stray-kids-hyunjin.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Han', 'Han Ji-sung (한지성)', 'Stray Kids', 'Rapper, Vocalist, Producer', '2000-09-14', 'Virgo', 169, 'B', 'ISTP', 'South Korean', 2018, '/images/members/stray-kids-han.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Seungmin', 'Kim Seung-min (김승민)', 'Stray Kids', 'Main Vocalist', '2000-09-22', 'Virgo', 177, 'A', 'ISFJ', 'South Korean', 2018, '/images/members/stray-kids-seungmin.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'I.N', 'Yang Jeong-in (양정인)', 'Stray Kids', 'Vocalist, Maknae', '2001-02-08', 'Aquarius', 172, 'A', 'INFJ', 'South Korean', 2018, '/images/members/stray-kids-i-n.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Bang Chan', 'Christopher Bang / Bang Chan (방찬)', 'Stray Kids', 'Leader, Producer, Vocalist, Dancer, Rapper', '1997-10-03', 'Libra', 171, 'O', 'ENFJ', 'Korean-Australian', 2018, '/images/members/stray-kids-bang-chan.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Felix', 'Felix Lee / Lee Yong-bok (이용복)', 'Stray Kids', 'Dancer, Rapper, Sub Vocalist', '2000-09-15', 'Virgo', 171, 'AB', 'ENFJ', 'Korean-Australian', 2018, '/images/members/stray-kids-felix.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'stray-kids'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Giselle', 'Uchinaga Aeri (内永 枝利) / Kim Ae-ri', 'aespa', 'Main Rapper, Sub Vocalist', '2000-10-30', 'Scorpio', 164, 'O', 'ENFP', 'Korean-Japanese', 2020, '/images/members/aespa-giselle.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'aespa'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Ningning', 'Ning Yizhuo (宁艺卓) / Jeo Ye-tak', 'aespa', 'Main Vocalist, Maknae', '2002-10-23', 'Scorpio', 161, 'O', 'INFP', 'Chinese', 2020, '/images/members/aespa-ningning.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'aespa'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Karina', 'Yu Ji-min (유지민)', 'aespa', 'Leader, Main Dancer, Lead Rapper, Sub Vocalist, Face of the Group', '2000-04-11', 'Aries', 168, 'B', 'ENFP', 'South Korean', 2020, '/images/members/aespa-karina.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'aespa'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Winter', 'Kim Min-jeong (김민정)', 'aespa', 'Lead Vocalist, Lead Dancer, Visual', '2001-01-01', 'Capricorn', 164, 'A', 'ISFJ', 'South Korean', 2020, '/images/members/aespa-winter.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'aespa'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'RM', 'Kim Nam-joon (김남준)', 'BTS', 'Leader, Main Rapper', '1994-09-12', 'Virgo', 181, 'A', 'ENFP', 'South Korean', 2013, '/images/members/bts-rm.webp', 1, 1
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jin', 'Kim Seok-jin (김석진)', 'BTS', 'Sub Vocalist, Visual', '1992-12-04', 'Sagittarius', 179, 'O', 'INTP', 'South Korean', 2013, '/images/members/bts-jin.webp', 1, 2
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'SUGA', 'Min Yoon-gi (민윤기) / Agust D', 'BTS', 'Lead Rapper, Producer', '1993-03-09', 'Pisces', 174, 'O', 'ISTP', 'South Korean', 2013, '/images/members/bts-suga.webp', 1, 3
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'j-hope', 'Jung Ho-seok (정호석)', 'BTS', 'Main Dancer, Sub Rapper, Sub Vocalist', '1994-02-18', 'Aquarius', 177, 'A', 'INFJ', 'South Korean', 2013, '/images/members/bts-j-hope.webp', 1, 4
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jimin', 'Park Ji-min (박지민)', 'BTS', 'Main Dancer, Lead Vocalist', '1995-10-13', 'Libra', 174, 'A', 'ESTP', 'South Korean', 2013, '/images/members/bts-jimin.webp', 1, 5
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'V', 'Kim Tae-hyung (김태형)', 'BTS', 'Lead Dancer, Sub Vocalist, Visual', '1995-12-30', 'Capricorn', 179, 'AB', 'INFP', 'South Korean', 2013, '/images/members/bts-v.webp', 1, 6
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jungkook', 'Jeon Jung-kook (전정국)', 'BTS', 'Main Vocalist, Lead Dancer, Sub Rapper, Center, Maknae', '1997-09-01', 'Virgo', 179, 'A', 'INTP', 'South Korean', 2013, '/images/members/bts-jungkook.webp', 1, 7
FROM `artists` a WHERE a.slug = 'bts'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Ruka', 'Kawai Ruka (河井瑠花)', 'BABYMONSTER', 'Main Dancer, Main Rapper', '2002-03-20', 'Pisces', 158, 'O', 'ISTJ & ISFP', 'Japanese', 2023, '/images/members/babymonster-ruka.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Pharita', 'Pharita Chaikong (ภาริตา ไชยคง)', 'BABYMONSTER', 'Vocalist', '2005-08-26', 'Virgo', 167, 'A', 'INTP', 'Thai', 2023, '/images/members/babymonster-pharita.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Asa', 'Enami Asa (榎並杏紗)', 'BABYMONSTER', 'Main Rapper, Vocalist, Dancer', '2006-04-17', 'Aries', 161, 'O', 'INFP', 'Japanese', 2023, '/images/members/babymonster-asa.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Ahyeon', 'Jung Ahyeon (정아현)', 'BABYMONSTER', 'Main Vocalist, Rapper, Dancer, Visual, Center', '2007-04-11', 'Aries', 163, 'A', 'ISTJ', 'South Korean', 2023, '/images/members/babymonster-ahyeon.jpg', 1, 4
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Rami', 'Shin Haram (신하람)', 'BABYMONSTER', 'Main Vocalist', '2007-10-17', 'Libra', NULL, 'O', 'INFJ', 'South Korean', 2023, '/images/members/babymonster-rami.jpg', 1, 5
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Rora', 'Lee Dain (이다인)', 'BABYMONSTER', 'Lead Vocalist, Visual', '2008-08-14', 'Leo', 167, 'A', 'ENTP', 'South Korean', 2023, '/images/members/babymonster-rora.jpg', 1, 6
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Chiquita', 'Riracha Phondechaphiphat (ริราชา พรเดชาพิพัฒน์)', 'BABYMONSTER', 'Vocalist, Dancer, Rapper, Maknae', '2009-02-17', 'Aquarius', 165, 'O', 'ISTP', 'Thai', 2023, '/images/members/babymonster-chiquita.jpg', 1, 7
FROM `artists` a WHERE a.slug = 'babymonster'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Daniel Kim', 'Kim Daniel (김다니엘)', 'wave to earth', 'Guitar, Vocals, Songwriter', '1997-03-18', 'Pisces', 175, 'AB', 'INFJ', 'South Korean', 2019, '/images/members/wave-to-earth-daniel-kim.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'wave-to-earth'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'John Cha', 'Cha Soonjong (차순종)', 'wave to earth', 'Bass', '1997-08-13', 'Leo', 170, 'AB', 'ENFJ', 'South Korean', 2019, '/images/members/wave-to-earth-john-cha.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'wave-to-earth'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Dong Q', 'Shin Donggyu (신동규)', 'wave to earth', 'Drums', '1998-01-23', 'Aquarius', 170, NULL, 'ENFJ', 'South Korean', 2019, '/images/members/wave-to-earth-dong-q.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'wave-to-earth'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Sungjin', 'Park Sung-jin (박성진)', 'DAY6', 'Leader, Main Vocalist, Rhythm Guitarist', '1993-01-16', 'Capricorn', 177, 'A', 'ENFJ', 'South Korean', 2015, '/images/members/young-k-sungjin.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'young-k'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Wonpil', 'Kim Won-pil (김원필)', 'DAY6', 'Lead Vocalist, Visual, Keyboardist, Synthesizer', '1994-04-28', 'Taurus', 176, 'A', 'INFP', 'South Korean', 2015, '/images/members/young-k-wonpil.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'young-k'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Dowoon', 'Yoon Do-woon (윤도운)', 'DAY6', 'Drummer, Sub Vocalist, Maknae', '1995-08-25', 'Virgo', 177, 'O', 'ISFP', 'South Korean', 2015, '/images/members/young-k-dowoon.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'young-k'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Young K', 'Kang Young-hyun (강영현)', 'DAY6', 'Main Rapper, Main Vocalist, Bassist', '1993-12-19', 'Sagittarius', 180, 'B', 'ENTP', 'South Korean', 2015, '/images/members/young-k-young-k.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'young-k'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jaehyeong', 'Lee Jae-hyeong (이재형) / Jeff', 'The Rose', 'Bassist, Sub Vocalist, Visual, Maknae', '1994-11-03', 'Scorpio', 181, 'B', 'INFJ', 'South Korean', 2017, '/images/members/the-rose-jaehyeong.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'the-rose'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Woosung', 'Kim Woo-sung (김우성) / Sammy', 'The Rose', 'Leader, Lead Vocalist, Electric Guitarist', '1993-02-25', 'Pisces', 173, 'A', 'ENTJ', 'Korean-American', 2017, '/images/members/the-rose-woosung.jpg', 1, 1
FROM `artists` a WHERE a.slug = 'the-rose'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Dojoon', 'Park Do-joon (박도준) / Leo', 'The Rose', 'Main Vocalist, Keyboardist, Acoustic Guitarist', '1993-04-20', 'Taurus', 176, 'O', 'ENFP', 'South Korean', 2017, '/images/members/the-rose-dojoon.jpg', 1, 2
FROM `artists` a WHERE a.slug = 'the-rose'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Hajoon', 'Lee Ha-joon (이하준) / Dylan', 'The Rose', 'Drummer, Sub Vocalist', '1994-07-29', 'Leo', 178, 'AB', 'INFJ', 'South Korean', 2017, '/images/members/the-rose-hajoon.jpg', 1, 3
FROM `artists` a WHERE a.slug = 'the-rose'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Sungho', 'Park Sung-ho (박성호)', 'BOYNEXTDOOR', 'Main Vocalist', '2003-09-04', 'Virgo', 174, 'A', 'ENTJ', 'South Korean', 2023, '/images/members/boynextdoor-sungho.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'boynextdoor'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Riwoo', 'Lee Sang-hyeok (이상혁)', 'BOYNEXTDOOR', 'Main Dancer, Lead Vocalist', '2003-10-22', 'Libra', 172, 'A', 'ISFP', 'South Korean', 2023, '/images/members/boynextdoor-riwoo.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'boynextdoor'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jaehyun', 'Myung Jae-hyun (명재현)', 'BOYNEXTDOOR', 'Leader, Main Rapper, Vocalist', '2003-12-04', 'Sagittarius', 177, 'A', 'ENFP', 'South Korean', 2023, '/images/members/boynextdoor-jaehyun.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'boynextdoor'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Taesan', 'Han Dong-min (한동민)', 'BOYNEXTDOOR', 'Lead Rapper, Vocalist', '2004-08-10', 'Leo', 182, 'A', 'INTJ', 'South Korean', 2023, '/images/members/boynextdoor-taesan.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'boynextdoor'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Leehan', 'Kim Dong-hyun (김동현)', 'BOYNEXTDOOR', 'Vocalist', '2004-10-20', 'Libra', 180, 'O', 'ESFJ', 'South Korean', 2023, '/images/members/boynextdoor-leehan.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'boynextdoor'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Woonhak', 'Kim Woon-hak (김운학)', 'BOYNEXTDOOR', 'Vocalist, Maknae', '2006-11-29', 'Sagittarius', 184, 'A', 'ENFP', 'South Korean', 2023, '/images/members/boynextdoor-woonhak.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'boynextdoor'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jisoo', 'Kim Ji-soo (김지수)', 'BLACKPINK', 'Lead Vocalist, Visual', '1995-01-03', 'Capricorn', 162, 'A', 'INFJ', 'South Korean', 2016, '/images/members/blackpink-jisoo.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'blackpink'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jennie', 'Kim Jennie (김제니)', 'BLACKPINK', 'Main Rapper, Lead Vocalist', '1996-01-16', 'Capricorn', 163, 'B', 'INFP', 'South Korean', 2016, '/images/members/blackpink-jennie.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'blackpink'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Rosé', 'Roseanne Park / Park Chae-young (박채영)', 'BLACKPINK', 'Main Vocalist, Lead Dancer', '1997-02-11', 'Aquarius', 168, 'B', 'ENFP', 'Korean-New Zealander', 2016, '/images/members/blackpink-ros.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'blackpink'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Lisa', 'Lalisa Manobal (ลลิษา มโนบาล)', 'BLACKPINK', 'Main Dancer, Lead Rapper, Sub Vocalist, Maknae', '1997-03-27', 'Aries', 167, 'O', 'ESFJ', 'Thai', 2016, '/images/members/blackpink-lisa.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'blackpink'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Yeji', 'Hwang Ye-ji (황예지)', 'ITZY', 'Leader, Main Dancer, Lead Vocalist, Sub Rapper', '2000-05-26', 'Gemini', 167, 'A', 'ESFJ', 'South Korean', 2019, '/images/members/itzy-yeji.png', 1, 0
FROM `artists` a WHERE a.slug = 'itzy'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Lia', 'Choi Ji-su (최지수)', 'ITZY', 'Main Vocalist, Sub Rapper', '2000-07-21', 'Cancer', 162, 'AB', 'ENFJ', 'South Korean', 2019, '/images/members/itzy-lia.png', 1, 0
FROM `artists` a WHERE a.slug = 'itzy'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Ryujin', 'Shin Ryu-jin (신류진)', 'ITZY', 'Main Rapper, Lead Dancer, Sub Vocalist, Center', '2001-04-17', 'Aries', 164, 'B', 'INTJ', 'South Korean', 2019, '/images/members/itzy-ryujin.png', 1, 0
FROM `artists` a WHERE a.slug = 'itzy'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Chaeryeong', 'Lee Chae-ryeong (이채령)', 'ITZY', 'Main Dancer, Sub Vocalist, Sub Rapper', '2001-06-05', 'Gemini', 166, 'B', 'ISFJ', 'South Korean', 2019, '/images/members/itzy-chaeryeong.png', 1, 0
FROM `artists` a WHERE a.slug = 'itzy'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Yuna', 'Shin Yu-na (신유나)', 'ITZY', 'Lead Dancer, Lead Rapper, Sub Vocalist, Visual, Maknae', '2003-12-09', 'Sagittarius', 170, 'A', 'ENFP', 'South Korean', 2019, '/images/members/itzy-yuna.png', 1, 0
FROM `artists` a WHERE a.slug = 'itzy'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Mark', 'Mark Lee / Lee Min-hyung (이민형)', 'NCT DREAM', 'Leader, Main Rapper, Main Dancer, Sub Vocalist', '1999-08-02', 'Leo', 175, 'A', 'INFJ', 'Korean-Canadian', 2016, '/images/members/nct-dream-mark.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Renjun', 'Huang Renjun (黄仁俊) / Hwang In-jun (황인준)', 'NCT DREAM', 'Main Vocalist, Lead Dancer', '2000-03-23', 'Aries', 171, 'O', 'ESFJ', 'Chinese', 2016, '/images/members/nct-dream-renjun.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jeno', 'Lee Je-no (이제노)', 'NCT DREAM', 'Lead Dancer, Lead Rapper, Sub Vocalist, Visual', '2000-04-23', 'Taurus', 178, 'A', 'ISFP', 'South Korean', 2016, '/images/members/nct-dream-jeno.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Haechan', 'Lee Dong-hyuck (이동혁)', 'NCT DREAM', 'Main Vocalist, Lead Dancer', '2000-06-06', 'Gemini', 174, 'AB', 'ESTP', 'South Korean', 2016, '/images/members/nct-dream-haechan.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jaemin', 'Na Jae-min (나재민)', 'NCT DREAM', 'Lead Dancer, Sub Rapper, Sub Vocalist, Visual, Center', '2000-08-13', 'Leo', 177, 'AB', 'ISFJ', 'South Korean', 2016, '/images/members/nct-dream-jaemin.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Chenle', 'Zhong Chenle (钟辰乐) / Jong Jin-rak (종진락)', 'NCT DREAM', 'Main Vocalist', '2001-11-22', 'Sagittarius', 179, 'O', 'ENFP', 'Chinese', 2016, '/images/members/nct-dream-chenle.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jisung', 'Park Ji-sung (박지성)', 'NCT DREAM', 'Main Dancer, Sub Vocalist, Sub Rapper, Maknae', '2002-02-05', 'Aquarius', 180, 'O', 'INFP', 'South Korean', 2016, '/images/members/nct-dream-jisung.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'nct-dream'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Choi Hyun-suk', 'Choi Hyun-suk (최현석)', 'TREASURE', 'Leader, Main Rapper, Main Dancer', '1999-04-21', 'Taurus', 171, 'A', 'ENFP', 'South Korean', 2020, '/images/members/treasure-choi-hyun-suk.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Jihoon', 'Park Ji-hoon (박지훈)', 'TREASURE', 'Leader, Lead Dancer, Lead Vocalist', '2000-03-14', 'Pisces', 178, 'B', 'ENTJ', 'South Korean', 2020, '/images/members/treasure-jihoon.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Yoshi', 'Kanemoto Yoshinori (金本 芳典) / Kim Bang-jeon', 'TREASURE', 'Rapper, Dancer', '2000-05-15', 'Taurus', 179, 'A', 'INFP', 'Japanese', 2020, '/images/members/treasure-yoshi.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Junkyu', 'Kim Jun-kyu (김준규)', 'TREASURE', 'Vocalist, Visual', '2000-09-09', 'Virgo', 178, 'O', 'INFP', 'South Korean', 2020, '/images/members/treasure-junkyu.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Yoon Jae-hyuk', 'Yoon Jae-hyuk (윤재혁)', 'TREASURE', 'Vocalist, Dancer', '2001-07-23', 'Leo', 178, 'O', 'INFP', 'South Korean', 2020, '/images/members/treasure-yoon-jae-hyuk.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Asahi', 'Hamada Asahi (浜田 朝光)', 'TREASURE', 'Vocalist, Visual, Producer', '2001-08-20', 'Leo', 173, 'AB', 'INFP', 'Japanese', 2020, '/images/members/treasure-asahi.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Doyoung', 'Kim Do-young (김도영)', 'TREASURE', 'Main Dancer, Vocalist', '2003-12-04', 'Sagittarius', 177, 'B', 'ENTJ', 'South Korean', 2020, '/images/members/treasure-doyoung.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Haruto', 'Watanabe Haruto (渡辺 温斗)', 'TREASURE', 'Main Rapper, Visual', '2004-04-05', 'Aries', 183, 'B', 'ISFP', 'Japanese', 2020, '/images/members/treasure-haruto.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Park Jeong-woo', 'Park Jeong-woo (박정우)', 'TREASURE', 'Main Vocalist', '2004-09-28', 'Libra', 181, 'O', 'ISFP', 'South Korean', 2020, '/images/members/treasure-park-jeong-woo.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'So Jung-hwan', 'So Jung-hwan (소정환)', 'TREASURE', 'Lead Dancer, Vocalist, Maknae', '2005-02-18', 'Aquarius', 180, 'B', 'ENFP', 'South Korean', 2020, '/images/members/treasure-so-jung-hwan.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'treasure'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'TAEYEON', 'Kim Tae-yeon (김태연)', 'TAEYEON', 'Leader, Main Vocalist (Girls\' Generation & Solo Master)', '1989-03-09', 'Pisces', 160, 'A', 'INFJ', 'South Korean', 2007, '/images/members/taeyeon-taeyeon.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'taeyeon'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Leeteuk', 'Park Jeong-su (박정수)', 'SUPER JUNIOR', 'Leader, Sub Vocalist, Sub Rapper', '1983-07-01', 'Cancer', 178, 'A', 'ENTJ', 'South Korean', 2005, '/images/members/super-junior-leeteuk.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Kim Hee-chul', 'Kim Hee-chul (김희철)', 'SUPER JUNIOR', 'Sub Vocalist, Sub Rapper', '1983-07-10', 'Cancer', 178, 'AB', 'INFP', 'South Korean', 2005, '/images/members/super-junior-kim-hee-chul.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Yesung', 'Kim Jong-woon (김종운)', 'SUPER JUNIOR', 'Main Vocalist', '1984-08-24', 'Virgo', 177, 'AB', 'INFJ', 'South Korean', 2005, '/images/members/super-junior-yesung.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Shindong', 'Shin Dong-hee (신동희)', 'SUPER JUNIOR', 'Lead Rapper, Lead Dancer, Sub Vocalist', '1985-09-28', 'Libra', 178, 'O', 'ISFP', 'South Korean', 2005, '/images/members/super-junior-shindong.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Eunhyuk', 'Lee Hyuk-jae (이혁재)', 'SUPER JUNIOR', 'Main Rapper, Main Dancer, Sub Vocalist', '1986-04-04', 'Aries', 176, 'O', 'ISFP', 'South Korean', 2005, '/images/members/super-junior-eunhyuk.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Donghae', 'Lee Dong-hae (이동해)', 'SUPER JUNIOR', 'Lead Vocalist, Lead Dancer, Sub Rapper', '1986-10-15', 'Libra', 175, 'A', 'ENFJ', 'South Korean', 2005, '/images/members/super-junior-donghae.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Siwon', 'Choi Si-won (최시원)', 'SUPER JUNIOR', 'Sub Vocalist, Visual, Center', '1986-04-07', 'Aries', 183, 'B', 'ENTJ', 'South Korean', 2005, '/images/members/super-junior-siwon.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Ryeowook', 'Kim Ryeo-wook (김려욱)', 'SUPER JUNIOR', 'Main Vocalist', '1987-06-21', 'Gemini', 173, 'O', 'INFP', 'South Korean', 2005, '/images/members/super-junior-ryeowook.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);
INSERT INTO `members` (`artist_id`, `stage_name`, `birth_name`, `group_name`, `position`, `dob`, `zodiac`, `height_cm`, `blood_type`, `mbti`, `nationality`, `debut_year`, `photo`, `is_active`, `sort_order`)
SELECT a.id, 'Kyuhyun', 'Cho Kyu-hyun (조규현)', 'SUPER JUNIOR', 'Main Vocalist, Maknae', '1988-02-03', 'Aquarius', 180, 'A', 'ESFJ', 'South Korean', 2006, '/images/members/super-junior-kyuhyun.jpg', 1, 0
FROM `artists` a WHERE a.slug = 'super-junior'
ON DUPLICATE KEY UPDATE
  `birth_name` = VALUES(`birth_name`),
  `position` = VALUES(`position`),
  `dob` = VALUES(`dob`),
  `zodiac` = VALUES(`zodiac`),
  `height_cm` = VALUES(`height_cm`),
  `blood_type` = VALUES(`blood_type`),
  `mbti` = VALUES(`mbti`),
  `nationality` = VALUES(`nationality`),
  `debut_year` = VALUES(`debut_year`),
  `photo` = VALUES(`photo`),
  `sort_order` = VALUES(`sort_order`);

-- 6. Remove orphaned members
DELETE FROM `members` WHERE `artist_id` NOT IN (SELECT `id` FROM `artists`);
