// src/routes/submissions.js - Model 2 Public Event Submissions & Status Tracking
import express from 'express';
import crypto from 'crypto';
import db from '../../config/database.js';
import upload from '../middleware/upload.js';
import { logActivity } from '../utils/helpers.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

// GET /submit-event - Public Open Submission Form
router.get('/submit-event', async (req, res) => {
  try {
    const artists = await db.query("SELECT * FROM artists ORDER BY name ASC");
    const categories = await db.query("SELECT * FROM event_categories ORDER BY name ASC");
    const venues = await db.query("SELECT * FROM venues ORDER BY name ASC");

    res.render('submit-event', {
      artists,
      categories,
      venues
    });
  } catch (err) {
    console.error('Error rendering submit-event form:', err);
    res.status(500).send('Error loading submission form');
  }
});

// POST /submit-event - Process Model 2 Submission
router.post('/submit-event', upload.single('poster_file'), async (req, res) => {
  const {
    submitter_name,
    submitter_email,
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
    poster_url
  } = req.body;

  if (!event_name || !category_id || !event_date || !start_time || !venue_name || !city || !submitter_name || !submitter_email) {
    req.session.flash = { error: 'Please fill in all mandatory fields.' };
    return res.redirect('/submit-event');
  }

  // Determine poster image
  let poster_image = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop';
  if (req.file) {
    poster_image = '/uploads/' + req.file.filename;
  } else if (poster_url && poster_url.trim()) {
    poster_image = poster_url.trim();
  }

  // Generate unique tracking code e.g. KS-2026-X7Y8Z
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  const tracking_code = `KS-2026-${randomSuffix}`;

  const organizer_id = (req.session && req.session.userId) ? req.session.userId : 2; // Default organizer id for guest submissions

  try {
    const result = await db.execute(`
      INSERT INTO events (
        organizer_id, artist_id, category_id, venue_id,
        event_name, description, event_date, start_time, end_time,
        venue_name, address, city, state, ticket_info, event_rules, official_url,
        poster_image, event_status, verification_status, tracking_code, submitter_name, submitter_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING', 'PENDING', ?, ?, ?)
    `, [
      organizer_id,
      artist_id ? Number(artist_id) : null,
      Number(category_id),
      null, // venue_id
      event_name.trim(),
      description ? description.trim() : '',
      event_date,
      start_time,
      end_time || null,
      venue_name.trim(),
      address ? address.trim() : '',
      city.trim(),
      state ? state.trim() : '',
      ticket_info ? ticket_info.trim() : '',
      event_rules ? event_rules.trim() : '',
      official_url ? official_url.trim() : '',
      poster_image,
      tracking_code,
      submitter_name.trim(),
      submitter_email.trim()
    ]);

    await logActivity(
      organizer_id,
      'SUBMIT_EVENT',
      'events',
      result.insertId,
      `Event '${event_name.trim()}' submitted by ${submitter_name.trim()} [Tracking Code: ${tracking_code}]`,
      req.ip
    );

    res.redirect(`/submission-success?code=${encodeURIComponent(tracking_code)}`);
  } catch (err) {
    console.error('Submission error:', err);
    req.session.flash = { error: 'Failed to record event submission. Please check your inputs.' };
    res.redirect('/submit-event');
  }
});

// GET /submission-success
router.get('/submission-success', async (req, res) => {
  const code = req.query.code ? req.query.code.trim() : '';
  let event = null;

  if (code) {
    event = await db.getOne("SELECT * FROM events WHERE tracking_code = ?", [code]);
  }

  res.render('submission-success', {
    code,
    event,
    helpers
  });
});

// GET /check-submission
router.get('/check-submission', async (req, res) => {
  const code = req.query.code ? req.query.code.trim() : '';
  let event = null;
  let searched = false;

  if (code) {
    searched = true;
    event = await db.getOne(`
      SELECT e.*, a.name as artist_name, c.name as category_name
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE LOWER(e.tracking_code) = LOWER(?) OR LOWER(e.submitter_email) = LOWER(?)
      ORDER BY e.created_at DESC
    `, [code, code]);
  }

  res.render('check-submission', {
    queryCode: code,
    event,
    searched,
    helpers
  });
});

// POST /check-submission/resubmit - UC23: Correct and Resubmit Event
router.post('/check-submission/resubmit', async (req, res) => {
  const { event_id, tracking_code, event_name, official_url, poster_image, description } = req.body;

  try {
    const ev = await db.getOne("SELECT * FROM events WHERE id = ? AND tracking_code = ?", [event_id, tracking_code]);

    if (!ev) {
      req.session.flash = { error: 'Invalid event or tracking code.' };
      return res.redirect('/check-submission');
    }

    await db.execute(`
      UPDATE events SET 
        event_name = ?,
        official_url = ?,
        poster_image = ?,
        description = ?,
        verification_status = 'PENDING',
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [event_name.trim(), official_url.trim(), poster_image.trim(), description.trim(), event_id]);

    await logActivity(
      ev.organizer_id,
      'RESUBMIT_EVENT',
      'events',
      event_id,
      `Event '${event_name.trim()}' [Ref: ${tracking_code}] corrected and resubmitted by organizer`,
      req.ip
    );

    req.session.flash = { success: `Event '${event_name.trim()}' updated and resubmitted! Status reset to PENDING for admin review.` };
    res.redirect(`/check-submission?code=${encodeURIComponent(tracking_code)}`);
  } catch (err) {
    console.error('Resubmission error:', err);
    req.session.flash = { error: 'Failed to update event.' };
    res.redirect(`/check-submission?code=${encodeURIComponent(tracking_code)}`);
  }
});

export default router;
