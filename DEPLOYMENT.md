# Production Deployment Guide: AEGISX (ResQLink v2)

This guide provides step-by-step instructions for deploying the AEGISX platform in a production environment using Docker Compose, Nginx, PostgreSQL/PostGIS, Redis, MapTiler, React, and Flutter.

---

## 1. Prerequisites

- Linux Server (Ubuntu 22.04 LTS or Debian 12 recommended)
- Docker Engine 24.0+ & Docker Compose 2.20+
- Python 3.11+
- Node.js 20+ & npm
- Flutter SDK 3.41+ (for mobile builds)

---

## 2. Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure production secrets in `.env`:
   ```env
   SECRET_KEY="YOUR_SUPER_SECRET_PRODUCTION_KEY"
   POSTGRES_PASSWORD="YOUR_SECURE_POSTGRES_PASSWORD"
   MAPTILER_API_KEY="PTwnGqLq65ZRNpd6OCQQ"
   ```

---

## 3. Container Orchestration (Docker Compose)

Launch the backend services:
```bash
cd backend
docker-compose up -d --build
```

### Verified Container Services:
- `aegisx_fastapi` (Port 8000) - FastAPI Application
- `aegisx_postgis` (Port 5432) - PostgreSQL 15 + PostGIS 3.3
- `aegisx_redis` (Port 6379) - Redis Pub/Sub & Cache
- `aegisx_tileserver` (Port 8080) - TileServer GL
- `aegisx_valhalla` (Port 8002) - Valhalla Routing Engine
- `aegisx_nginx` (Port 80) - Reverse Proxy

---

## 4. React Rescue Dashboard Web Deployment

1. Install dependencies and build production bundle:
   ```bash
   npm install
   npm run build
   ```
2. Deploy the generated `dist/` directory to Nginx, AWS S3 / CloudFront, or Vercel:
   ```bash
   sudo cp -r dist/* /var/www/aegisx-dashboard/
   ```

---

## 5. Flutter Civilian Mobile App Deployment

1. Navigate to mobile app folder:
   ```bash
   cd civilian-mobile
   ```
2. Build Android APK & Bundle:
   ```bash
   flutter build apk --release
   ```
3. Build iOS App Bundle (macOS host required):
   ```bash
   flutter build ipa --release
   ```

---

## 6. Verification & Health Monitoring

Verify that all services are online:
```bash
curl http://localhost:8000/health
```
Expected Output:
```json
{
  "status": "healthy",
  "database": "connected",
  "websockets": "active",
  "tileserver": "online",
  "valhalla": "online"
}
```
