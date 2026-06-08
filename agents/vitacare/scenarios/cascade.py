"""Scenario 1 — The Cascade.

Ahmet's BP elevated 3 mornings in a row →
  Sentinel triggers →
  Clinician assesses (ESC guideline) →
  Diplomat sends A2A to Selin →
  Selin's Concierge books GP + adds calendar event →
  Voice agent calls Ahmet in Turkish.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from ..a2a import A2AMessage
from ..personas import get_persona
from ..subagents.base import AgentEvent
from .base import Scenario


class CascadeScenario(Scenario):
    id = "cascade"

    async def run(self) -> AsyncIterator[AgentEvent]:
        ahmet = get_persona("ahmet")
        selin = get_persona("selin")
        assert ahmet and selin

        yield AgentEvent(kind="scenario.start", persona="ahmet", payload={
            "title": "The Cascade — Ahmet's BP trend triggers a family-wide response",
        })
        await self.beat()

        # 1. Sentinel sees 3 elevated morning BPs
        signals = [
            {"kind": "bp", "systolic": 148, "diastolic": 94, "morning_n": 1},
            {"kind": "bp", "systolic": 151, "diastolic": 96, "morning_n": 2},
            {"kind": "bp", "systolic": 149, "diastolic": 95, "morning_n": 3},
        ]
        trigger = None
        async for ev in ahmet.sentinel.watch(signals):
            trigger = ev.payload
            yield ev
            await self.beat()

        # 2. Clinician assesses
        assessment = await ahmet.clinician.assess(trigger or {}, history=[])
        yield AgentEvent(kind="clinician.assessment", persona="ahmet", payload=assessment)
        await self.beat()

        # 3. Diplomat reaches out via A2A to Selin
        msg = A2AMessage(
            from_persona="ahmet",
            to_persona="selin",
            intent="request_action",
            category="vitals",
            subject="Dad's BP elevated 3 mornings — please coordinate a GP visit",
            payload={"assessment": assessment, "trigger": trigger},
        )
        yield ahmet.diplomat.trace(msg, "send")
        await self.beat()

        # 4. Selin's Concierge books the GP
        appt = await selin.concierge.book_gp(slot_preference="next Tuesday morning", reason="elevated BP review")
        yield AgentEvent(kind="concierge.gp_booked", persona="selin", payload=appt)
        await self.beat()

        # 5. Voice agent calls Ahmet in Turkish
        speech_tr = (
            f"Babacığım, doktorla salı saat 10'da görüşeceksin. "
            f"Selin ayarladı, sen sadece git. Tansiyonun son üç sabah biraz yüksekti, "
            f"bunu konuşmak için. Bir şey unutma diye birkaç soru hazırladım, telefonuna gönderdim."
        )
        call = await ahmet.voice.call_phone(text=speech_tr, lang="tr-TR", to_e164=ahmet.phone_e164)
        yield AgentEvent(kind="voice.call_placed", persona="ahmet", payload={
            "lang": "tr-TR",
            "text": speech_tr,
            "live_session": call,
            "translation_en": (
                "Dad, you have a doctor's appointment Tuesday at 10. Selin arranged it, "
                "just go. Your BP was a bit high the last three mornings, that's what it's for. "
                "I prepared a few questions so you don't forget anything, sent them to your phone."
            ),
        })
        await self.beat()

        yield AgentEvent(kind="scenario.end", persona="ahmet", payload={"summary": "GP booked, Ahmet called, Selin briefed."})
