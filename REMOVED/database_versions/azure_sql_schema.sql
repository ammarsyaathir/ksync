-- ============================================================================
-- K-Sync Malaysia: Azure SQL Database (T-SQL / MSSQL) Production Schema
-- 100% Free Lifetime Tier Compatible
-- Total Tables: 10 Core Tables
-- ============================================================================

-- Drop Foreign Keys & Tables in reverse dependency order
IF OBJECT_ID('dbo.notifications', 'U') IS NOT NULL DROP TABLE dbo.notifications;
IF OBJECT_ID('dbo.activity_logs', 'U') IS NOT NULL DROP TABLE dbo.activity_logs;
IF OBJECT_ID('dbo.reports', 'U') IS NOT NULL DROP TABLE dbo.reports;
IF OBJECT_ID('dbo.event_chat_messages', 'U') IS NOT NULL DROP TABLE dbo.event_chat_messages;
IF OBJECT_ID('dbo.saved_events', 'U') IS NOT NULL DROP TABLE dbo.saved_events;
IF OBJECT_ID('dbo.events', 'U') IS NOT NULL DROP TABLE dbo.events;
IF OBJECT_ID('dbo.event_categories', 'U') IS NOT NULL DROP TABLE dbo.event_categories;
IF OBJECT_ID('dbo.artists', 'U') IS NOT NULL DROP TABLE dbo.artists;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL DROP TABLE dbo.roles;

-- --------------------------------------------------------
-- 1. Table: roles
-- --------------------------------------------------------
CREATE TABLE dbo.roles (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(50) UNIQUE NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE()
);

SET IDENTITY_INSERT dbo.roles ON;
INSERT INTO dbo.roles (id, name) VALUES 
(1, 'Admin'),
(2, 'Organizer'),
(3, 'Fan');
SET IDENTITY_INSERT dbo.roles OFF;

-- --------------------------------------------------------
-- 2. Table: users
-- --------------------------------------------------------
CREATE TABLE dbo.users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  role_id INT NOT NULL DEFAULT 3,
  full_name NVARCHAR(100) NOT NULL,
  username NVARCHAR(50) UNIQUE NOT NULL,
  email NVARCHAR(100) UNIQUE NOT NULL,
  password_hash NVARCHAR(255) NOT NULL,
  bio NVARCHAR(MAX),
  profile_image NVARCHAR(255),
  organization_name NVARCHAR(150),
  organization_type NVARCHAR(50) DEFAULT 'Fanclub',
  social_handle NVARCHAR(50),
  social_url NVARCHAR(255),
  is_verified_organizer TINYINT DEFAULT 0,
  verification_proof NVARCHAR(MAX),
  verification_notes NVARCHAR(MAX),
  location NVARCHAR(100) DEFAULT 'Kuala Lumpur',
  buddy_preference NVARCHAR(255) DEFAULT 'Looking for event buddy',
  status NVARCHAR(20) DEFAULT 'ACTIVE',
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_users_roles FOREIGN KEY (role_id) REFERENCES dbo.roles(id)
);

-- Seed initial accounts (admin123, fan123)
SET IDENTITY_INSERT dbo.users ON;
INSERT INTO dbo.users (id, role_id, full_name, username, email, password_hash, bio, profile_image, organization_name, organization_type, social_handle, social_url, is_verified_organizer, status) VALUES 
(1, 1, 'System Administrator', 'admin', 'admin@ksync.my', '$2a$10$wEeVgqVvK8X9hQ2x1oH2xe7Y2mGg4qGk1F6eB9J4a2e5c8e1a4d7.', 'Chief Platform Administrator for K-Sync Malaysia.', '', 'K-Sync Platform Authority', 'Promoter', '@ksync_my', 'https://ksync.my', 1, 'ACTIVE'),
(2, 2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2a$10$wEeVgqVvK8X9hQ2x1oH2xe7Y2mGg4qGk1F6eB9J4a2e5c8e1a4d7.', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', '', 'Starline Events Malaysia', 'Promoter', '@Starline_MY', 'https://starline.my', 1, 'ACTIVE'),
(3, 3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2a$10$fV2hF4eA9qZ1xP3mK5oT4e7Y2mGg4qGk1F6eB9J4a2e5c8e1a4d7.', 'SEVENTEEN Carat Malaysia Fan Union Lead', '', 'CARAT Malaysia Fan Union', 'Fanclub', '@Carat_MY', 'https://caratmalaysia.carrd.co', 1, 'ACTIVE'),
(4, 1, 'Ammar Syaathir', 'ammarsyaathir', 'ammarsyaathir@gmail.com', '$2a$10$wEeVgqVvK8X9hQ2x1oH2xe7Y2mGg4qGk1F6eB9J4a2e5c8e1a4d7.', 'Platform Admin & Lead Developer.', '', 'K-Sync Malaysia Core', 'Promoter', '@ammarsyaathir', 'https://ksync.my', 1, 'ACTIVE');
SET IDENTITY_INSERT dbo.users OFF;

-- --------------------------------------------------------
-- 3. Table: artists
-- --------------------------------------------------------
CREATE TABLE dbo.artists (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  korean_name NVARCHAR(100),
  group_type NVARCHAR(50) DEFAULT 'Boy Group',
  agency NVARCHAR(100),
  debut_year INT,
  image_url NVARCHAR(255),
  description NVARCHAR(MAX),
  members NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE()
);

SET IDENTITY_INSERT dbo.artists ON;
INSERT INTO dbo.artists (id, name, korean_name, group_type, agency, debut_year, image_url, description, members) VALUES 
(1, 'SEVENTEEN', N'세븐틴', 'Boy Group', 'PLEDIS Entertainment', 2015, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', '13-member self-producing powerhouse under Pledis Entertainment.', '[{"name":"S.Coups","role":"Leader, Rapper"},{"name":"Jeonghan","role":"Vocalist"},{"name":"Joshua","role":"Vocalist"},{"name":"Jun","role":"Dancer"},{"name":"Hoshi","role":"Performance Leader"},{"name":"Wonwoo","role":"Rapper"},{"name":"Woozi","role":"Vocal Leader, Producer"},{"name":"DK","role":"Main Vocalist"},{"name":"Mingyu","role":"Rapper"},{"name":"The8","role":"Dancer"},{"name":"Seungkwan","role":"Main Vocalist"},{"name":"Vernon","role":"Rapper"},{"name":"Dino","role":"Main Dancer"}]'),
(2, 'TWICE', N'트와이스', 'Girl Group', 'JYP Entertainment', 2015, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'Globally acclaimed 9-member girl group under JYP Entertainment.', '[{"name":"Nayeon","role":"Lead Vocalist"},{"name":"Jeongyeon","role":"Lead Vocalist"},{"name":"Momo","role":"Main Dancer"},{"name":"Sana","role":"Sub Vocalist"},{"name":"Jihyo","role":"Leader, Main Vocalist"},{"name":"Mina","role":"Main Dancer"},{"name":"Dahyun","role":"Lead Rapper"},{"name":"Chaeyoung","role":"Main Rapper"},{"name":"Tzuyu","role":"Lead Dancer, Maknae"}]'),
(3, 'TXT (TOMORROW X TOGETHER)', N'투모로우바이투게더', 'Boy Group', 'BIGHIT MUSIC', 2019, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'Fourth-generation leaders under BIGHIT MUSIC.', '[{"name":"Soobin","role":"Leader"},{"name":"Yeonjun","role":"Dancer, Rapper, Vocalist"},{"name":"Beomgyu","role":"Vocalist, Dancer"},{"name":"Taehyun","role":"Main Vocalist"},{"name":"Huening Kai","role":"Vocalist, Maknae"}]');
SET IDENTITY_INSERT dbo.artists OFF;

-- --------------------------------------------------------
-- 4. Table: event_categories
-- --------------------------------------------------------
CREATE TABLE dbo.event_categories (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  slug NVARCHAR(100) UNIQUE NOT NULL,
  badge_color NVARCHAR(50) DEFAULT 'pink',
  description NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE()
);

SET IDENTITY_INSERT dbo.event_categories ON;
INSERT INTO dbo.event_categories (id, name, slug, badge_color, description) VALUES 
(1, 'Concert', 'concert', 'pink', 'Full-scale live stadium and arena concert tours.'),
(2, 'Fan Meeting', 'fan-meeting', 'purple', 'Intimate stage sessions, hi-touch, and interactive fan moments.'),
(3, 'Festival', 'festival', 'indigo', 'Multi-artist K-pop celebrations, music bank, and open-air festivals.'),
(4, 'Cupsleeve Event', 'cupsleeve', 'amber', 'Fanbase cafe gatherings, photo exhibitions, and anniversary celebrations.');
SET IDENTITY_INSERT dbo.event_categories OFF;

-- --------------------------------------------------------
-- 5. Table: events
-- --------------------------------------------------------
CREATE TABLE dbo.events (
  id INT IDENTITY(1,1) PRIMARY KEY,
  organizer_id INT NOT NULL DEFAULT 2,
  artist_id INT,
  category_id INT NOT NULL,
  event_name NVARCHAR(200) NOT NULL,
  description NVARCHAR(MAX),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  venue_name NVARCHAR(150) NOT NULL,
  address NVARCHAR(MAX),
  city NVARCHAR(100) NOT NULL,
  state NVARCHAR(100) NOT NULL,
  ticket_info NVARCHAR(MAX),
  event_rules NVARCHAR(MAX),
  official_url NVARCHAR(255),
  poster_image NVARCHAR(255),
  event_status NVARCHAR(30) DEFAULT 'UPCOMING',
  verification_status NVARCHAR(30) DEFAULT 'VERIFIED',
  rejection_reason NVARCHAR(MAX),
  tracking_code NVARCHAR(50) UNIQUE,
  promoter_name NVARCHAR(150),
  submitter_name NVARCHAR(150),
  submitter_email NVARCHAR(150),
  submitter_social NVARCHAR(100),
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_events_users FOREIGN KEY (organizer_id) REFERENCES dbo.users(id),
  CONSTRAINT FK_events_artists FOREIGN KEY (artist_id) REFERENCES dbo.artists(id),
  CONSTRAINT FK_events_categories FOREIGN KEY (category_id) REFERENCES dbo.event_categories(id)
);

SET IDENTITY_INSERT dbo.events ON;
INSERT INTO dbo.events (id, organizer_id, artist_id, category_id, event_name, description, event_date, start_time, end_time, venue_name, address, city, state, ticket_info, event_rules, official_url, poster_image, event_status, verification_status, tracking_code, promoter_name, submitter_name, submitter_email, submitter_social) VALUES 
(1, 2, 3, 1, 'TXT (TOMORROW X TOGETHER) WORLD TOUR IN KUALA LUMPUR', 'BIGHIT MUSIC and Starline Events are thrilled to announce TXT in Kuala Lumpur! Experience spectacular live stages, fan chants, and exclusive soundcheck sessions with MOA Malaysia.', '2026-12-12', '19:30', '22:30', 'Zepp Kuala Lumpur', 'BBCC, 2, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'VIP Soundcheck: RM888 | Cat 1: RM688 | Cat 2: RM488 | Cat 3: RM288', '1. MOABONG official lightsticks allowed.
2. No professional DSLRs or telephoto lenses permitted.
3. Soundcheck queue starts at 15:00 at Entrance A.', 'https://ibighit.com/txt', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'UPCOMING', 'VERIFIED', 'KS-2026-TXT001', 'Starline Events Malaysia', 'Starline Events Malaysia', 'noreply@ksync.my', '@Starline_MY'),
(23, 3, 1, 4, 'CARAT Malaysia: SEVENTEEN 9th Anniversary Cafe Cupsleeve & Photocard Gathering', 'Celebrate SEVENTEEN 9th Debut Anniversary with fellow Malaysian CARATs! Free special edition cupsleeves, fan-designed photocard sets, lucky draw photobooks, and SEVENTEEN playlist playing all afternoon.', '2026-11-28', '11:00', '18:00', 'After Black Cafe, Sunway Geo Avenue', 'A-01-02, Sunway Geo Avenue, Jalan Lagoon Selatan, Bandar Sunway', 'Subang Jaya', 'Selangor', 'FREE ENTRY (Purchase 1 drink at cafe counter to receive official cupsleeve + photocard pack)', '1. Open to all Malaysian CARATs and K-Pop fans.
2. Trading of official photocards welcome.
3. Respect cafe staff and keep seating areas clean.', 'https://x.com/Carat_MY', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'UPCOMING', 'VERIFIED', 'KS-2026-SVT009', 'CARAT Malaysia Fan Union', 'CARAT Malaysia Fan Union', 'carat.malaysia.fanbase@gmail.com', '@Carat_MY');
SET IDENTITY_INSERT dbo.events OFF;

-- --------------------------------------------------------
-- 6. Table: saved_events
-- --------------------------------------------------------
CREATE TABLE dbo.saved_events (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  saved_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT UQ_user_event UNIQUE (user_id, event_id),
  CONSTRAINT FK_saved_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE,
  CONSTRAINT FK_saved_events FOREIGN KEY (event_id) REFERENCES dbo.events(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- 7. Table: event_chat_messages
-- --------------------------------------------------------
CREATE TABLE dbo.event_chat_messages (
  id INT IDENTITY(1,1) PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  message NVARCHAR(MAX) NOT NULL,
  is_organizer TINYINT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_chat_events FOREIGN KEY (event_id) REFERENCES dbo.events(id) ON DELETE CASCADE,
  CONSTRAINT FK_chat_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);

INSERT INTO dbo.event_chat_messages (event_id, user_id, message, is_organizer) VALUES 
(23, 3, 'Annyeong CARATs! Welcome to our 9th Anniversary Gathering discussion room!', 1);

-- --------------------------------------------------------
-- 8. Table: reports
-- --------------------------------------------------------
CREATE TABLE dbo.reports (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT,
  event_id INT,
  report_type NVARCHAR(50) DEFAULT 'EVENT',
  reason NVARCHAR(255) NOT NULL,
  details NVARCHAR(MAX),
  evidence_url NVARCHAR(MAX),
  admin_action NVARCHAR(100),
  admin_notes NVARCHAR(MAX),
  resolved_by INT,
  resolved_at DATETIME2,
  status NVARCHAR(30) DEFAULT 'PENDING',
  created_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_reports_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE SET NULL,
  CONSTRAINT FK_reports_events FOREIGN KEY (event_id) REFERENCES dbo.events(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- 9. Table: activity_logs
-- --------------------------------------------------------
CREATE TABLE dbo.activity_logs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT,
  action NVARCHAR(50) NOT NULL,
  entity_type NVARCHAR(50),
  entity_id INT,
  description NVARCHAR(MAX),
  ip_address NVARCHAR(50),
  created_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_logs_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- 10. Table: notifications
-- --------------------------------------------------------
CREATE TABLE dbo.notifications (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  title NVARCHAR(150) NOT NULL,
  message NVARCHAR(MAX) NOT NULL,
  link NVARCHAR(255),
  is_read TINYINT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT FK_notif_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);
