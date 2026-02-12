# INSTRUCTIONS DE REFERENCE - AgriAgent SN
# ==========================================
# Ce fichier sert de contexte persistant pour Claude.
# A LIRE EN PREMIER si le contexte est perdu.

## PROJET
- Nom : AgriAgent SN
- Type : Systeme multi-agent autonome pour agriculteurs senegalais
- Cadre : Hackathon "Built with Opus 4.6" (Claude Code Hackathon)
- Deadline : 16 fevrier 2026, 15h00 EST
- Equipe : Max 2 personnes
- Licence : MIT (open source obligatoire)

## REPO
- Chemin local : c:\Users\MSGB\Documents\GitHub\ClaudeProject
- Structure : Monorepo (backend/ + frontend/)

## STACK TECHNIQUE
- Backend : Python 3 + FastAPI
- Agents : Claude Agent SDK (anthropic python SDK)
- LLM : Claude Opus 4.6 (model ID: claude-opus-4-6-20251101)
- Outils : MCP (Model Context Protocol)
- Frontend : Next.js + React + TypeScript + Tailwind CSS
- Carte : Leaflet.js
- SMS : Twilio (webhook)
- Meteo : Open-Meteo API (gratuit, pas de cle)
- DB : SQLite (simple pour hackathon)
- Deploy : Vercel (front) + Railway (back)

## ARCHITECTURE MULTI-AGENT
4 agents propulses par Opus 4.6 :
1. Orchestrateur - Route requetes, synthetise, traduit Wolof/FR
2. Agent Meteo - Previsions, alertes via Open-Meteo
3. Agent Agronomique - Cultures, maladies, calendrier cultural
4. Agent Marche - Prix, tendances, conseils vente

## CRITERES DE JUGEMENT (a garder en tete)
- Demo : 30% (doit etre impressionnante et fonctionnelle)
- Impact : 25% (potentiel reel pour fermiers senegalais)
- Usage Opus 4.6 : 25% (utilisation creative multi-agent)
- Profondeur : 20% (code solide, pas un quick hack)

## PROBLEM STATEMENT CIBLE
Problem Statement 2 : "Break the Barriers"
> Prendre quelque chose de puissant verrouille derriere l'expertise,
> le cout, la langue ou l'infrastructure et le mettre entre les mains de tous.

## LANGUES SUPPORTEES
- Francais (langue officielle Senegal)
- Wolof (langue la plus parlee, ~80% population)

## ZONES AGRO-ECOLOGIQUES SENEGAL
1. Niayes (cote nord) - Maraichage
2. Bassin Arachidier (centre) - Arachide, mil
3. Casamance (sud) - Riz, mais
4. Vallee du Fleuve (nord) - Riz irrigue, tomate
5. Zone Sylvo-pastorale (nord-est) - Elevage
6. Senegal Oriental (est) - Coton, mais

## CULTURES PRINCIPALES
Arachide, Mil, Riz, Mais, Niebe, Tomate, Oignon

## FICHIERS DE REFERENCE
Tout est dans .claude/ :
- .claude/INSTRUCTIONS.md : CE FICHIER (reference principale)
- .claude/docs/HACKATHON_RESUME.md : Resume complet du hackathon
- .claude/docs/STRATEGIE_VICTOIRE.md : Strategie pour gagner
- .claude/docs/ROADMAP.md : Roadmap detaillee 4 phases
- .claude/docs/ARCHITECTURE.md : Architecture technique detaillee
- .claude/memory/decisions.md : Decisions techniques et pourquoi
- .claude/memory/problemes.md : Bugs et solutions
- .claude/memory/progress.md : Journal de progression
- .claude/memory/wolof_reference.md : Vocabulaire Wolof agricole
- .claude/memory/geo_senegal.md : Coordonnees GPS Senegal
- .claude/scratchpad/ : Brouillons et tests temporaires

## CONVENTIONS DE CODE
- Backend Python : snake_case, type hints, docstrings
- Frontend TS : camelCase, interfaces TypeScript
- Commits : messages en anglais, descriptifs
- Variables d'env : .env.example fourni (jamais .env dans le repo)

## APIs EXTERNES
### Open-Meteo (meteo)
- Base URL : https://api.open-meteo.com/v1/forecast
- Pas de cle API necessaire
- Params : latitude, longitude, daily, hourly, timezone
- Coordonnees Senegal :
  - Dakar : 14.6928, -17.4467
  - Kaolack : 14.1520, -16.0726
  - Saint-Louis : 16.0326, -16.4818
  - Ziguinchor : 12.5681, -16.2719
  - Touba : 14.8500, -15.8833
  - Thies : 14.7886, -16.9260
  - Tambacounda : 13.7709, -13.6673

### Twilio (SMS)
- Webhook endpoint : POST /api/sms/incoming
- Response format : TwiML ou JSON
- Variables : TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

### Anthropic (Claude)
- Variable : ANTHROPIC_API_KEY
- Model : claude-opus-4-6-20251101

## COMMANDES UTILES
```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install
npm run dev -- --port 3000

# Tests
cd backend && pytest
cd frontend && npm test
```

## ETAT D'AVANCEMENT
Mettre a jour cette section au fur et a mesure :
- [x] Fichiers de strategie et roadmap crees
- [x] Fichier d'instructions cree
- [ ] Structure projet initialisee
- [ ] Backend FastAPI operationnel
- [ ] Donnees agricoles creees
- [ ] Agents implementes
- [ ] MCP servers operationnels
- [ ] Frontend Next.js operationnel
- [ ] SMS integre
- [ ] Dashboard fonctionnel
- [ ] Tests ecrits
- [ ] Demo video enregistree
- [ ] Soumission effectuee
