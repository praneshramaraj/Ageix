# AEGISX (ResQLink v2) API & WebSockets Technical Reference

---

## 🌐 Base System URLs
- **REST API Base**: `http://localhost:8000/api/v1`
- **WebSockets Endpoint**: `ws://localhost:8000/ws/sos`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **OpenAPI JSON Spec**: `http://localhost:8000/openapi.json`

---

## 🔒 Authentication API (`/api/v1/auth`)

### 1. Register User
- **Endpoint**: `POST /api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Priya Patel",
    "phone": "+91 98112 99000",
    "role": "Civilian"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": "usr_9012",
    "email": "user@example.com",
    "full_name": "Priya Patel",
    "role": "Civilian"
  }
  ```

### 2. Login & Token Exchange
- **Endpoint**: `POST /api/v1/auth/login`
- **Form Data**: `username=user@example.com&password=SecurePassword123!`
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer",
    "role": "Civilian"
  }
  ```

---

## 🚨 SOS Emergency API (`/api/v1/sos`)

### 1. Trigger Emergency SOS Signal
- **Endpoint**: `POST /api/v1/sos`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "user_name": "Priya Patel",
    "user_phone": "+91 98112 99000",
    "latitude": 12.9620,
    "longitude": 77.5880,
    "medical_info": "Trapped on rooftop due to +3.1m flood rise. Requires airboat extraction.",
    "severity": "critical"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "sos_sih_9001",
    "status": "PENDING",
    "created_at": "2026-09-16T00:50:00Z"
  }
  ```

### 2. Fetch Active SOS Queue
- **Endpoint**: `GET /api/v1/sos`
- **Response (200 OK)**: Array of active SOS request objects.

---

## 🌊 Incidents & Missions API (`/api/v1/incidents`, `/api/v1/missions`)

### 1. Fetch All Active Incidents
- **Endpoint**: `GET /api/v1/incidents`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "inc_fl_101",
      "title": "Sector 4 Kaveri Basin Flash Flood",
      "category": "flood",
      "severity": "critical",
      "status": "ACTIVE",
      "latitude": 12.9620,
      "longitude": 77.5880,
      "reported_at": "2026-09-16T00:45:00Z"
    }
  ]
  ```

### 2. Create Rescue Mission
- **Endpoint**: `POST /api/v1/missions`
- **Request Body**:
  ```json
  {
    "title": "Airboat Extraction Mission",
    "incident_id": "inc_fl_101",
    "team_id": "tm_ndrf_01",
    "vehicle_id": "veh_airboat_01",
    "priority": "CRITICAL"
  }
  ```

---

## 🤖 AI Command Center API (`/api/v1/ai`)

### 1. Tactical AI Assistant Chat
- **Endpoint**: `POST /api/v1/ai/chat`
- **Request Body**: `{"prompt": "Which rescue squad is closest to SOS #9001?"}`
- **Response (200 OK)**:
  ```json
  {
    "response": "NDRF Alpha Airboat Squad is located 1.2km away with an estimated response time of 14 minutes avoiding flooded underpasses.",
    "suggested_team_id": "tm_ndrf_01"
  }
  ```

### 2. Execute Automated Triage Matrix
- **Endpoint**: `POST /api/v1/ai/triage`
- **Response (200 OK)**: Returns list of prioritized SOS items scored 0-100 with tactical reasoning.

---

## 🎯 SIH Demo Automation API (`/api/v1/sih`)

### 1. Seed SIH Hackathon Demo Dataset
- **Endpoint**: `POST /api/v1/sih/seed`

### 2. Trigger SIH Flash Flood Scenario
- **Endpoint**: `POST /api/v1/sih/scenario`
- **Request Body**: `{"scenario": "flash_flood"}`

---

## 📡 WebSockets Real-Time Protocol (`ws://localhost:8000/ws/sos`)

### Connection Handshake
Connect via WebSocket client to `ws://localhost:8000/ws/sos`.

### Inbound & Outbound Event Format
```json
{
  "type": "CIVILIAN_SOS_TRIGGERED",
  "payload": {
    "id": "sos_sih_9001",
    "userName": "Priya Patel",
    "userPhone": "+91 98112 99000",
    "latitude": 12.9620,
    "longitude": 77.5880,
    "medicalInfo": "Trapped on rooftop due to +3.1m flood rise.",
    "severity": "critical",
    "status": "PENDING"
  }
}
```
Supported Events:
- `CIVILIAN_SOS_TRIGGERED`: Broadcast when civilian sends SOS ping.
- `MISSION_STATUS_UPDATED`: Broadcast when mission state changes.
- `SQUAD_LOCATION_TELEMETRY`: Broadcast when rescue squad moves on map.
