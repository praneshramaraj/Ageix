# AEGISX (ResQLink v2) User Guide

---

## 📱 Section A: Civilian Emergency Mobile Application (Flutter)

---

### 1. Account Sign Up & Login
1. Open the AEGISX Mobile App.
2. Enter your Phone Number or Email address.
3. Tap **Sign In**. Upon first login, complete your profile with your Emergency Medical Contact and Blood Group.

---

### 2. Triggering Emergency SOS (3-Second Hold)
> [!IMPORTANT]
> The SOS button requires a deliberate **3-second hold gesture** to prevent accidental false alarms while ensuring immediate emergency dispatch.

1. On the home screen, tap and press the large red **(( SOS ))** button.
2. Maintain pressure for **3 full seconds**. A circular progress ring and haptic feedback will confirm the trigger.
3. Once released, your exact GPS location, device telemetry, and stored medical info are transmitted immediately to the EOC Rescue Command Center.
4. An active SOS status badge will appear on your screen showing real-time updates as rescue squads are assigned.

---

### 3. Reporting a Disaster Incident
1. Tap **Report Disaster** on the home screen.
2. Select from the **11 Category Tiles**:
   - 🌊 Flood / Tsunami
   - 🏗️ Structural Building Collapse
   - 🚒 Fire / Explosion
   - ⛰️ Landslide / Mudslide
   - 🌀 Cyclone / Storm
   - ⚡ Hazardous Chemical Spill
   - 🚑 Severe Medical Emergency
   - ⚡ Power Grid / Infrastructure Failure
   - 🌋 Volcanic Activity
   - 🚗 Transportation / Highway Disaster
   - ❓ Other Disaster Event
3. Select **Severity Level** (`Low`, `Medium`, `High`, `Critical`).
4. Enter brief description and tap **Submit Incident Report**.

---

### 4. Finding Safe Shelters & Trauma Hospitals
1. Tap **Safe Shelters & Hospitals**.
2. View a list of nearby facilities sorted by distance.
3. Color-coded badges indicate real-time capacity:
   - 🟢 **OPEN**: Space available.
   - 🟡 **HIGH OCCUPANCY**: Near capacity.
   - 🔴 **FULL / CRITICAL**: Facility saturated.
4. Tap **Get Directions** to launch turn-by-turn navigation to the shelter.

---

### 5. Offline Distress Queue
If your cellular network or Wi-Fi connection drops:
- Your SOS signals and incident reports are safely saved to local storage (`SharedPreferences`).
- As soon as network connectivity is restored, the app automatically syncs all queued distress signals with the EOC server.

---

## 💻 Section B: Rescue Operations Command Center (React Web)

---

### 1. Dashboard Interface Navigation
- **Top Navbar**: Displays live DEFCON Status (`DEFCON 1` to `DEFCON 5`), system metrics counters (Active Incidents, On-Duty Squads, Rescued Victims, Bed Availability), and active user profile.
- **Left Command Sidebar**: Quick access to EOC Dashboard, GIS Map, AI Command Center, Missions, Navigation, Resources, Shelters, and Reports.

---

### 2. Interactive MapLibre 3D GIS Controls
- **Zoom & Pan**: Mouse wheel or touch pinch.
- **Rotate & Tilt**: Hold Right-Click + drag mouse to view 3D Building Extrusions.
- **Layer Manager**: Toggle base vector tiles, 3D buildings, DEM terrain elevation, live squad trackers, and flood risk polygons.
- **Measurement Tool**: Click two points on the map to calculate real-time ground distance in meters/kilometers.

---

### 3. Managing Incidents & Assigning Rescue Squads
1. Click **Incidents** or **Missions** on the sidebar.
2. Select an incoming distress ping from the live queue.
3. Click **Assign Squad**.
4. Choose an available rescue team (e.g., `NDRF Alpha Airboat Squad`).
5. Select an emergency vehicle (e.g., `AIRBOAT-4`).
6. Click **Confirm Mission Dispatch**. The squad's status updates instantly across all connected devices.
7. Track squad progress on the map until the mission status is updated to **COMPLETED**.
