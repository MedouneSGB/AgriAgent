# Architecture AgriAgent SN

## Vue d'ensemble

```
                    +------------------+
                    |   UTILISATEURS   |
                    +------------------+
                    |  SMS (Wolof/FR)  |
                    |  Web Dashboard   |
                    +--------+---------+
                             |
                    +--------v---------+
                    |   API GATEWAY    |
                    |   (FastAPI)      |
                    +--------+---------+
                             |
                    +--------v---------+
                    |   ORCHESTRATEUR  |
                    |   (Agent Chef)   |
                    |   Opus 4.6       |
                    +--------+---------+
                             |
            +----------------+----------------+
            |                |                |
   +--------v------+ +------v-------+ +------v--------+
   | AGENT METEO   | | AGENT AGRO   | | AGENT MARCHE  |
   | - Previsions  | | - Cultures   | | - Prix        |
   | - Alertes     | | - Maladies   | | - Tendances   |
   | - Historique  | | - Calendrier | | - Conseils    |
   +--------+------+ +------+-------+ +------+--------+
            |                |                |
   +--------v------+ +------v-------+ +------v--------+
   | MCP: OpenMeteo| | MCP: AgriDB  | | MCP: MarketDB |
   | API Weather   | | Knowledge    | | Price Data    |
   +---------------+ +--------------+ +---------------+
```

## Agents Details

### 1. Agent Orchestrateur (orchestrator)
**Role:** Point d'entree unique, routage intelligent, synthese

**Capacites:**
- Analyse l'intention de l'utilisateur (langue, besoin)
- Determine quels agents specialises appeler
- Synthetise les reponses de multiples agents
- Gere le contexte conversationnel
- Adapte la reponse au canal (SMS court vs Web detaille)

**Outils MCP:**
- `detect_language` - Detecter Wolof/Francais
- `translate` - Traduire entre langues
- `route_query` - Router vers le bon agent

### 2. Agent Meteo (weather_agent)
**Role:** Informations climatiques et alertes

**Capacites:**
- Previsions meteo 7 jours par localite
- Donnees historiques de precipitation
- Detection evenements extremes
- Recommandations liees au climat (irrigation, recolte)

**Outils MCP:**
- `get_forecast` - Previsions Open-Meteo
- `get_historical_weather` - Donnees historiques
- `check_alerts` - Alertes meteo

### 3. Agent Agronomique (agro_agent)
**Role:** Expertise agricole et conseils culturaux

**Capacites:**
- Diagnostic maladies et ravageurs
- Calendrier cultural par zone et culture
- Recommandations de semis/recolte
- Pratiques durables et bio

**Outils MCP:**
- `get_crop_info` - Info sur une culture
- `diagnose_disease` - Diagnostic maladie
- `get_calendar` - Calendrier cultural
- `get_treatment` - Traitements recommandes

### 4. Agent Marche (market_agent)
**Role:** Intelligence marche et prix

**Capacites:**
- Prix actuels par produit et region
- Tendances de prix
- Meilleur moment pour vendre
- Marches les plus proches et rentables

**Outils MCP:**
- `get_prices` - Prix actuels
- `get_trends` - Tendances
- `find_markets` - Marches proches
- `recommend_sell` - Conseil de vente

## Zones Agro-ecologiques du Senegal

1. **Niayes** (cote nord) - Maraichage, fruits
2. **Bassin Arachidier** (centre) - Arachide, mil, niebe
3. **Casamance** (sud) - Riz, mais, fruits
4. **Vallee du Fleuve Senegal** (nord) - Riz irrigue, tomate
5. **Zone Sylvo-pastorale** (nord-est) - Elevage, mil
6. **Senegal Oriental** (est) - Coton, mais

## Cultures Principales

| Culture | Zone | Saison | Cycle |
|---------|------|--------|-------|
| Arachide | Bassin arachidier | Hivernage (juin-oct) | 90-120 jours |
| Mil | Centre, Nord | Hivernage | 90-110 jours |
| Riz | Casamance, Fleuve | Hivernage / Irrigue | 120-150 jours |
| Mais | Casamance, Est | Hivernage | 90-120 jours |
| Niebe | Centre | Hivernage | 60-80 jours |
| Tomate | Niayes, Fleuve | Saison seche | 70-90 jours |
| Oignon | Niayes, Fleuve | Saison seche | 90-120 jours |

## Flow SMS Exemple

```
Fermier (Wolof): "METEO Kaolack"
                    |
                    v
[API Gateway] -> Detect langue: Wolof
                    |
                    v
[Orchestrateur] -> Route vers Agent Meteo
                    |
                    v
[Agent Meteo] -> Open-Meteo API (lat: 14.15, lon: -16.07)
              -> Prevision: 35C, pas de pluie 5 jours
                    |
                    v
[Orchestrateur] -> Contextualise pour agriculteur
               -> "Taw baxul ci 5 fan yi. Nangula sa tool yi."
               -> (Pas de pluie pendant 5 jours. Arrosez vos cultures.)
                    |
                    v
[SMS] -> Envoie en Wolof, format court
```

## Flow Web Exemple

```
Fermier (Web): "Quand planter mes arachides cette annee a Kaolack?"
                    |
                    v
[Orchestrateur] -> Appelle Agent Meteo + Agent Agro en parallele
                    |
        +-----------+-----------+
        |                       |
[Agent Meteo]           [Agent Agro]
Prevision saison:       Calendrier arachide:
Pluies prevues          Semis: debut hivernage
mi-juin                 Sol: sableux ok
                        Zone: Bassin arachidier
        |                       |
        +-----------+-----------+
                    |
                    v
[Orchestrateur] -> Synthese:
"Pour vos arachides a Kaolack, je recommande de semer
entre le 15 et 25 juin. Les previsions indiquent un
debut d'hivernage normal mi-juin. Choisissez la variete
55-437 adaptee au bassin arachidier."
```

## Structure du Code

```
agriagent-sn/
├── README.md
├── LICENSE (MIT)
├── .env.example
├── docker-compose.yml
│
├── backend/
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Configuration
│   ├── requirements.txt
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py     # Agent principal
│   │   ├── weather_agent.py    # Agent meteo
│   │   ├── agro_agent.py       # Agent agronomique
│   │   └── market_agent.py     # Agent marche
│   │
│   ├── mcp_servers/
│   │   ├── weather_server.py   # MCP server meteo
│   │   ├── agro_server.py      # MCP server agronomique
│   │   └── market_server.py    # MCP server marche
│   │
│   ├── data/
│   │   ├── crops.json          # Base cultures
│   │   ├── diseases.json       # Base maladies
│   │   ├── markets.json        # Donnees marches
│   │   └── zones.json          # Zones agro-ecologiques
│   │
│   ├── services/
│   │   ├── sms_service.py      # Integration Twilio
│   │   ├── weather_service.py  # Client OpenMeteo
│   │   └── translation.py     # Traduction Wolof/FR
│   │
│   └── tests/
│       ├── test_orchestrator.py
│       ├── test_weather.py
│       └── test_agro.py
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard principal
│   │   ├── chat/
│   │   │   └── page.tsx        # Interface chat
│   │   └── agents/
│   │       └── page.tsx        # Visualisation agents
│   │
│   ├── components/
│   │   ├── Map.tsx             # Carte Senegal
│   │   ├── AgentFlow.tsx       # Visu agents
│   │   ├── WeatherCard.tsx     # Widget meteo
│   │   ├── PriceTable.tsx      # Tableau prix
│   │   └── ChatInterface.tsx   # Chat
│   │
│   └── lib/
│       └── api.ts              # Client API
│
└── docs/
    ├── HACKATHON_RESUME.md
    ├── STRATEGIE_VICTOIRE.md
    └── ARCHITECTURE.md
```
