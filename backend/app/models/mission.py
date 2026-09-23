from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from datetime import datetime
import uuid
from app.db.base import Base

class Mission(Base):
    __tablename__ = 'missions'

    id = Column(String, primary_key=True, default=lambda: f"msn_{uuid.uuid4().hex[:8]}")
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL, EMERGENCY
    status = Column(String, default="Pending") # Pending, Assigned, In Progress, Completed, Cancelled, Emergency
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String, nullable=True)
    assigned_team_ids = Column(JSON, default=list)
    assigned_vehicle_ids = Column(JSON, default=list)
    progress_percent = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
