"use client";

import { useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { PhoneCallModal } from "./PhoneCallModal";

type Event = { kind: string; data: any };

const API =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://vitacare-agents-205100594497.europe-west1.run.app"
    : "http://localhost:8080";

const PERSONA_DISPLAY: Record<string, { name: string; sub: string }> = {
  robert: { name: "Robert — Dad",  sub: "+1 (415) ███-████" },
  emma:   { name: "Emma",          sub: "+1 (212) ███-████" },
  sarah:  { name: "Sarah",         sub: "+1 (415) ███-████" },
};

const ALL_EVENT_KINDS = [
  "scenario.start", "scenario.end", "scenario.error",
  "sentinel.trigger",
  "fhg.recall", "fhg.thinking",
  "clinician.thinking", "clinician.assessment",
  "chronicler.recall",
  "concierge.gp_booked", "concierge.ob_booked", "concierge.daily_block",
  "diplomat.a2a.send", "diplomat.a2a.recv",
  "voice.thinking", "voice.draft", "voice.speak", "voice.call_placed",
];

const TITLES: Record<string, string> = {
  cascade:      "The Cascade",
  pregnancy:    "The Pregnancy",
  coordination: "The Coordination",
};

export function ScenarioRunner({ scenarioId, onClose }: { scenarioId: string; onClose: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [done, setDone] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>("Sentinel");
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
    setActiveAgent("Sentinel");

    const es = new EventSource(`${API}/scenario/${scenarioId}/stream`);

    const handler = (e: MessageEvent, kind: string) => {
      try {
        const data = JSON.parse(e.data);
        setEvents(es2 => [...es2, { kind, data }]);
        const root = kind.split(".")[0];
        setActiveAgent({
          sentinel: "Sentinel", fhg: "Family Health Graph", chronicler: "Chronicler",
          clinician: "Clinician", diplomat: "Diplomat", concierge: "Concierge",
          voice: "Voice", scenario: null,
        }[root] ?? null);

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
        if (kind === "scenario.end") { setDone(true); setActiveAgent(null); es.close(); }
      } catch {}
    };

    const fns: Array<[string, (e: MessageEvent) => void]> = ALL_EVENT_KINDS.map(kind => {
      const fn = (e: MessageEvent) => handler(e, kind);
      es.addEventListener(kind, fn as EventListener);
      return [kind, fn];
    });

    es.onerror = () => { es.close(); setDone(true); setActiveAgent(null); };

    return () => {
      fns.forEach(([k, f]) => es.removeEventListener(k, f as EventListener));
      es.close();
    };
  }, [scenarioId]);

  const title = TITLES[scenarioId] || scenarioId;
  const inFlight = !done && events.length > 0;

  return (
    <>
      <div className="rounded-2xl border border-line bg-panel2/60 backdrop-blur p-5 md:p-7 shadow-lg">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink2">
              Live trace
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-ink2">
              <span>{events.length} event{events.length === 1 ? "" : "s"}</span>
              {inFlight && activeAgent && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1.5 text-accent">
                    <span className="status-dot" />
                    <span>{activeAgent} working…</span>
                  </span>
                </>
              )}
              {done && events.length > 0 && (
                <>
                  <span>·</span>
                  <span className="text-ok">complete</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-line px-3 py-1 text-xs text-ink2 hover:bg-white/[0.04] hover:text-ink"
          >
            close
          </button>
        </div>

        {events.length === 0 && !done && (
          <div className="rounded-xl border border-dashed border-line bg-panel/40 p-8 text-center">
            <div className="status-dot mx-auto" />
            <div className="mt-3 text-sm text-ink2">Spinning up the agent swarm…</div>
            <div className="mt-1 text-[11px] text-ink2/70">
              First event arrives in a moment. Grounded reasoning + embeddings = ~15s end-to-end.
            </div>
          </div>
        )}

        <ol className="space-y-2">
          {events.map((e, i) => (
            <EventCard key={i} index={i} kind={e.kind} data={e.data} />
          ))}
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

      <style jsx>{`
        .status-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #7aa2f7;
          box-shadow: 0 0 0 0 #7aa2f7aa;
          animation: ring 1.4s ease-out infinite;
        }
        @keyframes ring {
          0%   { box-shadow: 0 0 0 0 #7aa2f7aa; transform: scale(1); }
          70%  { box-shadow: 0 0 0 10px #7aa2f700; transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 #7aa2f700; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
