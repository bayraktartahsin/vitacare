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

VOICE_SYSTEM_EN = """You are a VitaCare personal health agent. You speak to
family members warmly, briefly, and naturally. You inform without alarming. You
never diagnose or prescribe. Output ONLY the spoken sentence — no commentary,
no quotation marks, no preamble."""


def _system_for(lang: str) -> str:
    # Demo runs in English. Multilingual paths remain for future expansion.
    return VOICE_SYSTEM_EN


class VoiceAgent(BaseSubAgent):
    name = "voice"

    def __init__(self, persona_id: str):
        super().__init__(persona_id)
        # Pro for the spoken line — gets the family-conversation tone right.
        # Flash kicks in as fallback if Pro is overloaded.
        self.model = settings.gemini_model_pro
        self.fallback_model = settings.gemini_model_flash
        self.live_model = settings.gemini_model_live

    async def draft(self, brief: str, lang: str = "en-US") -> str:
        """Use Gemini Pro to draft the natural-language line (Flash falls back)."""
        text, _ = await generate(
            model=self.model,
            fallback_model=self.fallback_model,
            system=_system_for(lang),
            prompt=brief,
            temperature=0.7,
        )
        return text

    async def speak_in_browser(self, text: str, lang: str = "en-US") -> dict[str, Any]:
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
