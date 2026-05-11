from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# Autogenerate database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SimuDesign AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ensure you restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SimuDesign AI Engine"}

from ai_router import router as ai_router
app.include_router(ai_router)

from ws_router import router as ws_router
app.include_router(ws_router)

from save_router import router as save_router
app.include_router(save_router)

from github_router import router as github_router
app.include_router(github_router)

from collab_router import router as collab_router
app.include_router(collab_router)
