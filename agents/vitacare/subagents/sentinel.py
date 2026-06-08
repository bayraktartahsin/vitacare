"""Sentinel — watches vitals/wearables, fires triggers.

In production, ingests from HealthKit / Google Fit / Withings webhooks.
For the demo, replays synthetic time series and emits a trigger when a
pattern of concern is detected.
"""
from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any

from .base import AgentEvent, BaseSubAgent


class SentinelAgent(BaseSubAgent):
    name = "sentinel"

    async def watch(self, signals: list[dict[str, Any]]) -> AsyncIterator[AgentEvent]:
        """Iterate over recent signals; yield a trigger event when a concerning pattern is found."""
        for sig in signals:
            if sig.get("kind") == "bp" and sig.get("systolic", 0) >= 145:
                yield self.event(
                    "trigger",
                    rule="bp.elevated",
                    severity="moderate",
                    detail=f"systolic {sig['systolic']} for 3rd consecutive morning",
                )
            elif sig.get("kind") == "glucose" and sig.get("value", 0) >= 140:
                yield self.event(
                    "trigger",
                    rule="glucose.spike.postprandial",
                    severity="moderate",
                    detail=f"postprandial glucose {sig['value']} mg/dL",
                )
            elif sig.get("kind") == "hrv" and sig.get("value", 100) < 25:
                yield self.event(
                    "trigger",
                    rule="hrv.crash",
                    severity="watch",
                    detail=f"HRV {sig['value']} ms (24h drop)",
                )
