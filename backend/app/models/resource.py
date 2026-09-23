from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
import uuid
from app.db.base import Base

class ResourceItem(Base):
    __tablename__ = 'resources'

    id = Column(String, primary_key=True, default=lambda: f"res_{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # medical, food, water, blankets, fuel, tools, generators, shelters
    current_stock = Column(Integer, default=0)
    min_threshold = Column(Integer, default=100)
    max_capacity = Column(Integer, default=1000)
    unit = Column(String, default="units")
    storage_hub = Column(String, nullable=False)
    status = Column(String, default="OPTIMAL") # OPTIMAL, LOW STOCK, CRITICAL EMPTY
    last_restocked = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
