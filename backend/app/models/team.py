from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from datetime import datetime
import uuid
from app.db.base import Base

class Team(Base):
    __tablename__ = 'teams'

    id = Column(String, primary_key=True, default=lambda: f"team_{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    type = Column(String, default="rescue") # rescue, police, fire, medical, volunteers, drone_operators
    leader_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    availability = Column(String, default="Ready") # Ready, Deployed, Resting, Offline
    current_mission_id = Column(String, nullable=True)
    location_name = Column(String, nullable=True)
    latitude = Column(Float, default=12.9620)
    longitude = Column(Float, default=77.5880)
    members_count = Column(Integer, default=5)
    members_list = Column(JSON, default=list)
    skill_set = Column(JSON, default=list)
    equipment = Column(JSON, default=list)
    avg_response_time_min = Column(Integer, default=12)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
