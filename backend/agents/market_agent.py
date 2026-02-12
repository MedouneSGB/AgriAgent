import json
import anthropic
from config import settings
from data_loader import get_prices, get_markets_for_city, load_markets

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

MARKET_TOOLS = [
    {
        "name": "get_crop_prices",
        "description": "Get current market prices for a crop across Senegalese cities. Returns min, max, average price in FCFA/kg and trend.",
        "input_schema": {
            "type": "object",
            "properties": {
                "crop_name": {
                    "type": "string",
                    "description": "Crop name (e.g., arachide, mil, riz, mais, niebe, tomate, oignon)",
                }
            },
            "required": ["crop_name"],
        },
    },
    {
        "name": "get_city_markets",
        "description": "Get list of markets in a specific city with their products.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name (e.g., dakar, kaolack, touba, saint-louis)",
                }
            },
            "required": ["city"],
        },
    },
    {
        "name": "compare_prices",
        "description": "Compare prices of a crop across all available cities to find the best place to sell.",
        "input_schema": {
            "type": "object",
            "properties": {
                "crop_name": {
                    "type": "string",
                    "description": "Crop name to compare prices for",
                }
            },
            "required": ["crop_name"],
        },
    },
]

SYSTEM_PROMPT = """Tu es l'Agent Marché d'AgriAgent SN, un système d'aide aux agriculteurs sénégalais.

TON ROLE:
- Fournir les prix actuels des produits agricoles au Sénégal
- Conseiller sur le meilleur moment et lieu pour vendre
- Analyser les tendances de prix
- Aider les fermiers à maximiser leurs revenus

EXPERTISE:
- Prix en FCFA (franc CFA) par kg
- Marchés principaux: Sandaga (Dakar), Thiaroye (Dakar), Kaolack, Touba Ocass, Saint-Louis, Ziguinchor
- Tendances saisonnières et logique prix/offre/demande
- Transport et logistique entre zones de production et marchés

REGLES:
- Réponds dans la langue demandée (Français ou Wolof)
- Toujours donner des prix concrets en FCFA
- Recommander le meilleur marché pour vendre en tenant compte de la distance
- Mentionner les périodes optimales de vente
- Si canal SMS: ultra-concis (max 300 caractères)

CONTEXTE PRIX:
- Les prix varient fortement selon la saison (récolte = prix bas, soudure = prix hauts)
- Dakar a généralement les prix les plus élevés mais les coûts de transport sont plus importants
- Le stockage permet souvent de doubler le prix de vente (si les conditions sont bonnes)
"""


async def run_market_agent(query: str, language: str = "fr", channel: str = "web") -> dict:
    """Run the market agent to answer price/market questions."""
    user_message = query
    lang_label = {"en": "English", "wo": "Wolof"}.get(language, "Français")
    user_message += f"\n[Langue: {lang_label}]"
    user_message += f"\n[Canal: {channel}]"

    messages = [{"role": "user", "content": user_message}]

    response = await client.messages.create(
        model=settings.ANTHROPIC_MODEL_FAST,
        max_tokens=512,
        system=SYSTEM_PROMPT,
        tools=MARKET_TOOLS,
        messages=messages,
    )

    while response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = await _execute_market_tool(block.name, block.input)
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
            tools=MARKET_TOOLS,
            messages=messages,
        )

    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    return {
        "agent": "market",
        "response": text,
        "language": language,
    }


async def _execute_market_tool(tool_name: str, tool_input: dict) -> dict:
    if tool_name == "get_crop_prices":
        prices = get_prices(tool_input["crop_name"])
        if prices:
            return prices
        return {"error": f"Pas de prix pour: {tool_input['crop_name']}. Produits disponibles: arachide, mil, riz, mais, niebe, tomate, oignon"}

    elif tool_name == "get_city_markets":
        markets = get_markets_for_city(tool_input["city"])
        if markets:
            return {"city": tool_input["city"], "markets": markets}
        return {"error": f"Pas de marchés pour: {tool_input['city']}"}

    elif tool_name == "compare_prices":
        prices = get_prices(tool_input["crop_name"])
        if not prices:
            return {"error": f"Pas de prix pour: {tool_input['crop_name']}"}
        # Sort by average price descending
        comparison = []
        for city, data in prices["prices_by_city"].items():
            comparison.append({"city": city, **data})
        comparison.sort(key=lambda x: x["avg"], reverse=True)
        return {
            "crop": tool_input["crop_name"],
            "trend": prices["trend"],
            "comparison": comparison,
            "recommendation_fr": prices.get("season_note_fr", ""),
            "recommendation_wo": prices.get("season_note_wo", ""),
        }

    return {"error": f"Unknown tool: {tool_name}"}
