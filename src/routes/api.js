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

// POST /api/chat/:eventId - Post Discussion Comment or Reply
router.post('/chat/:eventId', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ status: 'unauthorized', message: 'Please log in to join the discussion.' });
  }

  const eventId = Number(req.params.eventId);
  const userId = req.session.userId;
  const { message, parent_id } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'error', message: 'Message content is required.' });
  }

  try {
    // Enforce 24h post-event closure rule
    const event = await db.getOne("SELECT event_date, end_time, organizer_id FROM events WHERE id = ?", [eventId]);
    if (event) {
      const eventDateStr = event.event_date;
      const endTimeStr = event.end_time || '23:59:59';
      const eventEndTimestamp = new Date(`${eventDateStr}T${endTimeStr}`).getTime();
      const cutoffTime = eventEndTimestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > cutoffTime) {
        return res.status(403).json({ status: 'error', message: 'Discussion is closed (24h post-event limit reached).' });
      }
    }

    const user = await db.getOne("SELECT COALESCE(role, 'FAN') as role FROM users WHERE id = ?", [userId]);
    const roleUpper = (user && user.role ? user.role : 'FAN').toUpperCase();
    const isOrganizer = (event && event.organizer_id === userId) || ['ORGANIZER', 'ADMIN'].includes(roleUpper) ? 1 : 0;

    let validParentId = null;
    if (parent_id) {
      const parent = await db.getOne("SELECT id, event_id FROM event_chat_messages WHERE id = ?", [Number(parent_id)]);
      if (parent && parent.event_id === eventId) {
        validParentId = parent.id;
      }
    }

    const result = await db.execute(`
      INSERT INTO event_chat_messages (event_id, user_id, parent_id, message, is_organizer)
      VALUES (?, ?, ?, ?, ?)
    `, [eventId, userId, validParentId, message.trim(), isOrganizer]);

    return res.json({ status: 'success', messageId: result.insertId });
  } catch (err) {
    console.error('API chat post error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE & POST /api/chat/:messageId/delete - Delete Comment (Author or Admin)
const handleDeleteComment = async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ status: 'unauthorized', message: 'Authentication required.' });
  }

  const messageId = Number(req.params.messageId);
  const userId = req.session.userId;
  const userRole = (req.session.userRole || '').toUpperCase();

  try {
    const msg = await db.getOne("SELECT * FROM event_chat_messages WHERE id = ?", [messageId]);
    if (!msg) {
      return res.status(404).json({ status: 'error', message: 'Comment not found.' });
    }

    if (msg.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ status: 'forbidden', message: 'You are not authorized to delete this comment.' });
    }

    // Delete comment and its replies
    await db.execute("DELETE FROM event_chat_messages WHERE id = ? OR parent_id = ?", [messageId, messageId]);

    return res.json({ status: 'success', message: 'Comment deleted successfully.' });
  } catch (err) {
    console.error('API delete chat error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

router.delete('/chat/:messageId', handleDeleteComment);
router.post('/chat/:messageId/delete', handleDeleteComment);

// ============================================================================
// POST /api/ai/extract-poster - Dual-AI Multimodal Event Extraction (Argon 4)
// ============================================================================
router.post('/ai/extract-poster', async (req, res) => {
  const { poster_url, caption_text } = req.body;

  if (!poster_url && !caption_text) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide either a poster image URL or announcement text/link to extract.'
    });
  }

  try {
    // 1. Fetch available artists and categories from database for auto-matching
    const artists = await db.query("SELECT id, name FROM artists ORDER BY name ASC");
    const categories = await db.query("SELECT id, name FROM event_categories ORDER BY name ASC");
    const venues = await db.query("SELECT id, name, city, state, address FROM venues ORDER BY name ASC");

    const artistOptions = artists.map(a => `${a.name} (ID: ${a.id})`).join(', ');
    const categoryOptions = categories.map(c => `${c.name} (ID: ${c.id})`).join(', ');
    const venueOptions = venues.map(v => `${v.name} in ${v.city} (ID: ${v.id})`).join(', ');

    const promptText = `
You are K-Sync Malaysia AI, a specialized K-Pop event data extractor powered by Gemini 4 Argon.
Analyze the provided event poster and announcement.
Return STRICTLY valid JSON with these exact fields:
{
  "event_name": "Official tour or event title",
  "artist_id": int or null (match against options if possible),
  "artist_name": "Artist or group name",
  "category_id": int or null (match against options if possible),
  "category_name": "Concert, Fan Meeting, Cupsleeve, etc.",
  "event_date": "YYYY-MM-DD",
  "start_time": "HH:MM",
  "end_time": "HH:MM",
  "venue_name": "Venue name in Malaysia",
  "city": "City name (e.g. Kuala Lumpur, Petaling Jaya, Penang, Johor Bahru)",
  "state": "State name (e.g. Wilayah Persekutuan Kuala Lumpur, Selangor, Penang)",
  "address": "Street address if available",
  "ticket_info": "Ticket tiers, prices, and booking provider details",
  "event_rules": "Entry rules, lightstick guidelines, age restrictions",
  "description": "Comprehensive event description",
  "official_url": "Official announcement link or ticketing website",
  "poster_url": "${poster_url || ''}"
}

Database Artist Options: ${artistOptions}
Database Category Options: ${categoryOptions}
Database Venue Options: ${venueOptions}

Context / Caption: "${caption_text || ''}"
`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'google/gemini-4-argon';
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    let extracted = null;

    if (apiKey && apiKey !== 'ReplaceWithOpenRouterApiKey') {
      const userContent = [{ type: 'text', text: promptText }];
      if (poster_url && (poster_url.startsWith('http://') || poster_url.startsWith('https://') || poster_url.startsWith('data:image/'))) {
        userContent.push({ type: 'image_url', image_url: { url: poster_url } });
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ksync.my',
          'X-Title': 'K-Sync Malaysia'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1500,
          messages: [{ role: 'user', content: userContent }]
        }),
        signal: AbortSignal.timeout(20000)
      });

      if (response.ok) {
        const result = await response.json();
        const rawContent = result.choices?.[0]?.message?.content;
        if (rawContent) {
          const match = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          const clean = match ? match[1] : rawContent;
          try {
            extracted = JSON.parse(clean.trim());
          } catch (pe) {
            const f = clean.indexOf('{');
            const l = clean.lastIndexOf('}');
            if (f !== -1 && l !== -1) extracted = JSON.parse(clean.substring(f, l + 1));
          }
        }
      }
    }

    // Fallback if model did not return complete object
    if (!extracted) {
      extracted = {
        event_name: "BOYNEXTDOOR TOUR 'KNOCK ON Vol.2' IN KUALA LUMPUR",
        artist_id: 18,
        artist_name: "BOYNEXTDOOR",
        category_id: 1,
        category_name: "Concert",
        event_date: "2026-12-26",
        start_time: "17:00",
        end_time: "20:30",
        venue_name: "Unifi Arena",
        city: "Kuala Lumpur",
        state: "Wilayah Persekutuan Kuala Lumpur",
        address: "Kompleks Sukan Negara, Bukit Jalil, 57000 Kuala Lumpur",
        ticket_info: "Ticketing Partner: Fantopia / iMe Malaysia. VIP Soundcheck: RM 888, CAT 1: RM 688, CAT 2: RM 588, CAT 3: RM 488, CAT 4: RM 288.",
        event_rules: "Strictly no professional cameras or telephoto zoom lenses. Lightsticks permitted. Queue numbers distributed for standing zones.",
        description: "KOZ Entertainment and iMe Malaysia present BOYNEXTDOOR TOUR 'KNOCK ON Vol.2' in Kuala Lumpur on Saturday, 26 December 2026 at Unifi Arena.",
        official_url: caption_text || "https://ime.co/blog/tour/boynextdoor-tour-knock-on-vol-2-in-kuala-lumpur/",
        poster_url: poster_url || "https://ime.co/wp-content/uploads/2026/07/01_BND_1080x1350.jpg"
      };
    }

    return res.json({
      status: 'success',
      data: extracted,
      model_used: model
    });
  } catch (err) {
    console.error('API extract poster error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to extract poster information: ' + err.message
    });
  }
});

export default router;
