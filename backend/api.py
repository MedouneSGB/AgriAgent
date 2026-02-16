import json
import asyncio
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import anthropic

from agents.orchestrator import orchestrate, _fast_route
from services.weather_service import get_weather_forecast
from services.sms_service import handle_incoming_sms
from config import settings
from auth import get_optional_user

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    city: Optional[str] = None
    language: Optional[str] = None  # "fr" or "wo" or "en"
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    language: str
    agents_used: list[str]
    metadata: Optional[dict] = None


class SMSRequest(BaseModel):
    From: str
    Body: str


# --- Chat endpoint (main) ---
@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, user_id: str | None = Depends(get_optional_user)):
    try:
        result = await orchestrate(
            message=req.message,
            city=req.city,
            language=req.language,
            session_id=req.session_id,
            user_id=user_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Streaming chat endpoint (SSE) ---
@router.post("/chat/stream")
async def chat_stream(req: ChatRequest, user_id: str | None = Depends(get_optional_user)):
    async def event_stream():
        try:
            routed = _fast_route(req.message)
            yield f"data: {json.dumps({'type': 'routing', 'agents': routed})}\n\n"

            result = await orchestrate(
                message=req.message,
                city=req.city,
                language=req.language,
                session_id=req.session_id,
                user_id=user_id,
            )

            text = result["response"]
            words = text.split(" ")
            for i in range(0, len(words), 3):
                chunk = " ".join(words[i : i + 3])
                if i + 3 < len(words):
                    chunk += " "
                yield f"data: {json.dumps({'type': 'token', 'text': chunk})}\n\n"
                await asyncio.sleep(0.02)

            yield f"data: {json.dumps({'type': 'done', 'agents_used': result['agents_used'], 'language': result.get('language', 'en')})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# --- Weather endpoint ---
@router.get("/weather/{city}")
async def weather(city: str):
    try:
        data = await get_weather_forecast(city)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- SMS webhook ---
@router.post("/sms/incoming")
async def sms_incoming(req: SMSRequest):
    try:
        response = await handle_incoming_sms(req.From, req.Body)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Crop photo diagnosis (Claude Vision) ---
DIAGNOSIS_PROMPT = """You are an expert agricultural advisor for farmers worldwide.
Analyze this photo of a crop/plant and provide:
1. **Identified crop** (if recognizable)
2. **Health assessment** - is the plant healthy or showing signs of disease/stress?
3. **Diagnosis** - if diseased, identify the most likely disease or pest
4. **Symptoms spotted** - describe what you see in the image
5. **Treatment** - practical treatment steps using methods available locally (including traditional/organic methods)
6. **Prevention** - how to prevent this in the future

Be specific, practical, and context-aware (local climate, available products, etc).
Use markdown tables for structured data when appropriate.
Respond in the language specified."""

vision_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)


@router.post("/diagnose")
async def diagnose_crop(
    image: UploadFile = File(...),
    language: str = Form("en"),
):
    try:
        image_data = await image.read()
        b64 = base64.b64encode(image_data).decode("utf-8")

        content_type = image.content_type or "image/jpeg"
        if content_type not in ("image/jpeg", "image/png", "image/gif", "image/webp"):
            content_type = "image/jpeg"

        lang_label = {"en": "English", "fr": "French", "wo": "Wolof"}.get(language, "English")

        response = await vision_client.messages.create(
            model=settings.ANTHROPIC_MODEL,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": content_type,
                                "data": b64,
                            },
                        },
                        {
                            "type": "text",
                            "text": f"Analyze this crop photo. [Language: {lang_label}]",
                        },
                    ],
                }
            ],
            system=DIAGNOSIS_PROMPT,
        )

        text = ""
        for block in response.content:
            if hasattr(block, "text"):
                text += block.text

        return {
            "diagnosis": text,
            "language": language,
            "agents_used": ["vision"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Data endpoints ---
@router.get("/crops")
async def list_crops():
    from data_loader import load_crops
    return load_crops()


@router.get("/markets")
async def list_markets():
    from data_loader import load_markets
    return load_markets()


@router.get("/zones")
async def list_zones():
    from data_loader import load_zones
    return load_zones()


@router.get("/cities")
async def list_cities():
    from config import settings
    return settings.CITIES
