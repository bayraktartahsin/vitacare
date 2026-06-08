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
from fastapi.responses import Response
from pydantic import BaseModel
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


async def _scenario_event_stream(scenario_id: str):
    scenario = SCENARIOS.get(scenario_id)
    if not scenario:
        raise HTTPException(404, "unknown scenario")
    async for event in scenario.run():
        data = {"persona": event.persona, **event.payload}
        yield {"event": event.kind, "data": json.dumps(data, default=str)}


@app.post("/scenario/{scenario_id}/run")
async def run_scenario(scenario_id: str):
    """POST variant — kept for tools that prefer POST semantics."""
    return EventSourceResponse(_scenario_event_stream(scenario_id))


@app.get("/scenario/{scenario_id}/stream")
async def stream_scenario(scenario_id: str):
    """GET variant — native browser EventSource compatibility."""
    return EventSourceResponse(_scenario_event_stream(scenario_id))


@app.post("/a2a/handshake")
async def a2a_handshake(message: A2AMessage):
    """Inbound A2A from another persona's Diplomat."""
    target = get_persona(message.to_persona)
    if not target:
        raise HTTPException(404, "unknown target persona")
    reply = await target.diplomat.handle_inbound(message)
    return reply.model_dump()


class TTSRequest(BaseModel):
    text: str
    lang: str = "tr-TR"
    voice: str | None = None


_TTS_VOICES = {
    "tr-TR": "tr-TR-Wavenet-E",   # warm female TR voice
    "en-US": "en-US-Neural2-F",
}


@app.post("/tts")
async def synthesize(req: TTSRequest):
    """Cloud Text-to-Speech endpoint — returns MP3 bytes the browser plays.

    This is the audio the simulated phone-call modal plays. Pure Google.
    """
    try:
        from google.cloud import texttospeech  # lazy import so the module loads even if creds missing
    except ImportError as e:
        raise HTTPException(500, f"texttospeech not installed: {e}") from e
    client = texttospeech.TextToSpeechClient()
    voice_name = req.voice or _TTS_VOICES.get(req.lang, _TTS_VOICES["en-US"])
    audio = client.synthesize_speech(
        input=texttospeech.SynthesisInput(text=req.text),
        voice=texttospeech.VoiceSelectionParams(language_code=req.lang, name=voice_name),
        audio_config=texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3),
    )
    return Response(content=audio.audio_content, media_type="audio/mpeg")


def run():
    uvicorn.run(
        "vitacare.main:app",
        host="0.0.0.0",
        port=settings.port,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    run()
