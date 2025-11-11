const express = require('express');
const { getStatistics } = require('../controllers/statisticsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/statistics', authenticateToken, requireAdmin, getStatistics);

module.exports = router;
