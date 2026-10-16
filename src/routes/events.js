// src/routes/events.js - Events Discovery & Details Routes
import express from 'express';
import db from '../../config/database.js';
import helpers from '../utils/helpers.js';

const router = express.Router();

// GET / - Home Page
router.get('/', async (req, res) => {
  try {
    const upcoming_events = await db.query(`
      SELECT e.*, a.name as artist_name, c.name as category_name, c.badge_color, e.venue_name as venue_display
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.verification_status = 'VERIFIED'
      ORDER BY e.event_date ASC
      LIMIT 6
    `);

    const categories = await db.query(`
      SELECT c.*, COUNT(e.id) as event_count 
      FROM event_categories c 
      LEFT JOIN events e ON c.id = e.category_id AND e.verification_status = 'VERIFIED'
      GROUP BY c.id
      ORDER BY c.id ASC
    `);

    const featured_artists = await db.query(`
      SELECT a.*, COUNT(e.id) as event_count 
      FROM artists a 
      LEFT JOIN events e ON a.id = e.artist_id AND e.verification_status = 'VERIFIED'
      GROUP BY a.id
      ORDER BY event_count DESC, a.name ASC
      LIMIT 6
    `);

    // Fetch user's saved events if logged in
    let savedEventIds = [];
    if (req.session && req.session.userId) {
      const saved = await db.query("SELECT event_id FROM saved_events WHERE user_id = ?", [req.session.userId]);
      savedEventIds = saved.map(s => s.event_id);
    }

    res.render('index', {
      upcoming_events,
      categories,
      featured_artists,
      savedEventIds,
      helpers
    });
  } catch (err) {
    console.error('Home page error:', err);
    res.status(500).send('Server Error loading home page');
  }
});

// GET /events - Events Directory & Search
router.get('/events', async (req, res) => {
  const search = req.query.search ? req.query.search.trim() : '';
  const artistId = req.query.artist ? Number(req.query.artist) : 0;
  const categorySlug = req.query.category ? req.query.category.trim() : '';
  const location = req.query.location ? req.query.location.trim() : '';

  try {
    let sql = `
      SELECT e.*, a.name as artist_name, c.name as category_name, c.slug as category_slug, e.venue_name as venue_display,
             u.full_name as organizer_name, u.organization_name, u.organization_type, u.social_handle, u.social_url, u.is_verified_organizer
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.verification_status = 'VERIFIED'
    `;
    const params = [];

    if (search) {
      sql += ` AND (e.event_name LIKE ? OR a.name LIKE ? OR e.venue_name LIKE ? OR e.city LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (artistId > 0) {
      sql += ` AND e.artist_id = ?`;
      params.push(artistId);
    }

    if (categorySlug) {
      sql += ` AND c.slug = ?`;
      params.push(categorySlug);
    }

    if (location) {
      sql += ` AND (e.city = ? OR e.state = ?)`;
      params.push(location, location);
    }

    sql += ` ORDER BY e.event_date ASC, e.start_time ASC`;

    const events = await db.query(sql, params);
    const all_artists = await db.query("SELECT * FROM artists ORDER BY name ASC");
    const all_categories = await db.query("SELECT * FROM event_categories ORDER BY name ASC");
    const locRows = await db.query("SELECT DISTINCT city FROM events WHERE verification_status = 'VERIFIED' AND city IS NOT NULL ORDER BY city ASC");
    const all_locations = locRows.map(r => r.city);

    let savedEventIds = [];
    if (req.session && req.session.userId) {
      const saved = await db.query("SELECT event_id FROM saved_events WHERE user_id = ?", [req.session.userId]);
      savedEventIds = saved.map(s => s.event_id);
    }

    res.render('events', {
      events,
      all_artists,
      all_categories,
      all_locations,
      selectedArtist: artistId,
      selectedCategory: categorySlug,
      selectedLocation: location,
      searchKeyword: search,
      savedEventIds,
      helpers
    });
  } catch (err) {
    console.error('Events discovery error:', err);
    res.status(500).send('Error loading events');
  }
});

// GET /events/:id - Event Details
router.get('/events/:id', async (req, res) => {
  const eventId = Number(req.params.id);

  try {
    const event = await db.getOne(`
      SELECT e.*, 
             a.name as artist_name, a.group_type, a.image_url as artist_image, a.description as artist_description, a.agency as artist_agency, a.members as artist_members,
             c.name as category_name, c.badge_color,
             u.full_name as organizer_name, u.email as organizer_email,
             u.organization_name, u.organization_type, u.social_handle, u.social_url, u.is_verified_organizer
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = ?
    `, [eventId]);

    if (!event) {
      req.session.flash = { error: 'Event not found.' };
      return res.redirect('/events');
    }

    // Check if current user saved the event
    let isSavedEvent = false;
    let isInterested = false;
    if (req.session && req.session.userId) {
      const saved = await db.getOne("SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?", [req.session.userId, eventId]);
      isSavedEvent = !!saved;

    }
    const interestCount = 0;

    // Fetch chat messages
    const chatMessages = await db.query(`
      SELECT cm.*, u.full_name, u.username, u.profile_image
      FROM event_chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.event_id = ?
      ORDER BY cm.created_at ASC
    `, [eventId]);

    // Check 24-hour post-event lock
    let isChatLocked = false;
    try {
      const eventDateStr = event.event_date;
      const endTimeStr = event.end_time || '23:59:59';
      const eventEndTimestamp = new Date(`${eventDateStr}T${endTimeStr}`).getTime();
      const cutoffTime = eventEndTimestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > cutoffTime) {
        isChatLocked = true;
      }
    } catch (e) {}

    // Parse member biodatas from JSON
    let members = [];
    if (event.artist_members) {
      try {
        members = typeof event.artist_members === 'string' ? JSON.parse(event.artist_members) : event.artist_members;
      } catch (e) {
        members = [];
      }
    }

    res.render('event-details', {
      event,
      members,
      isSavedEvent,
      isInterested,
      interestCount,
      chatMessages,
      isChatLocked,
      helpers
    });
  } catch (err) {
    console.error('Event details error:', err);
    res.status(500).send('Error loading event details');
  }
});

export default router;
