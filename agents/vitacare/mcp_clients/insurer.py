"""InsurerMCP — mocked claim filer."""
from __future__ import annotations

from typing import Any


async def file(persona: str, claim: dict[str, Any]) -> dict[str, Any]:
    return {
        "claim_id": f"SGK-{persona[:3].upper()}-2026-{hash(str(claim)) & 0xFFFF:04X}",
        "status": "filed",
        "estimated_reimbursement_tl": claim.get("amount_tl", 0) * 0.85,
        "decision_eta_days": 7,
    }
