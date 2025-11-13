const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto
const protoPath = path.join(__dirname, '../../../shared/proto/auth.proto');
const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

const authServiceAddress = process.env.AUTH_SERVICE_URL || 'auth-service:50051';
console.log('[grpcClient] authServiceAddress=', authServiceAddress);

const authClient = new authProto.AuthService(authServiceAddress, grpc.credentials.createInsecure());

console.log('[grpcClient] authClient methods:', Object.keys(Object.getPrototypeOf(authClient)).filter(k => typeof authClient[k] === 'function'));
module.exports = authClient;