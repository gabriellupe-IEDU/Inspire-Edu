const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authRequired } = require('../middleware/authMiddleware');
const { uploadReport, listReports, downloadReport } = require('../controllers/reportController');

router.post('/', authRequired, upload.single('pdf'), uploadReport);
router.get('/', authRequired, listReports);
router.get('/download/:id', authRequired, downloadReport);

module.exports = router;