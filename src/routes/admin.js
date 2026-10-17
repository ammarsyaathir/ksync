// src/routes/admin.js - Administrator Control Center & Verification Center
import express from 'express';
import db from '../../config/database.js';
import { requireAdmin } from '../middleware/auth.js';
import { logActivity } from '../utils/helpers.js';
import helpers from '../utils/helpers.js';
import { sendEventApprovalEmail, sendEventRejectionEmail } from '../utils/mailer.js';

const router = express.Router();

// Apply requireAdmin guard to all /admin/* routes
router.use('/admin', requireAdmin);

// GET /admin - Admin Dashboard
router.get('/admin', async (req, res) => {
  try {
    const totalEventsRow = await db.getOne("SELECT count(id) as count FROM events");
    const totalUsersRow = await db.getOne("SELECT count(id) as count FROM users");
    const pendingEventsRow = await db.getOne("SELECT count(id) as count FROM events WHERE verification_status = 'PENDING'");
    const verifiedFanclubsRow = await db.getOne("SELECT count(id) as count FROM users WHERE is_verified_organizer = 1");

    const pendingList = await db.query(`
      SELECT * FROM events 
      WHERE verification_status = 'PENDING' 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentLogs = await db.query(`
      SELECT l.*, u.username 
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 8
    `);

    res.render('admin/dashboard', {
      totalEvents: totalEventsRow ? totalEventsRow.count : 0,
      totalUsers: totalUsersRow ? totalUsersRow.count : 0,
      pendingSubmissionsCount: pendingEventsRow ? pendingEventsRow.count : 0,
      verifiedFanclubs: verifiedFanclubsRow ? verifiedFanclubsRow.count : 0,
      pendingList,
      recentLogs,
      helpers
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send('Error loading admin dashboard');
  }
});

// GET /admin/verifications - Model 2 Verification Queue & Fanclub Badge Management
router.get('/admin/verifications', async (req, res) => {
  try {
    const pendingEvents = await db.query(`
      SELECT e.*, a.name as artist_name 
      FROM events e 
      LEFT JOIN artists a ON e.artist_id = a.id
      WHERE e.verification_status = 'PENDING'
      ORDER BY e.created_at DESC
    `);

    const organizers = await db.query(`
      SELECT u.*, COALESCE(u.role, 'FAN') as role, COALESCE(u.role, 'FAN') as role_name 
      FROM users u 
      WHERE UPPER(u.role) = 'ORGANIZER' OR u.organization_name IS NOT NULL
      ORDER BY u.created_at DESC
    `);

    res.render('admin/verifications', {
      pendingEvents,
      organizers,
      helpers
    });
  } catch (err) {
    console.error('Verifications queue error:', err);
    res.status(500).send('Error loading verification queue');
  }
});

// POST /admin/verifications/approve-event - Approve Model 2 Submission
router.post('/admin/verifications/approve-event', async (req, res) => {
  const { event_id, trust_level, verification_notes } = req.body;
  const adminId = req.session.userId;

  try {
    const ev = await db.getOne("SELECT * FROM events WHERE id = ?", [event_id]);
    const assignedTrust = (trust_level && ['OFFICIAL', 'COMMUNITY'].includes(trust_level.toUpperCase())) 
      ? trust_level.toUpperCase() 
      : 'OFFICIAL';
    const notes = verification_notes && verification_notes.trim() 
      ? verification_notes.trim() 
      : 'Cross-verified with official source.';

    try {
      await db.execute(
        "UPDATE events SET verification_status = 'VERIFIED', trust_level = ?, admin_verification_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [assignedTrust, notes, event_id]
      );
    } catch (updateErr) {
      // Fallback if trust_level or admin_verification_notes column doesn't exist yet in remote MySQL
      await db.execute(
        "UPDATE events SET verification_status = 'VERIFIED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [event_id]
      );
    }

    await logActivity(adminId, 'APPROVE_EVENT', 'events', event_id, `Admin approved event #${event_id} [Trust: ${assignedTrust}] - Notes: ${notes}`, req.ip);

    // Send Real Approval Email to Organizer/Submitter (UC20 / UC22)
    if (ev && ev.submitter_email) {
      sendEventApprovalEmail({
        to: ev.submitter_email.trim(),
        name: ev.submitter_name || 'Event Organizer',
        eventName: ev.event_name,
        eventId: event_id,
        trackingCode: ev.tracking_code
      }).catch(e => console.error('[Admin Verification] Approval email send error:', e.message));
    }

    req.session.flash = { success: `Event #${event_id} verified & published live [Trust: ${assignedTrust}]!` };
    res.redirect('/admin/verifications');
  } catch (err) {
    console.error('Approve event error:', err);
    req.session.flash = { error: 'Failed to approve event.' };
    res.redirect('/admin/verifications');
  }
});

// POST /admin/verifications/reject-event - Reject Model 2 Submission with Reason
router.post('/admin/verifications/reject-event', async (req, res) => {
  const { event_id, reason } = req.body;
  const adminId = req.session.userId;

  try {
    const ev = await db.getOne("SELECT * FROM events WHERE id = ?", [event_id]);

    try {
      await db.execute(
        "UPDATE events SET verification_status = 'REJECTED', rejection_reason = ?, admin_verification_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [reason.trim(), `Rejected: ${reason.trim()}`, event_id]
      );
    } catch (rejectErr) {
      await db.execute(
        "UPDATE events SET verification_status = 'REJECTED', rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [reason.trim(), event_id]
      );
    }

    await logActivity(adminId, 'REJECT_EVENT', 'events', event_id, `Admin rejected event #${event_id}: ${reason.trim()}`, req.ip);

    // Send Real Rejection / Action Required Email to Organizer/Submitter (UC22 & UC23)
    if (ev && ev.submitter_email) {
      sendEventRejectionEmail({
        to: ev.submitter_email.trim(),
        name: ev.submitter_name || 'Event Organizer',
        eventName: ev.event_name,
        trackingCode: ev.tracking_code,
        reason: reason.trim()
      }).catch(e => console.error('[Admin Verification] Rejection email send error:', e.message));
    }

    req.session.flash = { warning: `Event #${event_id} rejected. Reason recorded for submitter.` };
    res.redirect('/admin/verifications');
  } catch (err) {
    console.error('Reject event error:', err);
    req.session.flash = { error: 'Failed to reject event.' };
    res.redirect('/admin/verifications');
  }
});

// POST /admin/verifications/verify-organizer - Grant [✓ Verified Fanclub] Badge
router.post('/admin/verifications/verify-organizer', async (req, res) => {
  const { user_id } = req.body;
  const adminId = req.session.userId;

  try {
    await db.execute(
      "UPDATE users SET is_verified_organizer = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [user_id]
    );

    await logActivity(adminId, 'VERIFY_FANCLUB', 'users', user_id, `Granted [Verified Fanclub] badge to user #${user_id}`, req.ip);
    req.session.flash = { success: `User #${user_id} granted official [Verified Fanclub] badge!` };
    res.redirect('/admin/verifications');
  } catch (err) {
    console.error('Verify organizer error:', err);
    res.redirect('/admin/verifications');
  }
});

// POST /admin/verifications/revoke-organizer - Revoke Fanclub Badge
router.post('/admin/verifications/revoke-organizer', async (req, res) => {
  const { user_id } = req.body;
  const adminId = req.session.userId;

  try {
    await db.execute(
      "UPDATE users SET is_verified_organizer = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [user_id]
    );

    await logActivity(adminId, 'REVOKE_FANCLUB', 'users', user_id, `Revoked verification badge from user #${user_id}`, req.ip);
    req.session.flash = { warning: `Verification badge revoked from user #${user_id}.` };
    res.redirect('/admin/verifications');
  } catch (err) {
    console.error('Revoke organizer error:', err);
    res.redirect('/admin/verifications');
  }
});

// GET /admin/events - All Events
router.get('/admin/events', async (req, res) => {
  try {
    const events = await db.query(`
      SELECT e.*, a.name as artist_name, c.name as category_name 
      FROM events e 
      LEFT JOIN artists a ON e.artist_id = a.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      ORDER BY e.created_at DESC
    `);

    res.render('admin/events', {
      events,
      helpers
    });
  } catch (err) {
    console.error('Admin events error:', err);
    res.status(500).send('Error loading events');
  }
});

// POST /admin/events/update-status
router.post('/admin/events/update-status', async (req, res) => {
  const { event_id, event_status } = req.body;
  const adminId = req.session.userId;

  try {
    await db.execute("UPDATE events SET event_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [event_status, event_id]);
    await logActivity(adminId, 'UPDATE_EVENT_STATUS', 'events', event_id, `Updated status of event #${event_id} to ${event_status}`, req.ip);
    req.session.flash = { success: 'Event status updated.' };
    res.redirect('/admin/events');
  } catch (err) {
    console.error('Update status error:', err);
    res.redirect('/admin/events');
  }
});

// POST /admin/events/delete
router.post('/admin/events/delete', async (req, res) => {
  const { event_id } = req.body;
  const adminId = req.session.userId;

  try {
    await db.execute("DELETE FROM saved_events WHERE event_id = ?", [event_id]);
    await db.execute("DELETE FROM event_chat_messages WHERE event_id = ?", [event_id]);
    await db.execute("DELETE FROM events WHERE id = ?", [event_id]);

    await logActivity(adminId, 'DELETE_EVENT', 'events', event_id, `Deleted event #${event_id}`, req.ip);
    req.session.flash = { success: 'Event removed permanently.' };
    res.redirect('/admin/events');
  } catch (err) {
    console.error('Delete event error:', err);
    res.redirect('/admin/events');
  }
});

// GET /admin/categories
router.get('/admin/categories', async (req, res) => {
  try {
    const categories = await db.query(`
      SELECT c.*, count(e.id) as event_count 
      FROM event_categories c 
      LEFT JOIN events e ON c.id = e.category_id
      GROUP BY c.id 
      ORDER BY c.name ASC
    `);

    res.render('admin/categories', { categories, helpers });
  } catch (err) {
    console.error('Admin categories error:', err);
    res.status(500).send('Error loading categories');
  }
});

// POST /admin/categories/add
router.post('/admin/categories/add', async (req, res) => {
  const { name, slug, badge_color } = req.body;
  try {
    await db.execute("INSERT INTO event_categories (name, slug, badge_color) VALUES (?, ?, ?)", [name.trim(), slug.trim(), badge_color]);
    req.session.flash = { success: 'Category added!' };
    res.redirect('/admin/categories');
  } catch (err) {
    req.session.flash = { error: 'Failed to add category.' };
    res.redirect('/admin/categories');
  }
});

// POST /admin/categories/delete
router.post('/admin/categories/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.execute("DELETE FROM event_categories WHERE id = ?", [id]);
    req.session.flash = { success: 'Category deleted.' };
    res.redirect('/admin/categories');
  } catch (err) {
    res.redirect('/admin/categories');
  }
});

// GET /admin/artists
router.get('/admin/artists', async (req, res) => {
  try {
    const artists = await db.query("SELECT * FROM artists ORDER BY name ASC");
    res.render('admin/artists', { artists, helpers });
  } catch (err) {
    res.status(500).send('Error loading artists');
  }
});

// POST /admin/artists/add
router.post('/admin/artists/add', async (req, res) => {
  const { name, group_type, agency, image_url } = req.body;
  try {
    await db.execute("INSERT INTO artists (name, group_type, agency, image_url) VALUES (?, ?, ?, ?)", [name.trim(), group_type, agency ? agency.trim() : null, image_url ? image_url.trim() : null]);
    req.session.flash = { success: 'Artist added!' };
    res.redirect('/admin/artists');
  } catch (err) {
    req.session.flash = { error: 'Failed to add artist.' };
    res.redirect('/admin/artists');
  }
});

// POST /admin/artists/delete
router.post('/admin/artists/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.execute("DELETE FROM artists WHERE id = ?", [id]);
    req.session.flash = { success: 'Artist deleted.' };
    res.redirect('/admin/artists');
  } catch (err) {
    res.redirect('/admin/artists');
  }
});

// GET /admin/reports - Chapter 1 Scope 1.6.1 Review Content Reports
router.get('/admin/reports', async (req, res) => {
  try {
    const reports = await db.query(`
      SELECT r.*, 
             u.username as reporter_username, u.full_name as reporter_name, u.email as reporter_email,
             e.event_name, e.tracking_code, e.verification_status as event_verification_status, e.official_url, e.submitter_name, e.submitter_email, e.submitter_social
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN events e ON r.event_id = e.id
      ORDER BY CASE WHEN r.status = 'PENDING' THEN 0 ELSE 1 END, r.created_at DESC
    `);
    res.render('admin/reports', { reports, helpers });
  } catch (err) {
    console.error('Admin reports error:', err);
    res.status(500).send('Error loading reports');
  }
});

// POST /admin/reports/action - Multi-Action Moderation (Freeze, Correct, Dismiss, Ban/Delete)
router.post('/admin/reports/action', async (req, res) => {
  const { report_id, action_type, admin_notes } = req.body;
  const adminId = req.session.userId;

  try {
    const report = await db.getOne("SELECT * FROM reports WHERE id = ?", [report_id]);
    if (!report) {
      req.session.flash = { error: 'Report not found.' };
      return res.redirect('/admin/reports');
    }

    const notes = (admin_notes || '').trim();

    if (action_type === 'FREEZE_EVENT') {
      // Suspend listing immediately - pulls it from public view and disables ticket link
      await db.execute(
        "UPDATE events SET verification_status = 'SUSPENDED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [report.event_id]
      );
      await db.execute(
        "UPDATE reports SET status = 'RESOLVED', admin_action = 'FROZEN_LISTING', admin_notes = ?, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
        [notes || 'Listing frozen pending verification', adminId, report_id]
      );
      await logActivity(adminId, 'FREEZE_EVENT_REPORT', 'events', report.event_id, `Admin froze event #${report.event_id} due to report #${report_id}: ${notes}`, req.ip);
      req.session.flash = { success: `Event #${report.event_id} has been SUSPENDED from public discovery. Ticket links locked.` };

    } else if (action_type === 'DISMISS_REPORT') {
      // Dismiss false or frivolous report - protect legitimate fanclub
      await db.execute(
        "UPDATE reports SET status = 'DISMISSED', admin_action = 'DISMISSED_FALSE_REPORT', admin_notes = ?, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
        [notes || 'Investigated and confirmed genuine. Report dismissed.', adminId, report_id]
      );
      await logActivity(adminId, 'DISMISS_REPORT', 'reports', report_id, `Admin dismissed false report #${report_id}: ${notes}`, req.ip);
      req.session.flash = { success: `Report #${report_id} dismissed as unsubstantiated. Event remains published.` };

    } else if (action_type === 'DELETE_SCAM') {
      // Confirmed fraud/scam: reject listing permanently
      await db.execute(
        "UPDATE events SET verification_status = 'REJECTED', rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        ['Confirmed fraud/phishing listing', report.event_id]
      );
      await db.execute(
        "UPDATE reports SET status = 'RESOLVED', admin_action = 'DELETED_CONFIRMED_SCAM', admin_notes = ?, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
        [notes || 'Confirmed scam listing rejected permanently.', adminId, report_id]
      );
      await logActivity(adminId, 'CONFIRM_SCAM_REPORT', 'events', report.event_id, `Admin confirmed scam for event #${report.event_id} and permanently rejected listing`, req.ip);
      req.session.flash = { success: `Event #${report.event_id} permanently rejected as fraudulent.` };

    } else {
      // Standard resolution (e.g. details corrected by admin)
      await db.execute(
        "UPDATE reports SET status = 'RESOLVED', admin_action = 'RESOLVED_CORRECTED', admin_notes = ?, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
        [notes || 'Report resolved by admin.', adminId, report_id]
      );
      await logActivity(adminId, 'RESOLVE_REPORT', 'reports', report_id, `Admin resolved report #${report_id}: ${notes}`, req.ip);
      req.session.flash = { success: `Report #${report_id} marked as resolved.` };
    }

    res.redirect('/admin/reports');
  } catch (err) {
    console.error('Admin report action error:', err);
    req.session.flash = { error: 'Failed to process report moderation action.' };
    res.redirect('/admin/reports');
  }
});

// POST /admin/reports/resolve (Legacy compat)
router.post('/admin/reports/resolve', async (req, res) => {
  const { id } = req.body;
  try {
    await db.execute("UPDATE reports SET status = 'RESOLVED' WHERE id = ?", [id]);
    req.session.flash = { success: 'Report marked as resolved.' };
    res.redirect('/admin/reports');
  } catch (err) {
    res.redirect('/admin/reports');
  }
});

// GET /admin/users
router.get('/admin/users', async (req, res) => {
  try {
    const users = await db.query(`
      SELECT u.*, COALESCE(u.role, 'FAN') as role, COALESCE(u.role, 'FAN') as role_name 
      FROM users u 
      ORDER BY u.created_at DESC
    `);
    res.render('admin/users', { users, helpers });
  } catch (err) {
    res.status(500).send('Error loading users');
  }
});

// POST /admin/users/delete
router.post('/admin/users/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    req.session.flash = { success: 'User deleted.' };
    res.redirect('/admin/users');
  } catch (err) {
    res.redirect('/admin/users');
  }
});

// GET /admin/logs
router.get('/admin/logs', async (req, res) => {
  try {
    const logs = await db.query(`
      SELECT l.*, u.username 
      FROM activity_logs l 
      LEFT JOIN users u ON l.user_id = u.id 
      ORDER BY l.created_at DESC 
      LIMIT 100
    `);
    res.render('admin/logs', { logs, helpers });
  } catch (err) {
    res.status(500).send('Error loading audit logs');
  }
});

export default router;
