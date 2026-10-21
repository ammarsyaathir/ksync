// src/routes/saved.js - Bookmarked Events & Personalized Fan Dashboard (UC016)
import express from 'express';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

// GET /dashboard - Personalized Fan Dashboard ("My K-Sync") (UC016)
router.get('/dashboard', requireAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    // 1. Fetch user profile
    const user = await db.getOne("SELECT * FROM users WHERE id = ?", [userId]);

    // 2. Fetch saved/wishlisted events with artist & category info
    const saved_events = await db.query(`
      SELECT e.*, se.saved_at,
             a.name as artist_name, a.image_url as artist_image,
             c.name as category_name, c.badge_color,
             e.venue_name as venue_display
      FROM saved_events se
      JOIN events e ON se.event_id = e.id
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE se.user_id = ?
      ORDER BY e.event_date ASC, e.start_time ASC
    `, [userId]);

    // 3. Next immediate upcoming show for Hero Live Countdown
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingSaved = saved_events.filter(e => {
      const evDateStr = e.event_date instanceof Date ? e.event_date.toISOString().split('T')[0] : String(e.event_date || '');
      return evDateStr >= todayStr;
    });
    const nextEvent = upcomingSaved.length > 0 ? upcomingSaved[0] : null;

    // 4. Fetch events recommended/upvoted by user (UC018 Crowdsourced Reliability)
    const recommended_events = await db.query(`
      SELECT e.*, er.created_at as recommended_at,
             a.name as artist_name, c.name as category_name,
             (SELECT COUNT(*) FROM event_recommendations WHERE event_id = e.id) as total_recommendations
      FROM event_recommendations er
      JOIN events e ON er.event_id = e.id
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE er.user_id = ?
      ORDER BY er.created_at DESC
    `, [userId]);

    // 5. Fetch recent notifications
    const recent_notifications = await db.query(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [userId]);

    const unreadRow = await db.getOne("SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND is_read = 0", [userId]);
    const unreadCount = unreadRow ? unreadRow.cnt : 0;

    res.render('dashboard', {
      user,
      saved_events,
      upcomingSaved,
      nextEvent,
      recommended_events,
      recent_notifications,
      unreadCount,
      activePath: '/dashboard',
      helpers
    });
  } catch (err) {
    console.error('Error loading Fan Dashboard:', err);
    res.status(500).send('Error loading dashboard');
  }
});

// GET /my-ksync alias
router.get('/my-ksync', requireAuth, (req, res) => res.redirect('/dashboard'));

// GET /saved-events - Bookmarked Events List (Redirect or standalone)
router.get('/saved-events', requireAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    const saved_events = await db.query(`
      SELECT e.*, se.saved_at,
             a.name as artist_name,
             c.name as category_name
      FROM saved_events se
      JOIN events e ON se.event_id = e.id
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE se.user_id = ?
      ORDER BY e.event_date ASC
    `, [userId]);

    res.render('saved-events', {
      saved_events,
      activePath: '/saved-events',
      helpers
    });
  } catch (err) {
    console.error('Error fetching saved events:', err);
    res.status(500).send('Error loading saved events');
  }
});

export default router;
