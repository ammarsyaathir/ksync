// generate_use_case_descriptions_doc.js
import fs from 'fs';
import path from 'path';
import { useCases } from './generate_use_case_html.js';

let md = `# K-Sync Malaysia: Complete Use Case Descriptions (All 30 Use Cases)

**Project Title:** K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions  
**Document Type:** Detailed Software Requirements Specification (SRS) — Use Case Descriptions  
**Total Use Cases:** 30 Core Use Cases across 8 Functional Modules  
**Actors:** 3 Human Actors (\`Fan / Guest\`, \`Organizer / Submitter\`, \`System Administrator\`)  
**Scope Status:** Fully verified and backed by active routes in the codebase.

---

## Table of Contents

- [1. System Actors & Role Definitions](#1-system-actors--role-definitions)
- [2. Master Use Case Summary Table](#2-master-use-case-summary-table)
- [3. Detailed Use Case Descriptions](#3-detailed-use-case-descriptions)
${useCases.map(uc => `  - [${uc.id}: ${uc.name}](#${uc.id.toLowerCase()}-${uc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')})`).join('\n')}
- [4. Role-Based Access Control (RBAC) Matrix](#4-role-based-access-control-rbac-matrix)
- [5. Requirements-to-Code Traceability](#5-requirements-to-code-traceability)
- [6. Strict Academic Exclusions & Scope Boundaries](#6-strict-academic-exclusions--scope-boundaries)

---

## 1. System Actors & Role Definitions

| Actor | Category | Role Description & Permitted Scope |
| :--- | :--- | :--- |
| **Fan / Guest** | Primary Human Actor | Unifies unauthenticated visitors and authenticated fans under one community persona:<br>• **As Guest (Public):** Browse, search, filter, view event details dossiers, and share events (WhatsApp, X, Telegram, Copy Link).<br>• **As Authenticated Fan:** Register account, log in (Email / Google Sign-In), manage profile, save/unsave events, view saved events, create discussion comments, reply to comments (1-level nested), delete own comments, and report suspicious events. |
| **Organizer / Submitter** | Public Submitter (Model 2) | Event promoters, fanclub representatives, or fans submitting Malaysian K-pop events **without requiring an organizer account**:<br>• Submits event details, schedule, venue, posters, and mandatory evidence URLs.<br>• Receives and tracks progress using a unique 6-character random tracking code (e.g. \`KS-2026-7F3K9Q\`).<br>• Corrects and resubmits rejected or pending submissions. |
| **System Administrator** | Platform Authority | Sole administrative and moderation authority:<br>• Inspects review queue, verifies evidence links against official sources, and approves/publishes events with trust badges (\`OFFICIAL\` vs \`COMMUNITY\`).<br>• Rejects submissions with mandatory documented justification and email feedback.<br>• Manages verified organizer credentials.<br>• Edits published event details, updates event lifecycle status, and unpublishes/deletes events.<br>• Maintains taxonomies (Categories, Venues, Artists, and Idol Member Profiles).<br>• Moderates community discussions (deletes any comment) and investigates user reports. |

---

## 2. Master Use Case Summary Table

| Use Case ID | Use Case Name | Module | Primary Actor | Implementation Route |
| :--- | :--- | :--- | :--- | :--- |
${useCases.map(uc => `| **${uc.id}** | ${uc.name} | ${uc.module} | ${uc.primaryActor} | \`${uc.route.split(',')[0]}\` |`).join('\n')}

---

## 3. Detailed Use Case Descriptions

`;

useCases.forEach((uc, idx) => {
  md += `### ${uc.id}: ${uc.name}

| Specification Field | Description & Details |
| :--- | :--- |
| **Use Case ID** | **${uc.id}** |
| **Use Case Name** | **${uc.name}** |
| **Module** | **${uc.module}** |
| **Primary Actor** | **${uc.primaryActor}** |
| **Secondary Actors** | ${uc.secondaryActors} |
| **Short Purpose** | ${uc.purpose} |
| **Trigger** | ${uc.trigger} |
| **Preconditions** | ${uc.preconditions} |
| **Postconditions (Success)** | ${uc.postconditions} |
| **Business Rules & Security** | ${uc.rules} |
| **Implemented Route(s)** | \`${uc.route}\` |

#### Main Success Scenario (Basic Flow)
${uc.basicFlow.map((step, sIdx) => `${sIdx + 1}. ${step}`).join('\n')}

#### Alternative & Exceptional Flows
${uc.altFlows.map(alt => `- **${alt.split(':')[0]}:** ${alt.split(':').slice(1).join(':').trim()}`).join('\n')}

---

`;
});

md += `## 4. Role-Based Access Control (RBAC) Matrix

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
${useCases.map(uc => {
  const view = uc.route.includes('/admin') ? 'views/admin/*' : (uc.route.includes('submit') ? 'views/submit-event.ejs' : (uc.route.includes('events/:') ? 'views/event-details.ejs' : 'views/*'));
  const table = uc.module.includes('Account') ? 'users' : (uc.module.includes('Discussion') ? 'event_chat_messages' : (uc.module.includes('Moderation') ? 'reports' : (uc.module.includes('Saved') ? 'saved_events' : 'events, artists, venues')));
  return `| **${uc.id}** | ${uc.name} | ${uc.primaryActor} | \`${uc.route}\` | \`${view}\` | \`${table}\` |`;
}).join('\n')}

---

## 6. Strict Academic Exclusions & Scope Boundaries

The following features are strictly excluded from the assessed system to maintain rigorous FYP scope integrity:
1. **Ticket Booking / Payment Processing:** Outbound ticketing URLs redirect users to official vendors (e.g. GoLive, Ticket2U). K-Sync does not process payments or manage seat selections.
2. **Merchandise Sales / Stock Tracking:** No shopping cart or physical product inventory.
3. **Event Buddy Matching:** Explicitly removed from project requirements.
4. **Internal Background Processes:** Automated transactional email dispatch and activity logging operate internally and are excluded from human actor use cases.

---
*K-Sync Malaysia &copy; 2026/2027. Final Year Project System Specification Report.*
`;

fs.writeFileSync(path.resolve('docs/use_case_descriptions.md'), md);
console.log('Successfully wrote docs/use_case_descriptions.md! Length:', md.length);
