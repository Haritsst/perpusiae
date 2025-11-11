#!/bin/bash

echo "🚀 Starting all backend services..."

# Start database
echo "📦 Starting database..."
docker-compose up -d postgres redis
sleep 5

# Start Auth Service
echo "🔐 Starting Auth Service..."
cd auth-service
npm run dev > ../logs/auth.log 2>&1 &
cd ..

sleep 2

# Start User Service
echo "👤 Starting User Service..."
cd user-service
npm run dev > ../logs/user.log 2>&1 &
cd ..

sleep 2

# Start Book Service
echo "📚 Starting Book Service..."
cd book-service
npm run dev > ../logs/book.log 2>&1 &
cd ..

sleep 2

# Start Loan Service
echo "📖 Starting Loan Service..."
cd loan-service
npm run dev > ../logs/loan.log 2>&1 &
cd ..

sleep 2

# Start Return Service
echo "🔄 Starting Return Service..."
cd return-service
npm run dev > ../logs/return.log 2>&1 &
cd ..

sleep 2

# Start Report Service
echo "📊 Starting Report Service..."
cd report-service
npm run dev > ../logs/report.log 2>&1 &
cd ..

sleep 2

# Start API Gateway
echo "🚪 Starting API Gateway..."
cd api-gateway
npm run dev > ../logs/gateway.log 2>&1 &
cd ..

sleep 3

echo ""
echo "✅ All services started!"
echo ""
echo "Services:"
echo "  - Auth Service:   localhost:50051 (gRPC)"
echo "  - User Service:   http://localhost:3001"
echo "  - Book Service:   http://localhost:3002"
echo "  - Loan Service:   http://localhost:3003"
echo "  - Return Service: http://localhost:3004"
echo "  - Report Service: http://localhost:3005"
echo "  - API Gateway:    http://localhost:3000"
echo ""
echo "Logs are in ./logs/ folder"
echo ""
echo "To stop all services, run: ./stop-all-services.sh"