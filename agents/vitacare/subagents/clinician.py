"""Clinician — medical reasoning, grounded.

Uses Gemini 2.5 Pro with Google Search Grounding. Never diagnoses, never
prescribes — always frames as "consider seeing a doctor" (Vita's safety rule).
"""
from __future__ import annotations

from typing import Any

from ..config import settings
from .base import BaseSubAgent

CLINICIAN_INSTRUCTION = """You are the Clinician sub-agent in a personal health
agent swarm. You assess clinical signals and decide whether they warrant action.

ABSOLUTE RULES:
- Never diagnose. Never prescribe.
- Always frame conclusions as "consider seeing a doctor / pharmacist".
- Cite guidelines or literature when you can (you have search grounding).
- Be concise. Output structured JSON when asked.

INPUT: a triggered signal + recent history.
OUTPUT: {"concern": "...", "severity": "low|moderate|high", "recommendation": "...", "rationale": "..."}
"""


class ClinicianAgent(BaseSubAgent):
    name = "clinician"

    def __init__(self, persona_id: str):
        super().__init__(persona_id)
        self.model = settings.gemini_model_pro

    async def assess(self, trigger: dict[str, Any], history: list[dict[str, Any]]) -> dict[str, Any]:
        """Assess a Sentinel trigger against history. Returns a structured assessment."""
        # In real impl: google-genai client with grounding=True
        # For the skeleton, return a deterministic assessment per rule.
        rule = trigger.get("rule", "")
        if rule == "bp.elevated":
            return {
                "concern": "Sustained elevated BP over 3 mornings",
                "severity": "moderate",
                "recommendation": "GP visit within 1 week; daily home BP log",
                "rationale": "ESC 2024: ≥3 elevated readings warrant clinical review",
                "guideline": "ESC Hypertension 2024",
            }
        if rule == "glucose.spike.postprandial":
            return {
                "concern": "Postprandial glucose elevation in T3 pregnancy",
                "severity": "moderate",
                "recommendation": "Re-test fasting + 1h postprandial; notify OB at next visit",
                "rationale": "ACOG: late-onset GDM screening when sustained postprandial >140 mg/dL",
                "guideline": "ACOG Practice Bulletin 190",
            }
        return {
            "concern": rule,
            "severity": "low",
            "recommendation": "Log and re-evaluate in 48h",
            "rationale": "",
        }
