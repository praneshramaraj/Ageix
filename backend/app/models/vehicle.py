from sqlalchemy import Column, String, Integer, Float, DateTime
from datetime import datetime
import uuid
from app.db.base import Base

class Vehicle(Base):
    __tablename__ = 'vehicles'

    id = Column(String, primary_key=True, default=lambda: f"veh_{uuid.uuid4().hex[:8]}")
    callsign = Column(String, nullable=False)
    category = Column(String, default="ambulance") # ambulance, fire_truck, rescue_boat, helicopter, uav_drone, command_vehicle
    model = Column(String, nullable=False)
    license_plate = Column(String, nullable=False)
    fuel_percent = Column(Integer, default=100)
    capacity = Column(Integer, default=4)
    driver_name = Column(String, nullable=False)
    driver_phone = Column(String, nullable=False)
    assigned_mission_id = Column(String, nullable=True)
    status = Column(String, default="Operational") # Operational, Dispatched, Maintenance, Out of Service
    latitude = Column(Float, default=12.9620)
    longitude = Column(Float, default=77.5880)
    last_ping_time = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
