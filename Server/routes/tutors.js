const express = require('express');
const router = express.Router();
const { listTutors, createTutor, getTutor, searchTutors } = require('../controllers/tutorController');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', listTutors);
router.get('/search', searchTutors);
router.get('/:id', getTutor);
router.post('/', authRequired, createTutor);

module.exports = router;