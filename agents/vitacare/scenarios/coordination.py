"""Scenario 3 — The Coordination.

Selin's morning: both parents' agents have pinged hers. Mom's flu shot is due,
Dad's lab results are back. Her swarm prepares her day in one screen.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from ..personas import get_persona
from ..subagents.base import AgentEvent
from .base import Scenario


class CoordinationScenario(Scenario):
    id = "coordination"

    async def run(self) -> AsyncIterator[AgentEvent]:
        selin = get_persona("selin")
        assert selin

        yield AgentEvent(kind="scenario.start", persona="selin", payload={
            "title": "The Coordination — Selin's caregiver morning, pre-prepped by the family network",
        })
        await self.beat()

        # 1. Inbound A2A from Dad's swarm (lab back)
        yield AgentEvent(kind="diplomat.a2a.recv", persona="selin", payload={
            "from": "ahmet",
            "intent": "share_data",
            "category": "labs",
            "subject": "Dad's lab back — lipid panel normal, creatinine slight uptick",
        })
        await self.beat()

        # 2. Inbound A2A from Mom's swarm (vaccine due)
        yield AgentEvent(kind="diplomat.a2a.recv", persona="selin", payload={
            "from": "aylin",
            "intent": "alert",
            "category": "appointments",
            "subject": "Mom's flu shot due this week",
        })
        await self.beat()

        # 3. Selin's Concierge assembles her day
        appt = await selin.concierge.book_gp(slot_preference="Tuesday 19:00", reason="call parents (block)")
        yield AgentEvent(kind="concierge.daily_block", persona="selin", payload={
            "block": appt,
            "tasks": [
                "Call Dad — walk through lab numbers",
                "Remind Mom about flu shot (or let agent call her directly)",
                "Confirm Aylin's OB at 14:00",
            ],
        })
        await self.beat()

        # 4. Voice agent offers to handle the calls itself — drafted live in English by Gemini
        brief = (
            "Selin (28, caregiver daughter) için günaydın brifing. Üç görev: "
            "annene grip aşısı hatırlat, babasının lab sonuçlarını ona açıkla, "
            "Aylin'in salı OB randevusunu onayla. "
            "Selin'e doğal ve kısa İngilizce cümlelerle hitap et. "
            "Ajan olarak aramaları senin yapabileceğini teklif et."
        )
        speech = await selin.voice.draft(brief, lang="en-US")
        ev = await selin.voice.speak_in_browser(text=speech, lang="en-US")
        yield AgentEvent(kind="voice.speak", persona="selin", payload={**ev, "text": speech})
        await self.beat()

        yield AgentEvent(kind="scenario.end", persona="selin", payload={
            "summary": "Two A2A inbounds resolved into one 7pm block; agent offered to make the calls itself.",
        })
