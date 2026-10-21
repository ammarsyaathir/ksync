import db from '../config/database.js';

async function migrate() {
  console.log('--- Running Schema Enhancements for 100% Use Case Coverage ---');

  // 1. Create event_recommendations table (UC018: Crowdsourced Reliability Voting)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS event_recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      vote_type TEXT DEFAULT 'UP',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, event_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Table event_recommendations created/verified.');

  // 2. Add notification preferences columns to users table (UC025: Notification Settings)
  const userCols = await db.query("PRAGMA table_info(users)");
  const colNames = userCols.map(c => c.name);

  if (!colNames.includes('notify_event_updates')) {
    await db.execute("ALTER TABLE users ADD COLUMN notify_event_updates INTEGER DEFAULT 1");
    console.log('✅ Added notify_event_updates to users.');
  }
  if (!colNames.includes('notify_countdown_reminders')) {
    await db.execute("ALTER TABLE users ADD COLUMN notify_countdown_reminders INTEGER DEFAULT 1");
    console.log('✅ Added notify_countdown_reminders to users.');
  }
  if (!colNames.includes('notify_discussion_replies')) {
    await db.execute("ALTER TABLE users ADD COLUMN notify_discussion_replies INTEGER DEFAULT 1");
    console.log('✅ Added notify_discussion_replies to users.');
  }

  // 3. Add cluster_area column to events table (UC005: Event Radar)
  const eventCols = await db.query("PRAGMA table_info(events)");
  const eventColNames = eventCols.map(c => c.name);
  if (!eventColNames.includes('cluster_area')) {
    await db.execute("ALTER TABLE events ADD COLUMN cluster_area TEXT");
    console.log('✅ Added cluster_area to events.');
  }

  // 4. Populate cluster_area for existing events based on venue and city
  await db.execute(`
    UPDATE events SET cluster_area = 'Bukit Jalil Hub'
    WHERE venue_name LIKE '%Axiata%' OR venue_name LIKE '%Bukit Jalil%' OR venue_name LIKE '%National Stadium%' OR venue_name LIKE '%Unifi Arena%'
  `);
  await db.execute(`
    UPDATE events SET cluster_area = 'BBCC & Downtown KL'
    WHERE venue_name LIKE '%Zepp%' OR venue_name LIKE '%Bukit Bintang%' OR venue_name LIKE '%KLCC%' OR venue_name LIKE '%Plaza%'
  `);
  await db.execute(`
    UPDATE events SET cluster_area = 'KL Sentral & Brickfields'
    WHERE venue_name LIKE '%Mega Star Arena%' OR venue_name LIKE '%Sentral%'
  `);
  await db.execute(`
    UPDATE events SET cluster_area = 'Petaling Jaya & Sunway'
    WHERE venue_name LIKE '%Sunway%' OR city LIKE '%Petaling Jaya%' OR city LIKE '%Subang%'
  `);
  await db.execute(`
    UPDATE events SET cluster_area = 'Bangsar & Mid Valley'
    WHERE venue_name LIKE '%Bangsar%' OR venue_name LIKE '%Mid Valley%' OR venue_name LIKE '%VCR%'
  `);
  await db.execute(`
    UPDATE events SET cluster_area = 'Penang & Northern Region'
    WHERE city LIKE '%Penang%' OR city LIKE '%George Town%' OR state LIKE '%Penang%'
  `);
  await db.execute(`
    UPDATE events SET cluster_area = 'Kuala Lumpur Metro Hub'
    WHERE cluster_area IS NULL OR cluster_area = ''
  `);

  console.log('✅ Event cluster areas categorized for Event Radar.');
  console.log('--- Migration Complete ---');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
