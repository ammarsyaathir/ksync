// src/routes/notifications.js - Notification Center Routes
import express from 'express';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import helpers, { generateEventRemindersForUser } from '../utils/helpers.js';

const router = express.Router();

// GET /notifications - User Notification Center (Supports filters and auto-reminders)
router.get('/notifications', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const filter = req.query.filter === 'unread' ? 'unread' : 'all';

  try {
    // 1. Proactively generate event countdown reminders for user's saved events
    await generateEventRemindersForUser(userId);

    // 2. Fetch notifications
    let query = "SELECT * FROM notifications WHERE user_id = ?";
    const params = [userId];

    if (filter === 'unread') {
      query += " AND is_read = 0";
    }

    query += " ORDER BY created_at DESC LIMIT 60";
    const notifications = await db.query(query, params);

    // 3. Count total unread
    const unreadResult = await db.getOne(
      "SELECT count(id) as cnt FROM notifications WHERE user_id = ? AND is_read = 0",
      [userId]
    );
    const totalUnread = unreadResult ? unreadResult.cnt : 0;

    res.render('notifications', {
      notifications,
      helpers,
      currentFilter: filter,
      totalUnread
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).send('Error loading notifications');
  }
});

// POST /notifications/mark-all-read - Mark all as read
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

// POST /notifications/:id/read - Mark single notification as read
router.post('/notifications/:id/read', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const notifId = req.params.id;
  try {
    await db.execute("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?", [notifId, userId]);
    res.redirect(req.header('Referer') || '/notifications');
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.redirect('/notifications');
  }
});

// POST /notifications/:id/delete - Delete single notification
router.post('/notifications/:id/delete', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const notifId = req.params.id;
  try {
    await db.execute("DELETE FROM notifications WHERE id = ? AND user_id = ?", [notifId, userId]);
    req.session.flash = { info: 'Notification removed.' };
    res.redirect(req.header('Referer') || '/notifications');
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.redirect('/notifications');
  }
});

export default router;
