const { initDb } = require('./models/db');
initDb();
console.log('Migration complete.');