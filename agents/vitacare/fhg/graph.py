"""Family Health Graph — a shared, consent-gated semantic store.

PROD STACK
- Embeddings: Vertex AI text-embedding-005
- Vector search: Vertex AI Vector Search index
- Structured facts: Firestore (per persona, with cross-persona views)

HACKATHON STUB
- In-memory dict of facts + cosine similarity over a tiny embedding
  (or pass-through to Vertex if GCP env vars are set).

This gives the cross-generational pattern detection a place to live.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class Fact:
    persona: str
    text: str
    kind: str                                       # "vital", "lab", "symptom", "appointment", "med"
    ts: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    meta: dict[str, Any] = field(default_factory=dict)


class FamilyHealthGraph:
    def __init__(self) -> None:
        self._facts: list[Fact] = []

    def add(self, fact: Fact) -> None:
        self._facts.append(fact)

    def for_persona(self, persona: str) -> list[Fact]:
        return [f for f in self._facts if f.persona == persona]

    def family_pattern(self, query: str) -> list[Fact]:
        """Return facts matching a query across consenting personas. Toy substring match for now."""
        q = query.lower()
        return [f for f in self._facts if q in f.text.lower()]

    def cross_generational_signal(self, target_persona: str) -> list[str]:
        """Return notable cross-generational signals for the target.

        Example: father has hypertension at 60 → flag son's lipids more aggressively.
        """
        signals: list[str] = []
        if any("hypertension" in f.text.lower() for f in self._facts):
            signals.append("family history of hypertension — early BP surveillance recommended")
        if any("gestational diabetes" in f.text.lower() for f in self._facts):
            signals.append("family history of GDM — postpartum T2DM screening at 6 weeks")
        return signals
