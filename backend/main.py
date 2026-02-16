from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from api import router as api_router
from api_protected import router as protected_router

app = FastAPI(
    title="AgriAgent",
    description="Global multi-agent AI system for farmers worldwide",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://10.69.2.135:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(protected_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "AgriAgent",
        "version": "2.0.0",
        "status": "running",
        "agents": ["orchestrator", "weather", "agro", "market", "alerts"],
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
