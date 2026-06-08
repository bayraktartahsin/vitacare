"use client";

import { useState } from "react";
import { ScenarioRunner } from "../components/ScenarioRunner";
import { PersonaCard } from "../components/PersonaCard";

const SCENARIOS = [
  {
    id: "cascade",
    title: "The Cascade",
    blurb: "Father's BP triggers a family-wide response. The agent calls Dad — Cloud TTS in-browser.",
    cohorts: ["Senior", "Adult"],
  },
  {
    id: "pregnancy",
    title: "The Pregnancy",
    blurb: "Early GDM signal coordinates between mother and partner agent.",
    cohorts: ["Pregnancy", "Adult"],
  },
  {
    id: "coordination",
    title: "The Coordination",
    blurb: "Two inbound A2A messages collapse into one 7pm caregiver block.",
    cohorts: ["Adult", "Family"],
  },
];

const PERSONAS = [
  { id: "emma",   name: "Emma",   role: "32 — pregnant (T3)",        cohort: "Pregnancy" },
  { id: "robert", name: "Robert", role: "60 — hypertensive father",  cohort: "Senior" },
  { id: "sarah",  name: "Sarah",  role: "28 — caregiver daughter",   cohort: "Adult" },
];

export default function Home() {
  const [scenario, setScenario] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  const runScenario = (id: string) => {
    setScenario(id);
    setRunId((r) => r + 1);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-10">
        <div className="text-xs uppercase tracking-widest text-ink2">
          Google for Startups AI Agents Challenge · EMEA · Track 1
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">VitaCare</h1>
        <p className="mt-1 text-lg text-ink2">
          The Agent-to-Agent Care Network — one AI per person, a network for the people you love.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-ink2">The family</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PERSONAS.map((p) => (
            <PersonaCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-ink2">Scenarios</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              data-testid={`scenario-${s.id}`}
              onClick={() => runScenario(s.id)}
              className="rounded-xl border border-line bg-panel p-5 text-left transition hover:border-accent"
            >
              <div className="text-xs uppercase tracking-widest text-ink2">
                {s.cohorts.join(" · ")}
              </div>
              <div className="mt-2 text-xl font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-ink2">{s.blurb}</div>
              <div className="mt-4 text-xs text-accent">Run scenario →</div>
            </button>
          ))}
        </div>
      </section>

      {scenario && (
        <section className="mt-10">
          <ScenarioRunner key={`${scenario}-${runId}`} scenarioId={scenario} onClose={() => setScenario(null)} />
        </section>
      )}

      <footer className="mt-16 border-t border-line pt-6 text-xs text-ink2">
        Built by{" "}
        <a className="text-accent hover:underline" href="https://gravitilabs.com">
          Graviti Labs
        </a>{" "}
        · Gemini · ADK · A2A · MCP · Vertex AI · Cloud Run · Cloud TTS ·{" "}
        <span className="text-ok">100% Google stack</span>
      </footer>
    </main>
  );
}
