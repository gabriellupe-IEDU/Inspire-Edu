const { getDb } = require('../models/db');

function listTutors(req, res) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM tutors ORDER BY rating_avg DESC').all();
  res.json(rows);
}

function getTutor(req, res) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM tutors WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
}

function createTutor(req, res) {
  const db = getDb();
  const { bio, rate, location, is_virtual, subjects } = req.body;
  const info = db.prepare('INSERT INTO tutors (user_id,bio,rate,location,is_virtual,subjects) VALUES (?, ?, ?, ?, ?, ?)').run(req.user.id, bio, rate || 0, location || '', is_virtual ? 1 : 0, (subjects || []).join(','));
  const tutor = db.prepare('SELECT * FROM tutors WHERE id = ?').get(info.lastInsertRowid);
  res.json(tutor);
}

function searchTutors(req, res) {
  const q = (req.query.q || '').toLowerCase();
  const mode = req.query.mode || 'any';
  const minRating = Number(req.query.minRating || 0);
  const db = getDb();
  const rows = db.prepare('SELECT * FROM tutors').all().filter(t => {
    const sMatch = !q || (t.subjects || '').toLowerCase().includes(q) || (t.bio || '').toLowerCase().includes(q);
    const mMatch = mode === 'any' ? true : (mode === 'virtual' ? t.is_virtual === 1 : t.is_virtual === 0);
    const rMatch = (t.rating_avg || 0) >= minRating;
    return sMatch && mMatch && rMatch;
  });
  res.json(rows);
}

module.exports = { listTutors, getTutor, createTutor, searchTutors };