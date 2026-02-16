import os
from dotenv import load_dotenv

load_dotenv(override=True)

# Force clear VS Code proxy overrides
os.environ.pop("ANTHROPIC_BASE_URL", None)


class Settings:
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL: str = "claude-sonnet-4-20250514"          # orchestrator
    ANTHROPIC_MODEL_OPUS: str = "claude-opus-4-5-20251101"     # for demo/showcase
    ANTHROPIC_MODEL_FAST: str = "claude-3-haiku-20240307"       # sub-agents (fastest)

    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")

    APP_ENV: str = os.getenv("APP_ENV", "development")
    APP_PORT: int = int(os.getenv("APP_PORT", "8095"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # Global cities coordinates (international coverage)
    CITIES: dict = {
        # === Senegal ===
        "dakar": {"lat": 14.6928, "lon": -17.4467, "region": "Dakar", "country": "SN"},
        "thies": {"lat": 14.7886, "lon": -16.9260, "region": "Thies", "country": "SN"},
        "kaolack": {"lat": 14.1520, "lon": -16.0726, "region": "Kaolack", "country": "SN"},
        "saint-louis": {"lat": 16.0326, "lon": -16.4818, "region": "Saint-Louis", "country": "SN"},
        "ziguinchor": {"lat": 12.5681, "lon": -16.2719, "region": "Ziguinchor", "country": "SN"},
        "touba": {"lat": 14.8500, "lon": -15.8833, "region": "Diourbel", "country": "SN"},
        "tambacounda": {"lat": 13.7709, "lon": -13.6673, "region": "Tambacounda", "country": "SN"},
        "kolda": {"lat": 12.8835, "lon": -14.9500, "region": "Kolda", "country": "SN"},
        "fatick": {"lat": 14.3390, "lon": -16.4041, "region": "Fatick", "country": "SN"},
        "louga": {"lat": 15.6144, "lon": -16.2281, "region": "Louga", "country": "SN"},
        "matam": {"lat": 15.6559, "lon": -13.2554, "region": "Matam", "country": "SN"},
        "kedougou": {"lat": 12.5605, "lon": -12.1747, "region": "Kedougou", "country": "SN"},
        "sedhiou": {"lat": 12.7081, "lon": -15.5569, "region": "Sedhiou", "country": "SN"},
        "kaffrine": {"lat": 14.1058, "lon": -15.5505, "region": "Kaffrine", "country": "SN"},
        "diourbel": {"lat": 14.6553, "lon": -16.2314, "region": "Diourbel", "country": "SN"},
        "richard-toll": {"lat": 16.4625, "lon": -15.7000, "region": "Saint-Louis", "country": "SN"},
        # === Africa ===
        "abuja": {"lat": 9.0579, "lon": 7.4951, "region": "FCT", "country": "NG"},
        "lagos": {"lat": 6.5244, "lon": 3.3792, "region": "Lagos", "country": "NG"},
        "kano": {"lat": 12.0022, "lon": 8.5920, "region": "Kano", "country": "NG"},
        "nairobi": {"lat": -1.2921, "lon": 36.8219, "region": "Nairobi", "country": "KE"},
        "mombasa": {"lat": -4.0435, "lon": 39.6682, "region": "Coast", "country": "KE"},
        "addis-ababa": {"lat": 9.0192, "lon": 38.7525, "region": "Addis Ababa", "country": "ET"},
        "casablanca": {"lat": 33.5731, "lon": -7.5898, "region": "Casablanca", "country": "MA"},
        "marrakech": {"lat": 31.6295, "lon": -7.9811, "region": "Marrakech", "country": "MA"},
        "abidjan": {"lat": 5.3600, "lon": -4.0083, "region": "Lagunes", "country": "CI"},
        "cairo": {"lat": 30.0444, "lon": 31.2357, "region": "Cairo", "country": "EG"},
        # === Asia ===
        "new-delhi": {"lat": 28.6139, "lon": 77.2090, "region": "Delhi", "country": "IN"},
        "mumbai": {"lat": 19.0760, "lon": 72.8777, "region": "Maharashtra", "country": "IN"},
        "hyderabad": {"lat": 17.3850, "lon": 78.4867, "region": "Telangana", "country": "IN"},
        "beijing": {"lat": 39.9042, "lon": 116.4074, "region": "Beijing", "country": "CN"},
        "shanghai": {"lat": 31.2304, "lon": 121.4737, "region": "Shanghai", "country": "CN"},
        "jakarta": {"lat": -6.2088, "lon": 106.8456, "region": "Java", "country": "ID"},
        "bangkok": {"lat": 13.7563, "lon": 100.5018, "region": "Bangkok", "country": "TH"},
        # === Americas ===
        "sao-paulo": {"lat": -23.5505, "lon": -46.6333, "region": "São Paulo", "country": "BR"},
        "brasilia": {"lat": -15.7975, "lon": -47.8919, "region": "Federal District", "country": "BR"},
        "chicago": {"lat": 41.8781, "lon": -87.6298, "region": "Illinois", "country": "US"},
        "des-moines": {"lat": 41.5868, "lon": -93.6250, "region": "Iowa", "country": "US"},
        "fresno": {"lat": 36.7378, "lon": -119.7871, "region": "California", "country": "US"},
        "buenos-aires": {"lat": -34.6037, "lon": -58.3816, "region": "Buenos Aires", "country": "AR"},
        "mexico-city": {"lat": 19.4326, "lon": -99.1332, "region": "CDMX", "country": "MX"},
        # === Europe ===
        "paris": {"lat": 48.8566, "lon": 2.3522, "region": "Île-de-France", "country": "FR"},
        "toulouse": {"lat": 43.6047, "lon": 1.4442, "region": "Occitanie", "country": "FR"},
        "madrid": {"lat": 40.4168, "lon": -3.7038, "region": "Madrid", "country": "ES"},
        "kyiv": {"lat": 50.4501, "lon": 30.5234, "region": "Kyiv", "country": "UA"},
        # === Oceania ===
        "sydney": {"lat": -33.8688, "lon": 151.2093, "region": "NSW", "country": "AU"},
        "perth": {"lat": -31.9505, "lon": 115.8605, "region": "WA", "country": "AU"},
    }

    # Agro-ecological zones (global + Senegal legacy)
    ZONES: dict = {
        # Senegal zones (original)
        "niayes": {"name": "Niayes", "lat": 14.8, "lon": -17.2, "crops": ["tomate", "oignon", "chou", "carotte"], "country": "SN"},
        "bassin_arachidier": {"name": "Bassin Arachidier", "lat": 14.3, "lon": -15.8, "crops": ["arachide", "mil", "niebe"], "country": "SN"},
        "casamance": {"name": "Casamance", "lat": 12.8, "lon": -15.5, "crops": ["riz", "mais", "mangue"], "country": "SN"},
        "vallee_fleuve": {"name": "Vallée du Fleuve", "lat": 16.0, "lon": -14.5, "crops": ["riz", "tomate", "oignon"], "country": "SN"},
        "sylvopastorale": {"name": "Zone Sylvo-pastorale", "lat": 15.5, "lon": -14.0, "crops": ["mil", "niebe"], "country": "SN"},
        "senegal_oriental": {"name": "Sénégal Oriental", "lat": 13.0, "lon": -12.5, "crops": ["coton", "mais", "arachide"], "country": "SN"},
        # Global zones
        "west_africa_sahel": {"name": "West Africa - Sahel", "lat": 14.0, "lon": -2.0, "crops": ["mil", "sorgho", "niebe", "arachide"]},
        "west_africa_humid": {"name": "West Africa - Humid", "lat": 7.0, "lon": -3.0, "crops": ["riz", "mais", "manioc", "cacao"]},
        "east_africa_highland": {"name": "East Africa - Highland", "lat": 0.0, "lon": 37.0, "crops": ["cafe", "the", "mais", "banane"]},
        "north_africa": {"name": "North Africa", "lat": 32.0, "lon": 3.0, "crops": ["ble", "orge", "olive", "agrumes"]},
        "south_asia_monsoon": {"name": "South Asia - Monsoon", "lat": 22.0, "lon": 80.0, "crops": ["riz", "ble", "coton", "the"]},
        "southeast_asia": {"name": "Southeast Asia", "lat": 5.0, "lon": 110.0, "crops": ["riz", "huile_palme", "caoutchouc"]},
        "north_america_midwest": {"name": "North America - Midwest", "lat": 42.0, "lon": -90.0, "crops": ["mais", "soja", "ble"]},
        "south_america_tropics": {"name": "South America - Tropics", "lat": -10.0, "lon": -55.0, "crops": ["soja", "canne_sucre", "cafe"]},
        "western_europe": {"name": "Western Europe", "lat": 47.0, "lon": 3.0, "crops": ["ble", "raisin", "betterave", "colza"]},
        "mediterranean": {"name": "Mediterranean", "lat": 38.0, "lon": 5.0, "crops": ["olive", "raisin", "agrumes", "tomate"]},
    }


settings = Settings()
