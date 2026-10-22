# K-Sync Malaysia: Formal Use Case Specification (All 42 Use Cases)

**Project Title:** K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions  
**Document Type:** Formal System Use Case Specification (SRS Section 3.2)  
**System Architecture:** Autonomous Verification Engine, Event Radar, Artist Profiles & Fan Command Center  
**Total Use Cases:** 42 Use Cases  
**Actor Taxonomy:**
* **Guest (Unauthenticated Public Visitor):** Public discovery, search, radar clustering, idol directories, and outbound handshakes.
* **Fan (Authenticated Member - Inherits Guest):** Personalized dashboard, wishlist, crowdsourced reliability upvoting, immutable 1-level discussions, and notifications.
* **Organizer / Submitter (Authenticated Event Host - Inherits Fan):** Event listings submission, OpenRouter Gemini 4 Argon Vision OCR, 14-point verification breakdown, and logistical updates.
* **System Maintainer (Platform Administrator):** Master taxonomies (Venues with transit routes, Artists with member biodata, Categories), scam report audits, and platform overrides.
* **Autonomous Verification Engine (Automated Application Engine):** Whitelist domain checks, URL reachability tests, date validity, duplicate detection, multimodal OCR vision, and AI consensus scoring.

---

## 1. Actor Hierarchy & Relationship Model

```
       [ GUEST (Unauthenticated Public Visitor) ]
             |-- (Public Discovery, Browsing & Outbound Handshakes)
             |---> UC001: Register Account (Email / Google OAuth)
             |---> UC002: Browse Events Directory
             |---> UC003: Search Events (Artist, Group, Title, Venue, City)
             |---> UC004: Filter Events (Category, Artist, State, Precinct)
             |---> UC005: View Event Radar (Precinct Clusters & Same-Weekend Cohorts)
             |---> UC006: View Event Details (Live Countdown, Verified Evidence, Updates)
             |---> UC007: Open Official Ticket Link (Whitelisted Partner Handshake)
             |---> UC008: Open Venue Map & Transit Route (External Google Maps & Transit)
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

## 2. Master Use Case Registry (All 42 Use Cases)

| ID | Module | Use Case Name | Primary Actor | Secondary Actors | Key Relationships |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **UC001** | Module 1 | Register Account | Guest | Google OAuth Provider | Transition to Fan / Organizer |
| **UC002** | Module 1 | Browse Events Directory | Guest | Fan, Organizer, Maintainer | Base listing catalog |
| **UC003** | Module 1 | Search Events | Guest | Fan, Organizer, Maintainer | Case-insensitive keyword search |
| **UC004** | Module 1 | Filter Events | Guest | Fan, Organizer, Maintainer | Category, state, artist, precinct |
| **UC005** | Module 1 | View Event Radar | Guest | Fan, Organizer, Maintainer | Precinct & same-weekend clustering |
| **UC006** | Module 1 | View Event Details | Guest | Fan, Organizer, Maintainer | Real-time countdown & verification |
| **UC007** | Module 1 | Open Official Ticket Link | Guest | Fan, Organizer, Maintainer | Whitelisted ticketing handshake |
| **UC008** | Module 1 | Open Venue Map & Transit Route | Guest | Fan, Organizer, Maintainer | External Google Maps & LRT routing |
| **UC009** | Module 1 | Open Organizer Social Profile Link | Guest | Fan, Organizer, Maintainer | External X / Instagram profile |
| **UC010** | Module 1 | Share Event | Guest | Fan, Organizer, Maintainer | WhatsApp, X, Telegram, Clipboard |
| **UC011** | Module 1 | Export Event to Calendar | Guest | Fan, Organizer, Maintainer | Google Calendar web / iCal (.ics) |
| **UC012** | Module 1 | Browse Artists Directory | Guest | Fan, Organizer, Maintainer | Boy/Girl groups and soloists |
| **UC013** | Module 1 | View Artist & Member Profiles | Guest | Fan, Organizer, Maintainer | Normalized idol member biodata |
| **UC014** | Module 1 | View Event Discussion & Comments | Guest | Fan, Organizer, Maintainer | Public read-only Q&A viewing |
| **UC015** | Module 2 | Manage Personal Profile | Fan | Organizer, Maintainer | Profile bio, name, password |
| **UC016** | Module 2 | View Personalized Dashboard ("My K-Sync") | Fan | Organizer, Maintainer | Live countdown & saved shows |
| **UC017** | Module 2 | Bookmark / Save Event | Fan | Organizer, Maintainer | Wishlist storage (`saved_events`) |
| **UC018** | Module 2 | Recommend / Upvote Event | Fan | Organizer, Maintainer | Crowdsourced reliability score |
| **UC019** | Module 2 | Report Suspicious Listing | Fan | System Maintainer | Escalates to `reports` queue |
| **UC020** | Module 2 | Post Discussion Comment | Fan | Organizer, Maintainer | Immutable public commentary |
| **UC021** | Module 2 | Reply to Discussion Comment | Fan | Organizer, Maintainer | 1-level threaded Q&A |
| **UC022** | Module 2 | Delete Own Discussion Comment | Fan | System Maintainer | Anti-scalper immutability (No edit) |
| **UC023** | Module 2 | View In-App Notifications | Fan | Organizer, Maintainer | Bell tray alerts |
| **UC024** | Module 2 | Mark Notification as Read | Fan | Organizer, Maintainer | Unread badge clearance |
| **UC025** | Module 2 | Manage Notification Settings | Fan | Organizer, Maintainer | Schedule & countdown preferences |
| **UC026** | Module 3 | View Organizer Dashboard | Organizer | System Maintainer | Event management & status |
| **UC027** | Module 3 | Submit Event Listing | Organizer | Autonomous Verification Engine | Includes `AV01`, `AV05` |
| **UC028** | Module 3 | Edit Event Listing | Organizer | System Maintainer | Re-triggers autonomous audit |
| **UC029** | Module 3 | View Verification Breakdown | Organizer | Guest, Fan, Maintainer | Includes `AV06` |
| **UC030** | Module 3 | Post Logistical Event Update | Organizer | System Maintainer | Alerts saved ticket holders |
| **UC031** | Module 3 | Request Organizer Badge | Organizer | System Maintainer | Verified promoter application |
| **UC032** | Module 4 | View Maintainer Portal | System Maintainer | N/A | System telemetry & analytics |
| **UC033** | Module 4 | Manage Event Categories | System Maintainer | N/A | Taxonomy CRUD |
| **UC034** | Module 4 | Manage Venues Database | System Maintainer | N/A | Transit routes & coordinates |
| **UC035** | Module 4 | Manage Artists & Member Roster | System Maintainer | N/A | Normalized idol database |
| **UC036** | Module 4 | Audit Scam Reports | System Maintainer | Fan (Reporter) | Fraud sanctions & overrides |
| **AV01** | Module 5 | Audit Whitelisted Ticketing Domain | AutoVerifier | N/A | Whitelist domain check |
| **AV02** | Module 5 | Resolve Evidence URL & Readability | AutoVerifier | N/A | HTTP fetch & byte check |
| **AV03** | Module 5 | Verify Date & Time Validity | AutoVerifier | N/A | Future date validation |
| **AV04** | Module 5 | Check Duplicate Event Listings | AutoVerifier | N/A | Fuzzy match artist + date + venue |
| **AV05** | Module 5 | Multimodal OCR Vision Extraction | AutoVerifier | OpenRouter Gemini 4 Argon | Vision poster text extraction |
| **AV06** | Module 5 | Cross-Model AI Consensus Audit | AutoVerifier | Gemini 4 Argon, Gemma, Local | Consensus score calculation |

---

## 3. Structural Directives & Business Architecture

### 3.1 Autonomous Verification vs. Manual Admin Approval
* Traditional manual admin approval queues introduce severe publishing delays and administrative fatigue.
* In K-Sync Malaysia, listings submitted by authenticated organizers are immediately audited by the **Autonomous Verification Engine (AV01–AV06)**.
* Listings passing the hard gates (Reachable evidence URL, valid dates, whitelisted ticket provider, no duplicates) receive instant publication with a **Trust Score (0–100)** and public **Trust Badge (`VERIFIED_OFFICIAL` vs `COMMUNITY_UNVERIFIED`)**.
* System Maintainers retain supervisory power to audit scam reports (UC036) and override flagged listings, but are completely removed from the routine publishing critical path.

### 3.2 Anti-Scalper Discussion Immutability
* Secondary ticket scalpers frequently post legitimate logistical queries in fan forums, wait for upvotes, and subsequently edit the comment body to replace text with unauthorized scalper phone numbers or scam ticketing links.
* To completely eliminate this vector of fraud, **K-Sync Malaysia strictly prohibits comment editing**.
* Users may post (UC020), reply (UC021), and delete their own comments (UC022), but comments cannot be modified once published.

### 3.3 Explicit Outbound Button Modeling
* Per academic software engineering requirements, interactive handshakes with external services are modeled as first-class use cases:
  * **UC007:** Whitelisted Ticketing Link Handshake
  * **UC008:** Google Maps & Transit Route Handshake
  * **UC009:** Organizer Social Profile Link Handshake
  * **UC010:** Multi-Platform Event Sharing
  * **UC011:** Calendar (.ics & Google Calendar) Export