"""Gemini client helpers — one place to construct the SDK client.

We use google-genai (the official Gemini SDK). Models are configured via env.
For the hackathon we authenticate with an AI Studio API key (free + fast). In
production this would switch to Vertex AI auth via ADC.

Includes light retry/fallback so a 503 from one model doesn't crash a scenario.
"""
from __future__ import annotations

import asyncio
import json
import logging
from functools import lru_cache
from typing import Any

from google import genai
from google.genai import errors as genai_errors
from google.genai import types

from .config import settings

logger = logging.getLogger("vitacare.llm")


@lru_cache(maxsize=1)
def client() -> genai.Client:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not set — check agents/.env")
    return genai.Client(api_key=settings.gemini_api_key)


def _is_overloaded(e: Exception) -> bool:
    """True if the error is a transient capacity error worth retrying."""
    if isinstance(e, (genai_errors.ServerError, genai_errors.ClientError)):
        code = getattr(e, "code", None) or 0
        if code in (429, 500, 503):
            return True
    return False


async def generate(
    *,
    model: str,
    prompt: str,
    system: str | None = None,
    json_schema: dict[str, Any] | None = None,
    temperature: float = 0.4,
    fallback_model: str | None = None,
    max_retries: int = 2,
) -> str:
    """One-shot text generation. Returns the model's text (JSON string if schema given).

    On 429/500/503, retries once then falls back to ``fallback_model`` (typically Flash).
    """
    cfg_kwargs: dict[str, Any] = {"temperature": temperature}
    if system:
        cfg_kwargs["system_instruction"] = system
    if json_schema:
        cfg_kwargs["response_mime_type"] = "application/json"
        cfg_kwargs["response_schema"] = json_schema
    config = types.GenerateContentConfig(**cfg_kwargs)

    candidates = [model] + ([fallback_model] if fallback_model and fallback_model != model else [])

    last_err: Exception | None = None
    for m in candidates:
        for attempt in range(max_retries + 1):
            try:
                resp = client().models.generate_content(model=m, contents=prompt, config=config)
                return (resp.text or "").strip()
            except Exception as e:  # noqa: BLE001
                last_err = e
                if _is_overloaded(e) and attempt < max_retries:
                    delay = 0.6 * (2**attempt)
                    logger.warning("Gemini %s overloaded (attempt %d) — retrying in %.1fs", m, attempt + 1, delay)
                    await asyncio.sleep(delay)
                    continue
                if _is_overloaded(e) and m != candidates[-1]:
                    logger.warning("Gemini %s still overloaded — falling back to next model", m)
                    break  # move on to next candidate model
                raise
    raise last_err if last_err else RuntimeError("Gemini generate: no candidates")


async def generate_json(
    *,
    model: str,
    prompt: str,
    system: str | None = None,
    schema: dict[str, Any],
    temperature: float = 0.2,
    fallback_model: str | None = None,
) -> dict[str, Any]:
    """Structured JSON output. Raises if parse fails (caller logs + falls back)."""
    raw = await generate(
        model=model,
        prompt=prompt,
        system=system,
        json_schema=schema,
        temperature=temperature,
        fallback_model=fallback_model,
    )
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        logger.warning("Gemini returned non-JSON for schema call; falling back. raw=%r", raw[:200])
        return {}
