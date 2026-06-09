type Props = {
  id: string;
  name: string;
  role: string;
  cohort: string;
  gradient: string;
};

const COHORT_COLOR: Record<string, string> = {
  Pregnancy: "bg-bad/15 text-bad ring-bad/30",
  Senior:    "bg-warn/15 text-warn ring-warn/30",
  Adult:     "bg-ok/15 text-ok ring-ok/30",
  Family:    "bg-accent/15 text-accent ring-accent/30",
};

const SUBAGENTS = ["Sentinel", "Chronicler", "Clinician", "Concierge", "Diplomat", "Voice"];

export function PersonaCard({ id, name, role, cohort, gradient }: Props) {
  const initial = name[0];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-6 transition-all hover:border-ink2/40">
      {/* Soft halo */}
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition group-hover:opacity-20`} />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl font-semibold text-white shadow-md`}
        >
          {initial}
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest ring-1 ${COHORT_COLOR[cohort] || ""}`}>
          {cohort}
        </span>
      </div>

      <div className="relative mt-4 text-2xl font-semibold tracking-tight">{name}</div>
      <div className="relative mt-1 text-sm text-ink2">{role}</div>

      <div className="relative mt-5 flex flex-wrap gap-1">
        {SUBAGENTS.map(s => (
          <span
            key={s}
            className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-ink2"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between font-mono text-[10px] text-ink2/70">
        <span>persona id <span className="text-ink2">{id}</span></span>
        <span>6 agents · 1 consent grid</span>
      </div>
    </div>
  );
}
