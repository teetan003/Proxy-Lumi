# HTTP IPv4 Static Proxy Selling Platform

A professional, high-performance proxy selling platform built with **Node.js, React, and 3proxy**. Designed for scalability, security, and a premium user experience.

## 🚀 Features

### Core Proxy Engine
- **3proxy Integration**: Dynamic configuration generation for HTTP proxies.
- **Bulk IP Management**: Script for easy binding of multiple IPv4 addresses.
- **Auto-Expiration**: Automated job to disable proxies after they expire using BullMQ.
- **Health Monitoring**: Real-time checking of proxy status and latency.

### User Dashboard
- **Glassmorphism UI**: Modern, premium design with dark mode support.
- **Proxy Management**: Easy purchase, renewal, and management of active proxies.
- **Wallet & Payments**: Integrated VietQR payment system for automated balance top-up.

### Admin Features
- **System Statistics**: Monitor revenue, active proxies, and user growth.
- **User Management**: Control user balances and monitor inventory.
- **Reseller System**: Support for custom pricing and tiered memberships.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Zustand, React Query, Lucide Icons.
- **Backend**: Node.js 22, Express.js, Prisma ORM.
- **Database**: PostgreSQL 16.
- **Cache & Queue**: Redis + BullMQ.
- **Proxy Engine**: 3proxy.
- **Deployment**: Docker & Docker Compose.
- **Gateway**: Nginx.

## 📦 Installation & Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local development)

### Deployment with Docker
1. **Clone the repository**:
   ```bash
   git clone https://github.com/teetan003/Proxy-Lumi.git
   cd Proxy-Lumi
   ```

2. **Configure Environment**:
   - Update `backend/.env` with your JWT secret and database URL if needed.

3. **Start the containers**:
   ```bash
   docker-compose up --build -d
   ```

4. **Access the platform**:
   - Web UI: `http://localhost:80`
   - API: `http://localhost:3000`

### Provisioning IPs
To bind IPv4 addresses to your Linux host, use the provided script:
```bash
cd proxy-node
chmod +x add_ips.sh
./add_ips.sh ips.txt eth0
```

## 📄 License
This project is licensed under the MIT License.

---
Created by **Lumi Codder Ai Angent**
