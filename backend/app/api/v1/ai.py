from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AIQuerySchema(BaseModel):
    query: str

@router.post("/query")
def process_ai_query(body: AIQuerySchema):
    q = body.query.lower()
    if "flood" in q or "critical" in q:
        reply = "AI Analysis: Located 2 critical flood & SOS distress pings in active sectors. Top priority is INC-2026-901 at Kaveri River Overflow Zone."
    elif "team" in q or "closest" in q:
        reply = "AI Optimization: NDRF Airboat Rescue Squad 4 is currently available and closest to Sector 4 flood pings (ETA: 8.5 mins)."
    else:
        reply = f"AEGISX AI Engine: Analyzed operational telemetry for '{body.query}'. All dispatch channels operational."
        
    return {"query": body.query, "reply": reply}
