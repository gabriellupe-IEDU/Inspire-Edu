require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { initDb } = require('./models/db');

const routesAuth = require('./routes/auth');
const routesTutors = require('./routes/tutors');
const routesMessages = require('./routes/messages');
const routesPosts = require('./routes/posts');
const routesReports = require('./routes/reports');
const rateLimit = require('./middleware/rateLimit');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);

initDb();

app.use('/api/auth', routesAuth);
app.use('/api/tutors', routesTutors);
app.use('/api/messages', routesMessages);
app.use('/api/posts', routesPosts);
app.use('/api/reports', routesReports);

app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.get('/health', (req, res) => res.json({ ok: true }));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});