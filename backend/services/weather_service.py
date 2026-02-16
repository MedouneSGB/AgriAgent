import httpx
from config import settings


async def get_weather_forecast(city: str) -> dict:
    """Fetch 7-day weather forecast from Open-Meteo for any city worldwide."""
    key = city.lower().strip()
    city_data = settings.CITIES.get(key)
    if not city_data:
        raise ValueError(f"Ville inconnue: {city}. Villes disponibles: {', '.join(settings.CITIES.keys())}")

    params = {
        "latitude": city_data["lat"],
        "longitude": city_data["lon"],
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode",
        "hourly": "temperature_2m,relative_humidity_2m,precipitation",
        "current_weather": "true",
        "timezone": "Africa/Dakar",
        "forecast_days": 7,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.get(settings.OPEN_METEO_BASE_URL, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()

    current = data.get("current_weather", {})
    daily = data.get("daily", {})

    forecast_days = []
    if daily.get("time"):
        for i in range(len(daily["time"])):
            forecast_days.append({
                "date": daily["time"][i],
                "temp_max": daily["temperature_2m_max"][i],
                "temp_min": daily["temperature_2m_min"][i],
                "precipitation_mm": daily["precipitation_sum"][i],
                "wind_max_kmh": daily["windspeed_10m_max"][i],
                "weather_code": daily["weathercode"][i],
            })

    total_precip = sum(d["precipitation_mm"] for d in forecast_days if d["precipitation_mm"])
    max_temp = max((d["temp_max"] for d in forecast_days), default=0)
    rain_days = sum(1 for d in forecast_days if d["precipitation_mm"] and d["precipitation_mm"] > 1)

    return {
        "city": city,
        "region": city_data["region"],
        "lat": city_data["lat"],
        "lon": city_data["lon"],
        "current": {
            "temperature": current.get("temperature"),
            "windspeed": current.get("windspeed"),
            "weather_code": current.get("weathercode"),
        },
        "forecast": forecast_days,
        "summary": {
            "total_precipitation_mm": round(total_precip, 1),
            "max_temperature": max_temp,
            "rain_days": rain_days,
        },
    }


def format_weather_code(code: int) -> dict:
    """Convert WMO weather code to description in FR and Wolof."""
    codes = {
        0: {"fr": "Ciel dégagé", "wo": "Asamaan bi leer na"},
        1: {"fr": "Peu nuageux", "wo": "Niir yu ndaw yi"},
        2: {"fr": "Partiellement nuageux", "wo": "Niir yi am na tuuti"},
        3: {"fr": "Couvert", "wo": "Niir yu bari"},
        45: {"fr": "Brouillard", "wo": "Ngelaw bu set"},
        51: {"fr": "Bruine légère", "wo": "Taw bu tuuti"},
        53: {"fr": "Bruine modérée", "wo": "Taw bu wanee"},
        55: {"fr": "Bruine forte", "wo": "Taw bu bari"},
        61: {"fr": "Pluie légère", "wo": "Taw bu tuuti"},
        63: {"fr": "Pluie modérée", "wo": "Taw bu baax"},
        65: {"fr": "Pluie forte", "wo": "Taw bu bari lool"},
        80: {"fr": "Averses légères", "wo": "Taw bu gaaw tuuti"},
        81: {"fr": "Averses modérées", "wo": "Taw bu gaaw"},
        82: {"fr": "Averses violentes", "wo": "Taw bu doole"},
        95: {"fr": "Orage", "wo": "Taw ak lidiir"},
    }
    return codes.get(code, {"fr": f"Code météo {code}", "wo": f"Code météo {code}"})
