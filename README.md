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
- A Linux server (Ubuntu/Debian recommended for automated setup).
- Root or `sudo` access.

### 🚀 Automated Deployment (Recommended)
The project includes a smart setup script that handles everything automatically, including installing Docker if it's missing!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/teetan003/Proxy-Lumi.git
   cd Proxy-Lumi
   ```

2. **Run the Automated Setup**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   *The script will automatically:*
   - *Install Docker & Docker Compose (if needed).*
   - *Generate secure environment variables (`.env`).*
   - *Build and start all microservices via Docker.*
   - *Initialize the PostgreSQL database schema.*

3. **Access the platform**:
   - Web UI: `http://localhost` (or your server's IP)
   - API: `http://localhost/api`

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
