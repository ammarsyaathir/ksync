// src/routes/organizer.js - Organizer Portal & Event CRUD Routes
// Dedicated self-service event management for registered Organizers & Fanclubs
// Decoupled from verification: creating/editing an event triggers autonomous Dual-AI verification.

import express from 'express';
import crypto from 'crypto';
import db from '../../config/database.js';
import upload from '../middleware/upload.js';
import { requireAuth, requireOrganizer } from '../middleware/auth.js';
import { logActivity } from '../utils/helpers.js';
import helpers from '../utils/helpers.js';
import verificationEngine from '../services/verificationEngine.js';

const router = express.Router();

// Apply Authentication & Organizer role guard to ALL organizer routes
router.use(requireAuth);
router.use(requireOrganizer);

// ============================================================================
// 1. ORGANIZER WORKSPACE (GET /organizer & GET /organizer/dashboard)
// ============================================================================
router.get(['/', '/dashboard'], async (req, res) => {
  const organizerId = req.user.id;

  try {
    // 1. Fetch all events created by this Organizer with live interaction counters
    let events = [];
    try {
      events = await db.query(`
        SELECT e.*, a.name as artist_name, a.slug as artist_slug, c.name as category_name, c.badge_color,
          (SELECT COUNT(id) FROM event_recommendations r WHERE r.event_id = e.id) as upvote_count,
          (SELECT COUNT(id) FROM saved_events s WHERE s.event_id = e.id) as save_count,
          (SELECT COUNT(id) FROM event_chat_messages m WHERE m.event_id = e.id) as comment_count
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE e.organizer_id = ?
        ORDER BY e.event_date ASC
      `, [organizerId]);
    } catch (queryErr) {
      console.warn('[Organizer Workspace Query Fallback]:', queryErr.message);
      events = await db.query(`
        SELECT e.*, a.name as artist_name, a.slug as artist_slug, c.name as category_name, c.badge_color,
          0 as upvote_count,
          (SELECT COUNT(id) FROM saved_events s WHERE s.event_id = e.id) as save_count,
          (SELECT COUNT(id) FROM event_chat_messages m WHERE m.event_id = e.id) as comment_count
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE e.organizer_id = ?
        ORDER BY e.event_date ASC
      `, [organizerId]);
    }

    // Extract score heuristics
    events.forEach(ev => {
      let score = 80;
      if (ev.admin_verification_notes) {
        const match = ev.admin_verification_notes.match(/Score:\s*(\d+)%/i);
        if (match) score = parseInt(match[1], 10);
      }
      ev.verification_score = score;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const liveListings = events.filter(e => e.verification_status === 'VERIFIED' && e.event_status !== 'CANCELLED');
    const needsActionListings = events.filter(e => ['FLAGGED', 'NEEDS_MORE_EVIDENCE', 'REJECTED'].includes(e.verification_status));
    const inReviewListings = events.filter(e => e.verification_status === 'PENDING');
    
    const totalSaves = events.reduce((acc, e) => acc + (e.save_count || 0), 0);
    const totalUpvotes = events.reduce((acc, e) => acc + (e.upvote_count || 0), 0);
    const totalReplies = events.reduce((acc, e) => acc + (e.comment_count || 0), 0);

    // Next upcoming on calendar
    const upcomingFuture = events.filter(e => e.event_date >= todayStr);
    const nextEvent = upcomingFuture.length > 0 ? upcomingFuture[0] : (events.length > 0 ? events[0] : null);

    // Attention events (Needs action)
    const attentionEvents = needsActionListings.concat(inReviewListings);

    // Upcoming listings (next 4)
    const upcomingListings = upcomingFuture.length > 0 ? upcomingFuture.slice(0, 4) : events.slice(0, 4);

    // Recent fan replies across organizer events
    let recentComments = [];
    try {
      recentComments = await db.query(`
        SELECT m.*, u.username, u.full_name, u.profile_image, e.event_name, e.slug as event_slug, e.tracking_code
        FROM event_chat_messages m
        JOIN events e ON m.event_id = e.id
        LEFT JOIN users u ON m.user_id = u.id
        WHERE e.organizer_id = ?
        ORDER BY m.created_at DESC
        LIMIT 5
      `, [organizerId]);
    } catch (commentErr) {
      console.warn('[Organizer Recent Comments Fallback]:', commentErr.message);
      recentComments = [];
    }

    res.render('organizer/dashboard', {
      stats: {
        total: events.length,
        live: liveListings.length,
        needsAction: needsActionListings.length,
        inReview: inReviewListings.length,
        totalSaves,
        totalUpvotes,
        totalReplies
      },
      nextEvent,
      attentionEvents,
      upcomingListings,
      recentComments,
      events,
      organizer: req.user,
      helpers
    });
  } catch (err) {
    console.error('[Organizer Dashboard Error]:', err);
    res.status(500).send('Error loading organizer workspace');
  }
});

// ============================================================================
// 1.5 MY EVENTS (GET /organizer/events) - Dedicated Listings Hub (Comp 2)
// ============================================================================
router.get('/events', async (req, res) => {
  const organizerId = req.user.id;
  const tab = (req.query.tab || 'all').toLowerCase();
  const search = (req.query.search || '').trim().toLowerCase();

  try {
    let events = [];
    try {
      events = await db.query(`
        SELECT e.*, a.name as artist_name, a.slug as artist_slug, c.name as category_name, c.badge_color,
          (SELECT COUNT(id) FROM event_recommendations r WHERE r.event_id = e.id) as upvote_count,
          (SELECT COUNT(id) FROM saved_events s WHERE s.event_id = e.id) as save_count,
          (SELECT COUNT(id) FROM event_chat_messages m WHERE m.event_id = e.id) as comment_count
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE e.organizer_id = ?
        ORDER BY e.created_at DESC
      `, [organizerId]);
    } catch (queryErr) {
      console.warn('[Organizer Events Query Fallback]:', queryErr.message);
      events = await db.query(`
        SELECT e.*, a.name as artist_name, a.slug as artist_slug, c.name as category_name, c.badge_color,
          0 as upvote_count,
          (SELECT COUNT(id) FROM saved_events s WHERE s.event_id = e.id) as save_count,
          (SELECT COUNT(id) FROM event_chat_messages m WHERE m.event_id = e.id) as comment_count
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE e.organizer_id = ?
        ORDER BY e.created_at DESC
      `, [organizerId]);
    }

    // Extract score heuristics
    events.forEach(ev => {
      let score = 80;
      if (ev.admin_verification_notes) {
        const match = ev.admin_verification_notes.match(/Score:\s*(\d+)%/i);
        if (match) score = parseInt(match[1], 10);
      }
      ev.verification_score = score;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const liveListings = events.filter(e => e.verification_status === 'VERIFIED' && e.event_status !== 'CANCELLED');
    const needsActionListings = events.filter(e => ['FLAGGED', 'NEEDS_MORE_EVIDENCE', 'REJECTED'].includes(e.verification_status));
    const inReviewListings = events.filter(e => e.verification_status === 'PENDING');
    const pastListings = events.filter(e => e.event_date < todayStr || e.event_status === 'COMPLETED');

    const totalSaves = events.reduce((acc, e) => acc + (e.save_count || 0), 0);
    const totalUpvotes = events.reduce((acc, e) => acc + (e.upvote_count || 0), 0);
    const totalReplies = events.reduce((acc, e) => acc + (e.comment_count || 0), 0);
    const avgScore = events.length > 0
      ? Math.round(events.reduce((acc, e) => acc + (e.verification_score || 80), 0) / events.length)
      : 0;

    let filteredEvents = events;
    if (tab === 'live') {
      filteredEvents = liveListings;
    } else if (tab === 'action') {
      filteredEvents = needsActionListings;
    } else if (tab === 'review') {
      filteredEvents = inReviewListings;
    } else if (tab === 'past') {
      filteredEvents = pastListings;
    }

    if (search) {
      filteredEvents = filteredEvents.filter(e => 
        (e.event_name && e.event_name.toLowerCase().includes(search)) ||
        (e.artist_name && e.artist_name.toLowerCase().includes(search)) ||
        (e.venue_name && e.venue_name.toLowerCase().includes(search)) ||
        (e.tracking_code && e.tracking_code.toLowerCase().includes(search))
      );
    }

    res.render('organizer/events', {
      stats: {
        total: events.length,
        live: liveListings.length,
        needsAction: needsActionListings.length,
        inReview: inReviewListings.length,
        past: pastListings.length,
        avgScore,
        totalSaves,
        totalUpvotes,
        totalReplies
      },
      currentTab: tab,
      searchQuery: search,
      events: filteredEvents,
      organizer: req.user,
      helpers
    });
  } catch (err) {
    console.error('[Organizer Events Hub Error]:', err);
    res.status(500).send('Error loading events management');
  }
});

// ============================================================================
// 1.8 POST EVENT LOGISTICAL UPDATE (POST /organizer/events/:id/update)
// ============================================================================
router.post('/events/:id/update', async (req, res) => {
  const rawIdentifier = String(req.params.id).trim();
  const isNumeric = /^\d+$/.test(rawIdentifier);
  const numericId = isNumeric ? Number(rawIdentifier) : -1;
  const organizerId = req.user.id;
  const { update_title, update_description, message } = req.body;

  const content = (update_description || message || update_title || '').trim();
  const title = (update_title || 'Official Organizer Notice').trim();

  if (!content) {
    req.session.flash = { error: 'Please enter an update message.' };
    return res.redirect('back');
  }

  try {
    const event = await db.getOne(`
      SELECT * FROM events 
      WHERE (id = ? OR tracking_code = ? OR UPPER(tracking_code) = ? OR slug = ?)
        AND (organizer_id = ? OR ? = 'ADMIN')
    `, [numericId, rawIdentifier, rawIdentifier.toUpperCase(), rawIdentifier, organizerId, req.user.role || '']);

    if (!event) {
      req.session.flash = { error: 'Event not found or permission denied.' };
      return res.redirect('/organizer/events');
    }

    // 1. Insert into event_updates
    await db.execute(`
      INSERT INTO event_updates (event_id, created_by, update_title, update_description, update_type)
      VALUES (?, ?, ?, ?, ?)
    `, [event.id, organizerId, title, content, 'Logistical Update']);

    // 2. Broadcast into event_chat_messages discussion thread with [Official Notice]
    await db.execute(`
      INSERT INTO event_chat_messages (event_id, user_id, message)
      VALUES (?, ?, ?)
    `, [event.id, organizerId, `[Official Notice] ${content}`]);

    await logActivity(
      organizerId,
      'POST_EVENT_UPDATE',
      'events',
      event.id,
      `Posted update for '${event.event_name}': ${title}`,
      req.ip
    );

    req.session.flash = { success: `Official update broadcasted for '${event.event_name}'!` };
    res.redirect('/organizer/events');
  } catch (err) {
    console.error('[Post Event Update Error]:', err);
    req.session.flash = { error: 'Failed to broadcast update.' };
    res.redirect('back');
  }
});

// ============================================================================
// 1.9 UPDATE ORGANIZER PROFILE & LOGO (POST /organizer/profile)
// ============================================================================
router.post('/profile', upload.single('profile_image_file'), async (req, res) => {
  const organizerId = req.user.id;
  const { organization_name, organization_type, bio, social_handle, social_url, profile_image_url } = req.body;
  let profile_image = req.user.profile_image;

  if (req.file) {
    profile_image = `/uploads/${req.file.filename}`;
  } else if (profile_image_url && profile_image_url.trim()) {
    profile_image = profile_image_url.trim();
  }

  try {
    await db.execute(`
      UPDATE users SET
        organization_name = ?,
        organization_type = ?,
        bio = ?,
        social_handle = ?,
        social_url = ?,
        profile_image = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      organization_name ? organization_name.trim() : req.user.organization_name,
      organization_type ? organization_type.trim() : req.user.organization_type,
      bio ? bio.trim() : req.user.bio,
      social_handle ? social_handle.trim() : req.user.social_handle,
      social_url ? social_url.trim() : req.user.social_url,
      profile_image,
      organizerId
    ]);

    req.session.flash = { success: 'Organizer workspace profile updated successfully!' };
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error('[Update Organizer Profile Error]:', err);
    req.session.flash = { error: 'Failed to update profile.' };
    res.redirect('/organizer/dashboard');
  }
});

// ============================================================================
// 2. CREATE NEW EVENT (GET /organizer/events/new)
// ============================================================================
router.get('/events/new', async (req, res) => {
  try {
    const artists = await db.query("SELECT * FROM artists ORDER BY name ASC");
    const categories = await db.query("SELECT * FROM event_categories ORDER BY name ASC");

    res.render('organizer/event-form', {
      isEdit: false,
      event: null,
      artists,
      categories,
      helpers
    });
  } catch (err) {
    console.error('[Organizer New Event Form Error]:', err);
    res.status(500).send('Error loading event creation form');
  }
});

// ============================================================================
// 3. PROCESS CREATE EVENT (POST /organizer/events/new)
// ============================================================================
router.post('/events/new', upload.fields([{ name: 'poster_files', maxCount: 4 }, { name: 'poster_file', maxCount: 1 }]), async (req, res) => {
  const organizerId = req.user.id;
  const {
    event_name,
    artist_id,
    category_id,
    event_date,
    start_time,
    end_time,
    description,
    venue_name,
    address,
    city,
    state,
    ticket_info,
    event_rules,
    official_url,
    poster_url,
    evidence_link,
    organizer_social_url,
    organizer_type
  } = req.body;

  // Validate mandatory fields
  if (!event_name || !category_id || !event_date || !start_time || !venue_name || !city) {
    req.session.flash = { error: 'Please fill in all mandatory event fields (Title, Category, Date, Time, Venue, City).' };
    return res.redirect('/organizer/events/new');
  }

  // Determine poster image
  let uploadedPosters = [];
  if (req.files) {
    if (req.files.poster_files && req.files.poster_files.length > 0) {
      uploadedPosters = req.files.poster_files.map(f => '/uploads/' + f.filename);
    } else if (req.files.poster_file && req.files.poster_file.length > 0) {
      uploadedPosters = req.files.poster_file.map(f => '/uploads/' + f.filename);
    }
  } else if (req.file) {
    uploadedPosters = ['/uploads/' + req.file.filename];
  }

  if (uploadedPosters.length === 0 && poster_url && poster_url.trim()) {
    uploadedPosters = poster_url.split(',').map(u => u.trim()).filter(Boolean);
  }

  if (uploadedPosters.length === 0) {
    uploadedPosters = ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop'];
  }

  const poster_image = uploadedPosters[0];
  const gallery_images = JSON.stringify(uploadedPosters);

  // Generate unique tracking code
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  const tracking_code = `KS-2026-${randomSuffix}`;

  const candidateData = {
    organizer_id: organizerId,
    artist_id: artist_id ? Number(artist_id) : null,
    category_id: Number(category_id),
    event_name: event_name.trim(),
    slug: helpers.slugify(event_name),
    description: description ? description.trim() : '',
    event_date,
    start_time,
    end_time: end_time || null,
    venue_name: venue_name.trim(),
    address: address ? address.trim() : '',
    city: city.trim(),
    state: state ? state.trim() : '',
    ticket_info: ticket_info ? ticket_info.trim() : '',
    event_rules: event_rules ? event_rules.trim() : '',
    official_url: official_url ? official_url.trim() : '',
    poster_image,
    gallery_images,
    event_status: 'UPCOMING',
    verification_status: 'PENDING',
    trust_level: 'PENDING',
    admin_verification_notes: '',
    tracking_code,
    submitter_name: req.user.full_name,
    submitter_email: req.user.email,
    evidence_link: evidence_link ? evidence_link.trim() : '',
    organizer_name: req.user.organization_name || req.user.full_name,
    organizer_social_url: organizer_social_url ? organizer_social_url.trim() : (req.user.social_url || ''),
    organizer_type: organizer_type ? organizer_type.trim() : (req.user.organization_type || 'Fanclub')
  };

  try {
    // Run Autonomous Dual-AI Verification Engine immediately
    const vResult = await verificationEngine.executeAutomatedVerification(candidateData);
    candidateData.verification_status = vResult.verificationStatus;
    candidateData.trust_level = vResult.trustLevel;
    candidateData.admin_verification_notes = `[Autonomous Dual-AI] ${vResult.decisionSummary} (Score: ${vResult.compositeScore}%)`;

    // Filter columns against database schema dynamically
    let existingCols = null;
    try {
      const isMy = db.isMySQL();
      const rows = await db.query(isMy ? "SHOW COLUMNS FROM events" : "PRAGMA table_info(events)");
      existingCols = new Set(rows.map(r => (r.Field || r.name || '').toLowerCase()));
    } catch (colErr) {
      existingCols = null;
    }

    const colsToInsert = existingCols 
      ? Object.keys(candidateData).filter(c => existingCols.has(c.toLowerCase()))
      : Object.keys(candidateData);

    const placeholders = colsToInsert.map(() => '?').join(', ');
    const params = colsToInsert.map(c => candidateData[c]);

    const result = await db.execute(`
      INSERT INTO events (${colsToInsert.join(', ')})
      VALUES (${placeholders})
    `, params);

    await logActivity(
      organizerId,
      'CREATE_EVENT',
      'events',
      result.insertId,
      `Event '${event_name.trim()}' created by @${req.user.username} [Verification: ${vResult.verificationStatus}]`,
      req.ip
    );

    const isVerified = vResult.verificationStatus === 'VERIFIED';
    req.session.flash = {
      [isVerified ? 'success' : 'warning']: `Event created! ${vResult.decisionSummary}`
    };

    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error('[Create Event Error]:', err);
    req.session.flash = { error: 'Failed to create event. Please check inputs and try again.' };
    res.redirect('/organizer/events/new');
  }
});

// ============================================================================
// 4. EDIT EVENT (GET /organizer/events/:id/edit)
// ============================================================================
router.get('/events/:id/edit', async (req, res) => {
  const eventId = Number(req.params.id);
  const organizerId = req.user.id;

  try {
    const event = await db.getOne(
      "SELECT * FROM events WHERE id = ? AND organizer_id = ?",
      [eventId, organizerId]
    );

    if (!event) {
      req.session.flash = { error: 'Event not found or you do not have permission to edit it.' };
      return res.redirect('/organizer/dashboard');
    }

    const artists = await db.query("SELECT * FROM artists ORDER BY name ASC");
    const categories = await db.query("SELECT * FROM event_categories ORDER BY name ASC");

    res.render('organizer/event-form', {
      isEdit: true,
      event,
      artists,
      categories,
      helpers
    });
  } catch (err) {
    console.error('[Edit Event Form Error]:', err);
    res.status(500).send('Error loading event edit form');
  }
});

// ============================================================================
// 5. PROCESS EDIT EVENT (POST /organizer/events/:id/edit)
// ============================================================================
router.post('/events/:id/edit', upload.fields([{ name: 'poster_files', maxCount: 4 }, { name: 'poster_file', maxCount: 1 }]), async (req, res) => {
  const eventId = Number(req.params.id);
  const organizerId = req.user.id;

  try {
    const existing = await db.getOne(
      "SELECT * FROM events WHERE id = ? AND organizer_id = ?",
      [eventId, organizerId]
    );

    if (!existing) {
      req.session.flash = { error: 'Event not found or permission denied.' };
      return res.redirect('/organizer/dashboard');
    }

    const {
      event_name,
      artist_id,
      category_id,
      event_date,
      start_time,
      end_time,
      description,
      venue_name,
      address,
      city,
      state,
      ticket_info,
      event_rules,
      official_url,
      poster_url,
      evidence_link,
      event_status
    } = req.body;

    let uploadedPosters = [];
    if (req.files) {
      if (req.files.poster_files && req.files.poster_files.length > 0) {
        uploadedPosters = req.files.poster_files.map(f => '/uploads/' + f.filename);
      } else if (req.files.poster_file && req.files.poster_file.length > 0) {
        uploadedPosters = req.files.poster_file.map(f => '/uploads/' + f.filename);
      }
    }
    if (uploadedPosters.length === 0 && poster_url && poster_url.trim()) {
      uploadedPosters = poster_url.split(',').map(u => u.trim()).filter(Boolean);
    }

    let poster_image = existing.poster_image;
    let gallery_images = existing.gallery_images;
    if (uploadedPosters.length > 0) {
      poster_image = uploadedPosters[0];
      gallery_images = JSON.stringify(uploadedPosters);
    }

    const updatedCandidate = {
      ...existing,
      event_name: event_name.trim(),
      slug: helpers.slugify(event_name),
      artist_id: artist_id ? Number(artist_id) : null,
      category_id: Number(category_id),
      event_date,
      start_time,
      end_time: end_time || null,
      description: description ? description.trim() : '',
      venue_name: venue_name.trim(),
      address: address ? address.trim() : '',
      city: city.trim(),
      state: state ? state.trim() : '',
      ticket_info: ticket_info ? ticket_info.trim() : '',
      event_rules: event_rules ? event_rules.trim() : '',
      official_url: official_url ? official_url.trim() : '',
      evidence_link: evidence_link ? evidence_link.trim() : '',
      poster_image,
      gallery_images,
      event_status: event_status || existing.event_status
    };

    // Autonomous re-verification on edit
    const vResult = await verificationEngine.executeAutomatedVerification(updatedCandidate, eventId);

    await db.execute(`
      UPDATE events SET
        event_name = ?,
        slug = ?,
        artist_id = ?,
        category_id = ?,
        event_date = ?,
        start_time = ?,
        end_time = ?,
        description = ?,
        venue_name = ?,
        address = ?,
        city = ?,
        state = ?,
        ticket_info = ?,
        event_rules = ?,
        official_url = ?,
        evidence_link = ?,
        poster_image = ?,
        gallery_images = ?,
        event_status = ?,
        verification_status = ?,
        trust_level = ?,
        admin_verification_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organizer_id = ?
    `, [
      updatedCandidate.event_name,
      updatedCandidate.slug,
      updatedCandidate.artist_id,
      updatedCandidate.category_id,
      updatedCandidate.event_date,
      updatedCandidate.start_time,
      updatedCandidate.end_time,
      updatedCandidate.description,
      updatedCandidate.venue_name,
      updatedCandidate.address,
      updatedCandidate.city,
      updatedCandidate.state,
      updatedCandidate.ticket_info,
      updatedCandidate.event_rules,
      updatedCandidate.official_url,
      updatedCandidate.evidence_link,
      updatedCandidate.poster_image,
      updatedCandidate.gallery_images,
      updatedCandidate.event_status,
      vResult.verificationStatus,
      vResult.trustLevel,
      `[Autonomous Dual-AI] ${vResult.decisionSummary} (Score: ${vResult.compositeScore}%)`,
      eventId,
      organizerId
    ]);

    await logActivity(
      organizerId,
      'EDIT_EVENT',
      'events',
      eventId,
      `Event #${eventId} '${updatedCandidate.event_name}' updated & re-evaluated by @${req.user.username}`,
      req.ip
    );

    req.session.flash = {
      success: `Event updated successfully! Dual-AI verification verdict: ${vResult.verificationStatus}.`
    };
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error('[Edit Event Process Error]:', err);
    req.session.flash = { error: 'Failed to update event.' };
    res.redirect(`/organizer/events/${eventId}/edit`);
  }
});

// ============================================================================
// 6. UPDATE EVENT STATUS (POST /organizer/events/:id/status)
// ============================================================================
router.post('/events/:id/status', async (req, res) => {
  const eventId = Number(req.params.id);
  const organizerId = req.user.id;
  const { event_status } = req.body;

  const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'POSTPONED', 'CANCELLED'];
  if (!validStatuses.includes(event_status)) {
    req.session.flash = { error: 'Invalid event status.' };
    return res.redirect('/organizer/dashboard');
  }

  try {
    await db.execute(
      "UPDATE events SET event_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND organizer_id = ?",
      [event_status, eventId, organizerId]
    );

    await logActivity(
      organizerId,
      'UPDATE_EVENT_STATUS',
      'events',
      eventId,
      `Event #${eventId} status changed to ${event_status}`,
      req.ip
    );

    req.session.flash = { success: `Event status updated to ${event_status}.` };
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error('[Update Status Error]:', err);
    req.session.flash = { error: 'Failed to update status.' };
    res.redirect('/organizer/dashboard');
  }
});

// ============================================================================
// 7. DELETE EVENT (POST /organizer/events/:id/delete)
// ============================================================================
router.post('/events/:id/delete', async (req, res) => {
  const eventId = Number(req.params.id);
  const organizerId = req.user.id;

  try {
    const existing = await db.getOne(
      "SELECT * FROM events WHERE id = ? AND organizer_id = ?",
      [eventId, organizerId]
    );

    if (!existing) {
      req.session.flash = { error: 'Event not found or permission denied.' };
      return res.redirect('/organizer/dashboard');
    }

    await db.execute("DELETE FROM events WHERE id = ? AND organizer_id = ?", [eventId, organizerId]);

    await logActivity(
      organizerId,
      'DELETE_EVENT',
      'events',
      eventId,
      `Event #${eventId} '${existing.event_name}' deleted by organizer @${req.user.username}`,
      req.ip
    );

    req.session.flash = { success: `Event '${existing.event_name}' has been deleted.` };
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error('[Delete Event Error]:', err);
    req.session.flash = { error: 'Failed to delete event.' };
    res.redirect('/organizer/dashboard');
  }
});

// ============================================================================
// 7.5 SUBMISSION LOOKUP (GET /organizer/events/lookup)
// ============================================================================
router.get('/events/lookup', (req, res) => {
  const code = (req.query.code || req.query.reference || '').trim();
  if (!code) {
    req.session.flash = { error: 'Please enter a valid reference code or event name.' };
    return res.redirect('/organizer/dashboard');
  }
  return res.redirect(`/organizer/events/${encodeURIComponent(code)}/verification`);
});

// ============================================================================
// 8. DUAL-AI VERIFICATION DETAILS (GET /organizer/events/:id/verification)
// ============================================================================
router.get('/events/:id/verification', async (req, res) => {
  const rawIdentifier = String(req.params.id).trim();
  const isNumeric = /^\d+$/.test(rawIdentifier);
  const numericId = isNumeric ? Number(rawIdentifier) : -1;
  const organizerId = req.user.id;

  try {
    const event = await db.getOne(`
      SELECT e.*, a.name as artist_name, a.slug as artist_slug, c.name as category_name
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE (e.id = ? OR e.tracking_code = ? OR UPPER(e.tracking_code) = ? OR e.slug = ?)
        AND (e.organizer_id = ? OR ? = 'ADMIN')
    `, [numericId, rawIdentifier, rawIdentifier.toUpperCase(), rawIdentifier, organizerId, req.user.role || '']);

    if (!event) {
      req.session.flash = { error: 'Event not found or you do not have permission to view its report.' };
      return res.redirect('/organizer/dashboard');
    }

    // Pass organizer account standing for Check 12
    event.is_verified_organizer = req.user.is_verified_organizer;
    event.organizer_name = req.user.organization_name || req.user.full_name;
    event.organizer_social_url = req.user.social_url;

    // Run live verification telemetry
    const vResult = await verificationEngine.executeAutomatedVerification(event, event.id);

    res.render('organizer/event-verification', {
      event,
      vResult,
      helpers
    });
  } catch (err) {
    console.error('[Verification Telemetry Error]:', err);
    res.status(500).send('Error loading verification telemetry');
  }
});

// ============================================================================
// 9. ON-DEMAND RE-VERIFICATION (POST /organizer/events/:id/reverify)
// ============================================================================
router.post('/events/:id/reverify', async (req, res) => {
  const rawIdentifier = String(req.params.id).trim();
  const isNumeric = /^\d+$/.test(rawIdentifier);
  const numericId = isNumeric ? Number(rawIdentifier) : -1;
  const organizerId = req.user.id;

  try {
    const event = await db.getOne(`
      SELECT * FROM events 
      WHERE (id = ? OR tracking_code = ? OR UPPER(tracking_code) = ? OR slug = ?)
        AND (organizer_id = ? OR ? = 'ADMIN')
    `, [numericId, rawIdentifier, rawIdentifier.toUpperCase(), rawIdentifier, organizerId, req.user.role || '']);

    if (!event) {
      req.session.flash = { error: 'Event not found.' };
      return res.redirect('/organizer/dashboard');
    }

    const eventId = event.id;
    const vResult = await verificationEngine.executeAutomatedVerification(event, eventId);

    await db.execute(`
      UPDATE events SET
        verification_status = ?,
        trust_level = ?,
        admin_verification_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organizer_id = ?
    `, [
      vResult.verificationStatus,
      vResult.trustLevel,
      `[Autonomous Dual-AI] ${vResult.decisionSummary} (Score: ${vResult.compositeScore}%)`,
      eventId,
      event.organizer_id
    ]);

    req.session.flash = {
      success: `Dual-AI Re-evaluation complete! Outcome: ${vResult.verificationStatus} (${vResult.decisionSummary})`
    };
    res.redirect(`/organizer/events/${event.tracking_code || event.slug || event.id}/verification`);
  } catch (err) {
    console.error('[Re-verify Error]:', err);
    req.session.flash = { error: 'Re-verification failed.' };
    res.redirect(`/organizer/events/${rawIdentifier}/verification`);
  }
});

export default router;
