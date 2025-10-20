const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '../data/inspireedu.sqlite');
const dir = path.dirname(dbFile);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let db;
function initDb() {
  db = new Database(dbFile);
  const initSql = fs.readFileSync(path.join(__dirname, '../migrations/001_init.sql'), 'utf8');
  db.exec(initSql);
}
function getDb() {
  if (!db) initDb();
  return db;
}
module.exports = { initDb, getDb };