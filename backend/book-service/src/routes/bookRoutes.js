const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes (tanpa autentikasi)
router.get('/', bookController.getAllBooks);   // GET /api/books -> proxied -> book-service '/' handled here
router.get('/:id', bookController.getBookById);

// Admin routes (butuh autentikasi)
router.post('/', authenticateToken, requireAdmin, bookController.addBook);
router.put('/:id', authenticateToken, requireAdmin, bookController.updateBook);
router.delete('/:id', authenticateToken, requireAdmin, bookController.deleteBook);

module.exports = router;