# K-Sync Malaysia — Database Entity-Relationship Diagram (ERD)

**Document Type:** Technical Database Specification (SRS Section 3.4)  
**Database Engines Supported:** SQLite 3 (Development / Local WAL Mode) & MySQL 8.0 (Production Hostinger)  
**Total Tables:** 14 Purposeful Application Tables (Zero Redundancy / 3NF Normalized)  
**Source of Truth:** Live running database `database/ksync.db` (verified via SQLite schema introspector).

---

## 1. Visual Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    roles ||--o{ users : "role_id (1:N)"
    users ||--o{ events : "organizer_id (1:N)"
    users ||--o{ saved_events : "user_id (1:N)"
    users ||--o{ event_recommendations : "user_id (1:N)"
    users ||--o{ event_chat_messages : "user_id (1:N)"
    users ||--o{ event_updates : "created_by (1:N)"
    users ||--o{ reports : "user_id (1:N)"
    users ||--o{ notifications : "user_id (1:N)"
    users ||--o{ activity_logs : "user_id (1:N)"
    
    artists ||--o{ members : "artist_id (1:N)"
    artists ||--o{ events : "artist_id (1:N)"
    event_categories ||--o{ events : "category_id (1:N)"
    venues ||--o{ events : "venue_id (1:N)"
    
    events ||--o{ saved_events : "event_id (1:N)"
    events ||--o{ event_recommendations : "event_id (1:N)"
    events ||--o{ event_chat_messages : "event_id (1:N)"
    events ||--o{ event_updates : "event_id (1:N)"
    events ||--o{ reports : "event_id (1:N)"
    events ||--o{ notifications : "event_id (1:N)"
    
    event_chat_messages ||--o{ event_chat_messages : "parent_id (1:N 1-Level Threading)"

    roles {
        INTEGER id PK
        TEXT name UK "ADMIN, ORGANIZER, FAN"
        DATETIME created_at
    }

    users {
        INTEGER id PK
        INTEGER role_id FK
        TEXT role "Denormalized role string"
        TEXT full_name
        TEXT username UK
        TEXT email UK
        TEXT password_hash
        TEXT bio
        TEXT profile_image
        TEXT status "ACTIVE, SUSPENDED"
        TEXT organization_name
        TEXT organization_type
        TEXT social_handle
        TEXT social_url
        TEXT verification_proof
        INTEGER is_verified_organizer "0 or 1"
        TEXT verification_notes
        TEXT location
        TEXT buddy_preference
        INTEGER notify_event_updates "0 or 1"
        INTEGER notify_countdown_reminders "0 or 1"
        INTEGER notify_discussion_replies "0 or 1"
        DATETIME created_at
        DATETIME updated_at
    }

    artists {
        INTEGER id PK
        TEXT name
        TEXT group_type "Boy Group, Girl Group, Soloist"
        TEXT image_url
        TEXT agency
        TEXT description
        TEXT members "Denormalized summary list"
        DATETIME created_at
    }

    members {
        INTEGER id PK
        INTEGER artist_id FK
        TEXT stage_name
        TEXT birth_name
        TEXT group_name
        TEXT position "Main Vocal, Leader, Dancer"
        TEXT dob "Birth date YYYY-MM-DD"
        TEXT zodiac
        REAL height_cm
        TEXT blood_type
        TEXT mbti
        TEXT nationality
        INTEGER debut_year
        TEXT photo
        INTEGER is_active "0 or 1"
        INTEGER sort_order
        DATETIME created_at
    }

    event_categories {
        INTEGER id PK
        TEXT name UK
        TEXT slug UK
        TEXT badge_color "Tailwind color token"
        TEXT description
        DATETIME created_at
    }

    venues {
        INTEGER id PK
        TEXT name
        TEXT address
        TEXT city
        TEXT state
        INTEGER capacity
        TEXT transit_info "Nearest LRT / MRT guidance"
        TEXT map_link "Google Maps URL"
        DATETIME created_at
    }

    events {
        INTEGER id PK
        INTEGER organizer_id FK
        INTEGER artist_id FK
        INTEGER category_id FK
        INTEGER venue_id FK
        TEXT event_name
        TEXT slug UK
        TEXT tour_name
        TEXT description
        DATE event_date
        TIME start_time
        TIME end_time
        TEXT venue_name
        TEXT address
        TEXT city
        TEXT state
        TEXT cluster_area "Precinct (Bukit Jalil, BBCC, etc.)"
        TEXT ticket_info
        TEXT official_ticket_url "Whitelisted partner URL"
        TEXT official_source_url "Evidence announcement URL"
        TEXT agency_announcement_url
        TEXT poster_image "Poster banner"
        TEXT multiple_posters "JSON array"
        TEXT event_status "CONFIRMED, POSTPONED, CANCELLED"
        TEXT verification_status "VERIFIED, COMMUNITY, REJECTED"
        TEXT trust_level "OFFICIAL, COMMUNITY"
        TEXT rejection_reason
        TEXT tracking_code UK "KS-2026-XXXXXX"
        TEXT submitter_name
        TEXT submitter_email
        TEXT submitter_social
        TEXT organizer_name
        TEXT organizer_social_url
        TEXT organizer_type
        TEXT admin_verification_notes
        DATETIME created_at
        DATETIME updated_at
    }

    event_recommendations {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER event_id FK
        TEXT vote_type "UP"
        DATETIME created_at
    }

    saved_events {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER event_id FK
        DATETIME saved_at
    }

    event_chat_messages {
        INTEGER id PK
        INTEGER event_id FK
        INTEGER user_id FK
        INTEGER parent_id FK "Self-referencing for 1-level thread"
        TEXT message "Immutable discussion text"
        INTEGER is_organizer "0 or 1"
        DATETIME created_at
    }

    event_updates {
        INTEGER id PK
        INTEGER event_id FK
        INTEGER created_by FK
        TEXT update_title
        TEXT update_description
        TEXT update_type "SCHEDULE, GATE_TIME, EMERGENCY"
        DATETIME created_at
    }

    reports {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER event_id FK
        INTEGER resolved_by FK
        TEXT report_type "SCAM_LINK, CANCELLED_EVENT, INACCURATE"
        TEXT reason
        TEXT details
        TEXT evidence_url
        TEXT status "PENDING, RESOLVED, DISMISSED"
        TEXT admin_action "TAKEDOWN, DISMISS"
        TEXT admin_notes
        DATETIME resolved_at
        DATETIME created_at
    }

    notifications {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER event_id FK
        INTEGER update_id FK
        TEXT message
        INTEGER is_read "0 or 1"
        DATETIME created_at
    }

    activity_logs {
        INTEGER id PK
        INTEGER user_id FK
        TEXT action "EVENT_CREATE, OVERRIDE, DELETE"
        TEXT entity_type "EVENT, USER, REPORT"
        INTEGER entity_id
        TEXT description
        TEXT ip_address
        DATETIME created_at
    }
```

---

## 2. Table Catalog & Schema Dictionary

### 2.1 Identity & Authentication
1. **`roles`**: Master user roles (`ADMIN`, `ORGANIZER`, `FAN`).
2. **`users`**: Comprehensive user accounts supporting local Bcrypt authentication and Google OAuth 2.0. Includes verified organizer status flags and notification preference toggles (`notify_event_updates`, `notify_countdown_reminders`, `notify_discussion_replies`).

### 2.2 Master Taxonomies
3. **`artists`**: K-Pop boy groups, girl groups, and soloists with agency affiliations and banners.
4. **`members`**: 3NF-normalized idol member profiles linked to `artists` via `artist_id`. Stores stage name, birth name, group position, birth date, height, MBTI, blood type, and debut year.
5. **`event_categories`**: Event classification slugs (`concert`, `fanmeeting`, `cafe-event`, `cup-sleeve`) with Tailwind badge color mappings.
6. **`venues`**: Physical Malaysian event venues annotated with capacity and public transit instructions (e.g. Sri Petaling LRT line for Axiata Arena).

### 2.3 Core Event Management
7. **`events`**: The central transactional entity storing event schedule, venue location, ticketing URLs, source evidence URLs, multimodal poster paths, autonomous verification scores, trust badges, and geographical precinct tags (`cluster_area`).
8. **`event_updates`**: Official broadcast alerts posted by organizers for gate opening times, soundcheck queues, and emergency notices. Alerts fans who saved the event.

### 2.4 Community & Social Engagement
9. **`saved_events`**: Personal wishlists tracking events saved by fans for the "My K-Sync" dashboard and countdown alerts.
10. **`event_recommendations`**: Crowdsourced reliability upvoting records with unique compound index `(user_id, event_id)` enforcing one vote per fan.
11. **`event_chat_messages`**: Public discussion thread messages. Features self-referencing `parent_id` for strictly 1-level deep replies. **Strictly immutable (no edit capability)** to protect against secondary ticket scalping fraud.

### 2.5 Moderation & Auditing
12. **`reports`**: Community scam and misinformation reports filed by fans with status tracking (`PENDING`, `RESOLVED`, `DISMISSED`).
13. **`notifications`**: User-specific in-app notification alerts for schedule shifts, showtime countdowns, and discussion replies.
14. **`activity_logs`**: Immutable audit logs capturing administrative overrides, listings publications, and security actions.
