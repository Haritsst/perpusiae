// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Profil user login
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// Admin routes
router.get('/', authenticateToken, requireAdmin, userController.getUsers);
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);
router.put('/:id/activate', authenticateToken, requireAdmin, userController.toggleUserActive);
router.get('/:id/loans', authenticateToken, userController.getUserLoans);

module.exports = router;
