const { getDb } = require('../models/db');
const path = require('path');
const fs = require('fs');

function uploadReport(req, res) {
  try {
    const db = getDb();
    const file = req.file;
    const title = req.body.title || file.originalname;
    const info = db.prepare('INSERT INTO reports (uploader_id, filename, filepath, title, description) VALUES (?, ?, ?, ?, ?)').run(req.user.id, file.originalname, file.filename, title, req.body.description || '');
    const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(info.lastInsertRowid);
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: 'Upload failed' });
  }
}

function listReports(req, res) {
  const db = getDb();
  const rows = db.prepare('SELECT r.*, u.email as uploader_email FROM reports r LEFT JOIN users u ON u.id = r.uploader_id ORDER BY uploaded_at DESC').all();
  res.json(rows);
}

function downloadReport(req, res) {
  const db = getDb();
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const filepath = path.join(__dirname, '..', 'uploads', row.filepath);
  res.download(filepath, row.filename);
}

module.exports = { uploadReport, listReports, downloadReport };