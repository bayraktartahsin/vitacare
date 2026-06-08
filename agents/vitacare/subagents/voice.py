"""Voice — Gemini Live, multilingual (TR / EN / AR).

For the demo we expose two paths:
  - speak_in_browser(text, lang): streams TTS audio to the demo web UI
  - call_phone(text, lang, to): triggers an outbound Twilio call with the text spoken aloud
"""
from __future__ import annotations

from typing import Any

from ..config import settings
from ..mcp_clients import voice_telephony
from .base import BaseSubAgent


class VoiceAgent(BaseSubAgent):
    name = "voice"

    def __init__(self, persona_id: str):
        super().__init__(persona_id)
        self.model = settings.gemini_model_live

    async def speak_in_browser(self, text: str, lang: str = "tr-TR") -> dict[str, Any]:
        """Yield a payload the web demo plays via Web Audio + Gemini Live TTS."""
        return {"kind": "tts", "text": text, "lang": lang}

    async def call_phone(self, text: str, lang: str, to_e164: str) -> dict[str, Any]:
        """Use Twilio to place an outbound call that speaks the text aloud."""
        return await voice_telephony.outbound_call(text=text, lang=lang, to=to_e164)
