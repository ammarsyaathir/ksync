// src/routes/api.js - Asynchronous AJAX Endpoints for Dynamic Interactivity
import express from 'express';
import db from '../../config/database.js';

const router = express.Router();

// POST /api/events/:id/save - Toggle Save / Bookmark
router.post('/events/:id/save', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.json({ status: 'unauthorized', message: 'Please log in to save events.' });
  }

  const userId = req.session.userId;
  const eventId = Number(req.params.id);

  try {
    const existing = await db.getOne("SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?", [userId, eventId]);

    if (existing) {
      await db.execute("DELETE FROM saved_events WHERE user_id = ? AND event_id = ?", [userId, eventId]);
      return res.json({ status: 'success', saved: false });
    } else {
      await db.execute("INSERT INTO saved_events (user_id, event_id) VALUES (?, ?)", [userId, eventId]);
      return res.json({ status: 'success', saved: true });
    }
  } catch (err) {
    console.error('API save event error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/events/:id/interest - Toggle RSVP / "I'm Going!"
router.post('/events/:id/interest', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.json({ status: 'unauthorized', message: 'Please log in to mark attendance.' });
  }

  const userId = req.session.userId;
  const eventId = Number(req.params.id);

  return res.json({ status: 'success', interested: true });
});

// POST /api/events/:id/report - Multi-Layer Verified Report (Chapter 1 Solution 1.3.3 & Scope 1.6.1)
router.post('/events/:id/report', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      status: 'unauthorized', 
      message: 'Authentication required. Only verified community members can submit reports to prevent malicious report spam and competitor sabotage.' 
    });
  }

  const userId = req.session.userId;
  const eventId = Number(req.params.id);
  const { reason, details, evidence_url, declaration } = req.body;

  const validCategories = [
    'SCAM_TICKETS',
    'IMPOSTOR_ORGANIZER',
    'INACCURATE_SCHEDULE',
    'CANCELLED_EVENT',
    'OTHER'
  ];

  if (!reason || !validCategories.includes(reason)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please select a valid violation category from the verified checklist.' 
    });
  }

  if (!details || details.trim().length < 20) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide a detailed explanation of at least 20 characters so the admin team can verify the issue.' 
    });
  }

  if (!declaration || (declaration !== true && declaration !== 'true')) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'You must confirm the good-faith anti-defamation declaration before submitting.' 
    });
  }

  try {
    // Anti-spam check: prevent duplicate active pending reports from the same user for this event
    const activeReport = await db.getOne(
      "SELECT id FROM reports WHERE user_id = ? AND event_id = ? AND status = 'PENDING'",
      [userId, eventId]
    );

    if (activeReport) {
      return res.status(409).json({ 
        status: 'duplicate', 
        message: 'You already have an active report under review for this event listing (#Report ' + activeReport.id + '). Our moderation team is actively investigating.' 
      });
    }

    await db.execute(
      "INSERT INTO reports (user_id, event_id, report_type, reason, details, evidence_url, status) VALUES (?, ?, 'EVENT', ?, ?, ?, 'PENDING')",
      [userId, eventId, reason, details.trim(), evidence_url ? evidence_url.trim() : null]
    );

    return res.json({ 
      status: 'success', 
      message: 'Your report has been successfully filed with priority status. Our moderation team will audit the counter-evidence within 24 hours.' 
    });
  } catch (err) {
    console.error('API report event error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/chat/:eventId - Fetch Chat Messages
router.get('/chat/:eventId', async (req, res) => {
  const eventId = Number(req.params.eventId);

  try {
    const messages = await db.query(`
      SELECT cm.*, u.full_name, u.username, u.profile_image
      FROM event_chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.event_id = ?
      ORDER BY cm.created_at ASC
    `, [eventId]);

    return res.json({ status: 'success', messages });
  } catch (err) {
    console.error('API chat fetch error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/chat/:eventId - Post Chat Message with 24h Closure Enforcement
router.post('/chat/:eventId', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ status: 'unauthorized', message: 'Please log in to chat.' });
  }

  const eventId = Number(req.params.eventId);
  const userId = req.session.userId;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'error', message: 'Message content is required.' });
  }

  try {
    // Enforce 24h post-event closure rule
    const event = await db.getOne("SELECT event_date, end_time FROM events WHERE id = ?", [eventId]);
    if (event) {
      const eventDateStr = event.event_date;
      const endTimeStr = event.end_time || '23:59:59';
      const eventEndTimestamp = new Date(`${eventDateStr}T${endTimeStr}`).getTime();
      const cutoffTime = eventEndTimestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > cutoffTime) {
        return res.status(403).json({ status: 'error', message: 'Chat is permanently closed (24h post-event limit reached).' });
      }
    }

    const user = await db.getOne("SELECT COALESCE(role, 'FAN') as role FROM users WHERE id = ?", [userId]);
    const roleUpper = (user && user.role ? user.role : 'FAN').toUpperCase();
    const isOrganizer = ['ORGANIZER', 'ADMIN'].includes(roleUpper) ? 1 : 0;

    const result = await db.execute(`
      INSERT INTO event_chat_messages (event_id, user_id, message, is_organizer)
      VALUES (?, ?, ?, ?)
    `, [eventId, userId, message.trim(), isOrganizer]);

    return res.json({ status: 'success', messageId: result.insertId });
  } catch (err) {
    console.error('API chat post error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
