# AEGISX (ResQLink v2) System Architecture & Design Document

---

## 🏗️ High-Level System Architecture

AEGISX is engineered around a decoupled multi-tier architecture enabling high throughput, low latency distress processing, and fault tolerance during catastrophic natural disasters.

```
                               ┌──────────────────────────────────────────────┐
                               │       FLUTTER CIVILIAN MOBILE APP            │
                               │   (Login, Hold-SOS 3s, Report, Offline)      │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTP / WebSocket (ws://)
                                                      ▼
  ┌────────────────────────┐    ┌──────────────────────────────────────────────┐
  │ REACT RESCUE DASHBOARD │    │       SHARED FASTAPI ENTERPRISE BACKEND      │
  │ (GIS, EOC, AI Center)  │◄──►│    (JWT Auth, RBAC, WebSockets, REST API)    │
  └───────────┬────────────┘    └──────────────────────┬───────────────────────┘
              │                                        │
              ▼                                        ▼
 ┌─────────────────────────┐              ┌──────────────────────────┐
 │ MAPLIBRE + MAPTILER GIS │              │ POSTGRESQL + POSTGIS DB  │
 │  (MapTiler API Key)     │              │  (Spatial Geometry Schema)│
 └─────────────────────────┘              └──────────────────────────┘
```

---

## 🧩 Architectural Subsystems

### 1. Flutter Civilian Mobile Subsystem (`civilian-mobile/`)
- **State Management**: Reactive Provider / Stateful Widget architecture.
- **Gesture Engine**: 3-second hold gesture detector with haptic animation loop.
- **Offline Persistence**: Local `SharedPreferences` buffer storing SOS payloads when network connectivity drops. Auto-sync worker restores queued items upon WebSocket reconnection.

### 2. React EOC Command Center (`src/`)
- **State Store**: Modular Zustand stores (`IncidentBoardStore`, `MissionStore`, `TeamStore`, `VehicleStore`, `ResourceStore`).
- **GIS Canvas**: MapLibre GL JS integration powered by MapTiler API Key `PTwnGqLq65ZRNpd6OCQQ`. Supports 3D polygon extrusions, DEM terrain hillshading, vector styling, and custom layer managers.
- **WebSockets Client**: Auto-reconnecting WebSocket connection (`src/services/rescueWebSocket.ts`) receiving real-time SOS distress alerts.

### 3. FastAPI Core Engine (`backend/app/`)
- **Async Framework**: FastAPI running under Uvicorn ASGI server.
- **Authentication**: JWT tokens (24h Access, 7d Refresh) signed via HMAC-SHA256 with bcrypt password hashing.
- **WebSockets Manager**: Concurrent channel broadcaster (`ws_manager.broadcast_to_channel("sos", payload)`).

### 4. AI Tactical Intelligence Suite (`backend/app/api/v1/ai.py`)
- **Triage Matrix Engine**: Automated mathematical scoring algorithm:
  $$\text{Priority Score} = 0.4 \times \text{Medical Severity} + 0.3 \times \text{Flood Rise} + 0.2 \times \text{Casualties} + 0.1 \times \text{Asset Proximity}$$
- **Natural Language Commander**: Tactical assistant generating situational debriefs and team recommendations.

### 5. Valhalla Emergency Routing Engine
- **OpenStreetMap Graph**: OpenSource Valhalla engine processing road networks with custom cost matrices.
- **Hazard Exclusion Polygon Overlay**: Ignores submerged bridges and landslide roads during route calculations.
