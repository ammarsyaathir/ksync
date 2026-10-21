import db from './config/database.js';
import fs from 'fs';
import path from 'path';

async function audit() {
  console.log('=== K-SYNC MALAYSIA USE CASE IMPLEMENTATION AUDIT ===\n');

  // 1. Database Tables Check
  const tables = await db.query("SELECT name FROM sqlite_master WHERE type='table'");
  const tableNames = tables.map(t => t.name);
  console.log('Database Tables Found (' + tableNames.length + '):');
  console.log(tableNames.join(', '));
  console.log('\n----------------------------------------------------\n');

  // Check specific files
  const filesToCheck = [
    'src/routes/auth.js',
    'src/routes/events.js',
    'src/routes/organizer.js',
    'src/routes/admin.js',
    'src/routes/api.js',
    'src/routes/notifications.js',
    'src/routes/saved.js',
    'src/services/verificationEngine.js',
    'views/events.ejs',
    'views/event-details.ejs',
    'views/event-radar.ejs',
    'views/artists.ejs',
    'views/artist-details.ejs',
    'views/dashboard.ejs',
    'views/profile.ejs',
    'views/notifications.ejs',
    'views/organizer/dashboard.ejs',
    'views/organizer/event-form.ejs',
    'views/organizer/event-verification.ejs',
    'views/admin/dashboard.ejs',
    'views/admin/categories.ejs',
    'views/admin/venues.ejs',
    'views/admin/artists.ejs',
    'views/admin/reports.ejs'
  ];

  console.log('Checking Core Files Existence:');
  for (const f of filesToCheck) {
    const exists = fs.existsSync(path.join(process.cwd(), f));
    console.log(`${exists ? '✅' : '❌'} ${f}`);
  }

  process.exit(0);
}

audit().catch(console.error);
