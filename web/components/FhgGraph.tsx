"use client";

/**
 * Live SVG visualization of the Family Health Graph.
 *
 * Renders three person-nodes (Emma · Robert · Sarah) and eight pre-seeded
 * fact-nodes orbiting their owners. When an FHG `recall` event lands with
 * top-k hits, the matched fact nodes glow + pulse, and edges between
 * matched facts get a cosine-weighted opacity. Makes the "graph" in
 * Family Health Graph visible, not just stated.
 */

import { useEffect, useState } from "react";

type Hit = { persona: string; text: string; kind: string; score: number };

const FACT_SEEDS = [
  { id: "r1", persona: "robert", text: "father MI at 58 · premature CAD",          short: "father MI at 58",     kind: "history" },
  { id: "r2", persona: "robert", text: "morning systolic BP trend 138 → 149 mmHg", short: "BP 138 → 149",        kind: "vital" },
  { id: "r3", persona: "robert", text: "amlodipine 5mg daily · since April 2025",  short: "amlodipine 5mg",      kind: "med" },
  { id: "e1", persona: "emma",   text: "mother had GDM × 3 pregnancies",           short: "mother GDM ×3",       kind: "history" },
  { id: "e2", persona: "emma",   text: "week-26 OGTT borderline · 92/178/152",     short: "OGTT borderline",     kind: "lab" },
  { id: "e3", persona: "emma",   text: "2 postprandial spikes >140 last week",     short: "2 spikes >140",       kind: "vital" },
  { id: "s1", persona: "sarah",  text: "caregiver coordinator · both parents",     short: "caregiver burden",    kind: "summary" },
  { id: "s2", persona: "sarah",  text: "anxiety log (mental_health, locked)",      short: "🔒 locked",            kind: "symptom" },
];

const PERSONAS = [
  { id: "emma",   name: "Emma",   color: "#f7768e", x: 220, y: 110 },
  { id: "robert", name: "Robert", color: "#e0af68", x: 600, y: 110 },
  { id: "sarah",  name: "Sarah",  color: "#9ece6a", x: 410, y: 320 },
];

// Pre-computed orbit positions for facts (around their persona)
const FACT_POS: Record<string, { x: number; y: number }> = {
  r1: { x: 700, y: 50  },
  r2: { x: 700, y: 170 },
  r3: { x: 590, y: 200 },
  e1: { x: 120, y: 50  },
  e2: { x: 120, y: 170 },
  e3: { x: 230, y: 200 },
  s1: { x: 310, y: 360 },
  s2: { x: 510, y: 360 },
};

type Props = {
  hits?: Hit[];   // facts that matched the most recent recall (with score)
  query?: string;
};

export function FhgGraph({ hits = [], query }: Props) {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!hits.length) return;
    // Match by text substring (the hit text is the full FHG fact text)
    const ids = new Set<string>();
    const sc: Record<string, number> = {};
    for (const h of hits) {
      const seed = FACT_SEEDS.find(f => h.text?.startsWith(f.text.slice(0, 30)) || h.text === f.text);
      if (seed) { ids.add(seed.id); sc[seed.id] = h.score; }
    }
    setActiveIds(ids);
    setScores(sc);
    const t = setTimeout(() => setActiveIds(new Set()), 6000);
    return () => clearTimeout(t);
  }, [hits]);

  return (
    <div className="rounded-2xl border border-line bg-panel/50 p-4 backdrop-blur">
      <div className="mb-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em]">
        <span className="font-semibold text-accent">Family Health Graph</span>
        <span className="font-mono text-ink2">gemini-embedding-001 · 3,072d · cosine</span>
      </div>
      {query && (
        <div className="mb-1.5 font-mono text-[10.5px] text-ink2">query: <span className="text-ink">{query}</span></div>
      )}
      <svg viewBox="0 0 800 420" className="h-[260px] w-full">
        <defs>
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7aa2f7" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges: persona ↔ fact */}
        {FACT_SEEDS.map(f => {
          const p = PERSONAS.find(p => p.id === f.persona)!;
          const pos = FACT_POS[f.id];
          const isActive = activeIds.has(f.id);
          return (
            <line
              key={`e-${f.id}`}
              x1={p.x} y1={p.y} x2={pos.x} y2={pos.y}
              stroke={isActive ? "#e0af68" : "#2a3040"}
              strokeWidth={isActive ? 1.6 : 0.8}
              strokeOpacity={isActive ? 0.8 : 0.45}
            />
          );
        })}

        {/* Cross-person A2A edges (always faint, hint at network) */}
        {[["emma","robert"], ["robert","sarah"], ["sarah","emma"]].map(([a, b]) => {
          const pa = PERSONAS.find(p => p.id === a)!;
          const pb = PERSONAS.find(p => p.id === b)!;
          return (
            <line
              key={`a2a-${a}-${b}`}
              x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke="#f7768e"
              strokeOpacity="0.18"
              strokeWidth="1.4"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Fact nodes */}
        {FACT_SEEDS.map(f => {
          const pos = FACT_POS[f.id];
          const isActive = activeIds.has(f.id);
          const p = PERSONAS.find(p => p.id === f.persona)!;
          return (
            <g key={f.id} transform={`translate(${pos.x}, ${pos.y})`}>
              {isActive && (
                <circle r="22" fill="url(#halo)">
                  <animate attributeName="r" values="18;26;18" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                r={isActive ? 8 : 5}
                fill={isActive ? p.color : "#161a23"}
                stroke={p.color}
                strokeWidth={isActive ? 1.5 : 1}
                strokeOpacity={isActive ? 1 : 0.5}
                filter={isActive ? "url(#glow)" : undefined}
              />
              <text
                x={pos.x > 400 ? 12 : -12}
                y={4}
                textAnchor={pos.x > 400 ? "start" : "end"}
                fontSize="10.5"
                fill={isActive ? "#e7e9ee" : "#9aa1ad"}
                fontWeight={isActive ? 600 : 400}
              >
                {f.short}
              </text>
              {isActive && scores[f.id] !== undefined && (
                <text
                  x={pos.x > 400 ? 12 : -12}
                  y={16}
                  textAnchor={pos.x > 400 ? "start" : "end"}
                  fontSize="9"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill="#e0af68"
                >
                  cosine {scores[f.id].toFixed(3)}
                </text>
              )}
            </g>
          );
        })}

        {/* Person nodes (rendered last so they sit on top) */}
        {PERSONAS.map(p => (
          <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
            <circle r="22" fill="#11141b" stroke={p.color} strokeWidth="2" />
            <text textAnchor="middle" y="-30" fontSize="11" fontWeight="600" fill="#e7e9ee">
              {p.name}
            </text>
            <text textAnchor="middle" y="5" fontSize="13" fontWeight="700" fill={p.color}>
              {p.name[0]}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-ink2">
        <span><span className="inline-block h-2 w-3 -translate-y-px rounded-sm bg-[#e0af68] mr-1" /> matched fact</span>
        <span><span className="inline-block h-px w-4 -translate-y-1 bg-[#f7768e] mr-1" /> A2A link</span>
        <span><span className="inline-block h-px w-4 -translate-y-1 bg-ink2/40 mr-1" /> persona ↔ fact</span>
        <span className="ml-auto font-mono text-[9.5px]">8 facts · 3 personas · 11 edges</span>
      </div>
    </div>
  );
}
