# K-Sync Malaysia — Use Case Specification (30 Core Use Cases)

**System:** K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions  
**Document Type:** Final Year Project (FYP) Software Requirements Specification (SRS)  
**Total Use Cases:** Exactly **30 Core Use Cases** (Modules A through H)  
**Actors:** 3 Human Actors (System Actor permanently removed)

---

## 1. System Actors (3 Human Roles)

| No. | Actor | Role Description & Permitted Scope |
| :--- | :--- | :--- |
| **1** | **Fan / Guest** | Combines public visitors and authenticated fans into one unified community persona. Unauthenticated guests can browse, search, filter, view event dossiers, and share events. Authenticated fans can register, log in (Email / Google Sign-In), manage profiles, save/unsave events, view personal bookmarks, post root questions, post 1-level nested replies, delete their own comments, and report suspicious events. |
| **2** | **Organizer / Submitter** | Public event submitter (promoter, fanclub representative, or fan) who submits events through the public submission form **without requiring an organizer account (Model 2)**. Provides event details and evidence URLs, tracks review status using a cryptographically random tracking code (e.g., `KS-2026-XXXXXX`), and corrects/resubmits rejected submissions. |
| **3** | **System Administrator** | Platform administrator possessing sole authority over verification, published event lifecycle, reference taxonomy, and content moderation. Reviews pending submissions, inspects evidence, approves and publishes listings with trust badges, rejects submissions with mandatory documented reasons, manages verified organizer status, edits published events, updates event statuses, unpublishes/deletes events, manages categories, venues, and artists/member profiles, deletes abusive comments, and investigates community reports. |

---

## 2. Master Use Case Catalog (30 Use Cases Across 8 Modules)

### Module A: Account & Profile Management (3 UCs)
*Log Out removed as requested; Authentication includes standard Email and Google Sign-In.*

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC01** | **Register Account** | Fan / Guest | Creates a personal fan account with name, username, email, and password. `GET/POST /register` |
| **UC02** | **Log In (Email / Google Sign-In)** | Fan / Guest, System Admin | Authenticates existing user or admin via email/password or Google Sign-In OAuth token. `GET/POST /login, POST /auth/google` |
| **UC03** | **Manage Profile** | Fan / Guest | Allows authenticated fan to update full name, bio, profile image URL, and social handle. `GET/POST /profile` |

### Module B: Event Discovery & Information (4 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC04** | **Browse Events** | Fan / Guest | Displays curated chronological directory of verified Malaysian K-Pop events with posters and status badges. `GET /events` |
| **UC05** | **Search Events** | Fan / Guest | Keyword search matching event names, artist names, venues, or cities using parameterized SQL queries. `GET /events?search={keyword}` |
| **UC06** | **Filter Events** | Fan / Guest | Multi-criteria filtering by event category (Concert, Fan Meeting, Festival), artist group, and city/state. `GET /events?category={slug}&artist={id}&location={city}` |
| **UC07** | **View Event Details** | Fan / Guest | Comprehensive event dossier displaying posters gallery, date, venue, ticketing link, idol biodata, and authenticity badge. `GET /events/:idOrSlug` |

### Module C: Saved & Shared Events (3 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC08** | **Save / Unsave Event** | Fan / Guest | Toggles an event in the authenticated fan's personal bookmark list via asynchronous API. `POST /api/events/:id/save` |
| **UC09** | **View Saved Events** | Fan / Guest | Displays personal dashboard grid of all events bookmarked by the logged-in fan. `GET /saved-events` |
| **UC10** | **Share Event** | Fan / Guest | Broadcasts event via native Web Share API or interactive modal (WhatsApp, X/Twitter, Telegram, Facebook, and Copy Link). `Client Modal & Web Share API` |

### Module D: Public Event Submission (Model 2: Without Account) (3 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC11** | **Submit Event (Provide Event Details)** | Organizer / Submitter | Submits event details, schedule, venue, posters, and mandatory evidence URLs without needing an account; generates tracking code. `GET/POST /submit-event` |
| **UC12** | **Check Submission Status (Tracking Code)** | Organizer / Submitter | Checks review progress (Pending, Verified, Rejected) using unique tracking code or submitter email. `GET /check-submission` |
| **UC13** | **Correct and Resubmit Event** | Organizer / Submitter | Allows submitter of a rejected/pending event to update incorrect fields and resubmit for re-review. «extend» UC12. `POST /check-submission/resubmit` |

### Module E: Submission Review & Verification (5 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC14** | **View Pending Submissions** | System Administrator | Displays administrative moderation queue of all submitted events awaiting verification. `GET /admin/verifications` |
| **UC15** | **Review Event Submission** | System Administrator | Inspects submitted details, compares external source links (Weverse, promoter X), and checks duplicate detection. `GET /admin/verifications` |
| **UC16** | **Approve and Publish Submission** | System Administrator | Approves authentic submission, sets trust badge (Official vs Community), publishes to catalog, and notifies submitter. `POST /admin/verifications/approve-event` |
| **UC17** | **Reject Submission (Mandatory Reason)** | System Administrator | Rejects submission with mandatory documented reason; sends explanation email with resubmission instructions. `POST /admin/verifications/reject-event` |
| **UC18** | **Manage Verified Organizer Status** | System Administrator | Audits and grants/revokes verified organizer trust badge to fanclub or promoter accounts. `POST /admin/verifications/verify-organizer` |

### Module F: Published Event Management (6 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC19** | **Edit Event Information** | System Administrator | Updates published event details when organizers release updated schedules, ticketing URLs, or poster visuals. `POST /admin/events/update` |
| **UC20** | **Update Event Status** | System Administrator | Updates event lifecycle status to UPCOMING, ONGOING, COMPLETED, POSTPONED, or CANCELLED with warning banners. `POST /admin/events/update-status` |
| **UC21** | **Unpublish / Delete Event** | System Administrator | Permanently deletes or unpublishes duplicate, fraudulent, or cancelled events with confirmation modal. `POST /admin/events/delete` |
| **UC22** | **Manage Event Categories** | System Administrator | Creates, views, and deletes event taxonomy classifications (Concerts, Fan Meetings, Cupsleeve Projects, Festivals). `GET/POST /admin/categories/*` |
| **UC23** | **Manage Venues** | System Administrator | Maintains Malaysian venue directory (names, addresses, transit notes, cities, states) for standardized filtering. `GET/POST /admin/venues/*` |
| **UC24** | **Manage Artists and Member Profiles** | System Administrator | Maintains K-Pop idol groups and individual member biodata profiles (stage name, role, photo, birth date). `GET/POST /admin/artists/*` |

### Module G: Fan Community Discussions (4 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC25** | **View Event Discussion** | Fan / Guest | Publicly reads contextual, 1-level threaded questions, logistical advice, and answers beneath single event view. `GET /events/:idOrSlug#discussion` |
| **UC26** | **Create Discussion Post** | Fan / Guest | Authenticated fan posts a root question or logistics tip within the event discussion section. `POST /api/chat/:eventId` |
| **UC27** | **Reply to Discussion (1-Level Nested)** | Fan / Guest | Authenticated fan, submitter, or admin posts a direct 1-level nested reply with visual indent rail and author badge. `POST /api/chat/:eventId (parent_id)` |
| **UC28** | **Delete Own Comment** | Fan / Guest, System Admin | Author can delete their own comment/reply; System Administrator can delete any abusive comment during moderation. `DELETE /api/chat/:messageId` |

### Module H: Content Moderation & Governance (2 UCs)

| ID | Use Case Name | Primary Actor | Description & Technical Route |
| :--- | :--- | :--- | :--- |
| **UC29** | **Report Event** | Fan / Guest | Authenticated fan flags a suspicious ticket link, impostor listing, or cancelled event with evidence URL. «extend» UC07. `POST /api/events/:id/report` |
| **UC30** | **Investigate and Moderate Report** | System Administrator | Reviews reports moderation queue, inspects counter-evidence, and takes action (Dismiss, Remove, or Suspend Event). `GET/POST /admin/reports/*` |

---

## 3. UML Relationships Summary

1. **«include» Relationships:**
   - `UC11 (Submit Event)` «include» `Provide Event Details & Supporting Evidence` (form field completion is mandatory to submit).
2. **«extend» Relationships:**
   - `UC13 (Correct and Resubmit Event)` «extend» `UC12 (Check Submission Status)`: Activated conditionally only when a submission has been reviewed and flagged/rejected.
   - `UC29 (Report Event)` «extend» `UC07 (View Event Details)`: Activated optionally by authenticated fans when inspecting an event that appears fraudulent or inaccurate.

---

## 4. Role-Based Access Control (RBAC) Authority Matrix

| Functional Module | Fan / Guest | Organizer / Submitter | System Administrator |
| :--- | :---: | :---: | :---: |
| **A. Account & Profile Management** | Full Access (Register, Log In, Manage Profile) | N/A (No Account Required) | Admin Log In |
| **B. Event Discovery & Information** | Full Public Read (Browse, Search, Filter, Details) | Full Public Read | Full Access |
| **C. Saved & Shared Events** | Public Share; Authenticated Save & View Saved | Public Share | Available |
| **D. Public Event Submission (Model 2)** | Can submit as public user | Submit Event, Check Status, Correct & Resubmit | Full Audit & Management |
| **E. Submission Review & Verification** | Forbidden (HTTP 403) | Forbidden (HTTP 403) | Sole Authority (Approve, Reject, Verify) |
| **F. Published Event Management** | Forbidden (HTTP 403) | Forbidden (HTTP 403) | Sole Authority (Edit, Status, Taxonomy) |
| **G. Fan Community Discussions** | Public Read; Authenticated Post, Reply, Delete Own | Public Read; Reply to Event Threads | Full Moderation (Delete Any Comment) |
| **H. Content Moderation & Governance** | Authenticated Report Submission | Login Required to Report | Sole Authority (Investigate & Enforce) |

---

## 5. Strict Academic Boundaries (Excluded Scope)

The following items are strictly and explicitly excluded from the system to preserve examiner alignment:
1. **Ticket Sales / Reservations / Payment Gateways:** Outbound ticket links direct fans to official verified ticket merchants (GoLive, Ticket2U, BookMyShow). Zero monetary transactions occur on K-Sync.
2. **Merchandise Sales / Stock Tracking:** No shopping cart or merchandise ordering functionality.
3. **Event Buddy Matching:** Removed from scope.
4. **Internal Background Tasks Parked:** Transactional SMTP emails and system audit logs operate as internal technical processes and are excluded from human actor use cases.
