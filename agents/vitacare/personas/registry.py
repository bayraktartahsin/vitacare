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
    lang: str = "tr-TR"

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
    aylin = Persona(
        id="aylin",
        name="Aylin",
        role="32 — pregnant, trimester 3, gestational diabetes risk",
        cohort="pregnancy",
        phone_e164=settings.demo_aylin_phone,
    )
    ahmet = Persona(
        id="ahmet",
        name="Ahmet",
        role="60 — hypertensive father, lives in İzmir",
        cohort="senior",
        phone_e164=settings.demo_ahmet_phone,
    )
    selin = Persona(
        id="selin",
        name="Selin",
        role="28 — caregiver daughter, lives in İstanbul",
        cohort="adult",
        phone_e164=settings.demo_selin_phone,
    )

    # Wire the family consent mesh.
    aylin.consent.allow_all(with_persona="selin")
    aylin.consent.set("husband", "vitals", "allow")
    aylin.consent.set("husband", "appointments", "allow")
    ahmet.consent.allow_all(with_persona="selin")
    selin.consent.allow_all(with_persona="aylin")
    selin.consent.allow_all(with_persona="ahmet")

    return [aylin, ahmet, selin]


PERSONAS: list[Persona] = _build_personas()
_BY_ID = {p.id: p for p in PERSONAS}


def get_persona(persona_id: str) -> Persona | None:
    return _BY_ID.get(persona_id)
