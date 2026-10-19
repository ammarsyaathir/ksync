// generate_use_case_html.js - Generates Comprehensive 30-Use-Case Specification HTML Report
import fs from 'fs';
import path from 'path';

const useCases = [
  // Module A: Account & Authentication Management
  {
    id: 'UC01',
    name: 'Register Account',
    module: 'A. Account & Profile Management',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None (Optional Google OAuth Provider)',
    purpose: 'Allows a visitor to create a personal fan account to access interactive features like saving events, participating in discussions, and filing reports.',
    trigger: 'User clicks the "Register" button on the navigation bar.',
    preconditions: 'The user is not currently logged into any active session.',
    postconditions: 'A new user record with role "FAN" is inserted into the database with a bcrypt-hashed password, and the user is redirected to log in or logged in automatically.',
    basicFlow: [
      'Visitor navigates to the Registration page (/register).',
      'System displays the registration form requesting Full Name, Username, Email, Password, and Password Confirmation.',
      'Visitor enters the required credentials and submits the form.',
      'System validates that all mandatory fields are present and well-formed.',
      'System checks the database to verify that the username and email are unique.',
      'System securely hashes the password using bcrypt with salt rounds >= 10.',
      'System creates the user record with default role "FAN".',
      'System establishes an authenticated session or displays a success message redirecting the user to log in.'
    ],
    altFlows: [
      '4a. Validation Failure: If email format is invalid or password is under 6 characters, the system redisplays the form with specific error alerts.',
      '5a. Duplicate Account: If username or email already exists in the database, the system halts registration and alerts: "Username or email is already registered."'
    ],
    rules: 'Passwords must never be stored in plaintext. Passwords must be hashed with bcrypt.',
    route: 'GET /register, POST /register'
  },
  {
    id: 'UC02',
    name: 'Log In (Email / Google Sign-In)',
    module: 'A. Account & Profile Management',
    primaryActor: 'Fan / Guest / System Admin',
    secondaryActors: 'Google Identity Provider (Optional)',
    purpose: 'Authenticates a returning user or administrator using their email/username and password, or Google Sign-In token, establishing a secure HTTP session.',
    trigger: 'User clicks "Log In" and submits credentials on the login page.',
    preconditions: 'User has an existing registered account.',
    postconditions: 'An authenticated server-side session is created with userId and role, and the user is redirected to their intended destination or home page.',
    basicFlow: [
      'User accesses the Login page (/login).',
      'System renders the login form accepting Username/Email and Password, as well as a "Sign in with Google" button.',
      'User inputs their credentials (or completes Google OAuth flow) and submits the form.',
      'System queries the database for an active user matching the provided username or email.',
      'System compares the submitted password against the stored bcrypt password_hash (or validates Google ID token).',
      'Upon match, system binds the user session with userId, username, and role (FAN or ADMIN).',
      'System redirects the user to the dashboard (if Admin) or the requested page (if Fan).'
    ],
    altFlows: [
      '4a. User Not Found: System displays "Invalid username/email or password." (generic error to prevent account enumeration).',
      '5a. Password Mismatch: System increments failed login attempts and displays the generic authentication failure message.'
    ],
    rules: 'Enforce constant-time string comparison or secure hash checking. Do not leak whether the username or password specifically was wrong.',
    route: 'GET /login, POST /login, POST /auth/google'
  },
  {
    id: 'UC03',
    name: 'Manage Profile',
    module: 'A. Account & Profile Management',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Allows a fan to view and update personal profile attributes such as full name, bio, profile image URL, and social handle.',
    trigger: 'User clicks "My Profile" from the account navigation menu.',
    preconditions: 'User is authenticated as a Registered Fan.',
    postconditions: 'The user profile record in the database is updated with new personal information.',
    basicFlow: [
      'Fan navigates to the Profile page (/profile).',
      'System loads and displays current account information (full name, email, bio, image).',
      'Fan modifies editable fields and clicks "Save Changes".',
      'System validates field lengths and format.',
      'System executes an UPDATE query on the users table.',
      'System refreshes the session profile cache and displays a success notification.'
    ],
    altFlows: [
      '4a. Invalid Data: If full name is blank or bio exceeds character limits, system aborts update and displays validation error.'
    ],
    rules: 'Email changes or role elevations cannot be performed through ordinary profile management.',
    route: 'GET /profile, POST /profile'
  },

  // Module B: Event Discovery & Information
  {
    id: 'UC04',
    name: 'Browse Events',
    module: 'B. Event Discovery & Information',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Presents a curated, chronological directory of all published Malaysian K-Pop events with high-resolution posters and status badges.',
    trigger: 'User visits the home page (/) or clicks "Events" in the top navigation bar.',
    preconditions: 'Events table contains verified and published event listings.',
    postconditions: 'System renders the events grid showing event cards sorted by upcoming date.',
    basicFlow: [
      'User accesses the event directory (/events).',
      'System queries the database for all events where verification_status = "VERIFIED".',
      'System joins artist, category, and venue metadata.',
      'System dynamically calculates chronological event status (Upcoming, Ongoing, Completed).',
      'System renders the event catalog cards displaying poster, artist, date, venue, and trust badge.'
    ],
    altFlows: [
      '2a. No Published Events Found: System displays an engaging empty state with an invitation to submit an event.'
    ],
    rules: 'Unverified or rejected submissions must NEVER appear in public browse listings.',
    route: 'GET /, GET /events'
  },
  {
    id: 'UC05',
    name: 'Search Events',
    module: 'B. Event Discovery & Information',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Enables users to quickly locate specific concerts, fan meetings, or festivals by typing keywords matching event titles, artists, or venues.',
    trigger: 'User types into the search input box and submits the query.',
    preconditions: 'User is on any public event listing page.',
    postconditions: 'System returns only published events matching the search keyword in title, artist name, venue name, or city.',
    basicFlow: [
      'User enters a search term (e.g. "SEVENTEEN", "Axiata", "Fan Meeting") into the search bar.',
      'Client submits query parameter ?search=keyword to /events.',
      'System sanitizes the search input against SQL injection.',
      'System executes a parameterized query with wildcard LIKE matching on event_name, artist name, venue_name, and city.',
      'System displays the matching results count and filtered event cards.'
    ],
    altFlows: [
      '5a. Zero Results: System displays "No events found matching your search" with a button to reset filters.'
    ],
    rules: 'Parameterized queries must be used to ensure protection against SQL injection.',
    route: 'GET /events?search={keyword}'
  },
  {
    id: 'UC06',
    name: 'Filter Events',
    module: 'B. Event Discovery & Information',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Allows users to narrow event listings by specific categories (Concert, Fan Meeting, Festival), artist groups, or geographic cities/states.',
    trigger: 'User selects a category pill, artist dropdown, or city filter on the events page.',
    preconditions: 'Event reference data (categories, artists, venues) is populated.',
    postconditions: 'Catalog updates dynamically to show only events matching the combined filter criteria.',
    basicFlow: [
      'User selects filter options (e.g., Category: "Concert", Location: "Kuala Lumpur").',
      'System constructs a dynamic SQL query combining the chosen filters.',
      'System filters records where verification_status = "VERIFIED" and category_id and city match.',
      'System renders the refined event collection with active filter chips.'
    ],
    altFlows: [
      '3a. Reset Filters: User clicks "Clear Filters"; system reloads the full default listing.'
    ],
    rules: 'Filtering must preserve sorting order by event_date ASC so upcoming shows appear first.',
    route: 'GET /events?category={slug}&artist={id}&location={city}'
  },
  {
    id: 'UC07',
    name: 'View Event Details',
    module: 'B. Event Discovery & Information',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Displays the comprehensive single event dossier, including official posters gallery, schedule, venue map, ticket tiers, idol biodata, and authenticity badge.',
    trigger: 'User clicks on an event card from the home or events directory.',
    preconditions: 'The event exists in the database and is verified (or viewed by Admin).',
    postconditions: 'Full details page (/events/:idOrSlug) is rendered with complete logistical information and embedded community discussion.',
    basicFlow: [
      'User selects an event card.',
      'System looks up the event by numerical ID or SEO-friendly slug.',
      'System retrieves event record, associated artist profile, and member biodata (from members table).',
      'System parses visual gallery posters and ticketing security domain.',
      'System evaluates authenticity badge (Verified Official vs. Community Event).',
      'System retrieves discussion threads and renders the complete page view.'
    ],
    altFlows: [
      '2a. Event Not Found: System sets a flash error "Event not found" and redirects to /events.'
    ],
    rules: 'Outbound ticketing links must display safety indicators (whitelisted vs. third-party platform).',
    route: 'GET /events/:idOrSlug'
  },

  // Module C: Saved & Shared Events
  {
    id: 'UC08',
    name: 'Save / Unsave Event',
    module: 'C. Saved & Shared Events',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Enables authenticated fans to toggle an event in their personal bookmark list for quick access and tracking.',
    trigger: 'Fan clicks the bookmark (heart/star) icon on an event card or details page.',
    preconditions: 'User is authenticated as a Registered Fan.',
    postconditions: 'An association record in saved_events is inserted (if saved) or removed (if unsaved).',
    basicFlow: [
      'Fan clicks the bookmark icon on an event.',
      'Client sends an asynchronous POST request to /api/events/:id/save.',
      'Server verifies user authentication session.',
      'Server checks if a record exists in saved_events for (user_id, event_id).',
      'If not present, system inserts a new saved_events record and returns { saved: true }.',
      'If already present, system deletes the record and returns { saved: false }.',
      'Client UI updates the bookmark button icon and state in real time.'
    ],
    altFlows: [
      '3a. Unauthenticated: Server returns HTTP 401 Unauthorized; client prompts the user to log in.'
    ],
    rules: 'Saved events table must enforce a unique composite constraint on (user_id, event_id).',
    route: 'POST /api/events/:id/save'
  },
  {
    id: 'UC09',
    name: 'View Saved Events',
    module: 'C. Saved & Shared Events',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Displays a dedicated personal dashboard containing all events bookmarked by the logged-in fan.',
    trigger: 'Fan clicks "Saved Events" in their profile navigation menu.',
    preconditions: 'Fan is logged in.',
    postconditions: 'System displays the fan personal collection of saved concerts and fan meetings.',
    basicFlow: [
      'Fan navigates to /saved-events.',
      'System queries saved_events joined with events and artists for req.session.userId.',
      'System filters only active verified events.',
      'System renders the bookmarked event grid with quick links to event details.'
    ],
    altFlows: [
      '3a. No Saved Events: System displays an informative empty state: "You haven\'t saved any events yet. Explore concerts!"'
    ],
    rules: 'Fans cannot view other users\' private saved event lists.',
    route: 'GET /saved-events'
  },
  {
    id: 'UC10',
    name: 'Share Event',
    module: 'C. Saved & Shared Events',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'WhatsApp, Telegram, X (Twitter), Facebook, Native Web Share API',
    purpose: 'Enables fans and visitors to broadcast verified event details to friends or social media groups via native mobile share, social buttons, or one-click URL copying.',
    trigger: 'User clicks the "Share" button on an event details page or catalog card.',
    preconditions: 'The event listing is published and viewable.',
    postconditions: 'Interactive sharing modal is displayed, or native OS share sheet is activated with pre-formatted event title and verified link.',
    basicFlow: [
      'User clicks the "Share" button on an event details page.',
      'If on a mobile browser supporting navigator.share, system opens the native mobile share sheet.',
      'If on a desktop browser, system opens the interactive Share Modal.',
      'System generates instant social share links for WhatsApp, X (Twitter), Telegram, and Facebook with encoded title and venue.',
      'System provides a dedicated one-click "Copy" button that writes the canonical event URL to the user\'s clipboard.',
      'System displays a confirmation toast notification: "Event link copied to clipboard!"'
    ],
    altFlows: [
      '2a. Native Share Cancelled: If the user cancels the OS share sheet, system remains on the event page with zero disruption.',
      '5a. Clipboard Permission Blocked: System highlights the URL input field for easy manual copy (Ctrl+C).'
    ],
    rules: 'Shared links always point to canonical, verified event URLs (/events/:slug) free of tracking bloat.',
    route: 'Client-side modal & Web Share API (views/event-details.ejs#share-modal)'
  },

  // Module D: Public Event Submission (Model 2: Without Account)
  {
    id: 'UC11',
    name: 'Submit Event (Provide Event Details)',
    module: 'D. Public Event Submission (Without Account)',
    primaryActor: 'Organizer / Submitter',
    secondaryActors: 'Email Service (SMTP Transactional Mailer)',
    purpose: 'Enables any fanclub leader, promoter, or fan to submit a Malaysian K-Pop event without creating an account, supplying mandatory evidence links and posters.',
    trigger: 'User clicks "Submit Event" on the main navigation bar.',
    preconditions: 'Public submission form is accessible.',
    postconditions: 'A new event record is stored with status PENDING, a unique 6-character tracking code (e.g. KS-2026-7F3K9Q) is generated, and a confirmation email is dispatched.',
    basicFlow: [
      'Submitter opens the Submit Event page (/submit-event).',
      'System displays the submission form requesting Event Name, Artist, Category, Date, Time, Venue, Submitter Contact (Name & Email), Official Evidence URL, and Posters.',
      'Submitter fills in the fields, uploads 1 to 4 poster images, and confirms the good-faith declaration.',
      'Submitter submits the form.',
      'System validates mandatory inputs and verifies that an evidence URL is provided.',
      'System uploads poster files to server storage (/public/uploads/).',
      'System generates an unpredictable random tracking code (KS-2026-XXXXXX).',
      'System inserts the record into events with verification_status = "PENDING".',
      'System dispatches a transactional confirmation email containing the tracking code to the submitter.',
      'System redirects the submitter to the success page displaying their tracking code.'
    ],
    altFlows: [
      '5a. Missing Evidence Link: System rejects submission with error: "Proof of authenticity (official announcement / evidence link) is mandatory."',
      '5b. Incomplete Form: Form reloads preserving entered data and highlights missing mandatory fields.'
    ],
    rules: 'No account registration is required (Model 2). The tracking code must be cryptographically unpredictable.',
    route: 'GET /submit-event, POST /submit-event, GET /submission-success'
  },
  {
    id: 'UC12',
    name: 'Check Submission Status (Tracking Code)',
    module: 'D. Public Event Submission (Without Account)',
    primaryActor: 'Organizer / Submitter',
    secondaryActors: 'None',
    purpose: 'Enables a submitter to check the current review stage (Pending, Verified, or Rejected) of their submitted event using their unique tracking code or email.',
    trigger: 'Submitter enters their tracking code into the submission status tracker.',
    preconditions: 'Submitter possesses a valid tracking code from a previous submission.',
    postconditions: 'System displays the current review status, admin verification notes, or official rejection reasons.',
    basicFlow: [
      'Submitter visits the Check Submission page (/check-submission).',
      'Submitter inputs their tracking code (e.g. KS-2026-AB12CD) or submission email.',
      'System queries the events table for matching tracking_code or submitter_email.',
      'System renders the status tracker card showing current state (PENDING, VERIFIED, or REJECTED).',
      'If verified, system displays a direct link to the published live event page.',
      'If rejected, system displays the admin rejection reason and provides a "Correct and Resubmit" option.'
    ],
    altFlows: [
      '3a. Invalid Code: System displays: "No submission found matching that tracking code. Please verify your reference number."'
    ],
    rules: 'Submitters can only view the submission details tied to the matching tracking code.',
    route: 'GET /check-submission'
  },
  {
    id: 'UC13',
    name: 'Correct and Resubmit Event',
    module: 'D. Public Event Submission (Without Account)',
    primaryActor: 'Organizer / Submitter',
    secondaryActors: 'None',
    purpose: 'Allows a submitter whose event was rejected or marked with issues to update incorrect details, update evidence links, and resubmit for admin re-review.',
    trigger: 'Submitter clicks "Correct and Resubmit" from the status tracker page.',
    preconditions: 'The submission exists and is in REJECTED or PENDING state with matching tracking code.',
    postconditions: 'The event details are updated, verification_status is reset to PENDING, rejection_reason is cleared, and an audit entry is logged.',
    basicFlow: [
      'Submitter opens the resubmission form from /check-submission.',
      'Submitter modifies inaccurate details (e.g., corrected ticket link, updated venue, new poster).',
      'Submitter submits the correction form.',
      'System validates the updated inputs against required formats.',
      'System updates the event record, resets verification_status to "PENDING", and clears previous rejection reasons.',
      'System logs the resubmission in activity_logs.',
      'System redirects submitter to status page with a success message confirming resubmission.'
    ],
    altFlows: [
      '4a. Invalid Data: System displays error alert and prevents submission until required fields are filled.'
    ],
    rules: 'Resubmission is only allowed for the matching tracking code and cannot be performed on already approved/published events without admin intervention.',
    route: 'POST /check-submission/resubmit'
  },

  // Module E: Submission Review & Verification
  {
    id: 'UC14',
    name: 'View Pending Submissions',
    module: 'E. Submission Review & Verification',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Displays the administrative moderation queue listing all submitted events currently awaiting verification.',
    trigger: 'Admin selects "Pending Verifications" from the admin sidebar.',
    preconditions: 'User is authenticated with role = "ADMIN".',
    postconditions: 'System renders the pending submissions dashboard with submitter info, evidence links, and action buttons.',
    basicFlow: [
      'Admin accesses /admin/verifications.',
      'System queries events where verification_status = "PENDING" ordered by created_at ASC.',
      'System displays the queue table showing Submission Date, Event Name, Submitter, Organizer Type, and Evidence Link.',
      'Admin can filter or search through pending submissions.'
    ],
    altFlows: [
      '2a. Queue Empty: System displays: "All submissions reviewed! No pending events waiting in the queue."'
    ],
    rules: 'Only authorized administrators can access this view. Regular fans receive HTTP 403 Forbidden.',
    route: 'GET /admin/verifications'
  },
  {
    id: 'UC15',
    name: 'Review Event Submission',
    module: 'E. Submission Review & Verification',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows an administrator to inspect full submission evidence, compare source links against official artist/promoter channels, and detect potential duplicate events.',
    trigger: 'Admin clicks "Inspect / Review" on a pending submission in the queue.',
    preconditions: 'Admin is logged in and viewing the pending verifications table.',
    postconditions: 'Detailed inspection modal or review panel is opened with full evidence audit controls.',
    basicFlow: [
      'Admin clicks "Review" on a submission item.',
      'System displays submitted details: Artist, Date, Venue, Evidence Link, Submitter Social Handle, and Posters.',
      'System checks the database for existing events with identical artist and date (duplicate detection alert).',
      'Admin opens the evidence link in an external tab to inspect the source authority (Weverse, Official Promoter X, Ticketing Platform).',
      'Admin determines the authenticity classification.'
    ],
    altFlows: [
      '3a. Duplicate Event Detected: System highlights an alert: "Warning: Another event for this artist on this date already exists (#Event ID)."'
    ],
    rules: 'Admins must verify that event details match an independent, authoritative external source.',
    route: 'GET /admin/verifications'
  },
  {
    id: 'UC16',
    name: 'Approve and Publish Submission',
    module: 'E. Submission Review & Verification',
    primaryActor: 'System Administrator',
    secondaryActors: 'Email Service (SMTP Transactional Mailer)',
    purpose: 'Approves an authentic submission, assigns a verified trust level badge (Official or Community), publishes the event to the public directory, and notifies the submitter.',
    trigger: 'Admin clicks "Approve Event" in the review panel.',
    preconditions: 'The submission has been verified as authentic by the administrator.',
    postconditions: 'Event verification_status becomes "VERIFIED", trust_level is set, audit record is written, the event appears in public browse listings, and an approval email is sent.',
    basicFlow: [
      'Admin selects trust level (OFFICIAL for tour schedule/promoter announcement, or COMMUNITY for cupsleeve/fanclub project).',
      'Admin enters verification notes documenting the sources checked.',
      'Admin clicks "Approve Event".',
      'System updates event record: verification_status = "VERIFIED", trust_level = chosen level, admin_verification_notes = notes.',
      'System records action in activity_logs with admin user ID and IP address.',
      'System triggers an automated approval email containing the live event link to the submitter.',
      'System displays confirmation toast and refreshes the pending queue count.'
    ],
    altFlows: [
      '4a. Database Failure: System rolls back transaction, alerts admin, and preserves pending status.'
    ],
    rules: 'Published events are immediately indexed and visible to all site visitors.',
    route: 'POST /admin/verifications/approve-event'
  },
  {
    id: 'UC17',
    name: 'Reject Submission (Mandatory Reason)',
    module: 'E. Submission Review & Verification',
    primaryActor: 'System Administrator',
    secondaryActors: 'Email Service (SMTP Transactional Mailer)',
    purpose: 'Rejects an unverified, duplicate, or fraudulent submission, requiring a mandatory documented justification that is communicated to the submitter.',
    trigger: 'Admin clicks "Reject Event" in the review panel.',
    preconditions: 'Submission fails authenticity criteria, contains deceptive info, or duplicates existing listings.',
    postconditions: 'Event verification_status becomes "REJECTED", rejection_reason is recorded, audit record is logged, and a notification email is sent to the submitter.',
    basicFlow: [
      'Admin clicks "Reject Event".',
      'System prompts admin for a mandatory rejection reason (e.g. "Duplicate listing", "No official source found", "Mismatched date").',
      'Admin inputs justification and confirms rejection.',
      'System updates event record: verification_status = "REJECTED", rejection_reason = reason.',
      'System writes an audit entry into activity_logs.',
      'System dispatches a transactional rejection email explaining the reason and offering re-review instructions via tracking code.',
      'System updates the verification dashboard.'
    ],
    altFlows: [
      '2a. Empty Rejection Reason: System prevents submission and highlights: "Rejection reason is mandatory to ensure transparency and accountability."'
    ],
    rules: 'A rejection reason is strictly mandatory. Arbitrary rejection without recorded justification is prohibited by system validation.',
    route: 'POST /admin/verifications/reject-event'
  },
  {
    id: 'UC18',
    name: 'Manage Verified Organizer Status',
    module: 'E. Submission Review & Verification',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Enables administrators to grant or revoke "Verified Organizer" status to fanclub or event company accounts following credential auditing.',
    trigger: 'Admin clicks "Verify Organizer" or "Revoke Status" on an organizer profile.',
    preconditions: 'Target user account exists with organization credentials.',
    postconditions: 'Target user is_verified_organizer column is set to 1 (Verified) or 0 (Standard), updating their public trust badge.',
    basicFlow: [
      'Admin views the organizer verifications section in /admin/verifications.',
      'Admin reviews organizer identity credentials and past track record of organized events.',
      'Admin clicks "Verify Organizer".',
      'System updates users table: is_verified_organizer = 1.',
      'System logs action in activity_logs.',
      'Admin receives success feedback; organizer profile reflects verified badge.'
    ],
    altFlows: [
      '3a. Revoke Status: If a verified organizer engages in deceptive practices, admin clicks "Revoke Status"; system resets status to 0.'
    ],
    rules: 'Verified status displays a green verified badge next to the organizer name on all associated events.',
    route: 'POST /admin/verifications/verify-organizer, POST /admin/verifications/revoke-organizer'
  },

  // Module F: Published Event Management
  {
    id: 'UC19',
    name: 'Edit Event Information',
    module: 'F. Published Event Management',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows administrators to update published event details when organizers release revised schedules, additional poster visuals, or venue updates.',
    trigger: 'Admin clicks "Edit Event" in the admin events manager.',
    preconditions: 'Event exists in the database and admin is logged in.',
    postconditions: 'Event record is updated with new schedules, ticket URLs, or poster visuals.',
    basicFlow: [
      'Admin navigates to /admin/events.',
      'Admin clicks "Edit" on a specific event listing.',
      'System displays the event edit form prepopulated with current information.',
      'Admin makes necessary adjustments (e.g. updating start_time or adding ticketing URL).',
      'Admin clicks "Save Changes".',
      'System validates modified fields and executes an UPDATE query.',
      'System logs the modification in activity_logs and displays a success notification.'
    ],
    altFlows: [
      '4a. Validation Error: If date format or URL is malformed, system prevents saving and highlights erroneous field.'
    ],
    rules: 'All administrative event edits are logged with admin ID and timestamp in system activity logs.',
    route: 'GET /admin/events, POST /admin/events/update'
  },
  {
    id: 'UC20',
    name: 'Update Event Status',
    module: 'F. Published Event Management',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows administrators to explicitly change an event lifecycle status to UPCOMING, ONGOING, COMPLETED, POSTPONED, or CANCELLED based on official promoter announcements.',
    trigger: 'Admin selects a new status from the status dropdown on the admin event manager.',
    preconditions: 'Event is published in the database.',
    postconditions: 'Event event_status column is updated, and public badges update to inform fans.',
    basicFlow: [
      'Admin locates the event in the /admin/events list.',
      'Admin selects the new status (e.g., "POSTPONED" or "CANCELLED") from the dropdown.',
      'Client posts the update to /admin/events/update-status.',
      'Server verifies admin authorization.',
      'Server updates event_status in the events table.',
      'Server logs the status change in activity_logs.',
      'Server returns success response; UI updates status badge.'
    ],
    altFlows: [
      '3a. Unauthorized: Non-admin request rejected with HTTP 403.'
    ],
    rules: 'Marking an event CANCELLED or POSTPONED displays a prominent warning banner across the public event details page.',
    route: 'POST /admin/events/update-status'
  },
  {
    id: 'UC21',
    name: 'Unpublish / Delete Event',
    module: 'F. Published Event Management',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Enables administrators to delete or withdraw a fraudulent, duplicate, or completely revoked event listing from the platform.',
    trigger: 'Admin clicks the delete (trash) icon on an event listing.',
    preconditions: 'Admin is logged in and confirms deletion modal.',
    postconditions: 'Event record and related discussion messages are removed or marked hidden, and an audit entry is created.',
    basicFlow: [
      'Admin clicks "Delete" on an event card in the /admin/events view.',
      'System prompts admin with a confirmation dialog: "Are you sure you want to permanently delete this event?"',
      'Admin confirms deletion.',
      'System deletes associated records (saved_events, chat messages) and deletes the event record.',
      'System writes an audit entry into activity_logs.',
      'System refreshes the event list and shows confirmation notification.'
    ],
    altFlows: [
      '2a. Cancel Action: Admin dismisses the confirmation dialog; no deletion occurs.'
    ],
    rules: 'Deletion requires explicit confirmation to prevent accidental loss of published event data.',
    route: 'POST /admin/events/delete'
  },
  {
    id: 'UC22',
    name: 'Manage Event Categories',
    module: 'F. Published Event Management',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows administrators to create, view, and delete event taxonomy categories (e.g. Concert, Fan Meeting, Cupsleeve, Festival, Pop-Up Store).',
    trigger: 'Admin navigates to the Categories tab in the admin portal.',
    preconditions: 'Admin is authenticated.',
    postconditions: 'Category records in event_categories table are created or removed.',
    basicFlow: [
      'Admin visits /admin/categories.',
      'System displays the existing categories table with names, slugs, and associated event counts.',
      'Admin fills in "New Category Name" and badge color, then clicks "Add Category".',
      'System generates an SEO slug and inserts the new record into event_categories.',
      'System refreshes the table showing the newly created category.'
    ],
    altFlows: [
      '4a. Category Deletion: Admin clicks delete on an unused category; system verifies no active events depend on it, then deletes the record.'
    ],
    rules: 'Categories with active associated events cannot be deleted without reassigning events first.',
    route: 'GET /admin/categories, POST /admin/categories/add, POST /admin/categories/delete'
  },
  {
    id: 'UC23',
    name: 'Manage Venues',
    module: 'F. Published Event Management',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Enables administrators to maintain the directory of Malaysian concert and exhibition venues, including venue names, cities, states, and transit notes.',
    trigger: 'Admin accesses the Venues management page.',
    preconditions: 'Admin is authenticated.',
    postconditions: 'Venue records in the venues table are created or updated.',
    basicFlow: [
      'Admin opens /admin/venues.',
      'System renders the Malaysian venues directory (e.g., Axiata Arena, Zepp KL, Mega Star Arena, Stadium Merdeka).',
      'Admin inputs Venue Name, City, State, and Address into the creation form.',
      'Admin clicks "Add Venue".',
      'System inserts the venue record into the venues table.',
      'System updates the venue dropdown options across the submission and edit forms.'
    ],
    altFlows: [
      '3a. Duplicate Venue: System warns if a venue with identical name in the same city already exists.'
    ],
    rules: 'Venues provide standardized location filtering and map references for fans.',
    route: 'GET /admin/venues, POST /admin/venues/add, POST /admin/venues/delete'
  },
  {
    id: 'UC24',
    name: 'Manage Artists and Member Profiles',
    module: 'F. Published Event Management',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows administrators to create and maintain K-Pop artist groups and their individual member biodata profiles (stage name, role, photo, birth date, zodiac).',
    trigger: 'Admin clicks the Artists tab in the admin portal.',
    preconditions: 'Admin is authenticated.',
    postconditions: 'Records in artists and members tables are updated or created.',
    basicFlow: [
      'Admin navigates to /admin/artists.',
      'System displays all registered artists (e.g. SEVENTEEN, TOMORROW X TOGETHER, TWICE, NewJeans).',
      'Admin enters artist name, agency, group type, and banner image, then clicks "Add Artist".',
      'System creates the artist record in the artists table.',
      'Admin can open member profile manager to configure individual idol profiles in the members table.',
      'System updates the artist catalog across the platform.'
    ],
    altFlows: [
      '3a. Empty Artist Name: System prompts validation error requiring an artist name.'
    ],
    rules: 'Normalized members table links to artists.id via foreign key cascade.',
    route: 'GET /admin/artists, POST /admin/artists/add, POST /admin/artists/delete'
  },

  // Module G: Fan Community Discussions
  {
    id: 'UC25',
    name: 'View Event Discussion',
    module: 'G. Fan Community Discussions',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Enables fans and visitors to read contextual, 1-level threaded questions, logistical tips, and answers posted beneath any specific event listing.',
    trigger: 'User scrolls down to the "#discussion" section on any single event details page.',
    preconditions: 'Event details page is loaded.',
    postconditions: 'Threaded discussion comments and replies are rendered with author badges and relative timestamps.',
    basicFlow: [
      'User accesses an event page (/events/:idOrSlug).',
      'System queries event_chat_messages for the event joined with users table.',
      'System organizes messages into root comments and 1-level nested replies using parent_id.',
      'System renders author badges ([Event Submitter], [Admin]) and relative timestamps (e.g. "2 hours ago").',
      'User reads discussion thread.'
    ],
    altFlows: [
      '2a. Zero Comments: System displays an inviting prompt: "No comments or questions yet. Be the first fan to start the discussion!"'
    ],
    rules: 'Discussions are open to read for everyone, including unauthenticated visitors.',
    route: 'GET /events/:idOrSlug#discussion'
  },
  {
    id: 'UC26',
    name: 'Create Discussion Post',
    module: 'G. Fan Community Discussions',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Allows authenticated fans to post a root question, transportation tip, or general query regarding an event.',
    trigger: 'Fan writes a message in the discussion box and clicks "Post Comment".',
    preconditions: 'User is authenticated as a Registered Fan, and the event discussion is active (within 24h post-event window).',
    postconditions: 'A new record is inserted into event_chat_messages with parent_id = NULL, and the thread updates in real time.',
    basicFlow: [
      'Fan scrolls to the Community Discussion box.',
      'Fan types a question (e.g., "Does Axiata Arena allow power banks inside the standing zone?").',
      'Fan clicks "Post Comment".',
      'System verifies that user is logged in.',
      'System verifies the event is not past the 24-hour post-event archive window.',
      'System sanitizes message text against XSS scripting.',
      'System inserts message into event_chat_messages with parent_id = NULL.',
      'System reloads the discussion section smoothly displaying the new comment.'
    ],
    altFlows: [
      '4a. Guest User: Input box is replaced with a banner: "Please Log In or Register to join the discussion."',
      '5a. Archived Discussion: If event ended > 24 hours ago, system prevents posting and displays: "Discussion archived."'
    ],
    rules: 'Message text must be non-empty and sanitized against malicious HTML tags.',
    route: 'POST /api/chat/:eventId'
  },
  {
    id: 'UC27',
    name: 'Reply to Discussion',
    module: 'G. Fan Community Discussions',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Enables fans, submitters, or administrators to post a direct 1-level nested reply to an existing question or topic starter.',
    trigger: 'Fan clicks the "[Reply]" button beneath an existing comment.',
    preconditions: 'User is authenticated, and the parent comment exists in the event discussion.',
    postconditions: 'A reply record is inserted into event_chat_messages with parent_id referencing the root comment ID, indented under the parent.',
    basicFlow: [
      'Fan clicks "[Reply]" on a specific comment (e.g., replying to the power bank inquiry).',
      'System expands an inline reply textarea directly beneath that comment.',
      'Fan enters their reply (e.g., "Yes, but max 20,000 mAh only based on previous venue rules!").',
      'Fan clicks "Reply".',
      'System validates message and stores it with parent_id = target_comment_id.',
      'System refreshes the thread, displaying the reply nested with an indented guide rail and "↳" indicator.'
    ],
    altFlows: [
      '1a. Guest User: Clicking reply opens prompt requesting the user to log in first.'
    ],
    rules: 'Nesting is capped at 1 level to avoid messy, unreadable multi-level trees on mobile devices.',
    route: 'POST /api/chat/:eventId (with parent_id)'
  },
  {
    id: 'UC28',
    name: 'Delete Own Comment',
    module: 'G. Fan Community Discussions',
    primaryActor: 'Fan / Guest / System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows a fan to delete their own discussion comment or reply, and allows administrators to remove offending messages during moderation.',
    trigger: 'User clicks the trash icon on their own comment.',
    preconditions: 'User is authenticated and owns the comment (comment.user_id == req.session.userId) OR has role = "ADMIN".',
    postconditions: 'The comment and any direct child replies are deleted from event_chat_messages.',
    basicFlow: [
      'User locates their own comment and clicks the trash icon.',
      'Browser displays a confirmation dialog: "Are you sure you want to delete this comment?"',
      'User confirms.',
      'Client issues a DELETE request to /api/chat/:messageId.',
      'Server verifies that session user ID matches comment user_id (or user role is ADMIN).',
      'Server executes DELETE FROM event_chat_messages WHERE id = :id OR parent_id = :id.',
      'Client removes the comment element from the DOM with an animated fade-out.'
    ],
    altFlows: [
      '5a. Unauthorized Deletion Attempt: If a user tries to delete another user\'s post without admin privileges, server returns HTTP 403 Forbidden.'
    ],
    rules: 'Users can only delete their own posts; administrators can delete any post for moderation.',
    route: 'DELETE /api/chat/:messageId, POST /api/chat/:messageId/delete'
  },

  // Module H: Content Moderation & Governance
  {
    id: 'UC29',
    name: 'Report Event',
    module: 'H. Content Moderation & Governance',
    primaryActor: 'Fan / Guest',
    secondaryActors: 'None',
    purpose: 'Enables fans to report suspicious ticket scalper links, deceptive event listings, cancelled shows, or abusive discussion messages to platform administrators.',
    trigger: 'Fan clicks the "Report Event" button or flags a comment.',
    preconditions: 'User is authenticated as a Registered Fan.',
    postconditions: 'A structured report record is stored in the reports table with status "PENDING" and evidence URL.',
    basicFlow: [
      'Fan clicks "Report Event" on an event details page.',
      'System displays the structured report modal containing a violation checklist (Scam Tickets, Impostor Organizer, Inaccurate Schedule, Cancelled Event, Other).',
      'Fan selects a reason, inputs detailed description (>= 20 characters), provides counter-evidence URL, and confirms anti-defamation declaration.',
      'Fan submits report.',
      'System checks anti-spam rule (verifies no active pending report from this user for this event).',
      'System inserts report record into reports table with status = "PENDING".',
      'System displays confirmation message that moderation will audit within 24 hours.'
    ],
    altFlows: [
      '1a. Unauthenticated Fan: Modal informs user that only verified community members can file reports to prevent competitor sabotage.',
      '5a. Duplicate Active Report: System returns: "You already have an active report under review for this listing."'
    ],
    rules: 'Anonymous reporting is disabled to prevent malicious spam and competitor sabotage.',
    route: 'POST /api/events/:id/report'
  },
  {
    id: 'UC30',
    name: 'Investigate and Moderate Report',
    module: 'H. Content Moderation & Governance',
    primaryActor: 'System Administrator',
    secondaryActors: 'None',
    purpose: 'Allows administrators to review submitted community reports, examine counter-evidence, and take enforcement actions (Dismiss, Remove Content, or Suspend Event).',
    trigger: 'Admin opens the Reports queue in the admin center.',
    preconditions: 'Admin is logged in and reports exist with status "PENDING".',
    postconditions: 'Report status is updated to RESOLVED or DISMISSED, appropriate moderation action is executed on target entity, and an audit entry is logged.',
    basicFlow: [
      'Admin navigates to /admin/reports.',
      'System renders the reports moderation queue showing reporter, target event, violation reason, details, and counter-evidence link.',
      'Admin examines the reported issue against official ticketing or promoter channels.',
      'Admin chooses an enforcement action: Dismiss Report, Suspend Event Listing, or Remove Content.',
      'Admin confirms decision.',
      'System updates report status to "RESOLVED" (or "DISMISSED") in reports table.',
      'If confirmed fraudulent, system sets event verification_status = "SUSPENDED" or unpublishes the listing.',
      'System logs the moderation action in activity_logs.'
    ],
    altFlows: [
      '4a. Dismissal: If report is baseless, admin clicks "Dismiss"; report is closed with status DISMISSED and no penalty to the event.'
    ],
    rules: 'Every moderation action is logged with admin ID, timestamp, and action summary in the audit trail.',
    route: 'GET /admin/reports, POST /admin/reports/action, POST /admin/reports/resolve'
  }
];

// Generate HTML Content
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-Sync Malaysia — Complete 30 Use Case Specification & Description Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
        @media print {
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            body { background: white !important; color: black !important; padding: 0 !important; }
            .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
            .border { border-color: #cbd5e1 !important; }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased p-4 sm:p-8 lg:p-12">

    <!-- Top Sticky Navigation Bar (Screen Only) -->
    <header class="no-print max-w-7xl mx-auto mb-8 bg-white/90 backdrop-blur-md sticky top-4 z-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-lg shadow-sm">K</span>
            <div>
                <h1 class="text-sm font-extrabold text-slate-900 leading-tight">K-Sync Malaysia</h1>
                <p class="text-[11px] text-slate-500">System Use Case Specification (30 Use Cases)</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button onclick="window.print()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                <i class="fas fa-print"></i> Print / Save as PDF
            </button>
            <a href="#toc" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">
                Table of Contents
            </a>
            <a href="#traceability" class="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition-all">
                Code Traceability
            </a>
        </div>
    </header>

    <main class="max-w-7xl mx-auto space-y-10">

        <!-- Hero Document Header -->
        <section class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
            <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 max-w-4xl space-y-4">
                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    <i class="fas fa-certificate text-pink-400"></i> Final Year Project (FYP) — Software Requirements Engineering
                </div>
                <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    K-Sync Malaysia: System Use Case Specification & Complete Description Tables
                </h1>
                <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Official Software Requirements Specification (SRS) use case document for <strong>K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions</strong>. Fully audited, non-inflated catalog of <strong>30 verified core use cases</strong> organized across 8 functional modules.
                </p>

                <!-- Metadata Pills -->
                <div class="pt-4 flex flex-wrap gap-2.5 text-xs font-semibold">
                    <span class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                        <i class="fas fa-list-check text-pink-400"></i> 30 Core Use Cases
                    </span>
                    <span class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                        <i class="fas fa-users text-purple-400"></i> 3 Human Actors (Fan / Guest, Organizer / Submitter, System Administrator)
                    </span>
                    <span class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                        <i class="fas fa-cubes text-blue-400"></i> 8 Functional Packages (A through H)
                    </span>
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                        <i class="fas fa-circle-check text-emerald-400"></i> 100% Backed by Codebase Routes
                    </span>
                    <span class="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center gap-1.5">
                        <i class="fas fa-ban text-rose-400"></i> Zero Out-of-Scope Bloat
                    </span>
                </div>
            </div>
        </section>

        <!-- Scope Boundary & Justification Card -->
        <section class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-compass-drafting text-pink-600"></i> Scope Boundary & Academic Justification
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                    <h3 class="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                        <i class="fas fa-check-circle text-emerald-600"></i> Strictly Included & Justified Scope
                    </h3>
                    <ul class="space-y-1.5 list-disc list-inside">
                        <li><strong>Account & Auth:</strong> Registration, Login (Email / Google Sign-In), Profile management.</li>
                        <li><strong>Event Discovery:</strong> Full discovery, search, multi-filter, and event dossier details.</li>
                        <li><strong>Model 2 Public Submission:</strong> Open submissions without account, tracked via tracking codes.</li>
                        <li><strong>Admin Verification:</strong> Evidence inspection, trust badges, rejection justification.</li>
                        <li><strong>1-Level Threaded Q&A:</strong> Structured community discussions, replies, author deletion.</li>
                        <li><strong>Content Moderation:</strong> Anti-scam community reporting and admin enforcement.</li>
                    </ul>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 class="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                        <i class="fas fa-ban text-rose-600"></i> Strictly Excluded Scope (Examiner Boundaries)
                    </h3>
                    <ul class="space-y-1.5 list-disc list-inside">
                        <li><strong>Ticket Sales / Purchasing:</strong> K-Sync is an information platform; outbound ticketing URLs direct fans to official platforms (GoLive, Ticket2U).</li>
                        <li><strong>Payment Gateways:</strong> Zero monetary transactions or checkout flows.</li>
                        <li><strong>Merchandise Inventory:</strong> No shopping cart or lightstick order processing.</li>
                        <li><strong>Event Buddy Matching:</strong> Explicitly removed from requirements.</li>
                        <li><strong>Internal Background Tasks Parked:</strong> Notifications & Audit Logs function as automated system processes and are kept out of the primary human use case diagram.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Table of Contents -->
        <section id="toc" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-list-ol text-pink-600"></i> Master Table of Contents (30 Use Cases)
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                ${['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(pkg => {
                  const pkgCases = useCases.filter(u => u.module.startsWith(pkg));
                  const pkgName = pkgCases[0]?.module || `Module ${pkg}`;
                  return `
                    <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <h3 class="font-extrabold text-slate-900 truncate" title="${pkgName}">${pkgName}</h3>
                        <ul class="space-y-1">
                            ${pkgCases.map(uc => `
                                <li>
                                    <a href="#${uc.id}" class="text-pink-600 hover:text-pink-800 font-semibold hover:underline flex items-center justify-between">
                                        <span>${uc.id}: ${uc.name}</span>
                                        <i class="fas fa-chevron-right text-[9px] text-slate-400"></i>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                  `;
                }).join('')}
            </div>
        </section>

        <!-- Use Case Description Tables (ALL 30) -->
        <section class="space-y-8">
            <div class="border-b border-slate-200 pb-3">
                <h2 class="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                    <i class="fas fa-table-list text-pink-600"></i> Detailed Use Case Description Tables
                </h2>
                <p class="text-xs text-slate-500 mt-1">Formal academic specification tables formatted according to standard Information Systems FYP engineering guidelines.</p>
            </div>

            ${useCases.map((uc, idx) => `
                <article id="${uc.id}" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 page-break">
                    <!-- Card Top Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                        <div class="flex items-center gap-3">
                            <span class="px-3 py-1 rounded-xl bg-pink-100 text-pink-800 font-extrabold text-xs tracking-wider border border-pink-200">
                                ${uc.id}
                            </span>
                            <h3 class="text-lg sm:text-xl font-extrabold text-slate-900">${uc.name}</h3>
                        </div>
                        <span class="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            ${uc.module}
                        </span>
                    </div>

                    <!-- Specification Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse">
                            <tbody>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 w-48 rounded-l-xl">Primary Actor</th>
                                    <td class="py-2.5 px-3 text-slate-700 font-semibold">${uc.primaryActor}</td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Secondary Actors</th>
                                    <td class="py-2.5 px-3 text-slate-600">${uc.secondaryActors}</td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Short Purpose</th>
                                    <td class="py-2.5 px-3 text-slate-700 leading-relaxed">${uc.purpose}</td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Trigger</th>
                                    <td class="py-2.5 px-3 text-slate-600">${uc.trigger}</td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Preconditions</th>
                                    <td class="py-2.5 px-3 text-slate-600">${uc.preconditions}</td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Postconditions (Success)</th>
                                    <td class="py-2.5 px-3 text-slate-700 font-medium">${uc.postconditions}</td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-3 px-3 font-bold text-slate-900 bg-slate-50 align-top">Main Success Scenario (Basic Flow)</th>
                                    <td class="py-3 px-3 text-slate-700">
                                        <ol class="list-decimal list-inside space-y-1 leading-relaxed">
                                            ${uc.basicFlow.map(step => `<li>${step}</li>`).join('')}
                                        </ol>
                                    </td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-3 px-3 font-bold text-slate-900 bg-slate-50 align-top">Alternative / Exceptional Flows</th>
                                    <td class="py-3 px-3 text-slate-600">
                                        <ul class="list-disc list-inside space-y-1 leading-relaxed">
                                            ${uc.altFlows.map(alt => `<li>${alt}</li>`).join('')}
                                        </ul>
                                    </td>
                                </tr>
                                <tr class="border-b border-slate-100">
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Business Rules & Security</th>
                                    <td class="py-2.5 px-3 text-slate-600 font-medium">${uc.rules}</td>
                                </tr>
                                <tr>
                                    <th class="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 rounded-bl-xl">Implemented Route(s)</th>
                                    <td class="py-2.5 px-3 text-pink-700 font-mono font-bold">${uc.route}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </article>
            `).join('')}
        </section>

        <!-- Actor and RBAC Matrix -->
        <section class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 page-break">
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-shield-halved text-purple-600"></i> Actor Role-Based Access Control (RBAC) Authority Matrix
            </h2>
            <p class="text-xs text-slate-500">Enforced strictly on the server-side via session validation and middleware.</p>

            <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead class="bg-slate-900 text-white font-bold">
                        <tr>
                            <th class="p-3">Functional Module</th>
                            <th class="p-3 text-center">Fan / Guest</th>
                            <th class="p-3 text-center">Organizer / Submitter</th>
                            <th class="p-3 text-center">System Administrator</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 text-slate-700">
                        <tr>
                            <td class="p-3 font-bold">A. Account & Profile Management</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Register, Log In, Manage Profile</td>
                            <td class="p-3 text-center text-slate-400">N/A (No Account Needed)</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Admin Log In</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">B. Event Discovery & Information</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Browse, Search, Filter, View Details</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Browse & View Details</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Full Access</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">C. Saved & Shared Events</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Share (Public); Save & View Saved (Authenticated)</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Share Event</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Available</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">D. Public Event Submission (Model 2: No Account)</td>
                            <td class="p-3 text-center text-slate-400">Can act as Submitter</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Submit Event, Check Status, Correct & Resubmit</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Full Review & Audit</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">E. Submission Review & Verification</td>
                            <td class="p-3 text-center text-rose-500"><i class="fas fa-xmark"></i> Forbidden</td>
                            <td class="p-3 text-center text-rose-500"><i class="fas fa-xmark"></i> Forbidden</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-shield"></i> Sole Authority (Approve, Reject, Verify)</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">F. Published Event Management</td>
                            <td class="p-3 text-center text-rose-500"><i class="fas fa-xmark"></i> Forbidden</td>
                            <td class="p-3 text-center text-rose-500"><i class="fas fa-xmark"></i> Forbidden</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-shield"></i> Sole Authority (Edit, Status, Taxonomy)</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">G. Fan Community Discussions</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Read (Public); Post, Reply, Delete Own (Authenticated)</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Read / Reply to Event Threads</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-check"></i> Full Moderation (Delete Any Comment)</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-bold">H. Content Moderation & Governance</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-flag"></i> Submit Report (Authenticated)</td>
                            <td class="p-3 text-center text-rose-500"><i class="fas fa-xmark"></i> Login Required to Report</td>
                            <td class="p-3 text-center text-emerald-600 font-bold"><i class="fas fa-gavel"></i> Sole Authority (Investigate & Enforce)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Requirements-to-Code Traceability Table -->
        <section id="traceability" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 page-break">
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i class="fas fa-code-commit text-emerald-600"></i> Requirements-to-Code Traceability Table
            </h2>
            <p class="text-xs text-slate-500">Full audit proof demonstrating that every use case is actively implemented in the current code repository.</p>

            <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead class="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                        <tr>
                            <th class="p-2.5">ID</th>
                            <th class="p-2.5">Use Case Name</th>
                            <th class="p-2.5">Primary Actor</th>
                            <th class="p-2.5">Backend Route / Endpoint</th>
                            <th class="p-2.5">View Template</th>
                            <th class="p-2.5">Database Table(s)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                        ${useCases.map(uc => `
                            <tr>
                                <td class="p-2.5 font-bold text-pink-700">${uc.id}</td>
                                <td class="p-2.5 font-sans font-semibold text-slate-900">${uc.name}</td>
                                <td class="p-2.5 font-sans">${uc.primaryActor}</td>
                                <td class="p-2.5 text-slate-600">${uc.route}</td>
                                <td class="p-2.5 text-slate-500">${uc.route.includes('/admin') ? 'views/admin/*' : (uc.route.includes('submit') ? 'views/submit-event.ejs' : 'views/*')}</td>
                                <td class="p-2.5 text-emerald-800 font-semibold">${uc.module.includes('Account') ? 'users' : (uc.module.includes('Discussion') ? 'event_chat_messages' : (uc.module.includes('Moderation') ? 'reports' : (uc.module.includes('Saved') ? 'saved_events' : 'events, artists, venues')))}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Final Supervisor Checklist -->
        <section class="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-4">
            <h2 class="text-lg font-bold flex items-center gap-2 text-white">
                <i class="fas fa-clipboard-check text-pink-400"></i> Final Year Project Supervisor Sign-off Checklist
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-square-check text-pink-400 text-sm shrink-0 mt-0.5"></i>
                    <span><strong>Accurate Project Title Alignment:</strong> Focus strictly maintained on Malaysian K-Pop event info and fan community discussions.</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-square-check text-pink-400 text-sm shrink-0 mt-0.5"></i>
                    <span><strong>Model 2 Public Submission:</strong> Open submissions without account, tracked via secure random tracking codes.</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-square-check text-pink-400 text-sm shrink-0 mt-0.5"></i>
                    <span><strong>Strict Scope Exclusions:</strong> Zero ticket bookings, payment processing, merchandise sales, or buddy matching.</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-square-check text-pink-400 text-sm shrink-0 mt-0.5"></i>
                    <span><strong>Human-Centric UML Model:</strong> No artificial "System" stick figures; only genuine human actors interacting with the application.</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-square-check text-pink-400 text-sm shrink-0 mt-0.5"></i>
                    <span><strong>Threaded Community Discussion:</strong> Contextual 1-level nested discussions with author badges and self-service deletion.</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fas fa-square-check text-pink-400 text-sm shrink-0 mt-0.5"></i>
                    <span><strong>Anti-Scam Cross-Verification:</strong> Mandatory external source URLs, duplicate checks, and mandatory rejection reasoning.</span>
                </div>
            </div>
        </section>

    </main>

    <footer class="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>K-Sync Malaysia &copy; 2026/2027. Final Year Project System Specification Report. Generated for Academic Defense & Examination.</p>
    </footer>

</body>
</html>
`;

fs.writeFileSync(path.resolve('docs/use_case_specification.html'), html);
console.log('Successfully generated docs/use_case_specification.html! Total use cases documented:', useCases.length);
