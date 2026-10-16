// src/routes/notifications.js - Notification Center Routes
import express from 'express';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

router.get('/notifications', requireAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    const notifications = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [userId]
    );

    res.render('notifications', {
      notifications,
      helpers
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).send('Error loading notifications');
  }
});

router.post('/notifications/mark-all-read', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  try {
    await db.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [userId]);
    req.session.flash = { success: 'All notifications marked as read.' };
    res.redirect('/notifications');
  } catch (err) {
    console.error('Error marking notifications read:', err);
    res.redirect('/notifications');
  }
});

export default router;
