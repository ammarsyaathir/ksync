// src/routes/auth.js - Authentication & Profile Management Routes
import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { logActivity } from '../utils/helpers.js';
import { verifyFirebaseIdToken } from '../utils/google-auth.js';

const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('login', { redirect: req.query.redirect || '' });
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password, redirect } = req.body;

  if (!username || !password) {
    req.session.flash = { error: 'Please enter both username/email and password.' };
    return res.redirect('/login');
  }

  try {
    const user = await db.getOne(
      "SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)",
      [username.trim(), username.trim()]
    );

    if (!user) {
      req.session.flash = { error: 'Invalid username/email or password.' };
      return res.redirect('/login');
    }

    // Verify Password. Only a valid bcrypt hash is accepted; there is no
    // plaintext comparison and no hardcoded/demo credential fallback.
    let isMatch = false;
    if (user.password_hash) {
      // PHP bcrypt uses $2y$; normalize so bcryptjs can verify it.
      const hash = user.password_hash.replace(/^\$2y\$/, '$2a$');
      if (/^\$2[aby]\$/.test(hash)) {
        isMatch = await bcrypt.compare(password, hash);
      }
    }

    if (!isMatch) {
      req.session.flash = { error: 'Invalid username/email or password.' };
      return res.redirect('/login');
    }

    // Set session
    req.session.userId = user.id;
    await logActivity(user.id, 'LOGIN', 'users', user.id, `User @${user.username} logged in successfully`, req.ip);

    req.session.flash = { success: `Welcome back, ${user.full_name}!` };
    const targetUrl = redirect && redirect.startsWith('/') ? redirect : '/';
    res.redirect(targetUrl);
  } catch (err) {
    console.error('Login error:', err);
    req.session.flash = { error: 'An error occurred during sign-in. Please try again.' };
    res.redirect('/login');
  }
});

// GET /register
router.get('/register', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('register');
});

// POST /register
router.post('/register', async (req, res) => {
  const { full_name, username, email, password, bio } = req.body;

  if (!full_name || !username || !email || !password) {
    req.session.flash = { error: 'Please fill in all mandatory fields.' };
    return res.redirect('/register');
  }

  try {
    const existing = await db.getOne(
      "SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)",
      [username.trim(), email.trim()]
    );

    if (existing) {
      req.session.flash = { error: 'Username or email already in use. Please log in.' };
      return res.redirect('/register');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const roleRes = await db.getOne("SELECT id FROM roles WHERE LOWER(name) = 'fan'");
    const roleId = roleRes ? roleRes.id : 3;

    const result = await db.execute(
      `INSERT INTO users (role_id, full_name, username, email, password_hash, bio, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [roleId, full_name.trim(), username.trim(), email.trim(), passwordHash, bio ? bio.trim() : '']
    );

    req.session.userId = result.insertId;
    await logActivity(result.insertId, 'REGISTER', 'users', result.insertId, `New user registered @${username.trim()}`, req.ip);

    req.session.flash = { success: 'Your K-Sync account has been created successfully!' };
    res.redirect('/');
  } catch (err) {
    console.error('Registration error:', err);
    req.session.flash = { error: 'Failed to create account. Please try again.' };
    res.redirect('/register');
  }
});

// POST /auth/google - Google Sign-In via a VERIFIED Firebase ID token.
// The client sends the Firebase ID token; identity is derived only from its
// verified claims. Client-supplied email/uid/role are never trusted.
router.post('/auth/google', async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    return res.status(400).json({ status: 'error', message: 'Missing Google authentication token.' });
  }

  // 1) Verify the token with Google before trusting any identity data.
  let claims;
  try {
    claims = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    console.error('Google ID token verification failed:', err.message);
    return res.status(401).json({ status: 'error', message: 'Google authentication failed. Please try again.' });
  }

  const email = (claims.email || '').trim();
  if (!email || claims.email_verified === false) {
    return res.status(400).json({ status: 'error', message: 'Google account email is missing or unverified.' });
  }
  const name = (claims.name || '').trim() || email.split('@')[0];
  const photo_url = claims.picture || null;
  const uid = claims.sub;
  const usernameBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

  // Only self-service roles may be requested; Admin can never be self-assigned.
  const requestedRole = String(role || 'Fan').toLowerCase();
  const roleName = requestedRole === 'organizer' ? 'Organizer' : 'Fan';

  try {
    const existing = await db.getOne(
      "SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE LOWER(u.email) = LOWER(?)",
      [email]
    );

    if (existing) {
      if (existing.status && existing.status !== 'ACTIVE') {
        return res.status(403).json({ status: 'error', message: 'Account is suspended. Please contact administrator.' });
      }

      // Update profile picture if missing
      if (!existing.profile_image && photo_url) {
        await db.execute("UPDATE users SET profile_image = ? WHERE id = ?", [photo_url, existing.id]);
      }

      req.session.userId = existing.id;
      await logActivity(existing.id, 'GOOGLE_LOGIN', 'users', existing.id, 'User logged in via Google Authentication', req.ip);

      req.session.flash = { success: `Welcome back, ${existing.full_name}! Signed in with Google.` };
      const redirect = existing.role_name.toLowerCase() === 'admin' ? '/admin' : '/';
      return res.json({ status: 'success', redirect, message: 'Login successful' });
    } else {
      // New user -> register with Google
      let username = usernameBase;
      const checkUser = await db.getOne("SELECT id FROM users WHERE username = ?", [username]);
      if (checkUser) {
        username = `${usernameBase}${Math.floor(100 + Math.random() * 900)}`;
      }

      const roleRow = await db.getOne("SELECT id FROM roles WHERE LOWER(name) = LOWER(?)", [roleName]);
      const roleId = roleRow ? roleRow.id : 3;

      const randomPassword = await bcrypt.hash(`${uid}${Date.now()}${Math.random()}`, 10);

      const result = await db.execute(`
        INSERT INTO users (role_id, full_name, username, email, password_hash, profile_image, status)
        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
      `, [roleId, name, username, email, randomPassword, photo_url]);

      req.session.userId = result.insertId;
      await logActivity(result.insertId, 'GOOGLE_REGISTER', 'users', result.insertId, `New user registered via Google: @${username}`, req.ip);

      req.session.flash = { success: 'Account created with Google! Welcome to K-Sync Malaysia.' };
      return res.json({ status: 'success', redirect: '/', message: 'Account created successfully' });
    }
  } catch (err) {
    console.error('Google Auth backend error:', err);
    return res.status(500).json({ status: 'error', message: 'Database error during Google Authentication.' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  } else {
    res.redirect('/login');
  }
});

// GET /profile
router.get('/profile', requireAuth, async (req, res) => {
  res.render('profile');
});

// POST /profile
router.post('/profile', requireAuth, async (req, res) => {
  const { 
    full_name, location, buddy_preference, profile_image, bio,
    organization_name, organization_type, social_handle, social_url 
  } = req.body;
  const userId = req.session.userId;

  try {
    await db.execute(
      `UPDATE users SET 
        full_name = ?, 
        location = ?, 
        buddy_preference = ?, 
        profile_image = ?, 
        bio = ?, 
        organization_name = ?,
        organization_type = ?,
        social_handle = ?,
        social_url = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`,
      [
        full_name.trim(), 
        location ? location.trim() : '', 
        buddy_preference ? buddy_preference.trim() : '', 
        profile_image ? profile_image.trim() : null, 
        bio ? bio.trim() : '',
        organization_name ? organization_name.trim() : null,
        organization_type ? organization_type.trim() : 'Fanclub',
        social_handle ? social_handle.trim() : null,
        social_url ? social_url.trim() : null,
        userId
      ]
    );

    req.session.flash = { success: 'Profile & Social Media links updated successfully!' };
    res.redirect('/profile');
  } catch (err) {
    console.error('Profile update error:', err);
    req.session.flash = { error: 'Failed to update profile.' };
    res.redirect('/profile');
  }
});

// POST /profile/change-password
router.post('/profile/change-password', requireAuth, async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  const userId = req.session.userId;

  if (new_password !== confirm_password) {
    req.session.flash = { error: 'New passwords do not match.' };
    return res.redirect('/profile');
  }

  try {
    const user = await db.getOne("SELECT password_hash FROM users WHERE id = ?", [userId]);
    let isMatch = false;
    if (user && user.password_hash) {
      const fixedHash = user.password_hash.replace(/^\$2y\$/, '$2a$');
      isMatch = await bcrypt.compare(current_password, fixedHash);
    }

    if (!isMatch) {
      req.session.flash = { error: 'Incorrect current password.' };
      return res.redirect('/profile');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(new_password, salt);

    await db.execute("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [newHash, userId]);
    req.session.flash = { success: 'Password changed successfully!' };
    res.redirect('/profile');
  } catch (err) {
    console.error('Password change error:', err);
    req.session.flash = { error: 'Failed to change password.' };
    res.redirect('/profile');
  }
});

export default router;
