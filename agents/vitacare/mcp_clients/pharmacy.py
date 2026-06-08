"""PharmacyMCP — mocked. Prescription refill + interaction check."""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any


async def refill(persona: str, med: str) -> dict[str, Any]:
    return {
        "med": med,
        "quantity": "30 tablets",
        "ready_at": (datetime.now() + timedelta(hours=4)).isoformat(),
        "pharmacy": "Selvi Eczanesi, Beşiktaş",
        "interaction_check": "no clinically significant interactions found",
    }


async def interaction_check(persona: str, meds: list[str]) -> dict[str, Any]:
    return {"meds": meds, "interactions": [], "verdict": "safe"}
