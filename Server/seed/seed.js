const { getDb } = require('../models/db');
const bcrypt = require('bcrypt');

async function run() {
  const db = getDb();
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (email,password_hash,name,role_id) VALUES (?, ?, ?, ?)');
  const hash = await bcrypt.hash('password123', 10);
  insertUser.run('admin@inspire-edu.org', hash, 'Admin', 1);
  insertUser.run('volunteer@inspire-edu.org', hash, 'Volunteer', 2);
  insertUser.run('tutor@inspire-edu.org', hash, 'Tutor', 3);
  insertUser.run('student@inspire-edu.org', hash, 'Student', 4);

  const getUser = db.prepare('SELECT id FROM users WHERE email = ?');
  const tutorUser = getUser.get('tutor@inspire-edu.org');
  const insertTutor = db.prepare('INSERT INTO tutors (user_id, bio, rate, rating_avg, location, is_virtual, subjects) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertTutor.run(tutorUser.id, 'Math and Science tutor, 4 years experience', 20, 4.8, 'Remote', 1, 'Algebra,Calculus');
  insertTutor.run(tutorUser.id, 'Writing tutor', 0, 4.6, 'Remote', 1, 'Writing,Reading');

  console.log('Seed complete.');
}
run().catch(e => console.error(e));