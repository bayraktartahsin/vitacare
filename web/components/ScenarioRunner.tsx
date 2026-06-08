"use client";

import { useEffect, useState } from "react";

type Event = { kind: string; data: any };

const API = process.env.NEXT_PUBLIC_AGENT_API || "http://localhost:8080";

const KIND_COLORS: Record<string, string> = {
  "sentinel.trigger": "text-warn",
  "clinician.assessment": "text-accent",
  "diplomat.a2a.send": "text-bad",
  "diplomat.a2a.recv": "text-bad",
  "concierge.gp_booked": "text-ok",
  "concierge.ob_booked": "text-ok",
  "concierge.daily_block": "text-ok",
  "chronicler.recall": "text-ink2",
  "voice.call_placed": "text-accent",
  "voice.speak": "text-accent",
  "scenario.start": "text-ink2",
  "scenario.end": "text-ink2",
};

export function ScenarioRunner({ scenarioId, onClose }: { scenarioId: string; onClose: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setEvents([]);
    setDone(false);
    const url = `${API}/scenario/${scenarioId}/run`;
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(url, { method: "POST", signal: ctrl.signal });
        if (!res.body) return;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() || "";
          for (const part of parts) {
            const lines = part.split("\n");
            const evLine = lines.find((l) => l.startsWith("event: "));
            const dataLine = lines.find((l) => l.startsWith("data: "));
            if (evLine && dataLine) {
              try {
                const kind = evLine.slice(7).trim();
                const data = JSON.parse(dataLine.slice(6));
                setEvents((es) => [...es, { kind, data }]);
              } catch {}
            }
          }
        }
      } catch (e) {
        // network / CORS — surface a friendly placeholder so the demo still tells a story
        setEvents([
          { kind: "demo.note", data: { msg: "agent backend not reachable — showing canned trace" } },
        ]);
      } finally {
        setDone(true);
      }
    })();

    return () => ctrl.abort();
  }, [scenarioId]);

  return (
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
          <li key={i} className="flex gap-3">
            <span className="w-6 text-right text-ink2">{i + 1}</span>
            <span className={`w-56 shrink-0 ${KIND_COLORS[e.kind] || "text-ink2"}`}>
              {e.kind}
            </span>
            <span className="truncate text-ink">
              {e.data?.subject ||
                e.data?.title ||
                e.data?.detail ||
                e.data?.text ||
                e.data?.summary ||
                JSON.stringify(e.data).slice(0, 120)}
            </span>
          </li>
        ))}
        {done && (
          <li className="text-xs text-ink2">— stream complete —</li>
        )}
      </ol>
    </div>
  );
}
