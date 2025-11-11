const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes (dengan autentikasi)
router.get('/', authenticateToken, bookController.getAllBooks);
router.get('/:id', authenticateToken, bookController.getBookById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, bookController.addBook);
router.put('/:id', authenticateToken, requireAdmin, bookController.updateBook);
router.delete('/:id', authenticateToken, requireAdmin, bookController.deleteBook);

module.exports = router;