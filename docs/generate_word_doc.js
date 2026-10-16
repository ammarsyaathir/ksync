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
                text: "Final Year Project (FYP) — Chapter 3: System Design, Full Use Case Breakdown, Additional Features & Database Specification",
                bold: true,
                color: COLOR_ACCENT,
                size: 24
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),

          createCallout(
            "FYP Chapter 1 Alignment:",
            "This document formalizes the complete technical specification for K-Sync Malaysia, strictly conforming to the 3 Problem Statements and Proposed Solutions defined in Chapter 1. The database architecture is streamlined to 10 purposeful tables, covering 41 distinct uncombined Use Cases and all minor user-experience enhancements."
          ),

          new Paragraph({ spacing: { after: 200 } }),

          createStyledTable(
            ["Specification Attribute", "Details"],
            [
              ["System Title", "K-Sync Malaysia: A Centralized Platform for K-Pop Events & Discussions"],
              ["Technology Stack", "Node.js (v22), Express.js (v5), EJS Templates, Tailwind CSS"],
              ["Scope Alignment", "FYP Chapter 1: Introduction (Problem Statements 1.2.1, 1.2.2, 1.2.3)"],
              ["Database Support", "Hostinger MySQL 8.0 (Production) & SQLite 3 (Development)"],
              ["Total Tables", "10 Purposeful Tables (Zero Redundancy / Bloat)"],
              ["Total Use Cases", "41 Distinct Uncombined Use Cases (All CRUD Separated)"],
              ["Active Flagship Entity", "TXT World Tour in Kuala Lumpur (Ref: KS-2026-TXT001) with 5 Member Profiles"],
              ["Version & Date", "Version 1.0 (Clean Scope) — October 2026"]
            ],
            [35, 65]
          ),

          // SECTION 1: ARCHITECTURE OVERVIEW
          createH1("1. Architectural Overview & Chapter 1 Alignment"),
          createP(
            "K-Sync Malaysia is engineered as a responsive web application that centralizes Malaysian K-pop event information, provides dedicated event-specific discussion forums, and establishes a transparent verification workflow for submitted events."
          ),
          createP("The project design is directly driven by the three core problems outlined in Chapter 1:"),
          createBullet(
            "Difficulty discovering events scattered across Twitter/X, Instagram, and Telegram timelines. Resolved via Centralized Malaysian Event Directory with filters.",
            "Problem 1.2.1:"
          ),
          createBullet(
            "Disorganized community discussions, buried questions, and unverified rumors in multi-topic chat groups. Resolved via 24-hour event-locked discussion hubs and content reporting.",
            "Problem 1.2.2:"
          ),
          createBullet(
            "Unverified event listings and fraudulent ticket resales. Resolved via Model 2 public event submission, tracking codes, and administrator verification queues.",
            "Problem 1.2.3:"
          ),

          // SECTION 2: FULL MASTER USE CASE SPECIFICATION
          createH1("2. Complete Master Use Case Specification (41 Use Cases)"),
          createP(
            "In accordance with software engineering standards for FYP Chapter 3, every user action and CRUD operation (Create, Read, Update, Delete) is maintained as an independent, uncombined Use Case."
          ),

          createH2("2.1 Module 1: Authentication & User Profile Management (6 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "CRUD", "Actor", "Database Table", "Route / Screen"],
            [
              ["UC01", "Register New Fan Account", "CREATE", "Guest", "users, roles", "/register"],
              ["UC02", "Log In to Account", "READ / AUTH", "Fan / Admin", "users", "/login"],
              ["UC03", "Log Out of Account", "AUTH", "Fan / Admin", "Session", "/logout"],
              ["UC04", "View Profile Details", "READ", "Registered Fan", "users", "/profile"],
              ["UC05", "Update Profile Information", "UPDATE", "Registered Fan", "users", "/profile"],
              ["UC06", "Change Account Password", "UPDATE", "Registered Fan", "users", "/profile/change-password"]
            ],
            [10, 30, 15, 15, 15, 15]
          ),

          createH2("2.2 Module 2: Event Discovery & Information (6 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "CRUD", "Actor", "Database Table", "Route / Screen"],
            [
              ["UC07", "Browse Featured Upcoming Events", "READ", "Guest / Fan", "events, event_categories", "/ (Home)"],
              ["UC08", "Browse Complete Events Directory", "READ", "Guest / Fan", "events, event_categories", "/events"],
              ["UC09", "Search Events by Keyword", "READ", "Guest / Fan", "events, artists", "/events?search=..."],
              ["UC10", "Filter Events (Artist / Category / City)", "READ", "Guest / Fan", "events, artists, event_categories", "/events?..."],
              ["UC11", "View Event Details & Venue Info", "READ", "Guest / Fan", "events", "/events/:id"],
              ["UC12", "View Artist & Idol Member Biodata", "READ", "Guest / Fan", "artists (members JSON)", "/events/:id (Tab)"]
            ],
            [10, 30, 15, 15, 15, 15]
          ),

          createH2("2.3 Module 3: Public Event Submission & Tracking (3 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "CRUD", "Actor", "Database Table", "Route / Screen"],
            [
              ["UC13", "Submit Public Event Listing", "CREATE", "Guest / Organizer", "events (Status: PENDING)", "/submit-event"],
              ["UC14", "Track Submission Status by Code", "READ", "Guest / Organizer", "events", "/check-submission"],
              ["UC15", "Resubmit Rejected Event Listing", "UPDATE", "Guest / Organizer", "events (Reset to PENDING)", "/check-submission/resubmit"]
            ],
            [10, 30, 15, 15, 15, 15]
          ),

          createH2("2.4 Module 4: Fan Community, Live Chat & Bookmarks (8 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "CRUD", "Actor", "Database Table", "Route / Screen"],
            [
              ["UC16", "Bookmark Event (Save to Favorites)", "CREATE", "Registered Fan", "saved_events", "/api/events/:id/save"],
              ["UC17", "View Saved Events List", "READ", "Registered Fan", "saved_events, events", "/saved-events"],
              ["UC18", "Remove Event from Bookmarks", "DELETE", "Registered Fan", "saved_events", "/api/events/:id/save"],
              ["UC19", "View Event Discussion Live Chat", "READ", "Guest / Fan", "event_chat_messages", "/events/:id"],
              ["UC20", "Post Event Chat Message", "CREATE", "Registered Fan", "event_chat_messages", "/api/chat/:eventId"],
              ["UC21", "Submit Event Content Report", "CREATE", "Registered Fan", "reports", "/api/events/:id/report"],
              ["UC22", "View In-App Notifications", "READ", "Registered Fan", "notifications", "/notifications"],
              ["UC23", "Mark Notifications as Read", "UPDATE", "Registered Fan", "notifications", "/notifications/mark-all-read"]
            ],
            [10, 30, 15, 15, 15, 15]
          ),

          createH2("2.5 Module 5: Administrator Review & Moderation (7 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "CRUD", "Actor", "Database Table", "Route / Screen"],
            [
              ["UC24", "View Admin Dashboard & KPI Metrics", "READ", "Administrator", "events, users", "/admin"],
              ["UC25", "View Audit Activity Logs", "READ", "Administrator", "activity_logs", "/admin/logs"],
              ["UC26", "View Pending Verification Queue", "READ", "Administrator", "events (PENDING)", "/admin/verifications"],
              ["UC27", "Approve Event Submission Live", "UPDATE", "Administrator", "events, activity_logs", "/admin/verifications/approve-event"],
              ["UC28", "Reject Event Submission with Feedback", "UPDATE", "Administrator", "events, activity_logs", "/admin/verifications/reject-event"],
              ["UC29", "View Content Reports List", "READ", "Administrator", "reports, users, events", "/admin/reports"],
              ["UC30", "Resolve Content Report", "UPDATE", "Administrator", "reports", "/admin/reports/resolve"]
            ],
            [10, 30, 15, 15, 15, 15]
          ),

          createH2("2.6 Module 6: Administrator Catalog & System Entity CRUD (11 Use Cases)"),
          createStyledTable(
            ["UC ID", "Use Case Name", "CRUD", "Actor", "Database Table", "Route / Screen"],
            [
              ["UC31", "View All Events Management List", "READ", "Administrator", "events", "/admin/events"],
              ["UC32", "Update Event Listing Status", "UPDATE", "Administrator", "events", "/admin/events/update-status"],
              ["UC33", "Delete Event Listing", "DELETE", "Administrator", "events", "/admin/events/delete"],
              ["UC34", "View Event Categories", "READ", "Administrator", "event_categories", "/admin/categories"],
              ["UC35", "Create Event Category", "CREATE", "Administrator", "event_categories", "/admin/categories/add"],
              ["UC36", "Delete Event Category", "DELETE", "Administrator", "event_categories", "/admin/categories/delete"],
              ["UC37", "View Artist Catalog", "READ", "Administrator", "artists", "/admin/artists"],
              ["UC38", "Create Artist Profile with Biodata", "CREATE", "Administrator", "artists", "/admin/artists/add"],
              ["UC39", "Delete Artist Profile", "DELETE", "Administrator", "artists", "/admin/artists/delete"],
              ["UC40", "View Registered Users List", "READ", "Administrator", "users, roles", "/admin/users"],
              ["UC41", "Delete User Account", "DELETE", "Administrator", "users", "/admin/users/delete"]
            ],
            [10, 30, 15, 15, 15, 15]
          ),

          // SECTION 3: ADDITIONAL & MINOR USER FEATURES
          createH1("3. Additional & Minor Features Specification"),
          createP(
            "To elevate user engagement and practical utility during concert day, several targeted features were implemented on the event details interface without modifying or complicating the clean 10-table database schema."
          ),

          createH2("3.1 Interactive Venue Map in Browser"),
          createBullet(
            "An interactive Google Maps iframe is embedded directly inside the Event Summary sidebar card, pinpointing the exact venue coordinates (e.g. Zepp Kuala Lumpur at Mitsui Shopping Park LaLaport BBCC).",
            "Embedded Mapping:"
          ),
          createBullet(
            "Provides a direct link to launch Google Maps in full-screen mode for GPS turn-by-turn driving, walking, or transit navigation with zero external API key dependencies.",
            "Turn-by-Turn Navigation:"
          ),

          createH2("3.2 Real-Time Event Countdown Timer"),
          createBullet(
            "A dynamic, second-by-second countdown clock rendered inside a gradient glassmorphic hero banner.",
            "Live Precision Timer:"
          ),
          createBullet(
            "Displays Days, Hours, Minutes, and Seconds remaining until concert start time (e.g., 24 October 2026 @ 18:00). Automatically switches to 'Event Started / Live!' upon reaching zero.",
            "State Awareness:"
          ),

          createH2("3.3 Multi-Channel Event Share Modal"),
          createBullet(
            "On mobile devices (iOS/Android), clicking 'Share' seamlessly triggers the device's native Web Share API.",
            "Native Web Share:"
          ),
          createBullet(
            "On desktop browsers, opens an interactive modal featuring 1-click sharing to WhatsApp, X (Twitter), Telegram, Facebook, and a 1-click 'Copy Link' button with clipboard feedback.",
            "Social Channel Modals:"
          ),

          createH2("3.4 Concert Day Survival & Fan Prep Checklist"),
          createBullet(
            "Interactive 7-item checklist covering essential concert necessities: NRIC/Passport ID, E-Ticket Barcode, Official Lightstick & Spare AAA Batteries, Compact Bag (Max A4 size), Power Bank (<20k mAh), Comfortable Shoes, and Planned Transit Route.",
            "Prep Items:"
          ),
          createBullet(
            "Dynamic progress bar visually calculates percentage prepared (e.g. '5 / 7 Items Prepared - 71%').",
            "Live Visual Progress:"
          ),
          createBullet(
            "User checklist selections are automatically synchronized and persisted in the user's browser localStorage, surviving page refreshes without database overhead.",
            "Client Persistence:"
          ),

          createH2("3.5 1-Click Google Calendar Integration"),
          createBullet(
            "Action bar includes an 'Add to Calendar' button that dynamically constructs a pre-formatted Google Calendar event URL containing the event title, ISO date-time range, venue address, and description.",
            "One-Click Sync:"
          ),

          createH2("3.6 Official K-Sync Verification & Anti-Scam Reference Card"),
          createBullet(
            "Displays the unique alphanumeric tracking reference code (e.g., KS-2026-TXT001) alongside a 1-click clipboard copy button.",
            "Reference ID Pill:"
          ),
          createBullet(
            "Presents the official promoter verification badge alongside explicit advice cautioning fans against purchasing unauthorized resale tickets from unverified social media scalpers.",
            "Anti-Scalper Advisory:"
          ),

          createH2("3.7 Public Transit & Station Guidance Badge"),
          createBullet(
            "Highlights the nearest transit hub (Hang Tuah Station - LRT Ampang & Sri Petaling Lines / KL Monorail) with walking directions via covered LaLaport pedestrian walkways.",
            "Transit Navigation:"
          ),

          createH2("3.8 Floating Toast Notification System"),
          createBullet(
            "Provides immediate, non-intrusive animated toast notifications whenever a user copies event links or reference codes to their clipboard.",
            "Visual Feedback:"
          ),

          // SECTION 4: DATABASE SCHEMA & DATA DICTIONARY
          createH1("4. Database Schema & Data Dictionary"),
          createP(
            "The K-Sync Malaysia relational database is composed of exactly 10 tables, engineered for maximum performance, clean third normal form (3NF) relational integrity, and zero unnecessary complexity."
          ),

          createH2("4.1 Relational Cardinality & Multiplicity Matrix"),
          createStyledTable(
            ["#", "Parent Entity", "Child Entity", "Foreign Key Column", "Cardinality", "Relationship Description", "ON DELETE"],
            [
              ["1", "roles", "users", "users.role_id", "1 : N", "One role is assigned to zero or many users.", "RESTRICT"],
              ["2", "event_categories", "events", "events.category_id", "1 : N", "One category classifies zero or many events.", "RESTRICT"],
              ["3", "artists", "events", "events.artist_id", "1 : N", "One artist performs in zero or many events.", "SET NULL"],
              ["4", "users", "events", "events.organizer_id", "1 : N", "One organizer manages zero or many events.", "RESTRICT"],
              ["5", "users & events", "saved_events", "user_id, event_id", "M : N", "Many-to-Many resolved by associative table.", "CASCADE"],
              ["6", "events", "event_chat_messages", "event_id", "1 : N", "One event contains zero or many chat messages.", "CASCADE"],
              ["7", "users", "event_chat_messages", "user_id", "1 : N", "One registered fan authors zero or many chat messages.", "CASCADE"],
              ["8", "events", "reports", "reports.event_id", "1 : N", "One event can have zero or many content reports.", "CASCADE"],
              ["9", "users", "reports", "reports.user_id", "1 : N", "One user submits zero or many reports.", "SET NULL"],
              ["10", "users", "activity_logs", "activity_logs.user_id", "1 : N", "One admin triggers zero or many audit logs.", "SET NULL"],
              ["11", "users", "notifications", "notifications.user_id", "1 : N", "One user receives zero or many alerts.", "CASCADE"]
            ],
            [5, 15, 15, 18, 12, 25, 10]
          ),

          createH2("4.2 Complete Data Dictionary (10 Tables)"),

          createH3("Table 1: roles (RBAC Roles Table)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Surrogate primary key for role."],
              ["name", "VARCHAR(50)", "NO", "UK", "NULL", "Unique role title: Admin, Organizer, Fan."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Record initialization timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 2: users (User Accounts & Profiles)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique user identifier."],
              ["role_id", "INT", "NO", "FK", "3", "References roles(id). Default 3 = Fan."],
              ["full_name", "VARCHAR(100)", "NO", "-", "NULL", "Full display or legal name."],
              ["username", "VARCHAR(50)", "NO", "UK", "NULL", "Unique login username / handle."],
              ["email", "VARCHAR(100)", "NO", "UK", "NULL", "Unique email address for login."],
              ["password_hash", "VARCHAR(255)", "NO", "-", "NULL", "Bcrypt-hashed password string."],
              ["bio", "TEXT", "YES", "-", "NULL", "Fan bio or organization description."],
              ["profile_image", "VARCHAR(255)", "YES", "-", "NULL", "URL or uploaded path to avatar."],
              ["organization_name", "VARCHAR(150)", "YES", "-", "NULL", "Official organizer or fanclub name."],
              ["organization_type", "VARCHAR(50)", "YES", "-", "'Fanclub'", "Entity: Fanclub, Promoter, Agency."],
              ["social_handle", "VARCHAR(50)", "YES", "-", "NULL", "Official X / Instagram username."],
              ["social_url", "VARCHAR(255)", "YES", "-", "NULL", "Direct URL to official announcement page."],
              ["location", "VARCHAR(100)", "YES", "-", "'Kuala Lumpur'", "Malaysian city/state of the user."],
              ["status", "VARCHAR(20)", "YES", "-", "'ACTIVE'", "Account status: ACTIVE, SUSPENDED."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Registration timestamp."],
              ["updated_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Latest modification timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 3: artists (K-Pop Artists & Idol Biodata)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique artist catalog identifier."],
              ["name", "VARCHAR(100)", "NO", "-", "NULL", "Official artist/group name (e.g. TXT)."],
              ["group_type", "VARCHAR(50)", "YES", "-", "'Boy Group'", "Category: Boy Group, Girl Group, Soloist."],
              ["image_url", "VARCHAR(255)", "YES", "-", "NULL", "Header promotional group photo URL."],
              ["agency", "VARCHAR(100)", "YES", "-", "NULL", "Management entertainment agency."],
              ["description", "TEXT", "YES", "-", "NULL", "Career summary and artist biography."],
              ["members", "LONGTEXT (JSON)", "YES", "-", "NULL", "JSON array of idol biodatas (Yeonjun, Soobin, Beomgyu, Taehyun, HueningKai)."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Catalog creation timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 4: event_categories (Event Type Taxonomy)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique category identifier."],
              ["name", "VARCHAR(100)", "NO", "UK", "NULL", "Category title (Concert, Fan Meeting, Cupsleeve)."],
              ["slug", "VARCHAR(100)", "NO", "UK", "NULL", "URL slug for filtering (e.g. fan-meeting)."],
              ["badge_color", "VARCHAR(30)", "YES", "-", "'purple'", "Color tag for UI badges (purple, pink, rose)."],
              ["description", "TEXT", "YES", "-", "NULL", "Scope and definition of the event category."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Category establishment timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 5: events (Central Directory with Embedded Venue)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique event identifier."],
              ["organizer_id", "INT", "NO", "FK", "2", "References users(id) (Managing organizer)."],
              ["artist_id", "INT", "YES", "FK", "NULL", "References artists(id). Null if multiple."],
              ["category_id", "INT", "NO", "FK", "NULL", "References event_categories(id)."],
              ["event_name", "VARCHAR(200)", "NO", "-", "NULL", "Full official title of the Malaysian event."],
              ["description", "TEXT", "YES", "-", "NULL", "Itinerary, setlist highlights, soundcheck info."],
              ["event_date", "DATE", "NO", "-", "NULL", "Performance date (YYYY-MM-DD)."],
              ["start_time", "TIME", "NO", "-", "NULL", "Concert start time (HH:MM:SS)."],
              ["end_time", "TIME", "YES", "-", "NULL", "Estimated conclusion time (used for chat lock)."],
              ["venue_name", "VARCHAR(150)", "NO", "-", "NULL", "Embedded Venue Name (e.g. Zepp KL)."],
              ["address", "TEXT", "YES", "-", "NULL", "Embedded Street Address (e.g. LaLaport BBCC)."],
              ["city", "VARCHAR(100)", "NO", "-", "NULL", "Embedded City (e.g. Kuala Lumpur)."],
              ["state", "VARCHAR(100)", "NO", "-", "NULL", "Embedded State (e.g. W.P. Kuala Lumpur)."],
              ["ticket_info", "TEXT", "YES", "-", "NULL", "Ticket tiers, prices (VIP, CAT1, CAT2)."],
              ["event_rules", "TEXT", "YES", "-", "NULL", "Prohibited items, bag policies, queue rules."],
              ["official_url", "VARCHAR(255)", "YES", "-", "NULL", "Official verified ticketing link."],
              ["poster_image", "VARCHAR(255)", "YES", "-", "NULL", "Promotional poster image URL/file path."],
              ["event_status", "VARCHAR(30)", "YES", "-", "'UPCOMING'", "Status: UPCOMING, ONGOING, COMPLETED."],
              ["verification_status", "VARCHAR(30)", "YES", "-", "'PENDING'", "Review: PENDING, VERIFIED, REJECTED."],
              ["rejection_reason", "TEXT", "YES", "-", "NULL", "Admin recorded feedback if rejected."],
              ["tracking_code", "VARCHAR(50)", "YES", "UK", "NULL", "Public tracking code (KS-2026-TXT001)."],
              ["submitter_name", "VARCHAR(150)", "YES", "-", "NULL", "Name of the submitter/organizer."],
              ["submitter_email", "VARCHAR(150)", "YES", "-", "NULL", "Contact email for review notifications."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Submission timestamp."],
              ["updated_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Last modification timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 6: saved_events (Fan Bookmarks Bridge Table)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Surrogate primary key."],
              ["user_id", "INT", "NO", "FK", "NULL", "References users(id). Deleted on cascade."],
              ["event_id", "INT", "NO", "FK", "NULL", "References events(id). Deleted on cascade."],
              ["saved_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Bookmark timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 7: event_chat_messages (Live Event Discussion Hub)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique chat message identifier."],
              ["event_id", "INT", "NO", "FK", "NULL", "References events(id) to isolate by show."],
              ["user_id", "INT", "NO", "FK", "NULL", "References users(id) of message author."],
              ["message", "TEXT", "NO", "-", "NULL", "Sanitized message body text."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Message creation timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 8: reports (Community Content Flagging)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique report tracking identifier."],
              ["user_id", "INT", "YES", "FK", "NULL", "References users(id) (NULL if guest report)."],
              ["event_id", "INT", "YES", "FK", "NULL", "References events(id) being flagged."],
              ["report_type", "VARCHAR(50)", "YES", "-", "'EVENT'", "Type: EVENT, CHAT, SCAM."],
              ["reason", "VARCHAR(255)", "NO", "-", "NULL", "Reason: Inaccurate Date, Fake Link, Scalper."],
              ["details", "TEXT", "YES", "-", "NULL", "Supporting context or official links."],
              ["status", "VARCHAR(30)", "YES", "-", "'PENDING'", "Resolution: PENDING, RESOLVED."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Filing timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 9: activity_logs (Administrator Audit Trail)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique log identifier."],
              ["user_id", "INT", "YES", "FK", "NULL", "References users(id) of administrator."],
              ["action", "VARCHAR(50)", "NO", "-", "NULL", "Action code: APPROVE_EVENT, REJECT_EVENT."],
              ["target_type", "VARCHAR(50)", "YES", "-", "NULL", "Target entity: events, users, categories."],
              ["target_id", "INT", "YES", "-", "NULL", "Primary key of modified target record."],
              ["details", "TEXT", "YES", "-", "NULL", "Human-readable summary of action."],
              ["ip_address", "VARCHAR(50)", "YES", "-", "NULL", "Client IP address for security audit."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Action execution timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          createH3("Table 10: notifications (User & Organizer Alerts)"),
          createStyledTable(
            ["Column Name", "Data Type", "Null", "Key", "Default", "Description"],
            [
              ["id", "INT", "NO", "PK", "AUTO_INCREMENT", "Unique notification identifier."],
              ["user_id", "INT", "NO", "FK", "NULL", "References users(id) of recipient."],
              ["title", "VARCHAR(150)", "NO", "-", "NULL", "Notification headline banner."],
              ["message", "TEXT", "NO", "-", "NULL", "Detailed alert notification message."],
              ["link", "VARCHAR(255)", "YES", "-", "NULL", "Target route URL (e.g. /events/1)."],
              ["is_read", "TINYINT(1)", "YES", "-", "0", "Read flag: 0 = Unread, 1 = Read."],
              ["created_at", "DATETIME", "YES", "-", "CURRENT_TIMESTAMP", "Alert dispatch timestamp."]
            ],
            [20, 15, 10, 10, 15, 30]
          ),

          // SECTION 5: JSON SCHEMA
          createH1("5. JSON Column Specification: artists.members"),
          createP(
            "To prevent database bloat while fulfilling all user expectations for idol biodata, member profiles are serialized as structured JSON inside the artists.members column."
          ),
          createP("Sample 5-Member Payload for TOMORROW X TOGETHER (TXT):", true),
          createBullet("Choi Yeon-jun (Main Rapper, Main Dancer, Vocalist) - DOB: Sep 13, 1999 | MBTI: ENFP | Blood: A | Height: 181.5cm", "1. Yeonjun:"),
          createBullet("Choi Soo-bin (Leader, Vocalist, Rapper) - DOB: Dec 5, 2000 | MBTI: ISFP | Blood: A | Height: 185cm", "2. Soobin:"),
          createBullet("Choi Beom-gyu (Vocalist, Dancer, Center, Visual) - DOB: Mar 13, 2001 | MBTI: INFJ | Blood: AB | Height: 180cm", "3. Beomgyu:"),
          createBullet("Kang Tae-hyun (Main Vocalist, Dancer) - DOB: Feb 5, 2002 | MBTI: ESTP | Blood: A | Height: 177cm", "4. Taehyun:"),
          createBullet("Kai Kamal Huening (Main Vocalist, Dancer, Maknae) - DOB: Aug 14, 2002 | MBTI: ISTP | Blood: A | Height: 183cm", "5. HueningKai:")
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(projectRoot, "docs", "K-Sync_Malaysia_Full_Specification_Report.docx");
  fs.writeFileSync(outPath, buffer);
  console.log(`\nSUCCESS! Created Microsoft Word Document (.docx):`);
  console.log(`Path: ${outPath}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(2)} KB`);
}

generateDocx().catch(console.error);
