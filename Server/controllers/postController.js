const { getDb } = require('../models/db');

function listPosts(req, res) {
  const db = getDb();
  const rows = db.prepare('SELECT p.*, u.email as author_email FROM posts p LEFT JOIN users u ON u.id = p.author_id ORDER BY created_at DESC').all();
  res.json(rows);
}

function createPost(req, res) {
  const { title, body, visible_to_roles } = req.body;
  const db = getDb();
  const info = db.prepare('INSERT INTO posts (author_id, title, body, visible_to_roles) VALUES (?, ?, ?, ?)').run(req.user.id, title, body, visible_to_roles || 'all');
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  res.json(row);
}

module.exports = { listPosts, createPost };