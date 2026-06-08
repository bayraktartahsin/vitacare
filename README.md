# 🌐 VitaCare — The Agent-to-Agent Care Network

> *One AI per person. A network for the people you love.*

**Submission:** [Google for Startups AI Agents Challenge](https://googlestartupsaiagents.devpost.com/)
**Track:** 1 — Build (Net-New Agents) · **Region:** EMEA
**Built by:** [Graviti Labs](https://gravitilabs.com) · Tahsin Bayraktar

VitaCare is the world's first **agent-to-agent (A2A) care network**. Every family member runs a personal swarm of six health agents (Sentinel, Chronicler, Clinician, Concierge, Diplomat, Voice) built on Google's Agent Development Kit. The Diplomats coordinate care *across people* over Google's A2A protocol — booking appointments, refilling meds, filing claims, and calling family members — all consent-gated.

The shared **Family Health Graph** lets the network spot cross-generational and cross-time patterns no single clinician would catch.

## Architecture

```
                ┌──────────────────────────┐
                │ OUTER RING — KNOWLEDGE   │
                │ PubMed · Guidelines      │
                │ clinicaltrials.gov       │
                └────────────┬─────────────┘
                             │ A2A
          ┌──────────────────┴──────────────────┐
          │ MIDDLE RING — CLINICAL              │
          │ Doctor Agent (Vita Praxis)          │
          │ Pharmacy · Lab · Insurer            │
          └──────────────────┬──────────────────┘
                             │ A2A
          ┌──────────────────┴──────────────────┐
          │ INNER RING — FAMILY                 │
          │  Emma (32, pregnant) ⇄ Robert (60)  │
          │              ⇅                       │
          │     Sarah (28, caregiver)            │
          └─────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │  FAMILY HEALTH  │
                    │      GRAPH      │
                    └─────────────────┘
```

## Repo layout

```
vitacare/
├── agents/        # Python ADK multi-agent backend (FastAPI on Cloud Run)
├── mcp_servers/   # Mock MCP servers (Pharmacy, Clinic, Lab, Insurer)
├── web/           # Next.js 14 demo frontend (Cloud Run)
├── docs/          # Architecture, demo script, diagrams
├── infra/         # Cloud Run deploy configs
└── MASTER-SCOPE.md  # Full plan, schedule, Devpost copy
```

## Tech stack

Gemini 2.5 Pro · Gemini 2.5 Flash · Gemini Live · Cloud Text-to-Speech · ADK · A2A Protocol · MCP · Vertex AI Vector Search · Firestore · Cloud Run · Cloud Tasks · Identity Platform · Google Calendar · Next.js · Python · **100% Google stack — no third-party telephony, no external AI providers**

## Demo

**Live demo:** <https://vitacare-web-205100594497.europe-west1.run.app>
**Agents API:** <https://vitacare-agents-205100594497.europe-west1.run.app>
**Architecture diagram:** <https://vitacare-web-205100594497.europe-west1.run.app/diagram> (or [docs/architecture-diagram.png](docs/architecture-diagram.png))

3 scenarios:
1. **The Cascade** — Robert's BP trend triggers Sarah's calendar; the agent "calls" Robert via an in-browser phone-call modal driven by real Google Cloud Text-to-Speech (no telephony provider)
2. **The Pregnancy** — Emma's early GDM signal triggers cross-family coordination
3. **The Coordination** — Sarah's caregiver morning — two inbound A2A messages collapse into one 7pm block

## Run the demo locally (2 min)

You need: Python 3.11+, Node 20+, a Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey), and `gcloud auth application-default login` for Cloud TTS.

```bash
git clone https://github.com/bayraktartahsin/vitacare && cd vitacare

# 1. Agents backend (FastAPI on :8080)
cd agents
python3 -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env   # then edit GEMINI_API_KEY=AIza...
python -m vitacare.main &

# 2. Web demo (Next.js on :3000)
cd ../web
npm install && npm run dev
```

Open <http://localhost:3000>, click **The Cascade**, wait ~7 seconds → the phone-call modal slides up with real Turkish voice. (Click anywhere on the page first to satisfy browser autoplay rules.)

For the architecture diagram alone, visit <http://localhost:3000/diagram>.

To run the agents offline against canned data only (no Gemini key required, useful for CI):

```bash
cd agents && python scripts/smoke.py cascade
```

## License

Source-available for hackathon judging. © 2026 Graviti Labs.
