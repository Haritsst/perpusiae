// middleware/authMiddleware.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../../../shared/proto/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
const authClient = new authProto.AuthService(
  process.env.AUTH_SERVICE_URL || 'localhost:50051',
  grpc.credentials.createInsecure()
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan'
    });
  }

  authClient.ValidateToken({ token }, (error, response) => {
    if (error || !response.valid) {
      return res.status(403).json({
        success: false,
        message: 'Token tidak valid'
      });
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
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses.'
    });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
