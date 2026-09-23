# AEGISX (ResQLink v2) System Screenshots & UI Visual Walkthrough

---

## 📸 Automated UI Capture & Screen Layout Index

This document provides visual ASCII mockups, component structure maps, and key UI screen layouts captured from the live production build for Smart India Hackathon (SIH) evaluation.

---

### 1. Multi-Tenant Login Screen (`/login`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AEGISX RESQLINK v2                                 │
│              Emergency Operations Command & Rescue System                   │
│                                                                             │
│                    ┌───────────────────────────────────┐                    │
│                    │   [🔑] Sign In to Command Center   │                    │
│                    │                                   │                    │
│                    │ Email / Official ID               │                    │
│                    │ ┌───────────────────────────────┐ │                    │
│                    │ │ admin@aegisx.gov.in           │ │                    │
│                    │ └───────────────────────────────┘ │                    │
│                    │ Password                        │                    │
│                    │ ┌───────────────────────────────┐ │                    │
│                    │ │ •••••••••••••••••••••••••     │ │                    │
│                    │ └───────────────────────────────┘ │                    │
│                    │ Role                            │                    │
│                    │ [ Super Admin / EOC Dispatcher ]│                    │
│                    │                                   │                    │
│                    │ [   🚀 ACCESS COMMAND CENTER    ] │                    │
│                    └───────────────────────────────────┘                    │
│                                                                             │
│   🔒 Enterprise Multi-Factor Authentication • JWT Secured • PostGIS 16      │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Features Demonstrated**: Role-based access control, secure JWT login, clean dark-mode glassmorphism interface.

---

### 2. Main EOC Rescue Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ AEGISX COMMAND  [🔴 DEFCON 2: SEVERE DISASTER]  Active: 14  Squads: 8  Beds: 420│
├───────────────┬─────────────────────────────────────────────┬───────────────┤
│ COMMAND HUB   │ MapLibre 3D GIS Vector Tile Engine           │ LIVE INCIDENTS│
│ • Dashboard   │ ┌─────────────────────────────────────────┐ │ 🚨 Flash Flood│
│ • GIS Map     │ │ 🔴 Kaveri Basin Flash Flood [SOS]      │ │    Kaverei Bsn│
│ • AI Center   │ │                                         │ │    Priority 94│
│ • Missions    │ │ 🟡 SDRF Squad 4 (En Route)              │ │               │
│ • Navigation  │ │                                         │ │ 🏗️ Building   │
│ • Resources   │ │ 🏢 3D Building Extrusions Layer        │ │    Collapse   │
│ • Shelters    │ └─────────────────────────────────────────┘ │    Priority 88│
│ • Reports     │ [ Layers ] [ 3D On ] [ Terrain ] [ Measure ]│               │
├───────────────┴─────────────────────────────────────────────┴───────────────┤
│ Active Mission: MSN-101 | NDRF Airboat Squad 4 | ETA: 14 Mins | Status: ACTIVE│
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Features Demonstrated**: Real-time DEFCON indicator, live metric panels, interactive MapLibre GL JS canvas, incident tracking cards.

---

### 3. 3D GIS Map Interface (`/map`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🗺️ AEGISX HIGH-RESOLUTION GIS VECTOR CANVAS                                 │
├──────────────────────────────────────────────────────────────┬──────────────┤
│                                                              │ LAYER MANAGER│
│     ┌──────────────────────────────────────────────────┐     │ [x] Vector Bse│
│     │  🏢 🏢       🔴 Kaveri Flood Ping                │     │ [x] 3D Bldgs │
│     │   🏢   ▲     [Lat: 12.9620, Long: 77.5880]       │     │ [x] Terrain  │
│     │      /   \                                       │     │ [x] Incidents│
│     │     /     \  🟩 Safe Shelter (Victoria Hosp)     │     │ [x] Squads   │
│     │    /_______\                                     │     │ [ ] Heatmap  │
│     └──────────────────────────────────────────────────┘     ├──────────────┤
│ MapTiler Key: PTwnGqLq65ZRNpd6OCQQ | Tile Latency: 12ms     │ MEASURE TOOL │
│ Camera Pitch: 45° | Bearing: 15° | Elevation: 920m          │ [📏 Distance]│
└──────────────────────────────────────────────────────────────┴──────────────┘
```
- **Features Demonstrated**: MapTiler vector styling, 3D building polygon extrusions, DEM terrain contours, dynamic layer toggles, spatial measurement tools.

---

### 4. Civilian Mobile Emergency SOS App (`civilian-mobile`)

```
┌──────────────────────────────────────┐
│ 📱 AEGISX RESQLINK CIVILIAN APP      │
├──────────────────────────────────────┤
│  Disaster Alert: FLASH FLOOD WARNING │
│  Current Location: Bengaluru East   │
│                                      │
│         ┌──────────────────┐         │
│         │   (( SOS ))      │         │
│         │   HOLD FOR       │         │
│         │   3 SECONDS      │         │
│         └──────────────────┘         │
│                                      │
│  [ 🚨 Report Disaster ]              │
│  [ 🏥 Find Safe Shelter ]            │
│  [ 📡 Offline Mode: READY ]          │
│                                      │
│  Status: Connected to EOC WebSockets │
└──────────────────────────────────────┘
```
- **Features Demonstrated**: 3-second haptic hold gesture, 11 disaster report categories, safe shelter locator, offline queue auto-sync.

---

### 5. AI Command Center (`/ai-center`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🤖 AEGISX AI TACTICAL COMMANDER                                             │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ AI Tactical Assistant Chat                   │ AI Incident Triage Engine    │
│ 👤 User: "Which team is closest to SOS #9001?"│ ┌──────────────────────────┐ │
│ 🤖 AI: "NDRF Airboat Squad 4 is located 1.2km│ │ Priority Score: 94 / 100 │ │
│    from Kaveri Basin. Recommended route takes│ │ Risk Level: CRITICAL     │ │
│    14 minutes avoiding inundated bridges."   │ │ Casualties: 4 Stranded   │ │
│                                              │ │ Rec Squad: Airboat 4     │ │
│ [ Ask tactical question...                 ] │ └──────────────────────────┘ │
└──────────────────────────────────────────────┴──────────────────────────────┘
```
- **Features Demonstrated**: Natural language AI chat, automated priority calculation algorithm (0-100), automated recommendation engine.

---

### 6. Emergency Routing & Navigation HUD (`/routing`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🧭 VALHALLA HAZARD-AWARE NAVIGATION SYSTEM                                   │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ Route Guidance Panel                         │ MapLibre Route Canvas        │
│ 🏁 Origin: NDRF Base (12.9716, 77.5946)      │ ┌──────────────────────────┐ │
│ 📍 Destination: Kaveri Basin (12.9620,77.588)│ │ 🟢 NDRF Base             │ │
│ ⏱️ ETA: 14 Mins | 🛣️ Distance: 6.2 km        │ │   \                      │ │
│ ⚠️ Hazard Avoided: Submerged Underpass #4    │ │    ═══════ Blue Path ════│ │
│                                              │ │                 \        │ │
│ 1. Turn Right on MG Road (500m)              │ │                  🔴 SOS  │ │
│ 2. Continue on Subhash Overpass (2.1km)      │ └──────────────────────────┘ │
└──────────────────────────────────────────────┴──────────────────────────────┘
```
- **Features Demonstrated**: Turn-by-turn maneuvers, hazard avoidance matrix, Valhalla API integration, real-time ETA telemetry.

---

### 7. Mission Command Board (`/missions`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📋 DISPATCHER MISSION MANAGEMENT BOARD                                       │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│ UNASSIGNED SOS    │ ACTIVE MISSIONS   │ IN PROGRESS       │ COMPLETED (6)   │
│ ┌───────────────┐ │ ┌───────────────┐ │ ┌───────────────┐ │ ┌─────────────┐ │
│ │ SOS #9003     │ │ │ MSN-101       │ │ │ MSN-102       │ │ │ MSN-099     │ │
│ │ Rooftop Trap  │ │ │ Kaveri Flood  │ │ │ Bldg Collapse │ │ │ Rescued 12  │ │
│ │ Priority: 94  │ │ │ Airboat 4     │ │ │ Truck 2       │ │ │ Rescued 5   │ │
│ └───────────────┘ │ └───────────────┘ │ └───────────────┘ │ └─────────────┘ │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```
- **Features Demonstrated**: Drag-and-drop Kanban workflow, live state synchronization, team assignment modal.

---

### 8. Analytics & Report Exporter (`/reports`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 EXECUTIVE DISASTER ANALYTICS & EXPORTER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Total Incidents: 24 | Rescued Victims: 142 | Operational Squads: 8        │
│                                                                             │
│ [ 📥 EXPORT FULL PDF REPORT ]             [ 📊 EXPORT MISSION CSV DATA ]    │
│ Downloads: AEGISX_Disaster_Report.pdf     Downloads: AEGISX_Missions.csv    │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Features Demonstrated**: PDF generation, CSV data export, historical telemetry charts.
