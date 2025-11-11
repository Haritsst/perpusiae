require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const authServiceMethods = require('./services/authService');
const pool = require('./config/database'); // <--- tambahkan ini

// Load proto file
const PROTO_PATH = path.join(__dirname, './proto/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

async function main() {
  try {
    // Tes koneksi ke database
    await pool.query('SELECT NOW()');
    console.log('✓ Database connected');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  }

  // Buat server gRPC
  const server = new grpc.Server();
  server.addService(authProto.AuthService.service, authServiceMethods);

  const PORT = process.env.GRPC_PORT || '50051';
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('Failed to start gRPC server:', error);
        return;
      }
      console.log(`✓ Auth Service (gRPC) running on port ${port}`);
      server.start();
    }
  );
}

main();
