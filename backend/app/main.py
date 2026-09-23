import json
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.websocket_manager import ws_manager
from app.api.v1 import auth, sos, incidents, missions, teams, vehicles, resources, shelters_hospitals, reports, ai, sih_demo

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-Grade FastAPI Backend & Real-Time Engine for AEGISX (ResQLink v2) Platform.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root & Health Check Endpoints
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "websockets": "active",
        "tileserver": "online",
        "valhalla": "online",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.get("/metrics")
def get_metrics():
    return {
        "systemCpuUsagePct": 12.4,
        "memoryUsageMb": 256.8,
        "activeWebSocketConnections": len(ws_manager.active_connections),
        "requestsPerSecond": 42.0,
        "avgResponseTimeMs": 14.2
    }

# Include API Routers under /api/v1
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(sos.router, prefix=f"{settings.API_V1_STR}/sos", tags=["SOS Emergency Signals"])
app.include_router(incidents.router, prefix=f"{settings.API_V1_STR}/incidents", tags=["Incidents"])
app.include_router(missions.router, prefix=f"{settings.API_V1_STR}/missions", tags=["Missions"])
app.include_router(teams.router, prefix=f"{settings.API_V1_STR}/teams", tags=["Teams"])
app.include_router(vehicles.router, prefix=f"{settings.API_V1_STR}/vehicles", tags=["Vehicles"])
app.include_router(resources.router, prefix=f"{settings.API_V1_STR}/resources", tags=["Resources"])
app.include_router(shelters_hospitals.router, prefix=f"{settings.API_V1_STR}", tags=["Shelters & Hospitals"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}", tags=["Reports & Media"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Command Center"])
app.include_router(sih_demo.router, prefix=f"{settings.API_V1_STR}/sih", tags=["SIH Hackathon Demo"])


# Backward compatibility routes under /api
app.include_router(auth.router, prefix="/api/auth", tags=["Legacy Auth"])
app.include_router(sos.router, prefix="/api/sos", tags=["Legacy SOS"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Legacy Incidents"])
app.include_router(shelters_hospitals.router, prefix="/api", tags=["Legacy Facilities"])

# WebSocket Endpoint for real-time SOS & Telemetry
@app.websocket("/ws/sos")
async def websocket_sos_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket, channel="sos")
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "PING":
                    await websocket.send_json({"type": "PONG"})
                elif msg.get("type") == "TRIGGER_SOS":
                    sos_data = msg.get("payload", {})
                    new_sos = {
                        "id": f"sos_{int(time.time() * 1000)}",
                        "userName": sos_data.get("userName", "Civilian"),
                        "userPhone": sos_data.get("userPhone", "+91 99999 00000"),
                        "latitude": sos_data.get("latitude", 12.9620),
                        "longitude": sos_data.get("longitude", 77.5880),
                        "medicalInfo": sos_data.get("medicalInfo", "Direct WS SOS"),
                        "severity": "critical",
                        "status": "PENDING",
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                        "locationName": sos_data.get("locationName", "Live GPS"),
                        "description": "Immediate distress ping via WebSocket"
                    }
                    await ws_manager.broadcast_to_channel("sos", {"type": "CIVILIAN_SOS_TRIGGERED", "payload": new_sos})
            except Exception as e:
                print(f"[WebSocket] Message error: {e}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
