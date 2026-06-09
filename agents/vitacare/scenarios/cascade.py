"""Scenario 1 — The Cascade.

Robert's BP elevated 3 mornings in a row →
  Sentinel triggers →
  Clinician assesses (ESC guideline) →
  Diplomat sends A2A to Sarah →
  Sarah's Concierge books GP + adds calendar event →
  Voice agent calls Robert.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from ..a2a import A2AMessage
from ..fhg import get_graph
from ..personas import get_persona
from ..subagents.base import AgentEvent
from .base import Scenario


class CascadeScenario(Scenario):
    id = "cascade"

    async def run(self) -> AsyncIterator[AgentEvent]:
        robert = get_persona("robert")
        sarah = get_persona("sarah")
        assert robert and sarah

        yield AgentEvent(kind="scenario.start", persona="robert", payload={
            "title": "The Cascade — Robert's BP trend triggers a family-wide response",
        })
        await self.beat()

        signals = [
            {"kind": "bp", "systolic": 148, "diastolic": 94, "morning_n": 1},
            {"kind": "bp", "systolic": 151, "diastolic": 96, "morning_n": 2},
            {"kind": "bp", "systolic": 149, "diastolic": 95, "morning_n": 3},
        ]
        trigger = None
        async for ev in robert.sentinel.watch(signals):
            trigger = ev.payload
            yield ev
            await self.beat()

        # FHG semantic recall — pull cross-generational + longitudinal context
        # for the Clinician. Uses real Gemini embeddings (3072-d, cosine sim).
        fhg = get_graph()
        recalled = fhg.family_pattern("elevated blood pressure cardiovascular risk premature MI hypertension")
        yield AgentEvent(kind="fhg.recall", persona="robert", payload={
            "query": "elevated BP + family CV history",
            "hits": recalled,
            "store": "Gemini embedding-001 · 3072-d · cosine similarity",
        })
        await self.beat(0.3)

        assessment = await robert.clinician.assess(trigger or {}, history=recalled)
        yield AgentEvent(kind="clinician.assessment", persona="robert", payload=assessment)
        await self.beat()

        msg = A2AMessage(
            from_persona="robert",
            to_persona="sarah",
            intent="request_action",
            category="vitals",
            subject="Dad's BP elevated 3 mornings — please coordinate a GP visit",
            payload={"assessment": assessment, "trigger": trigger},
        )
        yield robert.diplomat.trace(msg, "send")
        await self.beat()

        appt = await sarah.concierge.book_gp(slot_preference="next Tuesday morning", reason="elevated BP review")
        yield AgentEvent(kind="concierge.gp_booked", persona="sarah", payload=appt)
        await self.beat()

        brief = (
            "Draft a 1-2 sentence warm message for Robert (60, dad). Content: "
            "GP appointment booked for Tuesday at 10am, daughter Sarah arranged it, "
            "because his blood pressure has been a bit elevated the last three mornings. "
            "Be reassuring, not alarming. Address him as 'Dad'. Keep it short."
        )
        speech = await robert.voice.draft(brief, lang="en-US")
        yield AgentEvent(kind="voice.draft", persona="robert", payload={"lang": "en-US", "text": speech})
        await self.beat(0.3)

        call = await robert.voice.call_phone(text=speech, lang="en-US", to_e164=robert.phone_e164)
        yield AgentEvent(kind="voice.call_placed", persona="robert", payload={
            "lang": "en-US",
            "text": speech,
            "live_session": call,
        })
        await self.beat()

        yield AgentEvent(kind="scenario.end", persona="robert", payload={"summary": "GP booked, Robert called, Sarah briefed."})
