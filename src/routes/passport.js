// src/routes/passport.js - Digital K-Sync Concert Passport & Fandom Badges
import express from 'express';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { getUserPassportData, BADGE_DEFINITIONS } from '../utils/badges.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

// GET /passport - View Current User's Passport
router.get('/passport', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login?redirect=/passport');
  }

  const userId = req.session.userId;
  try {
    const user = await db.getOne("SELECT id, username, full_name, profile_image, location, role, created_at FROM users WHERE id = ?", [userId]);
    if (!user) {
      return res.redirect('/login');
    }

    const passportData = await getUserPassportData(userId);

    // Fetch verified events that the fan can stamp into their passport
    const availableEvents = await db.query(`
      SELECT e.id, e.event_name, e.event_date, e.venue_name, e.city,
             a.name as artist_name, a.image_url as artist_image
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      WHERE e.verification_status = 'VERIFIED'
      ORDER BY e.event_date DESC
    `);

    res.render('passport', {
      user,
      isOwner: true,
      passport: passportData,
      availableEvents,
      activePath: '/passport',
      title: `${user.full_name}'s Digital K-Pop Concert Passport | K-Sync Malaysia`,
      helpers
    });
  } catch (err) {
    console.error('Error loading passport:', err);
    res.status(500).send('Error loading concert passport');
  }
});

// GET /passport/:username - Public Passport Shareable Profile
router.get('/passport/:username', async (req, res) => {
  const username = req.params.username.trim();

  try {
    const user = await db.getOne("SELECT id, username, full_name, profile_image, location, role, created_at FROM users WHERE username = ?", [username]);
    if (!user) {
      req.session.flash = { error: `Fan passport for @${username} was not found.` };
      return res.redirect('/events');
    }

    const isOwner = req.session && req.session.userId === user.id;
    const passportData = await getUserPassportData(user.id);

    const availableEvents = isOwner ? await db.query(`
      SELECT e.id, e.event_name, e.event_date, e.venue_name, e.city,
             a.name as artist_name, a.image_url as artist_image
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      WHERE e.verification_status = 'VERIFIED'
      ORDER BY e.event_date DESC
    `) : [];

    res.render('passport', {
      user,
      isOwner,
      passport: passportData,
      availableEvents,
      activePath: '/passport',
      title: `${user.full_name} (@${user.username}) - K-Pop Concert Passport | K-Sync Malaysia`,
      helpers
    });
  } catch (err) {
    console.error('Error loading public passport:', err);
    res.status(500).send('Error loading fan passport');
  }
});

// POST /api/passport/stamp - Stamp an Event into Passport
router.post('/api/passport/stamp', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const { event_id, seat_section, attendance_status, fan_review } = req.body;

  if (!event_id) {
    return res.status(400).json({ status: 'error', message: 'Event selection is required' });
  }

  try {
    const event = await db.getOne("SELECT id, event_name FROM events WHERE id = ?", [Number(event_id)]);
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    // Check if already stamped
    const existing = await db.getOne("SELECT id FROM user_passport_stamps WHERE user_id = ? AND event_id = ?", [userId, Number(event_id)]);
    if (existing) {
      await db.execute(`
        UPDATE user_passport_stamps 
        SET seat_section = ?, attendance_status = ?, fan_review = ?, stamped_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [seat_section || 'General Seated / Standing', attendance_status || 'ATTENDED', fan_review || null, existing.id]);
    } else {
      await db.execute(`
        INSERT INTO user_passport_stamps (user_id, event_id, seat_section, attendance_status, fan_review)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, Number(event_id), seat_section || 'General Seated / Standing', attendance_status || 'ATTENDED', fan_review || null]);
    }

    const updatedPassport = await getUserPassportData(userId);
    res.json({
      status: 'success',
      message: `Stamped ${event.event_name} into your Digital Passport!`,
      passport: updatedPassport
    });
  } catch (err) {
    console.error('Error stamping passport:', err);
    res.status(500).json({ status: 'error', message: 'Failed to stamp passport: ' + err.message });
  }
});

// DELETE /api/passport/stamp/:id - Remove a Stamp from Passport
router.delete('/api/passport/stamp/:id', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const stampId = Number(req.params.id);

  try {
    const stamp = await db.getOne("SELECT id, user_id FROM user_passport_stamps WHERE id = ?", [stampId]);
    if (!stamp) {
      return res.status(404).json({ status: 'error', message: 'Stamp not found' });
    }
    if (stamp.user_id !== userId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized to remove this stamp' });
    }

    await db.execute("DELETE FROM user_passport_stamps WHERE id = ?", [stampId]);
    const updatedPassport = await getUserPassportData(userId);

    res.json({
      status: 'success',
      message: 'Stamp removed from your passport',
      passport: updatedPassport
    });
  } catch (err) {
    console.error('Error deleting stamp:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete stamp' });
  }
});

export default router;
