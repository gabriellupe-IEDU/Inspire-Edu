const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function register(req, res) {
  try {
    const { email, password, name, role = 'student' } = req.body;
    const db = getDb();
    const roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get(role);
    const pwHash = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (email,password_hash,name,role_id) VALUES (?, ?, ?, ?)').run(email, pwHash, name, roleRow.id);
    const user = db.prepare('SELECT id, email, name, role_id FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.prepare('SELECT id,email,password_hash,name,role_id FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

function me(req, res) {
  const db = getDb();
  const user = db.prepare('SELECT id,email,name,role_id,language FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
}

module.exports = { register, login, me };