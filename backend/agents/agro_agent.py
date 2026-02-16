import json
import anthropic
from config import settings
from data_loader import get_crop, get_diseases_for_crop, get_zone

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

AGRO_TOOLS = [
    {
        "name": "get_crop_info",
        "description": "Get detailed information about a crop: varieties, calendar, soil, water needs, tips. Works for crops worldwide.",
        "input_schema": {
            "type": "object",
            "properties": {
                "crop_name": {
                    "type": "string",
                    "description": "Crop name in French or Wolof (e.g., arachide/gerte, mil/dugub, riz/malo, tomate/tamaate)",
                }
            },
            "required": ["crop_name"],
        },
    },
    {
        "name": "diagnose_disease",
        "description": "Get diseases and pests that affect a specific crop, with symptoms, treatments, and prevention.",
        "input_schema": {
            "type": "object",
            "properties": {
                "crop_name": {
                    "type": "string",
                    "description": "The crop to diagnose (e.g., arachide, tomate, riz)",
                },
                "symptoms": {
                    "type": "string",
                    "description": "Optional: symptoms described by the farmer to narrow diagnosis",
                },
            },
            "required": ["crop_name"],
        },
    },
    {
        "name": "get_zone_info",
        "description": "Get information about an agro-ecological zone: climate, soils, crops, challenges. Supports global zones.",
        "input_schema": {
            "type": "object",
            "properties": {
                "zone_name": {
                    "type": "string",
                    "description": "Zone name: niayes, bassin_arachidier, casamance, vallee_fleuve, sylvopastorale, senegal_oriental",
                }
            },
            "required": ["zone_name"],
        },
    },
]

SYSTEM_PROMPT = """Tu es l'Agent Agronomique d'AgriAgent, un système d'aide aux agriculteurs du monde entier.

TON ROLE:
- Fournir des conseils culturaux précis pour les cultures du monde entier
- Diagnostiquer les maladies et ravageurs des cultures
- Recommander des variétés adaptées aux zones agro-écologiques locales
- Donner le calendrier cultural optimal selon la région

EXPERTISE GLOBALE:
- Afrique de l'Ouest: arachide, mil, riz, maïs, niébé, cacao, manioc
- Asie du Sud-Est: riz, huile de palme, caoutchouc, café
- Amériques: soja, maïs, café, canne à sucre, blé
- Europe: blé, raisin, olive, betterave, colza
- Afrique de l'Est: café, thé, maïs, teff
- Approche: agriculture durable, traitements biologiques privilégiés, rotation des cultures

REGLES:
- Réponds dans la langue demandée (Français, Anglais, Wolof, etc.)
- Sois pratique et concret - donner des actions que le fermier peut faire maintenant
- Privilégie les solutions accessibles et adaptées au contexte économique local
- Recommande toujours les variétés adaptées à la zone du fermier
- Si canal SMS: ultra-concis (max 300 caractères)
- Adapte ton vocabulaire à la région de l'utilisateur
"""


async def run_agro_agent(query: str, language: str = "fr", channel: str = "web") -> dict:
    """Run the agronomic agent to answer crop/disease questions."""
    user_message = query
    lang_label = {"en": "English", "wo": "Wolof"}.get(language, "Français")
    user_message += f"\n[Langue: {lang_label}]"
    user_message += f"\n[Canal: {channel}]"

    messages = [{"role": "user", "content": user_message}]

    response = await client.messages.create(
        model=settings.ANTHROPIC_MODEL_FAST,
        max_tokens=512,
        system=SYSTEM_PROMPT,
        tools=AGRO_TOOLS,
        messages=messages,
    )

    while response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = await _execute_agro_tool(block.name, block.input)
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
            tools=AGRO_TOOLS,
            messages=messages,
        )

    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    return {
        "agent": "agro",
        "response": text,
        "language": language,
    }


async def _execute_agro_tool(tool_name: str, tool_input: dict) -> dict:
    if tool_name == "get_crop_info":
        crop = get_crop(tool_input["crop_name"])
        if crop:
            return crop
        return {"error": f"Culture inconnue: {tool_input['crop_name']}. Cultures disponibles: arachide, mil, riz, mais, niebe, tomate, oignon"}

    elif tool_name == "diagnose_disease":
        diseases = get_diseases_for_crop(tool_input["crop_name"])
        if diseases:
            return {"crop": tool_input["crop_name"], "diseases": diseases, "symptoms_query": tool_input.get("symptoms")}
        return {"error": f"Pas de maladies repertoriees pour: {tool_input['crop_name']}"}

    elif tool_name == "get_zone_info":
        zone = get_zone(tool_input["zone_name"])
        if zone:
            return zone
        return {"error": f"Zone inconnue: {tool_input['zone_name']}"}

    return {"error": f"Unknown tool: {tool_name}"}
