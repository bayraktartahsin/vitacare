"""Scenario 2 — The Pregnancy.

Emma (T3, GDM risk) — postprandial glucose pattern matches early signal.
Clinician flags it, Chronicler pulls week-26 labs, Concierge books OB,
Diplomat pings the partner's agent.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from ..a2a import A2AMessage
from ..fhg import get_graph
from ..personas import get_persona
from ..subagents.base import AgentEvent
from .base import Scenario


class PregnancyScenario(Scenario):
    id = "pregnancy"

    async def run(self) -> AsyncIterator[AgentEvent]:
        emma = get_persona("emma")
        sarah = get_persona("sarah")
        assert emma and sarah

        yield AgentEvent(kind="scenario.start", persona="emma", payload={
            "title": "The Pregnancy — early GDM signal triggers cross-family coordination",
        })
        await self.beat()

        signals = [{"kind": "glucose", "value": 168, "context": "1h post-dinner"}]
        trigger = None
        async for ev in emma.sentinel.watch(signals):
            trigger = ev.payload
            yield ev
            await self.beat()

        fhg = get_graph()
        recalled = fhg.family_pattern("gestational diabetes glucose pregnancy GDM family history")
        yield AgentEvent(kind="fhg.recall", persona="emma", payload={
            "query": "GDM family history + recent glucose pattern",
            "hits": recalled,
            "store": "Gemini embedding-001 · 3072-d · cosine similarity",
        })
        await self.beat(0.3)

        assessment = await emma.clinician.assess(trigger or {}, history=recalled)
        yield AgentEvent(kind="clinician.assessment", persona="emma", payload=assessment)
        await self.beat()

        lab = await emma.concierge.pull_lab(lab_id="ogtt_w26")
        yield AgentEvent(kind="chronicler.recall", persona="emma", payload=lab)
        await self.beat()

        appt = await emma.concierge.book_gp(slot_preference="this Tuesday afternoon", reason="GDM follow-up")
        yield AgentEvent(kind="concierge.ob_booked", persona="emma", payload=appt)
        await self.beat()

        msg = A2AMessage(
            from_persona="emma",
            to_persona="sarah",
            intent="coordinate",
            category="appointments",
            subject="OB Tuesday 2:00 PM — partner-side support needed this week",
            payload={"appt": appt, "asks": ["grocery run", "no heavy lifting"]},
        )
        yield emma.diplomat.trace(msg, "send")
        await self.beat()

        brief = (
            "Draft a 1-2 sentence warm English message for Emma (32, T3 pregnant). "
            "Content: OB check-up booked for Tuesday 2pm, added to calendar, no heavy "
            "lifting this week, partner has been asked to handle groceries. Address her "
            "as 'Emma'. Keep it short and reassuring."
        )
        speech = await emma.voice.draft(brief, lang="en-US")
        ev = await emma.voice.speak_in_browser(text=speech, lang="en-US")
        yield AgentEvent(kind="voice.speak", persona="emma", payload={**ev, "text": speech})
        await self.beat()

        yield AgentEvent(kind="scenario.end", persona="emma", payload={"summary": "OB booked, partner notified, glucose pattern logged."})
