// docs/generate_srs_doc.js - Generate Complete Academic SRS Document (.docx)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const COLOR_PRIMARY = "0F172A"; // Slate 900
const COLOR_ACCENT = "DB2777";  // Pink 600
const COLOR_TEXT = "334155";    // Slate 700
const COLOR_BG_LIGHT = "F8FAFC"; // Slate 50
const COLOR_BORDER = "CBD5E1";  // Slate 300

function createTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 }
  });
}

function createH1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 180 }
  });
}

function createH2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 }
  });
}

function createP(text, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 22
      })
    ],
    spacing: { after: 100 }
  });
}

function createBullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [
      new TextRun({
        text: text,
        size: 22
      })
    ],
    spacing: { after: 60 }
  });
}

/**
 * Creates an academic SRS Use Case Specification Table following the exact university template:
 * - Actor
 * - Description
 * - Preconditions
 * - Postconditions
 * - Priority
 * - Frequency of Use
 * - Normal Course of Events (Actor | System)
 * - Alternative Courses
 * - Exceptions
 * - Includes
 * - Notes and Issues
 */
function createUseCaseTable(data) {
  // Normal course steps rows
  const normalCourseRows = data.normalCourse.map((step, idx) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `${idx + 1}. `, bold: true, size: 20 }),
                new TextRun({ text: step.actor, size: 20 })
              ]
            })
          ],
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
          }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `${idx + 1}.1 `, bold: true, size: 20 }),
                new TextRun({ text: step.system, size: 20 })
              ]
            })
          ],
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
          }
        })
      ]
    });
  });

  const normalCourseSubTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Actor Action", bold: true, size: 20 })] })],
            shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "System Response", bold: true, size: 20 })] })],
            shading: { fill: "E2E8F0", type: ShadingType.CLEAR },
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            width: { size: 50, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      ...normalCourseRows
    ]
  });

  function row(label, contentOrComponent) {
    const isComponent = Array.isArray(contentOrComponent) || typeof contentOrComponent === 'object' && !(contentOrComponent instanceof String);
    let cellContent = [];

    if (typeof contentOrComponent === 'string') {
      cellContent = [new Paragraph({ children: [new TextRun({ text: contentOrComponent, size: 20 })] })];
    } else if (Array.isArray(contentOrComponent)) {
      cellContent = contentOrComponent;
    } else {
      cellContent = [contentOrComponent];
    }

    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: "0F172A", size: 20 })] })],
          shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
          width: { size: 25, type: WidthType.PERCENTAGE },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
          }
        }),
        new TableCell({
          children: cellContent,
          width: { size: 75, type: WidthType.PERCENTAGE },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
            right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
          }
        })
      ]
    });
  }

  return [
    new Paragraph({
      children: [
        new TextRun({ text: `${data.id}: ${data.name}`, bold: true, size: 24, color: COLOR_PRIMARY })
      ],
      spacing: { before: 240, after: 100 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        row("Actor(s):", data.actors),
        row("Description:", data.description),
        row("Preconditions:", data.preconditions),
        row("Postconditions:", data.postconditions),
        row("Priority:", data.priority || "High"),
        row("Frequency of Use:", data.frequency || "Regular"),
        row("Normal Course of Events:", normalCourseSubTable),
        row("Alternative Courses:", data.alternatives || "Not Applicable"),
        row("Exceptions:", data.exceptions || "E1: Database connection failure."),
        row("Includes:", data.includes || "Not Applicable"),
        row("Notes and Issues:", data.notes || "Not Applicable")
      ]
    }),
    new Paragraph({ spacing: { after: 160 } })
  ];
}

// Full Use Cases Data List (All 41 Standard Use Cases + 6 Feature Use Cases = 47 Total)
const allUseCases = [
  // MODULE 1: AUTH & PROFILE
  {
    id: "UC01",
    name: "Register New Fan Account",
    actors: "Guest (Visitor)",
    description: "An unregistered visitor creates a new fan account on the platform by providing personal credentials (full name, username, email, and password) to participate in community discussions, live chats, and event bookmarking.",
    preconditions: "1. The visitor has accessed the web platform.\n2. The visitor is not currently logged into any account.\n3. The visitor has a valid email address.",
    postconditions: "The system registers a new user record in the 'users' table with role 'Fan' (role_id = 3) and establishes an authenticated user session.",
    priority: "High",
    frequency: "Once per new fan user",
    normalCourse: [
      { actor: "User clicks the 'Register' link in the navigation bar.", system: "System displays the account registration form with name, username, email, and password fields." },
      { actor: "User enters valid personal details and clicks the 'Register' button.", system: "System validates field formats, hashes password using Bcrypt, inserts record into database, and redirects user to dashboard with success message." }
    ],
    alternatives: "2a. User registers with Google OAuth:\n  2a.1 System authenticates Google credential and links Google profile picture and email.",
    exceptions: "E1: Email or username already registered in the system.\nE2: Password is shorter than 6 characters.\nE3: Network connection or database failure.",
    includes: "Not Applicable",
    notes: "Emails must adhere to RFC 5322 format. Username must be unique across all registered users."
  },
  {
    id: "UC02",
    name: "Log In to Account",
    actors: "Registered Fan, System Administrator",
    description: "A registered fan or administrator authenticates their identity by entering their registered email address and password to gain authorized access to member or administrator privileges.",
    preconditions: "1. User possesses an active registered account.\n2. User is not currently authenticated in the current session.",
    postconditions: "The system creates an active session cookie, stores user ID and role, and exposes role-specific navigation menus.",
    priority: "High",
    frequency: "Regular, upon each visit session",
    normalCourse: [
      { actor: "User navigates to the login page ('/login').", system: "System displays login interface with email and password input fields." },
      { actor: "User enters registered email and password, then clicks 'Log In'.", system: "System verifies credentials against database Bcrypt hash, initializes session, and redirects user to their intended destination or home page." }
    ],
    alternatives: "2a. System Administrator logs in:\n  2a.1 System detects role 'Admin' and redirects directly to '/admin' dashboard.",
    exceptions: "E1: Email not found in database.\nE2: Password mismatch.\nE3: Account is flagged as SUSPENDED by administrator.",
    includes: "Not Applicable",
    notes: "Session is configured with 7-day persistence and HTTP-only cookie security."
  },
  {
    id: "UC03",
    name: "Log Out of Account",
    actors: "Registered Fan, System Administrator",
    description: "An authenticated user terminates their active login session to secure their account from unauthorized access on shared devices.",
    preconditions: "1. User is currently logged into the system.",
    postconditions: "The active session is destroyed, cookies are cleared, and user status returns to unauthenticated Guest.",
    priority: "Medium",
    frequency: "Regular, upon session termination",
    normalCourse: [
      { actor: "User clicks 'Log Out' from the user profile dropdown menu.", system: "System destroys server-side session, clears session cookies, and redirects user to the home page with a logout confirmation message." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Session already expired or previously invalidated.",
    includes: "Not Applicable",
    notes: "Clears all cached session flash tokens and active user globals."
  },
  {
    id: "UC04",
    name: "View Profile Details",
    actors: "Registered Fan",
    description: "A logged-in fan views their personal profile information, including registered name, username handle, email, bio, location, and account creation date.",
    preconditions: "1. Fan is logged in.",
    postconditions: "The system presents the user profile dashboard.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Fan clicks profile avatar in the navigation bar.", system: "System retrieves user record from 'users' table based on active session user ID." },
      { actor: "Fan reviews personal account details.", system: "System renders profile view with editable fields and password update section." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: User session expired -> System redirects to '/login'.",
    includes: "Not Applicable",
    notes: "Read-only display of core fields with clear action buttons to edit."
  },
  {
    id: "UC05",
    name: "Update Profile Information",
    actors: "Registered Fan",
    description: "A registered fan modifies their public profile details, including their display name, bio description, Malaysian city/state location, and social handle.",
    preconditions: "1. Fan is authenticated.\n2. Fan is on the profile page.",
    postconditions: "The system updates the user record in the database and refreshes session cache.",
    priority: "Medium",
    frequency: "Low, as needed",
    normalCourse: [
      { actor: "Fan edits full name, bio, location, or social handle fields and clicks 'Save Changes'.", system: "System validates input lengths, updates corresponding columns in 'users' table, updates active session user object, and renders success flash notification." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Full name field left empty.\nE2: Bio text exceeds 500 characters.",
    includes: "Not Applicable",
    notes: "Email address remains immutable to prevent account takeover."
  },
  {
    id: "UC06",
    name: "Change Account Password",
    actors: "Registered Fan, System Administrator",
    description: "User changes their account password by providing their current password and entering a new password with confirmation.",
    preconditions: "1. User is authenticated.",
    postconditions: "The system hashes the new password and updates 'password_hash' in the 'users' table.",
    priority: "High",
    frequency: "Infrequent (Security)",
    normalCourse: [
      { actor: "User navigates to the 'Change Password' card on profile page.", system: "System renders current password, new password, and confirm password fields." },
      { actor: "User enters current password and confirmed new password, then clicks 'Update Password'.", system: "System validates current password with Bcrypt, verifies new password match and length, updates password_hash in database, and displays confirmation." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Current password is incorrect.\nE2: New password and confirm password do not match.\nE3: New password is shorter than 6 characters.",
    includes: "Not Applicable",
    notes: "Old password hash is immediately overwritten; active session is preserved."
  },

  // MODULE 2: EVENT DISCOVERY
  {
    id: "UC07",
    name: "Browse Featured Upcoming Events",
    actors: "Guest, Registered Fan",
    description: "Users explore verified upcoming Malaysian K-pop concerts, fan meetings, and cupsleeve events displayed on the platform landing page.",
    preconditions: "1. System is accessible online.",
    postconditions: "System renders top verified events ordered by event date.",
    priority: "High",
    frequency: "Very High",
    normalCourse: [
      { actor: "User visits root URL ('/').", system: "System queries 'events' table for verified upcoming events (LIMIT 6) and renders event cards with posters, dates, and embedded venues." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Database connection failure.",
    includes: "Not Applicable",
    notes: "Only events with verification_status = 'VERIFIED' are published."
  },
  {
    id: "UC08",
    name: "Browse Events Directory",
    actors: "Guest, Registered Fan",
    description: "Users browse the complete chronological catalog of all verified K-pop events happening across Malaysia.",
    preconditions: "1. System is operational.",
    postconditions: "Full verified events catalog rendered.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "User clicks 'Events' in navigation bar.", system: "System queries all verified events, categories, and artists, rendering the comprehensive events directory." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: No events currently scheduled -> System renders friendly empty state with event submission invitation.",
    includes: "Not Applicable",
    notes: "Events are ordered by event_date ASC and start_time ASC."
  },
  {
    id: "UC09",
    name: "Search Events by Keyword",
    actors: "Guest, Registered Fan",
    description: "Users execute free-text keyword search across event names, artist names, and venue locations in the directory.",
    preconditions: "1. User is on event directory page.",
    postconditions: "Matching events displayed according to search query.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "User inputs search keyword (e.g. 'TXT' or 'Zepp') and presses Enter.", system: "System performs parameterized SQL query with LIKE wildcards across event_name, artist_name, and venue_name, updating results." }
    ],
    alternatives: "1a. User clears search term -> System resets to full event listing.",
    exceptions: "E1: No events match search keyword.",
    includes: "UC08: Browse Events Directory",
    notes: "Case-insensitive substring search matching."
  },
  {
    id: "UC10",
    name: "Filter Events by Artist, Category & City",
    actors: "Guest, Registered Fan",
    description: "Users filter event listings by selecting specific artist groups, event categories (Concert, Fan Meeting, Cupsleeve), or Malaysian cities (Kuala Lumpur, Shah Alam).",
    preconditions: "1. User is on events page.",
    postconditions: "Event catalog filtered dynamically based on criteria.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "User selects category pill or dropdown filters.", system: "System constructs dynamic SQL WHERE clause with selected artist_id, category_slug, or city, updating the card grid." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Selected filter combination yields 0 events.",
    includes: "UC08: Browse Events Directory",
    notes: "Supports combining category and city filters simultaneously."
  },
  {
    id: "UC11",
    name: "View Event Details & Embedded Venue",
    actors: "Guest, Registered Fan",
    description: "Users view complete event information, including official dates, start/end times, ticket tiers, venue guidelines, embedded Google Map, and public transit guide.",
    preconditions: "1. The requested event exists in the database.",
    postconditions: "Detailed event view rendered with all interactive components.",
    priority: "High",
    frequency: "Very High",
    normalCourse: [
      { actor: "User clicks on any event card.", system: "System queries 'events' joined with 'artists' and 'event_categories', retrieves embedded venue details and chat messages, and renders event details page." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Event ID not found -> System redirects to '/events' with flash warning.",
    includes: "Not Applicable",
    notes: "Includes embedded Google Maps iframe for direct in-browser inspection."
  },
  {
    id: "UC12",
    name: "View Artist & Idol Member Biodata",
    actors: "Guest, Registered Fan",
    description: "Users inspect individual idol member profiles and career details (stage name, real birth name, group positions, birthdate, zodiac, height, blood type, and MBTI) for the performing artist.",
    preconditions: "1. Event has an associated artist.\n2. Artist record has populated member JSON array.",
    postconditions: "System renders individual member cards with portrait photos and fact badges.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "User views event details page and navigates to the 'Member Profiles & Biodata' section.", system: "System parses JSON string from 'artists.members' and renders 5 interactive member profile cards." }
    ],
    alternatives: "1a. Artist has no members array (Soloist) -> System renders soloist biography card.",
    exceptions: "E1: Corrupted JSON data in database -> System falls back to empty array without crashing.",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Eliminates need for detached artist_members table."
  },

  // MODULE 3: PUBLIC SUBMISSION (MODEL 2)
  {
    id: "UC13",
    name: "Submit Public Event Listing",
    actors: "Guest, Event Organizer (Public Submitter)",
    description: "An event organizer or fanclub submits a new Malaysian K-pop event through an open public form with venue presets, poster upload, and evidence URL without registering an account.",
    preconditions: "1. Submitter possesses event details, venue address, and official proof link.",
    postconditions: "System generates a unique tracking code (e.g. KS-2026-TXT001), stores event with status 'PENDING', and sends confirmation email.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "User navigates to '/submit-event'.", system: "System displays Model 2 submission form with Malaysian venue presets and file upload." },
      { actor: "User fills event name, date, time, selects preset venue, attaches poster, enters email, and clicks submit.", system: "System uploads poster via Multer, generates cryptographic tracking code, creates record in 'events' with verification_status = 'PENDING', logs activity, sends confirmation email, and redirects to success screen." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Required fields missing (name, date, venue, city).\nE2: Poster file is not an image or exceeds 5MB.",
    includes: "Not Applicable",
    notes: "Fulfills Chapter 1 Scope 1.6.1: organizers do not need accounts."
  },
  {
    id: "UC14",
    name: "Track Submission Status by Tracking Code",
    actors: "Guest, Event Organizer (Public Submitter)",
    description: "Submitter checks the real-time review status (PENDING, VERIFIED, REJECTED) of their submitted event using their unique reference tracking code.",
    preconditions: "1. Submitter possesses a tracking code issued upon submission.",
    postconditions: "System displays verification status timeline and administrator feedback notes.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "User navigates to '/check-submission'.", system: "System displays tracking code search box." },
      { actor: "User enters tracking code (e.g. 'KS-2026-TXT001') and clicks 'Check Status'.", system: "System queries 'events' by tracking_code and displays review status card, event preview, and administrator feedback." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Tracking code not found in database.",
    includes: "Not Applicable",
    notes: "Completely public status tracker requiring no login."
  },
  {
    id: "UC15",
    name: "Resubmit Rejected Event Listing",
    actors: "Guest, Event Organizer (Public Submitter)",
    description: "Submitter corrects flagged details on a rejected event submission and resets status back to PENDING for administrator re-verification.",
    preconditions: "1. Event submission was marked 'REJECTED' by administrator.\n2. Submitter accessed status page.",
    postconditions: "Event details updated; verification_status reset to 'PENDING'.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "User views administrator rejection feedback on tracking page.", system: "System reveals editable inline resubmission form pre-filled with existing data." },
      { actor: "User updates corrected date, venue, or ticketing proof link and clicks 'Resubmit Event'.", system: "System updates event record, clears rejection reason, resets verification_status to 'PENDING', logs audit trail, and notifies administrator." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Event is already verified (resubmission disabled).",
    includes: "UC14: Track Submission Status by Tracking Code",
    notes: "Maintains the exact same tracking code across resubmission cycles."
  },

  // MODULE 4: FAN COMMUNITY & BOOKMARKS
  {
    id: "UC16",
    name: "Bookmark Event (Save to Favorites)",
    actors: "Registered Fan",
    description: "Fan saves an upcoming event to their personal bookmarked collection for quick access and live countdown tracking.",
    preconditions: "1. Fan is authenticated.",
    postconditions: "Record inserted into 'saved_events' table.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "Fan clicks the heart 'Save Event' button on event card or details page.", system: "System sends AJAX request, inserts record into 'saved_events', and updates heart icon to filled rose color." }
    ],
    alternatives: "1a. Guest clicks save -> System responds with unauthorized and prompts login.",
    exceptions: "E1: Event already bookmarked -> System triggers UC18 (Remove Bookmark).",
    includes: "Not Applicable",
    notes: "Asynchronous toggle via AJAX fetch."
  },
  {
    id: "UC17",
    name: "View Saved Events List",
    actors: "Registered Fan",
    description: "Fan views their personalized collection of saved events with countdown timers.",
    preconditions: "1. Fan is authenticated.",
    postconditions: "System renders saved events list.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Fan clicks 'Saved Events' in the navigation bar.", system: "System queries 'saved_events' joined with 'events' for active user ID and renders saved events cards." }
    ],
    alternatives: "1a. User has zero saved events -> System displays empty state with button to explore events.",
    exceptions: "E1: Session expired -> Redirects to login.",
    includes: "Not Applicable",
    notes: "Displays live countdown days remaining for each saved show."
  },
  {
    id: "UC18",
    name: "Remove Event from Bookmarks",
    actors: "Registered Fan",
    description: "Fan removes a previously bookmarked event from their saved list.",
    preconditions: "1. Fan is authenticated.\n2. Event is currently saved.",
    postconditions: "Record deleted from 'saved_events'.",
    priority: "Low",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Fan clicks the filled heart icon on an already saved event.", system: "System deletes matching row from 'saved_events' and updates heart icon to empty outline state." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Record not found in 'saved_events'.",
    includes: "Not Applicable",
    notes: "Asynchronous toggle action."
  },
  {
    id: "UC19",
    name: "View Event Discussion Live Chat",
    actors: "Guest, Registered Fan",
    description: "Users view community discussion messages and Q&A from fellow attendees inside the dedicated event chat hub.",
    preconditions: "1. User is on event details page.",
    postconditions: "Chat message history rendered chronologically.",
    priority: "High",
    frequency: "Very High",
    normalCourse: [
      { actor: "User scrolls to 'Event Fan Chat Hub' section.", system: "System fetches messages from 'event_chat_messages' joined with 'users' and renders message stream." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Chat window has expired (>24 hours post-event) -> System displays 'Chat Closed' banner.",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Chat automatically locks 24 hours after concert conclusion."
  },
  {
    id: "UC20",
    name: "Post Event Chat Message",
    actors: "Registered Fan",
    description: "Fan posts a message, question, or soundcheck tip to the event discussion stream.",
    preconditions: "1. Fan is authenticated.\n2. Event is within active chat window (<24 hours post-event).",
    postconditions: "New record inserted into 'event_chat_messages'.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Fan enters message text into chat input field and clicks 'Send'.", system: "System sanitizes input, inserts row into 'event_chat_messages', and updates chat stream." }
    ],
    alternatives: "1a. Guest attempts to send -> Input replaced with prompt to log in or register.",
    exceptions: "E1: Message text is empty.\nE2: Chat window has locked.",
    includes: "UC19: View Event Discussion Live Chat",
    notes: "Preserves event-focused community coordination."
  },
  {
    id: "UC21",
    name: "Submit Event Content Report",
    actors: "Registered Fan, Guest",
    description: "User flags an inaccurate event listing, incorrect date, or fake ticket link to administrators for review.",
    preconditions: "1. User is viewing event details page.",
    postconditions: "Record created in 'reports' table with status 'PENDING'.",
    priority: "High",
    frequency: "Occasional",
    normalCourse: [
      { actor: "User clicks 'Report' button on the event action bar.", system: "System prompts user for report reason and additional details." },
      { actor: "User enters reason (e.g. Inaccurate Date/Venue, Fake Event) and clicks submit.", system: "System inserts record into 'reports', links user ID (if logged in) and event ID, and displays confirmation." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Report reason is left empty.",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Directly fulfills Chapter 1 Solution 1.3.3 & Scope 1.6.1 content reporting."
  },
  {
    id: "UC22",
    name: "View In-App Notifications",
    actors: "Registered Fan",
    description: "Fan views their notification feed for queue alerts, verified updates, and administrative announcements.",
    preconditions: "1. Fan is authenticated.",
    postconditions: "Notification list rendered with unread indicators.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Fan clicks bell icon in navigation bar.", system: "System queries 'notifications' for user ID and renders notification list." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: No notifications exist.",
    includes: "Not Applicable",
    notes: "Navbar displays unread counter badge dynamically."
  },
  {
    id: "UC23",
    name: "Mark Notifications as Read",
    actors: "Registered Fan",
    description: "Fan marks all unread notifications as read to clear the navbar alert badge.",
    preconditions: "1. Fan is on notifications page with unread items.",
    postconditions: "System updates 'is_read = 1' for user notifications.",
    priority: "Low",
    frequency: "Regular",
    normalCourse: [
      { actor: "Fan clicks 'Mark all as read' button.", system: "System executes UPDATE query on 'notifications' setting is_read = 1 and resets unread badge to 0." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC22: View In-App Notifications",
    notes: "Asynchronous action."
  },

  // MODULE 5: ADMINISTRATOR REVIEW & VERIFICATION
  {
    id: "UC24",
    name: "View Admin Dashboard & KPI Metrics",
    actors: "System Administrator",
    description: "Administrator monitors total events, pending submissions count, registered users, and recent audit logs on the control center.",
    preconditions: "1. Administrator is authenticated with role_id = 1.",
    postconditions: "System renders administrator dashboard with KPI metrics.",
    priority: "High",
    frequency: "Daily",
    normalCourse: [
      { actor: "Administrator navigates to '/admin'.", system: "System verifies admin role, aggregates counts from 'events', 'users', and 'activity_logs', and renders dashboard." }
    ],
    alternatives: "1a. Non-admin user attempts access -> System denies access and redirects to home page with warning.",
    exceptions: "E1: Unauthorized session.",
    includes: "Not Applicable",
    notes: "Protected by requireAdmin middleware."
  },
  {
    id: "UC25",
    name: "View Audit Activity Logs",
    actors: "System Administrator",
    description: "Administrator reviews historical audit trail of all administrative approvals, rejections, and security events.",
    preconditions: "1. Administrator is authenticated.",
    postconditions: "Audit logs table rendered chronologically.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/logs'.", system: "System queries 'activity_logs' joined with 'users' and renders chronological audit trail." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Immutable audit log supporting accountability."
  },
  {
    id: "UC26",
    name: "View Pending Verification Queue",
    actors: "System Administrator",
    description: "Administrator accesses queue of pending public event submissions awaiting review.",
    preconditions: "1. Administrator is authenticated.",
    postconditions: "System renders pending submissions with evidence links.",
    priority: "High",
    frequency: "Daily",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/verifications'.", system: "System retrieves all events with verification_status = 'PENDING' and renders verification queue." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Queue is empty -> Displays 'No pending submissions'." ,
    includes: "Not Applicable",
    notes: "Shows submitter contact and proof URLs."
  },
  {
    id: "UC27",
    name: "Approve Event Submission Live",
    actors: "System Administrator",
    description: "Administrator approves a pending event submission, publishing it live to the public directory and sending approval notification.",
    preconditions: "1. Administrator is viewing pending event.",
    postconditions: "verification_status updated to 'VERIFIED'; audit log recorded; email dispatched.",
    priority: "High",
    frequency: "Daily",
    normalCourse: [
      { actor: "Administrator inspects evidence link and clicks 'Approve Event'.", system: "System updates verification_status to 'VERIFIED', writes entry to 'activity_logs', dispatches approval email to submitter, and reloads queue." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Event ID missing or database error.",
    includes: "UC26: View Pending Verification Queue",
    notes: "Immediately makes event discoverable across directory."
  },
  {
    id: "UC28",
    name: "Reject Event Submission with Feedback",
    actors: "System Administrator",
    description: "Administrator rejects an unverified, duplicate, or fraudulent submission with recorded feedback.",
    preconditions: "1. Administrator is reviewing pending event.",
    postconditions: "verification_status updated to 'REJECTED'; rejection reason saved; email sent.",
    priority: "High",
    frequency: "Daily",
    normalCourse: [
      { actor: "Administrator enters rejection reason and clicks 'Reject Event'.", system: "System updates record with rejection_reason and status 'REJECTED', logs audit entry, sends email to submitter, and reloads queue." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Rejection reason empty -> Prompt user for reason.",
    includes: "UC26: View Pending Verification Queue",
    notes: "Submitter can review reason and resubmit via UC15."
  },
  {
    id: "UC29",
    name: "View Content Reports List",
    actors: "System Administrator",
    description: "Administrator inspects community content reports filed by fans against inaccurate or suspicious events.",
    preconditions: "1. Administrator is authenticated.",
    postconditions: "Reports inbox table rendered.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/reports'.", system: "System queries 'reports' joined with 'events' and 'users' and renders reporting management table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Empowers community-driven content moderation."
  },
  {
    id: "UC30",
    name: "Resolve Content Report",
    actors: "System Administrator",
    description: "Administrator investigates a reported listing, applies necessary corrections, and marks report as resolved.",
    preconditions: "1. Administrator is on reports page.",
    postconditions: "reports.status updated to 'RESOLVED'.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator clicks 'Mark as Resolved' for target report.", system: "System updates report status to 'RESOLVED', records action, and refreshes report table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC29: View Content Reports List",
    notes: "Maintains clear resolution trail."
  },

  // MODULE 6: ADMIN CATALOG CRUD
  {
    id: "UC31",
    name: "View All Events Management List",
    actors: "System Administrator",
    description: "Administrator views full table of all events in the system regardless of status.",
    preconditions: "1. Administrator is logged in.",
    postconditions: "Events management table displayed.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/events'.", system: "System queries all records from 'events' and renders management table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Supports sorting and status filtering."
  },
  {
    id: "UC32",
    name: "Update Event Listing Status",
    actors: "System Administrator",
    description: "Administrator manually toggles event status between UPCOMING, ONGOING, and COMPLETED.",
    preconditions: "1. Administrator is on events management page.",
    postconditions: "event_status updated in database.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator selects new status and clicks 'Update Status'.", system: "System updates event_status column, logs action in 'activity_logs', and reloads page." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC31: View All Events Management List",
    notes: "Status determines chat lock and countdown display."
  },
  {
    id: "UC33",
    name: "Delete Event Listing",
    actors: "System Administrator",
    description: "Administrator permanently removes a fraudulent or canceled event listing from the system.",
    preconditions: "1. Administrator is on events management page.",
    postconditions: "Event record and cascading child records deleted.",
    priority: "High",
    frequency: "Low",
    normalCourse: [
      { actor: "Administrator clicks 'Delete' and confirms deletion prompt.", system: "System executes DELETE query on 'events', cascading to saved_events and chat messages, logs action, and refreshes list." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Deletion cancelled by administrator.",
    includes: "UC31: View All Events Management List",
    notes: "Cascading deletion preserves referential integrity."
  },
  {
    id: "UC34",
    name: "View Event Categories",
    actors: "System Administrator",
    description: "Administrator inspects existing event categories and event counts per category.",
    preconditions: "1. Administrator is logged in.",
    postconditions: "Categories management table rendered.",
    priority: "Low",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/categories'.", system: "System queries 'event_categories' with event counts and renders categories table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Displays badge color preview."
  },
  {
    id: "UC35",
    name: "Create Event Category",
    actors: "System Administrator",
    description: "Administrator adds a new category classification to the platform.",
    preconditions: "1. Administrator is on categories page.",
    postconditions: "New record inserted into 'event_categories'.",
    priority: "Medium",
    frequency: "Low",
    normalCourse: [
      { actor: "Administrator enters category name, slug, and badge color, then clicks 'Add Category'.", system: "System validates unique slug, inserts record into 'event_categories', logs action, and reloads page." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Category name or slug already exists.",
    includes: "UC34: View Event Categories",
    notes: "Slug is auto-sanitized for URL safety."
  },
  {
    id: "UC36",
    name: "Delete Event Category",
    actors: "System Administrator",
    description: "Administrator deletes an unused event category.",
    preconditions: "1. Administrator is on categories page.",
    postconditions: "Category removed from database.",
    priority: "Low",
    frequency: "Low",
    normalCourse: [
      { actor: "Administrator clicks 'Delete' on an unreferenced category.", system: "System executes DELETE on 'event_categories', logs action, and reloads page." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Category is currently linked to existing events (RESTRICT prevents deletion).",
    includes: "UC34: View Event Categories",
    notes: "Protected by foreign key RESTRICT constraint."
  },
  {
    id: "UC37",
    name: "View Artist Catalog",
    actors: "System Administrator",
    description: "Administrator views catalog of all registered K-Pop idol groups and soloists.",
    preconditions: "1. Administrator is logged in.",
    postconditions: "Artist catalog table rendered.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/artists'.", system: "System queries 'artists' table and displays management table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Shows agency and group type."
  },
  {
    id: "UC38",
    name: "Create Artist Profile with Biodata",
    actors: "System Administrator",
    description: "Administrator creates a new artist profile with agency, photo asset, and JSON member biodatas.",
    preconditions: "1. Administrator is on artists page.",
    postconditions: "New record inserted into 'artists'.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Administrator enters artist name, group type, agency, and image URL, then clicks 'Add Artist'.", system: "System validates fields, inserts row into 'artists', logs audit entry, and reloads page." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Artist name left empty.",
    includes: "UC37: View Artist Catalog",
    notes: "Supports single-table JSON biodata embedding."
  },
  {
    id: "UC39",
    name: "Delete Artist Profile",
    actors: "System Administrator",
    description: "Administrator deletes an artist entry from catalog.",
    preconditions: "1. Administrator is on artists page.",
    postconditions: "Artist deleted; linked events set artist_id to NULL.",
    priority: "Low",
    frequency: "Low",
    normalCourse: [
      { actor: "Administrator clicks 'Delete' on artist record.", system: "System executes DELETE on 'artists', sets foreign keys to NULL on linked events, logs action, and refreshes list." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC37: View Artist Catalog",
    notes: "Foreign key ON DELETE SET NULL protects events."
  },
  {
    id: "UC40",
    name: "View Registered Users List",
    actors: "System Administrator",
    description: "Administrator reviews full table of all registered fan and organizer accounts.",
    preconditions: "1. Administrator is logged in.",
    postconditions: "User directory table rendered with role badges.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "Administrator navigates to '/admin/users'.", system: "System queries 'users' joined with 'roles' and renders user management table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Shows registration timestamps and status."
  },
  {
    id: "UC41",
    name: "Delete User Account",
    actors: "System Administrator",
    description: "Administrator terminates and deletes a malicious or violating user account.",
    preconditions: "1. Administrator is on user management page.",
    postconditions: "User record deleted; cascading child records removed.",
    priority: "High",
    frequency: "Low",
    normalCourse: [
      { actor: "Administrator clicks 'Delete' for violating user.", system: "System executes DELETE on 'users', cascades to bookmarks and chat messages, logs action, and reloads page." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Administrator attempts to delete primary root admin account (prevented by system).",
    includes: "UC40: View Registered Users List",
    notes: "Protects platform integrity."
  },

  // MODULE 7: ADDITIONAL / MINOR FEATURES (USER ENHANCEMENTS)
  {
    id: "UC42",
    name: "View Interactive Google Map & Directions in Browser",
    actors: "Guest, Registered Fan",
    description: "Users explore an embedded Google Maps iframe inside the event summary sidebar and launch 1-click turn-by-turn navigation for the concert venue.",
    preconditions: "1. User is on event details page.\n2. Event has venue and city attributes.",
    postconditions: "Interactive map rendered in browser; external navigation link provided.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "User scrolls to 'Venue & Location' card in event summary sidebar.", system: "System renders embedded Google Maps iframe displaying Zepp KL/Axiata Arena location coordinates." },
      { actor: "User clicks 'Directions' or 'Open Google Maps'.", system: "System launches Google Maps in full-screen mode with turn-by-turn routing." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: User is offline.",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Zero external API key dependencies."
  },
  {
    id: "UC43",
    name: "View Real-Time Event Countdown Timer",
    actors: "Guest, Registered Fan",
    description: "Users view a live ticking countdown timer calculating remaining Days, Hours, Minutes, and Seconds until concert start time.",
    preconditions: "1. Event status is 'UPCOMING'.",
    postconditions: "Live clock updates every 1,000 milliseconds.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "User opens event details page.", system: "System calculates target timestamp difference and displays live counting clock." }
    ],
    alternatives: "1a. Event date/time reached -> Clock displays 'Event Started / Live!'.",
    exceptions: "Not Applicable",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Renders in hero banner with pulsing stopwatch badge."
  },
  {
    id: "UC44",
    name: "Share Event via Multi-Channel Social Modal",
    actors: "Guest, Registered Fan",
    description: "Users share event details to WhatsApp, X (Twitter), Telegram, Facebook, or copy a direct link to their clipboard.",
    preconditions: "1. User is on event details page.",
    postconditions: "Share sheet or social share URL launched.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "User clicks 'Share' button on action bar.", system: "System detects device type; on desktop, opens share modal with WhatsApp, X, Telegram, Facebook, and Copy Link." },
      { actor: "User clicks 'Copy' or selects a social network.", system: "System copies URL to clipboard with toast notification or opens target social sharing page." }
    ],
    alternatives: "1a. On mobile devices -> System invokes native navigator.share() interface.",
    exceptions: "Not Applicable",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Promotes event virality among fan networks."
  },
  {
    id: "UC45",
    name: "Manage Concert Day Survival Checklist",
    actors: "Guest, Registered Fan",
    description: "Users interact with a 7-item concert survival checklist (NRIC, E-Ticket, Lightstick, Batteries, Power Bank, Compact Bag, Transit Route) with a live progress bar.",
    preconditions: "1. User is on event details page.",
    postconditions: "Checklist state saved automatically to browser localStorage.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "User checks off prepared items on checklist.", system: "System updates visual progress bar percentage (e.g. 5/7 Prepared - 71%) and persists checked IDs in localStorage." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Data persists across browser refreshes without database calls."
  },
  {
    id: "UC46",
    name: "Add Event to Google Calendar",
    actors: "Guest, Registered Fan",
    description: "Users synchronize the concert schedule with their personal Google Calendar via a 1-click action link.",
    preconditions: "1. User is on event details page.",
    postconditions: "Google Calendar event editor opened in new tab with pre-filled event details.",
    priority: "Medium",
    frequency: "Regular",
    normalCourse: [
      { actor: "User clicks 'Add to Calendar' button on action bar.", system: "System dynamically constructs calendar.google.com URL with event title, ISO dates, venue, and description, opening it in a new browser tab." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Client-side date formatting requiring zero backend storage."
  },
  {
    id: "UC47",
    name: "Copy Event Verification Reference Code",
    actors: "Guest, Registered Fan",
    description: "Users copy the unique event tracking reference code (e.g. KS-2026-TXT001) for official tracking or inquiry.",
    preconditions: "1. Event has an issued tracking code.",
    postconditions: "Code copied to clipboard; floating toast alert displayed.",
    priority: "Low",
    frequency: "Regular",
    normalCourse: [
      { actor: "User clicks 'Copy' button on the Verification & Reference Card.", system: "System writes tracking code to clipboard and displays animated floating toast alert: 'Reference code KS-2026-TXT001 copied!'." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "UC11: View Event Details & Embedded Venue",
    notes: "Reinforces transparency and anti-scam verification."
  }
];

async function generateSRS() {
  console.log("Generating Complete SRS Document with Full Use Case Tables...");

  const allChildren = [
    createTitle("K-Sync Malaysia: Software Requirements Specification (SRS)"),
    new Paragraph({
      children: [
        new TextRun({
          text: "Chapter 3: Complete Use Case Specifications, CRUD Matrices, and Detailed Normal/Alternative Courses of Events",
          bold: true,
          color: COLOR_ACCENT,
          size: 22
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),

    createP("This document provides the exhaustive, formal Software Requirements Specification (SRS) for K-Sync Malaysia. Every functional interaction across all 3 actors (Guest, Registered Fan, System Administrator) is modeled into individual, uncombined Use Case tables with explicit Normal Courses of Events (Actor vs System), Alternative Courses, Exceptions, Preconditions, Postconditions, Priority, and Frequency of Use."),

    createH1("1. Summary of System Use Cases"),
    createP(`Total System Use Cases: ${allUseCases.length} Comprehensive Specifications`),
    createBullet("Module 1: Authentication & User Profile Management (UC01 – UC06)"),
    createBullet("Module 2: Event Discovery & Information (UC07 – UC12)"),
    createBullet("Module 3: Public Event Submission & Status Tracking (UC13 – UC15)"),
    createBullet("Module 4: Fan Community, Live Chat & Bookmarks (UC16 – UC23)"),
    createBullet("Module 5: Administrator Review, Verification & Moderation (UC24 – UC30)"),
    createBullet("Module 6: Administrator Catalog & System Entity CRUD (UC31 – UC41)"),
    createBullet("Module 7: Additional / Minor User Experience Enhancements (UC42 – UC47)"),

    new Paragraph({ spacing: { after: 300 } }),
    createH1("2. Detailed Use Case Specifications (Formal Tables)")
  ];

  // Append every use case table
  for (const uc of allUseCases) {
    allChildren.push(...createUseCaseTable(uc));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Segoe UI",
            size: 22,
            color: COLOR_TEXT
          }
        }
      }
    },
    sections: [
      {
        properties: {},
        children: allChildren
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(projectRoot, "docs", "K-Sync_Malaysia_Complete_SRS_Use_Cases.docx");
  fs.writeFileSync(outPath, buffer);
  console.log(`\nSUCCESS! Created Complete SRS Document (.docx):`);
  console.log(`Path: ${outPath}`);
  console.log(`File Size: ${(buffer.length / 1024).toFixed(2)} KB`);
}

generateSRS().catch(console.error);
