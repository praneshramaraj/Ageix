from fastapi import APIRouter
from pydantic import BaseModel
import time
from app.core.websocket_manager import ws_manager

router = APIRouter()

class ScenarioTriggerSchema(BaseModel):
    scenario: str # "flash_flood", "wildfire", "earthquake"

@router.post("/seed")
def seed_sih_demo_data():
    return {
        "status": "success",
        "message": "SIH Hackathon Demo Data pre-populated into AEGISX Engine",
        "datasetSummary": {
            "demoUsers": 4,
            "incidents": 5,
            "missions": 3,
            "rescueTeams": 4,
            "vehicles": 5,
            "shelters": 3,
            "hospitals": 3,
            "defconLevel": "DEFCON 2 - SEVERE DISASTER ALERT"
        }
    }

@router.post("/scenario")
async def trigger_sih_demo_scenario(body: ScenarioTriggerSchema):
    scenario_type = body.scenario.lower()
    
    if "flood" in scenario_type:
        new_sos = {
            "id": f"sos_sih_{int(time.time())}",
            "userName": "SIH Demo Judge Victim",
            "userPhone": "+91 98112 99000",
            "latitude": 12.9620,
            "longitude": 77.5880,
            "medicalInfo": "Trapped on rooftop due to +3.1m flood rise. Requires airboat extraction.",
            "severity": "critical",
            "status": "PENDING",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "locationName": "Sector 4 Kaveri Basin",
            "description": "SIH Hackathon Simulated Flash Flood Emergency SOS"
        }
        await ws_manager.broadcast_to_channel("sos", {
            "type": "CIVILIAN_SOS_TRIGGERED",
            "payload": new_sos
        })
        return {
            "message": "SIH Flash Flood Emergency scenario triggered live",
            "sos": new_sos
        }

    return {"message": f"SIH Scenario '{body.scenario}' activated"}
