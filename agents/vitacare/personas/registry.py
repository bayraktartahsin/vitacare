"""Persona registry — each persona owns a swarm of 6 sub-agents."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from ..a2a import ConsentGrid
from ..config import settings
from ..subagents import (
    ChroniclerAgent,
    ClinicianAgent,
    ConciergeAgent,
    DiplomatAgent,
    SentinelAgent,
    VoiceAgent,
)


@dataclass
class Persona:
    id: str
    name: str
    role: str               # human-readable: "pregnant mother", "hypertensive father", "caregiver daughter"
    cohort: str             # "pregnancy" | "family" | "adult" | "senior"
    phone_e164: str = ""    # for Twilio outbound
    lang: str = "en-US"

    sentinel: SentinelAgent = field(init=False)
    chronicler: ChroniclerAgent = field(init=False)
    clinician: ClinicianAgent = field(init=False)
    concierge: ConciergeAgent = field(init=False)
    diplomat: DiplomatAgent = field(init=False)
    voice: VoiceAgent = field(init=False)
    consent: ConsentGrid = field(init=False)

    def __post_init__(self):
        self.sentinel = SentinelAgent(self.id)
        self.chronicler = ChroniclerAgent(self.id)
        self.clinician = ClinicianAgent(self.id)
        self.concierge = ConciergeAgent(self.id)
        self.consent = ConsentGrid(self.id)
        self.diplomat = DiplomatAgent(self.id, consent=self.consent)
        self.voice = VoiceAgent(self.id)

    def snapshot(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "cohort": self.cohort,
            "lang": self.lang,
            "consent_grid": self.consent.snapshot(),
        }


def _build_personas() -> list[Persona]:
    emma = Persona(
        id="emma",
        name="Emma",
        role="32 — pregnant, trimester 3, gestational diabetes risk",
        cohort="pregnancy",
        phone_e164=settings.demo_aylin_phone,
        lang="en-US",
    )
    robert = Persona(
        id="robert",
        name="Robert",
        role="60 — hypertensive father, lives in Phoenix",
        cohort="senior",
        phone_e164=settings.demo_ahmet_phone,
        lang="en-US",
    )
    sarah = Persona(
        id="sarah",
        name="Sarah",
        role="28 — caregiver daughter, lives in San Francisco",
        cohort="adult",
        phone_e164=settings.demo_selin_phone,
        lang="en-US",
    )

    # Wire the family consent mesh.
    emma.consent.allow_all(with_persona="sarah")
    emma.consent.set("partner", "vitals", "allow")
    emma.consent.set("partner", "appointments", "allow")
    robert.consent.allow_all(with_persona="sarah")
    sarah.consent.allow_all(with_persona="emma")
    sarah.consent.allow_all(with_persona="robert")

    return [emma, robert, sarah]


PERSONAS: list[Persona] = _build_personas()
_BY_ID = {p.id: p for p in PERSONAS}


def get_persona(persona_id: str) -> Persona | None:
    return _BY_ID.get(persona_id)
