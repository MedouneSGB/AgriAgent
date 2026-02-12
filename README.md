# AgriAgent SN

Autonomous multi-agent system powered by Claude Opus 4.6, designed to empower smallholder farmers in Senegal and West Africa.

## What it does

AgriAgent SN delivers real-time, personalized advice on **climate adaptation**, **crop management**, **pest control**, and **market pricing** through an intelligent swarm of specialized AI agents.

- **SMS interface** in French and Wolof for areas with limited internet
- **Web dashboard** with interactive maps and real-time agent visualization
- **Multi-agent architecture** combining weather, agronomic, and market intelligence

## Architecture

```
User (SMS/Web) → API Gateway → Orchestrator Agent
                                    ├── Weather Agent (Open-Meteo API)
                                    ├── Agro Agent (crop knowledge base)
                                    └── Market Agent (price data)
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| LLM | Claude Opus 4.6 |
| Agent Framework | Claude Agent SDK |
| Tools | MCP (Model Context Protocol) |
| Backend | Python + FastAPI |
| Frontend | Next.js + React + Tailwind |
| SMS | Twilio |
| Weather | Open-Meteo API |

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Problem Statement

**Break the Barriers** — Expert agricultural knowledge is locked behind cost, language, and infrastructure. AgriAgent SN puts it in every farmer's hands via SMS in their native language.

## License

MIT
