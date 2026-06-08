"""A2A message envelope.

Wraps Google's A2A protocol primitives. Every message between Diplomats carries:
- routing (from/to persona)
- data category (so the consent grid can decide)
- payload
- correlation id (for traces)
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, Field

DataCategory = Literal[
    "vitals",          # BP, HRV, glucose, weight
    "medications",     # current meds, adherence
    "labs",            # lab results
    "appointments",    # scheduled visits
    "symptoms",        # logged symptoms
    "mental_health",   # mood, anxiety, sleep notes
    "summary",         # non-sensitive narrative summary
]

Intent = Literal[
    "alert",           # "your dad's BP is trending up"
    "request_action",  # "please book a GP slot"
    "share_data",      # "here are the lab results"
    "coordinate",      # "we both need to plan around her OB visit"
    "ack",             # acknowledgement
]


class A2AMessage(BaseModel):
    id: str = Field(default_factory=lambda: f"a2a_{uuid.uuid4().hex[:12]}")
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    from_persona: str
    to_persona: str
    intent: Intent
    category: DataCategory
    subject: str           # human-readable one-liner
    payload: dict[str, Any] = Field(default_factory=dict)
    correlation_id: str | None = None
    requires_consent: bool = True


class A2AReply(BaseModel):
    in_reply_to: str
    accepted: bool
    reason: str = ""
    payload: dict[str, Any] = Field(default_factory=dict)
    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
