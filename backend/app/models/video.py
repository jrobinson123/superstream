from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index =True)
    title = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)