# K-Sync Malaysia: System Architecture, Design & Formal SRS Report

**Project Title:** K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions  
**Academic Deliverable:** Final Year Project (FYP) — Chapter 3: System Design & Technical Specification  
**Architecture Version:** 2.0 (Autonomous Verification Engine, Event Radar, Artist Roster & Fan Command Center)  
**Target Audience:** Academic Supervisors, Technical Evaluators, System Developers  
**Design System Standard:** Impeccable Design System (`PRODUCT.md`, `DESIGN.md`)  

---

## 1. Executive Summary & Problem-Solution Traceability

In Malaysia, the exponential growth of the Korean Wave (Hallyu) has led to significant logistical fragmentation. K-Pop event announcements, concert ticket release notices, and fan gatherings are scattered across decentralized, ephemeral social media networks (X/Twitter, Instagram, and Telegram channels). This fragmentation creates three severe problems for Malaysian fans and event hosts:

```mermaid
flowchart TD
    subgraph PROBLEMS ["Chapter 1: Problem Statements"]
        P1["<b>1.2.1 Information Fragmentation & Scalper Scams</b><br/>Event notices scattered; unverified secondary ticket scalpers thrive."]
        P2["<b>1.2.2 Unreliable Ticketing & Broken Transit Logistics</b><br/>Fans struggle to verify authentic ticket sellers and navigate KL transit."]
        P3["<b>1.2.3 Fragmented Community Q&A & Last-Minute Updates</b><br/>Important gate opening & venue changes lost in social media noise."]
    end

    subgraph SOLUTIONS ["K-Sync Malaysia: Engineered Solutions"]
        S1["<b>Autonomous Verification Engine & Whitelisting</b><br/>AI Vision OCR (Gemini 4 Argon) + partner domain checks with zero manual admin bottleneck."]
        S2["<b>Event Radar & Direct Transit Handshakes</b><br/>Clustered precinct corridors (Bukit Jalil, BBCC, PJ) + 1-click Google Maps transit routing."]
        S3["<b>Fan Command Center & Anti-Scalper Discussions</b><br/>'My K-Sync' live digital countdowns + immutable 1-level discussion threads (No editing allowed)."]
    end

    P1 ==> S1
    P2 ==> S2
    P3 ==> S3
```

---

## 2. System Actor Hierarchy & Permitted Scope

The system formally defines four human actors and one autonomous software engine, eliminating technical login/logout mechanisms and anonymous unauthenticated submissions:

```
===================================================================================================
                                         K-SYNC MALAYSIA
===================================================================================================

       [ GUEST (Unauthenticated Public Visitor) ]
             |-- (Public Discovery, Browsing & Outbound Handshakes)
             |---> UC001: Register Account (Fan / Organizer via Email or Google OAuth)
             |---> UC002: Browse Events Directory
             |---> UC003: Search Events (Artist, Group, Event Name, Venue, City)
             |---> UC004: Filter Events (Category, Artist, State, Precinct Area)
             |---> UC005: View Event Radar (Precinct Clusters & Same-Weekend Cohorts)
             |---> UC006: View Event Details (Live Countdown, Verified Evidence, Updates)
             |---> UC007: Open Official Ticket Link (Whitelisted Ticketing Handshake)
             |---> UC008: Open Venue Map & Transit Route (External Google Maps & LRT)
             |---> UC009: Open Organizer Social Profile Link (External X / Instagram)
             |---> UC010: Share Event (WhatsApp, X, Telegram, Clipboard Copy)
             |---> UC011: Export Event to Calendar (Google Calendar / .ics File)
             |---> UC012: Browse Artists Directory (Idol Groups & Soloists)
             |---> UC013: View Artist & Member Profiles (Biodata & MY Tour Archive)
             |---> UC014: View Event Discussion & Comments (Public Read-Only)
             ^
             | (inherits all Guest capabilities)
             |
       [ FAN (Authenticated Member) ]
             |-- (Personal Management, Community Trust & Discussions)
             |---> UC015: Manage Personal Profile
             |---> UC016: View Personalized Dashboard ("My K-Sync" Command Center)
             |---> UC017: Bookmark / Save Event (Wishlist Toggle)
             |---> UC018: Recommend / Upvote Event (Crowdsourced Reliability Voting)
             |---> UC019: Report Suspicious Listing (Scam, Fake Ticket Link Alert)
             |---> UC020: Post Discussion Comment (Event Logistics / Inquiries)
             |---> UC021: Reply to Discussion Comment (1-Level Threaded Q&A)
             |---> UC022: Delete Own Discussion Comment (Anti-Scalper Immutability)
             |---> UC023: View In-App Notifications (Notification Bell Tray)
             |---> UC024: Mark Notification as Read
             |---> UC025: Manage Notification Settings (Email & In-App Preferences)
             ^
             | (inherits all Fan capabilities)
             |
 [ ORGANIZER / SUBMITTER (Authenticated Event Host) ]
             |-- (Publishing, Multimodal OCR & Verification Telemetry)
             |---> UC026: View Organizer Dashboard (Listings & Verification Metrics)
             |---> UC027: Submit Event Listing (AI Vision OCR Scanner with Gemini 4 Argon)
             |---> UC028: Edit Event Listing (Draft / Correct Flagged Listing)
             |---> UC029: View Verification Breakdown (14-Point Attribute Match & Evidence Audit)
             |---> UC030: Post Logistical Event Update (Gate Times / Official Notice Alert)
             |---> UC031: Request Organizer Badge (Official Fanclub Credentials)

 [ SYSTEM MAINTAINER (Platform Administrator) ]
             |-- (Platform Governance, Master Taxonomies & Scam Moderation)
             |---> UC032: View Maintainer Portal (System Analytics & Audit Logs)
             |---> UC033: Manage Event Categories (Concert, Fanmeet, Cafe Event)
             |---> UC034: Manage Venues Database (Transit Links, Seating Capacity)
             |---> UC035: Manage Artists & Member Roster (Normalized Biodata)
             |---> UC036: Audit Scam Reports (Investigate Flags & Enforce Suspensions)

 [ AUTONOMOUS VERIFICATION ENGINE (Automated Application Engine) ]
             |-- (Instant Real-Time Verification Pipeline)
             |---> AV01: Audit Whitelisted Ticketing Domain
             |---> AV02: Resolve Evidence URL & Readability
             |---> AV03: Verify Date & Time Validity
             |---> AV04: Check Duplicate Event Listings
             |---> AV05: Multimodal OCR Vision Extraction (OpenRouter Gemini 4 Argon)
             |---> AV06: Cross-Model AI Consensus Audit (Argon -> Gemma -> Local Rules)
```

---

## 3. Autonomous Verification Engine Architecture

Traditional event platforms rely on manual administrative approval queues, causing multi-day listing delays, promoter friction, and human verification bottlenecks. K-Sync Malaysia replaces this with a fully autonomous, transparent verification pipeline:

```mermaid
flowchart TD
    SUBMIT["<b>Organizer Submits Listing</b><br/>(Poster Image, Dates, Venue, Ticketing URL, Evidence URL)"] --> GATES

    subgraph GATES ["Phase 1: Deterministic Hard Gates"]
        G1{"<b>AV01: Ticketing Whitelist</b><br/>Authorized partner domain?"}
        G2{"<b>AV02: URL Reachable</b><br/>HTTP 200 & content check?"}
        G3{"<b>AV03: Date Validity</b><br/>Future date & chronological?"}
        G4{"<b>AV04: Duplicate Scan</b><br/>Fuzzy match artist+venue+date?"}
    end

    G1 -->|Fail| REJECT["<b>Listing Flagged as DRAFT</b><br/>Specific diagnostic feedback provided to organizer"]
    G2 -->|Fail| REJECT
    G3 -->|Fail| REJECT
    G4 -->|Fail| REJECT

    GATES -->|All Pass| AI_PHASE

    subgraph AI_PHASE ["Phase 2: Multimodal AI & Attribute Consensus"]
        OCR["<b>AV05: Multimodal OCR Extraction</b><br/>OpenRouter Gemini 4 Argon parses official tour poster"]
        TOKEN["<b>14-Point Attribute Matching</b><br/>Fuzzy token overlap: Title (30%), Artist (30%), Venue (20%), City (20%)"]
        CONSENSUS["<b>AV06: Cross-Model Consensus</b><br/>Gemini 4 Argon, Google Gemma 2, Local Heuristics"]
    end

    AI_PHASE --> SCORE["<b>Calculate Trust Score (0 - 100)</b>"]
    
    SCORE --> BADGE{Score >= 75 AND Ticketing Whitelisted?}
    BADGE -->|Yes| OFFICIAL["<b>Badge: VERIFIED_OFFICIAL</b><br/>Published immediately with high community trust"]
    BADGE -->|No| COMM["<b>Badge: COMMUNITY_UNVERIFIED</b><br/>Published with community caution pill"]
```

### 14-Point Verification Diagnostic Telemetry
Organizers can view the exact score breakdown (UC029) to understand awarded points and diagnostic recommendations:
* **Evidence page match:** Page title, readable text byte measurement, and attribute overlap percentages (Event Name, Artist, Venue, City, Date).
* **AI Consensus Votes:** OpenRouter Gemini 4 Argon decision, Google Gemma 2 fallback vote, and Local Token Matcher.
* **Deterministic Checks:** Required details complete (8 pts), Valid date/time (6 pts), Evidence link supplied (6 pts), Whitelisted ticketing channel (10 pts), Evidence link resolves (12 pts), Content matches event (18 pts), AI consensus verification (22 pts), Organiser account standing (5 pts).

---

## 4. Anti-Scalper Discussion Immutability Design

A critical vulnerability identified in existing fan forums is secondary ticket scalping fraud. Scalpers routinely post legitimate logistical inquiries, wait for community upvotes, and then edit their comment text to include unauthorized scalper WhatsApp numbers or fraudulent ticketing links.

K-Sync Malaysia neutralizes this threat through **strict architectural immutability**:
1. **Creation (UC020):** Authenticated fans can post inquiries (1–1000 characters). Input is sanitized against XSS.
2. **1-Level Threading (UC021):** Replies reference a parent comment. Thread depth is strictly flattened to 1 level to ensure clean mobile rendering.
3. **Deletion (UC022):** Fans can delete their own comments at any time, removing the entire record from the database.
4. **Zero Editing:** `PUT` / `PATCH` routes are completely omitted from the API controller. Comments cannot be altered after submission, preserving a permanent audit trail.

---

## 5. Impeccable Design System Conformance

The user interface adheres to the **Impeccable Design Standard** defined in `PRODUCT.md` and `DESIGN.md`:
* **Aesthetic Identity:** "Vibrant, electric, authoritative." Clean dark slate typography balanced with electric violet (`#8B5CF6`) and cyber pink (`#EC4899`) neon accents.
* **Craft Floor Compliance:**
  - Zero decorative kickers or sub-label eyebrows over headings.
  - Zero low-contrast gradient text; solid accessible text fills only.
  - WCAG AA contrast ratio $\ge 4.5:1$ across all text elements.
  - Generous card padding and responsive touch targets $\ge 44 \times 44$px.
  - Custom branded focus rings and text selection highlights.

---

## 6. Database Entity-Relationship Architecture (3NF)

The system is backed by 14 normalized tables in `database/ksync.db`:

| Table Name | Primary Purpose | Key Foreign Keys |
| :--- | :--- | :--- |
| **`roles`** | Master user roles (`ADMIN`, `ORGANIZER`, `FAN`) | PK: `id` |
| **`users`** | Fan and organizer accounts with notification toggles | FK: `role_id` |
| **`artists`** | K-Pop groups and soloists with agency details | PK: `id` |
| **`members`** | 3NF-normalized idol member profiles (stage name, DOB, MBTI) | FK: `artist_id` |
| **`event_categories`** | Event classification taxonomy with Tailwind badge colors | PK: `id` |
| **`venues`** | Physical venues with capacity and public transit instructions | PK: `id` |
| **`events`** | Core event listings, schedules, evidence URLs, trust scores, and cluster precincts | FK: `organizer_id`, `artist_id`, `category_id`, `venue_id` |
| **`event_recommendations`** | Crowdsourced reliability upvotes (compound unique index `user_id, event_id`) | FK: `user_id`, `event_id` |
| **`saved_events`** | Personal fan wishlist for "My K-Sync" dashboard and countdown sync | FK: `user_id`, `event_id` |
| **`event_chat_messages`** | Immutable discussion posts with 1-level parent threading | FK: `event_id`, `user_id`, `parent_id` |
| **`event_updates`** | Official logistical broadcasts (gate times, weather alerts) | FK: `event_id`, `created_by` |
| **`reports`** | Community scam and misinformation reports | FK: `event_id`, `user_id`, `resolved_by` |
| **`notifications`** | In-app notification bell alerts for updates, countdowns, and replies | FK: `user_id`, `event_id`, `update_id` |
| **`activity_logs`** | Administrative audit logs for moderation and overrides | FK: `user_id` |

---

## 7. Verification & Automated Test Coverage

The redesigned system architecture has been validated against an automated end-to-end test suite (`test_complete_usecases.mjs`):
* **Total Automated Tests Executed:** 28
* **Passed:** 28 (100% Pass Rate)
* **Failed:** 0
* **Key Tested Endpoints:**
  - Account Registration & Login Sessions (`/register`, `/login`)
  - Event Discovery, Keyword Search & Faceted Filtering (`/events`, `/events?search=BOYNEXTDOOR`)
  - Event Radar Corridor Grouping (`/events/radar`)
  - Event Dossier & Live Countdown Rendering (`/events/:idOrSlug`)
  - Artists Catalog & Normalized Member Profiles (`/artists`, `/artists/boynextdoor`)
  - Personalized Fan Dashboard ("My K-Sync") (`/dashboard`)
  - Crowdsourced Reliability Voting API (`POST /api/events/:id/recommend`)
  - Anti-Scalper Discussion Immutability (Post, 1-Level Reply, Delete, Rejected Edit)
  - Multimodal Poster OCR & Autonomous Verification Pipeline
  - Maintainer Taxonomy Management & Scam Report Auditing
