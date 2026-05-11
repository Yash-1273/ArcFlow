import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, index=True)
    global_score = Column(Integer, default=0)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class ProjectVersion(Base):
    __tablename__ = "project_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"))
    version_label = Column(String(50))
    canvas_state = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
