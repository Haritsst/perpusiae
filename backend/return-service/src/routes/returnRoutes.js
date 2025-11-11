// routes/returnRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const returnController = require('../controllers/returnController');

router.post('/', authenticateToken, returnController.createReturn);
router.get('/', authenticateToken, returnController.getAllReturns);
router.get('/:id', authenticateToken, returnController.getReturnById);
router.put('/:id/status', authenticateToken, requireAdmin, returnController.updateReturnStatus);
router.delete('/:id', authenticateToken, requireAdmin, returnController.deleteReturn);

module.exports = router;
