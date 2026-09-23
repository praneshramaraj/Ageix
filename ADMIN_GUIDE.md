# AEGISX (ResQLink v2) Administrator & Dispatcher Operations Guide

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

AEGISX enforces 7 granular role tiers via backend JWT dependencies:

| Role Name | Role Key | Permissions & Scope |
|---|---|---|
| **Super Admin** | `Super Admin` | Full system governance, system logs, database backups, user role promotion. |
| **Admin** | `Admin` | EOC facility setup, resource quota configuration, user onboarding. |
| **Dispatcher** | `Dispatcher` | Incident triage, mission creation, squad dispatching, Valhalla routing execution. |
| **Rescue Commander** | `Rescue Commander` | Field tactical command, team status overrides, DEFCON alert level triggers. |
| **Team Leader** | `Team Leader` | Field squad status updates, victim headcount confirmation, mission completion. |
| **Rescuer** | `Rescuer` | View assigned squad telemetry and turn-by-turn navigation HUD. |
| **Civilian** | `Civilian` | Send SOS distress signals, submit disaster reports, view safe shelters. |

---

## ⚙️ System Configuration & Operational Workflows

---

### 1. DEFCON Emergency Level Adjustment
Dispatchers and Rescue Commanders can modify the global EOC DEFCON alert status:
- **DEFCON 5 (NORMAL)**: Routine standby mode. Green indicator.
- **DEFCON 4 (WATCH)**: Weather warning issued. Blue indicator.
- **DEFCON 3 (ALERT)**: Localized disaster event detected. Yellow indicator.
- **DEFCON 2 (SEVERE)**: Widespread flood / earthquake / storm event. Orange indicator.
- **DEFCON 1 (CRITICAL DISASTER)**: Full national emergency response protocol activated. Flashing Red indicator.

---

### 2. Live Squad & Vehicle Fleet Management
1. Navigate to **Resources & Fleet** (`/resources`).
2. **Add New Squad**: Click `+ Add Rescue Team`, enter team name, commander, member count, and radio channel.
3. **Register Vehicle**: Click `+ Register Vehicle`, enter call sign, type (Ambulance, Airboat, Helicopter), capacity, and equipment payload.
4. **Update Location / Status**: Modify squad availability (`AVAILABLE`, `ON_MISSION`, `MAINTENANCE`, `STANDBY`).

---

### 3. Real-Time Emergency Shelter & Hospital Monitoring
1. Navigate to **Shelters & Hospitals** (`/shelters`).
2. Monitor real-time occupancy counts.
3. Update bed availability manually or configure automated REST telemetry feeds from hospital APIs.
4. Mark facility status (`OPEN`, `HIGH_OCCUPANCY`, `CRITICAL_CAPACITY`, `CLOSED`).

---

### 4. Executing AI-Assisted Automated Triage & Dispatch
1. Open **AI Command Center** (`/ai-center`).
2. Click **Run Automated Triage**. The AI engine evaluates all pending SOS pings against proximity, medical severity, casualty count, and flood rise rate.
3. Review the generated **Priority Score Matrix (0-100)**.
4. Click **Auto-Dispatch Recommended Squads** to batch-assign optimal teams to top-priority victims.

---

### 5. System Health & Performance Diagnostic Monitoring
Access backend telemetry endpoints:
- System Health: `GET http://localhost:8000/health`
- Prometheus Metrics: `GET http://localhost:8000/metrics`
- WebSockets Diagnostic Channel: `ws://localhost:8000/ws/sos`
