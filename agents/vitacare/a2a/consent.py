"""Consent mesh — per-relationship, per-data-category permissions.

Each persona has a consent grid:
  { (from_persona, to_persona, category): "allow" | "deny" | "ask" }

The Diplomat checks this grid before passing data outbound.
"""
from __future__ import annotations

from typing import Literal

from .messages import DataCategory

Verdict = Literal["allow", "deny", "ask"]


class ConsentGrid:
    """Simple in-memory grid for the hackathon. Persists to Firestore in prod."""

    def __init__(self, owner: str):
        self.owner = owner
        self._grid: dict[tuple[str, DataCategory], Verdict] = {}

    def set(self, with_persona: str, category: DataCategory, verdict: Verdict) -> None:
        self._grid[(with_persona, category)] = verdict

    def get(self, with_persona: str, category: DataCategory) -> Verdict:
        return self._grid.get((with_persona, category), "ask")

    def allow_all(self, with_persona: str) -> None:
        for cat in ("vitals", "medications", "labs", "appointments", "symptoms", "summary"):
            self._grid[(with_persona, cat)] = "allow"  # mental_health stays "ask"

    def snapshot(self) -> dict[str, dict[str, str]]:
        out: dict[str, dict[str, str]] = {}
        for (with_p, cat), verdict in self._grid.items():
            out.setdefault(with_p, {})[cat] = verdict
        return out


def can_share(grid: ConsentGrid, with_persona: str, category: DataCategory) -> bool:
    return grid.get(with_persona, category) == "allow"
