# AEGISX (ResQLink v2) Spatial Database Architecture Guide

---

## 🗄️ Database Technology Stack
- **Engine**: PostgreSQL 16.x
- **Spatial Extension**: PostGIS 3.4.x
- **ORM / Abstraction**: SQLAlchemy 2.0 + GeoAlchemy2
- **Spatial Reference System**: EPSG:4326 (WGS 84 Longitude / Latitude)

---

## 📐 Normalized Schema Diagram (PostGIS Spatial Tables)

```
  ┌────────────────────────┐         ┌────────────────────────┐
  │         users          │         │      rescue_teams      │
  ├────────────────────────┤         ├────────────────────────┤
  │ id (PK, UUID)          │         │ id (PK, UUID)          │
  │ email (VARCHAR, UNIQUE)│         │ name (VARCHAR)         │
  │ password_hash (VARCHAR)│         │ leader_name (VARCHAR)  │
  │ role (VARCHAR)         │         │ status (VARCHAR)       │
  │ phone (VARCHAR)        │         │ location (GEOMETRY)    │◄───┐ Spatial Point
  └───────────┬────────────┘         └───────────┬────────────┘    │ (EPSG:4326)
              │ 1:N                              │ 1:N             │
              ▼                                  ▼                 │
  ┌────────────────────────┐         ┌────────────────────────┐    │
  │      sos_requests      │         │        missions        │    │
  ├────────────────────────┤         ├────────────────────────┤    │
  │ id (PK, UUID)          │         │ id (PK, UUID)          │    │
  │ user_id (FK -> users)  │◄────────┤ incident_id (FK)       │    │
  │ medical_info (TEXT)    │         │ team_id (FK -> teams)  │────┘
  │ severity (VARCHAR)     │         │ priority (VARCHAR)     │
  │ status (VARCHAR)       │         │ status (VARCHAR)       │
  │ location (GEOMETRY)    │◄──┐     └────────────────────────┘
  └────────────────────────┘   │
                               │ Spatial Point (EPSG:4326)
                               │
  ┌────────────────────────┐   │     ┌────────────────────────┐
  │       incidents        │   │     │   shelters_hospitals   │
  ├────────────────────────┤   │     ├────────────────────────┤
  │ id (PK, UUID)          │   │     │ id (PK, UUID)          │
  │ title (VARCHAR)        │   │     │ name (VARCHAR)         │
  │ category (VARCHAR)     │   │     │ type (VARCHAR)         │
  │ severity (VARCHAR)     │   │     │ capacity (INT)         │
  │ location (GEOMETRY)    │───┘     │ occupancy (INT)        │
  └────────────────────────┘         │ location (GEOMETRY)    │
                                     └────────────────────────┘
```

---

## 🧩 Spatial Data Dictionary

### 1. `users` Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'Civilian',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `incidents` Spatial Table
```sql
CREATE TABLE incidents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    address TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial GIST Index for Sub-Millisecond Radius Queries
CREATE INDEX idx_incidents_location ON incidents USING GIST (location);
```

### 3. `sos_requests` Spatial Table
```sql
CREATE TABLE sos_requests (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    medical_info TEXT,
    severity VARCHAR(50) DEFAULT 'critical',
    status VARCHAR(50) DEFAULT 'PENDING',
    location GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sos_location ON sos_requests USING GIST (location);
```

---

## ⚡ High-Performance Spatial PostGIS Queries

### 1. Find All Incidents Within 5 Kilometers of a Victim's GPS Location
```sql
SELECT 
    id, 
    title, 
    category, 
    ST_Distance(
        location::geography, 
        ST_SetSRID(ST_MakePoint(77.5880, 12.9620), 4326)::geography
    ) / 1000.0 AS distance_km
FROM incidents
WHERE ST_DWithin(
    location::geography, 
    ST_SetSRID(ST_MakePoint(77.5880, 12.9620), 4326)::geography, 
    5000 -- 5000 meters = 5 km
)
ORDER BY distance_km ASC;
```

### 2. Find Closest Available Rescue Squad to SOS Ping
```sql
SELECT 
    id, 
    name, 
    leader_name, 
    ST_Distance(
        location::geography, 
        ST_SetSRID(ST_MakePoint(77.5880, 12.9620), 4326)::geography
    ) AS distance_meters
FROM rescue_teams
WHERE status = 'READY'
ORDER BY location <-> ST_SetSRID(ST_MakePoint(77.5880, 12.9620), 4326)
LIMIT 1;
```
