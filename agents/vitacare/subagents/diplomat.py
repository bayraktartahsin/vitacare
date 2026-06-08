"""Diplomat — the A2A interface to other personas.

Outbound: drafts an A2AMessage, checks consent grid, sends to peer endpoint.
Inbound: validates consent, hands payload to the right sub-agent (Concierge,
Clinician, etc.) and returns a reply.
"""
from __future__ import annotations

import httpx

from ..a2a import A2AMessage, A2AReply, ConsentGrid, can_share
from .base import AgentEvent, BaseSubAgent


class DiplomatAgent(BaseSubAgent):
    name = "diplomat"

    def __init__(self, persona_id: str, consent: ConsentGrid, peer_endpoint: str | None = None):
        super().__init__(persona_id)
        self.consent = consent
        self.peer_endpoint = peer_endpoint or "http://localhost:8080"

    async def send(self, msg: A2AMessage) -> A2AReply:
        # consent check before any data leaves
        if msg.requires_consent and not can_share(self.consent, msg.to_persona, msg.category):
            return A2AReply(
                in_reply_to=msg.id,
                accepted=False,
                reason=f"consent denied: {msg.category} → {msg.to_persona}",
            )
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(f"{self.peer_endpoint}/a2a/handshake", json=msg.model_dump(mode="json"))
            r.raise_for_status()
            return A2AReply.model_validate(r.json())

    async def handle_inbound(self, msg: A2AMessage) -> A2AReply:
        # In a real impl this would route to the right sub-agent based on intent.
        # For the demo, we accept and let the scenario hook decide what to do.
        return A2AReply(in_reply_to=msg.id, accepted=True, payload={"received": True})

    def trace(self, msg: A2AMessage, direction: str) -> AgentEvent:
        return self.event(
            f"a2a.{direction}",
            msg_id=msg.id,
            from_persona=msg.from_persona,
            to_persona=msg.to_persona,
            intent=msg.intent,
            category=msg.category,
            subject=msg.subject,
        )
