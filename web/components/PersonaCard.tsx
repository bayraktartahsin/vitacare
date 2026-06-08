type Props = { id: string; name: string; role: string; cohort: string };

const COHORT_COLOR: Record<string, string> = {
  Pregnancy: "bg-bad/20 text-bad",
  Senior: "bg-warn/20 text-warn",
  Adult: "bg-ok/20 text-ok",
  Family: "bg-accent/20 text-accent",
};

export function PersonaCard({ id, name, role, cohort }: Props) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">{name}</div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${COHORT_COLOR[cohort] || ""}`}>
          {cohort}
        </span>
      </div>
      <div className="mt-1 text-sm text-ink2">{role}</div>
      <div className="mt-4 text-xs text-ink2">
        Sub-agents: <span className="text-ink">6 active</span> · Persona id: <code>{id}</code>
      </div>
    </div>
  );
}
