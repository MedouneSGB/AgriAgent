# Architecture AgriAgent

## Vue d'ensemble

```
                    ┌──────────────────┐
                    │   UTILISATEURS   │
                    ├──────────────────┤
                    │ Web (FR/EN/WO)   │
                    │ SMS (Twilio)     │
                    │ Voice Input      │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │       NEXT.JS 16 FRONTEND   │
              │  React 19 · Tailwind · i18n │
              └──────────────┬──────────────┘
                             │ REST + SSE
              ┌──────────────┴──────────────┐
              │      FASTAPI BACKEND        │
              │  Auth (Supabase JWT)        │
              │  Public + Protected Routes  │
              └──────────────┬──────────────┘
                             │
              ┌──────────────┴──────────────┐
              │      ORCHESTRATEUR          │
              │   Claude Sonnet 4           │
              │   Routage par mots-clés     │
              │   Détection langue auto     │
              │   Synthèse multi-agent      │
              └──────────────┬──────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────┴────────┐ ┌───────┴────────┐ ┌────────┴────────┐
│  AGENT MÉTÉO    │ │  AGENT AGRO    │ │  AGENT MARCHÉ   │
│  Claude 3 Haiku │ │  Claude 3 Haiku│ │  Claude 3 Haiku │
│  + Open-Meteo   │ │  + crops.json  │ │  + markets.json │
│  tool-use       │ │  + diseases    │ │  + prix/ville   │
│                 │ │  + zones.json  │ │                 │
└─────────────────┘ └────────────────┘ └─────────────────┘
         │                   │                   │
    Open-Meteo API     Knowledge Base      Market Data
    (50+ villes)      (16+ zones, 50+     (prix par
                       cultures)           région)
```

## Agents

### 1. Orchestrateur (`orchestrator.py`)
- **Modèle :** Claude Sonnet 4
- **Rôle :** Point d'entrée unique, routage intelligent
- **Capacités :**
  - Détection de langue (FR/EN/WO) automatique
  - Routage par mots-clés vers les sub-agents appropriés
  - Exécution parallèle des agents quand nécessaire
  - Synthèse des réponses multiples
  - Adaptation au canal (SMS court / Web détaillé)

### 2. Agent Météo (`weather_agent.py`)
- **Modèle :** Claude 3 Haiku + Tool Use
- **Outil :** `get_weather` → Open-Meteo API
- **Capacités :** Prévisions 7 jours, codes WMO traduits, conseils agricoles contextuels

### 3. Agent Agronomique (`agro_agent.py`)
- **Modèle :** Claude 3 Haiku + Tool Use
- **Outils :** `search_crops`, `search_diseases`, `get_zone_info`
- **Capacités :** Diagnostic cultures/maladies, calendrier cultural, recommandations par zone

### 4. Agent Marché (`market_agent.py`)
- **Modèle :** Claude 3 Haiku + Tool Use
- **Outils :** `search_market_prices`, `compare_prices`
- **Capacités :** Prix par culture/ville, comparaison inter-marchés, conseils de vente

### 5. Agent Alertes (`alerts_agent.py`)
- **Modèle :** Claude 3 Haiku
- **Capacités :** Génération d'alertes personnalisées (météo, calendrier, marché, ravageurs)

---

## Frontend — Pages & Composants

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, features, stats, architecture, démo SMS |
| `/chat` | Chat IA | Streaming SSE, voice, photo diagnosis, historique |
| `/dashboard` | Dashboard | Carte mondiale, météo, cultures, agents |
| `/parcelles` | Parcelles | Gestion des champs (CRUD) |
| `/parcelles/[id]` | Détail | Cultures, rotation, historique |
| `/calendar` | Calendrier | Grille + timeline, par zone |
| `/profile` | Profil | Préférences, gamification |
| `/login` `/signup` | Auth | Supabase email/password |

### Composants clés
- `WorldMap` — Carte Leaflet interactive avec marqueurs pays
- `SmartSuggestions` — Suggestions contextuelles intelligentes
- `NotificationBanner` — Alertes saisonnières i18n
- `OnboardingTutorial` — Tutoriel première visite
- `GamificationStats` — Badges et niveaux fermier

---

## API Endpoints

### Publics
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/chat` | Chat IA (JSON) |
| POST | `/api/chat/stream` | Chat streaming SSE |
| GET | `/api/weather/{city}` | Prévisions 7 jours |
| POST | `/api/sms/incoming` | Webhook Twilio |
| POST | `/api/diagnose` | Diagnostic photo (Vision) |
| GET | `/api/crops` | Données cultures |
| GET | `/api/markets` | Données marchés |
| GET | `/api/zones` | Zones agro-écologiques |
| GET | `/api/cities` | Villes et coordonnées |

### Protégés (JWT)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET/PUT | `/api/me` | Profil utilisateur |
| GET/POST | `/api/parcelles` | Gestion parcelles |
| GET/PUT/DELETE | `/api/parcelles/{id}` | CRUD parcelle |
| GET/POST | `/api/cultures` | Gestion cultures |
| GET/POST | `/api/history` | Historique saisons |
| GET | `/api/alerts` | Alertes personnalisées |
| POST | `/api/alerts/generate` | Générer alertes IA |
| GET | `/api/calendar/{zone}` | Calendrier par zone |
| GET | `/api/rotation/{id}` | Conseil rotation |

---

## Base de données (Supabase / PostgreSQL)

```sql
profiles       — id, user_id, full_name, phone, city, zone, preferred_language
parcelles      — id, user_id, name, surface_ha, zone, soil_type, irrigation
cultures       — id, parcelle_id, crop_name, planted_at, status, notes
season_history — id, user_id, parcelle_id, season, crop_name, yield_kg, expenses, revenue
alerts         — id, user_id, type, severity, title, message, is_read
```

Toutes les tables ont Row Level Security (RLS) activé.

---

## Structure du Code

```
agriagent/
├── backend/
│   ├── main.py              # FastAPI, CORS, routers
│   ├── config.py            # Settings, villes, zones
│   ├── auth.py              # JWT verification (Supabase)
│   ├── api.py               # Routes publiques
│   ├── api_protected.py     # Routes protégées
│   ├── data_loader.py       # Chargeur JSON
│   ├── migration.sql        # Schema Supabase
│   ├── agents/
│   │   ├── orchestrator.py
│   │   ├── weather_agent.py
│   │   ├── agro_agent.py
│   │   ├── market_agent.py
│   │   └── alerts_agent.py
│   ├── services/
│   │   ├── weather_service.py
│   │   ├── supabase_service.py
│   │   └── sms_service.py
│   └── data/
│       ├── crops.json
│       ├── diseases.json
│       ├── markets.json
│       └── zones.json
│
├── frontend/
│   ├── src/app/             # Pages Next.js
│   ├── src/components/      # Composants React
│   ├── src/components/ui/   # Design system
│   ├── src/context/         # Auth, Language, Theme
│   ├── src/lib/             # API client, Supabase
│   └── src/data/            # Données agriculture mondiale
│
└── .claude/docs/            # Documentation projet
```
