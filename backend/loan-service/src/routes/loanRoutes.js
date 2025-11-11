// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, loanController.createLoan);
router.get('/', authenticateToken, loanController.getLoans);
router.get('/:id', authenticateToken, loanController.getLoanById);
router.put('/:id/status', authenticateToken, requireAdmin, loanController.updateLoanStatus);
router.delete('/:id', authenticateToken, requireAdmin, loanController.deleteLoan);

module.exports = router;
