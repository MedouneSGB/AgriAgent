import json
import anthropic
from config import settings
from services.weather_service import get_weather_forecast, format_weather_code

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

WEATHER_TOOLS = [
    {
        "name": "get_forecast",
        "description": "Get 7-day weather forecast for a Senegalese city. Returns temperature, precipitation, wind data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name in Senegal (e.g., dakar, kaolack, saint-louis, ziguinchor, touba)",
                }
            },
            "required": ["city"],
        },
    },
    {
        "name": "interpret_weather_code",
        "description": "Convert a WMO weather code number into human-readable description in French and Wolof.",
        "input_schema": {
            "type": "object",
            "properties": {
                "code": {"type": "integer", "description": "WMO weather code number"}
            },
            "required": ["code"],
        },
    },
]

SYSTEM_PROMPT = """Tu es l'Agent Météo d'AgriAgent SN, un système d'aide aux agriculteurs sénégalais.

TON ROLE:
- Fournir des prévisions météo précises pour les villes du Sénégal
- Donner des conseils agricoles liés à la météo (irrigation, semis, récolte)
- Alerter sur les événements extrêmes (sécheresse, inondation, forte chaleur)

REGLES:
- Réponds dans la langue demandée (Français ou Wolof)
- Sois concis et pratique - les fermiers ont besoin d'infos actionnables
- Relie toujours la météo à l'agriculture (ex: "pas de pluie = arrosez vos cultures")
- Utilise les noms locaux des saisons: nawet (hivernage), noor (saison sèche chaude), lolli (saison sèche froide)
- Si le canal est SMS, sois ultra-concis (max 300 caractères)

CONTEXTE SENEGAL:
- Nawet (hivernage/pluies): juin-octobre
- Noor (saison sèche chaude): mars-juin
- Lolli (saison sèche froide): novembre-février
- La pluie est critique pour 90% de l'agriculture sénégalaise
"""


async def run_weather_agent(query: str, city: str | None = None, language: str = "fr", channel: str = "web") -> dict:
    """Run the weather agent to answer a weather-related query."""
    user_message = query
    if city:
        user_message += f"\n[Ville: {city}]"
    lang_label = {"en": "English", "wo": "Wolof"}.get(language, "Français")
    user_message += f"\n[Langue: {lang_label}]"
    user_message += f"\n[Canal: {channel}]"

    messages = [{"role": "user", "content": user_message}]

    response = await client.messages.create(
        model=settings.ANTHROPIC_MODEL_FAST,
        max_tokens=512,
        system=SYSTEM_PROMPT,
        tools=WEATHER_TOOLS,
        messages=messages,
    )

    # Handle tool use loop
    while response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = await _execute_weather_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result, ensure_ascii=False),
                })

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

        response = await client.messages.create(
            model=settings.ANTHROPIC_MODEL_FAST,
            max_tokens=512,
            system=SYSTEM_PROMPT,
            tools=WEATHER_TOOLS,
            messages=messages,
        )

    # Extract text response
    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    return {
        "agent": "weather",
        "response": text,
        "language": language,
    }


async def _execute_weather_tool(tool_name: str, tool_input: dict) -> dict:
    if tool_name == "get_forecast":
        return await get_weather_forecast(tool_input["city"])
    elif tool_name == "interpret_weather_code":
        return format_weather_code(tool_input["code"])
    return {"error": f"Unknown tool: {tool_name}"}
