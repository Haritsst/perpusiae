require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authClient = require('./utils/grpcClient');
const limiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', limiter);

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========== AUTH ENDPOINTS (gRPC) ==========

// Login
// ...existing code...
app.post('/api/auth/login', (req, res) => {
  console.log('[api-gateway] POST /api/auth/login body=', JSON.stringify(req.body));
  if (!authClient || !authClient.Login) {
    console.error('[api-gateway] authClient or Login method missing', !!authClient, !!(authClient && authClient.Login));
    return res.status(500).json({ success: false, message: 'gRPC client not ready' });
  }

  authClient.Login(req.body, (error, response) => {
    if (error) {
      console.error('[api-gateway] authClient.Login error=', error);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }

    console.log('[api-gateway] authClient.Login response=', response);
    if (!response.success) return res.status(401).json(response); // or 400 sesuai behavior
    res.status(200).json(response);
  });
});
// ...existing code...

// Register
app.post('/api/auth/register', (req, res) => {
  authClient.Register(req.body, (error, response) => {
    if (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
      });
    }
    
    if (!response.success) {
      return res.status(400).json(response);
    }
    
    res.status(201).json(response);
  });
});

// Validate Token
app.post('/api/auth/validate', (req, res) => {
  authClient.ValidateToken(req.body, (error, response) => {
    if (error) {
      return res.status(500).json({
        valid: false,
        message: 'Terjadi kesalahan pada server'
      });
    }
    
    res.json(response);
  });
});

// Refresh Token
app.post('/api/auth/refresh', (req, res) => {
  authClient.RefreshToken(req.body, (error, response) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
      });
    }
    
    if (!response.success) {
      return res.status(401).json(response);
    }
    
    res.json(response);
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  authClient.Logout({ token }, (error, response) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
      });
    }
    
    res.json(response);
  });
});

// Change Password
app.put('/api/auth/change-password', (req, res) => {
  authClient.ChangePassword(req.body, (error, response) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
      });
    }
    
    if (!response.success) {
      return res.status(400).json(response);
    }
    
    res.json(response);
  });
});

// ========== PROXY TO MICROSERVICES (REST) ==========

// User Service
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users'
  },
  onError: (err, req, res) => {
    console.error('User Service error:', err);
    res.status(503).json({
      success: false,
      message: 'User Service tidak tersedia'
    });
  }
}));

// Book Service
app.use('/api/books', createProxyMiddleware({
  target: process.env.BOOK_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/books': '/api/books'
  },
  onError: (err, req, res) => {
    console.error('Book Service error:', err);
    res.status(503).json({
      success: false,
      message: 'Book Service tidak tersedia'
    });
  }
}));

// Loan Service
app.use('/api/loans', createProxyMiddleware({
  target: process.env.LOAN_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/loans': '/api/loans'
  },
  onError: (err, req, res) => {
    console.error('Loan Service error:', err);
    res.status(503).json({
      success: false,
      message: 'Loan Service tidak tersedia'
    });
  }
}));

// Return Service
app.use('/api/returns', createProxyMiddleware({
  target: process.env.RETURN_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/api/returns': '/api/returns'
  },
  onError: (err, req, res) => {
    console.error('Return Service error:', err);
    res.status(503).json({
      success: false,
      message: 'Return Service tidak tersedia'
    });
  }
}));

// Report Service
app.use('/api/reports', createProxyMiddleware({
  target: process.env.REPORT_SERVICE_URL || 'http://localhost:3005',
  changeOrigin: true,
  pathRewrite: {
    '^/api/reports': '/api/reports'
  },
  onError: (err, req, res) => {
    console.error('Report Service error:', err);
    res.status(503).json({
      success: false,
      message: 'Report Service tidak tersedia'
    });
  }
}));

// ========== HEALTH CHECK ==========

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      gateway: 'running',
      auth: 'check /api/auth/health',
      user: 'check /api/users/health',
      book: 'check /api/books/health',
      loan: 'check /api/loans/health',
      return: 'check /api/returns/health',
      report: 'check /api/reports/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ API Gateway running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;