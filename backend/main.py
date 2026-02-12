from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from api import router as api_router

app = FastAPI(
    title="AgriAgent SN",
    description="Multi-agent system for Senegalese smallholder farmers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "AgriAgent SN",
        "version": "1.0.0",
        "status": "running",
        "agents": ["orchestrator", "weather", "agro", "market"],
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
