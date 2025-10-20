const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authcontroller');
const { authRequired } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, me);

module.exports = router;