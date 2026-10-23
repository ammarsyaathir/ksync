// src/routes/events.js - Events Discovery & Details Routes
import express from 'express';
import db from '../../config/database.js';
import helpers from '../utils/helpers.js';
import { getUsersFlairs } from '../utils/badges.js';

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

// GET /radar redirect to /events/radar
router.get('/radar', (req, res) => res.redirect('/events/radar'));

// GET /events/radar - Clustered Nearby & Same-Weekend Event Radar (UC005)
router.get('/events/radar', async (req, res) => {
  const selectedArea = req.query.area ? req.query.area.trim() : '';
  const selectedWeekend = req.query.weekend ? req.query.weekend.trim() : '';

  try {
    const events = await db.query(`
      SELECT e.*, a.name as artist_name, a.image_url as artist_image,
             c.name as category_name, c.badge_color, e.venue_name as venue_display,
             u.organization_name, u.organization_type, u.is_verified_organizer
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.verification_status = 'VERIFIED'
      ORDER BY e.event_date ASC, e.start_time ASC
    `);

    // Helper to derive precinct cluster area dynamically if DB column is missing or unmigrated
    function getClusterArea(ev) {
      if (ev.cluster_area && typeof ev.cluster_area === 'string' && ev.cluster_area.trim()) {
        return ev.cluster_area.trim();
      }
      const text = `${ev.venue_name || ''} ${ev.venue_display || ''} ${ev.city || ''} ${ev.address || ''}`.toLowerCase();
      if (/axiata|bukit jalil|national stadium|unifi/i.test(text)) return 'Bukit Jalil Hub';
      if (/zepp|bukit bintang|klcc|hang tuah|lalaport/i.test(text)) return 'BBCC & Downtown KL';
      if (/mega star|sentral|brickfields|sungei wang/i.test(text)) return 'KL Sentral & Brickfields';
      if (/sunway|subang|petaling jaya|surf beach/i.test(text)) return 'Petaling Jaya & Sunway';
      if (/bangsar|mid valley|vcr/i.test(text)) return 'Bangsar & Mid Valley';
      if (/penang|george town|spice/i.test(text)) return 'Penang & Northern Region';
      return 'Kuala Lumpur Metro Hub';
    }

    // Attach verified cluster_area to every event
    for (const ev of events) {
      ev.cluster_area = getClusterArea(ev);
    }

    // Safely query distinct cluster areas from DB (with fallback if column is not yet added)
    let allAreas = [];
    try {
      const areaRows = await db.query(`
        SELECT DISTINCT cluster_area 
        FROM events 
        WHERE verification_status = 'VERIFIED' AND cluster_area IS NOT NULL AND cluster_area != ''
        ORDER BY cluster_area ASC
      `);
      allAreas = areaRows.map(r => r.cluster_area).filter(Boolean);
    } catch (dbErr) {
      // cluster_area column does not exist on remote MySQL yet - proceed gracefully
    }

    // If allAreas is empty, derive from events
    if (allAreas.length === 0) {
      const set = new Set(events.map(e => e.cluster_area));
      allAreas = Array.from(set);
    }
    if (!allAreas.includes('Bukit Jalil Hub')) allAreas.unshift('Bukit Jalil Hub');
    if (!allAreas.includes('BBCC & Downtown KL')) allAreas.push('BBCC & Downtown KL');

    // Grouping by Cluster Area
    const areaClusters = {};
    for (const area of allAreas) {
      areaClusters[area] = events.filter(e => e.cluster_area === area);
    }
    // Also include an unclustered or others if any
    const otherEvents = events.filter(e => !e.cluster_area || !allAreas.includes(e.cluster_area));
    if (otherEvents.length > 0) {
      areaClusters['Other Venues'] = otherEvents;
      if (!allAreas.includes('Other Venues')) allAreas.push('Other Venues');
    }

    // Helper to calculate weekend key & label for each event
    const weekendClusters = new Map();

    for (const ev of events) {
      const rawDateStr = ev.event_date instanceof Date ? ev.event_date.toISOString().split('T')[0] : String(ev.event_date || '');
      if (!rawDateStr) continue;

      const d = new Date(rawDateStr + 'T12:00:00');
      const day = d.getDay(); // 0 = Sun, 1 = Mon ... 5 = Fri, 6 = Sat

      // Calculate the Friday of this week/weekend
      const diffToFriday = (day === 0) ? -2 : (5 - day);
      const friday = new Date(d);
      friday.setDate(d.getDate() + diffToFriday);

      const sunday = new Date(friday);
      sunday.setDate(friday.getDate() + 2);

      const fridayStr = friday.toISOString().split('T')[0];
      const friDayNum = friday.getDate();
      const sunDayNum = sunday.getDate();
      const monthYear = sunday.toLocaleDateString('en-MY', { month: 'short', year: 'numeric' });
      const weekendLabel = `Weekend of ${friDayNum}–${sunDayNum} ${monthYear}`;

      if (!weekendClusters.has(fridayStr)) {
        weekendClusters.set(fridayStr, {
          key: fridayStr,
          label: weekendLabel,
          events: []
        });
      }
      weekendClusters.get(fridayStr).events.push(ev);
    }

    // Convert map to sorted array of weekend clusters
    const sortedWeekendClusters = Array.from(weekendClusters.values())
      .sort((a, b) => a.key.localeCompare(b.key));

    // User saved events for quick bookmark checking
    let savedEventIds = [];
    if (req.session && req.session.userId) {
      const saved = await db.query("SELECT event_id FROM saved_events WHERE user_id = ?", [req.session.userId]);
      savedEventIds = saved.map(s => s.event_id);
    }

    res.render('event-radar', {
      events,
      allAreas,
      areaClusters,
      weekendClusters: sortedWeekendClusters,
      selectedArea,
      selectedWeekend,
      activePath: '/events/radar',
      helpers
    });
  } catch (err) {
    console.error('Event Radar error:', err);
    res.status(500).send('Error loading Event Radar');
  }
});

// 3D Stadium Seating removed per design simplification - Redirect to 360 Event Radar
router.get(['/venues/seating-3d', '/events/seating-3d', '/stadium-3d'], (req, res) => {
  res.redirect('/events/radar');
});

// GET /events/:idOrSlug - Event Details by ID or Name Slug
router.get('/events/:idOrSlug', async (req, res) => {
  const param = (req.params.idOrSlug || '').trim();

  try {
    const baseQuery = `
      SELECT e.*, 
             a.name as artist_name, a.group_type, a.image_url as artist_image, a.description as artist_description, a.agency as artist_agency, a.members as artist_members,
             c.name as category_name, c.badge_color,
             u.full_name as organizer_name, u.email as organizer_email,
             u.organization_name, u.organization_type, u.social_handle, u.social_url, u.is_verified_organizer
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
    `;

    let event = null;

    // 1. Check numeric ID (e.g. /events/24)
    if (/^\d+$/.test(param)) {
      event = await db.getOne(`${baseQuery} WHERE e.id = ?`, [Number(param)]);
    }

    // 2. Check prefixed ID (e.g. /events/24-seventeen-right-here)
    if (!event && /^\d+-/.test(param)) {
      const idPrefix = parseInt(param.split('-')[0], 10);
      event = await db.getOne(`${baseQuery} WHERE e.id = ?`, [idPrefix]);
    }

    // 3. Check exact slug column (e.g. /events/seventeen-right-here)
    if (!event) {
      try {
        event = await db.getOne(`${baseQuery} WHERE e.slug = ?`, [param]);
      } catch (e) {
        // Column may be pending in remote MySQL
      }
    }

    // 4. Fallback: match by dynamically slugified event_name
    if (!event) {
      const candidates = await db.query("SELECT id, event_name FROM events");
      const matched = candidates.find(c => helpers.slugify(c.event_name) === param);
      if (matched) {
        event = await db.getOne(`${baseQuery} WHERE e.id = ?`, [matched.id]);
      }
    }

    if (!event) {
      req.session.flash = { error: 'Event not found.' };
      return res.redirect('/events');
    }

    const eventId = event.id;

    // Check if current user saved the event
    let isSavedEvent = false;
    let isInterested = false;
    if (req.session && req.session.userId) {
      const saved = await db.getOne("SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?", [req.session.userId, eventId]);
      isSavedEvent = !!saved;

      const rec = await db.getOne("SELECT id FROM event_recommendations WHERE user_id = ? AND event_id = ?", [req.session.userId, eventId]);
      isInterested = !!rec;
    }

    const recCountRow = await db.getOne("SELECT COUNT(*) as cnt FROM event_recommendations WHERE event_id = ?", [eventId]);
    const interestCount = recCountRow ? recCountRow.cnt : 0;

    // Fetch discussion comments with user roles and organize 1-level threading
    let chatMessages = [];
    let mainComments = [];
    try {
      chatMessages = await db.query(`
        SELECT cm.*, u.full_name, u.username, u.profile_image, COALESCE(u.role, 'FAN') as role
        FROM event_chat_messages cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.event_id = ?
        ORDER BY cm.created_at ASC
      `, [eventId]);

      const replyMap = new Map();
      for (const msg of chatMessages) {
        if (msg.parent_id) {
          if (!replyMap.has(msg.parent_id)) {
            replyMap.set(msg.parent_id, []);
          }
          replyMap.get(msg.parent_id).push(msg);
        } else {
          msg.replies = [];
          mainComments.push(msg);
        }
      }

      for (const comment of mainComments) {
        comment.replies = replyMap.get(comment.id) || [];
      }
    } catch (chatErr) {
      console.error('Error loading comments:', chatErr.message);
      chatMessages = [];
      mainComments = [];
    }

    // Check 24-hour post-event lock
    let isChatLocked = false;
    try {
      const eventDateStr = event.event_date instanceof Date ? event.event_date.toISOString().split('T')[0] : String(event.event_date || '');
      const endTimeStr = event.end_time || '23:59:59';
      const eventEndTimestamp = new Date(`${eventDateStr}T${endTimeStr}`).getTime();
      const cutoffTime = eventEndTimestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > cutoffTime) {
        isChatLocked = true;
      }
    } catch (e) {}

    // Member biodata: read the normalised `members` table (FK -> artists.id).
    // Falls back to the legacy `artists.members` JSON for any database that has
    // not had the members-table migration applied yet.
    let members = [];
    if (event.artist_id) {
      try {
        const rows = await db.query(`
          SELECT stage_name, birth_name, group_name, position, dob, zodiac, height_cm,
                 blood_type, mbti, nationality, debut_year, photo, is_active
          FROM members
          WHERE artist_id = ?
          ORDER BY sort_order ASC, id ASC
        `, [event.artist_id]);
        members = rows.map(helpers.normaliseMemberRow);
      } catch (e) {
        // `members` table not present yet - fall through to the JSON column
        members = [];
      }
    }

    // Legacy fallback: persisted JSON array on artists.members
    if (members.length === 0 && event.artist_members) {
      try {
        members = typeof event.artist_members === 'string' ? JSON.parse(event.artist_members) : event.artist_members;
      } catch (e) {
        members = [];
      }
    }

    // Parse event posters & visual gallery (supports 1 to 4 posters/seating plans)
    let posters = [];
    if (event.gallery_images) {
      try {
        posters = typeof event.gallery_images === 'string' ? JSON.parse(event.gallery_images) : event.gallery_images;
        if (!Array.isArray(posters)) posters = [posters];
      } catch (e) {
        posters = String(event.gallery_images).split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if ((!posters || posters.length === 0) && event.poster_image) {
      posters = [event.poster_image];
    }

    // Fetch fan badge flairs for comment authors
    const commenterUserIds = chatMessages.map(m => m.user_id);
    let userFlairs = {};
    try {
      userFlairs = await getUsersFlairs(commenterUserIds);
    } catch (e) {
      userFlairs = {};
    }

    res.render('event-details', {
      event,
      members,
      posters,
      isSavedEvent,
      isInterested,
      interestCount,
      chatMessages,
      comments: mainComments,
      totalCommentsCount: chatMessages.length,
      isChatLocked,
      helpers,
      userFlairs,
      currentUser: res.locals.currentUser || null,
      activePath: '/events'
    });
  } catch (err) {
    console.error('Event details error:', err);
    res.status(500).send('Error loading event details');
  }
});

// GET /events/:idOrSlug/calendar.ics - Mobile Device Calendar (.ics) with Automatic Reminder Alarms
router.get('/events/:idOrSlug/calendar.ics', async (req, res) => {
  const param = (req.params.idOrSlug || '').trim();

  try {
    let event = null;
    if (/^\d+$/.test(param)) {
      event = await db.getOne("SELECT * FROM events WHERE id = ?", [Number(param)]);
    }
    if (!event && /^\d+-/.test(param)) {
      const idPrefix = parseInt(param.split('-')[0], 10);
      event = await db.getOne("SELECT * FROM events WHERE id = ?", [idPrefix]);
    }
    if (!event) {
      try {
        event = await db.getOne("SELECT * FROM events WHERE slug = ?", [param]);
      } catch (e) {}
    }
    if (!event) {
      const all = await db.query("SELECT id, event_name, event_date, start_time, end_time, venue_name, city, description FROM events");
      const matched = all.find(c => helpers.slugify(c.event_name) === param);
      if (matched) event = matched;
    }

    if (!event) {
      return res.status(404).send('Event not found');
    }

    const rawDate = (event.event_date instanceof Date)
      ? event.event_date.toISOString().split('T')[0]
      : String(event.event_date || '');
    const dateClean = rawDate.replace(/-/g, '');
    const startTimeClean = String(event.start_time || '18:00:00').replace(/:/g, '').substring(0, 4) + '00';
    const endTimeClean = String(event.end_time || '22:00:00').replace(/:/g, '').substring(0, 4) + '00';

    const slug = helpers.slugify(event.event_name) || `event-${event.id}`;
    const appUrl = (process.env.APP_BASE_URL || 'https://ksync.my') + `/events/${slug}`;
    const cleanDesc = (event.description || 'K-Pop Event in Malaysia').replace(/\r?\n/g, '\\n') + `\\n\\nOfficial Event Link: ${appUrl}`;
    const cleanLocation = `${event.venue_name || 'K-Pop Venue'}, ${event.city || 'Malaysia'}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//K-Sync Malaysia//K-Pop Event Directory//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:K-Sync Malaysia Events',
      'X-WR-TIMEZONE:Asia/Kuala_Lumpur',
      'BEGIN:VEVENT',
      `UID:ksync-event-${event.id}@ksync.my`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Asia/Kuala_Lumpur:${dateClean}T${startTimeClean}`,
      `DTEND;TZID=Asia/Kuala_Lumpur:${dateClean}T${endTimeClean}`,
      `SUMMARY:${event.event_name}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLocation}`,
      `URL:${appUrl}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${event.event_name} is tomorrow!`,
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${event.event_name} starts in 2 hours!`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${slug}.ics"`);
    res.send(icsContent);
  } catch (err) {
    console.error('Error generating calendar .ics:', err);
    res.status(500).send('Error generating calendar file');
  }
});

export default router;
