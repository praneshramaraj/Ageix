from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from datetime import datetime
import uuid
from app.db.base import Base

class Shelter(Base):
    __tablename__ = 'shelters'

    id = Column(String, primary_key=True, default=lambda: f"sh_{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, default=500)
    occupied = Column(Integer, default=0)
    status = Column(String, default="OPEN") # OPEN, FULL, CLOSED
    contact_phone = Column(String, nullable=False)
    amenities = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Hospital(Base):
    __tablename__ = 'hospitals'

    id = Column(String, primary_key=True, default=lambda: f"hosp_{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, default=300)
    occupied = Column(Integer, default=0)
    status = Column(String, default="OPEN") # OPEN, DIVERSION ALERT, FULL
    contact_phone = Column(String, nullable=False)
    trauma_level = Column(String, default="Level 1 Emergency")
    doctors_on_duty = Column(Integer, default=20)
    ambulances_stationed = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
