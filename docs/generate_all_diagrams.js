// docs/generate_all_diagrams.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Complete catalog of 47 Use Cases with detailed SSD & Activity Diagram specifications
const diagramCatalog = [
  // MODULE 1: AUTH & PROFILE
  {
    id: "UC01",
    name: "Register New Fan Account",
    actor: "Guest",
    module: "Module 1: Authentication & User Profile Management",
    ssd: {
      call1: "openRegisterPage()",
      resp1: "displayRegisterForm()",
      call2: "submitRegisterDetails(name, username, email, password)",
      self1: "validateRegisterData(email, username, password)",
      altCondition: "invalid data or existing email",
      altResp: "showValidationErrors(errors)",
      elseCondition: "valid data",
      elseSelf: "hashPasswordWithBcrypt(password)\ncreateFanAccount(userData)",
      elseResp: "showRegistrationSuccess(userID)"
    },
    activity: {
      actorSteps: [
        'Click "Register" link in navbar',
        'Fill personal details (name, username, email, password)',
        'Click "Register" button'
      ],
      systemPrep: 'Validate field formats & check unique email',
      decision: 'Input valid & unique email?',
      yesLabel: 'Valid',
      yesActor: null,
      yesSystem: [
        'Hash password using Bcrypt (10 rounds)',
        'INSERT INTO users (role_id=3)',
        'Establish authenticated session',
        'Redirect to dashboard with welcome alert'
      ],
      noLabel: 'Invalid / Exists',
      noSystem: [
        'Display validation error message'
      ]
    }
  },
  {
    id: "UC02",
    name: "Log In to Account",
    actor: "User",
    module: "Module 1: Authentication & User Profile Management",
    ssd: {
      call1: "openLoginPage()",
      resp1: "displayLoginForm()",
      call2: "submitCredentials(email, password)",
      self1: "verifyCredentials(email, password)",
      altCondition: "invalid credentials",
      altResp: "showLoginError(message)",
      elseCondition: "valid credentials",
      elseSelf: "createSession(userID, role)",
      elseResp: "redirectUserToDashboard(role)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/login"',
        'Enter email address and password',
        'Click "Log In" button'
      ],
      systemPrep: 'Query user by email and verify Bcrypt hash',
      decision: 'Credentials valid?',
      yesLabel: 'Valid',
      yesActor: null,
      yesSystem: [
        'Initialize session cookie',
        'Redirect user to intended destination or home'
      ],
      noLabel: 'Invalid',
      noSystem: [
        'Display "Invalid email or password" error banner'
      ]
    }
  },
  {
    id: "UC03",
    name: "Log Out of Account",
    actor: "User",
    module: "Module 1: Authentication & User Profile Management",
    ssd: {
      call1: "requestLogout()",
      self1: "destroySessionCookies()",
      resp1: "displayLogoutConfirmation()"
    },
    activity: {
      actorSteps: [
        'Click "Log Out" from profile dropdown'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Destroy server-side session object',
        'Clear authentication cookie token',
        'Redirect user to home page with confirmation'
      ]
    }
  },
  {
    id: "UC04",
    name: "View Profile Details",
    actor: "Fan",
    module: "Module 1: Authentication & User Profile Management",
    ssd: {
      call1: "openProfilePage()",
      self1: "fetchUserProfile(sessionUserID)",
      resp1: "displayProfileDetails(userData)"
    },
    activity: {
      actorSteps: [
        'Click profile avatar in navigation bar'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query users table by session user ID',
        'Render profile dashboard with account info'
      ]
    }
  },
  {
    id: "UC05",
    name: "Update Profile Information",
    actor: "Fan",
    module: "Module 1: Authentication & User Profile Management",
    ssd: {
      call1: "openEditProfile()",
      resp1: "displayProfileForm(userData)",
      call2: "submitProfileUpdates(name, bio, location, handle)",
      self1: "validateProfileInput()",
      altCondition: "validation error",
      altResp: "showProfileErrors()",
      elseCondition: "valid input",
      elseSelf: "updateUserRecord(userID, data)",
      elseResp: "showUpdateSuccessToast()"
    },
    activity: {
      actorSteps: [
        'Edit display name, bio, city/location, or social handle',
        'Click "Save Changes" button'
      ],
      systemPrep: 'Validate field length and format constraints',
      decision: 'Input valid?',
      yesLabel: 'Valid',
      yesActor: null,
      yesSystem: [
        'UPDATE users SET name, bio, location, handle',
        'Refresh active session user cache',
        'Show green "Profile updated" notification'
      ],
      noLabel: 'Invalid',
      noSystem: [
        'Display field validation warning'
      ]
    }
  },
  {
    id: "UC06",
    name: "Change Account Password",
    actor: "User",
    module: "Module 1: Authentication & User Profile Management",
    ssd: {
      call1: "submitPasswordChange(currentPass, newPass, confirmPass)",
      self1: "verifyCurrentPassword(currentPass)",
      altCondition: "incorrect current pass or mismatch",
      altResp: "showPasswordError(msg)",
      elseCondition: "verified & match",
      elseSelf: "hashNewPassword(newPass)\nupdatePasswordHash(userID)",
      elseResp: "showPasswordChangeSuccess()"
    },
    activity: {
      actorSteps: [
        'Enter current password, new password, and confirmation',
        'Click "Update Password" button'
      ],
      systemPrep: 'Verify current password Bcrypt hash and confirm match',
      decision: 'Password verified & matched?',
      yesLabel: 'Yes',
      yesActor: null,
      yesSystem: [
        'Hash new password with Bcrypt',
        'UPDATE users SET password_hash = newHash',
        'Show success toast notification'
      ],
      noLabel: 'No',
      noSystem: [
        'Display error: incorrect password or mismatch'
      ]
    }
  },

  // MODULE 2: EVENT DISCOVERY
  {
    id: "UC07",
    name: "Browse Featured Upcoming Events",
    actor: "User",
    module: "Module 2: Event Discovery & Information",
    ssd: {
      call1: "openHomePage()",
      self1: "queryFeaturedVerifiedEvents(limit=6)",
      resp1: "displayFeaturedCarouselAndCards(eventList)"
    },
    activity: {
      actorSteps: [
        'Visit platform root URL ("/")'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM events WHERE verification_status = "VERIFIED" ORDER BY event_date ASC LIMIT 6',
        'Render featured banner carousel and event cards'
      ]
    }
  },
  {
    id: "UC08",
    name: "Browse Events Directory",
    actor: "User",
    module: "Module 2: Event Discovery & Information",
    ssd: {
      call1: "openEventsDirectory()",
      self1: "queryAllVerifiedEvents()",
      resp1: "displayEventsCatalogGrid(events)"
    },
    activity: {
      actorSteps: [
        'Click "Events" in navigation bar'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query verified events joined with artists & categories',
        'Render complete responsive event card catalog'
      ]
    }
  },
  {
    id: "UC09",
    name: "Search Events by Keyword",
    actor: "User",
    module: "Module 2: Event Discovery & Information",
    ssd: {
      call1: "searchEvents(keyword)",
      self1: "executeKeywordSearch(keyword)",
      altCondition: "no matches",
      altResp: "displayEmptySearchState()",
      elseCondition: "matches found",
      elseResp: "displayMatchingEvents(results)"
    },
    activity: {
      actorSteps: [
        'Input search keyword into search bar',
        'Press Enter or submit search'
      ],
      systemPrep: 'Execute SQL query with LIKE wildcards across event, artist, and venue names',
      decision: 'Matches found?',
      yesLabel: 'Yes',
      yesActor: null,
      yesSystem: [
        'Render filtered event cards matching query'
      ],
      noLabel: 'No',
      noSystem: [
        'Display friendly "No events found" empty state'
      ]
    }
  },
  {
    id: "UC10",
    name: "Filter Events by Artist, Category & City",
    actor: "User",
    module: "Module 2: Event Discovery & Information",
    ssd: {
      call1: "selectFilters(categorySlug, artistID, city)",
      self1: "queryFilteredCatalog(categorySlug, artistID, city)",
      resp1: "displayFilteredEventGrid(filteredEvents)"
    },
    activity: {
      actorSteps: [
        'Select category filter pill, artist dropdown, or city filter'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Build dynamic parameterized SQL WHERE conditions',
        'Update card grid asynchronously with matching events'
      ]
    }
  },
  {
    id: "UC11",
    name: "View Event Details & Embedded Venue",
    actor: "User",
    module: "Module 2: Event Discovery & Information",
    ssd: {
      call1: "openEventDetails(eventID)",
      self1: "fetchEventWithArtistVenueChat(eventID)",
      resp1: "displayEventPage(eventData, venueMap, ticketTiers)"
    },
    activity: {
      actorSteps: [
        'Click on any event card in directory'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query event record joined with artist, tickets, and venue',
        'Render event hero banner, ticket tiers, embedded Google Map, transit guide, and chat hub'
      ]
    }
  },
  {
    id: "UC12",
    name: "View Artist & Idol Member Biodata",
    actor: "User",
    module: "Module 2: Event Discovery & Information",
    ssd: {
      call1: "openArtistBiodataSection(artistID)",
      self1: "parseArtistMembersJSON(artistID)",
      resp1: "displayMemberProfileCards(membersArray)"
    },
    activity: {
      actorSteps: [
        'Scroll to "Member Profiles & Biodata" section on event page'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Parse JSON string from artists.members column',
        'Render individual member cards with portrait, positions, birthday, blood type & MBTI'
      ]
    }
  },

  // MODULE 3: PUBLIC EVENT SUBMISSION (MODEL 2)
  {
    id: "UC13",
    name: "Submit Public Event Listing",
    actor: "Submitter",
    module: "Module 3: Public Event Submission & Status Tracking (Model 2)",
    ssd: {
      call1: "openSubmissionForm()",
      resp1: "displayPublicSubmissionForm()",
      call2: "submitEvent(eventData, posterImage)",
      self1: "validateSubmissionData()",
      altCondition: "missing required fields or file > 5MB",
      altResp: "showSubmissionErrors(errors)",
      elseCondition: "valid submission",
      elseSelf: "generateTrackingCode()\nsavePendingEvent(data)\nsendConfirmationEmail()",
      elseResp: "showSubmissionSuccess(trackingCode)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/submit-event"',
        'Fill event details, pick preset venue, upload poster, enter email',
        'Click "Submit Event" button'
      ],
      systemPrep: 'Validate required fields and uploaded poster image size',
      decision: 'Inputs valid?',
      yesLabel: 'Valid',
      yesActor: null,
      yesSystem: [
        'Upload poster file via Multer',
        'Generate unique reference tracking code (e.g. KS-2026-TXT001)',
        'INSERT INTO events (verification_status="PENDING")',
        'Send confirmation email to submitter',
        'Display success confirmation page with tracking code'
      ],
      noLabel: 'Invalid',
      noSystem: [
        'Display form validation error notice'
      ]
    }
  },
  {
    id: "UC14",
    name: "Track Submission Status by Tracking Code",
    actor: "Submitter",
    module: "Module 3: Public Event Submission & Status Tracking (Model 2)",
    ssd: {
      call1: "openStatusLookupPage()",
      resp1: "displayTrackingInput()",
      call2: "lookupTrackingCode(code)",
      self1: "queryEventByTrackingCode(code)",
      altCondition: "code not found",
      altResp: "showCodeNotFoundError()",
      elseCondition: "code exists",
      elseResp: "displayStatusTimeline(event, feedback)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/check-submission"',
        'Enter reference tracking code (e.g. KS-2026-TXT001)',
        'Click "Check Status" button'
      ],
      systemPrep: 'Query events table by tracking_code',
      decision: 'Tracking code found?',
      yesLabel: 'Found',
      yesActor: null,
      yesSystem: [
        'Display review status badge (PENDING / VERIFIED / REJECTED)',
        'Render review timeline and administrator feedback notes'
      ],
      noLabel: 'Not Found',
      noSystem: [
        'Display "Tracking code not found" alert notice'
      ]
    }
  },
  {
    id: "UC15",
    name: "Resubmit Rejected Event Listing",
    actor: "Submitter",
    module: "Module 3: Public Event Submission & Status Tracking (Model 2)",
    ssd: {
      call1: "openResubmitForm(code)",
      resp1: "displayPreFilledForm(eventData, rejectionReason)",
      call2: "resubmitCorrectedDetails(code, correctedData)",
      self1: "updateEventAndResetStatus(code)",
      resp2: "showResubmissionConfirmation(code)"
    },
    activity: {
      actorSteps: [
        'Inspect administrator rejection reason on tracking portal',
        'Modify flagged details (e.g. date, venue, or ticketing URL)',
        'Click "Resubmit Event" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'UPDATE events SET details, verification_status="PENDING", rejection_reason=NULL',
        'Record resubmission action in system audit log',
        'Display resubmission confirmation notice with same tracking code'
      ]
    }
  },

  // MODULE 4: FAN COMMUNITY & BOOKMARKS
  {
    id: "UC16",
    name: "Bookmark Event (Save to Favorites)",
    actor: "Fan",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "bookmarkEvent(eventID)",
      self1: "checkAuthenticationAndExisting(userID, eventID)",
      altCondition: "not authenticated",
      altResp: "promptLoginModal()",
      elseCondition: "authenticated",
      elseSelf: "insertSavedEvent(userID, eventID)",
      elseResp: "updateHeartIconState(saved=true)"
    },
    activity: {
      actorSteps: [
        'Click heart "Save Event" button on event card or details page'
      ],
      systemPrep: 'Check if user is authenticated',
      decision: 'Authenticated?',
      yesLabel: 'Yes',
      yesActor: null,
      yesSystem: [
        'INSERT INTO saved_events (user_id, event_id)',
        'Update heart icon to filled rose color asynchronously'
      ],
      noLabel: 'No',
      noSystem: [
        'Display login prompt modal'
      ]
    }
  },
  {
    id: "UC17",
    name: "View Saved Events List",
    actor: "Fan",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "openSavedEvents()",
      self1: "querySavedEventsWithCountdowns(userID)",
      resp1: "displaySavedEventsList(savedCards)"
    },
    activity: {
      actorSteps: [
        'Click "Saved Events" link in navigation bar'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM saved_events JOIN events WHERE user_id = ?',
        'Render personal saved events page with live countdown timers'
      ]
    }
  },
  {
    id: "UC18",
    name: "Remove Event from Bookmarks",
    actor: "Fan",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "removeBookmark(eventID)",
      self1: "deleteSavedEvent(userID, eventID)",
      resp1: "updateHeartIconState(saved=false)"
    },
    activity: {
      actorSteps: [
        'Click filled heart icon on an already bookmarked event'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'DELETE FROM saved_events WHERE user_id=? AND event_id=?',
        'Revert heart icon to empty outline state asynchronously'
      ]
    }
  },
  {
    id: "UC19",
    name: "View Event Discussion Live Chat",
    actor: "User",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "openEventChatHub(eventID)",
      self1: "fetchChatMessages(eventID)",
      resp1: "renderChatMessageStream(messages)"
    },
    activity: {
      actorSteps: [
        'Scroll to "Event Fan Chat Hub" section on event page'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query event_chat_messages JOIN users for event ID',
        'Render chronological discussion feed with fan avatars and timestamps'
      ]
    }
  },
  {
    id: "UC20",
    name: "Post Event Chat Message",
    actor: "Fan",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "postChatMessage(eventID, messageText)",
      self1: "verifyChatWindowActive(eventID)",
      altCondition: "event ended > 24 hours ago",
      altResp: "showChatLockedError()",
      elseCondition: "chat active",
      elseSelf: "sanitizeInput()\ninsertChatMessage(eventID, userID, text)",
      elseResp: "appendNewMessageToStream()"
    },
    activity: {
      actorSteps: [
        'Type discussion message into chat input field',
        'Click "Send" button'
      ],
      systemPrep: 'Check if event chat is within active window (<24h post-event)',
      decision: 'Chat active?',
      yesLabel: 'Active',
      yesActor: null,
      yesSystem: [
        'Sanitize message input text',
        'INSERT INTO event_chat_messages',
        'Append new message to chat stream asynchronously'
      ],
      noLabel: 'Locked',
      noSystem: [
        'Display "Chat room locked 24 hours post-event" banner'
      ]
    }
  },
  {
    id: "UC21",
    name: "Submit Event Content Report",
    actor: "User",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "clickReportEvent(eventID)",
      resp1: "displayReportModal()",
      call2: "submitReport(eventID, reason, details)",
      self1: "saveReportRecord(eventID, reason, details)",
      resp2: "showReportConfirmationToast()"
    },
    activity: {
      actorSteps: [
        'Click "Report" button on event action bar',
        'Select report reason (e.g. Inaccurate Date/Fake Event) and enter details',
        'Click "Submit Report" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'INSERT INTO reports (event_id, user_id, reason, details, status="PENDING")',
        'Display green confirmation toast: "Report submitted to moderators"'
      ]
    }
  },
  {
    id: "UC22",
    name: "View In-App Notifications",
    actor: "Fan",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "openNotifications()",
      self1: "fetchUserNotifications(userID)",
      resp1: "displayNotificationsList(notifications)"
    },
    activity: {
      actorSteps: [
        'Click notification bell icon in navigation bar'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query notifications table for active user ID',
        'Render notification feed with unread indicators'
      ]
    }
  },
  {
    id: "UC23",
    name: "Mark Notifications as Read",
    actor: "Fan",
    module: "Module 4: Fan Community, Live Chat & Bookmarks",
    ssd: {
      call1: "markAllNotificationsRead()",
      self1: "updateNotificationsReadStatus(userID)",
      resp1: "resetNavbarBadgeCount(0)"
    },
    activity: {
      actorSteps: [
        'Click "Mark all as read" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        'Reset navbar unread badge counter to 0'
      ]
    }
  },

  // MODULE 5: ADMINISTRATOR MODERATION
  {
    id: "UC24",
    name: "View Admin Dashboard & KPI Metrics",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "openAdminDashboard()",
      self1: "aggregateMetricsAndLogs()",
      resp1: "displayDashboardWithKPIs(metrics, logs)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin"'
      ],
      systemPrep: 'Verify user has role_id = 1 (Admin)',
      decision: 'Is Admin?',
      yesLabel: 'Authorized',
      yesActor: null,
      yesSystem: [
        'Aggregate counts: total events, pending submissions, registered users',
        'Retrieve recent activity logs',
        'Render administrative control center dashboard'
      ],
      noLabel: 'Unauthorized',
      noSystem: [
        'Deny access and redirect to home page with warning'
      ]
    }
  },
  {
    id: "UC25",
    name: "View Audit Activity Logs",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "openAuditLogs()",
      self1: "queryActivityLogsWithUsers()",
      resp1: "displayAuditLogsTable(logs)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/logs"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM activity_logs JOIN users ORDER BY created_at DESC',
        'Render immutable audit log table with action badges and timestamps'
      ]
    }
  },
  {
    id: "UC26",
    name: "View Pending Verification Queue",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "openVerificationQueue()",
      self1: "queryPendingEventsWithEvidence()",
      resp1: "displayPendingQueue(pendingEvents)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/verifications"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM events WHERE verification_status = "PENDING"',
        'Render verification table with submitter details, poster previews, and proof URLs'
      ]
    }
  },
  {
    id: "UC27",
    name: "Approve Event Submission Live",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "approveEvent(eventID)",
      self1: "updateVerificationStatus(eventID, 'VERIFIED')\nrecordAuditLog('APPROVE_EVENT', eventID)\nsendApprovalEmail(eventID)",
      resp1: "showApprovalSuccessNotification()"
    },
    activity: {
      actorSteps: [
        'Inspect official proof link and ticketing evidence',
        'Click "Approve Event" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'UPDATE events SET verification_status = "VERIFIED"',
        'INSERT INTO activity_logs (action="APPROVE_EVENT")',
        'Dispatch approval email with live URL to organizer',
        'Publish event to public catalog and refresh queue'
      ]
    }
  },
  {
    id: "UC28",
    name: "Reject Event Submission with Feedback",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "rejectEvent(eventID, rejectionReason)",
      self1: "updateVerificationStatus(eventID, 'REJECTED')\nsaveRejectionReason(eventID, reason)\nrecordAuditLog('REJECT_EVENT')\nsendRejectionEmail()",
      resp1: "showRejectionCompletedNotice()"
    },
    activity: {
      actorSteps: [
        'Enter rejection feedback reason (e.g. "Official ticketing link missing")',
        'Click "Reject Event" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'UPDATE events SET verification_status = "REJECTED", rejection_reason = ?',
        'INSERT INTO activity_logs (action="REJECT_EVENT")',
        'Dispatch rejection feedback email to submitter',
        'Refresh verification queue'
      ]
    }
  },
  {
    id: "UC29",
    name: "View Content Reports List",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "openReportsInbox()",
      self1: "queryReportsWithEventsAndUsers()",
      resp1: "displayReportsTable(reportsList)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/reports"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query reports table joined with events and reporting users',
        'Render moderation table with status tags and event links'
      ]
    }
  },
  {
    id: "UC30",
    name: "Resolve Content Report",
    actor: "Admin",
    module: "Module 5: Administrator Review, Verification & Moderation",
    ssd: {
      call1: "resolveReport(reportID)",
      self1: "updateReportStatus(reportID, 'RESOLVED')",
      resp1: "showResolutionSuccessNotification()"
    },
    activity: {
      actorSteps: [
        'Investigate reported listing and apply corrections',
        'Click "Mark as Resolved" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'UPDATE reports SET status = "RESOLVED" WHERE id = ?',
        'Record moderation action in activity_logs',
        'Refresh reports management table'
      ]
    }
  },

  // MODULE 6: ADMIN CATALOG CRUD
  {
    id: "UC31",
    name: "View All Events Management List",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "openEventsManagement()",
      self1: "queryAllEvents()",
      resp1: "displayEventsManagementTable(allEvents)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/events"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM events joined with categories & artists',
        'Render complete event management table with status toggles'
      ]
    }
  },
  {
    id: "UC32",
    name: "Update Event Listing Status",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "updateEventStatus(eventID, newStatus)",
      self1: "updateEventStatusColumn(eventID, newStatus)\nrecordAuditLog('UPDATE_STATUS', eventID)",
      resp1: "showStatusUpdatedNotice()"
    },
    activity: {
      actorSteps: [
        'Select new event status (UPCOMING / ONGOING / COMPLETED)',
        'Click "Update Status" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'UPDATE events SET event_status = ? WHERE id = ?',
        'INSERT INTO activity_logs (action="UPDATE_STATUS")',
        'Reload management table with updated badge'
      ]
    }
  },
  {
    id: "UC33",
    name: "Delete Event Listing",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "requestDeleteEvent(eventID)",
      resp1: "displayDeleteConfirmationDialog(eventID)",
      call2: "confirmDeleteEvent(eventID)",
      self1: "deleteEventAndCascadeChildren(eventID)\nrecordAuditLog('DELETE_EVENT')",
      resp2: "showDeleteSuccessToast()"
    },
    activity: {
      actorSteps: [
        'Click Delete icon on event row'
      ],
      systemPrep: 'Show "Delete Event" confirmation dialog',
      decision: 'Confirm Delete?',
      yesLabel: 'Delete',
      yesActor: 'Click "Delete"',
      yesSystem: [
        'DELETE FROM events WHERE id = ?',
        'Cascade delete saved_events & chat messages',
        'INSERT INTO activity_logs (action="DELETE_EVENT")',
        'Show success toast notification'
      ],
      noLabel: 'Cancel',
      noActor: 'Click "Cancel"',
      noSystem: [
        'Close dialog (no changes made)'
      ]
    }
  },
  {
    id: "UC34",
    name: "View Event Categories",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "openCategoriesPage()",
      self1: "queryCategoriesWithCounts()",
      resp1: "displayCategoriesTable(categories)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/categories"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Query event_categories joined with event counts',
        'Render categories table with badge color previews'
      ]
    }
  },
  {
    id: "UC35",
    name: "Create Event Category",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "createCategory(name, slug, color)",
      self1: "validateUniqueCategorySlug(slug)",
      altCondition: "duplicate slug exists",
      altResp: "showDuplicateCategoryError()",
      elseCondition: "unique slug",
      elseSelf: "insertCategory(name, slug, color)\nrecordAuditLog('CREATE_CATEGORY')",
      elseResp: "showCategoryCreatedSuccess()"
    },
    activity: {
      actorSteps: [
        'Enter category name, slug, and badge color',
        'Click "Add Category" button'
      ],
      systemPrep: 'Validate category name and unique slug constraint',
      decision: 'Slug unique?',
      yesLabel: 'Unique',
      yesActor: null,
      yesSystem: [
        'INSERT INTO event_categories (name, slug, color)',
        'INSERT INTO activity_logs (action="CREATE_CATEGORY")',
        'Reload categories list with new category'
      ],
      noLabel: 'Duplicate',
      noSystem: [
        'Display "Category slug already exists" error'
      ]
    }
  },
  {
    id: "UC36",
    name: "Delete Event Category",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "deleteCategory(categoryID)",
      self1: "checkLinkedEvents(categoryID)",
      altCondition: "linked to existing events",
      altResp: "showForeignConstraintError()",
      elseCondition: "unreferenced",
      elseSelf: "deleteCategoryRecord(categoryID)\nrecordAuditLog('DELETE_CATEGORY')",
      elseResp: "showCategoryDeletedNotice()"
    },
    activity: {
      actorSteps: [
        'Click Delete icon on category row'
      ],
      systemPrep: 'Check if category is currently referenced in events table',
      decision: 'Category referenced in events?',
      yesLabel: 'Referenced',
      yesActor: null,
      yesSystem: [
        'Show error dialog: Cannot delete category with linked events (RESTRICT)'
      ],
      noLabel: 'Unreferenced',
      noActor: 'Confirm Delete',
      yesSystem2: [
        'DELETE FROM event_categories WHERE id = ?',
        'Record action in activity_logs',
        'Reload categories table'
      ]
    }
  },
  {
    id: "UC37",
    name: "View Artist Catalog",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "openArtistsCatalog()",
      self1: "queryAllArtists()",
      resp1: "displayArtistsTable(artists)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/artists"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM artists ORDER BY name ASC',
        'Render artist catalog table with group type and agency badges'
      ]
    }
  },
  {
    id: "UC38",
    name: "Create Artist Profile with Biodata",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "createArtist(name, groupType, agency, imageURL, membersJSON)",
      self1: "validateArtistData()\ninsertArtistRecord(name, groupType, agency, imageURL, membersJSON)\nrecordAuditLog('CREATE_ARTIST')",
      resp1: "showArtistCreatedSuccess()"
    },
    activity: {
      actorSteps: [
        'Enter artist name, group type, agency, and image URL',
        'Input member biodata details into member table',
        'Click "Add Artist" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Serialize member biodata array into JSON string',
        'INSERT INTO artists (name, group_type, agency, image_url, members)',
        'INSERT INTO activity_logs (action="CREATE_ARTIST")',
        'Reload artist catalog with new profile'
      ]
    }
  },
  {
    id: "UC39",
    name: "Delete Artist Profile",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "requestDeleteArtist(artistID)",
      resp1: "displayDeleteConfirmation(artistID)",
      call2: "confirmDeleteArtist(artistID)",
      self1: "deleteArtistAndSetNullEvents(artistID)\nrecordAuditLog('DELETE_ARTIST')",
      resp2: "showDeleteSuccess()"
    },
    activity: {
      actorSteps: [
        'Click Delete icon on artist row'
      ],
      systemPrep: 'Show "Delete Artist" confirmation modal',
      decision: 'Confirm Delete?',
      yesLabel: 'Delete',
      yesActor: 'Click "Delete"',
      yesSystem: [
        'DELETE FROM artists WHERE id = ?',
        'Set artist_id = NULL on linked events (ON DELETE SET NULL)',
        'INSERT INTO activity_logs (action="DELETE_ARTIST")',
        'Show success toast notification'
      ],
      noLabel: 'Cancel',
      noActor: 'Click "Cancel"',
      noSystem: [
        'Close modal without changes'
      ]
    }
  },
  {
    id: "UC40",
    name: "View Registered Users List",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "openUsersManagement()",
      self1: "queryUsersWithRoles()",
      resp1: "displayUsersTable(users)"
    },
    activity: {
      actorSteps: [
        'Navigate to "/admin/users"'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'SELECT * FROM users JOIN roles',
        'Render registered users table with role badges and registration dates'
      ]
    }
  },
  {
    id: "UC41",
    name: "Delete User Account",
    actor: "Admin",
    module: "Module 6: Administrator Catalog & System Entity CRUD",
    ssd: {
      call1: "requestDeleteUser(targetUserID)",
      self1: "checkIsRootAdmin(targetUserID)",
      altCondition: "target is root admin (id=1)",
      altResp: "showRootAdminProtectedError()",
      elseCondition: "regular user",
      elseSelf: "deleteUserAndCascade(targetUserID)\nrecordAuditLog('DELETE_USER')",
      elseResp: "showUserDeletedSuccess()"
    },
    activity: {
      actorSteps: [
        'Click Delete icon on target user row'
      ],
      systemPrep: 'Verify target user is not primary root administrator',
      decision: 'Is root admin?',
      yesLabel: 'Yes',
      yesActor: null,
      yesSystem: [
        'Display error: Root administrator account cannot be deleted'
      ],
      noLabel: 'No',
      noActor: 'Confirm Delete',
      yesSystem2: [
        'DELETE FROM users WHERE id = ?',
        'Cascade delete user bookmarks and chat messages',
        'INSERT INTO activity_logs (action="DELETE_USER")',
        'Show success notification'
      ]
    }
  },

  // MODULE 7: MINOR / USER EXPERIENCE ENHANCEMENTS
  {
    id: "UC42",
    name: "View Interactive Google Map & Directions in Browser",
    actor: "User",
    module: "Module 7: Additional / Minor User Experience Enhancements",
    ssd: {
      call1: "viewVenueLocationSection(eventID)",
      self1: "renderGoogleMapIframe(venueCoordinates)",
      resp1: "displayInteractiveVenueMap()",
      call2: "clickGetDirections()",
      self2: "openExternalGoogleMapsNavigation()",
      resp2: "launchNavigationWindow()"
    },
    activity: {
      actorSteps: [
        'Scroll to "Venue & Location" sidebar card on event page',
        'Click "Directions" or "Open Google Maps" button'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Render embedded Google Maps iframe displaying venue coordinates',
        'Launch Google Maps navigation in new browser tab with turn-by-turn routing'
      ]
    }
  },
  {
    id: "UC43",
    name: "View Real-Time Event Countdown Timer",
    actor: "User",
    module: "Module 7: Additional / Minor User Experience Enhancements",
    ssd: {
      call1: "openEventPage(eventID)",
      self1: "calculateRemainingTime(eventDate, startTime)",
      altCondition: "event started or past",
      altResp: "displayEventLiveBadge()",
      elseCondition: "upcoming",
      elseSelf: "startIntervalTimer(1000ms)",
      elseResp: "displayTickingClock(days, hrs, mins, secs)"
    },
    activity: {
      actorSteps: [
        'Open event details page'
      ],
      systemPrep: 'Calculate difference between current timestamp and event start time',
      decision: 'Event is upcoming?',
      yesLabel: 'Upcoming',
      yesActor: null,
      yesSystem: [
        'Initialize client-side setInterval(1000ms)',
        'Update Days, Hours, Minutes, Seconds display in hero banner'
      ],
      noLabel: 'Live / Past',
      noSystem: [
        'Display "Event Started / Live Now" badge'
      ]
    }
  },
  {
    id: "UC44",
    name: "Share Event via Multi-Channel Social Modal",
    actor: "User",
    module: "Module 7: Additional / Minor User Experience Enhancements",
    ssd: {
      call1: "clickShareEventButton()",
      self1: "detectPlatformCapabilities()",
      altCondition: "mobile device with navigator.share",
      altResp: "openNativeShareSheet()",
      elseCondition: "desktop browser",
      elseResp: "displayShareModal(WhatsApp, X, Telegram, FB, CopyLink)"
    },
    activity: {
      actorSteps: [
        'Click "Share" button on event action bar'
      ],
      systemPrep: 'Check if device supports native navigator.share() API',
      decision: 'Native share supported?',
      yesLabel: 'Yes (Mobile)',
      yesActor: null,
      yesSystem: [
        'Invoke native navigator.share() dialog'
      ],
      noLabel: 'No (Desktop)',
      noActor: 'Select social channel or click "Copy Link"',
      yesSystem2: [
        'Open share modal with WhatsApp, X, Telegram, Facebook & Copy Link',
        'Launch target share page or write URL to clipboard with confirmation toast'
      ]
    }
  },
  {
    id: "UC45",
    name: "Manage Concert Day Survival Checklist",
    actor: "User",
    module: "Module 7: Additional / Minor User Experience Enhancements",
    ssd: {
      call1: "toggleChecklistItem(itemID, isChecked)",
      self1: "saveChecklistStateToLocalStorage(itemID, isChecked)\ncalculatePreparedPercentage()",
      resp1: "animateProgressBar(progressPercent)"
    },
    activity: {
      actorSteps: [
        'Check off prepared item on 7-item concert survival checklist'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Read updated state of checked items',
        'Calculate prepared percentage (e.g. 5/7 Prepared - 71%)',
        'Persist checked item IDs in browser localStorage',
        'Animate progress bar fill to current completion rate'
      ]
    }
  },
  {
    id: "UC46",
    name: "Add Event to Google Calendar",
    actor: "User",
    module: "Module 7: Additional / Minor User Experience Enhancements",
    ssd: {
      call1: "clickAddToGoogleCalendar()",
      self1: "formatISO8601Timestamps()\nconstructGoogleCalendarURL()",
      resp1: "openGoogleCalendarTab()"
    },
    activity: {
      actorSteps: [
        'Click "Add to Calendar" button on event action bar'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Format event title, ISO dates, venue, and description into query string',
        'Construct "calendar.google.com/calendar/render?action=TEMPLATE" URL',
        'Open pre-filled Google Calendar event creation tab'
      ]
    }
  },
  {
    id: "UC47",
    name: "Copy Event Verification Reference Code",
    actor: "User",
    module: "Module 7: Additional / Minor User Experience Enhancements",
    ssd: {
      call1: "clickCopyReferenceCode()",
      self1: "writeTrackingCodeToClipboard(trackingCode)",
      resp1: "displayFloatingToastNotice('Reference code copied!')"
    },
    activity: {
      actorSteps: [
        'Click copy icon on Official Verification card'
      ],
      systemPrep: null,
      decision: null,
      directSystem: [
        'Write tracking code string (e.g. KS-2026-TXT001) to clipboard',
        'Show floating green toast notification: "Reference code copied to clipboard!"'
      ]
    }
  }
];

// Helper to generate PlantUML for SSD (Pic 1 Style)
function generatePlantUML_SSD(item) {
  const actor = item.actor;
  let puml = `@startuml ${item.id}_SSD\n`;
  puml += `skinparam monochrome true\nskinparam shadowing false\nskinparam defaultFontName Arial\n`;
  puml += `title ${item.id}: System Sequence Diagram - ${item.name}\n\n`;
  puml += `actor ${actor}\n`;
  puml += `participant ":System" as System\n\n`;

  if (item.ssd.call1) {
    puml += `${actor} -> System : ${item.ssd.call1}\n`;
  }
  if (item.ssd.resp1) {
    puml += `System --> ${actor} : ${item.ssd.resp1}\n`;
  }
  if (item.ssd.call2) {
    puml += `${actor} -> System : ${item.ssd.call2}\n`;
  }
  if (item.ssd.self1) {
    const lines = item.ssd.self1.split('\n');
    lines.forEach(l => {
      puml += `System -> System : ${l}\n`;
    });
  }

  if (item.ssd.altCondition) {
    puml += `alt ${item.ssd.altCondition}\n`;
    if (item.ssd.altResp) {
      puml += `    System --> ${actor} : ${item.ssd.altResp}\n`;
    }
    puml += `else ${item.ssd.elseCondition}\n`;
    if (item.ssd.elseSelf) {
      const elines = item.ssd.elseSelf.split('\n');
      elines.forEach(l => {
        puml += `    System -> System : ${l}\n`;
      });
    }
    if (item.ssd.elseResp) {
      puml += `    System --> ${actor} : ${item.ssd.elseResp}\n`;
    }
    puml += `end\n`;
  } else if (item.ssd.resp2) {
    puml += `System --> ${actor} : ${item.ssd.resp2}\n`;
  }

  puml += `@enduml\n`;
  return puml;
}

// Helper to generate PlantUML for Activity Diagram (Pic 2 Style)
function generatePlantUML_Activity(item) {
  const actor = item.actor;
  let puml = `@startuml ${item.id}_Activity\n`;
  puml += `skinparam monochrome true\nskinparam shadowing false\nskinparam defaultFontName Arial\nskinparam defaultTextAlignment center\n\n`;
  puml += `title ${item.id}: Business Activity Diagram - ${item.name}\n\n`;
  puml += `|${actor}|\nstart\n`;

  item.activity.actorSteps.forEach(step => {
    puml += `:${step};\n`;
  });

  if (item.activity.systemPrep) {
    puml += `|System|\n:${item.activity.systemPrep};\n`;
  }

  if (item.activity.decision) {
    puml += `|${actor}|\n`;
    puml += `if (${item.activity.decision}) then (${item.activity.yesLabel})\n`;
    if (item.activity.yesActor) {
      puml += `  :${item.activity.yesActor};\n`;
    }
    puml += `  |System|\n`;
    item.activity.yesSystem.forEach(s => {
      puml += `  :${s};\n`;
    });
    puml += `  stop\n`;

    puml += `else (${item.activity.noLabel})\n`;
    if (item.activity.noActor) {
      puml += `  |${actor}|\n  :${item.activity.noActor};\n`;
    }
    puml += `  |System|\n`;
    const noList = item.activity.noSystem || item.activity.yesSystem2 || [];
    noList.forEach(s => {
      puml += `  :${s};\n`;
    });
    puml += `  stop\n`;
    puml += `endif\n`;
  } else if (item.activity.directSystem) {
    puml += `|System|\n`;
    item.activity.directSystem.forEach(s => {
      puml += `:${s};\n`;
    });
    puml += `stop\n`;
  }

  puml += `@enduml\n`;
  return puml;
}

// Helper to generate Mermaid for SSD
function generateMermaid_SSD(item) {
  const actor = item.actor;
  let mmd = `sequenceDiagram\n`;
  mmd += `    actor ${actor} as ${actor}\n`;
  mmd += `    participant System as :System\n`;

  if (item.ssd.call1) {
    mmd += `    ${actor}->>System: ${item.ssd.call1}\n`;
  }
  if (item.ssd.resp1) {
    mmd += `    System-->>${actor}: ${item.ssd.resp1}\n`;
  }
  if (item.ssd.call2) {
    mmd += `    ${actor}->>System: ${item.ssd.call2}\n`;
  }
  if (item.ssd.self1) {
    const lines = item.ssd.self1.split('\n');
    lines.forEach(l => {
      mmd += `    System->>System: ${l}\n`;
    });
  }

  if (item.ssd.altCondition) {
    mmd += `    alt ${item.ssd.altCondition}\n`;
    if (item.ssd.altResp) {
      mmd += `        System-->>${actor}: ${item.ssd.altResp}\n`;
    }
    mmd += `    else ${item.ssd.elseCondition}\n`;
    if (item.ssd.elseSelf) {
      const elines = item.ssd.elseSelf.split('\n');
      elines.forEach(l => {
        mmd += `        System->>System: ${l}\n`;
      });
    }
    if (item.ssd.elseResp) {
      mmd += `        System-->>${actor}: ${item.ssd.elseResp}\n`;
    }
    mmd += `    end\n`;
  } else if (item.ssd.resp2) {
    mmd += `    System-->>${actor}: ${item.ssd.resp2}\n`;
  }

  return mmd;
}

// Helper to generate Mermaid for Swimlane Activity
function generateMermaid_Activity(item) {
  const actor = item.actor;
  let mmd = `flowchart TD\n`;
  mmd += `    subgraph ${actor} ["👤 ${actor}"]\n`;
  mmd += `        startNode(("● Start"))\n`;
  item.activity.actorSteps.forEach((step, idx) => {
    mmd += `        A${idx + 1}["${step}"]\n`;
  });
  if (item.activity.decision) {
    mmd += `        DEC{"${item.activity.decision}"}\n`;
    if (item.activity.yesActor) {
      mmd += `        AYES["${item.activity.yesActor}"]\n`;
    }
    if (item.activity.noActor) {
      mmd += `        ANO["${item.activity.noActor}"]\n`;
    }
  }
  mmd += `    end\n\n`;

  mmd += `    subgraph System ["💻 :System"]\n`;
  if (item.activity.systemPrep) {
    mmd += `        SPREP["${item.activity.systemPrep}"]\n`;
  }
  if (item.activity.decision) {
    item.activity.yesSystem.forEach((s, idx) => {
      mmd += `        SYES${idx + 1}["${s}"]\n`;
    });
    const noList = item.activity.noSystem || item.activity.yesSystem2 || [];
    noList.forEach((s, idx) => {
      mmd += `        SNO${idx + 1}["${s}"]\n`;
    });
  } else if (item.activity.directSystem) {
    item.activity.directSystem.forEach((s, idx) => {
      mmd += `        SDIR${idx + 1}["${s}"]\n`;
    });
  }
  mmd += `        endNode((("◉ End")))\n`;
  mmd += `    end\n\n`;

  // Connect flows
  mmd += `    startNode --> A1\n`;
  for (let i = 1; i < item.activity.actorSteps.length; i++) {
    mmd += `    A${i} --> A${i + 1}\n`;
  }
  const lastActorStep = `A${item.activity.actorSteps.length}`;

  if (item.activity.decision) {
    if (item.activity.systemPrep) {
      mmd += `    ${lastActorStep} --> SPREP\n`;
      mmd += `    SPREP --> DEC\n`;
    } else {
      mmd += `    ${lastActorStep} --> DEC\n`;
    }

    // Yes branch
    if (item.activity.yesActor) {
      mmd += `    DEC -- "${item.activity.yesLabel}" --> AYES\n`;
      mmd += `    AYES --> SYES1\n`;
    } else {
      mmd += `    DEC -- "${item.activity.yesLabel}" --> SYES1\n`;
    }
    for (let i = 1; i < item.activity.yesSystem.length; i++) {
      mmd += `    SYES${i} --> SYES${i + 1}\n`;
    }
    mmd += `    SYES${item.activity.yesSystem.length} --> endNode\n`;

    // No branch
    const noList = item.activity.noSystem || item.activity.yesSystem2 || [];
    if (item.activity.noActor) {
      mmd += `    DEC -- "${item.activity.noLabel}" --> ANO\n`;
      mmd += `    ANO --> SNO1\n`;
    } else {
      mmd += `    DEC -- "${item.activity.noLabel}" --> SNO1\n`;
    }
    for (let i = 1; i < noList.length; i++) {
      mmd += `    SNO${i} --> SNO${i + 1}\n`;
    }
    mmd += `    SNO${noList.length} --> endNode\n`;

  } else if (item.activity.directSystem) {
    mmd += `    ${lastActorStep} --> SDIR1\n`;
    for (let i = 1; i < item.activity.directSystem.length; i++) {
      mmd += `    SDIR${i} --> SDIR${i + 1}\n`;
    }
    mmd += `    SDIR${item.activity.directSystem.length} --> endNode\n`;
  }

  return mmd;
}

async function main() {
  console.log("Generating Complete Diagram Suite for all 47 Use Cases...");

  const diagramsDir = path.join(projectRoot, 'docs', 'diagrams');
  const ssdDir = path.join(diagramsDir, 'ssd');
  const actDir = path.join(diagramsDir, 'activity');

  if (!fs.existsSync(diagramsDir)) fs.mkdirSync(diagramsDir, { recursive: true });
  if (!fs.existsSync(ssdDir)) fs.mkdirSync(ssdDir, { recursive: true });
  if (!fs.existsSync(actDir)) fs.mkdirSync(actDir, { recursive: true });

  let allSSDPuml = `@startuml KSync_All_System_Sequence_Diagrams\n\n`;
  let allActPuml = `@startuml KSync_All_Business_Activity_Diagrams\n\n`;

  const htmlCards = [];

  for (const item of diagramCatalog) {
    const ssdPuml = generatePlantUML_SSD(item);
    const actPuml = generatePlantUML_Activity(item);

    // Save individual .puml files
    fs.writeFileSync(path.join(ssdDir, `${item.id}_SSD.puml`), ssdPuml, 'utf8');
    fs.writeFileSync(path.join(actDir, `${item.id}_Activity.puml`), actPuml, 'utf8');

    allSSDPuml += `' ========================================\n' ${item.id}: ${item.name}\n' ========================================\n` + ssdPuml + `\n\n`;
    allActPuml += `' ========================================\n' ${item.id}: ${item.name}\n' ========================================\n` + actPuml + `\n\n`;

    const mmdSSD = generateMermaid_SSD(item);
    const mmdAct = generateMermaid_Activity(item);

    htmlCards.push(`
      <div class="use-case-card" id="${item.id}">
        <div class="uc-header">
          <div class="uc-badge">${item.id}</div>
          <div class="uc-title-block">
            <h3 class="uc-title">${item.name}</h3>
            <span class="uc-module">${item.module} &bull; Primary Actor: <strong>${item.actor}</strong></span>
          </div>
        </div>

        <div class="diagram-grid">
          <!-- System Sequence Diagram (Pic 1 Style) -->
          <div class="diagram-pane">
            <div class="diagram-header">
              <span class="diagram-type-tag ssd-tag">SYSTEM SEQUENCE DIAGRAM (SSD)</span>
              <span class="diagram-subtitle">Actor &harr; :System Method Signature Flow</span>
            </div>
            <div class="mermaid-container">
              <pre class="mermaid">
${mmdSSD}
              </pre>
            </div>
            <details class="puml-details">
              <summary>View / Copy PlantUML & Draw.io Code</summary>
              <pre class="code-box">${escapeHtml(ssdPuml)}</pre>
            </details>
          </div>

          <!-- Business Activity Diagram (Pic 2 Style) -->
          <div class="diagram-pane">
            <div class="diagram-header">
              <span class="diagram-type-tag act-tag">BUSINESS ACTIVITY DIAGRAM</span>
              <span class="diagram-subtitle">Swimlanes: ${item.actor} | System</span>
            </div>
            <div class="mermaid-container">
              <pre class="mermaid">
${mmdAct}
              </pre>
            </div>
            <details class="puml-details">
              <summary>View / Copy PlantUML & Draw.io Code</summary>
              <pre class="code-box">${escapeHtml(actPuml)}</pre>
            </details>
          </div>
        </div>
      </div>
    `);
  }

  allSSDPuml += `@enduml\n`;
  allActPuml += `@enduml\n`;

  // Write master PUML files
  const masterSSDPath = path.join(projectRoot, 'docs', 'KSync_System_Sequence_Diagrams_All.puml');
  const masterActPath = path.join(projectRoot, 'docs', 'KSync_Business_Activity_Diagrams_All.puml');
  fs.writeFileSync(masterSSDPath, allSSDPuml, 'utf8');
  fs.writeFileSync(masterActPath, allActPuml, 'utf8');
  console.log(`Saved master PlantUML SSD to: ${masterSSDPath}`);
  console.log(`Saved master PlantUML Activity to: ${masterActPath}`);

  // Build Draw.io Import Instructions & XML guide
  const drawioInstructionPath = path.join(projectRoot, 'docs', 'HOW_TO_USE_IN_DRAWIO.md');
  const drawioGuide = `# How to Import K-Sync Diagrams into Draw.io (app.diagrams.net)

Draw.io provides 1-click built-in native support for both **PlantUML** and **Mermaid**.

### Method 1: Using PlantUML in Draw.io (100% Matches Pic 1 and Pic 2)
1. Open [https://app.diagrams.net](https://app.diagrams.net) (or Draw.io Desktop app).
2. In the top navigation bar, click: **Arrange &rarr; Insert &rarr; Advanced &rarr; PlantUML**.
3. Copy the PlantUML code for any Use Case from:
   - SSD files: \`docs/diagrams/ssd/UCxx_SSD.puml\`
   - Activity files: \`docs/diagrams/activity/UCxx_Activity.puml\`
   - Or master file: \`docs/KSync_System_Sequence_Diagrams_All.puml\`
4. Paste the code into the dialog box and click **Insert**.
5. Draw.io automatically creates native, fully editable shapes (actor stick figures, lifelines, swimlanes, action blocks, and diamonds)!

### Method 2: Using Mermaid in Draw.io
1. In Draw.io, click: **Arrange &rarr; Insert &rarr; Advanced &rarr; Mermaid**.
2. Paste the Mermaid snippet from the HTML viewer or specification.
3. Click **Insert**.

### Method 3: Visual HTML Viewer
Open \`docs/diagrams_specification.html\` directly in Google Chrome or Microsoft Edge to inspect all 94 diagrams rendered side-by-side!
`;
  fs.writeFileSync(drawioInstructionPath, drawioGuide, 'utf8');

  // Build Comprehensive HTML Document
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-Sync Malaysia: System Sequence & Business Activity Diagrams Specification</title>
    <!-- Mermaid CDN -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            themeVariables: {
                primaryColor: '#f8fafc',
                primaryBorderColor: '#0f172a',
                primaryTextColor: '#0f172a',
                lineColor: '#334155',
                secondaryColor: '#f1f5f9',
                tertiaryColor: '#ffffff'
            },
            flowchart: { curve: 'linear' },
            sequence: { actorMargin: 50, mirrorActors: false }
        });
    </script>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 24px;
            line-height: 1.5;
        }
        .header-hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 36px 32px;
            border-radius: 16px;
            margin-bottom: 32px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
        }
        .header-hero h1 { margin: 0 0 10px 0; font-size: 26pt; font-weight: 800; letter-spacing: -0.5px; }
        .header-hero p { margin: 0; font-size: 13pt; color: #cbd5e1; max-width: 900px; }
        .guide-pill-row { margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap; }
        .guide-pill {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 9.5pt;
            color: #e2e8f0;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .use-case-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 24px;
            margin-bottom: 28px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            page-break-inside: avoid;
        }
        .uc-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f1f5f9;
            margin-bottom: 20px;
        }
        .uc-badge {
            background: #db2777;
            color: white;
            font-weight: 800;
            font-size: 13pt;
            padding: 8px 14px;
            border-radius: 8px;
            letter-spacing: 0.5px;
        }
        .uc-title { margin: 0; font-size: 15pt; color: #0f172a; font-weight: 700; }
        .uc-module { font-size: 10pt; color: #64748b; }
        .diagram-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        @media (max-width: 1024px) {
            .diagram-grid { grid-template-columns: 1fr; }
        }
        .diagram-pane {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 16px;
            display: flex;
            flex-direction: column;
        }
        .diagram-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f1f5f9;
        }
        .diagram-type-tag {
            font-size: 9pt;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
        }
        .ssd-tag { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .act-tag { background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
        .diagram-subtitle { font-size: 9pt; color: #64748b; font-weight: 500; }
        .mermaid-container {
            background: #fafafa;
            border: 1px solid #f1f5f9;
            border-radius: 8px;
            padding: 12px;
            overflow-x: auto;
            min-height: 280px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .puml-details {
            margin-top: 14px;
            font-size: 9pt;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
        }
        .puml-details summary {
            cursor: pointer;
            font-weight: 600;
            color: #475569;
        }
        .code-box {
            background: #0f172a;
            color: #f8fafc;
            padding: 12px;
            border-radius: 6px;
            font-family: Consolas, Monaco, monospace;
            font-size: 8.5pt;
            overflow-x: auto;
            margin: 8px 0 0 0;
            white-space: pre;
        }
    </style>
</head>
<body>
    <div class="header-hero">
        <h1>K-Sync Malaysia: Formal Diagram Specifications</h1>
        <p>Comprehensive System Sequence Diagrams (SSD) and Business Activity Diagrams with Swimlanes for all 47 uncombined system use cases across 7 functional modules.</p>
        <div class="guide-pill-row">
            <span class="guide-pill"><strong>Total Use Cases:</strong> 47 Specifications</span>
            <span class="guide-pill"><strong>System Sequence Diagrams (Pic 1 Style):</strong> 47 Diagrams</span>
            <span class="guide-pill"><strong>Business Activity Diagrams (Pic 2 Style):</strong> 47 Diagrams</span>
            <span class="guide-pill"><strong>Draw.io Ready:</strong> Arrange &rarr; Insert &rarr; PlantUML / Mermaid</span>
        </div>
    </div>

    ${htmlCards.join('\n')}

    <div style="text-align: center; color: #94a3b8; font-size: 10pt; margin: 40px 0;">
        K-Sync Malaysia &copy; 2026. Final Year Project Chapter 3 Software Requirements Specification (SRS) Diagrams.
    </div>
</body>
</html>`;

  const htmlPath = path.join(projectRoot, 'docs', 'diagrams_specification.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Saved HTML specification to: ${htmlPath}`);

  // Generate PDF via Microsoft Edge headless
  console.log('Rendering Diagrams PDF via Microsoft Edge headless...');
  const pdfPath = path.join(projectRoot, 'docs', 'K-Sync_Malaysia_Diagrams_Specification.pdf');
  const edgeCmd = `Start-Process -FilePath "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" -ArgumentList "--headless", "--disable-gpu", "--virtual-time-budget=8000", "--run-all-compositor-stages-before-draw", "--print-to-pdf=\\"${pdfPath}\\"", "\\"${htmlPath}\\"" -Wait`;

  try {
    execSync(`powershell -Command "${edgeCmd}"`, { stdio: 'inherit' });
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(`\nSUCCESS! Created Diagrams PDF: ${pdfPath}`);
      console.log(`File Size: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  } catch (err) {
    console.warn("Edge PDF generation completed or skipped:", err.message);
  }

  // Copy deliverables to artifact directory
  const artifactDir = path.resolve('C:\\Users\\ammar\\.gemini\\antigravity\\brain\\d199a6be-f5bb-4d5e-9505-7acac75c376d');
  try {
    fs.copyFileSync(masterSSDPath, path.join(artifactDir, 'KSync_System_Sequence_Diagrams_All.puml'));
    fs.copyFileSync(masterActPath, path.join(artifactDir, 'KSync_Business_Activity_Diagrams_All.puml'));
    fs.copyFileSync(htmlPath, path.join(artifactDir, 'diagrams_specification.html'));
    if (fs.existsSync(pdfPath)) {
      fs.copyFileSync(pdfPath, path.join(artifactDir, 'K-Sync_Malaysia_Diagrams_Specification.pdf'));
    }
    console.log("Copied all diagram assets to artifact directory.");
  } catch (copyErr) {
    console.warn("Copy to artifact dir warning:", copyErr.message);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

main().catch(console.error);
