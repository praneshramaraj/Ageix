from sqlalchemy import Column, String, Float, Integer, DateTime
from datetime import datetime
import uuid
from app.db.base import Base

class Incident(Base):
    __tablename__ = 'incidents'

    id = Column(String, primary_key=True, default=lambda: f"inc_{uuid.uuid4().hex[:8]}")
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # sos, flood, fire, landslide, earthquake, cyclone, road_closure, missing_person
    severity = Column(String, default="high") # low, medium, high, critical
    status = Column(String, default="Open") # Open, Triaged, In Progress, Resolved, Closed
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String, nullable=True)
    reported_by = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    affected_count = Column(Integer, default=1)
    assigned_mission_id = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
