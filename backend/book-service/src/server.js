require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'book-service' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan pada server' 
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✓ Book Service running on port ${PORT}`);
});

module.exports = app;