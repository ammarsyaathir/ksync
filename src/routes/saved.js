// src/routes/saved.js - Bookmarked Events Routes
import express from 'express';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

router.get('/saved-events', requireAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    const saved_events = await db.query(`
      SELECT e.*, se.saved_at,
             a.name as artist_name,
             c.name as category_name,
             v.name as venue_display
      FROM saved_events se
      JOIN events e ON se.event_id = e.id
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE se.user_id = ?
      ORDER BY e.event_date ASC
    `, [userId]);

    res.render('saved-events', {
      saved_events,
      helpers
    });
  } catch (err) {
    console.error('Error fetching saved events:', err);
    res.status(500).send('Error loading saved events');
  }
});

export default router;
