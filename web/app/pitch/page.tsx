/* /pitch — 5 slides. Print-friendly (each slide forces a page break).
 * Open in a browser, hit Cmd-P → Save as PDF, you have the deck. */

const SLIDES = [
  {
    n: "01",
    eyebrow: "Problem",
    title: "Care doesn't have a coordination layer.",
    body: (
      <>
        <p className="text-xl leading-relaxed text-ink">
          40M+ unpaid caregivers in the US — ~3× across EMEA — drown in the operational debt of running their family's health.
        </p>
        <p className="mt-4 text-base text-ink2">
          Today the pregnant daughter, the hypertensive father, and the burnt-out daughter live in fragmented siloed apps. Every health AI talks <em>to</em> one person. None talk <em>between</em> people.
        </p>
        <ul className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <li className="rounded-lg border border-line bg-panel p-4">
            <div className="font-mono text-3xl font-semibold text-bad">40M</div>
            <div className="mt-1 text-ink2">unpaid family caregivers in the US alone</div>
          </li>
          <li className="rounded-lg border border-line bg-panel p-4">
            <div className="font-mono text-3xl font-semibold text-warn">~3×</div>
            <div className="mt-1 text-ink2">that across EMEA — multi-gen households are the cultural default</div>
          </li>
          <li className="rounded-lg border border-line bg-panel p-4">
            <div className="font-mono text-3xl font-semibold text-accent">0</div>
            <div className="mt-1 text-ink2">existing AI products that coordinate care between family members</div>
          </li>
        </ul>
      </>
    ),
  },
  {
    n: "02",
    eyebrow: "Solution",
    title: "VitaCare: the world's first A2A care network.",
    body: (
      <>
        <p className="text-xl leading-relaxed text-ink">
          Every family member runs a personal swarm of <strong>six agents</strong>. Their Diplomats coordinate <em>across people</em> over Google's A2A protocol. Consent-gated. Grounded. Pure Google stack.
        </p>
        <ul className="mt-6 grid grid-cols-3 gap-3 text-[13px]">
          {[
            ["📡 Sentinel", "watches vitals · fires triggers"],
            ["📜 Chronicler", "longitudinal medical memory"],
            ["🩺 Clinician", "Gemini 2.5 Pro + Google Search Grounding"],
            ["📅 Concierge", "MCP tools · Calendar · clinic · pharmacy"],
            ["✉️ Diplomat", "A2A handshake · ConsentGrid enforced"],
            ["🎙️ Voice", "Cloud TTS Chirp 3 HD · in-browser, no telephony"],
          ].map(([t, b]) => (
            <li key={t} className="rounded-lg border border-line bg-panel p-3.5">
              <div className="font-semibold text-ink">{t}</div>
              <div className="mt-1 text-ink2">{b}</div>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-lg border border-warn/30 bg-warn/5 p-4 text-sm">
          <div className="font-semibold text-warn">The moat: Family Health Graph</div>
          <div className="mt-1 text-ink">Real <strong>3,072-dimensional Gemini embeddings</strong> with cosine retrieval. Pre-seeded with cross-generational facts that visibly influence the live Clinician. On a test run the Clinician said <em>"despite being on medication"</em> because the FHG surfaced the amlodipine fact — emergent reasoning only possible because the graph is real.</div>
        </div>
      </>
    ),
  },
  {
    n: "03",
    eyebrow: "Why now / market",
    title: "The agent-to-agent protocol just opened the door.",
    body: (
      <>
        <p className="text-xl leading-relaxed text-ink">
          Google's A2A protocol turned "agents talking to each other" from a research problem into a deployable spec. Healthcare coordination is the highest-value vertical for it — and nobody has shipped it yet.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4">
          {[
            ["~$12B", "addressable family-tier subscription market (40M US caregivers × $25/mo)"],
            ["~80M", "multi-gen households across EMEA — VitaCare's culturally-native first market"],
            ["~$3T", "global eldercare market the B2B Vita Praxis path expands into"],
            ["0", "competitors shipping consumer-facing A2A healthcare coordination today"],
          ].map(([n, b]) => (
            <li key={n as string} className="rounded-lg border border-line bg-panel p-5">
              <div className="font-mono text-3xl font-semibold text-accent">{n}</div>
              <div className="mt-2 text-sm text-ink2">{b}</div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    n: "04",
    eyebrow: "Business model",
    title: "Two distribution paths. One protocol.",
    body: (
      <>
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border border-line bg-panel p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-ok">B2C · Family Tier</div>
            <div className="mt-2 text-xl font-semibold tracking-tight">$24.99 / month per household</div>
            <ul className="mt-3 space-y-2 text-sm text-ink2">
              <li>• Up to 5 family members + caregiver mode for elders</li>
              <li>• Rides on existing Vita iOS distribution (23 locales, shipping)</li>
              <li>• 1-click upgrade path from Vita's free tier</li>
              <li>• Cost per Cascade scenario: $0.009 — 95% gross margin</li>
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">B2B · Vita Praxis</div>
            <div className="mt-2 text-xl font-semibold tracking-tight">Per-seat SaaS to clinics</div>
            <ul className="mt-3 space-y-2 text-sm text-ink2">
              <li>• Doctor-side endpoint receiving A2A inbound from patient agents</li>
              <li>• Marketplace + Gemini Enterprise listing target post-hackathon</li>
              <li>• Same A2A protocol — no separate integration to build</li>
              <li>• Network effects: every clinic adds value to every patient swarm</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm">
          <strong className="text-accent">Unfair distribution advantage:</strong>{" "}
          <span className="text-ink">VitaCare doesn't need cold-start growth — it inherits Vita's existing 23-locale iOS distribution. Day-zero TAM is Vita's installed base.</span>
        </div>
      </>
    ),
  },
  {
    n: "05",
    eyebrow: "Team & traction",
    title: "Graviti Labs — already shipping health AI to 23 locales.",
    body: (
      <>
        <p className="text-xl leading-relaxed text-ink">
          Built by a team that ships. VitaCare is the agentic layer on top of an existing product family — not a cold-start.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="text-base font-semibold tracking-tight">Vita</div>
            <div className="mt-1 text-xs text-ink2">Voice + text health companion · iOS · 23 locales · shipping in production</div>
          </div>
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="text-base font-semibold tracking-tight">VitaCare <span className="text-accent">(this submission)</span></div>
            <div className="mt-1 text-xs text-ink2">Agent-to-agent care network · live demo · ~8,000 LoC · 14 pytests + CI</div>
          </div>
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="text-base font-semibold tracking-tight">Vita Praxis</div>
            <div className="mt-1 text-xs text-ink2">Doctor-facing desktop app · B2B clinic side · receives A2A handoffs</div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-line bg-panel/60 p-4 font-mono text-xs">
          <div className="text-ink2">Execution evidence (hackathon window, 3 days):</div>
          <ul className="mt-2 space-y-1 text-ink">
            <li>· ~8,000 LoC Python + TypeScript on production Cloud Run, 8+ deployed revisions</li>
            <li>· 21 google.adk.agents.Agent instances (inspectable at /adk/swarms)</li>
            <li>· Real Gemini Search Grounding citations (heart.org / escardio.org / ahajournals.org)</li>
            <li>· Real 3,072-d Gemini embeddings in the FHG, pre-seeded, deterministically influencing the live Clinician</li>
            <li>· Real Cloud TTS Chirp 3 HD audio analysed via Web Audio for a real-amplitude waveform</li>
            <li>· 14 pytests pass · GitHub Actions CI · ConsentGrid enforced at retrieval layer</li>
            <li>· min-instances=1 on both Cloud Run services for zero cold-start risk during judging</li>
          </ul>
        </div>
      </>
    ),
  },
];

export default function Pitch() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      {/* Screen-only nav */}
      <div className="screen-only sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-xs">
          <a href="/" className="text-ink2 hover:text-ink">← VitaCare</a>
          <div className="text-ink2">Pitch · 5 slides · Cmd-P to save as PDF</div>
          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent hover:bg-accent/20"
            type="button"
          >
            Save as PDF
          </button>
        </div>
      </div>

      {SLIDES.map((s) => (
        <section
          key={s.n}
          className="slide mx-auto flex max-w-5xl flex-col justify-between gap-8 px-8 py-12 md:min-h-[88vh] md:px-12 md:py-16"
        >
          <header className="flex items-baseline gap-3">
            <span className="font-mono text-sm font-semibold text-accent">{s.n}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink2">{s.eyebrow}</span>
          </header>
          <div>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{s.title}</h2>
            <div className="mt-7">{s.body}</div>
          </div>
          <footer className="flex items-end justify-between text-[11px] text-ink2/70">
            <div className="font-mono">VitaCare · {s.n} / 05</div>
            <div>github.com/bayraktartahsin/vitacare · gravitilabs.com</div>
          </footer>
        </section>
      ))}

      <style>{`
        @media print {
          .screen-only { display: none !important; }
          html, body { background: white; color: #11141b; }
          .slide { page-break-after: always; min-height: 0 !important; background: white !important; color: #11141b !important; }
          .slide * { color: #11141b !important; }
          .slide [class*="text-ink2"] { color: #475569 !important; }
          .slide [class*="text-accent"] { color: #2c5cb8 !important; }
          .slide [class*="text-bad"] { color: #b32c45 !important; }
          .slide [class*="text-warn"] { color: #b8771c !important; }
          .slide [class*="text-ok"] { color: #4a8a2c !important; }
          .slide [class*="border-line"], .slide [class*="border-warn"], .slide [class*="border-accent"] { border-color: #d4d8e0 !important; }
          .slide [class*="bg-panel"], .slide [class*="bg-warn"], .slide [class*="bg-accent"] { background: #f3f5f9 !important; }
        }
        .slide + .slide { border-top: 1px solid #1d2230; }
      `}</style>
    </main>
  );
}
