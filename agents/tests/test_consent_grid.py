"""ConsentGrid policy tests.

Privacy is the moat. These tests lock down the policy so a future
refactor can't silently turn the network into a share-everything bus.
"""
from __future__ import annotations

from vitacare.a2a.consent import ConsentGrid, can_share


def test_default_verdict_is_ask():
    grid = ConsentGrid("robert")
    # Nothing configured yet → must default to "ask" (NOT "allow").
    assert grid.get("sarah", "vitals") == "ask"
    assert grid.get("sarah", "mental_health") == "ask"


def test_allow_all_excludes_mental_health():
    grid = ConsentGrid("robert")
    grid.allow_all(with_persona="sarah")
    # Wide categories: vitals/labs/etc → allow
    assert grid.get("sarah", "vitals") == "allow"
    assert grid.get("sarah", "medications") == "allow"
    assert grid.get("sarah", "labs") == "allow"
    # mental_health stays gated even under allow_all — this is a deliberate
    # policy decision; if you "fix" it, replace this test.
    assert grid.get("sarah", "mental_health") == "ask"


def test_explicit_deny_overrides_allow_all():
    grid = ConsentGrid("emma")
    grid.allow_all(with_persona="partner")
    grid.set("partner", "labs", "deny")
    assert grid.get("partner", "vitals") == "allow"
    assert grid.get("partner", "labs") == "deny"


def test_can_share_is_strict_allow_only():
    grid = ConsentGrid("emma")
    grid.set("partner", "vitals", "allow")
    grid.set("partner", "labs", "ask")
    grid.set("partner", "mental_health", "deny")

    assert can_share(grid, "partner", "vitals") is True
    assert can_share(grid, "partner", "labs") is False        # "ask" is NOT a green light
    assert can_share(grid, "partner", "mental_health") is False
    # Unknown persona/category → unspecified → "ask" → no share.
    assert can_share(grid, "stranger", "vitals") is False


def test_snapshot_is_serialisable_for_audit_log():
    grid = ConsentGrid("robert")
    grid.allow_all(with_persona="sarah")
    grid.set("partner", "vitals", "deny")
    snap = grid.snapshot()

    assert "sarah" in snap
    assert snap["sarah"]["vitals"] == "allow"
    assert snap["partner"]["vitals"] == "deny"
