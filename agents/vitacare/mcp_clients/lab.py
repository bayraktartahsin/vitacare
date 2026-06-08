"""LabMCP — mocked. Returns a structured lab timeline."""
from __future__ import annotations

from typing import Any


async def fetch(persona: str, lab_id: str) -> dict[str, Any]:
    return {
        "lab_id": lab_id,
        "date": "2026-05-12",
        "panel": "Pregnancy week 26 OGTT + CBC",
        "values": [
            {"name": "Fasting glucose", "value": 92, "unit": "mg/dL", "ref": "<95"},
            {"name": "1h post-load glucose", "value": 178, "unit": "mg/dL", "ref": "<180"},
            {"name": "2h post-load glucose", "value": 152, "unit": "mg/dL", "ref": "<155"},
            {"name": "Hemoglobin", "value": 11.4, "unit": "g/dL", "ref": "11.0-13.5"},
        ],
        "flags": ["borderline OGTT — watch into T3"],
    }
