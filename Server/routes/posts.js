const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/authMiddleware');
const { listPosts, createPost } = require('../controllers/postController');

router.get('/', listPosts);
router.post('/', authRequired, createPost);

module.exports = router;