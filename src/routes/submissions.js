// src/routes/submissions.js - Model 2 Public Event Submissions & Status Tracking
import express from 'express';
import crypto from 'crypto';
import db from '../../config/database.js';
import upload from '../middleware/upload.js';
import { logActivity, notifyAdmins } from '../utils/helpers.js';
import helpers from '../utils/helpers.js';
import { sendSubmissionConfirmationEmail } from '../utils/mailer.js';

const router = express.Router();

// GET /submit-event - Public Open Submission Form
router.get('/submit-event', async (req, res) => {
  try {
    const artists = await db.query("SELECT * FROM artists ORDER BY name ASC");
    const categories = await db.query("SELECT * FROM event_categories ORDER BY name ASC");

    res.render('submit-event', {
      artists,
      categories,
      venues: []
    });
  } catch (err) {
    console.error('Error rendering submit-event form:', err);
    res.status(500).send('Error loading submission form');
  }
});

// POST /submit-event - Process Model 2 Submission (Supports 1 to 4 Posters / Seating Plans)
router.post('/submit-event', upload.fields([{ name: 'poster_files', maxCount: 4 }, { name: 'poster_file', maxCount: 1 }]), async (req, res) => {
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
    poster_url,
    evidence_link,
    organizer_name,
    organizer_social_url,
    organizer_type,
    declaration_confirmed
  } = req.body;

  if (!event_name || !category_id || !event_date || !start_time || !venue_name || !city || !submitter_name || !submitter_email) {
    req.session.flash = { error: 'Please fill in all mandatory event and contact fields.' };
    return res.redirect('/submit-event');
  }

  if (!evidence_link || !evidence_link.trim()) {
    req.session.flash = { error: 'Proof of authenticity (official announcement / evidence link) is mandatory to prevent false submissions.' };
    return res.redirect('/submit-event');
  }

  // Determine poster images (1 to 4 images supported)
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

  // Generate completely unpredictable 6-character random tracking code (e.g. KS-2026-7F3K9Q)
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  const tracking_code = `KS-2026-${randomSuffix}`;

  let organizer_id = (req.session && req.session.userId) ? req.session.userId : null;
  if (!organizer_id) {
    const defaultUser = await db.getOne("SELECT id FROM users ORDER BY id ASC LIMIT 1");
    organizer_id = defaultUser ? defaultUser.id : 1;
  }

  try {
    const candidateData = {
      organizer_id,
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
      tracking_code,
      submitter_name: submitter_name.trim(),
      submitter_email: submitter_email.trim(),
      evidence_link: evidence_link ? evidence_link.trim() : '',
      organizer_name: organizer_name ? organizer_name.trim() : submitter_name.trim(),
      organizer_social_url: organizer_social_url ? organizer_social_url.trim() : '',
      organizer_type: organizer_type ? organizer_type.trim() : 'Fanclub'
    };

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
      organizer_id,
      'SUBMIT_EVENT',
      'events',
      result.insertId,
      `Event '${event_name.trim()}' submitted by ${submitter_name.trim()} [Tracking Code: ${tracking_code}]`,
      req.ip
    );

    // Send Real Confirmation Email to Submitter/Organizer (UC20)
    if (submitter_email && submitter_email.trim()) {
      sendSubmissionConfirmationEmail({
        to: submitter_email.trim(),
        name: submitter_name.trim(),
        eventName: event_name.trim(),
        eventDate: event_date,
        venueName: venue_name.trim(),
        trackingCode: tracking_code
      }).catch(e => console.error('[Submission Route] Confirmation email delivery error:', e.message));
    }

    // In-app notification to all Admins about pending verification
    notifyAdmins(
      `📋 New Submission: '${event_name.trim()}' by ${submitter_name.trim()} (${submitter_email || 'No email'}) is waiting for verification.`,
      result.insertId,
      'New Event Submission'
    ).catch(e => console.error('Admin notification error:', e.message));

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
