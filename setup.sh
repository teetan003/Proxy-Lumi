#!/bin/bash

# Proxy Platform - Automated Setup Script
# Created by Lumi Codder Ai Angent

echo "🚀 Starting Proxy Platform setup..."

# Detect Docker Compose command
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif docker-compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Error: Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Using: $DOCKER_COMPOSE"

# 1. Create Backend .env if not exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env..."
    cat > backend/.env <<EOF
PORT=3000
DATABASE_URL="postgresql://postgres:secret@postgres:5432/proxy_platform?schema=public"
REDIS_URL="redis://redis:6379"
JWT_SECRET="$(openssl rand -base64 32)"
NODE_ENV=production
EOF
    echo "✅ backend/.env created with a random JWT secret."
else
    echo "ℹ️ backend/.env already exists, skipping."
fi

# 2. Build and start containers
echo "📦 Building and starting Docker containers..."
$DOCKER_COMPOSE up --build -d

# 3. Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# 4. Run Prisma migrations
echo "⚙️ Running database migrations..."
$DOCKER_COMPOSE exec backend npx prisma migrate deploy

echo "------------------------------------------------"
echo "✅ Setup Complete!"
echo "🌐 Frontend: http://localhost:80"
echo "📡 Backend API: http://localhost:3000"
echo "------------------------------------------------"
