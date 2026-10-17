// src/routes/buddies.js - Concert Buddy Matching & Direct Chat Routes
import express from 'express';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

// GET /buddies
router.get('/buddies', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const eventId = req.query.event_id ? Number(req.query.event_id) : 0;
  const activeTab = req.query.tab || 'discover';

  try {
    const eventsList = await db.query(
      "SELECT id, event_name, event_date, city FROM events WHERE verification_status = 'VERIFIED' ORDER BY event_date ASC"
    );

    // Interested Fans for the selected event
    let interestedFans = [];
    if (eventId > 0) {
      interestedFans = await db.query(`
        SELECT u.id, u.full_name, u.profile_image, u.bio, u.location, u.buddy_preference,
               br.status as connection_status
        FROM event_interest ei
        JOIN users u ON ei.user_id = u.id
        LEFT JOIN buddy_requests br ON (br.event_id = ei.event_id AND ((br.sender_id = ? AND br.receiver_id = u.id) OR (br.sender_id = u.id AND br.receiver_id = ?)))
        WHERE ei.event_id = ? AND u.id != ?
        ORDER BY ei.created_at DESC
      `, [userId, userId, eventId, userId]);
    }

    // My Accepted Connections
    const connections = await db.query(`
      SELECT br.*, 
             CASE WHEN br.sender_id = ? THEN u2.id ELSE u1.id END as buddy_id,
             CASE WHEN br.sender_id = ? THEN u2.full_name ELSE u1.full_name END as buddy_name,
             CASE WHEN br.sender_id = ? THEN u2.profile_image ELSE u1.profile_image END as buddy_image,
             CASE WHEN br.sender_id = ? THEN u2.location ELSE u1.location END as buddy_location,
             e.event_name
      FROM buddy_requests br
      JOIN users u1 ON br.sender_id = u1.id
      JOIN users u2 ON br.receiver_id = u2.id
      JOIN events e ON br.event_id = e.id
      WHERE (br.sender_id = ? OR br.receiver_id = ?) AND br.status = 'ACCEPTED'
      ORDER BY br.responded_at DESC
    `, [userId, userId, userId, userId, userId, userId]);

    // Pending incoming requests
    const pendingRequests = await db.query(`
      SELECT br.*, u.full_name as sender_name, u.profile_image, u.location, e.event_name
      FROM buddy_requests br
      JOIN users u ON br.sender_id = u.id
      JOIN events e ON br.event_id = e.id
      WHERE br.receiver_id = ? AND br.status = 'PENDING'
      ORDER BY br.created_at DESC
    `, [userId]);

    res.render('buddies', {
      eventsList,
      selectedEventId: eventId,
      interestedFans,
      connections,
      pendingRequests,
      activeTab,
      helpers
    });
  } catch (err) {
    console.error('Buddy hub error:', err);
    res.status(500).send('Error loading buddy directory');
  }
});

// POST /buddies/request - Send connection request
router.post('/buddies/request', requireAuth, async (req, res) => {
  const { receiver_id, event_id } = req.body;
  const senderId = req.session.userId;

  try {
    // Check if request already exists
    const existing = await db.getOne(`
      SELECT id FROM buddy_requests 
      WHERE event_id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
    `, [event_id, senderId, receiver_id, receiver_id, senderId]);

    if (!existing) {
      await db.execute(`
        INSERT INTO buddy_requests (sender_id, receiver_id, event_id, status)
        VALUES (?, ?, ?, 'PENDING')
      `, [senderId, receiver_id, event_id]);

      // Notify recipient
      await db.execute(`
        INSERT INTO notifications (user_id, event_id, message)
        VALUES (?, ?, 'You have a new Concert Buddy request!')
      `, [receiver_id, event_id]);
    }

    req.session.flash = { success: 'Buddy request sent!' };
    res.redirect(`/buddies?event_id=${event_id}&tab=discover`);
  } catch (err) {
    console.error('Buddy request error:', err);
    req.session.flash = { error: 'Failed to send request.' };
    res.redirect(`/buddies?event_id=${event_id}`);
  }
});

// POST /buddies/respond - Accept or decline request
router.post('/buddies/respond', requireAuth, async (req, res) => {
  const { request_id, action } = req.body;
  const userId = req.session.userId;

  try {
    const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
    await db.execute(`
      UPDATE buddy_requests 
      SET status = ?, responded_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND receiver_id = ?
    `, [status, request_id, userId]);

    req.session.flash = { success: `Buddy request ${action}ed!` };
    res.redirect('/buddies?tab=connections');
  } catch (err) {
    console.error('Error responding to buddy request:', err);
    res.redirect('/buddies?tab=requests');
  }
});

// GET /buddies/chat/:id - 1-on-1 Direct Chat
router.get('/buddies/chat/:id', requireAuth, async (req, res) => {
  const buddyId = Number(req.params.id);
  const userId = req.session.userId;
  const eventId = req.query.event_id ? Number(req.query.event_id) : 0;

  try {
    const buddyUser = await db.getOne("SELECT id, full_name, username, profile_image FROM users WHERE id = ?", [buddyId]);
    if (!buddyUser) {
      req.session.flash = { error: 'User not found.' };
      return res.redirect('/buddies?tab=connections');
    }

    // Authorization Check: Only allow direct chat between mutually accepted buddies
    const isConnected = await db.getOne(`
      SELECT id FROM buddy_requests 
      WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
      AND status = 'ACCEPTED'
    `, [userId, buddyId, buddyId, userId]);

    if (!isConnected) {
      req.session.flash = { error: 'You can only message accepted concert buddies. Please send a connection request first.' };
      return res.redirect('/buddies?tab=connections');
    }

    let event = null;
    if (eventId > 0) {
      event = await db.getOne("SELECT id, event_name, event_date FROM events WHERE id = ?", [eventId]);
    }

    // Find or create conversation
    let conversation = await db.getOne(`
      SELECT c.id 
      FROM conversations c
      JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = ?
      JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id = ?
      WHERE c.conversation_type = 'DIRECT'
      LIMIT 1
    `, [userId, buddyId]);

    let conversationId = conversation ? conversation.id : null;

    if (!conversationId) {
      const convRes = await db.execute(`
        INSERT INTO conversations (event_id, conversation_type, title)
        VALUES (?, 'DIRECT', ?)
      `, [eventId || null, `Chat between User ${userId} & User ${buddyId}`]);
      conversationId = convRes.insertId;

      await db.execute("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)", [conversationId, userId, conversationId, buddyId]);
    }

    // Fetch messages
    const messages = await db.query(`
      SELECT m.*, u.full_name, u.username, u.profile_image
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `, [conversationId]);

    res.render('buddy-chat', {
      buddyUser,
      event,
      messages,
      helpers
    });
  } catch (err) {
    console.error('Buddy chat error:', err);
    res.status(500).send('Error loading chat');
  }
});

// POST /buddies/chat/:id/send - Send 1-on-1 message
router.post('/buddies/chat/:id/send', requireAuth, async (req, res) => {
  const buddyId = Number(req.params.id);
  const userId = req.session.userId;
  const { message, event_id } = req.body;

  if (!message || !message.trim()) {
    return res.redirect(`/buddies/chat/${buddyId}?event_id=${event_id || ''}`);
  }

  try {
    // Authorization Check: Only allow direct chat between mutually accepted buddies
    const isConnected = await db.getOne(`
      SELECT id FROM buddy_requests 
      WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
      AND status = 'ACCEPTED'
    `, [userId, buddyId, buddyId, userId]);

    if (!isConnected) {
      req.session.flash = { error: 'You can only message accepted concert buddies.' };
      return res.redirect('/buddies?tab=connections');
    }

    // Find conversation
    const conversation = await db.getOne(`
      SELECT c.id 
      FROM conversations c
      JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = ?
      JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id = ?
      WHERE c.conversation_type = 'DIRECT'
      LIMIT 1
    `, [userId, buddyId]);

    if (conversation) {
      await db.execute(`
        INSERT INTO messages (conversation_id, sender_id, message)
        VALUES (?, ?, ?)
      `, [conversation.id, userId, message.trim()]);
    }

    res.redirect(`/buddies/chat/${buddyId}?event_id=${event_id || ''}`);
  } catch (err) {
    console.error('Error sending buddy message:', err);
    res.redirect(`/buddies/chat/${buddyId}?event_id=${event_id || ''}`);
  }
});

export default router;
