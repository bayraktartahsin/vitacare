# VitaCare Agents

Python backend hosting the multi-agent A2A care network. Built on Google's Agent Development Kit (ADK) + Gemini + MCP + A2A protocol.

## Quick start

```bash
# install
uv sync                 # or: pip install -e .

# set env (see .env.example)
cp .env.example .env    # then fill in GEMINI_API_KEY etc.

# run locally
uv run vitacare         # FastAPI on :8080
```

## Architecture

Each persona has a swarm of 6 sub-agents:

```
vitacare/
├── main.py             # FastAPI app, agent registry, SSE streaming endpoint
├── config.py           # settings (Pydantic BaseSettings)
├── personas/           # 3 personas: aylin (pregnant), ahmet (hypertensive), selin (caregiver)
├── subagents/          # 6 sub-agent types
│   ├── sentinel.py     # watches HealthKit/wearables, fires triggers
│   ├── chronicler.py   # longitudinal medical memory
│   ├── clinician.py    # clinical reasoning, grounded
│   ├── concierge.py    # does things via MCP tools
│   ├── diplomat.py     # A2A interface to other personas
│   └── voice.py        # Gemini Live, multilingual
├── a2a/                # A2A protocol primitives (handshake, consent)
├── fhg/                # Family Health Graph (Vertex Vector + Firestore)
├── mcp_clients/        # MCP client wrappers (calendar, pharmacy, ...)
└── scenarios/          # 3 demo scenarios (cascade, pregnancy, coordination)
```

## Endpoints

- `POST /scenario/{id}/run` — trigger a demo scenario, stream events via SSE
- `GET  /persona/{id}` — get persona state + recent agent activity
- `POST /a2a/handshake` — A2A endpoint for inter-persona messages
- `GET  /healthz` — liveness probe (Cloud Run)
