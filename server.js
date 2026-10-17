// server.js - K-Sync Malaysia Main Application Entrypoint (Node.js & Express)
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'url';

// Import Middleware
import { populateCurrentUser } from './src/middleware/auth.js';

// Import Routes
import authRoutes from './src/routes/auth.js';
import eventRoutes from './src/routes/events.js';
import submissionRoutes from './src/routes/submissions.js';
import savedRoutes from './src/routes/saved.js';
import notificationRoutes from './src/routes/notifications.js';
import adminRoutes from './src/routes/admin.js';
import apiRoutes from './src/routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 8000;

// Ensure public and upload directories exist
const publicDir = path.join(__dirname, 'public');
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust reverse proxies (Hostinger LiteSpeed / Cloudflare CDN)
app.set('trust proxy', 1);

// Security Hardening: Disable X-Powered-By & inject HTTP Security Headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Core Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Management
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET must be set when NODE_ENV=production.');
}
app.use(session({
  // Never fall back to a hardcoded secret in production; use a random
  // per-process secret in development so it cannot be guessed.
  secret: sessionSecret || randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true' // Safe behind LiteSpeed reverse proxy
  }
}));

// Serve Static Assets
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// User Injection & Flash Handler Middleware
app.use(populateCurrentUser);

// Mount Application Routes
app.use('/', authRoutes);
app.use('/', eventRoutes);
app.use('/', submissionRoutes);
app.use('/', savedRoutes);
app.use('/', notificationRoutes);
app.use('/', adminRoutes);
app.use('/api', apiRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('partials/header', { title: '404 - Page Not Found | K-Sync Malaysia' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n===========================================================`);
  console.log(`🚀 K-Sync Malaysia (JavaScript / Node.js Express) Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Admin Center: http://localhost:${PORT}/admin`);
  console.log(`✨ Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===========================================================\n`);
});

export default app;
