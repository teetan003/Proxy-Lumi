#!/bin/bash

# Proxy Platform - Automated Update Script
# Created by Lumi Codder Ai Angent

echo "🔄 Bắt đầu cập nhật hệ thống Proxy Platform..."

# Lấy code mới nhất từ GitHub
echo "📥 Đang tải mã nguồn mới nhất..."
git stash
git pull origin main

# Khởi động lại các container với code mới
echo "📦 Đang build và khởi động lại Docker..."
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif docker-compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Không tìm thấy Docker Compose!"
    exit 1
fi

$DOCKER_COMPOSE up --build -d

# Cập nhật Database (phòng trường hợp có thay đổi schema)
echo "⚙️ Đang đồng bộ Database..."
$DOCKER_COMPOSE exec -T backend npx prisma db push --accept-data-loss

echo "------------------------------------------------"
echo "✅ Cập nhật thành công!"
echo "------------------------------------------------"
