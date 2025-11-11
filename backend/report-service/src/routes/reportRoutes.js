const express = require('express');
const { getLoanReport } = require('../controllers/reportController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/loans', authenticateToken, requireAdmin, getLoanReport);

module.exports = router;
