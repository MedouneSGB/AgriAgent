import json
import asyncio
import re
import anthropic
from config import settings
from agents.weather_agent import run_weather_agent
from agents.agro_agent import run_agro_agent
from agents.market_agent import run_market_agent

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

# ---------- Keyword-based fast routing (no LLM call) ----------

WEATHER_KEYWORDS = [
    "weather", "meteo", "météo", "taw", "pluie", "rain", "temperature",
    "température", "vent", "wind", "forecast", "prévision", "irrigation",
    "arroser", "ndox", "nawet", "noor", "lolli", "sécheresse", "drought",
    "inondation", "flood", "chaleur", "heat", "humidité", "humidity",
    "soleil", "sun", "nuage", "cloud",
]

AGRO_KEYWORDS = [
    "plant", "planter", "semer", "sow", "crop", "culture", "récolte",
    "harvest", "maladie", "disease", "ravageur", "pest", "feuille", "leaf",
    "tache", "spot", "variété", "variety", "semence", "seed", "engrais",
    "fertilizer", "sol", "soil", "calendrier", "calendar", "arachide",
    "gerte", "mil", "dugub", "riz", "malo", "mais", "maïs", "mbaxal",
    "niebe", "niébé", "tomate", "tamaate", "oignon", "soble", "mangue",
    "coton", "bey", "suuf", "diagnos", "traitement", "treatment",
    "rotation", "compost", "neem", "bio",
]

MARKET_KEYWORDS = [
    "prix", "price", "marché", "market", "vendre", "sell", "acheter",
    "buy", "fcfa", "cfa", "tendance", "trend", "cours", "njeg",
    "coût", "cost", "revenu", "revenue", "stockage", "storage",
    "transport", "bénéfice", "profit", "sandaga", "thiaroye",
]


def _fast_route(message: str) -> list[str]:
    """Route to agents using keyword matching. Returns list of agent names."""
    text = message.lower()
    # Remove accents for fuzzy matching
    text_norm = text.replace("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("ô", "o")

    scores = {
        "weather": sum(1 for k in WEATHER_KEYWORDS if k in text or k in text_norm),
        "agro": sum(1 for k in AGRO_KEYWORDS if k in text or k in text_norm),
        "market": sum(1 for k in MARKET_KEYWORDS if k in text or k in text_norm),
    }

    agents = [name for name, score in scores.items() if score > 0]

    # If no keywords matched, default to agro (most common for farmers)
    if not agents:
        agents = ["agro"]

    return agents


# ---------- Synthesis prompt (used only for multi-agent) ----------

SYNTHESIS_PROMPT = """You synthesize responses from multiple agricultural agents into one coherent answer for a farmer anywhere in the world.
- Be warm, practical, and context-specific to the farmer's region
- Respond in the specified language
- Keep it concise and actionable"""


async def orchestrate(
    message: str,
    city: str | None = None,
    language: str | None = None,
    session_id: str | None = None,
    channel: str = "web",
    user_id: str | None = None,
) -> dict:
    """Main orchestrator: fast keyword routing + parallel sub-agents."""

    # If user is logged in, enrich with profile data
    if user_id and (not city or not language):
        try:
            from services.supabase_service import get_supabase
            sb = get_supabase()
            profile = sb.table("profiles").select("city, preferred_language, zone").eq("id", user_id).single().execute()
            if profile.data:
                city = city or profile.data.get("city") or "kaolack"
                language = language or profile.data.get("preferred_language") or "fr"
        except Exception:
            pass

    lang = language or "en"
    routed_agents = _fast_route(message)

    # Run all routed agents in parallel
    tasks = []
    for agent_name in routed_agents:
        if agent_name == "weather":
            tasks.append(run_weather_agent(message, city=city, language=lang, channel=channel))
        elif agent_name == "agro":
            tasks.append(run_agro_agent(message, language=lang, channel=channel))
        elif agent_name == "market":
            tasks.append(run_market_agent(message, language=lang, channel=channel))

    results = await asyncio.gather(*tasks)

    agents_used = [r.get("agent", "unknown") for r in results]

    # Single agent → return directly (skip synthesis LLM call)
    if len(results) == 1:
        text = results[0].get("response", "")
    else:
        # Multiple agents → synthesize with one fast LLM call
        lang_label = {"en": "English", "fr": "French", "wo": "Wolof"}.get(lang, lang)
        parts = []
        for r in results:
            parts.append(f"[{r.get('agent', 'agent')}]: {r.get('response', '')}")
        synthesis_input = "\n\n".join(parts)
        synthesis_input += f"\n\n[Language: {lang_label}]"

        response = await client.messages.create(
            model=settings.ANTHROPIC_MODEL_FAST,
            max_tokens=1024,
            system=SYNTHESIS_PROMPT,
            messages=[{"role": "user", "content": synthesis_input}],
        )
        text = ""
        for block in response.content:
            if hasattr(block, "text"):
                text += block.text

    detected_lang = language or _detect_language(text)

    return {
        "response": text,
        "language": detected_lang,
        "agents_used": list(set(agents_used)),
        "metadata": {
            "session_id": session_id,
            "city": city,
            "channel": channel,
        },
    }


def _detect_language(text: str) -> str:
    """Detect language: Wolof, English, or French (default)."""
    wolof_markers = [
        "nanga def", "jere jef", "ba beneen", "dina", "mooy",
        "gerte", "dugub", "malo", "mbaxal", "taw", "ndox",
        "bey", "tool", "suuf", "nawet", "noor",
    ]
    english_markers = [
        "what", "how", "when", "where", "please", "help",
        "weather", "plant", "crop", "price", "market",
        "should", "could", "would", "the", "this",
    ]
    text_lower = text.lower()
    wolof_count = sum(1 for w in wolof_markers if w in text_lower)
    english_count = sum(1 for w in english_markers if w in text_lower)
    if wolof_count >= 2:
        return "wo"
    if english_count >= 2:
        return "en"
    return "fr"
