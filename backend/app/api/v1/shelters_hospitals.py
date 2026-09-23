from fastapi import APIRouter

router = APIRouter()

SHELTERS_DB = [
    {
        "id": "sh_101",
        "name": "Central Sports Complex Evacuation Center",
        "address": "Kaveri Main Road, Sector 3",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "capacity": 800,
        "occupied": 420,
        "status": "OPEN",
        "contactPhone": "+91 80 2345 6789"
    }
]

HOSPITALS_DB = [
    {
        "id": "hosp_1",
        "name": "Victoria Memorial General Emergency Hospital",
        "address": "Fort Road, Medical Zone",
        "latitude": 12.9630,
        "longitude": 77.5740,
        "capacity": 350,
        "occupied": 310,
        "status": "OPEN",
        "contactPhone": "+91 80 2670 1111"
    }
]

@router.get("/shelters")
def list_shelters():
    return {"shelters": SHELTERS_DB}

@router.get("/hospitals")
def list_hospitals():
    return {"hospitals": HOSPITALS_DB}
