from fastapi import APIRouter

router = APIRouter()

VEHICLES_DB = [
    {
        "id": "veh_1",
        "callsign": "AIRBOAT-ALPHA-1",
        "category": "rescue_boat",
        "model": "NDRF High-Speed Airboat",
        "licensePlate": "KA-01-EX-9901",
        "fuelPercent": 92,
        "capacity": 8,
        "driverName": "Coxswain R. Chen",
        "driverPhone": "+91 98765 00112",
        "status": "Operational",
        "latitude": 12.9620,
        "longitude": 77.5880
    }
]

@router.get("")
def list_vehicles():
    return {"vehicles": VEHICLES_DB}
