# ROADMAP AgriAgent SN - Hackathon Claude Code

## Vision
Systeme multi-agent autonome propulse par Opus 4.6 qui democratise l'expertise agronomique pour les petits exploitants du Senegal via SMS et web, en Francais et Wolof.

---

## PHASE 1 : FONDATIONS (Jour 1-2 / 12-13 Fevrier)

### 1.1 Setup Projet
- [ ] Initialiser repo GitHub (MIT License)
- [ ] Structure monorepo (backend + frontend + agents)
- [ ] Setup Claude Agent SDK
- [ ] Configuration MCP servers
- [ ] CI/CD basique (GitHub Actions)
- [ ] README initial avec vision du projet

### 1.2 Architecture Multi-Agent Core
- [ ] **Agent Orchestrateur** (Chef d'orchestre)
  - Route les requetes vers les agents specialises
  - Gere le contexte conversationnel
  - Synthetise les reponses finales
- [ ] **Agent Meteo/Climat**
  - Integration API OpenMeteo (gratuit, pas de cle)
  - Donnees historiques et previsions 7 jours
  - Alertes evenements extremes (secheresse, inondation)
- [ ] **Agent Agronomique**
  - Base de connaissances cultures senegalaises (mil, arachide, riz, mais, niebe)
  - Calendrier cultural adapte aux zones agro-ecologiques
  - Diagnostic maladies/ravageurs
- [ ] **Agent Marche**
  - Prix des denrees par region
  - Tendances et recommandations de vente
  - Connexion marches locaux

### 1.3 Backend API
- [ ] Serveur FastAPI (Python)
- [ ] Endpoints REST pour chaque agent
- [ ] Endpoint webhook SMS (Twilio/Vonage)
- [ ] Systeme de sessions utilisateur
- [ ] Logging des interactions agents

---

## PHASE 2 : FEATURES CORE (Jour 2-3 / 13-14 Fevrier)

### 2.1 Interface SMS (Wolof + Francais)
- [ ] Integration Twilio/Vonage pour SMS
- [ ] Detection automatique de la langue (Wolof/Francais)
- [ ] Reponses adaptees au format SMS (160 caracteres)
- [ ] Commandes simples : METEO, CULTURE, PRIX, AIDE
- [ ] Traduction Wolof <-> Francais via Opus 4.6

### 2.2 Interface Web Dashboard
- [ ] Frontend React/Next.js
- [ ] Dashboard fermier : meteo, conseils, prix
- [ ] Carte interactive du Senegal (zones agro-ecologiques)
- [ ] Visualisation en temps reel des agents en action
- [ ] Interface chat avec les agents
- [ ] Design responsive (mobile-first)

### 2.3 Donnees et Intelligence
- [ ] Base de donnees cultures senegalaises (saison, sol, eau, rendement)
- [ ] Calendrier cultural par zone (Niayes, Casamance, Bassin arachidier, Fleuve)
- [ ] Base ravageurs/maladies avec traitements bio
- [ ] Donnees prix marches (Dakar, Touba, Kaolack, Saint-Louis, Ziguinchor)

---

## PHASE 3 : POLISH & DIFFERENCIATION (Jour 3-4 / 14-15 Fevrier)

### 3.1 Features Avancees Opus 4.6
- [ ] **Raisonnement multi-source** : croiser meteo + sol + culture + marche
  pour generer des recommandations personnalisees
- [ ] **Agent de planification saisonniere** : plan de culture optimal
  basee sur previsions climatiques long terme
- [ ] **Analyse d'image** (si temps) : photo de plante -> diagnostic
- [ ] **Dashboard multi-agent** : visualisation en temps reel du
  raisonnement et de la collaboration entre agents

### 3.2 UX et Accessibilite
- [ ] Onboarding guide pour nouveaux utilisateurs
- [ ] Messages vocaux (text-to-speech pour illettrisme)
- [ ] Mode offline / cache des derniers conseils
- [ ] Themes couleur accessibles

### 3.3 Qualite Code
- [ ] Tests unitaires agents
- [ ] Tests integration API
- [ ] Documentation API (Swagger)
- [ ] Code review et refactoring

---

## PHASE 4 : DEMO & SOUMISSION (Jour 4 / 15-16 Fevrier)

### 4.1 Preparation Demo Video (3 min max)
- [ ] **Script demo** (structure ci-dessous)
- [ ] Enregistrement ecran + voix-off
- [ ] Montage et post-production
- [ ] Upload YouTube/Loom

### 4.2 Script Demo Suggere (3 minutes)

```
[0:00-0:30] HOOK + CONTEXTE
- "Au Senegal, 60% de la population vit de l'agriculture..."
- "Mais les petits exploitants n'ont acces a aucun conseil expert..."
- Intro AgriAgent SN

[0:30-1:15] DEMO SMS (Wolof)
- Un fermier a Kaolack envoie "METEO" par SMS
- L'agent orchestre les sous-agents
- Reponse en Wolof avec previsions et conseils adaptes
- Deuxieme message : "JEGGE" (maladie en Wolof)
- Diagnostic et traitement recommande

[1:15-2:00] DEMO WEB DASHBOARD
- Vue carte du Senegal avec zones agro-ecologiques
- Selection d'un fermier -> profil + historique
- Chat avec l'agent : "Quand planter mes arachides cette annee?"
- Visualisation multi-agent en temps reel
- Recommandation personnalisee avec raisonnement visible

[2:00-2:30] DEMO MARCHE + PLANIFICATION
- Prix en temps reel par region
- Agent de planification : "Cultivez du niebe cette saison car..."
- Raisonnement croise meteo/marche/sol visible

[2:30-3:00] IMPACT + ARCHITECTURE
- Chiffres d'impact potentiel
- Vue architecture multi-agent
- Open source, accessible, scalable
- Call to action
```

### 4.3 Soumission
- [ ] Video demo (3 min max) uploadee
- [ ] Repo GitHub public et propre
- [ ] README complet avec:
  - Description du projet
  - Architecture
  - Instructions d'installation
  - Screenshots/GIFs
  - Licence MIT
- [ ] Resume ecrit (100-200 mots)
- [ ] Soumission sur plateforme CV avant **16 fev 15h EST**

---

## Stack Technique Recommandee

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **LLM** | Claude Opus 4.6 | Requis par le hackathon |
| **Agent Framework** | Claude Agent SDK | Ecosysteme Anthropic = points bonus |
| **Tool Protocol** | MCP (Model Context Protocol) | Montre maitrise outils Anthropic |
| **Backend** | Python + FastAPI | Rapide a dev, bon ecosysteme ML |
| **Frontend** | Next.js + React | SSR, rapide, bonne UX |
| **Carte** | Leaflet / Mapbox | Visualisation geo |
| **SMS** | Twilio | Fiable, API simple |
| **Meteo API** | Open-Meteo | Gratuit, pas de cle API |
| **Database** | SQLite / Supabase | Simple pour hackathon |
| **Deploy** | Vercel (front) + Railway (back) | Deploiement rapide |
| **Visu agents** | D3.js / React Flow | Dashboard multi-agent |

---

## Repartition du Travail (Equipe de 2)

### Personne A : Backend + Agents
- Architecture multi-agent
- Integration APIs (meteo, marche)
- Logique SMS
- Tests

### Personne B : Frontend + Demo
- Dashboard web
- Visualisation agents
- UX/UI
- Video demo

---

## Metriques de Succes

- [ ] 4+ agents fonctionnels et collaborant
- [ ] SMS fonctionnel en Wolof ET Francais
- [ ] Dashboard web deploye et accessible
- [ ] Demo video de 3 min percutante
- [ ] Code open source propre et documente
- [ ] Soumission avant deadline
