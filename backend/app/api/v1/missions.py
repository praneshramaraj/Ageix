from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import time
from app.core.websocket_manager import ws_manager

router = APIRouter()

MISSIONS_DB = [
    {
        "id": "msn_101",
        "code": "MSN-TACTICAL-44",
        "title": "Operation Tidal Shield Evac",
        "priority": "CRITICAL",
        "status": "In Progress",
        "assignedTeamIds": ["team_1"],
        "assignedVehicleIds": ["veh_1"],
        "progressPercent": 68,
        "locationName": "Sector 4 Kaveri Basin"
    }
]

@router.get("")
def list_missions():
    return {"missions": MISSIONS_DB}

@router.post("")
async def create_mission(data: dict):
    mission = {
        "id": f"msn_{int(time.time() * 1000)}",
        "code": f"MSN-2026-{int(time.time()) % 1000}",
        "title": data.get("title", "Tactical Rescue Mission"),
        "priority": data.get("priority", "HIGH"),
        "status": "In Progress",
        "assignedTeamIds": data.get("assignedTeamIds", []),
        "assignedVehicleIds": data.get("assignedVehicleIds", []),
        "progressPercent": 10,
        "locationName": data.get("locationName", "Sector 4")
    }
    MISSIONS_DB.insert(0, mission)
    
    await ws_manager.broadcast_to_channel("missions", {
        "type": "MISSION_UPDATED",
        "payload": mission
    })
    return {"message": "Mission created", "mission": mission}
