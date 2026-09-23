from fastapi import APIRouter

router = APIRouter()

TEAMS_DB = [
    {
        "id": "team_1",
        "name": "Tactical Water Rescue Squad 4",
        "type": "rescue",
        "leaderName": "Capt. Sarah Jenkins",
        "contactNumber": "+91 98112 33441",
        "availability": "Ready",
        "locationName": "Sector 4 Marine Station",
        "membersCount": 24,
        "avgResponseTimeMin": 8
    }
]

@router.get("")
def list_teams():
    return {"teams": TEAMS_DB}
