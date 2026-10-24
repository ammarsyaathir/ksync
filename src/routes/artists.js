// src/routes/artists.js - Public Artists Directory & Artist/Member Profiles (UC012 & UC013)
import express from 'express';
import db from '../../config/database.js';
import helpers, { normaliseMemberRow } from '../utils/helpers.js';

const router = express.Router();

// GET /artists - Public Artists Directory (UC012)
router.get('/', async (req, res) => {
  const search = req.query.search ? req.query.search.trim() : '';
  const selectedType = req.query.type ? req.query.type.trim() : '';

  try {
    let sql = `
      SELECT a.*,
             COUNT(DISTINCT e.id) as total_events_count,
             COUNT(DISTINCT CASE WHEN e.verification_status = 'VERIFIED' AND e.event_date >= CURRENT_DATE THEN e.id END) as upcoming_events_count,
             COUNT(DISTINCT m.id) as members_count
      FROM artists a
      LEFT JOIN events e ON a.id = e.artist_id AND e.verification_status = 'VERIFIED'
      LEFT JOIN members m ON a.id = m.artist_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (a.name LIKE ? OR a.agency LIKE ? OR a.description LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (selectedType) {
      sql += ` AND a.group_type = ?`;
      params.push(selectedType);
    }

    sql += ` GROUP BY a.id ORDER BY upcoming_events_count DESC, total_events_count DESC, a.name ASC`;

    const artists = await db.query(sql, params);

    // Fetch distinct group types for filter tabs
    const typeRows = await db.query("SELECT DISTINCT group_type FROM artists WHERE group_type IS NOT NULL AND group_type != '' ORDER BY group_type ASC");
    const groupTypes = typeRows.map(r => r.group_type);

    res.render('artists', {
      artists,
      groupTypes,
      selectedType,
      searchKeyword: search,
      activePath: '/artists',
      helpers
    });
  } catch (err) {
    console.error('Artists directory error:', err);
    res.status(500).send('Error loading artists directory');
  }
});

// GET /artists/:idOrSlug - Artist Profile & Member Biodata (UC013)
router.get('/:idOrSlug', async (req, res) => {
  const param = (req.params.idOrSlug || '').trim();

  try {
    let artist = null;

    // 1. Direct match by official slug column
    artist = await db.getOne("SELECT * FROM artists WHERE LOWER(slug) = LOWER(?)", [param]);

    // 2. Direct numeric ID (e.g. /artists/4) -> 301 Redirect to canonical slug URL
    if (!artist && /^\d+$/.test(param)) {
      const numericArtist = await db.getOne("SELECT * FROM artists WHERE id = ?", [Number(param)]);
      if (numericArtist) {
        const targetSlug = numericArtist.slug || helpers.slugify(numericArtist.name) || numericArtist.id;
        return res.redirect(301, `/artists/${targetSlug}`);
      }
    }

    // 3. Prefixed ID (e.g. /artists/4-enhypen) -> 301 Redirect to canonical slug URL
    if (!artist && /^\d+-/.test(param)) {
      const idPrefix = parseInt(param.split('-')[0], 10);
      const prefixedArtist = await db.getOne("SELECT * FROM artists WHERE id = ?", [idPrefix]);
      if (prefixedArtist) {
        const targetSlug = prefixedArtist.slug || helpers.slugify(prefixedArtist.name) || prefixedArtist.id;
        return res.redirect(301, `/artists/${targetSlug}`);
      }
    }

    // 4. Fallback: match by dynamically slugified artist name
    if (!artist) {
      const allArtists = await db.query("SELECT id, name, slug FROM artists");
      const matched = allArtists.find(a => 
        (a.slug && a.slug.toLowerCase() === param.toLowerCase()) || 
        helpers.slugify(a.name) === param.toLowerCase()
      );
      if (matched) {
        artist = await db.getOne("SELECT * FROM artists WHERE id = ?", [matched.id]);
        if (artist && artist.slug && artist.slug.toLowerCase() !== param.toLowerCase()) {
          return res.redirect(301, `/artists/${artist.slug}`);
        }
      }
    }

    if (!artist) {
      if (req.session) {
        req.session.flash = { error: 'Artist not found.' };
      }
      return res.redirect('/artists');
    }

    const artistId = artist.id;

    // Fetch members from normalised `members` table
    const rawMembers = await db.query(
      "SELECT * FROM members WHERE artist_id = ? ORDER BY sort_order ASC, id ASC",
      [artistId]
    );

    let members = rawMembers.map(normaliseMemberRow);

    // Fallback to legacy JSON on artists.members if members table is empty
    if (members.length === 0 && artist.members) {
      try {
        const parsed = JSON.parse(artist.members);
        if (Array.isArray(parsed) && parsed.length > 0) {
          members = parsed;
        }
      } catch (e) {}
    }

    // Fetch verified events associated with this artist
    const events = await db.query(`
      SELECT e.*, c.name as category_name, c.badge_color, e.venue_name as venue_display,
             u.organization_name, u.organization_type, u.is_verified_organizer
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.artist_id = ? AND e.verification_status = 'VERIFIED'
      ORDER BY e.event_date ASC, e.start_time ASC
    `, [artistId]);

    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming_events = [];
    const past_events = [];

    for (const ev of events) {
      const evDateStr = ev.event_date instanceof Date ? ev.event_date.toISOString().split('T')[0] : String(ev.event_date || '');
      if (evDateStr >= todayStr) {
        upcoming_events.push(ev);
      } else {
        past_events.push(ev);
      }
    }

    // User saved events for quick bookmark checking
    let savedEventIds = [];
    if (req.session && req.session.userId) {
      const saved = await db.query("SELECT event_id FROM saved_events WHERE user_id = ?", [req.session.userId]);
      savedEventIds = saved.map(s => s.event_id);
    }

    res.render('artist-details', {
      artist,
      members,
      upcoming_events,
      past_events,
      savedEventIds,
      activePath: '/artists',
      helpers
    });
  } catch (err) {
    console.error('Artist details error:', err);
    res.status(500).send('Error loading artist details');
  }
});

export default router;
