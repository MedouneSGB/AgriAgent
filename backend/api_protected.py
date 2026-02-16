from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date

from auth import get_current_user
from services.supabase_service import get_supabase
from data_loader import load_crops, load_zones

router = APIRouter()


# ─── Pydantic models ──────────────────────────────────────────

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    zone: Optional[str] = None
    preferred_language: Optional[str] = None


class ParcelleCreate(BaseModel):
    name: str
    surface_ha: Optional[float] = None
    zone: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    soil_type: Optional[str] = None
    notes: Optional[str] = ""


class ParcelleUpdate(BaseModel):
    name: Optional[str] = None
    surface_ha: Optional[float] = None
    zone: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    soil_type: Optional[str] = None
    notes: Optional[str] = None


class CultureCreate(BaseModel):
    parcelle_id: str
    crop_key: str
    variety: Optional[str] = ""
    status: Optional[str] = "planned"
    planting_date: Optional[date] = None
    expected_harvest: Optional[date] = None
    season: Optional[str] = ""
    notes: Optional[str] = ""


class CultureUpdate(BaseModel):
    status: Optional[str] = None
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest: Optional[date] = None
    actual_harvest_date: Optional[date] = None
    notes: Optional[str] = None


class HistoryCreate(BaseModel):
    culture_id: str
    season: str
    yield_kg_ha: Optional[float] = None
    total_yield_kg: Optional[float] = None
    expenses_fcfa: Optional[int] = 0
    revenue_fcfa: Optional[int] = 0
    notes: Optional[str] = ""


class HistoryUpdate(BaseModel):
    yield_kg_ha: Optional[float] = None
    total_yield_kg: Optional[float] = None
    expenses_fcfa: Optional[int] = None
    revenue_fcfa: Optional[int] = None
    notes: Optional[str] = None


# ─── Profile ───────────────────────────────────────────────────

@router.get("/me")
async def get_profile(user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("profiles").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data


@router.put("/me")
async def update_profile(data: ProfileUpdate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = sb.table("profiles").update(update_data).eq("id", user_id).execute()
    return result.data[0] if result.data else {}


# ─── Parcelles ─────────────────────────────────────────────────

@router.get("/parcelles")
async def list_parcelles(user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("parcelles").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data


@router.post("/parcelles")
async def create_parcelle(data: ParcelleCreate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    row = {"user_id": user_id, **data.model_dump(exclude_none=True)}
    result = sb.table("parcelles").insert(row).execute()
    return result.data[0]


@router.get("/parcelles/{parcelle_id}")
async def get_parcelle(parcelle_id: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    parcelle = sb.table("parcelles").select("*").eq("id", parcelle_id).eq("user_id", user_id).single().execute()
    if not parcelle.data:
        raise HTTPException(status_code=404, detail="Parcelle not found")
    cultures = sb.table("cultures").select("*").eq("parcelle_id", parcelle_id).eq("user_id", user_id).order("created_at", desc=True).execute()
    return {**parcelle.data, "cultures": cultures.data}


@router.put("/parcelles/{parcelle_id}")
async def update_parcelle(parcelle_id: str, data: ParcelleUpdate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = sb.table("parcelles").update(update_data).eq("id", parcelle_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Parcelle not found")
    return result.data[0]


@router.delete("/parcelles/{parcelle_id}")
async def delete_parcelle(parcelle_id: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    sb.table("parcelles").delete().eq("id", parcelle_id).eq("user_id", user_id).execute()
    return {"ok": True}


# ─── Cultures ──────────────────────────────────────────────────

@router.get("/cultures")
async def list_cultures(
    parcelle_id: Optional[str] = None,
    status: Optional[str] = None,
    user_id: str = Depends(get_current_user),
):
    sb = get_supabase()
    query = sb.table("cultures").select("*").eq("user_id", user_id)
    if parcelle_id:
        query = query.eq("parcelle_id", parcelle_id)
    if status:
        query = query.eq("status", status)
    result = query.order("created_at", desc=True).execute()
    return result.data


@router.post("/cultures")
async def create_culture(data: CultureCreate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    row = {"user_id": user_id, **data.model_dump(exclude_none=True)}
    # Convert date objects to ISO strings for Supabase
    for key in ("planting_date", "expected_harvest"):
        if key in row and isinstance(row[key], date):
            row[key] = row[key].isoformat()
    result = sb.table("cultures").insert(row).execute()
    return result.data[0]


@router.get("/cultures/{culture_id}")
async def get_culture(culture_id: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    culture = sb.table("cultures").select("*").eq("id", culture_id).eq("user_id", user_id).single().execute()
    if not culture.data:
        raise HTTPException(status_code=404, detail="Culture not found")
    history = sb.table("season_history").select("*").eq("culture_id", culture_id).eq("user_id", user_id).order("created_at", desc=True).execute()
    return {**culture.data, "history": history.data}


@router.put("/cultures/{culture_id}")
async def update_culture(culture_id: str, data: CultureUpdate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    for key in ("planting_date", "expected_harvest", "actual_harvest_date"):
        if key in update_data and isinstance(update_data[key], date):
            update_data[key] = update_data[key].isoformat()
    result = sb.table("cultures").update(update_data).eq("id", culture_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Culture not found")
    return result.data[0]


@router.delete("/cultures/{culture_id}")
async def delete_culture(culture_id: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    sb.table("cultures").delete().eq("id", culture_id).eq("user_id", user_id).execute()
    return {"ok": True}


# ─── Season History ────────────────────────────────────────────

@router.get("/history")
async def list_history(
    culture_id: Optional[str] = None,
    user_id: str = Depends(get_current_user),
):
    sb = get_supabase()
    query = sb.table("season_history").select("*").eq("user_id", user_id)
    if culture_id:
        query = query.eq("culture_id", culture_id)
    result = query.order("created_at", desc=True).execute()
    return result.data


@router.post("/history")
async def create_history(data: HistoryCreate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    row = {"user_id": user_id, **data.model_dump(exclude_none=True)}
    result = sb.table("season_history").insert(row).execute()
    return result.data[0]


@router.put("/history/{history_id}")
async def update_history(history_id: str, data: HistoryUpdate, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = sb.table("season_history").update(update_data).eq("id", history_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="History record not found")
    return result.data[0]


@router.delete("/history/{history_id}")
async def delete_history(history_id: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    sb.table("season_history").delete().eq("id", history_id).eq("user_id", user_id).execute()
    return {"ok": True}


# ─── Alerts ────────────────────────────────────────────────────

@router.get("/alerts")
async def list_alerts(user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = (
        sb.table("alerts")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return result.data


@router.put("/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str, user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("alerts").update({"is_read": True}).eq("id", alert_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Alert not found")
    return result.data[0]


@router.post("/alerts/generate")
async def generate_alerts(user_id: str = Depends(get_current_user)):
    from agents.alerts_agent import generate_user_alerts
    alerts = await generate_user_alerts(user_id)
    return alerts


# ─── Calendar ──────────────────────────────────────────────────

MONTH_RECOMMENDATIONS_FR = {
    1: "Recolte tomate et oignon. Stockage cereales. Preparation pepinieres.",
    2: "Recolte tomate/oignon continue. Debut preparation des sols.",
    3: "Preparation sols. Riz irrigue possible en Vallee du Fleuve.",
    4: "Preparation sols intensive. Achat semences et intrants.",
    5: "Debut semis arachide/mil/mais en zones precoces. Preparation pepinieres.",
    6: "Semis toutes cultures pluviales: arachide, mil, riz, mais, niebe.",
    7: "Croissance active. Surveillance ravageurs (chenille legionnaire). Desherbage.",
    8: "Croissance. Recolte precoce mil. Traitement phytosanitaire si necessaire.",
    9: "Recolte mil. Arachide/riz/mais en maturation. Surveillance marches.",
    10: "Grandes recoltes: arachide, riz, niebe, mais. Vente ou stockage.",
    11: "Fin recolte arachide. Debut saison seche. Preparation maraichage.",
    12: "Stockage. Plantation tomate/oignon. Bilan saison et planification.",
}

MONTH_RECOMMENDATIONS_WO = {
    1: "Natt tamaate ak soble. Teg cereale ci njeexe. Tegg pepiniyeer.",
    2: "Natt tamaate/soble. Jotali suuf bi.",
    3: "Jotali suuf. Riz irrigue ci Ganaar.",
    4: "Jotali suuf bu meg. Jend mbuuru ak engere.",
    5: "Door bey gerte/dugub/mbaxal. Tegg pepiniyeer.",
    6: "Bey yeppa: gerte, dugub, malo, mbaxal, niebe.",
    7: "Yokk. Saytu njuumte yi. Sotti njaxx.",
    8: "Yokk. Natt dugub. Faral aartu ndimbal.",
    9: "Natt dugub. Gerte/malo ci wettu. Saytu njeg.",
    10: "Natt bu mag: gerte, malo, niebe, mbaxal. Jaay walla teg.",
    11: "Jeex natt gerte. Door noor. Tegg ndar.",
    12: "Teg. Bey tamaate/soble. Xool nawet bi te plan.",
}


@router.get("/calendar/{zone}")
async def get_calendar(zone: str):
    """Return monthly agricultural calendar data for a zone."""
    crops = load_crops()
    zones_data = load_zones()

    zone_info = zones_data.get("zones", {}).get(zone)
    zone_crops = zone_info["main_crops"] if zone_info else list(crops.keys())

    months = []
    for month_num in range(1, 13):
        month_info = {
            "month": month_num,
            "recommendation_fr": MONTH_RECOMMENDATIONS_FR.get(month_num, ""),
            "recommendation_wo": MONTH_RECOMMENDATIONS_WO.get(month_num, ""),
            "crops": [],
        }
        for crop_key, crop in crops.items():
            # Check if crop belongs to zone
            crop_in_zone = (
                crop_key in zone_crops
                or crop.get("name_fr", "").lower() in zone_crops
            )
            if not crop_in_zone:
                continue

            activities = []
            sowing = crop.get("sowing_month", [])
            harvest = crop.get("harvest_month", [])

            if month_num in sowing:
                activities.append("sowing")
            if month_num in harvest:
                activities.append("harvest")

            # Growing = between sowing and harvest, not sowing or harvest month
            if sowing and harvest:
                sow_end = max(sowing)
                harvest_start = min(harvest)
                if sow_end < month_num < harvest_start:
                    activities.append("growing")

            if activities:
                month_info["crops"].append({
                    "key": crop_key,
                    "name_fr": crop.get("name_fr", crop_key),
                    "name_wo": crop.get("name_wo", ""),
                    "activities": activities,
                })
        months.append(month_info)

    return {
        "zone": zone,
        "zone_info": zone_info,
        "calendar": months,
    }


# ─── Rotation advice ──────────────────────────────────────────

ROTATION_RULES = {
    "arachide": ["mil", "niebe", "mais"],
    "mil": ["arachide", "niebe"],
    "riz": ["riz", "mais", "tomate"],
    "mais": ["arachide", "niebe", "mil"],
    "niebe": ["mil", "mais", "riz", "arachide"],
    "tomate": ["oignon", "mil", "mais"],
    "oignon": ["tomate", "mil", "niebe"],
}


@router.get("/rotation/{parcelle_id}")
async def get_rotation_advice(parcelle_id: str, user_id: str = Depends(get_current_user)):
    """Recommend next crop based on parcelle history."""
    sb = get_supabase()

    # Get parcelle
    parcelle = sb.table("parcelles").select("*").eq("id", parcelle_id).eq("user_id", user_id).single().execute()
    if not parcelle.data:
        raise HTTPException(status_code=404, detail="Parcelle not found")

    # Get cultures for this parcelle ordered by most recent
    cultures = (
        sb.table("cultures")
        .select("crop_key, status, planting_date")
        .eq("parcelle_id", parcelle_id)
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(3)
        .execute()
    )

    last_crops = [c["crop_key"] for c in cultures.data] if cultures.data else []
    zone = parcelle.data.get("zone", "bassin_arachidier")

    # Get zone crops
    zones_data = load_zones()
    zone_info = zones_data.get("zones", {}).get(zone, {})
    zone_crops = zone_info.get("main_crops", list(ROTATION_RULES.keys()))

    recommendations = []
    if last_crops:
        last_crop = last_crops[0]
        suggested = ROTATION_RULES.get(last_crop, list(ROTATION_RULES.keys()))
        # Filter by zone suitability
        recommendations = [c for c in suggested if c in zone_crops]
        if not recommendations:
            recommendations = suggested[:3]
    else:
        recommendations = zone_crops[:4]

    crops_data = load_crops()
    detailed = []
    for crop_key in recommendations:
        crop = crops_data.get(crop_key, {})
        detailed.append({
            "crop_key": crop_key,
            "name_fr": crop.get("name_fr", crop_key),
            "name_wo": crop.get("name_wo", ""),
            "reason_fr": f"Bonne rotation apres {last_crops[0] if last_crops else 'jachère'}",
            "sowing_month": crop.get("sowing_month", []),
            "yield_kg_ha": crop.get("yield_kg_ha", []),
        })

    return {
        "parcelle": parcelle.data.get("name"),
        "last_crops": last_crops,
        "recommendations": detailed,
    }
