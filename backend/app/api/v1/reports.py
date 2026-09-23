from fastapi import APIRouter, UploadFile, File
from app.services.storage_service import storage_service

router = APIRouter()

REPORTS_DB = [
    {
        "id": "rep_201",
        "category": "Flood",
        "title": "Kaveri River Embankment Breach",
        "description": "Water overflowed bank by 3 meters, flooding lower residential colony.",
        "latitude": 12.9650,
        "longitude": 77.5920,
        "severity": "critical",
        "status": "TRIAGED"
    }
]

@router.get("/reports")
def list_reports():
    return {"reports": REPORTS_DB}

@router.post("/reports")
def create_report(report_data: dict):
    REPORTS_DB.insert(0, report_data)
    return {"message": "Report saved", "report": report_data}

@router.post("/media/upload")
async def upload_media(file: UploadFile = File(...)):
    result = await storage_service.save_upload_file(file)
    return {"message": "File uploaded successfully", "file": result}
