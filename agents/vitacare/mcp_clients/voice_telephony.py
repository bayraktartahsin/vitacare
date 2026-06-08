"""VoiceMCP — Twilio outbound calls.

The agent literally calls a family member's phone and speaks a Gemini-generated
message in their language. Falls back to log-only if Twilio isn't configured.
"""
from __future__ import annotations

import logging
from typing import Any
from xml.sax.saxutils import escape

from twilio.rest import Client

from ..config import settings

logger = logging.getLogger("vitacare.mcp.voice")


_LANG_VOICE = {
    "tr-TR": "Google.tr-TR-Standard-A",
    "en-US": "Google.en-US-Neural2-F",
    "ar":    "Google.ar-XA-Standard-A",
}


def _twiml(text: str, lang: str) -> str:
    voice = _LANG_VOICE.get(lang, _LANG_VOICE["en-US"])
    return (
        f'<Response><Say voice="{voice}" language="{lang}">'
        f"{escape(text)}"
        "</Say></Response>"
    )


async def outbound_call(text: str, lang: str, to: str) -> dict[str, Any]:
    if not (settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_from_number and to):
        logger.info("VoiceMCP[stub] outbound_call lang=%s to=%s text=%r", lang, to, text)
        return {"sid": "stub", "stub": True, "to": to, "lang": lang, "text": text}

    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    call = client.calls.create(
        twiml=_twiml(text, lang),
        to=to,
        from_=settings.twilio_from_number,
    )
    return {"sid": call.sid, "stub": False, "to": to, "lang": lang, "status": call.status}
