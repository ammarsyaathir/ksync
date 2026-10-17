-- PostgreSQL Database Schema & Initial Seeding Script for K-Sync Malaysia
-- Compatible with Supabase, Cloudflare Hyperdrive, Neon PostgreSQL, and local PostgreSQL

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT,
    profile_image TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    organization_name TEXT,
    organization_type VARCHAR(50) DEFAULT 'Fanclub',
    social_handle VARCHAR(100),
    social_url TEXT,
    verification_proof TEXT,
    is_verified_organizer INTEGER DEFAULT 0,
    verification_notes TEXT,
    location VARCHAR(100) DEFAULT 'Kuala Lumpur',
    buddy_preference TEXT DEFAULT 'Looking for event buddy',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Artists Table
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    group_type VARCHAR(50) DEFAULT 'Boy Group',
    image_url TEXT,
    agency VARCHAR(150),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Event Categories Table
CREATE TABLE IF NOT EXISTS event_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    badge_color VARCHAR(30) DEFAULT 'purple',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    map_link TEXT,
    capacity INTEGER DEFAULT 0,
    transit_info TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
    category_id INTEGER NOT NULL REFERENCES event_categories(id) ON DELETE RESTRICT,
    venue_id INTEGER REFERENCES venues(id) ON DELETE SET NULL,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    venue_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Malaysia',
    tour_name TEXT,
    promoter_name TEXT,
    official_ticket_url TEXT,
    official_source_url TEXT,
    agency_announcement_url TEXT,
    multiple_posters TEXT,
    promotional_requests TEXT,
    ticket_info TEXT,
    event_rules TEXT,
    official_url TEXT,
    poster_image TEXT,
    fan_chant_url TEXT,
    event_status VARCHAR(20) DEFAULT 'UPCOMING',
    verification_status VARCHAR(20) DEFAULT 'VERIFIED',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Saved Events Table
CREATE TABLE IF NOT EXISTS saved_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- 8. Event Updates Table
CREATE TABLE IF NOT EXISTS event_updates (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    update_title VARCHAR(255) NOT NULL,
    update_description TEXT NOT NULL,
    update_type VARCHAR(50) DEFAULT 'General Announcement',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    update_id INTEGER REFERENCES event_updates(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Event Reports Table
CREATE TABLE IF NOT EXISTS event_reports (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    report_reason VARCHAR(100) NOT NULL,
    report_details TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    organizer_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Event Chat Messages Table
CREATE TABLE IF NOT EXISTS event_chat_messages (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_organizer INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Event Changes History Table
CREATE TABLE IF NOT EXISTS event_changes (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    changed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Event Checkins Table
CREATE TABLE IF NOT EXISTS checkins (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- 15. Event Interest Table (K-Sync Event Buddy Module)
CREATE TABLE IF NOT EXISTS event_interest (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_status VARCHAR(50) DEFAULT 'interested',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- 16. Buddy Requests Table
CREATE TABLE IF NOT EXISTS buddy_requests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMPTZ
);

-- 17. Event Groups Table
CREATE TABLE IF NOT EXISTS event_groups (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    group_name VARCHAR(150) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. Event Group Members Table
CREATE TABLE IF NOT EXISTS event_group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES event_groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    UNIQUE(group_id, user_id)
);

-- 19. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    group_id INTEGER REFERENCES event_groups(id) ON DELETE CASCADE,
    conversation_type VARCHAR(20) DEFAULT 'DIRECT',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 20. Conversation Members Table
CREATE TABLE IF NOT EXISTS conversation_members (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

-- 21. Buddy Messages Table
CREATE TABLE IF NOT EXISTS buddy_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 22. User Reports Table (Safety Moderation)
CREATE TABLE IF NOT EXISTS user_reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

-- INITIAL SEEDING DATA
INSERT INTO roles (id, name) VALUES 
(1, 'Admin'), 
(2, 'Organizer'), 
(3, 'Fan')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, role_id, full_name, username, email, password_hash, bio, organization_name, organization_type, social_handle, social_url, is_verified_organizer, location) VALUES
(1, 1, 'System Admin', 'admin', 'admin@ksync.my', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1zYyB0Jv8mYl23/6.0dFv2K3/xZ71m6', 'System Administrator', 'K-Sync Platform Admin', 'System Administrator', '@ksync_admin', 'https://ksync.my', 1, 'Kuala Lumpur'),
(2, 2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1zYyB0Jv8mYl23/6.0dFv2K3/xZ71m6', 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', 'Starline Events Malaysia', 'Concert Organizer', '@starline_my', 'https://x.com/starline_my', 1, 'Kuala Lumpur'),
(3, 3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1zYyB0Jv8mYl23/6.0dFv2K3/xZ71m6', 'Passionate K-Pop fan & SEVENTEEN Carat in KL!', NULL, 'Fan', NULL, NULL, 0, 'Selangor'),
(4, 2, 'MOAbasedMY (TXT Malaysia Fanclub)', 'moabasedmy', 'txt_fanclub@ksync.my', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1zYyB0Jv8mYl23/6.0dFv2K3/xZ71m6', 'Official Malaysian fanclub base for TOMORROW X TOGETHER (TXT).', 'MOAbasedMY - TXT Fanclub Malaysia', 'Official Fanclub', '@MOAbasedMY', 'https://x.com/MOAbasedMY', 1, 'Kuala Lumpur')
ON CONFLICT (id) DO NOTHING;

INSERT INTO artists (id, name, group_type, image_url, agency, description) VALUES
(1, 'SEVENTEEN', 'Boy Group', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop', 'PLEDIS Entertainment', '13-member South Korean boy group known for self-producing music.'),
(2, 'TWICE', 'Girl Group', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop', 'JYP Entertainment', 'Global sensation 9-member South Korean girl group.'),
(3, 'IU (Lee Ji-eun)', 'Soloist', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop', 'EDAM Entertainment', 'Renowned South Korean singer-songwriter and actress.'),
(4, 'ENHYPEN', 'Boy Group', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop', 'BELIFT LAB', '7-member global powerhouse boy group.'),
(5, 'IVE', 'Girl Group', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop', 'Starship Entertainment', '6-member chart-topping girl group.'),
(6, 'TOMORROW X TOGETHER (TXT)', 'Boy Group', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop', 'BIGHIT MUSIC', 'Gen Z icons 5-member boy group.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_categories (id, name, slug, badge_color, description) VALUES
(1, 'Concert', 'concert', 'purple', 'Full-scale live musical performances and arena tours.'),
(2, 'Fan Meeting', 'fan-meeting', 'pink', 'Interactive stage shows with games, Q&A, and live stages.'),
(3, 'Cupsleeve Event', 'cupsleeve-event', 'rose', 'Fan-organized cafe gatherings celebrating birthdays and anniversaries.'),
(4, 'Birthday Event', 'birthday-event', 'amber', 'Special birthday celebrations with fan displays and giveaways.'),
(5, 'Fan Gathering', 'fan-gathering', 'indigo', 'Community meetups and lightstick fan projects.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, address, city, state, map_link, capacity, transit_info) VALUES
(1, 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Axiata+Arena', 16000, 'LRT Sri Petaling Line -> Bukit Jalil Station (5-min covered walkway bridge to Gate A)'),
(2, 'National Stadium Bukit Jalil', 'Bukit Jalil National Sports Complex', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=National+Stadium+Bukit+Jalil', 87000, 'LRT Sri Petaling Line -> Bukit Jalil Station (Direct Gate A walkway access)'),
(3, 'Zepp Kuala Lumpur', 'BBCC, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Zepp+Kuala+Lumpur', 2500, 'LRT Sri Petaling / KL Monorail -> Hang Tuah Station (Direct BBCC link bridge)'),
(4, 'Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza, Jalan Sultan Ismail', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Mega+Star+Arena', 5000, 'MRT Kajang Line -> Bukit Bintang Station / Monorail Imbi Station (3-min walk)'),
(5, 'Subang Parade Cafe Zone', 'Jalan SS 16/1, Subang Jaya', 'Subang Jaya', 'Selangor', 'https://maps.google.com/?q=Subang+Parade', 200, 'KTM Komuter / LRT Kelana Jaya Line -> Subang Jaya Station (3-min walk)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO events (id, organizer_id, artist_id, category_id, venue_id, event_name, description, event_date, start_time, end_time, venue_name, address, city, state, country, tour_name, promoter_name, ticket_info, event_rules, official_url, poster_image, verification_status) VALUES
(1, 2, 1, 1, 1, 'SEVENTEEN [RIGHT HERE] WORLD TOUR IN KUALA LUMPUR', 'Global powerhouse SEVENTEEN returns to Malaysia for their massive [RIGHT HERE] World Tour! Experience unmatched energy, spectacular stage production, and 13-member harmony live at Axiata Arena Bukit Jalil.', '2026-11-14', '18:00:00', '21:30:00', 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'Malaysia', 'SEVENTEEN [RIGHT HERE] WORLD TOUR', 'Starline Events Malaysia', 'VIP Soundcheck: RM1,088 | CAT 1: RM888 | CAT 2: RM688 | CAT 3: RM488.', '1. Lightsticks allowed (Carat Bong v2/v3).\n2. No professional cameras.\n3. Water bottles under 500ml only.', 'https://pledis.co.kr/seventeen-tour-kl', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', 'VERIFIED'),
(2, 2, 2, 2, 1, 'TWICE 9TH ANNIVERSARY FAN MEETING [ONCE UPON A TIME] IN KL', 'Join TWICE in Kuala Lumpur for an unforgettable anniversary fan meeting featuring games, special stages, interactive Q&A, and exclusive soundcheck for VIP pass holders.', '2026-10-24', '17:00:00', '20:00:00', 'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'Malaysia', 'ONCE UPON A TIME FAN MEETING', 'Starline Events Malaysia', 'VIP Fan Pass: RM799 | Standard Fan Pass: RM499 | Upper Tier: RM299.', '1. Candybong Z lightsticks encouraged.\n2. Banners must not exceed 40x20cm.', 'https://twice.jype.com/fanmeeting-kl', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop', 'VERIFIED'),
(3, 2, 3, 3, 5, 'Uaena Joy: IU 33rd Birthday Cupsleeve & Photo Exhibition', 'A cozy fan-organized cupsleeve event in Subang Jaya celebrating IU! Purchase any drink to receive a custom design cupsleeve, photo cards, mini poster, and sticker pack.', '2026-05-16', '11:00:00', '18:00:00', 'Subang Parade Cafe Zone', 'Jalan SS 16/1, Subang Jaya', 'Subang Jaya', 'Selangor', 'Malaysia', 'IU Birthday Project', 'Uaena Malaysia Base', 'Free Admission with drink order (RM 12 - RM 18 per drink).', '1. First 100 fans receive early-bird keyring.', 'https://twitter.com/malaysia_uaena', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop', 'VERIFIED'),
(4, 4, 6, 2, 3, 'TXT (TOMORROW X TOGETHER) SWEET MIRAGE FAN GATHERING KL', 'An intimate fan gathering celebrating TXT album release with MOA Malaysia! High-definition screening of world tour highlights, random play dance, and exclusive lucky draw prizes.', '2026-12-05', '14:00:00', '17:30:00', 'Zepp Kuala Lumpur', 'BBCC, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'Malaysia', 'SWEET MIRAGE FAN PROJECT', 'MOAbasedMY', 'MOA Ticket: RM120 (Includes official wristband & photocard set).', '1. MOABONG lightsticks permitted.\n2. Random Play Dance starts at 13:00.', 'https://txt-moa-malaysia.com', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop', 'VERIFIED')
ON CONFLICT (id) DO NOTHING;
