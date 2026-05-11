import uuid
from pydantic import BaseModel, field_validator
from typing import List, Optional

class NodePosition(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    model_config = {"extra": "allow"}
    label: str
    status: str = "healthy"
    latency: Optional[int] = 0
    max_tps: Optional[int] = 1000
    description: str = ""
    data_steps: List[str] = []

class SystemNode(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    type: str = "api"
    position: NodePosition
    data: NodeData

class SystemEdge(BaseModel):
    model_config = {"extra": "allow"}
    id: str = ""
    source: str
    target: str
    animated: Optional[bool] = True
    label: Optional[str] = ""

    @field_validator("id", mode="before")
    @classmethod
    def ensure_id(cls, v):
        if not v:
            return f"e-{uuid.uuid4().hex[:8]}"
        return v

class SystemGraph(BaseModel):
    nodes: List[SystemNode]
    edges: List[SystemEdge]
