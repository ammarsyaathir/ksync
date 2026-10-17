// src/middleware/auth.js - Authentication & Role-Based Access Control Middleware
import db from '../../config/database.js';
import helpers from '../utils/helpers.js';

/**
 * Middleware that loads the current logged-in user from the session
 * and exposes currentUser, flash messages, and helper functions to all EJS templates.
 */
export async function populateCurrentUser(req, res, next) {
  try {
    res.locals.activePath = req.path || '';
    res.locals.flash = (req.session && req.session.flash) || {};
    res.locals.helpers = helpers;
    res.locals.currentUser = null;
    res.locals.unreadCount = 0;
    if (req.session) {
      req.session.flash = {};
    }

    if (req.session && req.session.userId) {
      const user = await db.getOne(`
        SELECT u.*, COALESCE(u.role, 'FAN') as role, COALESCE(u.role, 'FAN') as role_name 
        FROM users u 
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
      }
    }
  } catch (e) {
    console.error('Error populating user:', e.message);
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
  const role = (req.user && (req.user.role || req.user.role_name) || '').toUpperCase();
  if (role !== 'ADMIN') {
    req.session.flash = { error: 'Access denied: Administrator privileges required.' };
    return res.redirect('/');
  }
  next();
}

/**
 * Guard: Requires Organizer or Admin role
 */
export function requireOrganizer(req, res, next) {
  const role = (req.user && (req.user.role || req.user.role_name) || '').toUpperCase();
  if (!['ORGANIZER', 'ADMIN'].includes(role)) {
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
