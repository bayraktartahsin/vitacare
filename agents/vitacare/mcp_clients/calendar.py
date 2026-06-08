"""CalendarMCP — wraps Google Calendar API.

For the demo we use a Google service-account or OAuth refresh token bound to
the demo caregiver's calendar. The "agent booked a Tuesday 10am" demo moment
shows up as a real event in a real Google Calendar.
"""
from __future__ import annotations

import logging
from typing import Any

from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

from ..config import settings

logger = logging.getLogger("vitacare.mcp.calendar")


def _client():
    if not settings.google_oauth_refresh_token:
        return None
    creds = Credentials(
        token=None,
        refresh_token=settings.google_oauth_refresh_token,
        client_id=settings.google_oauth_client_id,
        client_secret=settings.google_oauth_client_secret,
        token_uri="https://oauth2.googleapis.com/token",
    )
    return build("calendar", "v3", credentials=creds, cache_discovery=False)


async def add_event(persona: str, title: str, start: str, duration_min: int, notes: str = "") -> dict[str, Any]:
    """Add a calendar event. Falls back to log-only if no OAuth configured (so demo still runs offline)."""
    svc = _client()
    if not svc:
        logger.info("CalendarMCP[stub] add_event persona=%s title=%s start=%s", persona, title, start)
        return {"id": f"stub_{persona}_{start}", "stub": True, "title": title, "start": start}

    from datetime import datetime, timedelta
    start_dt = datetime.fromisoformat(start)
    end_dt = start_dt + timedelta(minutes=duration_min)
    body = {
        "summary": f"[VitaCare] {title}",
        "description": notes,
        "start": {"dateTime": start_dt.isoformat(), "timeZone": "Europe/Istanbul"},
        "end": {"dateTime": end_dt.isoformat(), "timeZone": "Europe/Istanbul"},
    }
    event = svc.events().insert(calendarId="primary", body=body).execute()
    return {"id": event["id"], "stub": False, "htmlLink": event.get("htmlLink")}
