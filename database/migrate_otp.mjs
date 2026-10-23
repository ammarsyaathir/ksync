// database/migrate_otp.mjs - SQLite & MySQL Schema Migration for Email OTP Verifications
import db from '../config/database.js';

async function migrate() {
  console.log('🔄 Running OTP Verifications Table Migration...');

  try {
    const isMy = db.isMySQL();

    if (isMy) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS \`email_otp_verifications\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`email\` VARCHAR(255) NOT NULL,
          \`otp_code\` VARCHAR(10) NOT NULL,
          \`purpose\` VARCHAR(50) DEFAULT 'REGISTRATION',
          \`expires_at\` DATETIME NOT NULL,
          \`is_used\` TINYINT(1) DEFAULT 0,
          \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX \`idx_email_otp\` (\`email\`, \`otp_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ Created MySQL table: email_otp_verifications');
    } else {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS email_otp_verifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          otp_code TEXT NOT NULL,
          purpose TEXT DEFAULT 'REGISTRATION',
          expires_at DATETIME NOT NULL,
          is_used INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await db.execute(`
        CREATE INDEX IF NOT EXISTS idx_otp_email_code ON email_otp_verifications(email, otp_code);
      `);
      console.log('✅ Created SQLite table: email_otp_verifications');
    }

    console.log('🎉 Migration finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
