import json
import anthropic
from config import settings
from services.supabase_service import get_supabase
from services.weather_service import get_weather_forecast
from data_loader import load_crops, get_prices

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

ALERTS_SYSTEM_PROMPT = """You are an agricultural alert system for farmers worldwide.
Given the farmer's active crops, weather forecast, and current date, generate 1-3 actionable alerts.

Each alert must be a JSON object with:
- type: one of "weather", "calendar", "market", "pest"
- severity: one of "info", "warning", "critical"
- title_fr: short title in French (max 60 chars)
- title_wo: same title in Wolof
- body_fr: detailed advice in French (max 200 chars)
- body_wo: same advice in Wolof

Respond with a JSON array only. No extra text."""


async def generate_user_alerts(user_id: str) -> list[dict]:
    """Generate personalized alerts for a farmer based on their crops and weather."""
    sb = get_supabase()

    # Get user profile
    profile = sb.table("profiles").select("*").eq("id", user_id).single().execute()
    if not profile.data:
        return []

    city = profile.data.get("city", "kaolack")
    zone = profile.data.get("zone", "bassin_arachidier")

    # Get active cultures
    active_cultures = (
        sb.table("cultures")
        .select("crop_key, status, planting_date, expected_harvest, parcelle_id")
        .eq("user_id", user_id)
        .in_("status", ["planned", "sown", "growing", "harvesting"])
        .execute()
    )

    if not active_cultures.data:
        return []

    # Get weather forecast
    try:
        weather = await get_weather_forecast(city)
    except Exception:
        weather = None

    # Build context for Claude
    crops_data = load_crops()
    crop_details = []
    for culture in active_cultures.data:
        crop_key = culture["crop_key"]
        crop_info = crops_data.get(crop_key, {})
        price_info = get_prices(crop_key)
        crop_details.append(
            f"- {crop_info.get('name_fr', crop_key)} ({culture['status']}), "
            f"plante le {culture.get('planting_date', 'N/A')}, "
            f"recolte prevue {culture.get('expected_harvest', 'N/A')}"
            + (f", prix moyen marche: {list(price_info['prices_by_city'].values())[0].get('avg', 'N/A')} FCFA/kg" if price_info and price_info.get('prices_by_city') else "")
        )

    weather_summary = ""
    if weather and weather.get("forecast"):
        forecast_days = weather["forecast"][:3]
        weather_summary = "Meteo 3 jours:\n" + "\n".join(
            f"- {d['date']}: {d.get('temp_min', '?')}-{d.get('temp_max', '?')}C, pluie {d.get('precipitation_mm', 0)}mm"
            for d in forecast_days
        )

    from datetime import date
    context = f"""Date: {date.today().isoformat()}
Ville: {city}, Zone: {zone}

Cultures actives du fermier:
{chr(10).join(crop_details)}

{weather_summary}"""

    try:
        response = await client.messages.create(
            model=settings.ANTHROPIC_MODEL_FAST,
            max_tokens=1024,
            system=ALERTS_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": context}],
        )

        text = ""
        for block in response.content:
            if hasattr(block, "text"):
                text += block.text

        alerts = json.loads(text)
        if not isinstance(alerts, list):
            alerts = [alerts]
    except Exception:
        # Fallback: generate a simple calendar-based alert
        alerts = [{
            "type": "calendar",
            "severity": "info",
            "title_fr": "Consultez votre calendrier agricole",
            "title_wo": "Saytu sa arminaatu tool",
            "body_fr": "Verifiez les activites recommandees pour ce mois dans votre calendrier.",
            "body_wo": "Saytu li nu la digal ngir weer wii ci sa arminaatu tool.",
        }]

    # Insert alerts into database
    inserted = []
    for alert in alerts:
        row = {
            "user_id": user_id,
            "type": alert.get("type", "info"),
            "title_fr": alert.get("title_fr", ""),
            "title_wo": alert.get("title_wo", ""),
            "body_fr": alert.get("body_fr", ""),
            "body_wo": alert.get("body_wo", ""),
            "severity": alert.get("severity", "info"),
            "is_read": False,
        }
        result = sb.table("alerts").insert(row).execute()
        if result.data:
            inserted.append(result.data[0])

    return inserted
