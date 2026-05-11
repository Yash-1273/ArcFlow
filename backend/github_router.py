import os
import json
import base64
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from schemas import SystemGraph

router = APIRouter(prefix="/api/v1", tags=["GitHub Integration"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
try:
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except Exception:
    groq_client = None

class GithubRequest(BaseModel):
    repo_url: str

# Files that reveal tech stack and architecture
ARCH_FILES = [
    "README.md", "readme.md",
    "docker-compose.yml", "docker-compose.yaml",
    "package.json", "requirements.txt", "go.mod", "pom.xml", "Cargo.toml",
    "Dockerfile", "nginx.conf", ".env.example",
]

async def fetch_file(client: httpx.AsyncClient, owner: str, repo: str, path: str, headers: dict, max_chars: int = 4000) -> str:
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        resp = await client.get(url, headers=headers, timeout=8)
        if resp.status_code != 200:
            return ""
        data = resp.json()
        if isinstance(data, dict) and data.get("encoding") == "base64":
            content = base64.b64decode(data["content"].replace("\n", "")).decode("utf-8", errors="ignore")
            return content[:max_chars]
    except Exception:
        pass
    return ""

async def list_dir(client: httpx.AsyncClient, owner: str, repo: str, path: str, headers: dict):
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        resp = await client.get(url, headers=headers, timeout=8)
        if resp.status_code == 200 and isinstance(resp.json(), list):
            return resp.json()
    except Exception:
        pass
    return []

@router.post("/from-github", response_model=SystemGraph)
async def generate_from_github(request: GithubRequest):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API client is not configured.")

    parts = request.repo_url.rstrip('/').split('/')
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL")

    owner, repo = parts[-2], parts[-1]
    headers = {}
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

    try:
        async with httpx.AsyncClient() as client:
            # 1. Root directory listing
            root = await list_dir(client, owner, repo, "", headers)
            root_files = [item["name"] for item in root if item["type"] == "file"]
            root_dirs  = [item["name"] for item in root if item["type"] == "dir"]

            # 2. Fetch key architecture files
            context_parts = [f"# Repository: {owner}/{repo}",
                             f"Root files: {', '.join(root_files)}",
                             f"Root directories: {', '.join(root_dirs)}\n"]

            for fname in ARCH_FILES:
                if fname in root_files:
                    content = await fetch_file(client, owner, repo, fname, headers)
                    if content:
                        context_parts.append(f"## {fname}\n```\n{content}\n```\n")

            # 3. Peek inside common service directories to find sub-services
            service_dirs = [d for d in root_dirs if d.lower() in (
                "backend", "frontend", "api", "server", "client", "web", "app",
                "services", "microservices", "packages", "apps", "src"
            )]
            for d in service_dirs[:4]:
                items = await list_dir(client, owner, repo, d, headers)
                names = [i["name"] for i in items]
                context_parts.append(f"## /{d}/ contents: {', '.join(names)}\n")
                # If it's a monorepo services dir, list each sub-service
                sub_dirs = [i["name"] for i in items if i["type"] == "dir"]
                if len(sub_dirs) > 1:
                    context_parts.append(f"Sub-services found: {', '.join(sub_dirs)}\n")
                    # Try to grab package.json / requirements.txt from first sub-service
                    for sd in sub_dirs[:3]:
                        sub_items = await list_dir(client, owner, repo, f"{d}/{sd}", headers)
                        sub_names = [i["name"] for i in sub_items]
                        for cfg in ["package.json", "requirements.txt"]:
                            if cfg in sub_names:
                                content = await fetch_file(client, owner, repo, f"{d}/{sd}/{cfg}", headers, max_chars=1500)
                                if content:
                                    context_parts.append(f"### {d}/{sd}/{cfg}\n```\n{content}\n```\n")
                                    break

        repo_context = "\n".join(context_parts)

        system_prompt = f"""
You are a senior cloud architect reverse-engineering a GitHub repository into a detailed system architecture graph.

{repo_context}

Study the repo context above and produce a COMPREHENSIVE architecture with AT LEAST 6-10 nodes representing every real component you can infer: frontend, backend services, databases, caches, queues, load balancers, auth services, CDN, external APIs, etc.

Output ONLY raw JSON (no markdown fences) following this exact schema:
{{
  "nodes": [
    {{
      "id": "1",
      "type": "api",
      "position": {{"x": 400, "y": 100}},
      "data": {{
        "label": "API Gateway",
        "status": "healthy",
        "latency": 15,
        "max_tps": 5000,
        "description": "Entry point for all client requests. Routes traffic to backend services.",
        "data_steps": [
          "Receive HTTP request from client",
          "Authenticate JWT token",
          "Rate-limit check",
          "Forward to target microservice"
        ]
      }}
    }}
  ],
  "edges": [
    {{"id": "e1-2", "source": "1", "target": "2", "animated": true, "label": "REST"}}
  ]
}}

Valid node types: 'api', 'database', 'cache', 'queue', 'loadbalancer', 'custom'.
- Use 'loadbalancer' for Nginx, HAProxy, AWS ELB, etc.
- Use 'cache' for Redis, Memcached, CDN layers.
- Use 'queue' for Kafka, RabbitMQ, SQS, BullMQ, Celery, etc.
- Use 'database' for any SQL/NoSQL store.
- Use 'api' for every backend service, microservice, REST or GraphQL API.
- Use 'custom' for anything else (auth provider, email service, analytics, external API).

Spread nodes across a large canvas (x: 100-1200, y: 100-900) so they don't overlap.
Write a concise 'description' and 3-5 'data_steps' for each node based on what you infer from the code.
Make sure every edge source and target matches a real node id. Output raw JSON only.
"""
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": system_prompt}],
            response_format={"type": "json_object"},
            temperature=0.15,
        )
        graph_data = json.loads(completion.choices[0].message.content)
        return SystemGraph(**graph_data)

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"GitHub API Error: {str(e)}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
