import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import SystemGraph
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["Persistence"])

class SaveRequest(BaseModel):
    name: str = "My Architecture"
    graph: SystemGraph

@router.post("/save")
def save_project(request: SaveRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(models.User).filter_by(username="demo_founder").first()
        if not user:
            user = models.User(username="demo_founder")
            db.add(user)
            db.commit()
            db.refresh(user)
            
        project = models.Project(user_id=user.id, name=request.name)
        db.add(project)
        db.commit()
        db.refresh(project)
        
        version = models.ProjectVersion(
            project_id=project.id,
            version_label="V1 Initial",
            canvas_state=request.graph.model_dump()
        )
        db.add(version)
        db.commit()
        
        return {"status": "success", "project_id": project.id, "message": "Architecture Saved!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
