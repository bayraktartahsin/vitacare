"use client";

import { useState } from "react";
import { ScenarioRunner } from "../components/ScenarioRunner";
import { PersonaCard } from "../components/PersonaCard";

const SCENARIOS = [
  {
    id: "cascade",
    title: "The Cascade",
    blurb: "Robert's BP elevated 3 mornings → his agent reaches across the family.",
    detail: "Sentinel · FHG · Clinician (grounded) · Diplomat (A2A) · Concierge · Voice",
    cohorts: ["Senior", "Adult"],
    duration: "~30 sec",
  },
  {
    id: "pregnancy",
    title: "The Pregnancy",
    blurb: "Early GDM signal coordinates between Emma and her partner agent.",
    detail: "Sentinel · FHG · Clinician (grounded) · Chronicler · Concierge · Diplomat",
    cohorts: ["Pregnancy", "Adult"],
    duration: "~25 sec",
  },
  {
    id: "coordination",
    title: "The Coordination",
    blurb: "Two inbound A2A messages become Sarah's 7pm caregiver block.",
    detail: "Diplomat (A2A in × 2) · Concierge · Voice",
    cohorts: ["Adult", "Family"],
    duration: "~12 sec",
  },
];

const PERSONAS = [
  { id: "emma",   name: "Emma",   role: "32 — pregnant (T3)",        cohort: "Pregnancy", gradient: "from-bad to-warn" },
  { id: "robert", name: "Robert", role: "60 — hypertensive father",  cohort: "Senior",    gradient: "from-warn to-accent" },
  { id: "sarah",  name: "Sarah",  role: "28 — caregiver daughter",   cohort: "Adult",     gradient: "from-accent to-ok" },
];

const STATS = [
  { value: "6",      label: "agents per person",   sub: "Sentinel · Chronicler · Clinician · Concierge · Diplomat · Voice" },
  { value: "3,072d", label: "embeddings · FHG",    sub: "gemini-embedding-001 · cosine retrieval" },
  { value: "0",      label: "telephony providers", sub: "voice via Cloud TTS Chirp 3 HD, in-browser" },
  { value: "100%",   label: "Google stack",        sub: "no third-party AI, no Twilio" },
];

export default function Home() {
  const [scenario, setScenario] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  const runScenario = (id: string) => {
    setScenario(id);
    setRunId(r => r + 1);
    setTimeout(() => {
      document.getElementById("trace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Cinematic background — radial glow + subtle grid */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,rgba(122,162,247,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_110%,rgba(187,154,247,0.14),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 md:px-10 md:pt-20">
        {/* HERO */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-ink2 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Google for Startups AI Agents Challenge · Track 1
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-ink via-accent to-[#bb9af7] bg-clip-text text-transparent">
              VitaCare
            </span>
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <span>★</span> the world's first agent-to-agent care network
          </p>
          <p className="mt-5 max-w-2xl text-xl leading-snug text-ink2 md:text-2xl">
            <span className="text-ink">One AI per person.</span>{" "}
            <span className="text-ink">A network for the people you love.</span>
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink2/80">
            Every family member runs a personal swarm of six health agents. Their Diplomats coordinate across people over Google's A2A protocol. Their Clinicians ground in real Google Search results. Their Voice agents call them — in-browser, in real audio.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/diagram"
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/15 hover:gap-3"
            >
              <span>↗</span> Architecture
            </a>
            <a
              href="/pitch"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-sm font-medium text-ink2 transition hover:text-ink"
            >
              <span>↗</span> 5-slide pitch
            </a>
            <a
              href="/praxis"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-sm font-medium text-ink2 transition hover:text-ink"
            >
              <span>↗</span> B2B side (Vita Praxis)
            </a>
            <a
              href="https://github.com/bayraktartahsin/vitacare"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-sm font-medium text-ink2 transition hover:text-ink"
            >
              <span>↗</span> GitHub
            </a>
          </div>

          {/* TRUST STRIP */}
          <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-panel/50 p-5 backdrop-blur md:grid-cols-4">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-mono text-2xl font-semibold text-ink md:text-3xl">{s.value}</div>
                <div className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-accent">{s.label}</div>
                <div className="mt-1 text-[11px] leading-tight text-ink2">{s.sub}</div>
              </div>
            ))}
          </div>
        </header>

        {/* THE FAMILY */}
        <section className="mb-16">
          <SectionHeader n="01" eyebrow="The family" title="Three personas. Six agents each." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PERSONAS.map(p => (
              <PersonaCard key={p.id} {...p} />
            ))}
          </div>
        </section>

        {/* SCENARIOS */}
        <section className="mb-14">
          <SectionHeader n="02" eyebrow="Run a scenario" title="Pick a scenario. Watch the agents coordinate." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                data-testid={`scenario-${s.id}`}
                onClick={() => runScenario(s.id)}
                className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-6 text-left transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em]">
                  <span className="text-ink2">{s.cohorts.join(" · ")}</span>
                  <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-ink2">{s.duration}</span>
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">{s.title}</div>
                <div className="mt-2 text-sm leading-snug text-ink2">{s.blurb}</div>
                <div className="mt-4 truncate font-mono text-[10px] text-ink2/70">{s.detail}</div>
                <div className="mt-5 flex items-center gap-1 text-xs text-accent transition group-hover:gap-2">
                  Run scenario <span>→</span>
                </div>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 transition group-hover:bg-accent/10" />
              </button>
            ))}
          </div>
        </section>

        {scenario && (
          <section id="trace" className="mt-12 scroll-mt-8">
            <ScenarioRunner key={`${scenario}-${runId}`} scenarioId={scenario} onClose={() => setScenario(null)} />
          </section>
        )}

        {/* SAFETY & COMPLIANCE */}
        <section className="mt-14">
          <SectionHeader n="03" eyebrow="Safety & compliance" title="Healthcare-grade by design, from day one." />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SafetyCard
              icon="🚫"
              title="Never diagnoses"
              body="The Clinician agent is hard-bounded to 'consider seeing a doctor.' It surfaces guideline citations, never a diagnosis. Inherited from Vita's shipping iOS safety pipeline."
            />
            <SafetyCard
              icon="🛡"
              title="ConsentGrid enforced at protocol layer"
              body="Per-relationship × per-data-category permissions on every A2A handshake. Mental-health facts stay locked at the retrieval layer, not just at the UI. Verified by 14 pytest tests in the repo."
            />
            <SafetyCard
              icon="📜"
              title="Auditable everything"
              body="Every A2A message carries an envelope (from / to / intent / category / id) and is JSON-serialisable for the audit log. Every Clinician assessment carries clickable Google Search Grounding citations."
            />
          </div>
        </section>

        {/* TEAM / CREDIBILITY */}
        <section className="mt-14 rounded-2xl border border-line bg-panel/40 p-6 backdrop-blur md:p-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-accent">04</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink2">Who's behind this</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Graviti Labs */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold tracking-tight">Graviti Labs</div>
                <span className="rounded-full bg-ink2/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink2">studio</span>
              </div>
              <div className="mt-1.5 text-sm leading-relaxed text-ink2">
                Independent software studio. Builds and ships consumer + B2B health products end-to-end — iOS, web, desktop, infra. The team behind Vita, Vita Praxis, and VitaCare.
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["iOS · Swift", "Web · Next.js", "Desktop · Tauri", "Backend · Node + Python", "Cloud Run"].map(t => (
                  <span key={t} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-ink2">{t}</span>
                ))}
              </div>
            </div>

            {/* Vita */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold tracking-tight">Vita</div>
                <span className="rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ok">live · shipping</span>
              </div>
              <div className="mt-1.5 text-sm leading-relaxed text-ink2">
                Voice + text health companion. <strong className="text-ink">Live on the iOS App Store in 23 locales.</strong> Covers the four cohorts (Pregnancy / Baby / Adult / Senior) and the safety pipeline (never diagnose, never prescribe) that VitaCare's Clinician inherits directly.
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <a href="https://vitamedas.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  vitamedas.com ↗
                </a>
                <span className="text-ink2/50">·</span>
                <span className="text-ink2 font-mono">iOS · 23 locales</span>
              </div>
            </div>

            {/* Vita Praxis */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold tracking-tight">Vita Praxis</div>
                <span className="rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-warn">prototype</span>
              </div>
              <div className="mt-1.5 text-sm leading-relaxed text-ink2">
                Doctor-facing desktop sibling — currently in active prototype. Designed as the clinic-side endpoint that will receive VitaCare's A2A handoffs on the same protocol — no separate integration to build.
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                <a href="/praxis" className="text-accent hover:underline">/praxis mock ↗</a>
                <span className="text-ink2/50">·</span>
                <span className="text-ink2 font-mono">desktop · Tauri</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-ink2">
            VitaCare is a net-new submission for the Google for Startups AI Agents Challenge 2026 — the agentic coordination layer on top of Graviti Labs' existing health-AI product family. Source-available on GitHub for judging. © 2026 Graviti Labs.
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 border-t border-line pt-8 text-xs text-ink2">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              Built by Graviti Labs · 2026 ·{" "}
              <a className="text-accent hover:underline" href="https://github.com/bayraktartahsin/vitacare" target="_blank" rel="noopener noreferrer">
                github
              </a>{" "}
              ·{" "}
              <a className="text-accent hover:underline" href="/diagram">architecture</a>{" "}
              ·{" "}
              <a className="text-accent hover:underline" href="/pitch">pitch</a>{" "}
              ·{" "}
              <a className="text-accent hover:underline" href="/praxis">praxis</a>{" "}
              ·{" "}
              <a className="text-accent hover:underline" href="https://vitamedas.com" target="_blank" rel="noopener noreferrer">vita</a>
            </div>
            <div className="font-mono text-[10px]">
              Gemini 2.5 Pro · 2.5 Flash · Live · Embedding-001 · Cloud TTS · ADK · A2A · MCP · Vertex AI · Cloud Run
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function SafetyCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-base font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-[13px] leading-relaxed text-ink2">{body}</div>
    </div>
  );
}

function SectionHeader({ n, eyebrow, title }: { n: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-semibold text-accent">{n}</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink2">{eyebrow}</span>
      </div>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}
