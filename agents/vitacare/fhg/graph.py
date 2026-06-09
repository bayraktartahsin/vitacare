"""Family Health Graph — semantic cross-person, cross-time memory.

PROD: Vertex AI Vector Search index + Firestore for structured facts.
HACKATHON: Real Gemini embeddings (``gemini-embedding-001``, 3072-d) + in-process
cosine similarity. Same retrieval behavior judges can see, no index endpoint
provisioning. The embed/recall API surface mirrors what a Vertex Vector Search
deployment would expose, so the swap to prod is a one-file change.

The graph is pre-seeded with real medical-history facts per persona so the
Clinician's grounded reasoning can be augmented with family-specific context
(e.g. Robert's father died of MI at 58 → tighter BP thresholds).
"""
from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from ..llm import client as gemini_client

logger = logging.getLogger("vitacare.fhg")

EMBED_MODEL = "gemini-embedding-001"  # 3072-d, current best


@dataclass
class Fact:
    persona: str
    text: str
    kind: str
    ts: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    meta: dict[str, Any] = field(default_factory=dict)
    embedding: list[float] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "persona": self.persona,
            "text": self.text,
            "kind": self.kind,
            "ts": self.ts.isoformat(),
            "meta": self.meta,
        }


def _cosine(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    return dot / (na * nb) if na and nb else 0.0


def _embed_one(text: str) -> list[float]:
    try:
        r = gemini_client().models.embed_content(model=EMBED_MODEL, contents=text)
        return list(r.embeddings[0].values)
    except Exception as e:  # noqa: BLE001
        logger.warning("FHG embed failed for %r: %s", text[:60], e)
        return []


class FamilyHealthGraph:
    """Cross-person, cross-time semantic memory.

    Methods mirror a vector store: ``add`` writes a fact + embedding; ``recall``
    searches by semantic similarity, optionally scoped to a persona or kind.
    """

    def __init__(self) -> None:
        self._facts: list[Fact] = []
        self._consent_predicate = None  # injected by callers if needed

    # --- writes ---------------------------------------------------------

    def add(self, fact: Fact) -> None:
        if not fact.embedding:
            fact.embedding = _embed_one(fact.text)
        self._facts.append(fact)

    def seed_family(self) -> None:
        """Pre-load realistic family-history facts so the demo has substance."""
        if self._facts:
            return
        seeds: list[Fact] = [
            Fact(persona="robert", kind="history",
                 text="Robert's father died of myocardial infarction at age 58. Family history of premature CAD."),
            Fact(persona="robert", kind="vital",
                 text="Robert's morning systolic BP has trended upward for 90 days: average 138 → 149 mmHg."),
            Fact(persona="robert", kind="med",
                 text="Robert is on amlodipine 5mg daily. Last titration April 2025."),
            Fact(persona="emma", kind="history",
                 text="Emma's mother was diagnosed with gestational diabetes during all three pregnancies. Family history of GDM."),
            Fact(persona="emma", kind="lab",
                 text="Emma week-26 OGTT borderline: fasting 92, 1h 178, 2h 152 mg/dL. Watch into trimester 3."),
            Fact(persona="emma", kind="vital",
                 text="Emma's home glucose log shows 2 postprandial spikes >140 mg/dL in the last week."),
            Fact(persona="sarah", kind="summary",
                 text="Sarah is the primary caregiver coordinator for both parents. High caregiver burden score in last self-assessment."),
            Fact(persona="sarah", kind="symptom",
                 text="Sarah logged elevated anxiety markers (mental_health, consent-locked)."),
        ]
        for f in seeds:
            self.add(f)
        logger.info("FHG seeded %d facts (3 personas)", len(seeds))

    # --- reads ----------------------------------------------------------

    def recall(self, query: str, *, persona: str | None = None, kinds: list[str] | None = None, k: int = 3) -> list[dict[str, Any]]:
        """Semantic recall — returns top-k facts by cosine similarity to ``query``.

        ``persona`` filters to a specific family member; ``kinds`` filters fact types.
        """
        q_vec = _embed_one(query)
        if not q_vec:
            return []
        scored: list[tuple[float, Fact]] = []
        for f in self._facts:
            if persona and f.persona != persona:
                continue
            if kinds and f.kind not in kinds:
                continue
            if f.kind == "symptom" and "mental_health" in f.text:
                # Respect the consent lock — mental_health stays locked unless explicit grant
                continue
            s = _cosine(q_vec, f.embedding)
            scored.append((s, f))
        scored.sort(key=lambda t: t[0], reverse=True)
        return [{"score": round(s, 3), **f.to_dict()} for s, f in scored[:k]]

    def family_pattern(self, query: str) -> list[dict[str, Any]]:
        """Recall across ALL personas — surfaces cross-generational matches."""
        return self.recall(query, persona=None, k=5)

    def cross_generational_signal(self, target_persona: str) -> list[str]:
        """Return notable cross-generational signals affecting ``target_persona``.

        Implemented as a recall across the family graph for the target's
        current relevant context, then a heuristic on returned facts.
        """
        seeds_by_persona = {
            "robert": "cardiovascular risk premature MI hypertension",
            "emma":   "gestational diabetes glucose pregnancy GDM",
            "sarah":  "caregiver burden coordination",
        }
        seed = seeds_by_persona.get(target_persona, "")
        if not seed:
            return []
        hits = self.recall(seed, persona=None, k=5)
        signals: list[str] = []
        for h in hits:
            if h["persona"] != target_persona:
                signals.append(f"family signal ({h['persona']}, score={h['score']}): {h['text']}")
        return signals


# Module-level singleton — pre-seeded lazily on first import.
_GRAPH: FamilyHealthGraph | None = None


def get_graph() -> FamilyHealthGraph:
    global _GRAPH
    if _GRAPH is None:
        _GRAPH = FamilyHealthGraph()
        try:
            _GRAPH.seed_family()
        except Exception as e:  # noqa: BLE001
            logger.warning("FHG seeding failed: %s", e)
    return _GRAPH
