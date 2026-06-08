"""Scenario 3 — The Coordination.

Sarah's morning: both parents' agents have pinged hers. Mom's flu shot is due,
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
        sarah = get_persona("sarah")
        assert sarah

        yield AgentEvent(kind="scenario.start", persona="sarah", payload={
            "title": "The Coordination — Sarah's caregiver morning, pre-prepped by the family network",
        })
        await self.beat()

        yield AgentEvent(kind="diplomat.a2a.recv", persona="sarah", payload={
            "from": "robert",
            "intent": "share_data",
            "category": "labs",
            "subject": "Dad's lab back — lipid panel normal, creatinine slight uptick",
        })
        await self.beat()

        yield AgentEvent(kind="diplomat.a2a.recv", persona="sarah", payload={
            "from": "emma",
            "intent": "alert",
            "category": "appointments",
            "subject": "Mom's flu shot due this week",
        })
        await self.beat()

        appt = await sarah.concierge.book_gp(slot_preference="Tuesday 7:00 PM", reason="call parents (block)")
        yield AgentEvent(kind="concierge.daily_block", persona="sarah", payload={
            "block": appt,
            "tasks": [
                "Call Dad — walk through lab numbers",
                "Remind Mom about flu shot (or let agent call her directly)",
                "Confirm Emma's OB at 2:00 PM",
            ],
        })
        await self.beat()

        brief = (
            "Draft a 1-2 sentence warm English morning briefing for Sarah (28, caregiver daughter). "
            "Content: three things on her plate today — remind Mom about flu shot, "
            "explain Dad's lab results to him, confirm Emma's OB at 2pm. "
            "Offer that the agent can place the calls itself if she'd like. Keep it concise."
        )
        speech = await sarah.voice.draft(brief, lang="en-US")
        ev = await sarah.voice.speak_in_browser(text=speech, lang="en-US")
        yield AgentEvent(kind="voice.speak", persona="sarah", payload={**ev, "text": speech})
        await self.beat()

        yield AgentEvent(kind="scenario.end", persona="sarah", payload={
            "summary": "Two A2A inbounds resolved into one 7pm block; agent offered to make the calls itself.",
        })
