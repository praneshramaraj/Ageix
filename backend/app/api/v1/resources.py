from fastapi import APIRouter

router = APIRouter()

RESOURCES_DB = [
    {
        "id": "res_1",
        "name": "Potable Drinking Water Drums (200L)",
        "category": "water",
        "currentStock": 420,
        "minThreshold": 1000,
        "maxCapacity": 3000,
        "unit": "Drums",
        "storageHub": "Central Logistics Depot A",
        "status": "LOW STOCK"
    }
]

@router.get("")
def list_resources():
    return {"resources": RESOURCES_DB}
