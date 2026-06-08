/* Standalone architecture diagram — used for the Devpost submission asset.
 * Open at /diagram and screenshot at 1600×1100 for the PNG export. */
export default function DiagramPage() {
  return (
    <main className="min-h-screen bg-[#0b0d12] px-10 py-10 text-ink">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between border-b border-line pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-ink2">
              Architecture · Google for Startups AI Agents Challenge · EMEA · Track 1
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">VitaCare — The Agent-to-Agent Care Network</h1>
            <p className="mt-1 text-base text-ink2">One AI per person. A network for the people you love. 100% Google stack.</p>
          </div>
          <div className="text-right text-xs text-ink2">
            <div>github.com/bayraktartahsin/vitacare</div>
            <div>gravitilabs.com · 2026</div>
          </div>
        </div>

        {/* Top row: 3 rings + per-persona swarm */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7">
            <SectionTitle n="01" title="A2A Topology — three concentric rings" />
            <ThreeRings />
          </div>
          <div className="col-span-5">
            <SectionTitle n="02" title="Each persona = a swarm of 6 sub-agents" />
            <Swarm />
          </div>
        </div>

        {/* Bottom row: runtime + data + stack */}
        <div className="mt-10 grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <SectionTitle n="03" title="Runtime topology — Cloud Run" />
            <Runtime />
          </div>
          <div className="col-span-4">
            <SectionTitle n="04" title="Pure-Google stack" />
            <StackBadges />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-6 text-sm">
          <FooterPanel
            title="A2A message envelope"
            items={[
              "from_persona / to_persona",
              "intent: alert · request_action · share_data · coordinate · ack",
              "category: vitals · meds · labs · appts · symptoms · mental_health · summary",
              "consent check before egress",
            ]}
          />
          <FooterPanel
            title="Safety pipeline (Vita rule)"
            items={[
              "Clinician never diagnoses",
              "Clinician never prescribes",
              "Recommendations always end with 'consider seeing a doctor'",
              "Guideline citations: ESC · ACOG · CDC · WHO",
            ]}
          />
          <FooterPanel
            title="Family Health Graph"
            items={[
              "Vertex AI Vector Search (embeddings of every fact)",
              "Firestore (structured facts + consent grid)",
              "Cross-generational pattern detector",
              "Per-relationship × per-category permissions",
            ]}
          />
        </div>
      </div>
    </main>
  );
}

/* ----- ring & swarm visualizations ----- */

function ThreeRings() {
  return (
    <div className="rounded-xl border border-line bg-panel p-6">
      <svg viewBox="0 0 700 460" className="h-[440px] w-full">
        {/* Outer ring — Knowledge */}
        <ellipse cx="350" cy="230" rx="330" ry="200" fill="none" stroke="#222633" strokeWidth="1.2" strokeDasharray="4 4" />
        <text x="350" y="40" fill="#9aa1ad" fontSize="13" fontWeight="500" textAnchor="middle" letterSpacing="3">
          OUTER RING · KNOWLEDGE
        </text>
        <Pill x={120} y={70} w={150} h={32} label="PubMed (grounding)" tone="ink2" />
        <Pill x={285} y={70} w={150} h={32} label="ESC · ACOG · CDC · WHO" tone="ink2" />
        <Pill x={450} y={70} w={130} h={32} label="clinicaltrials.gov" tone="ink2" />

        {/* Middle ring — Clinical */}
        <ellipse cx="350" cy="240" rx="250" ry="145" fill="none" stroke="#7aa2f7" strokeOpacity="0.4" strokeWidth="1.4" />
        <text x="350" y="125" fill="#7aa2f7" fontSize="13" fontWeight="500" textAnchor="middle" letterSpacing="3">
          MIDDLE RING · CLINICAL  (MCP)
        </text>
        <Pill x={140} y={150} w={130} h={32} label="ClinicMCP" tone="accent" />
        <Pill x={285} y={150} w={130} h={32} label="PharmacyMCP" tone="accent" />
        <Pill x={430} y={150} w={130} h={32} label="LabMCP" tone="accent" />
        <Pill x={140} y={190} w={130} h={32} label="InsurerMCP" tone="accent" />
        <Pill x={285} y={190} w={130} h={32} label="CalendarMCP·REAL" tone="ok" />
        <Pill x={430} y={190} w={130} h={32} label="Vita Praxis (Dr)" tone="accent" />

        {/* Inner ring — Family */}
        <ellipse cx="350" cy="320" rx="160" ry="80" fill="none" stroke="#f7768e" strokeOpacity="0.6" strokeWidth="1.6" />
        <text x="350" y="265" fill="#f7768e" fontSize="13" fontWeight="500" textAnchor="middle" letterSpacing="3">
          INNER RING · FAMILY  (A2A)
        </text>

        {/* Persona nodes */}
        <PersonaNode cx={250} cy={325} label="Aylin" sub="T3 pregnant" tone="#f7768e" />
        <PersonaNode cx={450} cy={325} label="Ahmet" sub="Senior · BP" tone="#e0af68" />
        <PersonaNode cx={350} cy={385} label="Selin" sub="Caregiver" tone="#9ece6a" />

        {/* A2A arrows */}
        <Arrow x1={290} y1={325} x2={410} y2={325} />
        <Arrow x1={250} y1={345} x2={335} y2={380} />
        <Arrow x1={450} y1={345} x2={365} y2={380} />

        {/* Center FHG */}
        <g transform="translate(310,295)">
          <rect x="0" y="0" rx="10" ry="10" width="80" height="50" fill="#161a23" stroke="#7aa2f7" strokeOpacity="0.6" />
          <text x="40" y="20" fill="#e7e9ee" fontSize="11" fontWeight="600" textAnchor="middle">FHG</text>
          <text x="40" y="36" fill="#9aa1ad" fontSize="9" textAnchor="middle">Family Health Graph</text>
        </g>
      </svg>
    </div>
  );
}

function Pill({ x, y, w, h, label, tone }: { x: number; y: number; w: number; h: number; label: string; tone: string }) {
  const stroke = tone === "ok" ? "#9ece6a" : tone === "accent" ? "#7aa2f7" : "#9aa1ad";
  const fill = "#11141b";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} ry={8} fill={fill} stroke={stroke} strokeOpacity={0.55} />
      <text x={x + w / 2} y={y + h / 2 + 4} fill="#e7e9ee" fontSize="11" textAnchor="middle">{label}</text>
    </g>
  );
}

function PersonaNode({ cx, cy, label, sub, tone }: { cx: number; cy: number; label: string; sub: string; tone: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="28" fill="#161a23" stroke={tone} strokeOpacity="0.9" strokeWidth="2" />
      <text x={cx} y={cy + 1} fill="#e7e9ee" fontSize="11" fontWeight="600" textAnchor="middle">{label}</text>
      <text x={cx} y={cy + 14} fill="#9aa1ad" fontSize="9" textAnchor="middle">{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f7768e" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f7768e" strokeOpacity="0.6" strokeWidth="1.2" markerStart="url(#arr)" markerEnd="url(#arr)" />
    </g>
  );
}

function Swarm() {
  const AGENTS = [
    { name: "Sentinel",  role: "wearables → triggers",     model: "2.5 Flash", color: "#e0af68" },
    { name: "Chronicler",role: "longitudinal memory",      model: "Flash + Vec",color: "#7aa2f7" },
    { name: "Clinician", role: "grounded reasoning",        model: "2.5 Pro",   color: "#9ece6a" },
    { name: "Concierge", role: "MCP actions",               model: "Flash + MCP",color: "#7aa2f7" },
    { name: "Diplomat",  role: "A2A interface",             model: "Flash",     color: "#f7768e" },
    { name: "Voice",     role: "Gemini Live · Cloud TTS",   model: "Live + TTS",color: "#bb9af7" },
  ];
  return (
    <div className="rounded-xl border border-line bg-panel p-6">
      <div className="grid grid-cols-2 gap-3">
        {AGENTS.map((a) => (
          <div key={a.name} className="rounded-lg border border-line bg-panel2 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
              <div className="text-sm font-semibold">{a.name}</div>
            </div>
            <div className="mt-1 text-xs text-ink2">{a.role}</div>
            <div className="mt-1 font-mono text-[10px] text-ink2">{a.model}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-dashed border-line bg-panel2 p-3 text-center text-xs text-ink2">
        × 3 personas · all six agents per person · all coordinated through A2A
      </div>
    </div>
  );
}

function Runtime() {
  return (
    <div className="rounded-xl border border-line bg-panel p-6">
      <svg viewBox="0 0 900 360" className="h-[340px] w-full">
        {/* Lane labels */}
        <text x="30" y="30"  fill="#9aa1ad" fontSize="11" fontWeight="500" letterSpacing="3">CLIENT</text>
        <text x="30" y="135" fill="#9aa1ad" fontSize="11" fontWeight="500" letterSpacing="3">CLOUD RUN</text>
        <text x="30" y="265" fill="#9aa1ad" fontSize="11" fontWeight="500" letterSpacing="3">DATA · AI</text>

        {/* Client lane */}
        <Box x={150} y={10}  w={200} h={50} title="Browser demo"     sub="Next.js · EventSource" tone="#7aa2f7" />
        <Box x={400} y={10}  w={210} h={50} title="Phone-call modal"  sub="HTML/SVG · Cloud TTS audio" tone="#7aa2f7" />
        <Box x={640} y={10}  w={220} h={50} title="Caregiver iOS (Vita)" sub="Existing SwiftUI · Family Tier" tone="#9aa1ad" dim />

        {/* Cloud Run lane */}
        <Box x={150} y={115} w={250} h={60} title="vitacare-web (Cloud Run)" sub="Next.js 14 standalone" tone="#7aa2f7" />
        <Box x={430} y={115} w={300} h={60} title="vitacare-agents (Cloud Run)" sub="FastAPI · ADK · A2A · MCP" tone="#9ece6a" />
        <Box x={760} y={115} w={110} h={60} title="Cloud Tasks" sub="A2A retries" tone="#7aa2f7" />

        {/* Data lane */}
        <Box x={150} y={245} w={170} h={60} title="Firestore" sub="state · consent grid" tone="#e0af68" />
        <Box x={340} y={245} w={170} h={60} title="Vertex Vector" sub="Family Health Graph" tone="#bb9af7" />
        <Box x={530} y={245} w={150} h={60} title="Gemini API" sub="2.5 Pro · 2.5 Flash" tone="#9ece6a" />
        <Box x={700} y={245} w={170} h={60} title="Cloud TTS · Live" sub="Turkish voice synth" tone="#9ece6a" />

        {/* Arrows */}
        <Conn x1={250} y1={60} x2={275} y2={115} />
        <Conn x1={500} y1={60} x2={580} y2={115} />
        <Conn x1={400} y1={145} x2={430} y2={145} />
        <Conn x1={580} y1={175} x2={235} y2={245} />
        <Conn x1={580} y1={175} x2={425} y2={245} />
        <Conn x1={580} y1={175} x2={605} y2={245} />
        <Conn x1={580} y1={175} x2={785} y2={245} />

        {/* Side: external real APIs */}
        <text x="780" y="220" fill="#9aa1ad" fontSize="10" letterSpacing="2">REAL EXTERNAL</text>
        <Box x={760} y={335} w={140} h={22} title="Google Calendar (OAuth)" sub="" tone="#9ece6a" tiny />
      </svg>
    </div>
  );
}

function Box({
  x, y, w, h, title, sub, tone, dim, tiny,
}: { x: number; y: number; w: number; h: number; title: string; sub: string; tone: string; dim?: boolean; tiny?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} ry={9} fill="#11141b" stroke={tone} strokeOpacity={dim ? 0.3 : 0.7} strokeWidth={dim ? 1 : 1.5} />
      <text x={x + 12} y={y + (tiny ? 15 : 22)} fill="#e7e9ee" fontSize={tiny ? 10 : 12.5} fontWeight="600" opacity={dim ? 0.6 : 1}>
        {title}
      </text>
      {sub && !tiny && (
        <text x={x + 12} y={y + 40} fill="#9aa1ad" fontSize="10.5" opacity={dim ? 0.5 : 1}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Conn({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9aa1ad" strokeOpacity="0.35" strokeWidth="1" />;
}

function StackBadges() {
  const badges = [
    ["Gemini 2.5 Pro", "#9ece6a"],
    ["Gemini 2.5 Flash", "#9ece6a"],
    ["Gemini Live", "#9ece6a"],
    ["Cloud Text-to-Speech", "#9ece6a"],
    ["Agent Development Kit", "#7aa2f7"],
    ["A2A Protocol", "#f7768e"],
    ["Model Context Protocol", "#bb9af7"],
    ["Vertex AI Vector Search", "#bb9af7"],
    ["Cloud Run", "#7aa2f7"],
    ["Firestore", "#e0af68"],
    ["Cloud Tasks", "#7aa2f7"],
    ["Identity Platform", "#9aa1ad"],
    ["Secret Manager", "#9aa1ad"],
    ["Google Calendar API", "#9ece6a"],
    ["Google Search Grounding", "#9ece6a"],
  ];
  return (
    <div className="rounded-xl border border-line bg-panel p-6">
      <div className="flex flex-wrap gap-2">
        {badges.map(([label, color]) => (
          <span
            key={label as string}
            className="rounded-full border px-3 py-1.5 text-xs"
            style={{ borderColor: `${color}55`, color: color as string, background: "#11141b" }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-dashed border-line bg-panel2 p-3 text-center text-xs text-ok">
        100% Google · zero third-party AI · zero telephony provider
      </div>
    </div>
  );
}

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-3">
      <span className="text-xs font-semibold tracking-widest text-accent">{n}</span>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink">{title}</h2>
    </div>
  );
}

function FooterPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">{title}</div>
      <ul className="mt-2 space-y-1.5 text-xs text-ink">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="text-ink2">›</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
