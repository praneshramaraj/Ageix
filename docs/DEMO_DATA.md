# AEGISX (ResQLink v2) SIH Demo Dataset Specification

---

## 📋 Pre-populated Demo Entities

The AEGISX platform contains a pre-populated dataset designed for Smart India Hackathon (SIH) judging and real-time operational simulation.

---

### 1. Demo Users & Roles (`users`)

| User ID | Full Name | Email | Role | Access Level | Contact |
|---|---|---|---|---|---|
| `usr_admin_01` | Dr. Rajesh Verma | `admin@aegisx.gov.in` | `Super Admin` | Full System Access | +91 98765 43210 |
| `usr_disp_02` | Ananya Sharma | `dispatcher@aegisx.gov.in` | `Dispatcher` | Mission Assignment & Routing | +91 98765 43211 |
| `usr_cmd_03` | Cmdr. Suresh Nair | `commander@aegisx.gov.in` | `Rescue Commander` | EOC Tactical Command | +91 98765 43212 |
| `usr_civ_04` | Priya Patel | `civ_priya@gmail.com` | `Civilian` | SOS & Disaster Reporting | +91 98112 99000 |

---

### 2. Rescue Teams (`rescue_teams`)

| Team ID | Squad Name | Commander / Leader | Members | Specialization | Status | Location (Lat, Long) |
|---|---|---|---|---|---|---|
| `tm_ndrf_01` | NDRF Alpha Airboat Squad | Captain Vikram Singh | 8 | Aquatic Rescue & Airboat Ops | `READY` | 12.9716, 77.5946 |
| `tm_sdrf_02` | SDRF Bravo Urban Search | Lieutenant Sunita Rao | 6 | Structural Collapse Extraction | `ON_MISSION` | 12.9550, 77.5800 |
| `tm_med_03` | Rapid Medical Trauma Unit 1 | Dr. K. Ramanathan | 4 | Field Trauma & Triage | `READY` | 12.9800, 77.6000 |
| `tm_fire_04` | Tactical Fire Rescue Unit 3 | Officer Manoj Kumar | 6 | Hazardous Fire & Chemical | `STANDBY` | 12.9400, 77.5700 |

---

### 3. Rescue Vehicles (`vehicles`)

| Vehicle ID | Call Sign | Type | Capacity | Equipment | Status | Location |
|---|---|---|---|---|---|---|
| `veh_airboat_01` | AIRBOAT-4 | Amphibious Airboat | 10 victims | Life jackets, medical kit, winch | `AVAILABLE` | 12.9716, 77.5946 |
| `veh_amb_02` | AMBULANCE-09 | Advanced Life Support Ambulance | 2 patients | Defibrillator, oxygen, ventilator | `EN_ROUTE` | 12.9550, 77.5800 |
| `veh_truck_03` | RESCUE-TRUCK-2 | High-Clearance 4x4 Truck | 15 victims | Hydraulic cutters, floodlights | `AVAILABLE` | 12.9800, 77.6000 |
| `veh_heli_04` | RESCUE-HELI-1 | Air Ambulance Helicopter | 4 critical | Winch harness, trauma care | `STANDBY` | 12.9900, 77.6100 |

---

### 4. Verified Shelters & Trauma Hospitals (`shelters_hospitals`)

| Facility ID | Name | Type | Capacity | Current Occupancy | Status | Contact | Location |
|---|---|---|---|---|---|---|---|
| `fac_sh_01` | National High School Safe Shelter | Relief Shelter | 500 | 180 | `OPEN` | +91 80 2650 1122 | 12.9580, 77.5760 |
| `fac_hosp_02` | Victoria Trauma Hospital | Hospital | 250 Beds | 210 Beds | `CRITICAL_CAPACITY` | +91 80 2670 1144 | 12.9640, 77.5750 |
| `fac_sh_03` | St. Joseph Stadium Relief Camp | Relief Shelter | 1200 | 450 | `OPEN` | +91 80 2221 4455 | 12.9700, 77.5900 |
| `fac_hosp_04` | Fortis Emergency Care Unit | Hospital | 150 Beds | 85 Beds | `OPEN` | +91 80 6621 4000 | 12.9850, 77.6050 |

---

### 5. Active Incidents (`incidents`)

| Incident ID | Title | Category | Severity | Status | Coordinates | Description |
|---|---|---|---|---|---|---|
| `inc_fl_101` | Sector 4 Kaveri Basin Flash Flood | Flood | `CRITICAL` | `ACTIVE` | 12.9620, 77.5880 | Flash flood inundation +3.1m above danger mark. Multiple citizens stranded on rooftops. |
| `inc_col_102` | Commercial Building Collapse | Structural | `HIGH` | `IN_PROGRESS` | 12.9520, 77.5820 | 3-story masonry building partial collapse post heavy downpour. |
| `inc_fire_103` | Chemical Storage Fire | Fire | `HIGH` | `CONTAINED` | 12.9410, 77.5690 | Industrial warehouse electrical short-circuit fire. |

---

### 6. Emergency SOS Requests (`sos_requests`)

| SOS ID | User Name | Phone | Location | Medical Info | Status | Priority Score |
|---|---|---|---|---|---|---|
| `sos_sih_9001` | Priya Patel | +91 98112 99000 | 12.9620, 77.5880 | Trapped on rooftop with elderly person. Water level rising fast. | `PENDING` | `94 / 100` |
| `sos_sih_9002` | Ramesh Kumar | +91 98441 22334 | 12.9530, 77.5810 | Diabetic patient requiring insulin + leg fracture. | `ASSIGNED` | `88 / 100` |

---

### 7. Active Rescue Missions (`missions`)

| Mission ID | Code | Incident | Assigned Team | Assigned Vehicle | Priority | Status |
|---|---|---|---|---|---|---|
| `msn_101` | MSN-2026-01 | Kaveri Basin Flash Flood | NDRF Alpha Airboat Squad | AIRBOAT-4 | `CRITICAL` | `ACTIVE` |
| `msn_102` | MSN-2026-02 | Building Collapse Extraction | SDRF Bravo Urban Search | RESCUE-TRUCK-2 | `HIGH` | `IN_PROGRESS` |

---

## 🛠️ How to Trigger Demo Data in Backend

### Option A: Via REST API Endpoint
```bash
curl -X POST "http://localhost:8000/api/v1/sih/seed"
```

### Option B: Python Database Seeder Script
```bash
PYTHONPATH=backend python3 -c "from app.api.v1.sih_demo import seed_sih_demo_data; print(seed_sih_demo_data())"
```
