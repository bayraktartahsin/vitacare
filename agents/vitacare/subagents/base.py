"""Shared base for sub-agents.

Each sub-agent wraps a Gemini model (via ADK) with a focused role + instruction.
For the hackathon we use a thin abstraction so we can swap ADK Agent for raw
google-genai if the ADK API surface differs at runtime.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class AgentEvent:
    kind: str           # "sentinel.trigger", "clinician.assessment", "a2a.send", ...
    persona: str
    payload: dict[str, Any] = field(default_factory=dict)


class BaseSubAgent:
    name: str = "base"

    def __init__(self, persona_id: str):
        self.persona_id = persona_id

    def event(self, kind: str, **payload: Any) -> AgentEvent:
        return AgentEvent(kind=f"{self.name}.{kind}", persona=self.persona_id, payload=payload)
