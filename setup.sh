#!/bin/bash

# Proxy Platform - Automated Setup Script
# Created by Lumi Codder Ai Angent

echo "🚀 Starting Proxy Platform setup..."

# Detect OS and Install Docker if missing
if ! command -v docker >/dev/null 2>&1; then
    echo "⚠️ Docker not found. Attempting to install Docker..."
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg
        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        sudo systemctl enable --now docker
        echo "✅ Docker installed successfully."
    else
        echo "❌ Error: Unsupported OS for auto-installation. Please install Docker manually."
        exit 1
    fi
fi

# Detect Docker Compose command
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif docker-compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "⚠️ Docker Compose not found. Attempting to install Docker Compose..."
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
        DOCKER_COMPOSE="docker compose"
        echo "✅ Docker Compose plugin installed."
    else
        echo "❌ Error: Could not install Docker Compose. Please install it manually."
        exit 1
    fi
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
$DOCKER_COMPOSE exec -T backend npx prisma migrate deploy

echo "------------------------------------------------"
echo "✅ Setup Complete!"
echo "🌐 Frontend: http://localhost:80"
echo "📡 Backend API: http://localhost:3000"
echo "------------------------------------------------"
