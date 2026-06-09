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
    grounded: bool = False,
) -> tuple[str, list[dict[str, str]]]:
    """One-shot text generation. Returns ``(text, citations)``.

    - ``json_schema`` enables structured output (mutually exclusive with ``grounded``;
      Gemini rejects tool use combined with response_mime_type=application/json).
    - ``grounded=True`` adds Google Search Grounding so the model cites real sources.
    - ``citations`` is ``[{"title": ..., "uri": ...}, ...]`` (empty when ungrounded).
    - On 429/500/503, retries with backoff then falls back to ``fallback_model``.
    """
    cfg_kwargs: dict[str, Any] = {"temperature": temperature}
    if system:
        cfg_kwargs["system_instruction"] = system
    if json_schema:
        cfg_kwargs["response_mime_type"] = "application/json"
        cfg_kwargs["response_schema"] = json_schema
    if grounded:
        if json_schema:
            raise ValueError("grounded=True cannot be combined with json_schema (Gemini API limitation)")
        cfg_kwargs["tools"] = [types.Tool(google_search=types.GoogleSearch())]
    config = types.GenerateContentConfig(**cfg_kwargs)

    candidates = [model] + ([fallback_model] if fallback_model and fallback_model != model else [])

    last_err: Exception | None = None
    for m in candidates:
        for attempt in range(max_retries + 1):
            try:
                resp = client().models.generate_content(model=m, contents=prompt, config=config)
                text = (resp.text or "").strip()
                citations: list[dict[str, str]] = []
                if grounded and resp.candidates:
                    gm = resp.candidates[0].grounding_metadata
                    if gm and gm.grounding_chunks:
                        for c in gm.grounding_chunks:
                            web = getattr(c, "web", None)
                            if web and getattr(web, "uri", None):
                                citations.append({"title": web.title or "", "uri": web.uri})
                return text, citations
            except Exception as e:  # noqa: BLE001
                last_err = e
                if _is_overloaded(e) and attempt < max_retries:
                    delay = 0.6 * (2**attempt)
                    logger.warning("Gemini %s overloaded (attempt %d) — retrying in %.1fs", m, attempt + 1, delay)
                    await asyncio.sleep(delay)
                    continue
                if _is_overloaded(e) and m != candidates[-1]:
                    logger.warning("Gemini %s still overloaded — falling back to next model", m)
                    break
                raise
    raise last_err if last_err else RuntimeError("Gemini generate: no candidates")


async def generate_text(
    *,
    model: str,
    prompt: str,
    system: str | None = None,
    temperature: float = 0.4,
    fallback_model: str | None = None,
    grounded: bool = False,
) -> tuple[str, list[dict[str, str]]]:
    """Convenience: text-only generation (no JSON schema). Returns (text, citations)."""
    return await generate(
        model=model, prompt=prompt, system=system, temperature=temperature,
        fallback_model=fallback_model, grounded=grounded,
    )


async def generate_json(
    *,
    model: str,
    prompt: str,
    system: str | None = None,
    schema: dict[str, Any],
    temperature: float = 0.2,
    fallback_model: str | None = None,
) -> dict[str, Any]:
    """Structured JSON output. Returns parsed dict, or {} if parse fails."""
    raw, _ = await generate(
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
