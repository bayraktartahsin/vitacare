"""Offline smoke test — runs each scenario end-to-end and prints the event stream.

  python scripts/smoke.py            # all 3 scenarios
  python scripts/smoke.py cascade    # one scenario
"""
from __future__ import annotations

import asyncio
import json
import sys

from vitacare.scenarios import SCENARIOS


async def run_one(name: str) -> None:
    scenario = SCENARIOS[name]
    print(f"\n========== {name.upper()} ==========")
    async for ev in scenario.run():
        print(f"  • {ev.kind:30s}  {json.dumps(ev.payload, ensure_ascii=False)[:120]}")


async def main() -> None:
    names = sys.argv[1:] or list(SCENARIOS.keys())
    for n in names:
        if n not in SCENARIOS:
            print(f"unknown scenario: {n}", file=sys.stderr)
            continue
        await run_one(n)


if __name__ == "__main__":
    asyncio.run(main())
