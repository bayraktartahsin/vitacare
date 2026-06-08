"""FastAPI entry point.

Endpoints:
- POST /scenario/{id}/run  — trigger a demo scenario, stream events via SSE
- GET  /persona/{id}       — get persona state + recent agent activity
- POST /a2a/handshake      — A2A endpoint for inter-persona messages
- GET  /healthz            — liveness probe
"""
from __future__ import annotations

import asyncio
import json
import logging

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from .a2a.messages import A2AMessage
from .config import settings
from .personas import PERSONAS, get_persona
from .scenarios import SCENARIOS

logger = logging.getLogger("vitacare")
logging.basicConfig(level=settings.log_level)

app = FastAPI(title="VitaCare Agents", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def healthz():
    return {"ok": True, "version": "0.1.0"}


@app.get("/personas")
async def list_personas():
    return {"personas": [{"id": p.id, "name": p.name, "role": p.role} for p in PERSONAS]}


@app.get("/persona/{persona_id}")
async def get_persona_state(persona_id: str):
    persona = get_persona(persona_id)
    if not persona:
        raise HTTPException(404, "unknown persona")
    return persona.snapshot()


@app.post("/scenario/{scenario_id}/run")
async def run_scenario(scenario_id: str):
    scenario = SCENARIOS.get(scenario_id)
    if not scenario:
        raise HTTPException(404, "unknown scenario")

    async def event_stream():
        async for event in scenario.run():
            yield {"event": event.kind, "data": json.dumps(event.payload)}

    return EventSourceResponse(event_stream())


@app.post("/a2a/handshake")
async def a2a_handshake(message: A2AMessage):
    """Inbound A2A from another persona's Diplomat."""
    target = get_persona(message.to_persona)
    if not target:
        raise HTTPException(404, "unknown target persona")
    reply = await target.diplomat.handle_inbound(message)
    return reply.model_dump()


def run():
    uvicorn.run(
        "vitacare.main:app",
        host="0.0.0.0",
        port=settings.port,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    run()
