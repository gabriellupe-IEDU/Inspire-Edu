const { getDb } = require('../models/db');

async function saveMessage(msg) {
  const db = getDb();
  const info = db.prepare('INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)').run(msg.sender_id, msg.recipient_id, msg.content);
  const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
  return row;
}

function sendMessage(req, res) {
  const db = getDb();
  const { recipient_id, content } = req.body;
  const info = db.prepare('INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)').run(req.user.id, recipient_id, content);
  const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
  res.json(row);
}

function listMessages(req, res) {
  const db = getDb();
  const otherId = Number(req.params.userId);
  const rows = db.prepare('SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY created_at ASC').all(req.user.id, otherId, otherId, req.user.id);
  res.json(rows);
}

module.exports = { saveMessage, sendMessage, listMessages };