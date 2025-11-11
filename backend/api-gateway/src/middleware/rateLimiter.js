const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 request per IP
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini, coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;