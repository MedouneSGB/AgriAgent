import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


def load_crops() -> dict:
    with open(DATA_DIR / "crops.json", "r", encoding="utf-8") as f:
        return json.load(f)


def load_diseases() -> dict:
    with open(DATA_DIR / "diseases.json", "r", encoding="utf-8") as f:
        return json.load(f)


def load_markets() -> dict:
    with open(DATA_DIR / "markets.json", "r", encoding="utf-8") as f:
        return json.load(f)


def load_zones() -> dict:
    with open(DATA_DIR / "zones.json", "r", encoding="utf-8") as f:
        return json.load(f)


def get_crop(crop_name: str) -> dict | None:
    crops = load_crops()
    key = crop_name.lower().strip()
    if key in crops:
        return crops[key]
    for k, v in crops.items():
        if v["name_fr"].lower() == key or v["name_wo"].lower() == key:
            return v
    return None


def get_diseases_for_crop(crop_name: str) -> list[dict]:
    data = load_diseases()
    key = crop_name.lower().strip()
    return [d for d in data["diseases"] if key in d["crops"]]


def get_prices(crop_name: str) -> dict | None:
    data = load_markets()
    key = crop_name.lower().strip()
    return data["prices"].get(key)


def get_markets_for_city(city: str) -> list[dict]:
    data = load_markets()
    key = city.lower().strip()
    return [m for m in data["markets"] if m["city"] == key]


def get_zone(zone_name: str) -> dict | None:
    data = load_zones()
    key = zone_name.lower().strip()
    return data["zones"].get(key)
