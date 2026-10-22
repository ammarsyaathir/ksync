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

function createCallout(title, body) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: title + " ", bold: true, color: COLOR_ACCENT, size: 22 }),
                  new TextRun({ text: body, size: 22 })
                ]
              })
            ],
            shading: { fill: "FDF2F8", type: ShadingType.CLEAR },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_ACCENT },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE }
            },
            margins: { top: 120, bottom: 120, left: 160, right: 160 }
          })
        ]
      })
    ]
  });
}

/**
 * Creates an academic SRS Use Case Specification Table following university templates
 */
function createUseCaseTable(data) {
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
    let cellContent;
    if (typeof contentOrComponent === 'string') {
      const lines = contentOrComponent.split('\n');
      cellContent = lines.map(line => new Paragraph({
        children: [new TextRun({ text: line, size: 20 })],
        spacing: { after: 40 }
      }));
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

// 42 Use Cases aligned with docs/use_case_diagram.puml and supervisor directives
const allUseCases = [
  // ==========================================
  // MODULE 1: PUBLIC DISCOVERY & OUTBOUND (GUEST)
  // ==========================================
  {
    id: "UC001",
    name: "Register Account",
    actors: "Guest, Google OAuth Service",
    description: "A public visitor registers a new user account using email/password or Google OAuth to transition to an authenticated Fan or Organizer.",
    preconditions: "1. Visitor has accessed the platform.\n2. Visitor is currently unauthenticated.",
    postconditions: "New user record created in `users` table with role 'Fan' (or 'Organizer') and session established.",
    priority: "High",
    frequency: "Once per new user",
    normalCourse: [
      { actor: "Visitor clicks 'Register' in navbar.", system: "Renders registration form requesting Full Name, Username, Email, and Password." },
      { actor: "Visitor enters valid details and clicks 'Register'.", system: "Validates email syntax, hashes password with Bcrypt (cost 10), saves record, and establishes session." }
    ],
    alternatives: "2a. Visitor clicks 'Continue with Google':\n  2a.1 System executes OAuth 2.0 handshake, retrieves email & avatar, and creates account.",
    exceptions: "E1: Email or username already exists.\nE2: Password under 6 characters.",
    includes: "Not Applicable",
    notes: "Adheres to RFC 5322 email validation standards."
  },
  {
    id: "UC002",
    name: "Browse Events Directory",
    actors: "Guest",
    description: "Visitor browses the complete chronological catalog of upcoming and community K-Pop events in Malaysia.",
    preconditions: "System database is online.",
    postconditions: "Renders chronological cards with verification badges, dates, and venue precincts.",
    priority: "High",
    frequency: "Very Frequent",
    normalCourse: [
      { actor: "Visitor navigates to '/events'.", system: "Queries `events` table ordered by `start_date ASC`." },
      { actor: "Visitor scrolls through listings.", system: "Renders responsive grid with badges (VERIFIED_OFFICIAL, COMMUNITY_UNVERIFIED)." }
    ],
    alternatives: "2a. No active events: System displays empty state illustration with filter clear CTA.",
    exceptions: "E1: Database error. Displays graceful error banner.",
    includes: "Not Applicable",
    notes: "Complies with Impeccable Design Card Elevation tokens."
  },
  {
    id: "UC003",
    name: "Search Events",
    actors: "Guest",
    description: "Searches events by keyword across artist name, tour name, venue, or host city.",
    preconditions: "Guest is on an event directory view.",
    postconditions: "Displays filtered event cards matching keyword query.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Guest types keyword (e.g. 'BOYNEXTDOOR' or 'Axiata') in search bar.", system: "Debounces input and executes SQL LIKE match on title, artist, venue, and city." },
      { actor: "Guest views search results.", system: "Renders matching event cards and active search pill with total match count." }
    ],
    alternatives: "2a. Zero matches: System displays suggestion to broaden search terms.",
    exceptions: "E1: Malformed input. Parameterized SQL queries prevent injection.",
    includes: "Not Applicable",
    notes: "Case-insensitive utf8mb4 keyword lookup."
  },
  {
    id: "UC004",
    name: "Filter Events",
    actors: "Guest",
    description: "Filters events by category (Concert, Fanmeet, Cafe Event), artist, Malaysian state, or precinct area.",
    preconditions: "Events directory is open.",
    postconditions: "URL query params updated and view re-rendered with matching subset.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Guest selects filter pills (e.g. Category: 'Concert', State: 'Kuala Lumpur').", system: "Builds dynamic SQL query and updates results view." },
      { actor: "Guest inspects filtered list.", system: "Displays refined subset with active filter badge indicators." }
    ],
    alternatives: "1a. Guest clicks 'Clear All': System resets filters to default chronology.",
    exceptions: "E1: Invalid filter parameter. System ignores unknown params.",
    includes: "Not Applicable",
    notes: "Maintains bookmarkable filter state via clean URL parameters."
  },
  {
    id: "UC005",
    name: "View Event Radar",
    actors: "Guest",
    description: "Explores events grouped by geographical precinct corridors (Bukit Jalil, BBCC, Mega Star Arena, PJ/Sunway) and same-weekend cohorts.",
    preconditions: "Active events exist in database.",
    postconditions: "Displays interactive Event Radar grouped by geographic precinct and calendar weekend.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Guest clicks 'Event Radar' (/events/radar).", system: "Aggregates events by `cluster_area` and computes same-weekend cohorts via strftime('%Y-W%W', start_date)." },
      { actor: "Guest clicks precinct corridor (e.g. 'Bukit Jalil Hub').", system: "Filters and displays events occurring in that precinct corridor with transit tips." }
    ],
    alternatives: "2a. Guest clicks weekend cohort: System displays all concerts happening on that weekend.",
    exceptions: "E1: Missing cluster_area. Defaults to 'Kuala Lumpur Metro Hub'.",
    includes: "Not Applicable",
    notes: "Directly solves FYP survey demand for inter-fandom travel and meetup logistics."
  },
  {
    id: "UC006",
    name: "View Event Details",
    actors: "Guest",
    description: "Views full event dossier with live digital countdown timer, schedule, venue transit guidelines, verified evidence link, and discussion thread.",
    preconditions: "Event exists in database.",
    postconditions: "Renders event dossier with real-time countdown clock and verification badge.",
    priority: "High",
    frequency: "Extremely High",
    normalCourse: [
      { actor: "Guest clicks an event card.", system: "Fetches event, artist biodata, venue transit details, and community messages." },
      { actor: "Guest inspects event details.", system: "Calculates time delta to showtime and starts client-side ticking digital countdown." }
    ],
    alternatives: "2a. Past Event: Countdown replaced with 'Event Concluded' badge.",
    exceptions: "E1: Invalid event ID. Returns 404 page.",
    includes: "Not Applicable",
    notes: "Includes structured JSON-LD schema for search indexing."
  },
  {
    id: "UC007",
    name: "Open Official Ticket Link",
    actors: "Guest",
    description: "Navigates directly to the external authorized ticketing partner (BookMyShow, GoLive Asia, Ticket2U, BigTix) with partner domain validation.",
    preconditions: "Event has a ticketing URL configured.",
    postconditions: "Opens official ticketing portal in a new browser tab (rel='noopener noreferrer').",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Guest clicks 'Buy Official Tickets'.", system: "Validates domain against whitelisted provider registry." },
      { actor: "Guest arrives at ticketing site.", system: "Opens partner checkout portal in external browser tab." }
    ],
    alternatives: "1a. Free Event: Button displays 'Free Admission' and opens announcement page.",
    exceptions: "E1: Dead link. Prompts user to report via Report Listing modal.",
    includes: "Not Applicable",
    notes: "Supervisor Directive: Outbound interactive handshakes modeled explicitly."
  },
  {
    id: "UC008",
    name: "Open Venue Map & Transit Route",
    actors: "Guest",
    description: "Launches Google Maps with venue coordinates, transit stop guidelines (e.g. Sri Petaling LRT), and driving directions.",
    preconditions: "Venue has address or map coordinates.",
    postconditions: "Opens Google Maps navigation interface pre-loaded with transit routing.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "Guest clicks 'Get Transit Directions / Open Map'.", system: "Formats Google Maps URL: https://www.google.com/maps/search/?api=1&query={encoded_venue}." },
      { actor: "Guest navigates via Google Maps.", system: "Presents public transit LRT/MRT routing." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Missing address. Defaults query to venue name and host city.",
    includes: "Not Applicable",
    notes: "Fulfills FYP survey requirement for transit assistance."
  },
  {
    id: "UC009",
    name: "Open Organizer Social Profile Link",
    actors: "Guest",
    description: "Opens official promoter social profile (X/Twitter, Instagram) to inspect official announcements, gate notices, and merchandise guides.",
    preconditions: "Organizer social handle or URL configured on event.",
    postconditions: "Opens promoter official page in a new browser tab.",
    priority: "Medium",
    frequency: "Medium",
    normalCourse: [
      { actor: "Guest clicks organizer social handle badge (@ime.malaysia).", system: "Resolves verified social profile URL." },
      { actor: "Guest views organizer channel.", system: "Opens destination social feed securely." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Social link unconfigured. Button renders promoter name as plain text.",
    includes: "Not Applicable",
    notes: "Promotes promoter accountability and transparency."
  },
  {
    id: "UC010",
    name: "Share Event",
    actors: "Guest",
    description: "Shares event dossier across WhatsApp, X, Telegram, or copies formatted link to clipboard.",
    preconditions: "Guest is on event details view.",
    postconditions: "Share modal rendered or event link copied with confirmation toast.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "Guest clicks 'Share Event'.", system: "Opens Share Modal with WhatsApp, X, Telegram, and Copy Link options." },
      { actor: "Guest clicks 'Copy Link'.", system: "Copies URL to clipboard and triggers 'Link Copied!' toast." }
    ],
    alternatives: "2a. Mobile browser supports Web Share API: Triggers native OS share drawer.",
    exceptions: "E1: Clipboard blocked. Displays fallback selectable text box.",
    includes: "Not Applicable",
    notes: "Lightweight reactive micro-interaction."
  },
  {
    id: "UC011",
    name: "Export Event to Calendar",
    actors: "Guest",
    description: "Exports event showtime and venue to Google Calendar web intent or downloads RFC 5545 .ics file.",
    preconditions: "Event has valid start and end dates.",
    postconditions: "Google Calendar scheduling tab opens or .ics file downloads to user device.",
    priority: "Medium",
    frequency: "Medium",
    normalCourse: [
      { actor: "Guest clicks 'Add to Calendar' dropdown and selects 'Google Calendar'.", system: "Constructs Google Calendar URL with ISO 8601 UTC date and venue info." },
      { actor: "Guest reviews pre-filled event.", system: "Opens Google Calendar in new tab ready to save." }
    ],
    alternatives: "1a. Guest selects '.ics File': System streams RFC 5545 iCalendar file.",
    exceptions: "E1: Missing end time. Defaults duration to 3 hours from start.",
    includes: "Not Applicable",
    notes: "Directly solves calendar sync survey feature."
  },
  {
    id: "UC012",
    name: "Browse Artists Directory",
    actors: "Guest",
    description: "Explores the directory of K-Pop artists, idol boy groups, girl groups, and soloists with tours or fan events in Malaysia.",
    preconditions: "Artists catalog populated in database.",
    postconditions: "Renders catalog cards featuring artist banners, agency labels, and member rosters.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Guest clicks 'Artists' in navbar (/artists).", system: "Queries `artists` table with active upcoming Malaysian event counts." },
      { actor: "Guest browses artist cards.", system: "Renders grid with group types (Boy Group, Girl Group, Soloist)." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Database error. Displays empty catalog fallback.",
    includes: "Not Applicable",
    notes: "Normalized database architecture with foreign keys to member records."
  },
  {
    id: "UC013",
    name: "View Artist & Member Profiles",
    actors: "Guest",
    description: "Inspects individual idol profile including agency affiliation, biography, normalized member biodata, and Malaysian tour history.",
    preconditions: "Artist exists in database.",
    postconditions: "Renders idol dossier with connected Malaysian tour chronology.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Guest clicks artist card (e.g. 'BOYNEXTDOOR').", system: "Queries artist, joins `members` table (stage name, real name, role, DOB), and fetches linked events." },
      { actor: "Guest reviews idol biodata and Malaysian tour timeline.", system: "Displays member cards and clickable event chronology." }
    ],
    alternatives: "1a. Solo Artist: Member section collapses gracefully.",
    exceptions: "E1: Artist ID not found. Returns 404.",
    includes: "Not Applicable",
    notes: "Normalized `members` table eliminates unindexed text bloat."
  },
  {
    id: "UC014",
    name: "View Event Discussion & Comments",
    actors: "Guest",
    description: "Reads public community discussions, ticketing Q&A, and logistics tips submitted by verified fans on an event listing.",
    preconditions: "Event exists in database.",
    postconditions: "Renders chronological comments with 1-level nested fan replies.",
    priority: "High",
    frequency: "Extremely High",
    normalCourse: [
      { actor: "Guest scrolls to discussion section on event dossier.", system: "Queries `event_chat_messages` where `event_id = :id` ordered by `created_at ASC`." },
      { actor: "Guest reads community questions and organizer replies.", system: "Renders 1-level nested threaded layout with verified organizer badges." }
    ],
    alternatives: "2a. Zero comments: Displays prompt inviting fans to ask the first inquiry.",
    exceptions: "E1: Deleted user author. Displays 'Deleted User' label.",
    includes: "Not Applicable",
    notes: "Public read-only access for unauthenticated guests."
  },

  // ==========================================
  // MODULE 2: PERSONAL MANAGEMENT & VALIDATION (FAN)
  // ==========================================
  {
    id: "UC015",
    name: "Manage Personal Profile",
    actors: "Fan",
    description: "Manages personal profile information, including display name, username, bio, location, and password credentials.",
    preconditions: "Fan is logged in.",
    postconditions: "`users` record updated and session refreshed.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Fan navigates to '/profile'.", system: "Loads current profile data, notification toggles, and organizer status." },
      { actor: "Fan updates display name, bio, or favorite artists, and clicks 'Save'.", system: "Validates input lengths, updates `users` record, and displays success toast." }
    ],
    alternatives: "2a. Change Password: Fan enters current and new password; system verifies hash before updating.",
    exceptions: "E1: Current password mismatch. Rejects update.",
    includes: "Not Applicable",
    notes: "Protected via CSRF tokens."
  },
  {
    id: "UC016",
    name: "View Personalized Dashboard ('My K-Sync')",
    actors: "Fan",
    description: "Views personal command center summarizing saved upcoming events, active ticking countdown to nearest concert, upvoting history, and alerts.",
    preconditions: "Fan is logged in.",
    postconditions: "Renders personalized timeline, live ticking clock, and saved event cards.",
    priority: "High",
    frequency: "Frequent",
    normalCourse: [
      { actor: "Fan clicks 'My K-Sync' / Dashboard (/dashboard).", system: "Queries `saved_events` joined with `events`, identifies nearest upcoming show, and counts unread notifications." },
      { actor: "Fan tracks upcoming concerts.", system: "Initializes live digital countdown ticking towards nearest saved show." }
    ],
    alternatives: "2a. No saved events: Renders empty-state card with 'Discover Upcoming Events' CTA.",
    exceptions: "E1: Session expired. Redirects to login with return URL.",
    includes: "Not Applicable",
    notes: "Key FYP survey requirement for personalized fan dashboard."
  },
  {
    id: "UC017",
    name: "Bookmark / Save Event",
    actors: "Fan",
    description: "Toggles bookmark status on an event listing to save it to personal wishlist for quick access and automated schedule alerts.",
    preconditions: "Fan is logged in and viewing an event.",
    postconditions: "Record toggled in `saved_events` table; bookmark icon updates state.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Fan clicks Bookmark icon on event card or dossier.", system: "Dispatches AJAX POST to `/api/events/:id/save`." },
      { actor: "Fan views updated icon.", system: "Toggles `saved_events` record, returns `{ saved: true }`, and highlights bookmark icon." }
    ],
    alternatives: "1a. Event already bookmarked: System deletes record (unsave) and removes highlight.",
    exceptions: "E1: Guest clicks bookmark. Displays modal prompting login or register.",
    includes: "Not Applicable",
    notes: "Instant reactive UI update without page reload."
  },
  {
    id: "UC018",
    name: "Recommend / Upvote Event",
    actors: "Fan",
    description: "Casts a crowdsourced reliability vote (thumbs up) on an event listing to signal community trust in listing authenticity.",
    preconditions: "Fan is logged in and event is published.",
    postconditions: "Vote recorded in `event_recommendations` table and public recommendation tally updates.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Fan clicks 'Recommend Event' (thumbs up).", system: "Dispatches POST to `/api/events/:id/recommend`." },
      { actor: "Fan views updated tally.", system: "Toggles record in `event_recommendations`, returns new count, and highlights button." }
    ],
    alternatives: "1a. Retract Vote: Clicking again removes vote and decrements count.",
    exceptions: "E1: Unique compound index (user_id, event_id) strictly prevents duplicate voting.",
    includes: "Not Applicable",
    notes: "Directly powers community reliability score."
  },
  {
    id: "UC019",
    name: "Report Suspicious Listing",
    actors: "Fan",
    description: "Submits a formal moderation report flagging an event for suspected scam ticket links, fraudulent fan gatherings, or outdated show info.",
    preconditions: "Fan is logged in.",
    postconditions: "Report logged in `reports` table with status 'PENDING' for maintainer review.",
    priority: "High",
    frequency: "Low",
    normalCourse: [
      { actor: "Fan clicks 'Report Event' in event footer.", system: "Opens Report Modal with categories: Scam Link, Cancelled Event, Inaccurate Info." },
      { actor: "Fan selects reason, inputs details, and clicks 'Submit Report'.", system: "Inserts record into `reports` (status='PENDING') and displays confirmation toast." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Empty reason. Blocks submission and prompts input.",
    includes: "Not Applicable",
    notes: "Listings receiving >=3 active scam reports automatically display an amber caution warning."
  },
  {
    id: "UC020",
    name: "Post Discussion Comment",
    actors: "Fan",
    description: "Posts a top-level inquiry or logistical tip in the event's public discussion thread.",
    preconditions: "Fan is logged in.",
    postconditions: "Comment saved to `event_chat_messages` and rendered in discussion thread.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Fan enters message in discussion input and clicks 'Post Comment'.", system: "Sanitizes HTML entities against XSS and validates length (1 to 1000 characters)." },
      { actor: "Fan views posted message.", system: "Inserts into `event_chat_messages` (parent_id = NULL) and renders comment card." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Empty comment. Rejects submission with client alert.",
    includes: "Not Applicable",
    notes: "ANTI-SCALPER POLICY: Comments are strictly immutable once posted (no edit capability)."
  },
  {
    id: "UC021",
    name: "Reply to Discussion Comment",
    actors: "Fan",
    description: "Submits a direct answer to an existing discussion comment, establishing a 1-level nested Q&A thread.",
    preconditions: "Fan is logged in and parent comment exists.",
    postconditions: "Reply recorded with `parent_id` referencing parent; notification sent to parent author.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "Fan clicks 'Reply' underneath specific comment.", system: "Opens inline reply form under parent comment." },
      { actor: "Fan types answer and clicks 'Submit Reply'.", system: "Inserts into `event_chat_messages` (parent_id = target_id) and notifies parent author." }
    ],
    alternatives: "1a. Replying to a reply: System automatically flattens `parent_id` to root comment.",
    exceptions: "E1: Parent comment was deleted. Displays error alert.",
    includes: "Not Applicable",
    notes: "Strictly enforces 1-level threading to preserve clean mobile rendering."
  },
  {
    id: "UC022",
    name: "Delete Own Discussion Comment",
    actors: "Fan",
    description: "Deletes a comment previously authored by the user. Editing is strictly disabled platform-wide to prevent scalper fraud.",
    preconditions: "Fan is logged in and is the author of the comment (or System Maintainer).",
    postconditions: "Comment removed from database; UI updates cleanly.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Fan clicks trash icon on own comment.", system: "Prompts confirmation modal: 'Delete this comment?'." },
      { actor: "Fan confirms deletion.", system: "Executes DELETE FROM event_chat_messages WHERE id = :id AND user_id = :userId and removes DOM card." }
    ],
    alternatives: "1a. System Maintainer Override: Maintainer can delete any abusive comment.",
    exceptions: "E1: Unauthorized attempt. Returns 403 Forbidden.",
    includes: "Not Applicable",
    notes: "Supervisor Directive: Discussion comments support deletion, but NEVER editing."
  },
  {
    id: "UC023",
    name: "View In-App Notifications",
    actors: "Fan",
    description: "Opens notification bell tray to review alerts regarding showtime shifts, ticket on-sale countdowns, discussion replies, and listings.",
    preconditions: "Fan is logged in.",
    postconditions: "Renders notification dropdown with unread badge counter.",
    priority: "Medium",
    frequency: "High",
    normalCourse: [
      { actor: "Fan clicks Notification Bell icon in header.", system: "Queries `notifications` where `user_id = :id` ordered by `created_at DESC` (limit 20)." },
      { actor: "Fan clicks an alert.", system: "Navigates directly to the relevant event or discussion anchor." }
    ],
    alternatives: "2a. Zero notifications: Displays 'All caught up! No new notifications.'.",
    exceptions: "E1: Session expired. Prompts sign in.",
    includes: "Not Applicable",
    notes: "Live unread badge count updates reactively."
  },
  {
    id: "UC024",
    name: "Mark Notification as Read",
    actors: "Fan",
    description: "Marks a single notification or all active notifications as read to clear unread badge indicators.",
    preconditions: "Fan has unread notifications.",
    postconditions: "Notification `is_read` column updated to 1; unread bell counter decrements.",
    priority: "Low",
    frequency: "Regular",
    normalCourse: [
      { actor: "Fan clicks 'Mark all as read' in notification dropdown.", system: "Issues POST to `/notifications/mark-all-read`." },
      { actor: "Fan views cleared badge.", system: "Executes UPDATE notifications SET is_read = 1 WHERE user_id = :id and clears red counter." }
    ],
    alternatives: "1a. Single click: Clicking individual alert marks it as read automatically upon redirect.",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Asynchronous fetch update."
  },
  {
    id: "UC025",
    name: "Manage Notification Settings",
    actors: "Fan",
    description: "Customizes alert delivery channels and toggles for schedule updates, countdown reminders, and community replies.",
    preconditions: "Fan is on profile settings view (/profile).",
    postconditions: "Notification preference columns updated in `users` table.",
    priority: "Medium",
    frequency: "Low",
    normalCourse: [
      { actor: "Fan navigates to Notification Settings tab on profile page.", system: "Renders toggles: notify_event_updates, notify_countdown_reminders, notify_discussion_replies." },
      { actor: "Fan adjusts toggles and clicks 'Save Preferences'.", system: "Updates columns in `users` table and displays confirmation alert." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Database write error. Serves error toast.",
    includes: "Not Applicable",
    notes: "Integrated directly into `users` schema via migration."
  },

  // ==========================================
  // MODULE 3: EVENT PUBLISHING & VERIFICATION (ORGANIZER)
  // ==========================================
  {
    id: "UC026",
    name: "View Organizer Dashboard",
    actors: "Organizer",
    description: "Reviews event management dashboard displaying all submitted listings, current verification scores, active ticket click-through metrics, and quick actions.",
    preconditions: "User is authenticated as Organizer.",
    postconditions: "Renders organizer management portal with listing performance cards.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Organizer clicks 'Organizer Portal' (/organizer/dashboard).", system: "Queries `events` where `organizer_id = :id`, calculates verification percentages, and counts recommendations." },
      { actor: "Organizer reviews listings and metrics.", system: "Renders table with actions: Edit, View Verification Breakdown, Post Update." }
    ],
    alternatives: "2a. Zero listings: Displays 'You have not submitted any events yet' with prominent Submit button.",
    exceptions: "E1: Unauthenticated. Redirects to login.",
    includes: "Not Applicable",
    notes: "Seamless auto-role assignment upon first event submission."
  },
  {
    id: "UC027",
    name: "Submit Event Listing",
    actors: "Organizer, Autonomous Verification Engine",
    description: "Submits a new Malaysian K-Pop event listing, assisted by the Multimodal OCR Vision Scanner (OpenRouter Gemini 4 Argon) to auto-extract poster details.",
    preconditions: "Organizer is logged in.",
    postconditions: "Event inserted into `events` table; Autonomous Verification Engine executes instant audit.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Organizer navigates to '/submit-event' and enters poster image URL.", system: "Triggers AV05 (OpenRouter Gemini 4 Argon Vision OCR) and auto-extracts title, artist, venue, date." },
      { actor: "Organizer reviews pre-filled fields, inputs ticketing and evidence URLs, and submits.", system: "Runs AV01–AV04 autonomous checks, computes trust score, persists listing, and redirects to Verification Breakdown." }
    ],
    alternatives: "1a. Manual Entry: Organizer fills all fields manually without AI scanner.",
    exceptions: "E1: Mandatory fields missing. Form blocks submission.\nE2: Hard gate failure. Listing saved as DRAFT_FLAGGED with specific remediation.",
    includes: "AV01: Audit Whitelisted Ticketing Domain, AV05: Multimodal OCR Vision Extraction",
    notes: "Fully autonomous publishing with zero manual admin approval bottleneck."
  },
  {
    id: "UC028",
    name: "Edit Event Listing",
    actors: "Organizer",
    description: "Updates details of an existing draft or flagged listing to improve its verification score, update gate times, or adjust ticketing details.",
    preconditions: "Organizer owns the listing (or is System Maintainer).",
    postconditions: "Event record updated and re-scored by Autonomous Verification Engine.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Organizer clicks 'Edit Listing' (/events/:id/edit).", system: "Populates form with existing event data and current audit diagnostic tips." },
      { actor: "Organizer updates evidence link or ticketing URL and clicks 'Save'.", system: "Updates `events` record, re-runs autonomous audit, recalculates trust score, and displays updated breakdown." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Non-owner attempt. Returns 403 Forbidden.",
    includes: "Not Applicable",
    notes: "Preserves audit trail in `activity_logs`."
  },
  {
    id: "UC029",
    name: "View Verification Breakdown",
    actors: "Organizer, Guest, Fan",
    description: "Inspects the transparent 14-point autonomous verification score and audit diagnostics explaining exactly why marks were awarded or deducted.",
    preconditions: "Event listing exists in database.",
    postconditions: "Renders audit report showing hard gate results, attribute match percentages, and AI consensus logs.",
    priority: "High",
    frequency: "High",
    normalCourse: [
      { actor: "User clicks 'View Verification Breakdown' on event dossier or dashboard.", system: "Loads verification telemetry: Hard Gates, 14-point Attribute Overlap, Evidence Byte count, and AI Votes." },
      { actor: "User reviews breakdown and diagnostic recommendations.", system: "Presents score (e.g. 88/100), Trust Badge, and actionable remediation advice." }
    ],
    alternatives: "Not Applicable",
    exceptions: "Not Applicable",
    includes: "AV06: Cross-Model AI Consensus Audit",
    notes: "Directly solves user's transparent score breakdown requirement."
  },
  {
    id: "UC030",
    name: "Post Logistical Event Update",
    actors: "Organizer",
    description: "Broadcasts an official logistical announcement (e.g. door opening times, bag size restrictions, weather alerts) directly to fans who saved the event.",
    preconditions: "Organizer owns the listing.",
    postconditions: "Update record created in `event_updates`; in-app alerts dispatched to saved ticket holders.",
    priority: "Medium",
    frequency: "Occasional",
    normalCourse: [
      { actor: "Organizer clicks 'Post Logistical Update' on event dossier or dashboard.", system: "Opens update modal requesting Title, Urgency (Info, Warning, Urgent), and Message." },
      { actor: "Organizer enters notice details and clicks 'Broadcast Update'.", system: "Inserts into `event_updates`, creates in-app notifications for saved fans, and displays update banner on dossier." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Content exceeds 2000 characters. Prompts concise phrasing.",
    includes: "Not Applicable",
    notes: "Solves Chapter 1 problem of fragmented last-minute announcements."
  },
  {
    id: "UC031",
    name: "Request Organizer Badge",
    actors: "Organizer",
    description: "Submits official credentials (fanclub registration, SSM business registration, or previous promoter portfolio) to obtain a verified organizer gold badge.",
    preconditions: "User is logged in.",
    postconditions: "Verification request submitted; `users.is_verified_organizer` queued for maintainer review.",
    priority: "Low",
    frequency: "Once per organizer",
    normalCourse: [
      { actor: "Organizer navigates to '/profile' and clicks 'Request Verified Badge'.", system: "Displays modal requesting Organization Name, Social Handle, and Documentation URL." },
      { actor: "Organizer submits credentials and supporting link.", system: "Updates `users.organization_name`, `users.verification_proof`, and flags for maintainer review." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Invalid URL. Prompts valid link.",
    includes: "Not Applicable",
    notes: "Verified badge grants high trust weighting on all submitted events."
  },

  // ==========================================
  // MODULE 4: PLATFORM GOVERNANCE (SYSTEM MAINTAINER)
  // ==========================================
  {
    id: "UC032",
    name: "View Maintainer Portal",
    actors: "System Maintainer",
    description: "Accesses administrative master portal displaying global platform statistics, listing health metrics, active scam reports, and audit logs.",
    preconditions: "User is authenticated with role 'Admin'.",
    postconditions: "Renders admin portal overview with platform analytics.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Maintainer navigates to '/admin'.", system: "Verifies admin session, aggregates total users, active events, pending scam reports, and recent audits." },
      { actor: "Maintainer inspects metrics.", system: "Displays executive metrics dashboard with management shortcuts." }
    ],
    alternatives: "1a. Non-admin attempt: Redirects to /login with 403 Forbidden.",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Protected by requireAdmin Express middleware."
  },
  {
    id: "UC033",
    name: "Manage Event Categories",
    actors: "System Maintainer",
    description: "Governs event taxonomy by adding, updating, or deactivating categories (Concert, Fanmeet, Birthday Cafe, Cup Sleeve Event).",
    preconditions: "Maintainer is in admin portal.",
    postconditions: "`event_categories` table updated.",
    priority: "Medium",
    frequency: "Low",
    normalCourse: [
      { actor: "Maintainer navigates to '/admin/categories'.", system: "Renders active categories with badge color tokens and event counts." },
      { actor: "Maintainer adds new category Name, Slug, and Color, then clicks 'Save'.", system: "Validates unique slug, inserts record into `event_categories`, and refreshes directory." }
    ],
    alternatives: "2a. Edit Category: Updates badge color or description across existing events.",
    exceptions: "E1: Duplicate slug. Rejects with error.",
    includes: "Not Applicable",
    notes: "Used globally across event filtering and badges."
  },
  {
    id: "UC034",
    name: "Manage Venues Database",
    actors: "System Maintainer",
    description: "Maintains master venue directory with standardized names, addresses, state/city tags, capacity figures, and transit guidance (nearest LRT/MRT).",
    preconditions: "Maintainer is in admin portal.",
    postconditions: "`venues` table updated with standardized venue data.",
    priority: "High",
    frequency: "Low",
    normalCourse: [
      { actor: "Maintainer navigates to '/admin/venues'.", system: "Displays table of Malaysian venues (Axiata Arena, Zepp KL, Mega Star Arena, Sunway Pyramid)." },
      { actor: "Maintainer updates transit instructions (e.g. adding LRT Sri Petaling line info) and saves.", system: "Persists updates into `venues` table." }
    ],
    alternatives: "Not Applicable",
    exceptions: "E1: Venue name conflict. Prompts merge or edit.",
    includes: "Not Applicable",
    notes: "Powers Event Radar and transit navigation."
  },
  {
    id: "UC035",
    name: "Manage Artists & Member Roster",
    actors: "System Maintainer",
    description: "Manages normalized artist catalog and individual idol member records, ensuring accurate agency details, group types, and debut history.",
    preconditions: "Maintainer is in admin portal.",
    postconditions: "`artists` and `members` tables updated.",
    priority: "High",
    frequency: "Low",
    normalCourse: [
      { actor: "Maintainer navigates to '/admin/artists'.", system: "Displays list of cataloged K-Pop artists with affiliated member counts." },
      { actor: "Maintainer selects artist (e.g. 'BOYNEXTDOOR'), updates member roster biodata, and clicks 'Save'.", system: "Updates `artists` table and executes relational updates into `members` table." }
    ],
    alternatives: "2a. Add New Artist: Creates new artist profile with official banner and agency.",
    exceptions: "E1: Missing name. Prompts required field.",
    includes: "Not Applicable",
    notes: "Normalized schema eliminates comma-delimited strings."
  },
  {
    id: "UC036",
    name: "Audit Scam Reports",
    actors: "System Maintainer",
    description: "Investigates community scam reports, reviews reported event evidence, and executes administrative overrides (unpublishing events or suspending accounts).",
    preconditions: "Maintainer is in admin portal.",
    postconditions: "Report status updated ('RESOLVED' / 'DISMISSED') and event/account sanctions applied.",
    priority: "High",
    frequency: "Regular",
    normalCourse: [
      { actor: "Maintainer navigates to '/admin/reports'.", system: "Queries `reports` where `status = 'PENDING'` joined with events and users." },
      { actor: "Maintainer reviews evidence and selects 'Take Down Event'.", system: "Sets `events.status = 'CANCELLED'`, updates `reports.status = 'RESOLVED'`, and logs in `activity_logs`." }
    ],
    alternatives: "2a. False Alarm: Maintainer marks report as 'DISMISSED' with explanatory note.",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Protects community from secondary ticketing scams."
  },

  // ==========================================
  // MODULE 5: AUTONOMOUS VERIFICATION ENGINE
  // ==========================================
  {
    id: "AV01",
    name: "Audit Whitelisted Ticketing Domain",
    actors: "Autonomous Verification Engine",
    description: "Inspects submitted ticketing URL against verified whitelist of authorized Malaysian ticketing distributors (BookMyShow, GoLive Asia, Ticket2U, BigTix).",
    preconditions: "Organizer submits or edits event listing.",
    postconditions: "Ticketing whitelist score computed (Passed: 10 pts, Failed: 0 pts).",
    priority: "High",
    frequency: "Every submission/edit",
    normalCourse: [
      { actor: "Engine parses domain hostname from submitted ticket_url.", system: "Compares hostname against verified ticketing provider registry." },
      { actor: "Engine confirms partner match.", system: "Awards 10 points and sets official_ticketing_channel = true." }
    ],
    alternatives: "1a. Free Event: Bypasses ticketing domain penalty.",
    exceptions: "E1: Malformed URL syntax. Marks check as failed.",
    includes: "Not Applicable",
    notes: "Hard gate against secondary scam ticketing sites."
  },
  {
    id: "AV02",
    name: "Resolve Evidence URL & Readability",
    actors: "Autonomous Verification Engine",
    description: "Executes real-time HTTP fetch to verify that organizer evidence announcement URL is reachable, returns HTTP 200 OK, and contains readable text.",
    preconditions: "Organizer provides evidence URL.",
    postconditions: "URL reachability verified (12 pts) and readability evaluated (up to 18 pts).",
    priority: "High",
    frequency: "Every submission/edit",
    normalCourse: [
      { actor: "Engine dispatches HTTP GET request with 5000ms timeout.", system: "Verifies HTTP 200 OK status code." },
      { actor: "Engine measures readable text byte length.", system: "If text > 200 characters, awards readability points; if < 100 characters, flags as JS shell warning." }
    ],
    alternatives: "1a. HTTP 404 / 500 / Timeout: Awards 0 points and flags hard gate failure.",
    exceptions: "E1: SSL error. Marks link as unverified.",
    includes: "Not Applicable",
    notes: "Ensures evidence is real and verifiable."
  },
  {
    id: "AV03",
    name: "Verify Date & Time Validity",
    actors: "Autonomous Verification Engine",
    description: "Verifies event start date and end date are structurally valid, chronological, and scheduled in the future.",
    preconditions: "Event submission contains date values.",
    postconditions: "Date validity check recorded (Passed: 6 pts, Failed: 0 pts).",
    priority: "High",
    frequency: "Every submission/edit",
    normalCourse: [
      { actor: "Engine parses start_date and end_date against ISO 8601 format.", system: "Verifies start_date >= CURRENT_DATE." },
      { actor: "Engine confirms chronological consistency.", system: "Awards 6 points upon successful validation." }
    ],
    alternatives: "1a. Past Date: Flags as expired and withholds points.",
    exceptions: "E1: Unparseable date string. Rejects submission with validation error.",
    includes: "Not Applicable",
    notes: "Enforces temporal consistency across platform."
  },
  {
    id: "AV04",
    name: "Check Duplicate Event Listings",
    actors: "Autonomous Verification Engine",
    description: "Scans active event catalog to identify potential duplicate listings based on fuzzy matching of artist, venue, and show date.",
    preconditions: "New listing is submitted.",
    postconditions: "Duplicate gate evaluated (No duplicates: Passed, Duplicate found: Hard Gate Failure).",
    priority: "High",
    frequency: "Every submission",
    normalCourse: [
      { actor: "Engine queries active events sharing the same start_date.", system: "Computes Levenshtein distance on title, artist, and venue." },
      { actor: "Engine confirms similarity score < 60%.", system: "Marks check as Passed." }
    ],
    alternatives: "1a. Similarity > 85% and venue matches: Flags as Duplicate Listing and blocks autonomous publishing.",
    exceptions: "Not Applicable",
    includes: "Not Applicable",
    notes: "Eliminates multiple clutter submissions for the same concert."
  },
  {
    id: "AV05",
    name: "Multimodal OCR Vision Extraction",
    actors: "Autonomous Verification Engine, OpenRouter Gemini 4 Argon",
    description: "Calls OpenRouter Gemini 4 Argon (google/gemini-4-argon) with official tour poster to extract structured concert metadata (title, artist, venue, date).",
    preconditions: "Valid poster image URL provided.",
    postconditions: "Structured JSON metadata extracted and used to populate/verify listing fields.",
    priority: "High",
    frequency: "Upon poster upload or AI extract request",
    normalCourse: [
      { actor: "Engine sends POST to OpenRouter API (model: 'google/gemini-4-argon', poster URL).", system: "Parses structured JSON response (artist, tour title, venue, date, city)." },
      { actor: "Engine compares extracted values with input fields.", system: "Calculates poster match fidelity and pre-fills form fields for organizer review." }
    ],
    alternatives: "1a. Rate limit / Outage: Fails over to Google Gemma 2 or fallback regex OCR service.",
    exceptions: "E1: Image inaccessible. Reports download error.",
    includes: "Not Applicable",
    notes: "Powered by user's OpenRouter Gemini 4 Argon endpoint."
  },
  {
    id: "AV06",
    name: "Cross-Model AI Consensus Audit",
    actors: "Autonomous Verification Engine, Gemini 4 Argon, Gemma, Local Heuristics",
    description: "Synthesizes verification judgments across OpenRouter Gemini 4 Argon, local heuristic rule engines, and web matchers to produce an indisputable consensus score.",
    preconditions: "Evidence URL and listing metadata compiled.",
    postconditions: "AI Consensus check evaluated (Passed: 22 pts, Failed: 0 pts); diagnostic telemetry recorded.",
    priority: "High",
    frequency: "Every submission",
    normalCourse: [
      { actor: "Engine evaluates evidence page content using primary AI model (google/gemini-4-argon).", system: "Computes local token match score across Title (30%), Artist (30%), Venue (20%), City (20%)." },
      { actor: "Engine aggregates votes across models.", system: "If consensus reached, awards 22 points, sets ai_consensus='PASSED', and stores telemetry in verification_details JSON." }
    ],
    alternatives: "1a. Cloud Model Offline: Uses local fallback token matching; awards partial credit if match >= 80%.",
    exceptions: "E1: API quota exhausted. Logs error and serves local explanation in breakdown modal.",
    includes: "Not Applicable",
    notes: "Eliminates single-model hallucination or bias."
  }
];

async function generateSRS() {
  console.log("Generating Complete Redesigned Academic SRS Document (.docx)...");

  const allChildren = [
    // COVER / TITLE
    createTitle("K-Sync Malaysia: Complete Software Requirements Specification (SRS)"),
    new Paragraph({
      children: [
        new TextRun({
          text: "Final Year Project (FYP) — Chapter 3: System Use Case Specifications (All 42 Use Cases)",
          bold: true,
          color: COLOR_ACCENT,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }),

    createCallout(
      "Supervisor Directives & Architectural Model Conformance:",
      "This document formalizes the complete technical specification for K-Sync Malaysia, strictly conforming to the supervisor's core directives: (1) Zero manual admin event approval queues via the Autonomous Verification Engine, (2) No anonymous guest event submissions, (3) Pure business use cases with technical Login/Logout excluded, (4) Explicit modeling of interactive outbound buttons (Ticket Link, Map, Share, Socials, Calendar Export), and (5) Anti-scalper discussion immutability (zero editing allowed to prevent ticket scalping fraud)."
    ),

    new Paragraph({ spacing: { after: 200 } }),

    createH1("1. System Overview & Actor Catalog"),
    createP(
      "K-Sync Malaysia operates across four defined Human Actors and one Autonomous Application Engine:"
    ),
    createBullet("Guest (Unauthenticated Public Visitor): Public discovery, directory search, radar precinct clustering, idol profiles, and outbound handshakes."),
    createBullet("Fan (Authenticated Member): Personalized 'My K-Sync' command center, wishlist, crowdsourced reliability upvoting, immutable 1-level discussions, and notifications."),
    createBullet("Organizer / Submitter (Authenticated Event Host): Event publishing with OpenRouter Gemini 4 Argon Vision OCR, 14-point verification breakdowns, and logistical broadcasts."),
    createBullet("System Maintainer (Platform Administrator): Master taxonomies (Venues, Artists, Categories), scam report audits, and platform overrides."),
    createBullet("Autonomous Verification Engine (Application Engine): Whitelist domain checks, URL reachability tests, date validity, duplicate detection, multimodal OCR vision, and AI consensus scoring."),

    new Paragraph({ spacing: { after: 200 } }),
    createH1("2. Use Case Distribution Across Modules (42 Total)"),
    createBullet("Module 1: Public Discovery & Outbound Experience (UC001 – UC014: 14 Use Cases)"),
    createBullet("Module 2: Personal Management & Community Validation (UC015 – UC025: 11 Use Cases)"),
    createBullet("Module 3: Event Publishing & Verification (UC026 – UC031: 6 Use Cases)"),
    createBullet("Module 4: Platform Governance & Stewardship (UC032 – UC036: 5 Use Cases)"),
    createBullet("Module 5: Autonomous Verification Engine (AV01 – AV06: 6 Use Cases)"),

    new Paragraph({ spacing: { after: 300 } }),
    createH1("3. Detailed Use Case Specifications (Formal Tables)")
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
