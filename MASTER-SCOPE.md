# 🌐 VITACARE — The Agent-to-Agent Care Network

> *Healthcare's future isn't one big AI. It's billions of personal agents that talk to each other. We're building the first one.*

**Submission:** Google for Startups AI Agents Challenge
**Track:** 1 — Build (Net-New Agents)
**Region:** EMEA
**Deadline:** June 12, 2026, 5:00 PM PT (June 12 03:00 GMT+3 — ~3 days from June 8)
**Team:** Tahsin Bayraktar / Graviti Labs
**Publisher identity (mandatory):** Tahsin Bayraktar · info@gravitilabs.com · Graviti Labs

---

## 1. THE ONE-LINER

VitaCare is the world's first **agent-to-agent (A2A) care network**: every family member runs a personal swarm of six health agents that coordinate care across the family, doctors, pharmacies, labs, and insurers — all powered by Gemini, ADK, MCP, and Google's A2A protocol.

---

## 2. PROBLEM

Healthcare's #1 unsolved problem is **coordination across people**, not diagnosis.

- 40M+ Americans (and ~3x in EMEA) are unpaid caregivers for aging parents
- Multi-generational households are the default in TR/MENA/Southern Europe
- The pregnant daughter, the hypertensive father, the burnt-out caregiver, the pediatrician — all operate in fragmented silos
- Existing health AI talks *to* one person. None talk *between* people
- Care is the part of healthcare AI has never automated

---

## 3. THE SOLUTION

Three concentric rings of A2A:

```
                      ┌──────────────────────────┐
                      │ OUTER RING — KNOWLEDGE   │
                      │ PubMed · Guidelines      │
                      │ clinicaltrials.gov       │
                      └────────────┬─────────────┘
                                   │ A2A
                ┌──────────────────┴──────────────────┐
                │ MIDDLE RING — CLINICAL              │
                │ Doctor Agent (Vita Praxis)          │
                │ Pharmacy · Lab · Insurer            │
                └──────────────────┬──────────────────┘
                                   │ A2A
                ┌──────────────────┴──────────────────┐
                │ INNER RING — FAMILY                 │
                │  Aylin (32, pregnant) ⇄ Ahmet (60)  │
                │              ⇅                       │
                │     Selin (28, caregiver)            │
                └─────────────────────────────────────┘
                                   │
                          ┌────────┴────────┐
                          │  FAMILY HEALTH  │
                          │      GRAPH      │
                          └─────────────────┘
```

### Each person = a swarm of 6 sub-agents

| Sub-agent     | Role                                                   | Model              |
|---------------|--------------------------------------------------------|--------------------|
| **Sentinel**  | Watches HealthKit / wearables; fires triggers          | Gemini 2.5 Flash   |
| **Chronicler**| Longitudinal medical memory (labs, visits, symptoms)   | Flash + Vertex Vec |
| **Clinician** | Medical reasoning, grounded in guidelines + literature | Gemini 2.5 Pro     |
| **Concierge** | Does things — books, refills, files claims (via MCP)   | Flash + MCP        |
| **Diplomat**  | A2A interface to *other* people's swarms               | Flash              |
| **Voice**     | Gemini Live, multilingual (TR/EN/AR)                   | Gemini Live        |

### Family Health Graph (FHG) — the moat

Shared, consent-gated knowledge graph across the family. Captures genetic patterns, cross-generational disease signals, care-coordination state. Vertex AI Vector Search + Firestore.

### Predictive Whisperer

The network detects patterns no single doctor sees:
> "Mom's HRV-drop + missed evening meds + 9pm bathroom trips matches her pre-ER pattern from Nov 2024. 78% confidence. Recommend GP visit within 72 hrs."

### Consent Mesh

Per-relationship, per-data-type permissions. *Mom's agent can see your BP. Not your mental-health log.* A2A handshakes negotiate capabilities. **Revocable. Auditable. The thing that makes it deployable in healthcare.**

---

## 4. WHY THIS WINS (mapped to the 4 judging criteria)

| Criterion              | Weight | Why we win                                                                                          |
|------------------------|--------|-----------------------------------------------------------------------------------------------------|
| Technical (30%)        | 30     | A2A protocol + ADK + MCP + Vertex + Gemini Live; multi-agent is *structurally required*, not bolted |
| Business (30%)         | 30     | $25/mo family tier × multi-gen households globally; expansion to Vita Praxis (B2B clinics)          |
| Innovation (20%)       | 20     | First A2A consumer-health network; first cross-person Family Health Graph                            |
| Demo & Presentation    | 20     | Multi-cohort narrative in one storyline; voice-driven, emotional, in Turkish + English              |

**Bonus angle for EMEA Regional Winner:** multi-gen households are the cultural default in our region.

---

## 5. TECH STACK (every Google tool the challenge wants to see)

- **Gemini 2.5 Pro** — Clinician (deep reasoning)
- **Gemini 2.5 Flash** — Sentinel, Chronicler, Concierge, Diplomat
- **Gemini Live** — Voice agent (streamed multilingual TTS/STT)
- **Agent Development Kit (ADK)** — agent orchestration framework
- **A2A Protocol** — inter-agent communication (Diplomat ↔ Diplomat)
- **MCP servers** — tool connections (Calendar / Pharmacy / Clinic / Lab / Insurer / Voice telephony)
- **Vertex AI Vector Search** — Family Health Graph embeddings
- **Firestore** — agent state, consent grid, scenario state
- **Cloud Run** — host all agents + Next.js demo
- **Cloud Tasks** — async A2A coordination, retry logic
- **Identity Platform** — auth + consent capture
- **Google Search Grounding** — Clinician grounds claims in current literature

---

## 6. MCP SERVERS WE BUILD

| MCP                | Real or Mocked   | What it does                                         |
|--------------------|------------------|------------------------------------------------------|
| **CalendarMCP**    | REAL (Google Cal)| Books appointments on caregiver's calendar          |
| **PharmacyMCP**    | Mocked           | Prescription refills, interaction checks            |
| **ClinicMCP**      | Mocked (or wraps Vita Praxis) | Books GP visits; doctor-side handoff               |
| **LabMCP**         | Mocked           | Parses lab PDFs → timeline; trend detection         |
| **InsurerMCP**     | Mocked           | Files claims, processes EOBs                        |
| **VoiceMCP**       | Twilio (real)    | Outbound voice calls (the "agent calls Mom" demo)   |

---

## 7. THE 3 DEMO SCENARIOS

### Scenario 1 — The Cascade (90 sec)
Ahmet (60, hypertensive father) wakes up with elevated BP for the 3rd morning. **Sentinel** detects the pattern. **Clinician** confirms it's clinically meaningful. **Diplomat** reaches **Selin's Diplomat** (his daughter, lives in another city) via A2A. Selin's **Concierge** books a GP slot for Ahmet on Tuesday + drafts a text. **Voice agent** calls Ahmet in Turkish:
> "Tatlım, doktorla salı 10'da görüşeceksin. Selin ayarladı, sen sadece git. Bir şey unutma diye birkaç soru hazırladım, telefonuna gönderdim."

### Scenario 2 — The Pregnancy (60 sec)
Aylin (32, trimester 3, gestational-diabetes risk) — meal log + glucose pattern matches early pre-eclampsia signal. **Clinician** flags it. **Chronicler** retrieves last month's week-26 labs (auto-parsed). **Concierge** books OB. **Diplomat** pings **husband's agent**:
> "Bu hafta market alışverişini sen halletsen iyi olur — ağır taşıması yok. Salı 14:00 OB randevusu var, takvimine ekledim."

### Scenario 3 — The Coordination (60 sec)
Selin's morning: both parents' agents have pinged hers. Mom's flu shot is due, Dad's lab results are back. Her **Concierge** auto-creates a calendar block "Tuesday 7pm: call Mom + walk Dad through lab numbers." **Voice agent**: "Mom's labs are fine — I can explain the numbers to her myself if you'd rather. Want me to?" Selin says yes; agent makes the call. All four Vita cohorts (Pregnancy, Family, Adult, Senior) get touched in one storyline.

---

## 8. THE 3-DAY SCHEDULE (T-72h)

### Day 1 — Mon June 8 → Tue June 9 (architecture + scaffolding)
- Lock agent topology, write this doc ✅
- GCP project, enable Vertex AI / Cloud Run / Firestore / Identity Platform
- Redeem $500 hackathon credits
- Python ADK project scaffolded with 6 sub-agent stubs
- 3 persona profiles seeded in Firestore (Aylin / Ahmet / Selin)
- Stub MCP servers (return canned data first)
- Next.js demo shell — 3 persona views, basic UI

### Day 2 — Tue June 10 (core loops)
- Implement all 6 sub-agents for each persona
- Wire A2A protocol (Diplomat ↔ Diplomat handshake + consent gating)
- Family Health Graph: Vertex Vector + Firestore
- Replace canned MCP outputs with the 3 scenario-needed paths
- Gemini Live voice for Voice agent (TR + EN)
- 3 scenarios working end-to-end (happy path)

### Day 3 — Wed June 11 (polish + ship)
- Deploy backend + demo to Cloud Run with public URL
- Add Identity Platform login (judges need testing access)
- Generate architecture diagram (Excalidraw or draw.io → PNG)
- Record 3-minute demo video
- Write every Devpost field
- Final smoke test
- Submit before 5pm PT June 11 / 03:00 GMT+3 June 12

**Buffer rule:** if Day 2 slips, drop Scenario 3 — Scenarios 1 + 2 alone hit every cohort.

---

## 9. DEVPOST FIELDS — PRE-WRITTEN COPY

**Title:** VitaCare — The Agent-to-Agent Care Network

**Tagline:** One AI per person. A network for the people you love.

**Problem to solve:**
Healthcare's biggest unsolved problem isn't diagnosis — it's coordination across people. The pregnant daughter, the hypertensive father, the burnt-out caregiver, and the pediatrician all operate in silos. 40M+ unpaid caregivers in the US (3x in EMEA) drown in the operational debt of caring for family. Existing health AI talks *to* one person. None talk *between* people.

**Our solution:**
VitaCare is the first agent-to-agent care network. Each family member runs a swarm of 6 personal agents (Sentinel, Chronicler, Clinician, Concierge, Diplomat, Voice) built on Google's Agent Development Kit. The Diplomats use the A2A protocol to coordinate across people: detecting trends, booking appointments, refilling meds, filing claims, and calling family members — all autonomously, all consent-gated through a per-relationship permissions mesh. The shared Family Health Graph (Vertex AI Vector Search) lets the network spot cross-generational and cross-time patterns no single clinician would catch.

**Technologies used:**
Gemini 2.5 Pro · Gemini 2.5 Flash · Gemini Live · Agent Development Kit (ADK) · A2A Protocol · Model Context Protocol (MCP) · Vertex AI Vector Search · Firestore · Cloud Run · Cloud Tasks · Identity Platform · Google Search Grounding · Twilio Programmable Voice (outbound calls) · Next.js (demo frontend) · Python · TypeScript

**Data sources:**
WHO clinical guidelines · CDC vaccination schedules · ESC hypertension protocols · ACOG pregnancy guidelines · DrugBank interactions (subset) · Synthetic HealthKit time series for the 3 personas · Synthetic lab PDFs · clinicaltrials.gov · PubMed via grounding

**Findings and learnings:**
(filled in last 24h based on actual build experience)

**Third-party integrations:**
Twilio Programmable Voice (outbound voice calls) — Graviti Labs has its own Twilio account, fully authorized. Google Calendar (real). All clinical guideline content cited and used under fair-use/research basis. HealthKit/lab data is synthetic for personas.

### Submission Q's (to fill):
- GCP familiarity (1-5): **4**
- Google AI Studio familiarity (1-5): **4**
- Readiness for launch: **Beta-ready prototype. Public demo URL live. Production rollout planned via existing Vita iOS app (2.4M+ ASA budget already deployed by Graviti Labs).**
- Critical Agent Platform feature: **A2A protocol + ADK's hierarchical agent model. Missing: native cross-agent observability for debugging multi-agent traces.**
- API capability that would have saved 2+ hours: **Native healthcare-vertical MCP server templates (HL7/FHIR/EHR connectors as managed MCP servers).**

---

## 10. ASSETS NEEDED FOR SUBMISSION

| Asset                      | Status   | Where                                                       |
|----------------------------|----------|-------------------------------------------------------------|
| **Video** (3 min)          | TODO     | Loom upload, then linked in Devpost                         |
| **Code**                   | TODO     | github.com/bayraktartahsin/vitacare (public for judging)    |
| **Testing access (demo)**  | TODO     | https://vitacare.gravitilabs.com (Cloud Run + Identity login) |
| **Architecture diagram**   | TODO     | Excalidraw PNG, uploaded to repo + linked                   |

---

## 11. POST-HACKATHON: WHY THE BUSINESS CASE IS REAL

- **Vita iOS app already shipping** (com.tahsinbayraktar.tai) — VitaCare becomes a Family Tier upgrade
- **Vita Praxis (doctor-facing)** is the natural B2B sibling — clinics pay to receive A2A handoffs from patient agents
- **Subscription model:** $9.99/mo individual · $24.99/mo family (up to 5 members + caregiver mode for elders)
- **Distribution moat:** Vita already runs in 23 locales; A2A goes wherever Vita ships
- **TAM in EMEA alone:** ~80M multi-generational households

---

## 12. RISKS & MITIGATIONS

| Risk                                       | Mitigation                                                 |
|--------------------------------------------|------------------------------------------------------------|
| 3 days isn't enough to build all 6 agents  | Each persona shares agent code; only state differs         |
| A2A protocol still new — SDK gaps          | Fallback to direct REST between agents wrapped in A2A semantics |
| Voice integration flaky in browser         | Pre-record one demo voice clip + live for the rest         |
| Judges can't test multi-person scenarios   | Demo URL ships with all 3 personas pre-loaded; switch via dropdown |
| Medical safety (Vita's "never diagnose")   | Clinician always frames as "consider seeing a doctor"; never prescribes |
