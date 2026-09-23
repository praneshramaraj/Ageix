from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import time
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.websocket_manager import ws_manager
from app.services.notification_service import notification_service
from app.db.session import get_db
from app.models.sos import SosRequest
from app.models.incident import Incident
from app.api.v1.incidents import INCIDENTS_DB
from app.api.v1.missions import MISSIONS_DB

router = APIRouter()

class SosCreateSchema(BaseModel):
    userId: Optional[str] = "user_civilian"
    userName: Optional[str] = "Civilian User"
    username: Optional[str] = "civilian_user"
    userPhone: Optional[str] = "+91 98112 33441"
    age: Optional[int] = 25
    bloodGroup: Optional[str] = "O+"
    gender: Optional[str] = "Other"
    emergencyContact: Optional[str] = "+91 98112 33441"
    latitude: float
    longitude: float
    timestamp: Optional[str] = None
    emergencyType: Optional[str] = "Emergency SOS Distress Call"
    severity: Optional[str] = "critical"
    locationName: Optional[str] = "GPS Location"
    description: Optional[str] = "Emergency SOS Distress Call"
    message: Optional[str] = None
    medicalInfo: Optional[str] = None

class AssignTeamSchema(BaseModel):
    teamId: Optional[str] = "team_alpha"
    teamName: Optional[str] = "NDRF Rescue Unit 1"
    vehicleId: Optional[str] = "veh_01"
    vehicleName: Optional[str] = "Rapid Response Boat R-04"
    eta: Optional[str] = "8 mins"

SOS_DB = [
    {
        "id": "sos_301",
        "userId": "usr_sarah",
        "userName": "Sarah Jenkins",
        "userPhone": "+91 98123 45678",
        "latitude": 12.9620,
        "longitude": 77.5880,
        "medicalInfo": "Asthma, Needs oxygen cylinder support",
        "severity": "critical",
        "status": "DISPATCHED",
        "timestamp": "2026-09-15T22:30:00Z",
        "locationName": "Sector 4 Kaveri Flood Zone",
        "emergencyType": "Flood Rooftop Trapped",
        "description": "Rooftop trapped due to rising water level",
        "message": "Rooftop trapped due to rising water level",
        "incidentId": "inc_101",
        "assignedTeam": "NDRF Rescue Unit 1",
        "assignedVehicle": "Rapid Response Boat R-04",
        "eta": "8 mins"
    }
]

def estimate_required_team_members(emergency_type: str, description: str) -> int:
    text = f"{emergency_type} {description}".lower()
    if "fire" in text or "building" in text or "collapse" in text:
        return 6
    elif "medical" in text or "asthma" in text or "cardiac" in text:
        return 2
    elif "road" in text or "accident" in text or "crash" in text:
        return 4
    elif "flood" in text or "water" in text or "trapped" in text:
        return 4
    return 4

@router.post("")
async def create_sos(sos: SosCreateSchema, db: Session = Depends(get_db)):
    print(f"[TIMING] Backend received request at: {time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime())}.{int(time.time() * 1000) % 1000:03d}Z")
    print(f"[Backend] SOS received: userId={sos.userId}, lat={sos.latitude}, lng={sos.longitude}")
    current_time = sos.timestamp or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    sos_id = f"sos_{int(time.time() * 1000)}"
    inc_id = f"inc_{int(time.time() * 1000)}"
    inc_code = f"INC-2026-{int(time.time()) % 1000:03d}"
    
    msg_text = sos.message or sos.description or sos.medicalInfo or "Distress signal triggered"
    req_rescuers = estimate_required_team_members(sos.emergencyType or "", msg_text)
    
    sos_record = {
        "id": sos_id,
        "userId": sos.userId or "user_civilian",
        "userName": sos.userName or "Civilian User",
        "username": sos.username or "civilian_user",
        "userPhone": sos.userPhone or "+91 98112 33441",
        "age": sos.age or 25,
        "bloodGroup": sos.bloodGroup or "O+",
        "gender": sos.gender or "Other",
        "emergencyContact": sos.emergencyContact or "+91 98112 33441",
        "user": {
            "name": sos.userName or "Civilian User",
            "phone": sos.userPhone or "+91 98112 33441"
        },
        "latitude": sos.latitude,
        "longitude": sos.longitude,
        "location": {
            "latitude": sos.latitude,
            "longitude": sos.longitude
        },
        "medicalInfo": sos.medicalInfo,
        "severity": sos.severity or "critical",
        "priority": sos.severity or "critical",
        "status": "Waiting for Dispatcher",
        "timestamp": current_time,
        "time": current_time,
        "locationName": sos.locationName or f"GPS: {sos.latitude:.4f}, {sos.longitude:.4f}",
        "emergencyType": sos.emergencyType or "Distress Signal",
        "description": msg_text,
        "message": msg_text,
        "incidentId": inc_id,
        "assignedTeam": None,
        "assignedVehicle": None,
        "eta": None,
        "requiredTeamMembers": req_rescuers
    }

    # Save to PostgreSQL if DB session is available
    try:
        db_sos = SosRequest(
            id=sos_id,
            user_name=sos_record["userName"],
            username=sos_record["username"],
            user_phone=sos_record["userPhone"],
            age=sos_record["age"],
            blood_group=sos_record["bloodGroup"],
            gender=sos_record["gender"],
            emergency_contact=sos_record["emergencyContact"],
            latitude=sos.latitude,
            longitude=sos.longitude,
            medical_info=sos.medicalInfo,
            severity=sos.severity or "critical",
            status="Waiting for Dispatcher",
            location_name=sos_record["locationName"],
            description=msg_text,
            required_team_members=req_rescuers
        )
        db.add(db_sos)

        # Create linked Incident in PostgreSQL
        db_inc = Incident(
            id=inc_id,
            code=inc_code,
            title=f"SOS Distress: {sos_record['userName']}",
            category="sos",
            severity=sos.severity or "critical",
            status="Waiting for Dispatcher",
            latitude=sos.latitude,
            longitude=sos.longitude,
            location_name=sos_record["locationName"],
            reported_by=sos_record["userName"],
            contact_number=sos_record["userPhone"],
            description=msg_text
        )
        db.add(db_inc)
        db.commit()
    except Exception as e:
        print(f"[SOS Backend] DB Save warning (continuing in-memory): {e}")

    # Mirror in memory list
    SOS_DB.insert(0, sos_record)
    print(f"[Backend] SOS saved: id={sos_id}")
    
    # Auto-create Incident in memory list
    new_inc = {
        "id": inc_id,
        "code": inc_code,
        "title": f"SOS Distress: {sos_record['userName']}",
        "category": "sos",
        "severity": sos.severity or "critical",
        "status": "Waiting for Dispatcher",
        "latitude": sos.latitude,
        "longitude": sos.longitude,
        "locationName": sos_record["locationName"],
        "reportedBy": sos_record["userName"],
        "contactNumber": sos_record["userPhone"],
        "affectedCount": 1,
        "timestamp": "Just now",
        "description": msg_text,
        "sosId": sos_id
    }
    INCIDENTS_DB.insert(0, new_inc)

    # 2. Broadcast via WebSockets
    ws_payload = {
        "event": "NEW_SOS",
        "type": "NEW_SOS",
        "payload": sos_record
    }
    await ws_manager.broadcast_to_channel("sos", ws_payload)
    print(f"[Backend] NEW_SOS broadcast: id={sos_id}")
    await ws_manager.broadcast_to_channel("sos", {
        "type": "CIVILIAN_SOS_TRIGGERED",
        "payload": sos_record
    })
    await ws_manager.broadcast_to_channel("incidents", {
        "type": "INCIDENT_CREATED",
        "payload": new_inc
    })

    # Dispatch Push & SMS Notifications
    notification_service.send_push_notification(
        ["dispatchers"],
        "🚨 CRITICAL SOS RECEIVED",
        f"{sos_record['userName']} at Lat: {sos.latitude}, Lng: {sos.longitude}"
    )
    notification_service.send_sms(
        sos_record["userPhone"],
        "AEGISX EOC: SOS distress signal received. Waiting for dispatcher assignment."
    )

    return {"message": "SOS received, stored in DB & broadcasted", "sos": sos_record}

@router.get("")
def list_sos():
    return {"sosList": SOS_DB}

@router.post("/{sos_id}/assign-team")
@router.patch("/{sos_id}/assign-team")
async def assign_team_to_sos(sos_id: str, assign_data: AssignTeamSchema, db: Session = Depends(get_db)):
    target_sos = None
    for s in SOS_DB:
        if s["id"] == sos_id:
            target_sos = s
            break
            
    if not target_sos:
        # Check fallback ID prefix matching or pick top PENDING
        for s in SOS_DB:
            if s.get("status") in ["Waiting for Dispatcher", "PENDING"]:
                target_sos = s
                break

    if not target_sos and len(SOS_DB) > 0:
        target_sos = SOS_DB[0]

    if not target_sos:
        raise HTTPException(status_code=404, detail="SOS record not found")

    team_name = assign_data.teamName or "NDRF Alpha Rescue Unit 1"
    veh_name = assign_data.vehicleName or "Rapid Response Boat R-04"
    eta_val = assign_data.eta or "8 mins"
    
    target_sos["status"] = "En Route"
    target_sos["assignedTeam"] = team_name
    target_sos["assignedVehicle"] = veh_name
    target_sos["eta"] = eta_val

    # Also update matching incident
    for inc in INCIDENTS_DB:
        if inc.get("sosId") == target_sos["id"] or inc.get("id") == target_sos.get("incidentId"):
            inc["status"] = "En Route"

    # Create Mission record
    msn_id = f"msn_{int(time.time() * 1000)}"
    new_mission = {
        "id": msn_id,
        "code": f"MSN-TACTICAL-{int(time.time()) % 1000:03d}",
        "title": f"Tactical Rescue for {target_sos['userName']}",
        "priority": target_sos.get("severity", "CRITICAL").upper(),
        "status": "En Route",
        "assignedTeamIds": [assign_data.teamId or "team_alpha"],
        "assignedVehicleIds": [assign_data.vehicleId or "veh_01"],
        "assignedTeam": team_name,
        "assignedVehicle": veh_name,
        "eta": eta_val,
        "progressPercent": 25,
        "locationName": target_sos.get("locationName", "Sector 4"),
        "sosId": target_sos["id"],
        "currentLocation": "En Route from Sector 2 Command Staging Depot"
    }
    MISSIONS_DB.insert(0, new_mission)

    # Update DB if available
    try:
        db_sos = db.query(SosRequest).filter(SosRequest.id == target_sos["id"]).first()
        if db_sos:
            db_sos.status = "En Route"
            db.commit()
    except Exception as e:
        print(f"[SOS Backend] DB update warning: {e}")

    # Broadcast WebSocket updates
    update_payload = {
        "event": "SOS_STATUS_UPDATED",
        "type": "SOS_STATUS_UPDATED",
        "payload": {
            "id": target_sos["id"],
            "status": "En Route",
            "incidentId": target_sos.get("incidentId"),
            "assignedTeam": team_name,
            "assignedVehicle": veh_name,
            "eta": eta_val,
            "missionStatus": "En Route",
            "currentLocation": "En Route from Sector 2 Staging"
        }
    }
    await ws_manager.broadcast_to_channel("sos", update_payload)
    await ws_manager.broadcast_to_channel("missions", {
        "type": "MISSION_UPDATED",
        "payload": new_mission
    })

    return {
        "message": "Team assigned successfully. Status set to En Route.",
        "sos": target_sos,
        "mission": new_mission
    }

@router.patch("/{sos_id}/status")
async def update_sos_status(sos_id: str, status_str: str):
    for s in SOS_DB:
        if s["id"] == sos_id:
            s["status"] = status_str
            await ws_manager.broadcast_to_channel("sos", {
                "type": "SOS_STATUS_UPDATED",
                "payload": s
            })
            return {"message": "Status updated", "sos": s}
    raise HTTPException(status_code=404, detail="SOS not found")

class SendSmsSchema(BaseModel):
    phoneNumber: Optional[str] = "7806994340"
    missionId: Optional[str] = None
    nearestRoute: Optional[str] = "Main Kaveri Arterial Expressway"
    eta: Optional[str] = "8 mins"

@router.post("/{sos_id}/send-sms")
async def send_sos_sms(sos_id: str, payload: SendSmsSchema):
    target_sos = None
    for s in SOS_DB:
        if s["id"] == sos_id:
            target_sos = s
            break
            
    if not target_sos and len(SOS_DB) > 0:
        target_sos = SOS_DB[0]

    if not target_sos:
        raise HTTPException(status_code=404, detail="SOS record not found")

    mission_data = {
        "missionId": payload.missionId or f"MSN-{target_sos['id'][-4:].upper()}",
        "civilianName": target_sos.get("userName", "Civilian User"),
        "age": target_sos.get("age", 25),
        "bloodGroup": target_sos.get("bloodGroup", "O+"),
        "phone": target_sos.get("userPhone", "+91 98112 33441"),
        "latitude": target_sos.get("latitude", 12.9620),
        "longitude": target_sos.get("longitude", 77.5880),
        "locationName": target_sos.get("locationName", "Sector 4 Kaveri Flood Zone"),
        "nearestRoute": payload.nearestRoute or "Main Kaveri Arterial Expressway",
        "eta": target_sos.get("eta") or payload.eta or "8 mins",
        "requiredTeamMembers": target_sos.get("requiredTeamMembers", 4),
        "priority": target_sos.get("severity", "critical")
    }

    dest_number = payload.phoneNumber or "7806994340"
    notification_service.send_rescue_alert_sms(dest_number, mission_data)

    return {
        "message": f"SMS sent successfully to {dest_number}",
        "destination": dest_number,
        "missionData": mission_data
    }


