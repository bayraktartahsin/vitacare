"use client";

import { useState } from "react";

type Citation = { title: string; uri: string };

type Props = {
  kind: string;          // e.g. "clinician.assessment"
  data: any;             // full event payload
  index: number;
  ts?: string;
};

const AGENT_META: Record<string, { icon: string; color: string; label: string }> = {
  sentinel:    { icon: "📡",  color: "#e0af68", label: "Sentinel" },
  chronicler:  { icon: "📜",  color: "#9aa1ad", label: "Chronicler" },
  clinician:   { icon: "🩺",  color: "#7aa2f7", label: "Clinician" },
  concierge:   { icon: "📅",  color: "#9ece6a", label: "Concierge" },
  diplomat:    { icon: "✉️",  color: "#f7768e", label: "Diplomat" },
  voice:       { icon: "🎙️",  color: "#bb9af7", label: "Voice" },
  fhg:         { icon: "🧬",  color: "#e0af68", label: "Family Health Graph" },
  scenario:    { icon: "▷",   color: "#9aa1ad", label: "Scenario" },
};

const PERSONA_NAMES: Record<string, string> = {
  emma:   "Emma",
  robert: "Robert",
  sarah:  "Sarah",
};

function agentOf(kind: string) {
  const root = kind.split(".")[0];
  return AGENT_META[root] || AGENT_META.scenario;
}

function describe(kind: string, data: any): string {
  switch (kind) {
    case "scenario.start":
      return data?.title || "Scenario started";
    case "scenario.end":
      return data?.summary || "Scenario complete";
    case "sentinel.trigger":
      return `${data?.rule || "trigger"} — ${data?.detail || ""}`;
    case "fhg.recall":
      return `Semantic recall over Family Health Graph: ${data?.query || ""}`;
    case "clinician.thinking":
      return "Grounding against current clinical guidelines via Google Search…";
    case "clinician.assessment":
      return data?.concern || "Clinical assessment complete";
    case "diplomat.a2a.send":
      return data?.subject || "A2A message sent";
    case "diplomat.a2a.recv":
      return data?.subject || "A2A message received";
    case "concierge.gp_booked":
    case "concierge.ob_booked":
      return `Booked: ${data?.doctor || "GP"} at ${data?.clinic || ""}`;
    case "concierge.daily_block":
      return "Calendar block created for caregiver tasks";
    case "chronicler.recall":
      return `Historical lab pulled: ${data?.panel || data?.lab_id || ""}`;
    case "voice.thinking":
      return "Drafting spoken line via Gemini 2.5 Pro…";
    case "voice.draft":
      return "Voice line drafted";
    case "voice.call_placed":
      return "Phone call placed (Cloud TTS · in-browser modal)";
    case "voice.speak":
      return "Speaking in browser";
    default:
      return data?.subject || data?.title || data?.text || data?.summary || kind;
  }
}

function isThinking(kind: string) {
  return kind.endsWith(".thinking");
}

export function EventCard({ kind, data, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const a = agentOf(kind);
  const persona = data?.persona ? PERSONA_NAMES[data.persona] || data.persona : null;
  const description = describe(kind, data);
  const thinking = isThinking(kind);

  // A2A direction tag
  const a2aDir =
    kind === "diplomat.a2a.send" && data?.to_persona
      ? `${PERSONA_NAMES[data?.from_persona] || data?.from_persona} → ${PERSONA_NAMES[data.to_persona] || data.to_persona}`
      : kind === "diplomat.a2a.recv" && data?.from
      ? `${PERSONA_NAMES[data.from] || data.from} →`
      : null;

  return (
    <li
      className="event-card group rounded-xl border border-line bg-panel p-4 transition hover:border-accent/40"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
          style={{ background: `${a.color}22`, color: a.color, border: `1px solid ${a.color}44` }}
        >
          {a.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-ink2">#{index + 1}</span>
            <span className="font-semibold" style={{ color: a.color }}>
              {a.label}
            </span>
            {persona && (
              <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-ink2">
                {persona}
              </span>
            )}
            {a2aDir && (
              <span className="rounded-full bg-bad/10 px-2 py-0.5 font-mono text-bad">
                {a2aDir}
              </span>
            )}
            {thinking && (
              <span className="flex items-center gap-1 text-ink2">
                <span className="dot" /> thinking
              </span>
            )}
          </div>

          <div className="mt-1 text-[15px] leading-snug text-ink">
            {description}
          </div>

          {/* Rich content per event type */}
          {kind === "clinician.assessment" && (
            <ClinicianBody data={data} />
          )}

          {kind === "fhg.recall" && Array.isArray(data?.hits) && (
            <FhgBody data={data} />
          )}

          {kind === "voice.draft" && data?.text && (
            <blockquote className="mt-2 rounded-lg border-l-4 border-accent/50 bg-panel2 px-3 py-2 text-sm italic text-ink">
              "{data.text}"
            </blockquote>
          )}

          {(kind === "voice.speak" || kind === "voice.call_placed") && data?.text && (
            <blockquote className="mt-2 rounded-lg border-l-4 border-accent/50 bg-panel2 px-3 py-2 text-sm italic text-ink">
              "{data.text}"
            </blockquote>
          )}

          {kind === "concierge.gp_booked" && data?.start && (
            <ConciergeBody data={data} />
          )}

          {/* Expand to show raw JSON */}
          {!thinking && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="mt-2 text-[10px] uppercase tracking-widest text-ink2 hover:text-ink"
            >
              {expanded ? "− hide raw" : "+ raw payload"}
            </button>
          )}
          {expanded && (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-bg/60 p-2 text-[10px] leading-relaxed text-ink2">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-card {
          animation: cardin 0.35s ease both;
        }
        @keyframes cardin {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 0.3; }
          50%     { opacity: 1; }
        }
      `}</style>
    </li>
  );
}

function ClinicianBody({ data }: { data: any }) {
  const sev = (data?.severity || "moderate") as "low" | "moderate" | "high";
  const sevColor = sev === "high" ? "bad" : sev === "moderate" ? "warn" : "ok";
  const citations: Citation[] = Array.isArray(data?.citations) ? data.citations : [];
  return (
    <div className="mt-2 space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className={`rounded-full bg-${sevColor}/15 px-2 py-0.5 text-[11px] uppercase tracking-widest text-${sevColor}`}>
          {sev}
        </span>
        {data?.guideline && (
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] text-ink2">
            📖 {data.guideline}
          </span>
        )}
      </div>
      {data?.recommendation && (
        <div className="text-ink">
          <span className="text-ink2 text-xs uppercase tracking-widest">Recommendation · </span>
          {data.recommendation}
        </div>
      )}
      {data?.rationale && (
        <div className="text-ink2 text-[13px] leading-relaxed">
          {data.rationale}
        </div>
      )}
      {citations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {citations.map((c, j) => {
            let host = c.title;
            try {
              if (c.uri && !host) host = new URL(c.uri).hostname;
            } catch {}
            return (
              <a
                key={j}
                href={c.uri}
                target="_blank"
                rel="noopener noreferrer"
                title={c.title || c.uri}
                className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] text-accent hover:bg-accent/20"
              >
                ↗ {host}
              </a>
            );
          })}
          <span className="text-[10px] italic text-ink2">grounded via Google Search</span>
        </div>
      )}
    </div>
  );
}

function FhgBody({ data }: { data: any }) {
  const hits: Array<{ score: number; persona: string; text: string; kind: string }> = data?.hits || [];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="text-[11px] text-ink2">{data?.store || "vector recall"}</div>
      {hits.slice(0, 3).map((h, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg bg-panel2 p-2 text-sm">
          <div className="flex w-12 shrink-0 flex-col items-center">
            <span className="font-mono text-xs text-warn">{h.score.toFixed(3)}</span>
            <div className="mt-1 h-1 w-10 rounded-full bg-line">
              <div
                className="h-full rounded-full bg-warn"
                style={{ width: `${Math.max(8, h.score * 100)}%` }}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1 text-ink">
            <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-ink2">
              {PERSONA_NAMES[h.persona] || h.persona} · {h.kind}
            </span>
            <div className="mt-1 leading-snug">{h.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConciergeBody({ data }: { data: any }) {
  const d = new Date(data.start);
  return (
    <div className="mt-2 space-y-1 rounded-lg bg-panel2 p-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-ok">📅</span>
        <span className="text-ink">
          {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}{" "}
          at {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </span>
      </div>
      {data?.notes && <div className="text-[12px] text-ink2">{data.notes}</div>}
      {data?.confirmation_id && (
        <div className="font-mono text-[11px] text-ink2">conf: {data.confirmation_id}</div>
      )}
    </div>
  );
}
