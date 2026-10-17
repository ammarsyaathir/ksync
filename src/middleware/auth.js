// src/middleware/auth.js - Authentication & Role-Based Access Control Middleware
import db from '../../config/database.js';
import helpers from '../utils/helpers.js';

/**
 * Middleware that loads the current logged-in user from the session
 * and exposes currentUser, flash messages, and helper functions to all EJS templates.
 */
export async function populateCurrentUser(req, res, next) {
  res.locals.activePath = req.path;
  res.locals.flash = req.session.flash || {};
  res.locals.helpers = helpers;
  req.session.flash = {}; // Clear flash after exposing to response

  if (req.session && req.session.userId) {
    try {
      const user = await db.getOne(`
        SELECT u.*, r.name as role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ?
      `, [req.session.userId]);

      if (user) {
        req.user = user;
        res.locals.currentUser = user;

        // Fetch unread notification count
        const unread = await db.getOne(
          "SELECT count(id) as count FROM notifications WHERE user_id = ? AND is_read = 0",
          [user.id]
        );
        res.locals.unreadCount = unread ? unread.count : 0;
      } else {
        req.session.userId = null;
        res.locals.currentUser = null;
        res.locals.unreadCount = 0;
      }
    } catch (e) {
      console.error('Error populating user:', e.message);
      res.locals.currentUser = null;
      res.locals.unreadCount = 0;
    }
  } else {
    res.locals.currentUser = null;
    res.locals.unreadCount = 0;
  }

  next();
}

/**
 * Guard: Requires the user to be logged in (Fan, Organizer, or Admin)
 */
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    req.session.flash = { warning: 'Please log in to access this page.' };
    return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  }
  next();
}

/**
 * Guard: Requires Admin role
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role_name.toLowerCase() !== 'admin') {
    req.session.flash = { error: 'Access denied: Administrator privileges required.' };
    return res.redirect('/');
  }
  next();
}

/**
 * Guard: Requires Organizer or Admin role
 */
export function requireOrganizer(req, res, next) {
  if (!req.user || !['organizer', 'admin'].includes(req.user.role_name.toLowerCase())) {
    req.session.flash = { error: 'Access denied: Organizer privileges required.' };
    return res.redirect('/');
  }
  next();
}

export default {
  populateCurrentUser,
  requireAuth,
  requireAdmin,
  requireOrganizer
};
