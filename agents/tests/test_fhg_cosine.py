"""Family Health Graph — cosine math + retrieval-policy tests.

These don't hit Gemini (we inject precomputed vectors) so they run fast and
deterministic in CI. They lock down the math, the consent filter, and the
top-k ordering — i.e. everything that decides which fact reaches the
Clinician's prompt.
"""
from __future__ import annotations

import asyncio

import pytest

from vitacare.fhg.graph import Fact, FamilyHealthGraph, _cosine


def test_cosine_known_vectors():
    assert _cosine([1.0, 0.0], [1.0, 0.0]) == pytest.approx(1.0)
    assert _cosine([1.0, 0.0], [0.0, 1.0]) == pytest.approx(0.0)
    # Anti-parallel
    assert _cosine([1.0, 0.0], [-1.0, 0.0]) == pytest.approx(-1.0)


def test_cosine_handles_empty_or_mismatched():
    assert _cosine([], [1.0]) == 0.0
    assert _cosine([1.0], []) == 0.0
    assert _cosine([1.0, 2.0], [1.0]) == 0.0


def _make_graph_with_facts() -> FamilyHealthGraph:
    """Build a graph with deterministic precomputed embeddings — no Gemini calls."""
    g = FamilyHealthGraph()
    g.add_local(Fact(persona="robert", text="hypertension on amlodipine",          kind="med",     embedding=[1.0, 0.0, 0.0]))
    g.add_local(Fact(persona="robert", text="father MI at 58",                     kind="history", embedding=[0.9, 0.4, 0.0]))
    g.add_local(Fact(persona="emma",   text="GDM family history",                  kind="history", embedding=[0.0, 1.0, 0.0]))
    g.add_local(Fact(persona="sarah",  text="anxiety log (mental_health locked)",  kind="symptom", embedding=[0.0, 0.0, 1.0]))
    return g


def test_recall_top_k_orders_by_similarity(monkeypatch):
    g = _make_graph_with_facts()

    # Patch the query embedder to return a vector pointing at Robert's first fact
    from vitacare.fhg import graph as graph_mod
    async def fake_embed(_text):
        return [1.0, 0.0, 0.0]
    monkeypatch.setattr(graph_mod, "_embed_one", fake_embed)

    hits = asyncio.run(g.recall("any query", k=3))
    assert len(hits) == 3
    # First hit must be the most similar = Robert hypertension
    assert hits[0]["text"].startswith("hypertension")
    # Sort order is descending by score
    assert hits[0]["score"] >= hits[1]["score"] >= hits[2]["score"]


def test_recall_respects_mental_health_consent_lock(monkeypatch):
    """Even if the query vector aligns with Sarah's anxiety fact, the retrieval
    layer must drop facts marked as symptom + containing 'mental_health'."""
    g = _make_graph_with_facts()
    from vitacare.fhg import graph as graph_mod
    async def fake_embed(_text):
        return [0.0, 0.0, 1.0]  # Aligned with Sarah's locked anxiety fact
    monkeypatch.setattr(graph_mod, "_embed_one", fake_embed)

    hits = asyncio.run(g.recall("anxiety", k=5))
    texts = " ".join(h["text"] for h in hits)
    assert "mental_health" not in texts
    assert "anxiety" not in texts


def test_recall_persona_filter(monkeypatch):
    g = _make_graph_with_facts()
    from vitacare.fhg import graph as graph_mod
    async def fake_embed(_text):
        return [1.0, 0.0, 0.0]
    monkeypatch.setattr(graph_mod, "_embed_one", fake_embed)

    hits = asyncio.run(g.recall("any", persona="robert", k=10))
    assert all(h["persona"] == "robert" for h in hits)
    assert len(hits) >= 1


def test_recall_falls_back_when_embedding_fails(monkeypatch):
    """If the embedding call returns empty (timeout / 503), recall must NOT
    hang or raise. It returns recent facts so the scenario keeps moving."""
    g = _make_graph_with_facts()
    from vitacare.fhg import graph as graph_mod
    async def fake_embed(_text):
        return []  # simulate timeout
    monkeypatch.setattr(graph_mod, "_embed_one", fake_embed)

    hits = asyncio.run(g.recall("any", k=2))
    assert len(hits) == 2
    assert all(h["score"] == 0.0 for h in hits)
