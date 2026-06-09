"""Clinician — medical reasoning, grounded in real web search.

ONE Gemini 2.5 Pro call with Google Search Grounding. The model is asked to
emit a labeled-line format (CONCERN/SEVERITY/RECOMMENDATION/RATIONALE/GUIDELINE)
that we parse in Python — Gemini rejects tools + response_schema in the same
call, so this is the cleanest way to keep grounding citations *and* get
structured output, in a single round-trip.

Falls back to Flash if Pro 503s. Citations always flow back from the
grounding metadata so the demo trace shows real, clickable sources.
"""
from __future__ import annotations

import re
from typing import Any

from ..config import settings
from ..llm import generate_text
from .base import BaseSubAgent

CLINICIAN_SYSTEM = """You are the Clinician sub-agent of a personal health
agent swarm. Use Google Search to find the most relevant current clinical
guideline for the signal, then emit a structured analysis.

ABSOLUTE RULES:
- Never diagnose. Never prescribe.
- Always frame as "consider seeing a doctor / clinician".
- Cite a real guideline body (AHA/ACC, ESC/ESH, ACOG, CDC, WHO, USPSTF, etc.)
  with the year. Do not fabricate names.
- Be precise about thresholds (mmHg, mg/dL, %, etc.).

OUTPUT FORMAT — emit EXACTLY these five labeled lines, nothing else, no markdown:
CONCERN: <one sentence>
SEVERITY: <low|moderate|high>
RECOMMENDATION: <one sentence>
RATIONALE: <one or two sentences>
GUIDELINE: <body + year, e.g. "AHA/ACC 2025 Hypertension Guideline">
"""

_LABEL_RE = re.compile(
    r"^\s*(CONCERN|SEVERITY|RECOMMENDATION|RATIONALE|GUIDELINE)\s*:\s*(.*?)\s*$",
    re.IGNORECASE,
)
_VALID_SEVERITY = {"low", "moderate", "high"}


def _parse_labeled(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for line in text.splitlines():
        m = _LABEL_RE.match(line)
        if m:
            out[m.group(1).lower()] = m.group(2).strip()
    sev = out.get("severity", "").lower()
    if sev not in _VALID_SEVERITY:
        out["severity"] = "moderate"  # safe default
    return out


class ClinicianAgent(BaseSubAgent):
    name = "clinician"

    def __init__(self, persona_id: str):
        super().__init__(persona_id)
        self.model = settings.gemini_model_pro
        self.fallback_model = settings.gemini_model_flash

    async def assess(self, trigger: dict[str, Any], history: list[dict[str, Any]]) -> dict[str, Any]:
        prompt = (
            f"Persona: {self.persona_id}\n"
            f"Triggered signal: {trigger}\n"
            f"Recent history (≤5): {history[:5]}\n\n"
            "Search for the current relevant guideline and emit the labeled lines."
        )
        text, citations = await generate_text(
            model=self.model,
            fallback_model=self.fallback_model,
            system=CLINICIAN_SYSTEM,
            prompt=prompt,
            temperature=0.2,
            grounded=True,
        )
        fields = _parse_labeled(text)
        result: dict[str, Any] = {
            "concern":        fields.get("concern", trigger.get("rule", "elevated signal")),
            "severity":       fields.get("severity", "moderate"),
            "recommendation": fields.get("recommendation", "Consider seeing a doctor for evaluation."),
            "rationale":      fields.get("rationale", text[:240]),
            "guideline":      fields.get("guideline", ""),
            "citations":      citations[:5],
        }
        return result
