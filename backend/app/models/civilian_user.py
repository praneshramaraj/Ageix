from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
import uuid
from app.db.base import Base

class CivilianUser(Base):
    __tablename__ = 'civilian_users'

    id = Column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:8]}")
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    age = Column(Integer, nullable=True, default=25)
    blood_group = Column(String, nullable=True, default="O+")
    phone = Column(String, nullable=False)
    gender = Column(String, nullable=True, default="Other")
    emergency_contact = Column(String, nullable=True, default="+91 98112 33441")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
