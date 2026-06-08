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
          │  Aylin (32, pregnant) ⇄ Ahmet (60)  │
          │              ⇅                       │
          │     Selin (28, caregiver)            │
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

Live demo: `https://vitacare.gravitilabs.com` *(deploys T-12h before submission)*

3 scenarios:
1. **The Cascade** — Father's BP trend triggers a family-wide response; agent "calls" father via an in-browser Gemini Live phone-call modal (real Turkish voice, live waveform, no telephony provider)
2. **The Pregnancy** — Pre-eclampsia signal triggers husband-side coordination
3. **The Coordination** — Caregiver's morning, where both parents' agents have prepped her day

## Local dev

```bash
# Backend (Python agents)
cd agents
uv sync
uv run vitacare

# Frontend (Next.js demo)
cd web
npm install
npm run dev

# Mock MCP servers
cd mcp_servers && ./run_all.sh
```

## License

Source-available for hackathon judging. © 2026 Graviti Labs.
