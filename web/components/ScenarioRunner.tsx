"use client";

import { useEffect, useState } from "react";
import { PhoneCallModal } from "./PhoneCallModal";

type Event = { kind: string; data: any };

// Direct cross-origin to the agents service. Next.js rewrites buffer SSE
// responses, so we hit the agents URL directly. CORS on the backend is
// allow_origins=["*"] so this just works in dev (localhost) and prod alike.
const API =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://vitacare-agents-205100594497.europe-west1.run.app"
    : "http://localhost:8080";

const KIND_COLORS: Record<string, string> = {
  "sentinel.trigger": "text-warn",
  "clinician.assessment": "text-accent",
  "diplomat.a2a.send": "text-bad",
  "diplomat.a2a.recv": "text-bad",
  "concierge.gp_booked": "text-ok",
  "concierge.ob_booked": "text-ok",
  "concierge.daily_block": "text-ok",
  "chronicler.recall": "text-ink2",
  "voice.draft": "text-accent",
  "voice.call_placed": "text-accent",
  "voice.speak": "text-accent",
  "scenario.start": "text-ink2",
  "scenario.end": "text-ink2",
};

const PERSONA_DISPLAY: Record<string, { name: string; sub: string }> = {
  robert: { name: "Robert — Dad",  sub: "+1 (415) ███-████" },
  emma:   { name: "Emma",          sub: "+1 (212) ███-████" },
  sarah:  { name: "Sarah",         sub: "+1 (415) ███-████" },
};

export function ScenarioRunner({ scenarioId, onClose }: { scenarioId: string; onClose: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [done, setDone] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callPayload, setCallPayload] = useState<{
    recipient: string;
    recipientSub?: string;
    text: string;
    lang: string;
  } | null>(null);

  useEffect(() => {
    setEvents([]);
    setDone(false);
    setCallOpen(false);
    setCallPayload(null);

    // Native EventSource for SSE — more reliable than fetch+manual parsing.
    const es = new EventSource(`${API}/scenario/${scenarioId}/stream`);
    const KNOWN_EVENTS = [
      "scenario.start", "scenario.end",
      "sentinel.trigger",
      "clinician.assessment",
      "chronicler.recall",
      "concierge.gp_booked", "concierge.ob_booked", "concierge.daily_block",
      "diplomat.a2a.send", "diplomat.a2a.recv",
      "voice.draft", "voice.speak", "voice.call_placed",
    ];

    const handler = (e: MessageEvent, kind: string) => {
      try {
        const data = JSON.parse(e.data);
        setEvents((es2) => [...es2, { kind, data }]);
        if (kind === "voice.call_placed") {
          const personaId: string = data?.persona || "robert";
          const display = PERSONA_DISPLAY[personaId] || PERSONA_DISPLAY.robert;
          setCallPayload({
            recipient: display.name,
            recipientSub: display.sub,
            text: data.text,
            lang: data.lang || "en-US",
          });
          setCallOpen(true);
        }
        if (kind === "scenario.end") {
          setDone(true);
          es.close();
        }
      } catch {}
    };

    const listeners: Array<[string, (e: MessageEvent) => void]> = KNOWN_EVENTS.map((kind) => {
      const fn = (e: MessageEvent) => handler(e, kind);
      es.addEventListener(kind, fn as EventListener);
      return [kind, fn];
    });

    es.onerror = () => {
      // Connection closed by server (normal at end-of-scenario) or unreachable.
      es.close();
      setDone(true);
    };

    return () => {
      listeners.forEach(([kind, fn]) => es.removeEventListener(kind, fn as EventListener));
      es.close();
    };
  }, [scenarioId]);

  return (
    <>
      <div className="rounded-xl border border-line bg-panel2 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium uppercase tracking-wider text-ink2">
            Scenario: <span className="text-ink">{scenarioId}</span>
          </div>
          <button onClick={onClose} className="text-xs text-ink2 hover:text-ink">
            close
          </button>
        </div>
        <ol className="space-y-2 font-mono text-sm">
          {events.map((e, i) => (
            <li key={i} className="flex flex-col gap-1">
              <div className="flex gap-3">
                <span className="w-6 text-right text-ink2">{i + 1}</span>
                <span className={`w-56 shrink-0 ${KIND_COLORS[e.kind] || "text-ink2"}`}>{e.kind}</span>
                <span className="truncate text-ink">
                  {e.data?.subject ||
                    e.data?.title ||
                    e.data?.detail ||
                    e.data?.text ||
                    e.data?.recommendation ||
                    e.data?.summary ||
                    JSON.stringify(e.data).slice(0, 120)}
                </span>
              </div>
              {/* Grounded citations from Gemini's Google Search call */}
              {e.kind === "clinician.assessment" && Array.isArray(e.data?.citations) && e.data.citations.length > 0 && (
                <div className="ml-[15.5rem] flex flex-wrap gap-1.5 pl-3">
                  {e.data.citations.map((c: { title: string; uri: string }, j: number) => (
                    <a
                      key={j}
                      href={c.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={c.title}
                      className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] text-accent hover:bg-accent/20"
                    >
                      ↗ {c.title || new URL(c.uri).hostname.replace("vertexaisearch.cloud.google.com", "google grounding")}
                    </a>
                  ))}
                  <span className="text-[10px] text-ink2 italic">grounded via Google Search</span>
                </div>
              )}
            </li>
          ))}
          {done && <li className="text-xs text-ink2">— stream complete —</li>}
        </ol>
      </div>

      {callPayload && (
        <PhoneCallModal
          open={callOpen}
          recipient={callPayload.recipient}
          recipientSub={callPayload.recipientSub}
          text={callPayload.text}
          lang={callPayload.lang}
          onClose={() => setCallOpen(false)}
        />
      )}
    </>
  );
}

