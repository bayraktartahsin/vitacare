"""ClinicMCP — mocked.

Returns a believable next-available slot for a given clinic/specialty.
In production: wraps Vita Praxis (the doctor-side product) so booking
is a real A2A handoff to the clinician's agent.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any


async def book(persona: str, when: str, reason: str) -> dict[str, Any]:
    # Pick "Tuesday 10:00" by default for demo determinism.
    base = datetime.now().replace(hour=10, minute=0, second=0, microsecond=0)
    days_until_tue = (1 - base.weekday()) % 7 or 7
    slot = base + timedelta(days=days_until_tue)
    return {
        "clinic": "Acıbadem Maslak",
        "doctor": "Dr. Eylül Kaya, GP",
        "start": slot.isoformat(),
        "duration_min": 30,
        "reason": reason,
        "notes": f"Booked autonomously by VitaCare for {persona}. Reason: {reason}",
        "confirmation_id": f"AC-{persona[:3].upper()}-{slot.strftime('%Y%m%d%H%M')}",
    }
