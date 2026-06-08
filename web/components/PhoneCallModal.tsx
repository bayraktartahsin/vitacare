"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  recipient: string;          // e.g. "Ahmet — Baba"
  recipientSub?: string;      // e.g. "+90 532 ███ ██ ██"
  text: string;
  lang: string;               // "tr-TR" | "en-US"
  translationEn?: string;
  onClose: () => void;
};

const API =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://vitacare-agents-205100594497.europe-west1.run.app"
    : "http://localhost:8080";

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(1, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PhoneCallModal({ open, recipient, recipientSub, text, lang, translationEn, onClose }: Props) {
  const [state, setState] = useState<"ringing" | "connected" | "ended">("ringing");
  const [seconds, setSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setState("ringing");
    setSeconds(0);
    setAudioUrl(null);

    let cancelled = false;
    (async () => {
      // ring for ~2s, then switch to connected + play audio
      await new Promise((r) => setTimeout(r, 1800));
      if (cancelled) return;

      // fetch the Cloud TTS audio
      try {
        const res = await fetch(`${API}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang }),
        });
        if (!res.ok) throw new Error("tts failed");
        const blob = await res.blob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("connected");
      } catch (e) {
        // fall back to silent connected state so the demo still tells the story
        if (!cancelled) setState("connected");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, text, lang]);

  // Tick the duration once connected
  useEffect(() => {
    if (state !== "connected") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  // Auto-play the audio when ready
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  function endCall() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setState("ended");
    setTimeout(onClose, 400);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="relative h-[640px] w-[320px] overflow-hidden rounded-[44px] bg-gradient-to-b from-[#0d0f15] via-[#1a1f2b] to-[#0d0f15] shadow-2xl ring-1 ring-white/10">
        {/* iPhone notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-32 -translate-x-1/2 rounded-full bg-black"></div>

        {/* Status bar */}
        <div className="absolute left-0 right-0 top-3 z-10 flex justify-between px-7 text-[11px] font-medium text-white/90">
          <span>{new Date().toTimeString().slice(0, 5)}</span>
          <span className="flex items-center gap-1">
            <span>●●●●</span>
            <span>VitaCare</span>
            <span>100%</span>
          </span>
        </div>

        {/* Body */}
        <div className="flex h-full flex-col items-center justify-between px-8 pb-8 pt-20 text-white">
          {/* Top — recipient */}
          <div className="flex flex-col items-center">
            <div className="text-xs uppercase tracking-widest text-white/50">
              {state === "ringing" ? "ringing…" : state === "connected" ? "connected" : "call ended"}
            </div>
            <div className="mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-semibold">
              {initials(recipient)}
            </div>
            <div className="mt-4 text-2xl font-semibold">{recipient}</div>
            {recipientSub && <div className="mt-1 text-sm text-white/60">{recipientSub}</div>}
            <div className="mt-3 font-mono text-base text-white/80">
              {state === "ringing" ? <Dots /> : state === "connected" ? fmt(seconds) : fmt(seconds)}
            </div>
          </div>

          {/* Middle — caption & waveform */}
          <div className="mt-6 w-full">
            {state === "connected" && (
              <>
                <Waveform />
                <div className="mt-4 max-h-32 overflow-y-auto rounded-2xl bg-white/[0.04] p-3 text-center text-sm leading-relaxed text-white">
                  {text}
                </div>
                {translationEn && (
                  <div className="mt-2 text-center text-xs italic text-white/50">
                    {translationEn}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom — call controls */}
          <div className="mt-4 flex w-full items-center justify-around">
            <Btn icon="🔇" label="mute" disabled />
            <button
              onClick={endCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition active:scale-95"
              aria-label="end call"
            >
              <span className="rotate-[135deg] text-2xl">📞</span>
            </button>
            <Btn icon="🔊" label="speaker" disabled />
          </div>
        </div>

        {/* Powered-by chip */}
        <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-white/40">
          Google Cloud TTS · No telephony
        </div>

        {/* The actual audio element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} hidden />}
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

function Waveform() {
  return (
    <div className="flex h-12 items-end justify-center gap-1">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
          style={{
            height: `${20 + Math.abs(Math.sin(i * 0.6)) * 60}%`,
            animation: "vw 1.4s ease-in-out infinite",
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes vw {
          0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

function Btn({ icon, label, disabled }: { icon: string; label: string; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="flex flex-col items-center gap-1 text-white/60 disabled:opacity-40"
      aria-label={label}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl">
        {icon}
      </span>
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}
