// database/migrate_to_ch1_schema.js - Clean database to 10 tables according to Chapter 1
import db from '../config/database.js';

async function migrate() {
  console.log('--- Cleaning Database: Trimming to 10 Essential Chapter 1 Tables ---');

  const tablesToDrop = [
    'venues',
    'buddy_requests',
    'conversations',
    'conversation_members',
    'buddy_messages',
    'event_groups',
    'event_group_members',
    'event_updates',
    'event_changes',
    'event_verifications',
    'checkins',
    'user_reports',
    'event_reports',
    'event_interest'
  ];

  for (const tbl of tablesToDrop) {
    try {
      await db.execute(`DROP TABLE IF EXISTS ${tbl}`);
      console.log(`✓ Dropped unused table: ${tbl}`);
    } catch (e) {
      console.warn(`Notice dropping ${tbl}:`, e.message);
    }
  }

  // Ensure unified reports table exists
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      event_id INTEGER,
      report_type TEXT DEFAULT 'EVENT',
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);
  console.log('✓ Ensured unified `reports` table exists');

  // Verify remaining tables
  const remaining = await db.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC");
  console.log(`\nRemaining Tables Count: ${remaining.length}`);
  remaining.forEach((t, i) => console.log(`${i + 1}. ${t.name}`));
}

migrate().catch(console.error);
