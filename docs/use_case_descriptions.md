# K-Sync Malaysia: Complete Use Case Descriptions (All 30 Use Cases)

**Project Title:** K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions  
**Document Type:** Detailed Software Requirements Specification (SRS) — Use Case Descriptions  
**Total Use Cases:** 30 Core Use Cases across 8 Functional Modules  
**Actors:** 3 Human Actors (`Fan / Guest`, `Organizer / Submitter`, `System Administrator`)  
**Scope Status:** Fully verified and backed by active routes in the codebase.

---

## Table of Contents

- [1. System Actors & Role Definitions](#1-system-actors--role-definitions)
- [2. Master Use Case Summary Table](#2-master-use-case-summary-table)
- [3. Detailed Use Case Descriptions](#3-detailed-use-case-descriptions)
  - [UC01: Register Account](#uc01-register-account)
  - [UC02: Log In (Email / Google Sign-In)](#uc02-log-in-email-google-sign-in-)
  - [UC03: Manage Profile](#uc03-manage-profile)
  - [UC04: Browse Events](#uc04-browse-events)
  - [UC05: Search Events](#uc05-search-events)
  - [UC06: Filter Events](#uc06-filter-events)
  - [UC07: View Event Details](#uc07-view-event-details)
  - [UC08: Save / Unsave Event](#uc08-save-unsave-event)
  - [UC09: View Saved Events](#uc09-view-saved-events)
  - [UC10: Share Event](#uc10-share-event)
  - [UC11: Submit Event (Provide Event Details)](#uc11-submit-event-provide-event-details-)
  - [UC12: Check Submission Status (Tracking Code)](#uc12-check-submission-status-tracking-code-)
  - [UC13: Correct and Resubmit Event](#uc13-correct-and-resubmit-event)
  - [UC14: View Pending Submissions](#uc14-view-pending-submissions)
  - [UC15: Review Event Submission](#uc15-review-event-submission)
  - [UC16: Approve and Publish Submission](#uc16-approve-and-publish-submission)
  - [UC17: Reject Submission (Mandatory Reason)](#uc17-reject-submission-mandatory-reason-)
  - [UC18: Manage Verified Organizer Status](#uc18-manage-verified-organizer-status)
  - [UC19: Edit Event Information](#uc19-edit-event-information)
  - [UC20: Update Event Status](#uc20-update-event-status)
  - [UC21: Unpublish / Delete Event](#uc21-unpublish-delete-event)
  - [UC22: Manage Event Categories](#uc22-manage-event-categories)
  - [UC23: Manage Venues](#uc23-manage-venues)
  - [UC24: Manage Artists and Member Profiles](#uc24-manage-artists-and-member-profiles)
  - [UC25: View Event Discussion](#uc25-view-event-discussion)
  - [UC26: Create Discussion Post](#uc26-create-discussion-post)
  - [UC27: Reply to Discussion](#uc27-reply-to-discussion)
  - [UC28: Delete Own Comment](#uc28-delete-own-comment)
  - [UC29: Report Event](#uc29-report-event)
  - [UC30: Investigate and Moderate Report](#uc30-investigate-and-moderate-report)
- [4. Role-Based Access Control (RBAC) Matrix](#4-role-based-access-control-rbac-matrix)
- [5. Requirements-to-Code Traceability](#5-requirements-to-code-traceability)
- [6. Strict Academic Exclusions & Scope Boundaries](#6-strict-academic-exclusions--scope-boundaries)

---

## 1. System Actors & Role Definitions

| Actor | Category | Role Description & Permitted Scope |
| :--- | :--- | :--- |
| **Fan / Guest** | Primary Human Actor | Unifies unauthenticated visitors and authenticated fans under one community persona:<br>• **As Guest (Public):** Browse, search, filter, view event details dossiers, and share events (WhatsApp, X, Telegram, Copy Link).<br>• **As Authenticated Fan:** Register account, log in (Email / Google Sign-In), manage profile, save/unsave events, view saved events, create discussion comments, reply to comments (1-level nested), delete own comments, and report suspicious events. |
| **Organizer / Submitter** | Public Submitter (Model 2) | Event promoters, fanclub representatives, or fans submitting Malaysian K-pop events **without requiring an organizer account**:<br>• Submits event details, schedule, venue, posters, and mandatory evidence URLs.<br>• Receives and tracks progress using a unique 6-character random tracking code (e.g. `KS-2026-7F3K9Q`).<br>• Corrects and resubmits rejected or pending submissions. |
| **System Administrator** | Platform Authority | Sole administrative and moderation authority:<br>• Inspects review queue, verifies evidence links against official sources, and approves/publishes events with trust badges (`OFFICIAL` vs `COMMUNITY`).<br>• Rejects submissions with mandatory documented justification and email feedback.<br>• Manages verified organizer credentials.<br>• Edits published event details, updates event lifecycle status, and unpublishes/deletes events.<br>• Maintains taxonomies (Categories, Venues, Artists, and Idol Member Profiles).<br>• Moderates community discussions (deletes any comment) and investigates user reports. |

---

## 2. Master Use Case Summary Table

| Use Case ID | Use Case Name | Module | Primary Actor | Implementation Route |
| :--- | :--- | :--- | :--- | :--- |
| **UC01** | Register Account | A. Account & Profile Management | Fan / Guest | `GET /register` |
| **UC02** | Log In (Email / Google Sign-In) | A. Account & Profile Management | Fan / Guest / System Admin | `GET /login` |
| **UC03** | Manage Profile | A. Account & Profile Management | Fan / Guest | `GET /profile` |
| **UC04** | Browse Events | B. Event Discovery & Information | Fan / Guest | `GET /` |
| **UC05** | Search Events | B. Event Discovery & Information | Fan / Guest | `GET /events?search={keyword}` |
| **UC06** | Filter Events | B. Event Discovery & Information | Fan / Guest | `GET /events?category={slug}&artist={id}&location={city}` |
| **UC07** | View Event Details | B. Event Discovery & Information | Fan / Guest | `GET /events/:idOrSlug` |
| **UC08** | Save / Unsave Event | C. Saved & Shared Events | Fan / Guest | `POST /api/events/:id/save` |
| **UC09** | View Saved Events | C. Saved & Shared Events | Fan / Guest | `GET /saved-events` |
| **UC10** | Share Event | C. Saved & Shared Events | Fan / Guest | `Client-side modal & Web Share API (views/event-details.ejs#share-modal)` |
| **UC11** | Submit Event (Provide Event Details) | D. Public Event Submission (Without Account) | Organizer / Submitter | `GET /submit-event` |
| **UC12** | Check Submission Status (Tracking Code) | D. Public Event Submission (Without Account) | Organizer / Submitter | `GET /check-submission` |
| **UC13** | Correct and Resubmit Event | D. Public Event Submission (Without Account) | Organizer / Submitter | `POST /check-submission/resubmit` |
| **UC14** | View Pending Submissions | E. Submission Review & Verification | System Administrator | `GET /admin/verifications` |
| **UC15** | Review Event Submission | E. Submission Review & Verification | System Administrator | `GET /admin/verifications` |
| **UC16** | Approve and Publish Submission | E. Submission Review & Verification | System Administrator | `POST /admin/verifications/approve-event` |
| **UC17** | Reject Submission (Mandatory Reason) | E. Submission Review & Verification | System Administrator | `POST /admin/verifications/reject-event` |
| **UC18** | Manage Verified Organizer Status | E. Submission Review & Verification | System Administrator | `POST /admin/verifications/verify-organizer` |
| **UC19** | Edit Event Information | F. Published Event Management | System Administrator | `GET /admin/events` |
| **UC20** | Update Event Status | F. Published Event Management | System Administrator | `POST /admin/events/update-status` |
| **UC21** | Unpublish / Delete Event | F. Published Event Management | System Administrator | `POST /admin/events/delete` |
| **UC22** | Manage Event Categories | F. Published Event Management | System Administrator | `GET /admin/categories` |
| **UC23** | Manage Venues | F. Published Event Management | System Administrator | `GET /admin/venues` |
| **UC24** | Manage Artists and Member Profiles | F. Published Event Management | System Administrator | `GET /admin/artists` |
| **UC25** | View Event Discussion | G. Fan Community Discussions | Fan / Guest | `GET /events/:idOrSlug#discussion` |
| **UC26** | Create Discussion Post | G. Fan Community Discussions | Fan / Guest | `POST /api/chat/:eventId` |
| **UC27** | Reply to Discussion | G. Fan Community Discussions | Fan / Guest | `POST /api/chat/:eventId (with parent_id)` |
| **UC28** | Delete Own Comment | G. Fan Community Discussions | Fan / Guest / System Administrator | `DELETE /api/chat/:messageId` |
| **UC29** | Report Event | H. Content Moderation & Governance | Fan / Guest | `POST /api/events/:id/report` |
| **UC30** | Investigate and Moderate Report | H. Content Moderation & Governance | System Administrator | `GET /admin/reports` |

---

## 3. Detailed Use Case Descriptions

### UC01: Register Account

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC01** |
| **Use Case Name** | **Register Account** |
| **Module** | **A. Account & Profile Management** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None (Optional Google OAuth Provider) |
| **Short Purpose** | Allows a visitor to create a personal fan account to access interactive features like saving events, participating in discussions, and filing reports. |
| **Trigger** | User clicks the "Register" button on the navigation bar. |
| **Preconditions** | The user is not currently logged into any active session. |
| **Postconditions (Success)** | A new user record with role "FAN" is inserted into the database with a bcrypt-hashed password, and the user is redirected to log in or logged in automatically. |
| **Business Rules & Security** | Passwords must never be stored in plaintext. Passwords must be hashed with bcrypt. |
| **Implemented Route(s)** | `GET /register, POST /register` |

#### Main Success Scenario (Basic Flow)
1. Visitor navigates to the Registration page (/register).
2. System displays the registration form requesting Full Name, Username, Email, Password, and Password Confirmation.
3. Visitor enters the required credentials and submits the form.
4. System validates that all mandatory fields are present and well-formed.
5. System checks the database to verify that the username and email are unique.
6. System securely hashes the password using bcrypt with salt rounds >= 10.
7. System creates the user record with default role "FAN".
8. System establishes an authenticated session or displays a success message redirecting the user to log in.

#### Alternative & Exceptional Flows
- **4a. Validation Failure:** If email format is invalid or password is under 6 characters, the system redisplays the form with specific error alerts.
- **5a. Duplicate Account:** If username or email already exists in the database, the system halts registration and alerts: "Username or email is already registered."

---

### UC02: Log In (Email / Google Sign-In)

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC02** |
| **Use Case Name** | **Log In (Email / Google Sign-In)** |
| **Module** | **A. Account & Profile Management** |
| **Primary Actor** | **Fan / Guest / System Admin** |
| **Secondary Actors** | Google Identity Provider (Optional) |
| **Short Purpose** | Authenticates a returning user or administrator using their email/username and password, or Google Sign-In token, establishing a secure HTTP session. |
| **Trigger** | User clicks "Log In" and submits credentials on the login page. |
| **Preconditions** | User has an existing registered account. |
| **Postconditions (Success)** | An authenticated server-side session is created with userId and role, and the user is redirected to their intended destination or home page. |
| **Business Rules & Security** | Enforce constant-time string comparison or secure hash checking. Do not leak whether the username or password specifically was wrong. |
| **Implemented Route(s)** | `GET /login, POST /login, POST /auth/google` |

#### Main Success Scenario (Basic Flow)
1. User accesses the Login page (/login).
2. System renders the login form accepting Username/Email and Password, as well as a "Sign in with Google" button.
3. User inputs their credentials (or completes Google OAuth flow) and submits the form.
4. System queries the database for an active user matching the provided username or email.
5. System compares the submitted password against the stored bcrypt password_hash (or validates Google ID token).
6. Upon match, system binds the user session with userId, username, and role (FAN or ADMIN).
7. System redirects the user to the dashboard (if Admin) or the requested page (if Fan).

#### Alternative & Exceptional Flows
- **4a. User Not Found:** System displays "Invalid username/email or password." (generic error to prevent account enumeration).
- **5a. Password Mismatch:** System increments failed login attempts and displays the generic authentication failure message.

---

### UC03: Manage Profile

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC03** |
| **Use Case Name** | **Manage Profile** |
| **Module** | **A. Account & Profile Management** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows a fan to view and update personal profile attributes such as full name, bio, profile image URL, and social handle. |
| **Trigger** | User clicks "My Profile" from the account navigation menu. |
| **Preconditions** | User is authenticated as a Registered Fan. |
| **Postconditions (Success)** | The user profile record in the database is updated with new personal information. |
| **Business Rules & Security** | Email changes or role elevations cannot be performed through ordinary profile management. |
| **Implemented Route(s)** | `GET /profile, POST /profile` |

#### Main Success Scenario (Basic Flow)
1. Fan navigates to the Profile page (/profile).
2. System loads and displays current account information (full name, email, bio, image).
3. Fan modifies editable fields and clicks "Save Changes".
4. System validates field lengths and format.
5. System executes an UPDATE query on the users table.
6. System refreshes the session profile cache and displays a success notification.

#### Alternative & Exceptional Flows
- **4a. Invalid Data:** If full name is blank or bio exceeds character limits, system aborts update and displays validation error.

---

### UC04: Browse Events

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC04** |
| **Use Case Name** | **Browse Events** |
| **Module** | **B. Event Discovery & Information** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Presents a curated, chronological directory of all published Malaysian K-Pop events with high-resolution posters and status badges. |
| **Trigger** | User visits the home page (/) or clicks "Events" in the top navigation bar. |
| **Preconditions** | Events table contains verified and published event listings. |
| **Postconditions (Success)** | System renders the events grid showing event cards sorted by upcoming date. |
| **Business Rules & Security** | Unverified or rejected submissions must NEVER appear in public browse listings. |
| **Implemented Route(s)** | `GET /, GET /events` |

#### Main Success Scenario (Basic Flow)
1. User accesses the event directory (/events).
2. System queries the database for all events where verification_status = "VERIFIED".
3. System joins artist, category, and venue metadata.
4. System dynamically calculates chronological event status (Upcoming, Ongoing, Completed).
5. System renders the event catalog cards displaying poster, artist, date, venue, and trust badge.

#### Alternative & Exceptional Flows
- **2a. No Published Events Found:** System displays an engaging empty state with an invitation to submit an event.

---

### UC05: Search Events

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC05** |
| **Use Case Name** | **Search Events** |
| **Module** | **B. Event Discovery & Information** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables users to quickly locate specific concerts, fan meetings, or festivals by typing keywords matching event titles, artists, or venues. |
| **Trigger** | User types into the search input box and submits the query. |
| **Preconditions** | User is on any public event listing page. |
| **Postconditions (Success)** | System returns only published events matching the search keyword in title, artist name, venue name, or city. |
| **Business Rules & Security** | Parameterized queries must be used to ensure protection against SQL injection. |
| **Implemented Route(s)** | `GET /events?search={keyword}` |

#### Main Success Scenario (Basic Flow)
1. User enters a search term (e.g. "SEVENTEEN", "Axiata", "Fan Meeting") into the search bar.
2. Client submits query parameter ?search=keyword to /events.
3. System sanitizes the search input against SQL injection.
4. System executes a parameterized query with wildcard LIKE matching on event_name, artist name, venue_name, and city.
5. System displays the matching results count and filtered event cards.

#### Alternative & Exceptional Flows
- **5a. Zero Results:** System displays "No events found matching your search" with a button to reset filters.

---

### UC06: Filter Events

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC06** |
| **Use Case Name** | **Filter Events** |
| **Module** | **B. Event Discovery & Information** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows users to narrow event listings by specific categories (Concert, Fan Meeting, Festival), artist groups, or geographic cities/states. |
| **Trigger** | User selects a category pill, artist dropdown, or city filter on the events page. |
| **Preconditions** | Event reference data (categories, artists, venues) is populated. |
| **Postconditions (Success)** | Catalog updates dynamically to show only events matching the combined filter criteria. |
| **Business Rules & Security** | Filtering must preserve sorting order by event_date ASC so upcoming shows appear first. |
| **Implemented Route(s)** | `GET /events?category={slug}&artist={id}&location={city}` |

#### Main Success Scenario (Basic Flow)
1. User selects filter options (e.g., Category: "Concert", Location: "Kuala Lumpur").
2. System constructs a dynamic SQL query combining the chosen filters.
3. System filters records where verification_status = "VERIFIED" and category_id and city match.
4. System renders the refined event collection with active filter chips.

#### Alternative & Exceptional Flows
- **3a. Reset Filters:** User clicks "Clear Filters"; system reloads the full default listing.

---

### UC07: View Event Details

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC07** |
| **Use Case Name** | **View Event Details** |
| **Module** | **B. Event Discovery & Information** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Displays the comprehensive single event dossier, including official posters gallery, schedule, venue map, ticket tiers, idol biodata, and authenticity badge. |
| **Trigger** | User clicks on an event card from the home or events directory. |
| **Preconditions** | The event exists in the database and is verified (or viewed by Admin). |
| **Postconditions (Success)** | Full details page (/events/:idOrSlug) is rendered with complete logistical information and embedded community discussion. |
| **Business Rules & Security** | Outbound ticketing links must display safety indicators (whitelisted vs. third-party platform). |
| **Implemented Route(s)** | `GET /events/:idOrSlug` |

#### Main Success Scenario (Basic Flow)
1. User selects an event card.
2. System looks up the event by numerical ID or SEO-friendly slug.
3. System retrieves event record, associated artist profile, and member biodata (from members table).
4. System parses visual gallery posters and ticketing security domain.
5. System evaluates authenticity badge (Verified Official vs. Community Event).
6. System retrieves discussion threads and renders the complete page view.

#### Alternative & Exceptional Flows
- **2a. Event Not Found:** System sets a flash error "Event not found" and redirects to /events.

---

### UC08: Save / Unsave Event

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC08** |
| **Use Case Name** | **Save / Unsave Event** |
| **Module** | **C. Saved & Shared Events** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables authenticated fans to toggle an event in their personal bookmark list for quick access and tracking. |
| **Trigger** | Fan clicks the bookmark (heart/star) icon on an event card or details page. |
| **Preconditions** | User is authenticated as a Registered Fan. |
| **Postconditions (Success)** | An association record in saved_events is inserted (if saved) or removed (if unsaved). |
| **Business Rules & Security** | Saved events table must enforce a unique composite constraint on (user_id, event_id). |
| **Implemented Route(s)** | `POST /api/events/:id/save` |

#### Main Success Scenario (Basic Flow)
1. Fan clicks the bookmark icon on an event.
2. Client sends an asynchronous POST request to /api/events/:id/save.
3. Server verifies user authentication session.
4. Server checks if a record exists in saved_events for (user_id, event_id).
5. If not present, system inserts a new saved_events record and returns { saved: true }.
6. If already present, system deletes the record and returns { saved: false }.
7. Client UI updates the bookmark button icon and state in real time.

#### Alternative & Exceptional Flows
- **3a. Unauthenticated:** Server returns HTTP 401 Unauthorized; client prompts the user to log in.

---

### UC09: View Saved Events

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC09** |
| **Use Case Name** | **View Saved Events** |
| **Module** | **C. Saved & Shared Events** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Displays a dedicated personal dashboard containing all events bookmarked by the logged-in fan. |
| **Trigger** | Fan clicks "Saved Events" in their profile navigation menu. |
| **Preconditions** | Fan is logged in. |
| **Postconditions (Success)** | System displays the fan personal collection of saved concerts and fan meetings. |
| **Business Rules & Security** | Fans cannot view other users' private saved event lists. |
| **Implemented Route(s)** | `GET /saved-events` |

#### Main Success Scenario (Basic Flow)
1. Fan navigates to /saved-events.
2. System queries saved_events joined with events and artists for req.session.userId.
3. System filters only active verified events.
4. System renders the bookmarked event grid with quick links to event details.

#### Alternative & Exceptional Flows
- **3a. No Saved Events:** System displays an informative empty state: "You haven't saved any events yet. Explore concerts!"

---

### UC10: Share Event

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC10** |
| **Use Case Name** | **Share Event** |
| **Module** | **C. Saved & Shared Events** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | WhatsApp, Telegram, X (Twitter), Facebook, Native Web Share API |
| **Short Purpose** | Enables fans and visitors to broadcast verified event details to friends or social media groups via native mobile share, social buttons, or one-click URL copying. |
| **Trigger** | User clicks the "Share" button on an event details page or catalog card. |
| **Preconditions** | The event listing is published and viewable. |
| **Postconditions (Success)** | Interactive sharing modal is displayed, or native OS share sheet is activated with pre-formatted event title and verified link. |
| **Business Rules & Security** | Shared links always point to canonical, verified event URLs (/events/:slug) free of tracking bloat. |
| **Implemented Route(s)** | `Client-side modal & Web Share API (views/event-details.ejs#share-modal)` |

#### Main Success Scenario (Basic Flow)
1. User clicks the "Share" button on an event details page.
2. If on a mobile browser supporting navigator.share, system opens the native mobile share sheet.
3. If on a desktop browser, system opens the interactive Share Modal.
4. System generates instant social share links for WhatsApp, X (Twitter), Telegram, and Facebook with encoded title and venue.
5. System provides a dedicated one-click "Copy" button that writes the canonical event URL to the user's clipboard.
6. System displays a confirmation toast notification: "Event link copied to clipboard!"

#### Alternative & Exceptional Flows
- **2a. Native Share Cancelled:** If the user cancels the OS share sheet, system remains on the event page with zero disruption.
- **5a. Clipboard Permission Blocked:** System highlights the URL input field for easy manual copy (Ctrl+C).

---

### UC11: Submit Event (Provide Event Details)

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC11** |
| **Use Case Name** | **Submit Event (Provide Event Details)** |
| **Module** | **D. Public Event Submission (Without Account)** |
| **Primary Actor** | **Organizer / Submitter** |
| **Secondary Actors** | Email Service (SMTP Transactional Mailer) |
| **Short Purpose** | Enables any fanclub leader, promoter, or fan to submit a Malaysian K-Pop event without creating an account, supplying mandatory evidence links and posters. |
| **Trigger** | User clicks "Submit Event" on the main navigation bar. |
| **Preconditions** | Public submission form is accessible. |
| **Postconditions (Success)** | A new event record is stored with status PENDING, a unique 6-character tracking code (e.g. KS-2026-7F3K9Q) is generated, and a confirmation email is dispatched. |
| **Business Rules & Security** | No account registration is required (Model 2). The tracking code must be cryptographically unpredictable. |
| **Implemented Route(s)** | `GET /submit-event, POST /submit-event, GET /submission-success` |

#### Main Success Scenario (Basic Flow)
1. Submitter opens the Submit Event page (/submit-event).
2. System displays the submission form requesting Event Name, Artist, Category, Date, Time, Venue, Submitter Contact (Name & Email), Official Evidence URL, and Posters.
3. Submitter fills in the fields, uploads 1 to 4 poster images, and confirms the good-faith declaration.
4. Submitter submits the form.
5. System validates mandatory inputs and verifies that an evidence URL is provided.
6. System uploads poster files to server storage (/public/uploads/).
7. System generates an unpredictable random tracking code (KS-2026-XXXXXX).
8. System inserts the record into events with verification_status = "PENDING".
9. System dispatches a transactional confirmation email containing the tracking code to the submitter.
10. System redirects the submitter to the success page displaying their tracking code.

#### Alternative & Exceptional Flows
- **5a. Missing Evidence Link:** System rejects submission with error: "Proof of authenticity (official announcement / evidence link) is mandatory."
- **5b. Incomplete Form:** Form reloads preserving entered data and highlights missing mandatory fields.

---

### UC12: Check Submission Status (Tracking Code)

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC12** |
| **Use Case Name** | **Check Submission Status (Tracking Code)** |
| **Module** | **D. Public Event Submission (Without Account)** |
| **Primary Actor** | **Organizer / Submitter** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables a submitter to check the current review stage (Pending, Verified, or Rejected) of their submitted event using their unique tracking code or email. |
| **Trigger** | Submitter enters their tracking code into the submission status tracker. |
| **Preconditions** | Submitter possesses a valid tracking code from a previous submission. |
| **Postconditions (Success)** | System displays the current review status, admin verification notes, or official rejection reasons. |
| **Business Rules & Security** | Submitters can only view the submission details tied to the matching tracking code. |
| **Implemented Route(s)** | `GET /check-submission` |

#### Main Success Scenario (Basic Flow)
1. Submitter visits the Check Submission page (/check-submission).
2. Submitter inputs their tracking code (e.g. KS-2026-AB12CD) or submission email.
3. System queries the events table for matching tracking_code or submitter_email.
4. System renders the status tracker card showing current state (PENDING, VERIFIED, or REJECTED).
5. If verified, system displays a direct link to the published live event page.
6. If rejected, system displays the admin rejection reason and provides a "Correct and Resubmit" option.

#### Alternative & Exceptional Flows
- **3a. Invalid Code:** System displays: "No submission found matching that tracking code. Please verify your reference number."

---

### UC13: Correct and Resubmit Event

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC13** |
| **Use Case Name** | **Correct and Resubmit Event** |
| **Module** | **D. Public Event Submission (Without Account)** |
| **Primary Actor** | **Organizer / Submitter** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows a submitter whose event was rejected or marked with issues to update incorrect details, update evidence links, and resubmit for admin re-review. |
| **Trigger** | Submitter clicks "Correct and Resubmit" from the status tracker page. |
| **Preconditions** | The submission exists and is in REJECTED or PENDING state with matching tracking code. |
| **Postconditions (Success)** | The event details are updated, verification_status is reset to PENDING, rejection_reason is cleared, and an audit entry is logged. |
| **Business Rules & Security** | Resubmission is only allowed for the matching tracking code and cannot be performed on already approved/published events without admin intervention. |
| **Implemented Route(s)** | `POST /check-submission/resubmit` |

#### Main Success Scenario (Basic Flow)
1. Submitter opens the resubmission form from /check-submission.
2. Submitter modifies inaccurate details (e.g., corrected ticket link, updated venue, new poster).
3. Submitter submits the correction form.
4. System validates the updated inputs against required formats.
5. System updates the event record, resets verification_status to "PENDING", and clears previous rejection reasons.
6. System logs the resubmission in activity_logs.
7. System redirects submitter to status page with a success message confirming resubmission.

#### Alternative & Exceptional Flows
- **4a. Invalid Data:** System displays error alert and prevents submission until required fields are filled.

---

### UC14: View Pending Submissions

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC14** |
| **Use Case Name** | **View Pending Submissions** |
| **Module** | **E. Submission Review & Verification** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Displays the administrative moderation queue listing all submitted events currently awaiting verification. |
| **Trigger** | Admin selects "Pending Verifications" from the admin sidebar. |
| **Preconditions** | User is authenticated with role = "ADMIN". |
| **Postconditions (Success)** | System renders the pending submissions dashboard with submitter info, evidence links, and action buttons. |
| **Business Rules & Security** | Only authorized administrators can access this view. Regular fans receive HTTP 403 Forbidden. |
| **Implemented Route(s)** | `GET /admin/verifications` |

#### Main Success Scenario (Basic Flow)
1. Admin accesses /admin/verifications.
2. System queries events where verification_status = "PENDING" ordered by created_at ASC.
3. System displays the queue table showing Submission Date, Event Name, Submitter, Organizer Type, and Evidence Link.
4. Admin can filter or search through pending submissions.

#### Alternative & Exceptional Flows
- **2a. Queue Empty:** System displays: "All submissions reviewed! No pending events waiting in the queue."

---

### UC15: Review Event Submission

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC15** |
| **Use Case Name** | **Review Event Submission** |
| **Module** | **E. Submission Review & Verification** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows an administrator to inspect full submission evidence, compare source links against official artist/promoter channels, and detect potential duplicate events. |
| **Trigger** | Admin clicks "Inspect / Review" on a pending submission in the queue. |
| **Preconditions** | Admin is logged in and viewing the pending verifications table. |
| **Postconditions (Success)** | Detailed inspection modal or review panel is opened with full evidence audit controls. |
| **Business Rules & Security** | Admins must verify that event details match an independent, authoritative external source. |
| **Implemented Route(s)** | `GET /admin/verifications` |

#### Main Success Scenario (Basic Flow)
1. Admin clicks "Review" on a submission item.
2. System displays submitted details: Artist, Date, Venue, Evidence Link, Submitter Social Handle, and Posters.
3. System checks the database for existing events with identical artist and date (duplicate detection alert).
4. Admin opens the evidence link in an external tab to inspect the source authority (Weverse, Official Promoter X, Ticketing Platform).
5. Admin determines the authenticity classification.

#### Alternative & Exceptional Flows
- **3a. Duplicate Event Detected:** System highlights an alert: "Warning: Another event for this artist on this date already exists (#Event ID)."

---

### UC16: Approve and Publish Submission

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC16** |
| **Use Case Name** | **Approve and Publish Submission** |
| **Module** | **E. Submission Review & Verification** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | Email Service (SMTP Transactional Mailer) |
| **Short Purpose** | Approves an authentic submission, assigns a verified trust level badge (Official or Community), publishes the event to the public directory, and notifies the submitter. |
| **Trigger** | Admin clicks "Approve Event" in the review panel. |
| **Preconditions** | The submission has been verified as authentic by the administrator. |
| **Postconditions (Success)** | Event verification_status becomes "VERIFIED", trust_level is set, audit record is written, the event appears in public browse listings, and an approval email is sent. |
| **Business Rules & Security** | Published events are immediately indexed and visible to all site visitors. |
| **Implemented Route(s)** | `POST /admin/verifications/approve-event` |

#### Main Success Scenario (Basic Flow)
1. Admin selects trust level (OFFICIAL for tour schedule/promoter announcement, or COMMUNITY for cupsleeve/fanclub project).
2. Admin enters verification notes documenting the sources checked.
3. Admin clicks "Approve Event".
4. System updates event record: verification_status = "VERIFIED", trust_level = chosen level, admin_verification_notes = notes.
5. System records action in activity_logs with admin user ID and IP address.
6. System triggers an automated approval email containing the live event link to the submitter.
7. System displays confirmation toast and refreshes the pending queue count.

#### Alternative & Exceptional Flows
- **4a. Database Failure:** System rolls back transaction, alerts admin, and preserves pending status.

---

### UC17: Reject Submission (Mandatory Reason)

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC17** |
| **Use Case Name** | **Reject Submission (Mandatory Reason)** |
| **Module** | **E. Submission Review & Verification** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | Email Service (SMTP Transactional Mailer) |
| **Short Purpose** | Rejects an unverified, duplicate, or fraudulent submission, requiring a mandatory documented justification that is communicated to the submitter. |
| **Trigger** | Admin clicks "Reject Event" in the review panel. |
| **Preconditions** | Submission fails authenticity criteria, contains deceptive info, or duplicates existing listings. |
| **Postconditions (Success)** | Event verification_status becomes "REJECTED", rejection_reason is recorded, audit record is logged, and a notification email is sent to the submitter. |
| **Business Rules & Security** | A rejection reason is strictly mandatory. Arbitrary rejection without recorded justification is prohibited by system validation. |
| **Implemented Route(s)** | `POST /admin/verifications/reject-event` |

#### Main Success Scenario (Basic Flow)
1. Admin clicks "Reject Event".
2. System prompts admin for a mandatory rejection reason (e.g. "Duplicate listing", "No official source found", "Mismatched date").
3. Admin inputs justification and confirms rejection.
4. System updates event record: verification_status = "REJECTED", rejection_reason = reason.
5. System writes an audit entry into activity_logs.
6. System dispatches a transactional rejection email explaining the reason and offering re-review instructions via tracking code.
7. System updates the verification dashboard.

#### Alternative & Exceptional Flows
- **2a. Empty Rejection Reason:** System prevents submission and highlights: "Rejection reason is mandatory to ensure transparency and accountability."

---

### UC18: Manage Verified Organizer Status

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC18** |
| **Use Case Name** | **Manage Verified Organizer Status** |
| **Module** | **E. Submission Review & Verification** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables administrators to grant or revoke "Verified Organizer" status to fanclub or event company accounts following credential auditing. |
| **Trigger** | Admin clicks "Verify Organizer" or "Revoke Status" on an organizer profile. |
| **Preconditions** | Target user account exists with organization credentials. |
| **Postconditions (Success)** | Target user is_verified_organizer column is set to 1 (Verified) or 0 (Standard), updating their public trust badge. |
| **Business Rules & Security** | Verified status displays a green verified badge next to the organizer name on all associated events. |
| **Implemented Route(s)** | `POST /admin/verifications/verify-organizer, POST /admin/verifications/revoke-organizer` |

#### Main Success Scenario (Basic Flow)
1. Admin views the organizer verifications section in /admin/verifications.
2. Admin reviews organizer identity credentials and past track record of organized events.
3. Admin clicks "Verify Organizer".
4. System updates users table: is_verified_organizer = 1.
5. System logs action in activity_logs.
6. Admin receives success feedback; organizer profile reflects verified badge.

#### Alternative & Exceptional Flows
- **3a. Revoke Status:** If a verified organizer engages in deceptive practices, admin clicks "Revoke Status"; system resets status to 0.

---

### UC19: Edit Event Information

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC19** |
| **Use Case Name** | **Edit Event Information** |
| **Module** | **F. Published Event Management** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows administrators to update published event details when organizers release revised schedules, additional poster visuals, or venue updates. |
| **Trigger** | Admin clicks "Edit Event" in the admin events manager. |
| **Preconditions** | Event exists in the database and admin is logged in. |
| **Postconditions (Success)** | Event record is updated with new schedules, ticket URLs, or poster visuals. |
| **Business Rules & Security** | All administrative event edits are logged with admin ID and timestamp in system activity logs. |
| **Implemented Route(s)** | `GET /admin/events, POST /admin/events/update` |

#### Main Success Scenario (Basic Flow)
1. Admin navigates to /admin/events.
2. Admin clicks "Edit" on a specific event listing.
3. System displays the event edit form prepopulated with current information.
4. Admin makes necessary adjustments (e.g. updating start_time or adding ticketing URL).
5. Admin clicks "Save Changes".
6. System validates modified fields and executes an UPDATE query.
7. System logs the modification in activity_logs and displays a success notification.

#### Alternative & Exceptional Flows
- **4a. Validation Error:** If date format or URL is malformed, system prevents saving and highlights erroneous field.

---

### UC20: Update Event Status

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC20** |
| **Use Case Name** | **Update Event Status** |
| **Module** | **F. Published Event Management** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows administrators to explicitly change an event lifecycle status to UPCOMING, ONGOING, COMPLETED, POSTPONED, or CANCELLED based on official promoter announcements. |
| **Trigger** | Admin selects a new status from the status dropdown on the admin event manager. |
| **Preconditions** | Event is published in the database. |
| **Postconditions (Success)** | Event event_status column is updated, and public badges update to inform fans. |
| **Business Rules & Security** | Marking an event CANCELLED or POSTPONED displays a prominent warning banner across the public event details page. |
| **Implemented Route(s)** | `POST /admin/events/update-status` |

#### Main Success Scenario (Basic Flow)
1. Admin locates the event in the /admin/events list.
2. Admin selects the new status (e.g., "POSTPONED" or "CANCELLED") from the dropdown.
3. Client posts the update to /admin/events/update-status.
4. Server verifies admin authorization.
5. Server updates event_status in the events table.
6. Server logs the status change in activity_logs.
7. Server returns success response; UI updates status badge.

#### Alternative & Exceptional Flows
- **3a. Unauthorized:** Non-admin request rejected with HTTP 403.

---

### UC21: Unpublish / Delete Event

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC21** |
| **Use Case Name** | **Unpublish / Delete Event** |
| **Module** | **F. Published Event Management** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables administrators to delete or withdraw a fraudulent, duplicate, or completely revoked event listing from the platform. |
| **Trigger** | Admin clicks the delete (trash) icon on an event listing. |
| **Preconditions** | Admin is logged in and confirms deletion modal. |
| **Postconditions (Success)** | Event record and related discussion messages are removed or marked hidden, and an audit entry is created. |
| **Business Rules & Security** | Deletion requires explicit confirmation to prevent accidental loss of published event data. |
| **Implemented Route(s)** | `POST /admin/events/delete` |

#### Main Success Scenario (Basic Flow)
1. Admin clicks "Delete" on an event card in the /admin/events view.
2. System prompts admin with a confirmation dialog: "Are you sure you want to permanently delete this event?"
3. Admin confirms deletion.
4. System deletes associated records (saved_events, chat messages) and deletes the event record.
5. System writes an audit entry into activity_logs.
6. System refreshes the event list and shows confirmation notification.

#### Alternative & Exceptional Flows
- **2a. Cancel Action:** Admin dismisses the confirmation dialog; no deletion occurs.

---

### UC22: Manage Event Categories

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC22** |
| **Use Case Name** | **Manage Event Categories** |
| **Module** | **F. Published Event Management** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows administrators to create, view, and delete event taxonomy categories (e.g. Concert, Fan Meeting, Cupsleeve, Festival, Pop-Up Store). |
| **Trigger** | Admin navigates to the Categories tab in the admin portal. |
| **Preconditions** | Admin is authenticated. |
| **Postconditions (Success)** | Category records in event_categories table are created or removed. |
| **Business Rules & Security** | Categories with active associated events cannot be deleted without reassigning events first. |
| **Implemented Route(s)** | `GET /admin/categories, POST /admin/categories/add, POST /admin/categories/delete` |

#### Main Success Scenario (Basic Flow)
1. Admin visits /admin/categories.
2. System displays the existing categories table with names, slugs, and associated event counts.
3. Admin fills in "New Category Name" and badge color, then clicks "Add Category".
4. System generates an SEO slug and inserts the new record into event_categories.
5. System refreshes the table showing the newly created category.

#### Alternative & Exceptional Flows
- **4a. Category Deletion:** Admin clicks delete on an unused category; system verifies no active events depend on it, then deletes the record.

---

### UC23: Manage Venues

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC23** |
| **Use Case Name** | **Manage Venues** |
| **Module** | **F. Published Event Management** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables administrators to maintain the directory of Malaysian concert and exhibition venues, including venue names, cities, states, and transit notes. |
| **Trigger** | Admin accesses the Venues management page. |
| **Preconditions** | Admin is authenticated. |
| **Postconditions (Success)** | Venue records in the venues table are created or updated. |
| **Business Rules & Security** | Venues provide standardized location filtering and map references for fans. |
| **Implemented Route(s)** | `GET /admin/venues, POST /admin/venues/add, POST /admin/venues/delete` |

#### Main Success Scenario (Basic Flow)
1. Admin opens /admin/venues.
2. System renders the Malaysian venues directory (e.g., Axiata Arena, Zepp KL, Mega Star Arena, Stadium Merdeka).
3. Admin inputs Venue Name, City, State, and Address into the creation form.
4. Admin clicks "Add Venue".
5. System inserts the venue record into the venues table.
6. System updates the venue dropdown options across the submission and edit forms.

#### Alternative & Exceptional Flows
- **3a. Duplicate Venue:** System warns if a venue with identical name in the same city already exists.

---

### UC24: Manage Artists and Member Profiles

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC24** |
| **Use Case Name** | **Manage Artists and Member Profiles** |
| **Module** | **F. Published Event Management** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows administrators to create and maintain K-Pop artist groups and their individual member biodata profiles (stage name, role, photo, birth date, zodiac). |
| **Trigger** | Admin clicks the Artists tab in the admin portal. |
| **Preconditions** | Admin is authenticated. |
| **Postconditions (Success)** | Records in artists and members tables are updated or created. |
| **Business Rules & Security** | Normalized members table links to artists.id via foreign key cascade. |
| **Implemented Route(s)** | `GET /admin/artists, POST /admin/artists/add, POST /admin/artists/delete` |

#### Main Success Scenario (Basic Flow)
1. Admin navigates to /admin/artists.
2. System displays all registered artists (e.g. SEVENTEEN, TOMORROW X TOGETHER, TWICE, NewJeans).
3. Admin enters artist name, agency, group type, and banner image, then clicks "Add Artist".
4. System creates the artist record in the artists table.
5. Admin can open member profile manager to configure individual idol profiles in the members table.
6. System updates the artist catalog across the platform.

#### Alternative & Exceptional Flows
- **3a. Empty Artist Name:** System prompts validation error requiring an artist name.

---

### UC25: View Event Discussion

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC25** |
| **Use Case Name** | **View Event Discussion** |
| **Module** | **G. Fan Community Discussions** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables fans and visitors to read contextual, 1-level threaded questions, logistical tips, and answers posted beneath any specific event listing. |
| **Trigger** | User scrolls down to the "#discussion" section on any single event details page. |
| **Preconditions** | Event details page is loaded. |
| **Postconditions (Success)** | Threaded discussion comments and replies are rendered with author badges and relative timestamps. |
| **Business Rules & Security** | Discussions are open to read for everyone, including unauthenticated visitors. |
| **Implemented Route(s)** | `GET /events/:idOrSlug#discussion` |

#### Main Success Scenario (Basic Flow)
1. User accesses an event page (/events/:idOrSlug).
2. System queries event_chat_messages for the event joined with users table.
3. System organizes messages into root comments and 1-level nested replies using parent_id.
4. System renders author badges ([Event Submitter], [Admin]) and relative timestamps (e.g. "2 hours ago").
5. User reads discussion thread.

#### Alternative & Exceptional Flows
- **2a. Zero Comments:** System displays an inviting prompt: "No comments or questions yet. Be the first fan to start the discussion!"

---

### UC26: Create Discussion Post

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC26** |
| **Use Case Name** | **Create Discussion Post** |
| **Module** | **G. Fan Community Discussions** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows authenticated fans to post a root question, transportation tip, or general query regarding an event. |
| **Trigger** | Fan writes a message in the discussion box and clicks "Post Comment". |
| **Preconditions** | User is authenticated as a Registered Fan, and the event discussion is active (within 24h post-event window). |
| **Postconditions (Success)** | A new record is inserted into event_chat_messages with parent_id = NULL, and the thread updates in real time. |
| **Business Rules & Security** | Message text must be non-empty and sanitized against malicious HTML tags. |
| **Implemented Route(s)** | `POST /api/chat/:eventId` |

#### Main Success Scenario (Basic Flow)
1. Fan scrolls to the Community Discussion box.
2. Fan types a question (e.g., "Does Axiata Arena allow power banks inside the standing zone?").
3. Fan clicks "Post Comment".
4. System verifies that user is logged in.
5. System verifies the event is not past the 24-hour post-event archive window.
6. System sanitizes message text against XSS scripting.
7. System inserts message into event_chat_messages with parent_id = NULL.
8. System reloads the discussion section smoothly displaying the new comment.

#### Alternative & Exceptional Flows
- **4a. Guest User:** Input box is replaced with a banner: "Please Log In or Register to join the discussion."
- **5a. Archived Discussion:** If event ended > 24 hours ago, system prevents posting and displays: "Discussion archived."

---

### UC27: Reply to Discussion

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC27** |
| **Use Case Name** | **Reply to Discussion** |
| **Module** | **G. Fan Community Discussions** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables fans, submitters, or administrators to post a direct 1-level nested reply to an existing question or topic starter. |
| **Trigger** | Fan clicks the "[Reply]" button beneath an existing comment. |
| **Preconditions** | User is authenticated, and the parent comment exists in the event discussion. |
| **Postconditions (Success)** | A reply record is inserted into event_chat_messages with parent_id referencing the root comment ID, indented under the parent. |
| **Business Rules & Security** | Nesting is capped at 1 level to avoid messy, unreadable multi-level trees on mobile devices. |
| **Implemented Route(s)** | `POST /api/chat/:eventId (with parent_id)` |

#### Main Success Scenario (Basic Flow)
1. Fan clicks "[Reply]" on a specific comment (e.g., replying to the power bank inquiry).
2. System expands an inline reply textarea directly beneath that comment.
3. Fan enters their reply (e.g., "Yes, but max 20,000 mAh only based on previous venue rules!").
4. Fan clicks "Reply".
5. System validates message and stores it with parent_id = target_comment_id.
6. System refreshes the thread, displaying the reply nested with an indented guide rail and "↳" indicator.

#### Alternative & Exceptional Flows
- **1a. Guest User:** Clicking reply opens prompt requesting the user to log in first.

---

### UC28: Delete Own Comment

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC28** |
| **Use Case Name** | **Delete Own Comment** |
| **Module** | **G. Fan Community Discussions** |
| **Primary Actor** | **Fan / Guest / System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows a fan to delete their own discussion comment or reply, and allows administrators to remove offending messages during moderation. |
| **Trigger** | User clicks the trash icon on their own comment. |
| **Preconditions** | User is authenticated and owns the comment (comment.user_id == req.session.userId) OR has role = "ADMIN". |
| **Postconditions (Success)** | The comment and any direct child replies are deleted from event_chat_messages. |
| **Business Rules & Security** | Users can only delete their own posts; administrators can delete any post for moderation. |
| **Implemented Route(s)** | `DELETE /api/chat/:messageId, POST /api/chat/:messageId/delete` |

#### Main Success Scenario (Basic Flow)
1. User locates their own comment and clicks the trash icon.
2. Browser displays a confirmation dialog: "Are you sure you want to delete this comment?"
3. User confirms.
4. Client issues a DELETE request to /api/chat/:messageId.
5. Server verifies that session user ID matches comment user_id (or user role is ADMIN).
6. Server executes DELETE FROM event_chat_messages WHERE id = :id OR parent_id = :id.
7. Client removes the comment element from the DOM with an animated fade-out.

#### Alternative & Exceptional Flows
- **5a. Unauthorized Deletion Attempt:** If a user tries to delete another user's post without admin privileges, server returns HTTP 403 Forbidden.

---

### UC29: Report Event

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC29** |
| **Use Case Name** | **Report Event** |
| **Module** | **H. Content Moderation & Governance** |
| **Primary Actor** | **Fan / Guest** |
| **Secondary Actors** | None |
| **Short Purpose** | Enables fans to report suspicious ticket scalper links, deceptive event listings, cancelled shows, or abusive discussion messages to platform administrators. |
| **Trigger** | Fan clicks the "Report Event" button or flags a comment. |
| **Preconditions** | User is authenticated as a Registered Fan. |
| **Postconditions (Success)** | A structured report record is stored in the reports table with status "PENDING" and evidence URL. |
| **Business Rules & Security** | Anonymous reporting is disabled to prevent malicious spam and competitor sabotage. |
| **Implemented Route(s)** | `POST /api/events/:id/report` |

#### Main Success Scenario (Basic Flow)
1. Fan clicks "Report Event" on an event details page.
2. System displays the structured report modal containing a violation checklist (Scam Tickets, Impostor Organizer, Inaccurate Schedule, Cancelled Event, Other).
3. Fan selects a reason, inputs detailed description (>= 20 characters), provides counter-evidence URL, and confirms anti-defamation declaration.
4. Fan submits report.
5. System checks anti-spam rule (verifies no active pending report from this user for this event).
6. System inserts report record into reports table with status = "PENDING".
7. System displays confirmation message that moderation will audit within 24 hours.

#### Alternative & Exceptional Flows
- **1a. Unauthenticated Fan:** Modal informs user that only verified community members can file reports to prevent competitor sabotage.
- **5a. Duplicate Active Report:** System returns: "You already have an active report under review for this listing."

---

### UC30: Investigate and Moderate Report

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **UC30** |
| **Use Case Name** | **Investigate and Moderate Report** |
| **Module** | **H. Content Moderation & Governance** |
| **Primary Actor** | **System Administrator** |
| **Secondary Actors** | None |
| **Short Purpose** | Allows administrators to review submitted community reports, examine counter-evidence, and take enforcement actions (Dismiss, Remove Content, or Suspend Event). |
| **Trigger** | Admin opens the Reports queue in the admin center. |
| **Preconditions** | Admin is logged in and reports exist with status "PENDING". |
| **Postconditions (Success)** | Report status is updated to RESOLVED or DISMISSED, appropriate moderation action is executed on target entity, and an audit entry is logged. |
| **Business Rules & Security** | Every moderation action is logged with admin ID, timestamp, and action summary in the audit trail. |
| **Implemented Route(s)** | `GET /admin/reports, POST /admin/reports/action, POST /admin/reports/resolve` |

#### Main Success Scenario (Basic Flow)
1. Admin navigates to /admin/reports.
2. System renders the reports moderation queue showing reporter, target event, violation reason, details, and counter-evidence link.
3. Admin examines the reported issue against official ticketing or promoter channels.
4. Admin chooses an enforcement action: Dismiss Report, Suspend Event Listing, or Remove Content.
5. Admin confirms decision.
6. System updates report status to "RESOLVED" (or "DISMISSED") in reports table.
7. If confirmed fraudulent, system sets event verification_status = "SUSPENDED" or unpublishes the listing.
8. System logs the moderation action in activity_logs.

#### Alternative & Exceptional Flows
- **4a. Dismissal:** If report is baseless, admin clicks "Dismiss"; report is closed with status DISMISSED and no penalty to the event.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Functional Module | Fan / Guest | Organizer / Submitter | System Administrator |
| :--- | :---: | :---: | :---: |
| **A. Account & Profile Management** | Full Access (Register, Log In, Manage Profile) | N/A (No Account Required) | Admin Log In |
| **B. Event Discovery & Information** | Public Read (Browse, Search, Filter, Details) | Public Read | Full Access |
| **C. Saved & Shared Events** | Public Share; Authenticated Save & View Saved | Public Share | Available |
| **D. Public Event Submission (Model 2)** | Can submit as public user | Submit Event, Check Status, Correct & Resubmit | Full Review & Audit |
| **E. Submission Review & Verification** | Forbidden (HTTP 403) | Forbidden (HTTP 403) | Sole Authority (Approve, Reject, Verify) |
| **F. Published Event Management** | Forbidden (HTTP 403) | Forbidden (HTTP 403) | Sole Authority (Edit, Status, Taxonomy) |
| **G. Fan Community Discussions** | Public Read; Authenticated Post, Reply, Delete Own | Public Read; Reply to Event Threads | Full Moderation (Delete Any Comment) |
| **H. Content Moderation & Governance** | Authenticated Report Submission | Login Required to Report | Sole Authority (Investigate & Enforce) |

---

## 5. Requirements-to-Code Traceability

| ID | Use Case Name | Primary Actor | Implemented Routes | Primary View Template | Database Table(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UC01** | Register Account | Fan / Guest | `GET /register, POST /register` | `views/*` | `users` |
| **UC02** | Log In (Email / Google Sign-In) | Fan / Guest / System Admin | `GET /login, POST /login, POST /auth/google` | `views/*` | `users` |
| **UC03** | Manage Profile | Fan / Guest | `GET /profile, POST /profile` | `views/*` | `users` |
| **UC04** | Browse Events | Fan / Guest | `GET /, GET /events` | `views/*` | `events, artists, venues` |
| **UC05** | Search Events | Fan / Guest | `GET /events?search={keyword}` | `views/*` | `events, artists, venues` |
| **UC06** | Filter Events | Fan / Guest | `GET /events?category={slug}&artist={id}&location={city}` | `views/*` | `events, artists, venues` |
| **UC07** | View Event Details | Fan / Guest | `GET /events/:idOrSlug` | `views/event-details.ejs` | `events, artists, venues` |
| **UC08** | Save / Unsave Event | Fan / Guest | `POST /api/events/:id/save` | `views/event-details.ejs` | `saved_events` |
| **UC09** | View Saved Events | Fan / Guest | `GET /saved-events` | `views/*` | `saved_events` |
| **UC10** | Share Event | Fan / Guest | `Client-side modal & Web Share API (views/event-details.ejs#share-modal)` | `views/*` | `saved_events` |
| **UC11** | Submit Event (Provide Event Details) | Organizer / Submitter | `GET /submit-event, POST /submit-event, GET /submission-success` | `views/submit-event.ejs` | `users` |
| **UC12** | Check Submission Status (Tracking Code) | Organizer / Submitter | `GET /check-submission` | `views/*` | `users` |
| **UC13** | Correct and Resubmit Event | Organizer / Submitter | `POST /check-submission/resubmit` | `views/submit-event.ejs` | `users` |
| **UC14** | View Pending Submissions | System Administrator | `GET /admin/verifications` | `views/admin/*` | `events, artists, venues` |
| **UC15** | Review Event Submission | System Administrator | `GET /admin/verifications` | `views/admin/*` | `events, artists, venues` |
| **UC16** | Approve and Publish Submission | System Administrator | `POST /admin/verifications/approve-event` | `views/admin/*` | `events, artists, venues` |
| **UC17** | Reject Submission (Mandatory Reason) | System Administrator | `POST /admin/verifications/reject-event` | `views/admin/*` | `events, artists, venues` |
| **UC18** | Manage Verified Organizer Status | System Administrator | `POST /admin/verifications/verify-organizer, POST /admin/verifications/revoke-organizer` | `views/admin/*` | `events, artists, venues` |
| **UC19** | Edit Event Information | System Administrator | `GET /admin/events, POST /admin/events/update` | `views/admin/*` | `events, artists, venues` |
| **UC20** | Update Event Status | System Administrator | `POST /admin/events/update-status` | `views/admin/*` | `events, artists, venues` |
| **UC21** | Unpublish / Delete Event | System Administrator | `POST /admin/events/delete` | `views/admin/*` | `events, artists, venues` |
| **UC22** | Manage Event Categories | System Administrator | `GET /admin/categories, POST /admin/categories/add, POST /admin/categories/delete` | `views/admin/*` | `events, artists, venues` |
| **UC23** | Manage Venues | System Administrator | `GET /admin/venues, POST /admin/venues/add, POST /admin/venues/delete` | `views/admin/*` | `events, artists, venues` |
| **UC24** | Manage Artists and Member Profiles | System Administrator | `GET /admin/artists, POST /admin/artists/add, POST /admin/artists/delete` | `views/admin/*` | `events, artists, venues` |
| **UC25** | View Event Discussion | Fan / Guest | `GET /events/:idOrSlug#discussion` | `views/event-details.ejs` | `event_chat_messages` |
| **UC26** | Create Discussion Post | Fan / Guest | `POST /api/chat/:eventId` | `views/*` | `event_chat_messages` |
| **UC27** | Reply to Discussion | Fan / Guest | `POST /api/chat/:eventId (with parent_id)` | `views/*` | `event_chat_messages` |
| **UC28** | Delete Own Comment | Fan / Guest / System Administrator | `DELETE /api/chat/:messageId, POST /api/chat/:messageId/delete` | `views/*` | `event_chat_messages` |
| **UC29** | Report Event | Fan / Guest | `POST /api/events/:id/report` | `views/event-details.ejs` | `reports` |
| **UC30** | Investigate and Moderate Report | System Administrator | `GET /admin/reports, POST /admin/reports/action, POST /admin/reports/resolve` | `views/admin/*` | `reports` |

---

## 6. Strict Academic Exclusions & Scope Boundaries

The following features are strictly excluded from the assessed system to maintain rigorous FYP scope integrity:
1. **Ticket Booking / Payment Processing:** Outbound ticketing URLs redirect users to official vendors (e.g. GoLive, Ticket2U). K-Sync does not process payments or manage seat selections.
2. **Merchandise Sales / Stock Tracking:** No shopping cart or physical product inventory.
3. **Event Buddy Matching:** Explicitly removed from project requirements.
4. **Internal Background Processes:** Automated transactional email dispatch and activity logging operate internally and are excluded from human actor use cases.

---
*K-Sync Malaysia &copy; 2026/2027. Final Year Project System Specification Report.*
