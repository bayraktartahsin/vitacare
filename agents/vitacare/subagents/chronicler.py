"""Chronicler — longitudinal medical memory.

Backed by Vertex AI Vector Search for semantic recall + Firestore for structured
fact storage. Stubs return canned data for the demo personas.
"""
from __future__ import annotations

from typing import Any

from .base import BaseSubAgent


class ChroniclerAgent(BaseSubAgent):
    name = "chronicler"

    async def recall(self, query: str) -> list[dict[str, Any]]:
        """Return relevant historical events for a query (labs, visits, symptoms)."""
        # Stub: replaced by FHG.vector_search in scenarios.
        return []

    async def store(self, fact: dict[str, Any]) -> None:
        """Persist a new fact into the persona's chronicle."""
        # Stub: writes to Firestore in prod.
        return None
