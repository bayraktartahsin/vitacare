"""A2A envelope tests — the contract every Diplomat-to-Diplomat
handshake must satisfy. Locked down so a refactor can't silently
break the consent / category / intent guarantees."""
from __future__ import annotations

import json

from vitacare.a2a.messages import A2AMessage, A2AReply


def test_message_has_envelope_fields():
    m = A2AMessage(
        from_persona="robert",
        to_persona="sarah",
        intent="request_action",
        category="vitals",
        subject="Dad's BP elevated 3 mornings — please coordinate a GP visit",
    )
    assert m.id.startswith("a2a_")
    assert m.from_persona == "robert"
    assert m.to_persona == "sarah"
    assert m.intent == "request_action"
    assert m.category == "vitals"
    assert m.requires_consent is True


def test_message_is_json_serialisable_for_audit_log():
    m = A2AMessage(
        from_persona="emma",
        to_persona="partner",
        intent="coordinate",
        category="appointments",
        subject="OB Tuesday 2pm",
        payload={"asks": ["grocery run", "no heavy lifting"]},
    )
    blob = m.model_dump_json()
    parsed = json.loads(blob)
    assert parsed["from_persona"] == "emma"
    assert parsed["category"] == "appointments"
    assert parsed["payload"]["asks"] == ["grocery run", "no heavy lifting"]


def test_reply_carries_correlation():
    m = A2AMessage(
        from_persona="robert",
        to_persona="sarah",
        intent="request_action",
        category="vitals",
        subject="test",
    )
    r = A2AReply(in_reply_to=m.id, accepted=False, reason="consent denied: vitals → sarah")
    assert r.in_reply_to == m.id
    assert r.accepted is False
    assert "consent denied" in r.reason
