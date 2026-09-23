from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import time
from app.core.websocket_manager import ws_manager

router = APIRouter()

class IncidentCreateSchema(BaseModel):
    title: str
    category: str
    severity: str = "high"
    latitude: float
    longitude: float
    locationName: Optional[str] = "GIS Coordinate"
    reportedBy: Optional[str] = "EOC System"
    contactNumber: Optional[str] = "+91 99999 00000"
    affectedCount: Optional[int] = 1
    description: Optional[str] = ""

INCIDENTS_DB = [
    {
        "id": "inc_101",
        "code": "INC-2026-901",
        "title": "SOS Alert #4012 - Trapped Civilians in Submerged Home",
        "category": "sos",
        "severity": "critical",
        "status": "In Progress",
        "latitude": 12.9620,
        "longitude": 77.5880,
        "locationName": "Kaveri River Overflow Zone (Sector 4)",
        "reportedBy": "Civilian Emergency Ping",
        "contactNumber": "+91 98112 33441",
        "affectedCount": 6,
        "assignedMissionId": "msn_101",
        "timestamp": "10 mins ago",
        "description": "Rooftop evacuation required due to rapid flood water rise (+2.8m depth)."
    }
]

@router.get("")
def list_incidents():
    return {"incidents": INCIDENTS_DB}

@router.post("")
async def create_incident(inc: IncidentCreateSchema):
    new_inc = {
        "id": f"inc_{int(time.time() * 1000)}",
        "code": f"INC-2026-{int(time.time()) % 1000}",
        "title": inc.title,
        "category": inc.category,
        "severity": inc.severity,
        "status": "Open",
        "latitude": inc.latitude,
        "longitude": inc.longitude,
        "locationName": inc.locationName,
        "reportedBy": inc.reportedBy,
        "contactNumber": inc.contactNumber,
        "affectedCount": inc.affectedCount,
        "timestamp": "Just now",
        "description": inc.description
    }
    INCIDENTS_DB.insert(0, new_inc)
    
    await ws_manager.broadcast_to_channel("incidents", {
        "type": "INCIDENT_CREATED",
        "payload": new_inc
    })
    
    return {"message": "Incident created", "incident": new_inc}
