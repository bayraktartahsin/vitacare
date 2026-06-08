"""Scenario base — yields AgentEvents that the SSE endpoint streams to the demo UI."""
from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator

from ..subagents.base import AgentEvent


class Scenario:
    id: str = "base"

    async def run(self) -> AsyncIterator[AgentEvent]:
        raise NotImplementedError

    @staticmethod
    async def beat(seconds: float = 0.6) -> None:
        """Tiny pause so the demo UI has time to render each event."""
        await asyncio.sleep(seconds)
