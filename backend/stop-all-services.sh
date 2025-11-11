#!/bin/bash

echo "🛑 Stopping all backend services..."

# Hentikan semua proses Node.js yang berjalan di host
pkill -f "node.*auth-service"
pkill -f "node.*user-service"
pkill -f "node.*book-service"
pkill -f "node.*loan-service"
pkill -f "node.*return-service"
pkill -f "node.*report-service"
pkill -f "node.*api-gateway"

# Hentikan semua container Docker Compose tanpa menghapusnya
docker-compose stop

echo "✅ All services stopped (containers not removed)!"
