const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    await client.connect();

    const hash = await bcrypt.hash('password123', 10);

    const users = [
      ['admin@inspire-edu.org', hash, 'Admin'],
      ['volunteer@inspire-edu.org', hash, 'Volunteer'],
      ['tutor@inspire-edu.org', hash, 'Tutor'],
      ['student@inspire-edu.org', hash, 'Student'],
    ];

    for (const [email, password, name] of users) {
      await client.query(
        `INSERT INTO users (email, password, name) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING`,
        [email, password, name]
      );
    }

    const tutorRes = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      ['tutor@inspire-edu.org']
    );

    const tutorId = tutorRes.rows[0]?.id;
    if (!tutorId) throw new Error("Tutor user not found");

    const tutors = [
      [
        'Math and Science tutor, 4 years experience',
        'Algebra,Calculus,Physics',
        25,
        'Orlando, FL',
        true,
        'Weekdays 6–10pm'
      ],
      [
        'Writing and reading tutor focused on college prep and essay structure',
        'Writing,Reading',
        20,
        'Remote',
        true,
        'Weekends 10am–2pm'
      ]
    ];

    for (const [bio, subjects, rate, location, is_virtual, availability] of tutors) {
      await client.query(
        `INSERT INTO tutors (user_id, bio, subjects, rate, location, is_virtual, availability)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [tutorId, bio, subjects, rate, location, is_virtual, availability]
      );
    }

    console.log("✅ Seed complete");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await client.end();
  }
}

seed();