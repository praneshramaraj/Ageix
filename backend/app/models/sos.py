from sqlalchemy import Column, String, Float, Integer, DateTime
from datetime import datetime
import uuid
from app.db.base import Base

class SosRequest(Base):
    __tablename__ = 'sos_requests'

    id = Column(String, primary_key=True, default=lambda: f"sos_{uuid.uuid4().hex[:8]}")
    user_name = Column(String, nullable=False)
    username = Column(String, nullable=True)
    user_phone = Column(String, nullable=False)
    age = Column(Integer, nullable=True, default=25)
    blood_group = Column(String, nullable=True, default="O+")
    gender = Column(String, nullable=True, default="Other")
    emergency_contact = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    medical_info = Column(String, nullable=True)
    severity = Column(String, default="critical") # critical, high, medium, low
    status = Column(String, default="PENDING") # PENDING, DISPATCHED, RESCUE_IN_PROGRESS, RESOLVED
    location_name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    required_team_members = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

