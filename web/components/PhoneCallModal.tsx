"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  recipient: string;
  recipientSub?: string;
  text: string;
  lang: string;
  onClose: () => void;
};

const API =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://vitacare-agents-205100594497.europe-west1.run.app"
    : "http://localhost:8080";

function fmt(s: number) {
  const m = Math.floor(s / 60).toString();
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

function initials(name: string) {
  return name.split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

export function PhoneCallModal({ open, recipient, recipientSub, text, lang, onClose }: Props) {
  const [state, setState] = useState<"ringing" | "connected" | "ended">("ringing");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(new Array(40).fill(0.1));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  // Load TTS + ring
  useEffect(() => {
    if (!open) return;
    setState("ringing");
    setSeconds(0);
    setAudioUrl(null);
    setMuted(false);
    setLevels(new Array(40).fill(0.1));

    let cancelled = false;
    (async () => {
      await new Promise(r => setTimeout(r, 1800));
      if (cancelled) return;
      try {
        const res = await fetch(`${API}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang }),
        });
        if (!res.ok) throw new Error("tts");
        const blob = await res.blob();
        if (cancelled) return;
        setAudioUrl(URL.createObjectURL(blob));
        setState("connected");
      } catch {
        if (!cancelled) setState("connected");
      }
    })();
    return () => { cancelled = true; };
  }, [open, text, lang]);

  // Timer
  useEffect(() => {
    if (state !== "connected") return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  // Hook up Web Audio analyser when audio is ready
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = muted ? 0 : 1;
    audio.play().catch(() => {});
    try {
      if (!acRef.current) {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        acRef.current = new Ctx();
      }
      const ac = acRef.current!;
      const src = ac.createMediaElementSource(audio);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 128;
      src.connect(analyser);
      analyser.connect(ac.destination);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        // Down-sample to ~40 bars
        const N = 40;
        const step = Math.floor(data.length / N);
        const arr: number[] = [];
        for (let i = 0; i < N; i++) {
          let v = 0;
          for (let j = 0; j < step; j++) v += data[i * step + j] || 0;
          arr.push((v / step) / 255);
        }
        setLevels(arr);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // already-connected MediaElementSource (rebuild not possible) — fallback to fake animation
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [audioUrl, muted]);

  function toggleMute() {
    setMuted(m => {
      if (audioRef.current) audioRef.current.volume = m ? 1 : 0;
      return !m;
    });
  }

  function endCall() {
    audioRef.current?.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setState("ended");
    setTimeout(onClose, 300);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[400px_360px]">
        {/* iPhone */}
        <div className="relative h-[720px] w-[360px] overflow-hidden rounded-[48px] bg-gradient-to-b from-[#0e1118] via-[#1b1f2c] to-[#0a0c11] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
          {/* Side gleam */}
          <div className="pointer-events-none absolute inset-y-0 -left-px w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 -right-px w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

          {/* Notch */}
          <div className="absolute left-1/2 top-2.5 z-20 h-7 w-36 -translate-x-1/2 rounded-full bg-black" />

          {/* Status bar */}
          <div className="absolute left-0 right-0 top-3.5 z-10 flex justify-between px-9 text-[11px] font-semibold text-white/90">
            <span>{new Date().toTimeString().slice(0, 5)}</span>
            <span className="flex items-center gap-1.5">
              <span>●●●●●</span>
              <span className="text-[10px]">VitaCare</span>
              <span>100%</span>
            </span>
          </div>

          <div className="flex h-full flex-col items-center justify-between px-9 pb-10 pt-24 text-white">
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/60">
                {state === "ringing" ? "ringing…" : state === "connected" ? "connected" : "call ended"}
              </div>
              <div className="relative mt-5">
                <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 blur-xl" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-4xl font-semibold shadow-lg">
                  {initials(recipient)}
                </div>
              </div>
              <div className="mt-5 text-3xl font-semibold tracking-tight">{recipient}</div>
              {recipientSub && <div className="mt-1 font-mono text-[12px] text-white/55">{recipientSub}</div>}
              <div className="mt-3 font-mono text-base text-white/80">
                {state === "ringing" ? <Dots /> : fmt(seconds)}
              </div>
            </div>

            <div className="w-full">
              {state === "connected" && (
                <>
                  <RealtimeWaveform levels={levels} />
                  <div className="mt-5 max-h-44 overflow-y-auto rounded-2xl bg-white/[0.06] p-3.5 text-center text-[13px] leading-relaxed text-white shadow-inner">
                    {text}
                  </div>
                </>
              )}
            </div>

            <div className="flex w-full items-center justify-around">
              <CallBtn
                icon={muted ? "🔇" : "🎙"}
                label={muted ? "muted" : "mute"}
                active={muted}
                onClick={toggleMute}
                disabled={state !== "connected"}
              />
              <button
                onClick={endCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30 transition active:scale-95"
                aria-label="end call"
              >
                <span className="rotate-[135deg] text-2xl leading-none">📞</span>
              </button>
              <CallBtn icon="🔊" label="speaker" disabled />
            </div>
          </div>

          <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/[0.06] px-3 py-1 text-[9.5px] font-medium uppercase tracking-[0.25em] text-white/55">
            Google Cloud TTS · Chirp 3 HD · No telephony
          </div>

          {audioUrl && <audio ref={audioRef} src={audioUrl} hidden />}
        </div>

        {/* Side panel — "what the agent did" */}
        <div className="hidden h-[720px] flex-col rounded-2xl border border-white/10 bg-panel/70 p-5 backdrop-blur md:flex">
          <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink2">Reasoning chain</div>
          <div className="mt-2 text-lg font-semibold tracking-tight text-ink">Why this call exists</div>
          <ol className="mt-5 space-y-3 text-[12.5px] leading-relaxed text-ink">
            {[
              ["📡", "Sentinel", "detected 3 consecutive elevated morning BP readings (148/151/149 mmHg)"],
              ["🧬", "Family Health Graph", "recalled premature paternal MI + current amlodipine (cosine 0.69 / 0.51)"],
              ["🩺", "Clinician", "grounded in AHA/ACC 2025 — flagged Stage 2 hypertension despite medication"],
              ["✉️", "Diplomat", "sent consent-gated A2A → Sarah (category: vitals)"],
              ["📅", "Concierge", "booked Dr. Emily Carter at Northwell, Tue 10:00 AM"],
              ["🎙", "Voice", "drafted the spoken line above with Gemini 2.5 Pro"],
            ].map(([icon, agent, what], i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-px text-base">{icon}</span>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-accent">{agent}</div>
                  <div className="mt-0.5 text-ink">{what}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto rounded-xl border border-line bg-panel2 p-3 text-[11px] text-ink2">
            <div className="font-semibold text-ink">No telephony provider was contacted.</div>
            <div className="mt-1">The audio you hear is generated by Google Cloud Text-to-Speech (Chirp 3 HD), streamed into a browser audio element, and analysed via Web Audio for the live waveform.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80 [animation-delay:200ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80 [animation-delay:400ms]" />
    </span>
  );
}

function RealtimeWaveform({ levels }: { levels: number[] }) {
  return (
    <div className="flex h-14 items-end justify-center gap-[3px] rounded-xl">
      {levels.map((v, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-400/80 to-purple-400/90 transition-[height] duration-100 ease-out"
          style={{ height: `${Math.max(6, v * 100)}%`, opacity: 0.6 + v * 0.4 }}
        />
      ))}
    </div>
  );
}

function CallBtn({
  icon, label, disabled, active, onClick,
}: { icon: string; label: string; disabled?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 disabled:opacity-40 ${active ? "text-red-300" : "text-white/70"}`}
      aria-label={label}
    >
      <span className={`flex h-13 w-13 items-center justify-center rounded-full text-xl transition ${active ? "bg-red-500/30 ring-1 ring-red-400" : "bg-white/10 hover:bg-white/15"}`} style={{ width: 52, height: 52 }}>
        {icon}
      </span>
      <span className="text-[9px] uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
