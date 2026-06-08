"""Scenario base — yields AgentEvents that the SSE endpoint streams to the demo UI."""
from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncIterator

from ..subagents.base import AgentEvent

log = logging.getLogger("vitacare.scenario")


class Scenario:
    id: str = "base"

    async def run(self) -> AsyncIterator[AgentEvent]:
        raise NotImplementedError

    @staticmethod
    async def beat(seconds: float = 0.6) -> None:
        await asyncio.sleep(seconds)


def safe_event(scenario_id: str, persona: str, label: str, err: Exception) -> AgentEvent:
    """Wrap an upstream error as a visible event so the SSE stream stays open."""
    log.warning("scenario=%s step=%s persona=%s error=%s", scenario_id, label, persona, err)
    return AgentEvent(
        kind="scenario.error",
        persona=persona,
        payload={"step": label, "error": str(err)[:200]},
    )
