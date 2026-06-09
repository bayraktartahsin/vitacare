"""ADK Agent registry — wraps each sub-agent role as a google.adk.agents.Agent.

The challenge is built around Google's Agent Development Kit. While the
runtime hot path uses raw google-genai for fine-grained control (custom
grounding pipelines, parallel embedding batches, retry/fallback policies
ADK doesn't expose yet), the **agent identity, instructions, and sub-agent
topology are declared as ADK Agent instances** in this module.

This makes the swarm structure inspectable via ADK tooling — `parent_agent`,
`sub_agents`, instructions, model assignment — exactly the way the Agent
Development Kit models it.
"""
from __future__ import annotations

from google.adk.agents import Agent

from .config import settings

# --- Sub-agent role declarations -------------------------------------------

SENTINEL_INSTRUCTION = """You watch a person's vitals and wearable signals.
When 3+ consecutive readings cross a clinical threshold, fire a trigger.
You do not reason about treatment — that is the Clinician's job."""

CHRONICLER_INSTRUCTION = """You hold the person's longitudinal medical memory:
labs, visits, symptoms. On query, return the most relevant historical facts.
You never invent data — only surface what's been logged."""

CLINICIAN_INSTRUCTION = """You assess clinical signals using Google Search
Grounding against current guidelines (AHA/ACC, ESC/ESH, ACOG, CDC, WHO,
USPSTF). NEVER diagnose. NEVER prescribe. Always frame as 'consider seeing
a doctor'. Cite the guideline body + year explicitly."""

CONCIERGE_INSTRUCTION = """You take action via MCP tools — book GP slots,
add calendar events, request prescription refills, file insurance claims.
You execute decisions other agents made; you don't make clinical calls."""

DIPLOMAT_INSTRUCTION = """You are the A2A interface to other people's agent
swarms. Before any outbound message you check the ConsentGrid: the receiver
must have granted the data category. You speak A2A intent: alert,
request_action, share_data, coordinate, ack."""

VOICE_INSTRUCTION = """You draft the natural-language line another agent
will speak aloud. Warm, brief, family-tone. Address the recipient by their
relationship (Dad / Mom / honey). Never diagnose, never prescribe.
Output ONLY the line — no quotes, no preamble."""

FHG_INSTRUCTION = """You are the Family Health Graph — a semantic recall
layer over 3,072-d Gemini embeddings of every fact in the family. You return
top-k facts ranked by cosine similarity, respecting per-relationship +
per-data-category consent."""


def _agent(name: str, instruction: str, model: str, description: str) -> Agent:
    return Agent(
        name=name,
        description=description,
        model=model,
        instruction=instruction,
    )


# --- Per-persona swarm: 6 sub-agents under a root persona agent ------------

def build_persona_swarm(persona_id: str) -> Agent:
    """Construct one persona's swarm as a hierarchical ADK Agent.

    Returns a root persona Agent whose sub_agents are the six roles.
    """
    flash = settings.gemini_model_flash
    pro = settings.gemini_model_pro

    sentinel   = _agent(f"sentinel_{persona_id}",   SENTINEL_INSTRUCTION,   flash, "Watches wearables; fires triggers.")
    chronicler = _agent(f"chronicler_{persona_id}", CHRONICLER_INSTRUCTION, flash, "Longitudinal medical memory.")
    clinician  = _agent(f"clinician_{persona_id}",  CLINICIAN_INSTRUCTION,  pro,   "Grounded clinical reasoning.")
    concierge  = _agent(f"concierge_{persona_id}",  CONCIERGE_INSTRUCTION,  flash, "Executes actions via MCP tools.")
    diplomat   = _agent(f"diplomat_{persona_id}",   DIPLOMAT_INSTRUCTION,   flash, "A2A handshake with consent gate.")
    voice      = _agent(f"voice_{persona_id}",      VOICE_INSTRUCTION,      pro,   "Drafts the spoken family-tone line.")
    fhg        = _agent(f"fhg_{persona_id}",        FHG_INSTRUCTION,        flash, "Semantic recall over Family Health Graph.")

    root = Agent(
        name=f"vitacare_{persona_id}",
        description=f"Personal VitaCare swarm for persona '{persona_id}'.",
        model=flash,
        instruction=(
            f"You are the root coordinator of persona '{persona_id}'s VitaCare "
            "swarm. You route work to your six sub-agents and own the consent grid."
        ),
        sub_agents=[sentinel, chronicler, clinician, concierge, diplomat, voice, fhg],
    )
    return root


# Module-level registry — built once per persona.
ADK_SWARMS: dict[str, Agent] = {
    pid: build_persona_swarm(pid) for pid in ("emma", "robert", "sarah")
}


def describe_swarm(pid: str) -> dict:
    """Return a JSON-serialisable summary of a persona's swarm topology."""
    root = ADK_SWARMS[pid]
    return {
        "name": root.name,
        "description": root.description,
        "model": root.model,
        "sub_agents": [
            {"name": a.name, "model": a.model, "description": a.description}
            for a in (root.sub_agents or [])
        ],
    }
