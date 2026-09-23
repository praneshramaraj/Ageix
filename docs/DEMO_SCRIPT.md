# Smart India Hackathon (SIH) 5-Minute Judge Demo Script
## AEGISX (ResQLink v2) Disaster Management & Emergency Response Platform

---

### Demo Overview
- **Total Duration**: 5 Minutes (0:00 - 5:00)
- **Goal**: Present a flawless, end-to-end real-time disaster emergency scenario to SIH judges.
- **Components Demonstrated**: Civilian Mobile App $\rightarrow$ FastAPI Backend $\rightarrow$ WebSockets $\rightarrow$ React Command Center $\rightarrow$ AI Engine $\rightarrow$ Valhalla Navigation $\rightarrow$ Mission Completion $\rightarrow$ PDF Reports.

---

### Timed Script Breakdown

| Time | Stage | Presenter Script & Live Actions | Expected System Reaction |
|---|---|---|---|
| **0:00** | **Introduction** | *"Honorable SIH Judges, welcome to AEGISX (ResQLink v2). Standard disaster management suffers from slow distress detection, fragmented maps, and manual dispatching. AEGISX unifies civilians, EOC dispatchers, and AI intelligence into a single real-time spatial platform."* | Display **AEGISX Platform Overview** slide or Landing Page. |
| **0:30** | **Login & System Dashboard** | *"We begin at the Rescue Operations Command Center (`http://localhost:5173`). The dispatcher logs in using role-based JWT authentication (`admin@aegisx.gov.in`). Notice the real-time DEFCON level indicator, metric counters, and MapLibre 3D GIS interface loading vector tiles."* | Show EOC Command Dashboard with 3D buildings, dynamic metrics, and live DEFCON status badge. |
| **1:00** | **Civilian SOS Ping** | *"Now let's switch to a civilian in a flooded area using our Flutter Mobile App (`civilian-mobile`). The citizen presses and holds the emergency red SOS button for 3 seconds. The app captures exact GPS coordinates (`12.9620, 77.5880`) and medical info, transmitting the ping instantaneously."* | Flutter app triggers 3s haptic hold, sends POST `/api/v1/sos` & WebSocket event `TRIGGER_SOS`. |
| **1:30** | **Rescue Dashboard Alert** | *"Instantly—in under 15 milliseconds—the EOC Command Center receives a WebSocket distress broadcast (`CIVILIAN_SOS_TRIGGERED`). Watch as the MapLibre GIS map automatically flies the camera directly to the victim's location in Sector 4 Kaveri Basin, highlighting a pulsing critical red distress marker."* | Map camera flies to `[77.588, 12.962]`. Incident card appears on EOC Live Board. Audible alert triggers. |
| **2:00** | **AI Analysis & Priority Ranking** | *"The dispatcher opens the AI Command Center (`/ai-center`). Our AI Triage Classifier evaluates the distress ping, giving it a high Priority Score of **94/100**. The AI Commander Chat assistant explains: 'Rooftop trap due to +3.1m flood level. Immediate airboat squad required.'"* | AI Commander displays natural language tactical advice, triage score 94/100, and recommended equipment. |
| **2:30** | **Dispatcher Mission Assignment** | *"With one click, the dispatcher approves the AI recommendation and creates Rescue Mission #104, assigning NDRF Airboat Squad 4. The mission status transitions to ACTIVE across all connected screens."* | Mission card updates dynamically. Squad status changes to `ON_MISSION`. |
| **3:00** | **Hazard-Aware Route Navigation** | *"The dispatcher launches Emergency Navigation (`/routing`). Valhalla calculates a hazard-aware route from NDRF Base to Sector 4. The map renders turn-by-turn guidance lines while avoiding flooded low-lying bridges, showing real-time ETA telemetry (14 mins, 6.2 km)."* | MapLibre displays Valhalla route path, maneuver direction arrows, distance/ETA panel, and hazard zone overlays. |
| **4:00** | **Mission Completion & Celebration** | *"The rescue squad arrives at the victim's location and executes the airboat extraction. The team leader marks the mission as COMPLETED. The EOC dashboard updates live, metrics decrement active incidents, and a celebratory completion feedback triggers."* | Mission card turns green `COMPLETED`. Metric counter increments rescued total. Confetti effect fires. |
| **4:30** | **Reports & Analytics Export** | *"Finally, the EOC director generates an executive debrief report. Clicking 'Export PDF Report' compiles incident telemetry, casualty counts, team deployment logs, and spatial maps into a downloadable PDF and CSV file."* | Browser downloads `AEGISX_Disaster_Report_2026.pdf` and `AEGISX_Missions.csv`. |
| **5:00** | **Conclusion & Q&A** | *"AEGISX transforms emergency response from reactive chaos into precise, AI-guided coordination. Thank you, judges. We are open for your questions."* | Presenter transitions to Q&A slide. |

---

### Judge Demo Cheat Sheet & Fallback Triggers

- **Automated SIH Flood Scenario Trigger**:
  If presenting without manual mobile app typing, trigger the live scenario via terminal or POST client:
  ```bash
  curl -X POST "http://localhost:8000/api/v1/sih/scenario" \
       -H "Content-Type: application/json" \
       -d '{"scenario": "flash_flood"}'
  ```
- **Pre-populated Demo Seed Data Endpoint**:
  ```bash
  curl -X POST "http://localhost:8000/api/v1/sih/seed"
  ```
