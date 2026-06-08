"""Scenario 2 — The Pregnancy.

Aylin (T3, GDM risk) — postprandial glucose pattern matches early signal.
Clinician flags, Chronicler pulls week-26 labs, Concierge books OB,
Diplomat pings husband's agent (in this demo we coordinate with Selin
as proxy for the partner agent, since Selin is the third configured persona).
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from ..a2a import A2AMessage
from ..personas import get_persona
from ..subagents.base import AgentEvent
from .base import Scenario


class PregnancyScenario(Scenario):
    id = "pregnancy"

    async def run(self) -> AsyncIterator[AgentEvent]:
        aylin = get_persona("aylin")
        selin = get_persona("selin")
        assert aylin and selin

        yield AgentEvent(kind="scenario.start", persona="aylin", payload={
            "title": "The Pregnancy — early GDM signal triggers cross-family coordination",
        })
        await self.beat()

        # 1. Sentinel detects postprandial glucose spike
        signals = [{"kind": "glucose", "value": 168, "context": "1h post-dinner"}]
        trigger = None
        async for ev in aylin.sentinel.watch(signals):
            trigger = ev.payload
            yield ev
            await self.beat()

        # 2. Clinician assesses against ACOG guidance
        assessment = await aylin.clinician.assess(trigger or {}, history=[])
        yield AgentEvent(kind="clinician.assessment", persona="aylin", payload=assessment)
        await self.beat()

        # 3. Chronicler pulls last month's OGTT
        lab = await aylin.concierge.pull_lab(lab_id="ogtt_w26")
        yield AgentEvent(kind="chronicler.recall", persona="aylin", payload=lab)
        await self.beat()

        # 4. Concierge books OB
        appt = await aylin.concierge.book_gp(slot_preference="this Tuesday afternoon", reason="GDM follow-up")
        yield AgentEvent(kind="concierge.ob_booked", persona="aylin", payload=appt)
        await self.beat()

        # 5. Diplomat pings the partner agent (proxied by Selin in this 3-persona demo)
        msg = A2AMessage(
            from_persona="aylin",
            to_persona="selin",
            intent="coordinate",
            category="appointments",
            subject="OB Tuesday 14:00 — partner-side support needed this week",
            payload={"appt": appt, "asks": ["grocery run", "no heavy lifting"]},
        )
        yield aylin.diplomat.trace(msg, "send")
        await self.beat()

        # 6. Voice in TR — drafted live by Gemini
        brief = (
            "Aylin (32, hamile T3) için 1-2 cümlelik sıcak bir Türkçe mesaj hazırla. "
            "İçerik: salı 14:00 OB kontrolü takvime eklendi, bu hafta ağır şey kaldırma, "
            "eşi market alışverişini halledecek. Ona 'Aylinciğim' diye hitap et, kısa tut."
        )
        speech_tr = await aylin.voice.draft(brief, lang="tr-TR")
        ev = await aylin.voice.speak_in_browser(text=speech_tr, lang="tr-TR")
        yield AgentEvent(kind="voice.speak", persona="aylin", payload={
            **ev,
            "text": speech_tr,
        })
        await self.beat()

        yield AgentEvent(kind="scenario.end", persona="aylin", payload={"summary": "OB booked, partner notified, glucose pattern logged."})
