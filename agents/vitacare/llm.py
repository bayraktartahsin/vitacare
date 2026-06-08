"""Gemini client helpers — one place to construct the SDK client.

We use google-genai (the official Gemini SDK). Models are configured via env.
For the hackathon we authenticate with an AI Studio API key (free + fast). In
production this would switch to Vertex AI auth via ADC.
"""
from __future__ import annotations

import json
import logging
from functools import lru_cache
from typing import Any

from google import genai
from google.genai import types

from .config import settings

logger = logging.getLogger("vitacare.llm")


@lru_cache(maxsize=1)
def client() -> genai.Client:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not set — check agents/.env")
    return genai.Client(api_key=settings.gemini_api_key)


async def generate(
    *,
    model: str,
    prompt: str,
    system: str | None = None,
    json_schema: dict[str, Any] | None = None,
    temperature: float = 0.4,
) -> str:
    """One-shot text generation. Returns the model's text (or JSON string if json_schema given)."""
    cfg_kwargs: dict[str, Any] = {"temperature": temperature}
    if system:
        cfg_kwargs["system_instruction"] = system
    if json_schema:
        cfg_kwargs["response_mime_type"] = "application/json"
        cfg_kwargs["response_schema"] = json_schema

    config = types.GenerateContentConfig(**cfg_kwargs)
    resp = client().models.generate_content(model=model, contents=prompt, config=config)
    return (resp.text or "").strip()


async def generate_json(
    *,
    model: str,
    prompt: str,
    system: str | None = None,
    schema: dict[str, Any],
    temperature: float = 0.2,
) -> dict[str, Any]:
    """Structured JSON output. Raises if parse fails (caller logs + falls back)."""
    raw = await generate(
        model=model, prompt=prompt, system=system, json_schema=schema, temperature=temperature
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        logger.warning("Gemini returned non-JSON for schema call; falling back. raw=%r", raw[:200])
        return {}
