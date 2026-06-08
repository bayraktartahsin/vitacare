"""Concierge — does things via MCP tools.

Books appointments (CalendarMCP), refills meds (PharmacyMCP), files claims
(InsurerMCP), pulls lab data (LabMCP). The action-taker of the swarm.
"""
from __future__ import annotations

from typing import Any

from ..mcp_clients import calendar as cal
from ..mcp_clients import clinic, insurer, lab, pharmacy
from .base import BaseSubAgent


class ConciergeAgent(BaseSubAgent):
    name = "concierge"

    async def book_gp(self, slot_preference: str, reason: str) -> dict[str, Any]:
        appt = await clinic.book(persona=self.persona_id, when=slot_preference, reason=reason)
        await cal.add_event(
            persona=self.persona_id,
            title=f"GP visit — {reason}",
            start=appt["start"],
            duration_min=30,
            notes=appt.get("notes", ""),
        )
        return appt

    async def refill(self, med_name: str) -> dict[str, Any]:
        return await pharmacy.refill(persona=self.persona_id, med=med_name)

    async def file_claim(self, claim: dict[str, Any]) -> dict[str, Any]:
        return await insurer.file(persona=self.persona_id, claim=claim)

    async def pull_lab(self, lab_id: str) -> dict[str, Any]:
        return await lab.fetch(persona=self.persona_id, lab_id=lab_id)
