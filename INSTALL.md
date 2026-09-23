# AEGISX (ResQLink v2) Comprehensive Installation Guide

---

## 💻 System Prerequisites

Before installing AEGISX, ensure your development environment satisfies the following requirements:

| Component | Recommended Version | Minimum Version |
|---|---|---|
| **Operating System** | macOS Sonoma / Linux Ubuntu 22.04 / Windows 11 WSL2 | macOS 13+, Ubuntu 20.04 |
| **Node.js** | v20.x or v22.x LTS | v18.0.0 |
| **npm** | v10.x | v9.0.0 |
| **Python** | v3.11 / v3.12 / v3.13 | v3.10.0 |
| **Flutter SDK** | v3.22.x or v3.24.x | v3.19.0 |
| **Dart SDK** | v3.4.x | v3.3.0 |
| **Docker Engine** | v26.x + Docker Compose v2 | v24.0.0 |
| **PostgreSQL + PostGIS** | PostgreSQL 16 + PostGIS 3.4 | PostgreSQL 14 + PostGIS 3.0 |

---

## 🚀 Quick Start Installation (Local Environment)

### 1. Clone & Set Up Directory Structure
```bash
git clone https://github.com/aegisx/resqlink-v2.git AEGISX
cd AEGISX
```

---

### 2. React Rescue Command Dashboard Installation

1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Verify MapTiler API Key in `.env`:
   ```env
   VITE_MAPTILER_API_KEY=PTwnGqLq65ZRNpd6OCQQ
   VITE_BACKEND_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000/ws
   ```
3. Start Vite development server:
   ```bash
   npm run dev
   ```
   *Dashboard available at: `http://localhost:5173`*

4. Build production bundle (optional quality check):
   ```bash
   npm run build
   ```

---

### 3. FastAPI Shared Backend Installation

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create and activate Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run FastAPI database migrations and seed SIH demo data:
   ```bash
   python3 -m uvicorn app.main:app --reload --port 8000
   ```
   *Swagger API Documentation available at: `http://localhost:8000/docs`*

5. Run Pytest automated test suite:
   ```bash
   PYTHONPATH=. pytest tests/
   ```

---

### 4. Flutter Civilian Mobile App Installation

1. Navigate to `civilian-mobile/` directory:
   ```bash
   cd ../civilian-mobile
   ```
2. Fetch Flutter packages:
   ```bash
   flutter pub get
   ```
3. Run static code analyzer check:
   ```bash
   dart analyze .
   ```
4. Launch mobile app on connected device, emulator, or Chrome web target:
   ```bash
   flutter run -d chrome     # Run in Chrome Web Engine
   # OR
   flutter run -d macos      # Run as Native macOS Desktop App
   ```

---

## 🐳 Docker Containerized Full-Stack Deployment

To run the entire ecosystem (FastAPI, React, PostGIS, TileServer GL, Valhalla) in Docker:

```bash
# Start all containers in background
docker-compose up -d --build

# Check status of running containers
docker-compose ps

# View backend logs in real time
docker-compose logs -f backend
```

---

## 🛠️ Verification & Troubleshooting

- **React Web Check**: Open `http://localhost:5173` in browser. Ensure map renders vector tiles.
- **FastAPI Health Check**: Access `http://localhost:8000/health`. Should return `{"status": "healthy", "service": "AEGISX Engine"}`.
- **WebSocket Connection Check**: Test `ws://localhost:8000/ws/sos`.
