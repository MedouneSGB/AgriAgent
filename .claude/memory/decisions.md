# DECISIONS TECHNIQUES
# ====================
# Ce fichier trace toutes les decisions prises pendant le developpement.
# Utile si le contexte est perdu pour comprendre POURQUOI certains choix ont ete faits.

## 2026-02-12 : Decisions initiales

### Choix du stack
- **Python + FastAPI** plutot que Node.js pour le backend
  - Raison : Meilleur ecosysteme ML/AI, SDK Anthropic Python plus mature
  - Raison : Plus rapide a prototyper pour un hackathon

- **Next.js + React** pour le frontend
  - Raison : SSR pour SEO, App Router moderne, deploy Vercel gratuit

- **SQLite** plutot que PostgreSQL
  - Raison : Zero config, suffisant pour demo hackathon
  - Migration vers Postgres facile si necessaire

- **Open-Meteo** plutot que OpenWeatherMap
  - Raison : 100% gratuit, pas de cle API, donnees de qualite

- **Twilio** pour SMS
  - Raison : API simple, documentation riche, trial gratuit

### Choix d'architecture
- **Multi-agent avec orchestrateur central** plutot que pipeline lineaire
  - Raison : Plus impressionnant pour la demo (critere 30%)
  - Raison : Montre utilisation avancee d'Opus 4.6 (critere 25%)
  - Raison : Plus flexible pour combiner meteo + agro + marche

- **MCP servers** plutot que simple function calling
  - Raison : Les juges sont l'equipe Claude Code, ils connaissent MCP
  - Raison : Montre maitrise de l'ecosysteme Anthropic

- **Wolof comme langue principale** en plus du Francais
  - Raison : Facteur differenciant majeur
  - Raison : Prouve l'accessibilite reelle du projet
  - Raison : Opus 4.6 gere le multilingual

### Priorites de dev
1. Backend + Agents fonctionnels (fondation)
2. Donnees agricoles reelles (credibilite)
3. Frontend dashboard (demo visuelle)
4. SMS integration (wow factor)
5. Polish + tests (qualite)
6. Video demo (30% du score!)
