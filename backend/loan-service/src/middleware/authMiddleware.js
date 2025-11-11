// middleware/authMiddleware.js
const authClient = require('../utils/grpcClient');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }

  authClient.ValidateToken({ token }, (error, response) => {
    if (error || !response.valid) {
      return res.status(403).json({ success: false, message: 'Token tidak valid' });
    }

    req.user = {
      user_id: response.user_id,
      email: response.email,
      role: response.role
    };
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
