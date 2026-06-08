"""The 3 demo scenarios. Each yields a stream of AgentEvents to the SSE endpoint."""
from .cascade import CascadeScenario
from .coordination import CoordinationScenario
from .pregnancy import PregnancyScenario

SCENARIOS = {
    "cascade": CascadeScenario(),
    "pregnancy": PregnancyScenario(),
    "coordination": CoordinationScenario(),
}

__all__ = ["SCENARIOS", "CascadeScenario", "PregnancyScenario", "CoordinationScenario"]
