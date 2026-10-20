# K-Sync Malaysia — Database ERD

**Source of truth:** the live database the Node application runs on (`database/ksync.db`), 11 tables.
PlantUML source: [`diagrams/erd_ksync.puml`](diagrams/erd_ksync.puml) · rendered: `diagrams/erd_ksync.svg` / `diagrams/erd_ksync.png`.

> Note: `database/hostinger_mysql_schema.sql` is **stale** and does not match the live schema or the code. See "Schema consistency" at the end.

---

## Diagram

```mermaid
erDiagram
    roles ||--o{ users : "role_id (legacy)"
    users ||--o{ events : "organizer_id"
    users ||--o{ saved_events : "user_id"
    users ||--o{ event_chat_messages : "user_id"
    users ||--o{ reports : "user_id"
    users ||--o{ activity_logs : "user_id"
    users ||--o{ notifications : "user_id"
    artists ||--o{ events : "artist_id"
    event_categories ||--o{ events : "category_id"
    venues ||--o{ events : "venue_id"
    events ||--o{ saved_events : "event_id"
    events ||--o{ event_chat_messages : "event_id"
    events ||--o{ reports : "event_id"
    events ||--o{ notifications : "event_id"

    roles {
        INTEGER id PK
        TEXT name UK
        DATETIME created_at
    }
    users {
        INTEGER id PK
        INTEGER role_id FK
        TEXT role
        TEXT full_name
        TEXT username UK
        TEXT email UK
        TEXT password_hash
        TEXT bio
        TEXT profile_image
        TEXT organization_name
        TEXT organization_type
        TEXT social_handle
        TEXT social_url
        TEXT verification_proof
        INTEGER is_verified_organizer
        TEXT verification_notes
        TEXT location
        TEXT buddy_preference
        TEXT status
        DATETIME created_at
        DATETIME updated_at
    }
    artists {
        INTEGER id PK
        TEXT name
        TEXT group_type
        TEXT image_url
        TEXT agency
        TEXT description
        TEXT members
        DATETIME created_at
    }
    event_categories {
        INTEGER id PK
        TEXT name UK
        TEXT slug UK
        TEXT badge_color
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
        TEXT transit_info
        TEXT map_link
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
        TEXT description
        DATE event_date
        TIME start_time
        TIME end_time
        TEXT venue_name
        TEXT address
        TEXT city
        TEXT state
        TEXT ticket_info
        TEXT event_rules
        TEXT official_url
        TEXT official_ticket_url
        TEXT official_source_url
        TEXT agency_announcement_url
        TEXT fan_chant_url
        TEXT poster_image
        TEXT multiple_posters
        TEXT gallery_images
        TEXT tour_name
        TEXT promoter_name
        TEXT country
        TEXT promotional_requests
        TEXT event_status
        TEXT verification_status
        TEXT trust_level
        TEXT rejection_reason
        TEXT admin_verification_notes
        TEXT tracking_code UK
        TEXT submitter_name
        TEXT submitter_email
        TEXT submitter_social
        TEXT evidence_link
        TEXT organizer_name
        TEXT organizer_social_url
        TEXT organizer_type
        DATETIME created_at
        DATETIME updated_at
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
        TEXT message
        INTEGER is_organizer
        DATETIME created_at
    }
    reports {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER event_id FK
        TEXT report_type
        TEXT reason
        TEXT details
        TEXT evidence_url
        TEXT status
        TEXT admin_action
        TEXT admin_notes
        INTEGER resolved_by FK
        DATETIME resolved_at
        DATETIME created_at
    }
    activity_logs {
        INTEGER id PK
        INTEGER user_id FK
        TEXT action
        TEXT entity_type
        INTEGER entity_id
        TEXT description
        TEXT ip_address
        DATETIME created_at
    }
    notifications {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER event_id FK
        INTEGER update_id FK
        TEXT message
        INTEGER is_read
        DATETIME created_at
    }
```

---

## Entities, keys & purpose

| Entity | PK | Foreign keys | Unique keys | Purpose |
|---|---|---|---|---|
| `roles` | `id` | — | `name` | Legacy role lookup (ADMIN / ORGANIZER / FAN) |
| `users` | `id` | `role_id → roles.id` (RESTRICT) | `username`, `email` | Accounts; `role` is the **active** role field |
| `artists` | `id` | — | — | Idol groups/soloists; `members` = JSON biodata |
| `event_categories` | `id` | — | `name`, `slug` | Concert / Fan Meeting / Cupsleeve … |
| `venues` | `id` | — | — | Venue directory |
| `events` | `id` | `organizer_id → users.id` (CASCADE), `artist_id → artists.id` (SET NULL), `category_id → event_categories.id` (RESTRICT), `venue_id → venues.id` (SET NULL) | `slug`, `tracking_code` | Central entity |
| `saved_events` | `id` | `user_id → users.id`, `event_id → events.id` (both CASCADE) | `(user_id, event_id)` | Bookmarks — **M:N** users↔events |
| `event_chat_messages` | `id` | `event_id → events.id`, `user_id → users.id` (CASCADE) | — | Public event forum |
| `reports` | `id` | `user_id → users.id` (SET NULL), `event_id → events.id` (CASCADE); `resolved_by` (logical → users) | — | Scam/violation reports |
| `activity_logs` | `id` | `user_id → users.id` (SET NULL); `entity_id` = polymorphic logical FK | — | Audit trail |
| `notifications` | `id` | `user_id → users.id` (CASCADE), `event_id → events.id` (CASCADE), `update_id → event_updates.id` **(table missing!)** | — | In-app notifications |

---

## Relationships (cardinality)

| # | Relationship | Cardinality | FK | On delete |
|---|---|---|---|---|
| R1 | roles → users | 1 : N | `users.role_id` | RESTRICT |
| R2 | users → events | 1 : N (organizer) | `events.organizer_id` | CASCADE |
| R3 | artists → events | 1 : N | `events.artist_id` | SET NULL |
| R4 | event_categories → events | 1 : N | `events.category_id` | RESTRICT |
| R5 | venues → events | 1 : N | `events.venue_id` | SET NULL |
| R6 | users ↔ events (via saved_events) | **M : N** | `saved_events.user_id` / `event_id` | CASCADE |
| R7 | users / events → event_chat_messages | 1 : N | `event_id`, `user_id` | CASCADE |
| R8 | users / events → reports | 1 : N | `user_id`, `event_id` | SET NULL / CASCADE |
| R9 | users → activity_logs | 1 : N | `user_id` | SET NULL |
| R10 | users / events → notifications | 1 : N | `user_id`, `event_id` | CASCADE |

---

## Schema consistency problems

Three conflicting definitions of the same database exist, and they do not match the code:

1. **`database/hostinger_mysql_schema.sql` is stale.** It has no `venues` table (venue is embedded in `events`), no `roles` table, and is missing columns the code actively writes:
   - `users.is_verified_organizer`
   - `reports.evidence_url`, `reports.admin_action`, `reports.admin_notes`, `reports.resolved_by`, `reports.resolved_at`
   - `event_chat_messages.is_organizer`
   - `activity_logs` uses `target_type/target_id/details` in MySQL but the code writes `entity_type/entity_id/description`
   - `notifications` has `title/link` in MySQL but the live DB has neither
2. **`notifications.update_id` → non-existent `event_updates` table** (dangling FK). With `PRAGMA foreign_keys = ON` (`config/database.js:47`), inserts into `notifications` can fail.
3. **Dual-role columns.** `users` has both `role_id` (NOT NULL → `roles`) and `role` (TEXT). The app reads/writes `role`, and dead code still tests `role_id = 1` (`helpers.js:285`, `auth.js:140`). The OTP/Google inserts (`auth.js:275,536`) omit `role_id`, so they violate `NOT NULL` on SQLite while working on the MySQL schema (which has no `role_id`).
