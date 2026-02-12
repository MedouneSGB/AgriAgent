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

    # Senegal cities coordinates
    CITIES: dict = {
        "dakar": {"lat": 14.6928, "lon": -17.4467, "region": "Dakar"},
        "thies": {"lat": 14.7886, "lon": -16.9260, "region": "Thies"},
        "kaolack": {"lat": 14.1520, "lon": -16.0726, "region": "Kaolack"},
        "saint-louis": {"lat": 16.0326, "lon": -16.4818, "region": "Saint-Louis"},
        "ziguinchor": {"lat": 12.5681, "lon": -16.2719, "region": "Ziguinchor"},
        "touba": {"lat": 14.8500, "lon": -15.8833, "region": "Diourbel"},
        "tambacounda": {"lat": 13.7709, "lon": -13.6673, "region": "Tambacounda"},
        "kolda": {"lat": 12.8835, "lon": -14.9500, "region": "Kolda"},
        "fatick": {"lat": 14.3390, "lon": -16.4041, "region": "Fatick"},
        "louga": {"lat": 15.6144, "lon": -16.2281, "region": "Louga"},
        "matam": {"lat": 15.6559, "lon": -13.2554, "region": "Matam"},
        "kedougou": {"lat": 12.5605, "lon": -12.1747, "region": "Kedougou"},
        "sedhiou": {"lat": 12.7081, "lon": -15.5569, "region": "Sedhiou"},
        "kaffrine": {"lat": 14.1058, "lon": -15.5505, "region": "Kaffrine"},
        "diourbel": {"lat": 14.6553, "lon": -16.2314, "region": "Diourbel"},
        "richard-toll": {"lat": 16.4625, "lon": -15.7000, "region": "Saint-Louis"},
    }

    # Agro-ecological zones
    ZONES: dict = {
        "niayes": {"name": "Niayes", "lat": 14.8, "lon": -17.2, "crops": ["tomate", "oignon", "chou", "carotte"]},
        "bassin_arachidier": {"name": "Bassin Arachidier", "lat": 14.3, "lon": -15.8, "crops": ["arachide", "mil", "niebe"]},
        "casamance": {"name": "Casamance", "lat": 12.8, "lon": -15.5, "crops": ["riz", "mais", "mangue"]},
        "vallee_fleuve": {"name": "Vallée du Fleuve", "lat": 16.0, "lon": -14.5, "crops": ["riz", "tomate", "oignon"]},
        "sylvopastorale": {"name": "Zone Sylvo-pastorale", "lat": 15.5, "lon": -14.0, "crops": ["mil", "niebe"]},
        "senegal_oriental": {"name": "Sénégal Oriental", "lat": 13.0, "lon": -12.5, "crops": ["coton", "mais", "arachide"]},
    }


settings = Settings()
