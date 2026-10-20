UPDATE `event_categories` SET `slug`='concert', `badge_color`='pink',
  `description`='Full-scale live stadium and arena concert tours.'
WHERE `id`=1;

UPDATE `event_categories` SET `slug`='fan-meeting', `badge_color`='purple',
  `description`='Intimate stage sessions, hi-touch, and interactive fan engagements.'
WHERE `id`=2;

UPDATE `event_categories` SET `slug`='festival', `badge_color`='indigo',
  `description`='Multi-artist K-pop celebrations, music bank showcases, and open-air events.'
WHERE `id`=3;

UPDATE `event_categories` SET `slug`='cupsleeve', `badge_color`='amber',
  `description`='Fanbase cafe gatherings, photo exhibitions, and anniversary cupsleeve projects.'
WHERE `id`=4;

INSERT INTO `event_categories` (`name`, `slug`, `badge_color`, `description`)
SELECT 'Birthday Event', 'birthday-event', 'rose',
       'Birthday cafe events and fan-organised celebrations for an idol''s birthday.'
WHERE NOT EXISTS (SELECT 1 FROM `event_categories` WHERE `slug` = 'birthday-event');

INSERT INTO `event_categories` (`name`, `slug`, `badge_color`, `description`)
SELECT 'Fan Gathering', 'fan-gathering', 'cyan',
       'Community meetups, group orders, and lightstick fan projects.'
WHERE NOT EXISTS (SELECT 1 FROM `event_categories` WHERE `slug` = 'fan-gathering');

INSERT INTO `event_categories` (`name`, `slug`, `badge_color`, `description`)
SELECT 'Exhibition', 'exhibition', 'emerald',
       'Photo exhibitions, gallery pop-ups, and fan art displays.'
WHERE NOT EXISTS (SELECT 1 FROM `event_categories` WHERE `slug` = 'exhibition');

INSERT INTO `event_categories` (`name`, `slug`, `badge_color`, `description`)
SELECT 'Pop-up Event', 'pop-up-event', 'slate',
       'Official merchandise pop-up stores and interactive zones.'
WHERE NOT EXISTS (SELECT 1 FROM `event_categories` WHERE `slug` = 'pop-up-event');

INSERT INTO `event_categories` (`name`, `slug`, `badge_color`, `description`)
SELECT 'Other K-Pop Events', 'other', 'gray',
       'Miscellaneous K-Pop community activities and watch parties.'
WHERE NOT EXISTS (SELECT 1 FROM `event_categories` WHERE `slug` = 'other');

SELECT `id`, `name`, `slug`, `badge_color`, `description`
FROM `event_categories` ORDER BY `id`;
