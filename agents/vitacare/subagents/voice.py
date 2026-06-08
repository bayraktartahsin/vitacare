"""Voice — generates the line the agent will speak, then routes to delivery.

Two delivery modes, both pure Google:
  - speak_in_browser : the demo UI plays the line via a Gemini Live audio session
  - call_phone       : returns a call-intent payload (simulated phone modal) that
                       binds to a Gemini Live session in the browser

The line itself is drafted by Gemini Flash (in the target language) so it sounds
like the persona's family member, not a clinical alert.
"""
from __future__ import annotations

from typing import Any

from ..config import settings
from ..llm import generate
from ..mcp_clients import voice_telephony
from .base import BaseSubAgent

VOICE_SYSTEM_TR = """Sen bir kişinin VitaCare sağlık ajanısın. Aile üyelerine
sıcak, kısa, doğal ifadelerle konuşursun. Bilgilendirir, panik yaratmazsın.
Asla teşhis koymazsın, ilaç önermezsin. Karşındaki kişiyle, sanki sevdikleri
birinin sağlık asistanıymışsın gibi konuşursun. SADECE konuşulacak Türkçe
cümleyi döndür — başka açıklama yok."""

VOICE_SYSTEM_EN = """You are a VitaCare personal health agent. You speak to
family members warmly, briefly, and naturally. You inform without alarming. You
never diagnose or prescribe. Output ONLY the spoken sentence — no commentary."""


def _system_for(lang: str) -> str:
    return VOICE_SYSTEM_TR if lang.startswith("tr") else VOICE_SYSTEM_EN


class VoiceAgent(BaseSubAgent):
    name = "voice"

    def __init__(self, persona_id: str):
        super().__init__(persona_id)
        self.model = settings.gemini_model_flash
        self.live_model = settings.gemini_model_live

    async def draft(self, brief: str, lang: str = "tr-TR") -> str:
        """Use Gemini Flash to draft the natural-language line to be spoken."""
        return await generate(
            model=self.model,
            system=_system_for(lang),
            prompt=brief,
            temperature=0.6,
        )

    async def speak_in_browser(self, text: str, lang: str = "tr-TR") -> dict[str, Any]:
        """Return a payload the demo plays via Gemini Live in the browser."""
        return {
            "kind": "tts",
            "text": text,
            "lang": lang,
            "live_model": self.live_model,
        }

    async def call_phone(self, text: str, lang: str, to_e164: str) -> dict[str, Any]:
        """Open a simulated phone-call modal in the demo, bound to a Gemini Live session."""
        return await voice_telephony.outbound_call(text=text, lang=lang, to=to_e164)
