"""Clinician — medical reasoning, grounded.

Uses Gemini 2.5 Pro with structured JSON output. Never diagnoses, never
prescribes — always frames as "consider seeing a doctor" (Vita's safety rule).
"""
from __future__ import annotations

from typing import Any

from ..config import settings
from ..llm import generate_json
from .base import BaseSubAgent

CLINICIAN_SYSTEM = """You are the Clinician sub-agent inside a personal health
agent swarm. You assess clinical signals and decide whether they warrant action.

ABSOLUTE RULES:
- Never diagnose. Never prescribe.
- Always frame the recommendation as "consider seeing a doctor / pharmacist".
- Cite a real, well-known guideline body (ESC, ACOG, CDC, WHO, ESPGHAN, etc.)
  when one applies — short citation, no fabrication.
- Be concise. The downstream consumer is another agent, not a human.
- Output ONLY the JSON object the schema specifies.
"""

CLINICIAN_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "concern":        {"type": "string"},
        "severity":       {"type": "string", "enum": ["low", "moderate", "high"]},
        "recommendation": {"type": "string"},
        "rationale":      {"type": "string"},
        "guideline":      {"type": "string"},
    },
    "required": ["concern", "severity", "recommendation", "rationale", "guideline"],
}


class ClinicianAgent(BaseSubAgent):
    name = "clinician"

    def __init__(self, persona_id: str):
        super().__init__(persona_id)
        self.model = settings.gemini_model_pro

    async def assess(self, trigger: dict[str, Any], history: list[dict[str, Any]]) -> dict[str, Any]:
        prompt = (
            f"Persona id: {self.persona_id}\n"
            f"Trigger: {trigger}\n"
            f"Recent history (up to 5 items): {history[:5]}\n\n"
            "Assess this trigger. Return the JSON object."
        )
        result = await generate_json(
            model=self.model,
            fallback_model=settings.gemini_model_flash,
            system=CLINICIAN_SYSTEM,
            prompt=prompt,
            schema=CLINICIAN_SCHEMA,
        )
        if not result:
            return {
                "concern": trigger.get("rule", "unknown"),
                "severity": "low",
                "recommendation": "Log and re-evaluate in 48h; consider seeing a doctor if it recurs.",
                "rationale": "fallback — model returned no structured output",
                "guideline": "",
            }
        return result
