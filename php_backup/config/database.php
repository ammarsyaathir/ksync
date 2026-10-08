<?php
// config/database.php - K-Sync Malaysia Database Connection & Auto-Initialization

defined('GEMINI_API_KEY') || define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
$db_file = __DIR__ . '/../database/ksync.db';
$db_dir = dirname($db_file);

if (!file_exists($db_dir)) {
    mkdir($db_dir, 0777, true);
}

try {
    $pdo = new PDO("sqlite:" . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Enable Foreign Keys in SQLite
    $pdo->exec("PRAGMA foreign_keys = ON;");
} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}

// Function to initialize database schema & seed initial data if needed
function init_database($pdo) {
    // 1. roles
    $pdo->exec("CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. users
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        bio TEXT,
        profile_image TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
    )");

    // 3. artists
    $pdo->exec("CREATE TABLE IF NOT EXISTS artists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        group_type TEXT DEFAULT 'Boy Group',
        image_url TEXT,
        agency TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 4. event_categories
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        badge_color TEXT DEFAULT 'purple',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 5. venues
    $pdo->exec("CREATE TABLE IF NOT EXISTS venues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        map_link TEXT,
        capacity INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 6. events
    $pdo->exec("CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organizer_id INTEGER NOT NULL,
        artist_id INTEGER,
        category_id INTEGER NOT NULL,
        venue_id INTEGER,
        event_name TEXT NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME,
        venue_name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        ticket_info TEXT,
        event_rules TEXT,
        official_url TEXT,
        poster_image TEXT,
        event_status TEXT DEFAULT 'UPCOMING',
        verification_status TEXT DEFAULT 'PENDING',
        rejection_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES event_categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
    )");

    // 7. saved_events (UNIQUE constraint to prevent duplicates)
    $pdo->exec("CREATE TABLE IF NOT EXISTS saved_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )");

    // 8. event_updates
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        created_by INTEGER NOT NULL,
        update_title TEXT NOT NULL,
        update_description TEXT NOT NULL,
        update_type TEXT DEFAULT 'General Announcement',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 9. notifications
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        update_id INTEGER,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (update_id) REFERENCES event_updates(id) ON DELETE SET NULL
    )");

    // 10. event_verifications
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        admin_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 11. activity_logs
    $pdo->exec("CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id INTEGER,
        description TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )");

    // 12. event_reports (Community trust & reporting system)
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER,
        report_reason TEXT NOT NULL,
        report_details TEXT,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )");

    // 13. event_chat_messages (Web-Based Live Group Chat & Q&A Hub)
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        is_organizer INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 14. event_changes (Immutable change history audit log)
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_changes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        changed_by INTEGER NOT NULL,
        field_name TEXT NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 15. checkins (Lightweight Event Check-in System)
    $pdo->exec("CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        checked_in_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 16. event_interest
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_interest (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        interest_status TEXT DEFAULT 'interested',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 17. buddy_requests
    $pdo->exec("CREATE TABLE IF NOT EXISTS buddy_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        responded_at DATETIME,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 18. event_groups
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        group_name TEXT NOT NULL,
        created_by INTEGER NOT NULL,
        max_members INTEGER DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 19. event_group_members
    $pdo->exec("CREATE TABLE IF NOT EXISTS event_group_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'ACTIVE',
        UNIQUE(group_id, user_id),
        FOREIGN KEY (group_id) REFERENCES event_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 20. conversations
    $pdo->exec("CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        group_id INTEGER,
        conversation_type TEXT DEFAULT 'DIRECT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES event_groups(id) ON DELETE CASCADE
    )");

    // 21. conversation_members
    $pdo->exec("CREATE TABLE IF NOT EXISTS conversation_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(conversation_id, user_id),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 22. buddy_messages
    $pdo->exec("CREATE TABLE IF NOT EXISTS buddy_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message_text TEXT NOT NULL,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // 23. user_reports
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER NOT NULL,
        reported_user_id INTEGER NOT NULL,
        event_id INTEGER,
        reason TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
    )");

    // DYNAMIC SCHEMA MIGRATION: Ensure users, venues, events tables have new fields
    $columns = [
        'organization_name' => 'TEXT',
        'organization_type' => "TEXT DEFAULT 'Fanclub'",
        'social_handle' => 'TEXT',
        'social_url' => 'TEXT',
        'verification_proof' => 'TEXT',
        'is_verified_organizer' => 'INTEGER DEFAULT 0',
        'verification_notes' => 'TEXT',
        'location' => "TEXT DEFAULT 'Kuala Lumpur'",
        'buddy_preference' => "TEXT DEFAULT 'Looking for event buddy'"
    ];
    foreach ($columns as $col => $type) {
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN {$col} {$type}");
        } catch (PDOException $e) {}
    }

    $event_cols = [
        'tour_name' => 'TEXT',
        'promoter_name' => 'TEXT',
        'country' => "TEXT DEFAULT 'Malaysia'",
        'official_ticket_url' => 'TEXT',
        'official_source_url' => 'TEXT',
        'agency_announcement_url' => 'TEXT',
        'multiple_posters' => 'TEXT',
        'promotional_requests' => 'TEXT'
    ];
    foreach ($event_cols as $col => $type) {
        try {
            $pdo->exec("ALTER TABLE events ADD COLUMN {$col} {$type}");
        } catch (PDOException $e) {}
    }

    try { $pdo->exec("ALTER TABLE venues ADD COLUMN transit_info TEXT"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE events ADD COLUMN fan_chant_url TEXT"); } catch (PDOException $e) {}
    try { $pdo->exec("ALTER TABLE event_reports ADD COLUMN organizer_reply TEXT"); } catch (PDOException $e) {}

    // SEED INITIAL ROLES IF EMPTY
    $roleCount = $pdo->query("SELECT COUNT(*) FROM roles")->fetchColumn();
    if ($roleCount == 0) {
        $pdo->exec("INSERT INTO roles (id, name) VALUES (1, 'Admin'), (2, 'Organizer'), (3, 'Fan')");
    }

    // SEED INITIAL DEMO USERS IF EMPTY
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount == 0) {
        $defaultPassword = password_hash('password123', PASSWORD_DEFAULT);
        
        // 1. Admin
        $stmt = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash, bio) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([1, 'System Admin', 'admin', 'admin@ksync.my', $defaultPassword, 'System Administrator (Manages categories, venues & verified fanclub credentials).']);

        // 2. Verified Organizer (Concert Promoter)
        $stmt = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash, bio, organization_name, organization_type, social_handle, social_url, is_verified_organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([2, 'Starline Events Malaysia', 'starline', 'organizer@ksync.my', $defaultPassword, 'Official K-Pop concert and fan meeting organizer based in Kuala Lumpur.', 'Starline Events Malaysia', 'Concert Organizer', '@starline_my', 'https://x.com/starline_my', 1]);

        // 3. Fan
        $stmt = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash, bio) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([3, 'Aiman K-Pop Fan', 'aiman_carat', 'fan@ksync.my', $defaultPassword, 'Passionate K-Pop fan & SEVENTEEN Carat in KL!']);

        // 4. Verified Fanclub Organizer (MOAbasedMY - TXT Fanclub)
        $stmt = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash, bio, organization_name, organization_type, social_handle, social_url, is_verified_organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([2, 'MOAbasedMY (TXT Malaysia Fanclub)', 'moabasedmy', 'txt_fanclub@ksync.my', $defaultPassword, 'Official Malaysian fanclub base for TOMORROW X TOGETHER (TXT). Organizing cup sleeve events, fan gatherings & concert projects.', 'MOAbasedMY - TXT Fanclub Malaysia', 'Official Fanclub', '@MOAbasedMY', 'https://x.com/MOAbasedMY', 1]);
    } else {
        // Ensure user ID 2 has verified organizer status if already present
        $pdo->exec("UPDATE users SET is_verified_organizer = 1, organization_name = 'Starline Events Malaysia', organization_type = 'Concert Organizer', social_handle = '@starline_my', social_url = 'https://x.com/starline_my' WHERE id = 2 AND (organization_name IS NULL OR organization_name = '')");
    }

    // SEED ARTISTS IF EMPTY
    $artistCount = $pdo->query("SELECT COUNT(*) FROM artists")->fetchColumn();
    if ($artistCount == 0) {
        $artists = [
            ['SEVENTEEN', 'Boy Group', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop', 'PLEDIS Entertainment', '13-member South Korean boy group known for self-producing music.'],
            ['TWICE', 'Girl Group', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop', 'JYP Entertainment', 'Global sensation 9-member South Korean girl group.'],
            ['IU (Lee Ji-eun)', 'Soloist', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop', 'EDAM Entertainment', 'Renowned South Korean singer-songwriter and actress.'],
            ['ENHYPEN', 'Boy Group', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop', 'BELIFT LAB', '7-member global powerhouse boy group.'],
            ['IVE', 'Girl Group', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop', 'Starship Entertainment', '6-member chart-topping girl group.'],
            ['TOMORROW X TOGETHER (TXT)', 'Boy Group', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop', 'BIGHIT MUSIC', 'Gen Z icons 5-member boy group.'],
            ['Stray Kids', 'Boy Group', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop', 'JYP Entertainment', '8-member self-producing powerhouse.'],
            ['aespa', 'Girl Group', 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop', 'SM Entertainment', 'Futuristic 4-member girl group with avatar concept.']
        ];
        $stmt = $pdo->prepare("INSERT INTO artists (name, group_type, image_url, agency, description) VALUES (?, ?, ?, ?, ?)");
        foreach ($artists as $a) {
            $stmt->execute($a);
        }
    }

    // SEED CATEGORIES IF EMPTY
    $catCount = $pdo->query("SELECT COUNT(*) FROM event_categories")->fetchColumn();
    if ($catCount == 0) {
        $cats = [
            ['Concert', 'concert', 'purple', 'Full-scale live musical performances and arena tours.'],
            ['Fan Meeting', 'fan-meeting', 'pink', 'Interactive stage shows with games, Q&A, and live stages.'],
            ['Cupsleeve Event', 'cupsleeve-event', 'rose', 'Fan-organized cafe gatherings celebrating birthdays and anniversaries.'],
            ['Birthday Event', 'birthday-event', 'amber', 'Special birthday celebrations with fan displays and giveaways.'],
            ['Fan Gathering', 'fan-gathering', 'indigo', 'Community meetups and lightstick fan projects.'],
            ['Exhibition', 'exhibition', 'cyan', 'Photo exhibitions, gallery pop-ups, and fan art displays.'],
            ['Pop-up Event', 'pop-up-event', 'emerald', 'Official merchandise pop-up stores and interactive zones.'],
            ['Other K-Pop Events', 'other', 'slate', 'Miscellaneous K-Pop community activities and watch parties.']
        ];
        $stmt = $pdo->prepare("INSERT INTO event_categories (name, slug, badge_color, description) VALUES (?, ?, ?, ?)");
        foreach ($cats as $c) {
            $stmt->execute($c);
        }
    }

    // SEED VENUES IF EMPTY
    $venueCount = $pdo->query("SELECT COUNT(*) FROM venues")->fetchColumn();
    if ($venueCount == 0) {
        $venues = [
            ['Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Axiata+Arena', 16000, 'LRT Sri Petaling Line -> Bukit Jalil Station (5-min covered walkway bridge to Gate A)'],
            ['National Stadium Bukit Jalil', 'Bukit Jalil National Sports Complex', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=National+Stadium+Bukit+Jalil', 87000, 'LRT Sri Petaling Line -> Bukit Jalil Station (Direct Gate A walkway access)'],
            ['Zepp Kuala Lumpur', 'BBCC, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Zepp+Kuala+Lumpur', 2500, 'LRT Sri Petaling / KL Monorail -> Hang Tuah Station (Direct BBCC link bridge)'],
            ['Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza, Jalan Sultan Ismail', 'Kuala Lumpur', 'W.P. Kuala Lumpur', 'https://maps.google.com/?q=Mega+Star+Arena', 5000, 'MRT Kajang Line -> Bukit Bintang Station / Monorail Imbi Station (3-min walk)'],
            ['Subang Parade Cafe Zone', 'Jalan SS 16/1, Subang Jaya', 'Subang Jaya', 'Selangor', 'https://maps.google.com/?q=Subang+Parade', 200, 'KTM Komuter / LRT Kelana Jaya Line -> Subang Jaya Station (3-min walk)'],
            ['Gurney Paragon Mall Event Hall', 'Persiaran Gurney', 'George Town', 'Penang', 'https://maps.google.com/?q=Gurney+Paragon+Mall', 1500, 'Rapid Penang Bus 101/103 -> Gurney Paragon stop'],
            ['Mount Austin Cafe Street', 'Taman Mount Austin', 'Johor Bahru', 'Johor', 'https://maps.google.com/?q=Mount+Austin+Johor+Bahru', 150, 'Grab / Taxi from JB Sentral CIQ station (15-min drive)']
        ];
        $stmt = $pdo->prepare("INSERT INTO venues (name, address, city, state, map_link, capacity, transit_info) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($venues as $v) {
            $stmt->execute($v);
        }
    } else {
        // Update transit info for existing venues if null
        $pdo->exec("UPDATE venues SET transit_info = 'LRT Sri Petaling Line -> Bukit Jalil Station (5-min covered walkway bridge)' WHERE name LIKE '%Axiata%' AND (transit_info IS NULL OR transit_info = '')");
        $pdo->exec("UPDATE venues SET transit_info = 'LRT Sri Petaling Line -> Bukit Jalil Station (Direct Gate A walkway)' WHERE name LIKE '%National Stadium%' AND (transit_info IS NULL OR transit_info = '')");
        $pdo->exec("UPDATE venues SET transit_info = 'LRT Sri Petaling / Monorail -> Hang Tuah Station (Direct BBCC link bridge)' WHERE name LIKE '%Zepp%' AND (transit_info IS NULL OR transit_info = '')");
        $pdo->exec("UPDATE venues SET transit_info = 'MRT Kajang Line -> Bukit Bintang / Monorail Imbi Station (3-min walk)' WHERE name LIKE '%Mega Star%' AND (transit_info IS NULL OR transit_info = '')");
    }

    // SEED REALISTIC EVENTS IF EMPTY
    $eventCount = $pdo->query("SELECT COUNT(*) FROM events")->fetchColumn();
    if ($eventCount == 0) {
        $events = [
            [
                2, 1, 1, 1, // org, artist: SEVENTEEN, cat: Concert, venue: Axiata Arena
                'SEVENTEEN [RIGHT HERE] WORLD TOUR IN KUALA LUMPUR',
                'Global powerhouse SEVENTEEN returns to Malaysia for their massive [RIGHT HERE] World Tour! Experience unmatched energy, spectacular stage production, and 13-member harmony live at Axiata Arena Bukit Jalil.',
                '2026-11-14', '18:00', '21:30',
                'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
                'VIP Soundcheck: RM1,088 | CAT 1: RM888 | CAT 2: RM688 | CAT 3: RM488. Tickets available via official partner.',
                '1. Lightsticks allowed (Carat Bong v2/v3).\n2. No professional cameras or recording equipment.\n3. Water bottles under 500ml only.\n4. Bags larger than A4 size strictly prohibited.',
                'https://pledis.co.kr/seventeen-tour-kl',
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
                'UPCOMING', 'VERIFIED', null
            ],
            [
                2, 2, 2, 1, // TWICE Fan Meeting
                'TWICE 9TH ANNIVERSARY FAN MEETING [ONCE UPON A TIME] IN KL',
                'Join TWICE in Kuala Lumpur for an unforgettable anniversary fan meeting featuring games, special stages, interactive Q&A, and exclusive soundcheck for VIP pass holders.',
                '2026-10-24', '17:00', '20:00',
                'Axiata Arena Bukit Jalil', 'Loke Yew St, Bukit Jalil', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
                'VIP Fan Pass: RM799 | Standard Fan Pass: RM499 | Upper Tier: RM299.',
                '1. Candybong Z lightsticks encouraged.\n2. Banners must not exceed 40x20cm.\n3. Respect fellow fans and follow marshal instructions.',
                'https://twice.jype.com/fanmeeting-kl',
                'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
                'UPCOMING', 'VERIFIED', null
            ],
            [
                2, 3, 3, 5, // IU Birthday Cupsleeve Event
                'Uaena Joy: IU 33rd Birthday Cupsleeve & Photo Exhibition',
                'A cozy fan-organized cupsleeve event in Subang Jaya celebrating IU! Purchase any drink to receive a custom design cupsleeve, photo cards, mini poster, and sticker pack. Photo gallery wall and photo booth included!',
                '2026-05-16', '11:00', '18:00',
                'Subang Parade Cafe Zone', 'Jalan SS 16/1, Subang Jaya', 'Subang Jaya', 'Selangor',
                'Free Admission with drink order (RM 12 - RM 18 per drink).',
                '1. First 100 fans each day receive early-bird keyring.\n2. Please dispose of trash responsibly.\n3. Tag #IU_KL_Birthday on Twitter/X to win prizes.',
                'https://twitter.com/malaysia_uaena',
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
                'UPCOMING', 'VERIFIED', null
            ],
            [
                2, 6, 2, 3, // TXT Fan Meeting at Zepp KL
                'TXT (TOMORROW X TOGETHER) SWEET MIRAGE FAN GATHERING KL',
                'An intimate fan gathering celebrating TXT album release with MOA Malaysia! High-definition screening of world tour highlights, random play dance, and exclusive lucky draw prizes.',
                '2026-12-05', '14:00', '17:30',
                'Zepp Kuala Lumpur', 'BBCC, Jalan Hang Tuah', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
                'MOA Ticket: RM120 (Includes official wristband & photocard set).',
                '1. MOABONG lightsticks permitted.\n2. Random Play Dance session starts at 13:00 outside venue lobby.',
                'https://txt-moa-malaysia.com',
                'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop',
                'UPCOMING', 'VERIFIED', null
            ],
            [
                2, 5, 1, 2, // IVE Concert at National Stadium
                'IVE 1ST WORLD TOUR [SHOW WHAT I HAVE] ENCORE IN KL',
                'DIVE Malaysia! IVE is bringing their explosive encore concert to National Stadium Bukit Jalil. Don\'t miss ELEVEN, LOVE DIVE, AFTER LIKE, and I AM performed live on the grandest stage.',
                '2026-12-19', '19:30', '22:30',
                'National Stadium Bukit Jalil', 'Bukit Jalil National Sports Complex', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
                'VIP Floor: RM988 | CAT 1: RM788 | CAT 2: RM588 | CAT 3: RM388.',
                '1. Strict identity check at entrance.\n2. Electronic lightsticks sync available at venue.',
                'https://starship-ent.com/ive-tour',
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop',
                'UPCOMING', 'VERIFIED', null
            ],
            [
                2, 4, 1, 4, // ENHYPEN Pending Submission
                'ENHYPEN [FATE PLUS] WORLD TOUR IN KUALA LUMPUR',
                'ENHYPEN returns with FATE PLUS tour! High energy choreography, vampire aesthetics, and unforgettable fan interaction at Idea Live KL.',
                '2026-11-28', '18:30', '21:30',
                'Idea Live KL (Mega Star Arena)', 'Sungei Wang Plaza, Jalan Sultan Ismail', 'Kuala Lumpur', 'W.P. Kuala Lumpur',
                'VIP Soundcheck: RM899 | General Admission: RM599.',
                '1. Standard concert safety guidelines apply.',
                'https://beliftlab.com/enhypen-kl',
                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
                'UPCOMING', 'PENDING', null
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO events (
            organizer_id, artist_id, category_id, venue_id,
            event_name, description, event_date, start_time, end_time,
            venue_name, address, city, state, ticket_info, event_rules, official_url,
            poster_image, event_status, verification_status, rejection_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        foreach ($events as $ev) {
            $stmt->execute($ev);
        }

        // Seed an initial event update
        $pdo->exec("INSERT INTO event_updates (event_id, created_by, update_title, update_description, update_type)
            VALUES (1, 2, 'VIP Soundcheck Schedule Released!', 'Soundcheck queueing starts at 14:00. Doors open at 15:30 for soundcheck session. Please have your ticket barcode ready.', 'General Announcement')");

        // Seed initial saved event for Fan (User ID 3 saves Event 1 & 2)
        $pdo->exec("INSERT OR IGNORE INTO saved_events (user_id, event_id) VALUES (3, 1), (3, 2)");

        // Seed notification for Fan
        $pdo->exec("INSERT INTO notifications (user_id, event_id, update_id, message)
            VALUES (3, 1, 1, 'SEVENTEEN Tour update: VIP Soundcheck Schedule Released!')");
    }

    // Seed demo event chat messages if empty
    try {
        $chatCount = $pdo->query("SELECT COUNT(*) FROM event_chat_messages")->fetchColumn();
        if ($chatCount == 0) {
            $stmtChat = $pdo->prepare("INSERT INTO event_chat_messages (event_id, user_id, message, is_organizer) VALUES (?, ?, ?, ?)");
            // Event 1 (SEVENTEEN) chat messages
            $stmtChat->execute([1, 3, "Hi everyone! Anyone going to Axiata Arena from Subang Jaya? Looking to share a Grab ride!", 0]);
            $stmtChat->execute([1, 2, "Hi Carats! VIP Soundcheck Queue begins strictly at 2:00 PM at Gate A. Make sure your Carat Bongs are ready!", 1]);
            $stmtChat->execute([1, 3, "Thank you Starline Events! Can't wait for the concert!", 0]);
            
            // Event 4 (TXT) chat messages
            $moaId = $pdo->query("SELECT id FROM users WHERE username = 'moabasedmy'")->fetchColumn();
            if ($moaId) {
                $stmtChat->execute([4, 3, "Hi MOAs! What time does the Random Play Dance start at Zepp KL?", 0]);
                $stmtChat->execute([4, $moaId, "Hello MOA! Random Play Dance starts at 1:00 PM right outside the main lobby entrance! Free cup sleeve gifts for all attendees!", 1]);
            }
        }
    } catch (Exception $e) {}

    // Ensure TXT fanclub event is assigned to MOAbasedMY
    try {
        $moaId = $pdo->query("SELECT id FROM users WHERE username = 'moabasedmy'")->fetchColumn();
        if ($moaId) {
            $pdo->exec("UPDATE events SET organizer_id = {$moaId} WHERE event_name LIKE '%TXT%' OR event_name LIKE '%TOMORROW%'");
        }
    } catch (Exception $e) {}
}

// Automatically initialize tables and seed data
init_database($pdo);
