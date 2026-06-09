/* /praxis — Vita Praxis B2B mock screen.
 * The doctor-side endpoint receiving Robert's A2A inbound.
 * Proves the monetization path is real, not hand-wavy. */

export default function Praxis() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-xs">
          <a href="/" className="text-ink2 hover:text-ink">← VitaCare</a>
          <div className="text-ink2">Vita Praxis · B2B sibling · the doctor-side endpoint</div>
          <a href="https://github.com/bayraktartahsin/vitacare" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">github</a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <header className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-ink2">VITA PRAXIS · B2B</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">The clinic side of the network.</h1>
          <p className="mt-2 max-w-3xl text-base text-ink2">
            VitaCare's Diplomat sends a consent-gated A2A message. <strong>Vita Praxis is the receiving endpoint on the clinician's side.</strong> Same A2A protocol, same ConsentGrid semantics, no separate integration to build. This is the B2B SaaS path — and why the network has real two-sided economics.
          </p>
        </header>

        {/* Mock app frame */}
        <div className="overflow-hidden rounded-2xl border border-line bg-panel/80 shadow-lg">
          {/* macOS chrome */}
          <div className="flex items-center gap-2 border-b border-line bg-panel2 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <div className="ml-4 flex items-center gap-2 text-xs text-ink2">
              <span className="font-semibold text-ink">Vita Praxis</span>
              <span>·</span>
              <span>Dr. Emily Carter, GP · Northwell Health · Downtown</span>
            </div>
            <div className="ml-auto font-mono text-[10px] text-ink2">Mon · 10:14 AM</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="border-b border-line bg-panel2/60 p-4 md:border-b-0 md:border-r">
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink2">Today</div>
              <div className="mt-2 space-y-2 text-sm">
                <a className="block rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-ink">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Robert Hayes</span>
                    <span className="font-mono text-[10px] text-accent">NEW · A2A</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink2">10:00 · BP review · referred by family</div>
                </a>
                <div className="rounded-lg bg-panel/60 px-3 py-2">
                  <div className="text-sm">Maria Lopez</div>
                  <div className="text-[11px] text-ink2">10:45 · annual physical</div>
                </div>
                <div className="rounded-lg bg-panel/60 px-3 py-2">
                  <div className="text-sm">James Park</div>
                  <div className="text-[11px] text-ink2">11:30 · medication review</div>
                </div>
                <div className="rounded-lg bg-panel/60 px-3 py-2">
                  <div className="text-sm">Anya Volkov</div>
                  <div className="text-[11px] text-ink2">1:15 · GDM follow-up</div>
                </div>
              </div>
              <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink2">A2A inbound</div>
              <div className="mt-2 space-y-2 text-[11px]">
                <div className="rounded bg-bad/10 px-2 py-1.5 text-bad">
                  <span className="font-mono">↘ vitals</span> · from Robert Hayes
                </div>
                <div className="rounded bg-panel/60 px-2 py-1.5 text-ink2">
                  <span className="font-mono">↘ labs</span> · 4 · pending review
                </div>
              </div>
            </aside>

            {/* Main panel — Robert's referral */}
            <section className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent">A2A inbound · vitals</div>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">Robert Hayes · 60M</h2>
                  <div className="mt-1 text-sm text-ink2">Referred by family-side agent (Sarah Hayes, daughter) · 4 minutes ago</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full bg-ok/15 px-3 py-1.5 text-xs font-semibold text-ok">Accept</button>
                  <button className="rounded-full border border-line px-3 py-1.5 text-xs text-ink2">Defer</button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-line bg-panel p-4 text-sm">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-warn">Triggered signal</div>
                  <div className="mt-1.5 text-ink">3 consecutive elevated morning systolic readings:</div>
                  <div className="mt-2 font-mono text-base">148 · 151 · 149 mmHg</div>
                  <div className="mt-1 text-[11px] text-ink2">Sentinel-detected · 90-day trend 138 → 149</div>
                </div>
                <div className="rounded-lg border border-line bg-panel p-4 text-sm">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-accent">Clinical assessment</div>
                  <div className="mt-1.5 text-ink">
                    Persistently elevated BP; Stage 2 HTN. <span className="text-ink2">Reasoning despite current medication.</span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-ink2">Cited: <a className="text-accent hover:underline" href="#">AHA/ACC 2025 Hypertension Guideline</a></div>
                </div>
                <div className="rounded-lg border border-line bg-panel p-4 text-sm">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-warn">Cross-generational context (FHG)</div>
                  <ul className="mt-1.5 space-y-1 text-ink">
                    <li>· Father died of myocardial infarction at 58 — premature CAD</li>
                    <li>· Patient on amlodipine 5mg daily since April 2025</li>
                    <li>· No prior hospitalisations for cardiovascular events</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-line bg-panel p-4 text-sm">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-ok">Pre-booked encounter</div>
                  <div className="mt-1.5 text-ink">Tuesday · 10:00 AM · Room 4B</div>
                  <div className="mt-1 text-[11px] text-ink2">Auto-booked by patient-side Concierge · confirmation AC-SAR-202606161000</div>
                  <div className="mt-2 text-[11px] text-ink2">Patient acknowledged: <span className="text-ink">via Voice agent — Cloud TTS call placed</span></div>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-bad/30 bg-bad/5 p-4 text-sm">
                <div className="font-semibold text-bad">Recommended pre-visit prep</div>
                <ul className="mt-1.5 space-y-1 text-ink">
                  <li>· Confirm home-cuff calibration · ask about morning routine + caffeine</li>
                  <li>· Consider second-line agent if amlodipine alone is insufficient (AHA/ACC 2025 §6.3)</li>
                  <li>· Order: BMP, lipid panel, urinalysis with albumin/creatinine ratio</li>
                  <li>· Family-history-weighted CV risk score: elevated (FHG cosine 0.69 to father MI fact)</li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[11px] text-ink2">
                <div>A2A envelope · <span className="font-mono">{`{ from: robert, to: sarah, intent: request_action, category: vitals, consent: granted }`}</span></div>
                <div>Powered by VitaCare · A2A protocol · ConsentGrid v1</div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-panel/50 p-5 text-sm">
          <div className="text-[10px] font-medium uppercase tracking-widest text-accent">What you just saw</div>
          <div className="mt-1.5 text-ink">
            The same A2A handshake that drives the family-side phone call <strong>also delivers a fully briefed case to the clinician on the receiving end</strong> — Stage 2 HTN flag, AHA/ACC citation, cross-generational FHG context, pre-booked encounter, recommended pre-visit prep. The clinic doesn't build a separate integration; they're already on the protocol the moment they install Vita Praxis. That's the B2B path and that's why every clinic added compounds the network value for every family.
          </div>
        </div>
      </div>
    </main>
  );
}
