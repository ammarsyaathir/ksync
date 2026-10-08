import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import dotenv from 'dotenv';
import { pool, initPostgresDatabase } from './src/db.js';

dotenv.config();

const app = new Hono();

// Global Exception & Error Handler (Replaces blank Internal Server Error with exact logs)
app.onError((err, c) => {
  console.error('Cloudflare Worker Error:', err);
  return c.json({
    status: 'error',
    message: err.message,
    name: err.name,
    hint: 'Check server logs or database credentials'
  }, 500);
});

// Enable CORS for API clients
app.use('/api/*', cors());

// Root API Health Check Endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'online',
    name: 'K-Sync Malaysia API (Cloudflare Worker)',
    version: '1.0.0',
    message: 'K-Sync API is running on Cloudflare Workers.'
  });
});

// Serve Root Homepage
app.get('/', serveStatic({ path: './index.html' }));

// Initialize PostgreSQL Tables safely without crashing on startup
initPostgresDatabase().catch(err => console.warn('PostgreSQL deferred init warning:', err.message));

// ----------------------------------------------------
// 1. API: EVENT DISCOVERY & LISTINGS
// ----------------------------------------------------
app.get('/api/events', async (c) => {
  const search = c.req.query('search') || '';
  const category = c.req.query('category') || '';
  const artistId = c.req.query('artist_id') || '';

  let query = `
    SELECT e.*, 
           a.name as artist_name, a.group_type, a.image_url as artist_image,
           cat.name as category_name, cat.badge_color,
           v.name as venue_display, v.transit_info,
           u.full_name as organizer_name, u.organization_name, u.is_verified_organizer
    FROM events e
    LEFT JOIN artists a ON e.artist_id = a.id
    LEFT JOIN event_categories cat ON e.category_id = cat.id
    LEFT JOIN venues v ON e.venue_id = v.id
    LEFT JOIN users u ON e.organizer_id = u.id
    WHERE e.verification_status = 'VERIFIED'
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (e.event_name ILIKE $${params.length} OR a.name ILIKE $${params.length} OR e.venue_name ILIKE $${params.length} OR e.city ILIKE $${params.length})`;
  }

  if (category) {
    params.push(category);
    query += ` AND cat.slug = $${params.length}`;
  }

  if (artistId) {
    params.push(artistId);
    query += ` AND e.artist_id = $${params.length}`;
  }

  query += ` ORDER BY e.event_date ASC`;

  try {
    const res = await pool.query(query, params);
    return c.json({ status: 'success', data: res.rows });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// GET Single Event Details
app.get('/api/events/:id', async (c) => {
  const id = c.req.param('id');
  const userId = c.req.query('user_id');

  try {
    const query = `
      SELECT e.*, 
             a.name as artist_name, a.group_type, a.image_url as artist_image,
             cat.name as category_name, cat.badge_color,
             v.name as venue_display, v.map_link, v.transit_info,
             u.full_name as organizer_name, u.email as organizer_email,
             u.organization_name, u.organization_type, u.social_handle, u.social_url, u.is_verified_organizer
      FROM events e
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories cat ON e.category_id = cat.id
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = $1
    `;
    const res = await pool.query(query, [id]);
    if (res.rows.length === 0) {
      return c.json({ status: 'error', message: 'Event not found.' }, 404);
    }

    let isSaved = false;
    if (userId) {
      const savedRes = await pool.query('SELECT 1 FROM saved_events WHERE user_id = $1 AND event_id = $2', [userId, id]);
      isSaved = savedRes.rows.length > 0;
    }

    return c.json({ status: 'success', data: { ...res.rows[0], is_saved: isSaved } });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// ----------------------------------------------------
// 2. API: LIVE EVENT GROUP CHAT HUB (24h Post-Event Closure Rule)
// ----------------------------------------------------
app.get('/api/chat/:eventId', async (c) => {
  const eventId = c.req.param('eventId');
  try {
    const query = `
      SELECT cm.*, u.full_name, u.username, u.profile_image
      FROM event_chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.event_id = $1
      ORDER BY cm.created_at ASC
    `;
    const res = await pool.query(query, [eventId]);
    
    // Check if event chat is locked (24 hours after event date + end time)
    const evRes = await pool.query('SELECT event_date, end_time FROM events WHERE id = $1', [eventId]);
    let isLocked = false;
    if (evRes.rows.length > 0) {
      const ev = evRes.rows[0];
      const eventDateStr = ev.event_date.toISOString().split('T')[0];
      const endTimeStr = ev.end_time || '23:59:59';
      const eventEndTimestamp = new Date(`${eventDateStr}T${endTimeStr}`).getTime();
      const cutoffTime = eventEndTimestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > cutoffTime) {
        isLocked = true;
      }
    }

    return c.json({ status: 'success', is_locked: isLocked, messages: res.rows });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

app.post('/api/chat/:eventId', async (c) => {
  const eventId = c.req.param('eventId');
  const body = await c.req.json();
  const { user_id, message, is_organizer } = body;

  if (!user_id || !message || !message.trim()) {
    return c.json({ status: 'error', message: 'Message and user ID are required.' }, 400);
  }

  try {
    // Enforce 24h Post-Event Closure Rule
    const evRes = await pool.query('SELECT event_date, end_time FROM events WHERE id = $1', [eventId]);
    if (evRes.rows.length > 0) {
      const ev = evRes.rows[0];
      const eventDateStr = ev.event_date.toISOString().split('T')[0];
      const endTimeStr = ev.end_time || '23:59:59';
      const eventEndTimestamp = new Date(`${eventDateStr}T${endTimeStr}`).getTime();
      const cutoffTime = eventEndTimestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > cutoffTime) {
        return c.json({ status: 'error', message: 'This event group chat is closed (24h post-event limit reached).' }, 403);
      }
    }

    const ins = `
      INSERT INTO event_chat_messages (event_id, user_id, message, is_organizer)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const res = await pool.query(ins, [eventId, user_id, message.trim(), is_organizer ? 1 : 0]);
    return c.json({ status: 'success', data: res.rows[0] });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// ----------------------------------------------------
// 3. API: FIREBASE USER AUTH SYNC WITH POSTGRESQL
// ----------------------------------------------------
app.post('/api/auth/firebase-login', async (c) => {
  const body = await c.req.json();
  const { email, full_name, uid, photo_url, role } = body;

  if (!email) {
    return c.json({ status: 'error', message: 'Email is required.' }, 400);
  }

  try {
    // Check if user exists in PostgreSQL
    const checkUser = await pool.query('SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1', [email]);
    if (checkUser.rows.length > 0) {
      const user = checkUser.rows[0];
      return c.json({ status: 'success', user, message: 'Welcome back!' });
    }

    // New user -> Insert into PostgreSQL
    const username = email.split('@')[0].replace(/[^a-z0-9_]/gi, '').toLowerCase();
    const roleName = role || 'Fan';
    const roleRes = await pool.query('SELECT id FROM roles WHERE LOWER(name) = LOWER($1)', [roleName]);
    const roleId = roleRes.rows.length > 0 ? roleRes.rows[0].id : 3;

    const ins = await pool.query(
      `INSERT INTO users (role_id, full_name, username, email, password_hash, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, username, email`,
      [roleId, full_name || username, username, email, 'FIREBASE_AUTH', photo_url || '']
    );

    return c.json({ status: 'success', user: { ...ins.rows[0], role_name: roleName }, message: 'Account created with Firebase!' });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// ----------------------------------------------------
// 4. API: FANCLUB & ORGANIZER VERIFICATION (admin/verifications)
// ----------------------------------------------------
app.get('/api/admin/verifications', async (c) => {
  try {
    const res = await pool.query(`
      SELECT id, full_name, username, email, organization_name, organization_type, social_handle, social_url, verification_proof, is_verified_organizer, verification_notes, created_at
      FROM users
      WHERE role_id = 2 OR organization_name IS NOT NULL
      ORDER BY created_at DESC
    `);
    return c.json({ status: 'success', data: res.rows });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

app.post('/api/admin/verifications/action', async (c) => {
  const body = await c.req.json();
  const { user_id, action, notes } = body;

  try {
    const isVerified = action === 'verify' ? 1 : 0;
    await pool.query(
      'UPDATE users SET is_verified_organizer = $1, verification_notes = $2 WHERE id = $3',
      [isVerified, notes || '', user_id]
    );
    return c.json({ status: 'success', message: `User verification updated to ${action}.` });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// Serve Static Web Frontend from Cloudflare Site Bucket
app.use('/*', serveStatic({ root: './' }));

const port = Number(process.env.PORT) || 8000;
if (process.env.NODE_ENV !== 'production' && typeof process !== 'undefined' && process.release?.name === 'node') {
    console.log(`🚀 K-Sync JS Server running on http://localhost:${port}`);
    serve({ fetch: app.fetch, port });
}

export default app;
