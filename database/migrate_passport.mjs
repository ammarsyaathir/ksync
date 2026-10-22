import db from '../config/database.js';

async function run() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_passport_stamps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      seat_section TEXT DEFAULT 'General Seated / Standing',
      attendance_status TEXT DEFAULT 'ATTENDED',
      fan_review TEXT,
      stamped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, event_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Created user_passport_stamps table.');

  // Pre-seed a stamp for test user (id: 3 - Aiman Carat) with SEVENTEEN concert
  const existing = await db.getOne("SELECT id FROM user_passport_stamps WHERE user_id = 3 AND event_id = 23");
  if (!existing) {
    await db.execute(`
      INSERT INTO user_passport_stamps (user_id, event_id, seat_section, attendance_status, fan_review)
      VALUES (3, 23, 'VIP Rock Zone (Barricade)', 'ATTENDED', 'Chanted MAESTRO at the top of my lungs! Met amazing fellow Carats outside Axiata.')
    `);
    console.log('✅ Seeded demo passport stamp for user 3.');
  }

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
