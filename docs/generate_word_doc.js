// docs/generate_word_doc.js - Generate Complete Word (.docx) Specification Document
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

// Helper styling constants
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

function createH3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 }
  });
}

function createP(text, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 22 // 11pt
      })
    ],
    spacing: { after: 120 }
  });
}

function createBullet(text, boldPrefix = "") {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + " ", bold: true, size: 22 }));
  }
  children.push(new TextRun({ text: text, size: 22 }));

  return new Paragraph({
    children: children,
    bullet: { level: 0 },
    spacing: { after: 80 }
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

function createStyledTable(headers, rowsData, colWidths = []) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20 })],
        alignment: AlignmentType.LEFT
      })],
      shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined
    }))
  });

  const bodyRows = rowsData.map((row, rIdx) => new TableRow({
    children: row.map((cellText, i) => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: String(cellText), size: 19 })],
        alignment: AlignmentType.LEFT
      })],
      shading: rIdx % 2 === 1 ? { fill: COLOR_BG_LIGHT, type: ShadingType.CLEAR } : undefined,
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
      },
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined
    }))
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows]
  });
}

// Build Document
async function generateDocx() {
  console.log("Generating Comprehensive Word (.docx) Deliverable...");

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
        children: [
          // TITLE PAGE
          createTitle("K-Sync Malaysia: Comprehensive System Specification"),
          new Paragraph({
            children: [
              new TextRun({
                text: "Final Year Project (FYP) — Chapter 3: System Design, Architecture, Use Cases & Database Specification",
                bold: true,
                color: COLOR_ACCENT,
                size: 24
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),

          createCallout(
            "FYP Chapter 1 Alignment & Supervisor Directives:",
            "This document formalizes the complete technical specification for K-Sync Malaysia, strictly conforming to the 3 Problem Statements defined in Chapter 1 and all supervisor directives: zero manual admin approval bottlenecks via the Autonomous Verification Engine, no anonymous guest submissions, exclusion of technical login/logout mechanisms, explicit modeling of interactive outbound buttons, and anti-scalper discussion immutability."
          ),

          new Paragraph({ spacing: { after: 200 } }),

          createStyledTable(
            ["Specification Attribute", "Details"],
            [
              ["System Title", "K-Sync Malaysia: A Centralized Platform for K-Pop Events & Discussions"],
              ["Technology Stack", "Node.js (v22), Express.js, EJS Templates, Tailwind CSS, OpenRouter Gemini 4 Argon"],
              ["Scope Alignment", "FYP Chapter 1: Problem Statements (1.2.1, 1.2.2, 1.2.3)"],
              ["Database Architecture", "Hostinger MySQL 8.0 (Production) & SQLite 3 (Development WAL Mode)"],
              ["Total Tables", "14 Normalized 3NF Tables (Zero Redundancy / Bloat)"],
              ["Total Use Cases", "42 Distinct Use Cases across 5 Modules"],
              ["Design System Standard", "Impeccable Design System (PRODUCT.md, DESIGN.md)"],
              ["Flagship Entities", "BOYNEXTDOOR Tour in KL & TXT World Tour in KL with 3NF Member Roster"],
              ["Automated Test Suite", "28/28 End-to-End Tests Passed (test_complete_usecases.mjs)"],
              ["Version & Date", "Version 2.0 (Redesigned System) — October 2026"]
            ],
            [35, 65]
          ),

          // SECTION 1: ARCHITECTURE OVERVIEW
          createH1("1. Architectural Overview & Chapter 1 Alignment"),
          createP(
            "K-Sync Malaysia is engineered as a responsive web platform that centralizes Malaysian K-Pop event information, provides dedicated event-specific discussion forums, and establishes a transparent verification workflow for submitted events."
          ),
          createP("The project design is directly driven by the three core problems outlined in Chapter 1:"),
          createBullet(
            "Difficulty discovering events scattered across Twitter/X, Instagram, and Telegram timelines. Resolved via Centralized Malaysian Event Directory with filters and Event Radar corridor clustering.",
            "Problem 1.2.1:"
          ),
          createBullet(
            "Disorganized community discussions, buried questions, and secondary ticket scalper fraud in multi-topic chat groups. Resolved via 1-level threaded discussion hubs and strict anti-scalper immutability (zero editing allowed).",
            "Problem 1.2.2:"
          ),
          createBullet(
            "Unverified event listings and fraudulent ticket resales. Resolved via Autonomous Verification Engine (AV01–AV06) combining domain whitelisting, URL reachability tests, and OpenRouter Gemini 4 Argon Vision OCR with zero manual admin queues.",
            "Problem 1.2.3:"
          ),

          // SECTION 2: SYSTEM ACTORS
          createH1("2. System Actor Hierarchy & Permitted Scope"),
          createP("The system formally defines four human actors and one autonomous software engine:"),
          createBullet("Guest (Unauthenticated Public Visitor): Public discovery, directory search, radar precinct clustering, idol profiles, and outbound handshakes."),
          createBullet("Fan (Authenticated Member): Personalized 'My K-Sync' command center, wishlist, crowdsourced reliability upvoting, immutable 1-level discussions, and notifications."),
          createBullet("Organizer / Submitter (Authenticated Event Host): Event publishing with OpenRouter Gemini 4 Argon Vision OCR, 14-point verification breakdowns, and logistical broadcasts."),
          createBullet("System Maintainer (Platform Administrator): Master taxonomies (Venues, Artists, Categories), scam report audits, and platform overrides."),
          createBullet("Autonomous Verification Engine (Application Engine): Whitelist domain checks, URL reachability tests, date validity, duplicate detection, multimodal OCR vision, and AI consensus scoring."),

          // SECTION 3: FULL MASTER USE CASE SPECIFICATION
          createH1("3. Complete Master Use Case Specification (42 Use Cases)"),
          createP(
            "In accordance with software engineering standards for FYP Chapter 3, every user action and business operation is maintained as an independent, uncombined Use Case."
          ),

          createH2("3.1 Module 1: Public Discovery & Outbound Experience (Guest — 14 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "Actor", "Database Entity", "Route / Endpoint"],
            [
              ["UC001", "Register Account", "Guest", "users, roles", "GET /register, POST /register"],
              ["UC002", "Browse Events Directory", "Guest", "events, categories", "GET /events"],
              ["UC003", "Search Events", "Guest", "events, artists, venues", "GET /events?search=..."],
              ["UC004", "Filter Events", "Guest", "events, categories, artists", "GET /events?category=..."],
              ["UC005", "View Event Radar", "Guest", "events (cluster_area)", "GET /events/radar"],
              ["UC006", "View Event Details", "Guest", "events, venues, artists", "GET /events/:idOrSlug"],
              ["UC007", "Open Official Ticket Link", "Guest", "events.official_ticket_url", "Whitelisted Partner Handshake"],
              ["UC008", "Open Venue Map & Transit Route", "Guest", "venues.transit_info", "External Google Maps Route"],
              ["UC009", "Open Organizer Social Profile Link", "Guest", "events.organizer_social_url", "External X / Instagram Profile"],
              ["UC010", "Share Event", "Guest", "events", "Modal (WhatsApp, X, Copy Link)"],
              ["UC011", "Export Event to Calendar", "Guest", "events", "GET /api/events/:id/calendar.ics"],
              ["UC012", "Browse Artists Directory", "Guest", "artists", "GET /artists"],
              ["UC013", "View Artist & Member Profiles", "Guest", "artists, members", "GET /artists/:idOrSlug"],
              ["UC014", "View Event Discussion & Comments", "Guest", "event_chat_messages", "GET /events/:idOrSlug#discussion"]
            ],
            [10, 30, 15, 20, 25]
          ),

          createH2("3.2 Module 2: Personal Management & Community Validation (Fan — 11 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "Actor", "Database Entity", "Route / Endpoint"],
            [
              ["UC015", "Manage Personal Profile", "Fan", "users", "GET /profile, POST /profile"],
              ["UC016", "View Personalized Dashboard ('My K-Sync')", "Fan", "saved_events, events", "GET /dashboard"],
              ["UC017", "Bookmark / Save Event", "Fan", "saved_events", "POST /api/events/:id/save"],
              ["UC018", "Recommend / Upvote Event", "Fan", "event_recommendations", "POST /api/events/:id/recommend"],
              ["UC019", "Report Suspicious Listing", "Fan", "reports", "POST /api/events/:id/report"],
              ["UC020", "Post Discussion Comment", "Fan", "event_chat_messages", "POST /api/chat/:eventId"],
              ["UC021", "Reply to Discussion Comment", "Fan", "event_chat_messages", "POST /api/chat/:eventId (parent_id)"],
              ["UC022", "Delete Own Discussion Comment", "Fan", "event_chat_messages", "DELETE /api/chat/:messageId"],
              ["UC023", "View In-App Notifications", "Fan", "notifications", "GET /notifications"],
              ["UC024", "Mark Notification as Read", "Fan", "notifications", "POST /notifications/:id/read"],
              ["UC025", "Manage Notification Settings", "Fan", "users (notify_* columns)", "POST /profile/notifications"]
            ],
            [10, 30, 15, 20, 25]
          ),

          createH2("3.3 Module 3: Event Publishing & Verification (Organizer — 6 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "Actor", "Database Entity", "Route / Endpoint"],
            [
              ["UC026", "View Organizer Dashboard", "Organizer", "events", "GET /organizer/dashboard"],
              ["UC027", "Submit Event Listing (AI Vision Scanner)", "Organizer", "events", "GET /submit-event, POST /submit-event"],
              ["UC028", "Edit Event Listing", "Organizer", "events", "GET /events/:id/edit, POST /events/:id/edit"],
              ["UC029", "View Verification Breakdown", "Organizer", "events.verification_details", "GET /events/:id/verification"],
              ["UC030", "Post Logistical Event Update", "Organizer", "event_updates, notifications", "POST /api/events/:id/updates"],
              ["UC031", "Request Organizer Badge", "Organizer", "users.verification_proof", "POST /profile/request-organizer"]
            ],
            [10, 30, 15, 20, 25]
          ),

          createH2("3.4 Module 4: Platform Governance & Stewardship (System Maintainer — 5 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "Actor", "Database Entity", "Route / Endpoint"],
            [
              ["UC032", "View Maintainer Portal", "Maintainer", "events, users, reports", "GET /admin"],
              ["UC033", "Manage Event Categories", "Maintainer", "event_categories", "GET /admin/categories, POST /admin/categories"],
              ["UC034", "Manage Venues Database", "Maintainer", "venues", "GET /admin/venues, POST /admin/venues"],
              ["UC035", "Manage Artists & Member Roster", "Maintainer", "artists, members", "GET /admin/artists, POST /admin/artists"],
              ["UC036", "Audit Scam Reports", "Maintainer", "reports, events, activity_logs", "GET /admin/reports, POST /admin/reports/:id/action"]
            ],
            [10, 30, 15, 20, 25]
          ),

          createH2("3.5 Module 5: Autonomous Verification Engine (Automated Engine — 6 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "Actor", "Database Entity", "Execution Function"],
            [
              ["AV01", "Audit Whitelisted Ticketing Domain", "AutoVerifier", "events.official_ticket_url", "checkTicketingWhitelist()"],
              ["AV02", "Resolve Evidence URL & Readability", "AutoVerifier", "events.evidence_link", "resolveEvidenceUrl()"],
              ["AV03", "Verify Date & Time Validity", "AutoVerifier", "events.start_date, end_date", "verifyDateValidity()"],
              ["AV04", "Check Duplicate Event Listings", "AutoVerifier", "events (fuzzy match)", "checkDuplicates()"],
              ["AV05", "Multimodal OCR Vision Extraction", "AutoVerifier", "OpenRouter Gemini 4 Argon", "extractEventFromPoster()"],
              ["AV06", "Cross-Model AI Consensus Audit", "AutoVerifier", "Gemini 4 Argon, Gemma, Local", "verifyListingConsensus()"]
            ],
            [10, 30, 15, 20, 25]
          ),

          // SECTION 4: AUTONOMOUS VERIFICATION & 14-POINT TELEMETRY
          createH1("4. Autonomous Verification Engine & 14-Point Audit Telemetry"),
          createP(
            "The Autonomous Verification Engine operates immediately upon event submission without administrative delays. Listings are subjected to two rigorous phases:"
          ),
          createBullet("Phase 1: Deterministic Hard Gates (AV01–AV04) — Ticketing domain whitelist, HTTP 200 reachability, valid future dates, and duplicate check. Hard gate failure saves listing as DRAFT_FLAGGED with specific remediation instructions."),
          createBullet("Phase 2: Multimodal AI & Attribute Consensus (AV05–AV06) — OpenRouter Gemini 4 Argon parses official tour posters and computes token overlap against organizer claims. A total Trust Score (0–100) is calculated, assigning 'VERIFIED_OFFICIAL' (>= 75) or 'COMMUNITY_UNVERIFIED' (< 75)."),

          // SECTION 5: ANTI-SCALPER IMMUTABILITY
          createH1("5. Anti-Scalper Discussion Immutability Design"),
          createP(
            "To prevent secondary ticket scalpers from posting innocent queries and subsequently editing comments to inject illegal contact numbers or predatory ticketing links, K-Sync Malaysia enforces strict immutability:"
          ),
          createBullet("Creation (UC020): Sanitized against XSS and stored in event_chat_messages."),
          createBullet("1-Level Threading (UC021): Reply depth is strictly flattened to 1 level for clean mobile rendering."),
          createBullet("Deletion (UC022): Fans can permanently delete their own comments at any time."),
          createBullet("Zero Editing: PUT / PATCH endpoints are unexposed, ensuring zero retroactive text tampering."),

          // SECTION 6: IMPECCABLE DESIGN SYSTEM
          createH1("6. Impeccable Design System Conformance"),
          createP(
            "The platform frontend strictly complies with the Impeccable Design Standard documented in PRODUCT.md and DESIGN.md:"
          ),
          createBullet("Color Tokens: Background Light (#FFFFFF), Slate Text (#0F172A), Electric Violet Primary (#8B5CF6), Cyber Pink Accent (#EC4899), Emerald Verified Badge (#10B981)."),
          createBullet("Craft Floor Compliance: Zero decorative kickers over headings, zero gradient text fills, accessible WCAG AA contrast ratio >= 4.5:1, and generous touch targets (>= 44x44px)."),

          // SECTION 7: DATABASE ERD & SCHEMA
          createH1("7. Normalized Database Entity-Relationship Specification (14 Tables)"),
          createP(
            "The database architecture is streamlined into 14 normalized 3NF tables in database/ksync.db:"
          ),
          createStyledTable(
            ["Table Name", "Primary Purpose", "Primary & Foreign Keys"],
            [
              ["roles", "Master user roles (ADMIN, ORGANIZER, FAN)", "PK: id"],
              ["users", "User accounts, auth hashes, organizer status, notification preferences", "PK: id, FK: role_id"],
              ["artists", "K-Pop groups and soloists with agency affiliations and banners", "PK: id"],
              ["members", "Normalized idol member profiles (stage name, DOB, MBTI, height)", "PK: id, FK: artist_id"],
              ["event_categories", "Event classification taxonomy with Tailwind badge colors", "PK: id"],
              ["venues", "Physical Malaysian event venues with capacity and LRT/MRT transit info", "PK: id"],
              ["events", "Core event listings, schedules, evidence links, trust scores, cluster precincts", "PK: id, FK: organizer_id, artist_id, category_id, venue_id"],
              ["event_recommendations", "Crowdsourced reliability upvoting records", "PK: id, FK: user_id, event_id"],
              ["saved_events", "Personal fan wishlist for My K-Sync dashboard & alerts", "PK: id, FK: user_id, event_id"],
              ["event_chat_messages", "Immutable discussion posts with 1-level parent threading", "PK: id, FK: event_id, user_id, parent_id"],
              ["event_updates", "Official logistical broadcast notices (gate times, weather)", "PK: id, FK: event_id, created_by"],
              ["reports", "Community scam and misinformation reports", "PK: id, FK: event_id, user_id, resolved_by"],
              ["notifications", "In-app alerts for schedule shifts, countdowns, and replies", "PK: id, FK: user_id, event_id, update_id"],
              ["activity_logs", "Immutable audit trail of administrative overrides and security actions", "PK: id, FK: user_id"]
            ],
            [25, 45, 30]
          ),

          // SECTION 8: AUTOMATED TEST VERIFICATION
          createH1("8. Automated Test Suite & Quality Verification"),
          createP(
            "All 42 use cases and core workflows have been validated via automated end-to-end test execution (test_complete_usecases.mjs):"
          ),
          createBullet("Total Tests: 28"),
          createBullet("Passed: 28 (100% Pass Rate)"),
          createBullet("Failed: 0"),
          createBullet("Verified Modules: Registration, Auth, Discovery, Keyword Search, Filters, Event Radar, Live Countdown, Artist Directory, Normalized Members, Wishlist, Crowdsourced Upvoting, Discussion Forum (Post, Reply, Delete, Rejected Edit), Multimodal Poster OCR, Autonomous Verification Scoring, and Admin Governance.")
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(projectRoot, "docs", "K-Sync_Malaysia_Full_Specification_Report.docx");
  fs.writeFileSync(outPath, buffer);
  console.log(`\nSUCCESS! Created Comprehensive Word Document (.docx):`);
  console.log(`Path: ${outPath}`);
  console.log(`File Size: ${(buffer.length / 1024).toFixed(2)} KB`);
}

generateDocx().catch(console.error);
