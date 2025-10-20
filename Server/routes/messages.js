const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/authMiddleware');
const { listMessages, sendMessage } = require('../controllers/messageController');

router.get('/:userId', authRequired, listMessages);
router.post('/', authRequired, sendMessage);

module.exports = router;