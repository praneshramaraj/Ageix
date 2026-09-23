from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from datetime import datetime
import uuid
from app.db.base import Base

class DisasterReport(Base):
    __tablename__ = 'disaster_reports'

    id = Column(String, primary_key=True, default=lambda: f"rep_{uuid.uuid4().hex[:8]}")
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    severity = Column(String, default="high")
    status = Column(String, default="REPORTED")
    created_at = Column(DateTime, default=datetime.utcnow)

class MediaAttachment(Base):
    __tablename__ = 'media_attachments'

    id = Column(String, primary_key=True, default=lambda: f"media_{uuid.uuid4().hex[:8]}")
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # image, video, audio, document
    file_size_bytes = Column(Float, default=0)
    uploaded_by = Column(String, nullable=True)
    report_id = Column(String, ForeignKey('disaster_reports.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
