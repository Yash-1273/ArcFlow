import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from schemas import SystemGraph

router = APIRouter(prefix="/api/v1", tags=["AI Generation"])

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
try:
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except Exception:
    groq_client = None

class GenerateRequest(BaseModel):
    prompt: str

@router.post("/generate", response_model=SystemGraph)
async def generate_architecture(request: GenerateRequest):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API client is not configured. Missing GROQ_API_KEY environment variable.")

    system_prompt = """
You are an expert cloud architect. Your task is to design a software system architecture based on the user's request.
You MUST output ONLY valid JSON representing a SystemGraph object.
The JSON must strictly follow this structure:
{
  "nodes": [
    {
      "id": "1",
      "type": "api",
      "position": {"x": 250, "y": 100},
      "data": {
        "label": "API Gateway",
        "status": "healthy",
        "latency": 15,
        "max_tps": 5000,
        "description": "Entry point for all client requests. Handles routing, authentication, and rate limiting.",
        "data_steps": [
          "Receive HTTP/HTTPS request from client",
          "Validate JWT bearer token",
          "Apply rate limiting rules",
          "Route request to target microservice"
        ]
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "animated": true,
      "label": "REST"
    }
  ]
}
Valid Node Types: 'api', 'database', 'cache', 'queue', 'loadbalancer'.
Use the best node type for each component. Examples: Redis → cache, Kafka/RabbitMQ → queue, Nginx/HAProxy → loadbalancer.
For each node, write a concise 'description' (1-2 sentences) and 3-5 'data_steps' explaining exactly how data flows through that component.
Distribute nodes intelligently on the x,y plane so they don't overlap.
Make sure edge source and targets exactly match the node IDs.
Do not respond with markdown wrapping the JSON (no ```json). Output raw JSON.
"""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Design a highly scalable system for: {request.prompt}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2, # Low temp for structured adherence
        )
        
        graph_data = json.loads(completion.choices[0].message.content)
        return SystemGraph(**graph_data)
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON structure.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_architecture(graph: SystemGraph):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API client is not configured.")

    system_prompt = """
You are an elite Software Architecture Analyst. 
The user provides a graph JSON of their system architecture.
Analyze it for bottlenecks, missing components (like caches, load balancers), and cost inefficiencies.
Return strict JSON:
{
  "score": 85,
  "estimated_monthly_cost": 450.00,
  "suggestions": [
    "Add a Redis cache between the API Gateway and PostgreSQL to reduce DB read stress.",
    "Increase Max Throughput on your Load Balancer for the current traffic."
  ]
}
Do not use markdown wrappers. Output raw JSON.
"""
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": graph.model_dump_json()}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
