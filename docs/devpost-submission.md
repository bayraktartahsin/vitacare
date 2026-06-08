# VitaCare — Devpost Submission Sheet

Copy-paste these into the Devpost project form on https://googlestartupsaiagents.devpost.com/.

---

## 🪪 Project basics

| Field | Value |
|---|---|
| **Project title** | VitaCare — The Agent-to-Agent Care Network |
| **Tagline** | One AI per person. A network for the people you love. |
| **Theme** | Build (Net-New Agents) |
| **Region** | EMEA |

---

## 🎬 Project assets (links — fill in last)

| Asset | URL |
|---|---|
| Video (3 min) | _to be filled on submission day_ |
| Code | https://github.com/bayraktartahsin/vitacare |
| Testing access (live demo) | **https://vitacare-web-205100594497.europe-west1.run.app** |
| Architecture diagram | https://github.com/bayraktartahsin/vitacare/blob/main/docs/architecture-diagram.png |

**Backend (agents API) endpoint:** https://vitacare-agents-205100594497.europe-west1.run.app · `/personas` · `/scenario/{id}/stream` · `/tts` · `/a2a/handshake`

---

## ✍️ Description fields

### Problem to solve

Healthcare's biggest unsolved problem isn't diagnosis — it's **coordination across people**. The pregnant daughter, the hypertensive father, the burnt-out caregiver, and the pediatrician all operate in silos. There are 40M+ unpaid family caregivers in the US, and ~3× that in EMEA, drowning in the operational debt of caring for the people they love. Existing health AI talks **to** one person. None talk **between** people. Care — the part of healthcare AI has never automated — is left entirely to humans.

### Our solution

VitaCare is the world's first **agent-to-agent (A2A) care network**.

Every family member runs a personal swarm of six health agents — Sentinel, Chronicler, Clinician, Concierge, Diplomat, Voice — built on Google's Agent Development Kit. The Diplomats use Google's A2A protocol to coordinate care **across people**: detecting trends in one person's vitals, booking appointments on another person's calendar, refilling meds, filing claims, even placing voice "calls" to family members in their own language. Everything is consent-gated by a per-relationship, per-data-category permissions mesh.

The shared **Family Health Graph** (Vertex AI Vector Search + Firestore) lets the network spot cross-generational and cross-time patterns no single clinician would catch — e.g. *"Mom's HRV-drop + missed evening meds + 9pm bathroom trips matches her pre-ER pattern from Nov 2024. 78% confidence. Recommend GP visit within 72 hrs."*

The flagship demo: **The Cascade.** Robert's BP is elevated on his 3rd morning. His Sentinel triggers; his Clinician (Gemini 2.5 Pro, grounded against ESC/ESH 2018) confirms moderate concern. His Diplomat sends an A2A message to his daughter Sarah's Diplomat. Her Concierge auto-books a GP slot with Dr. Emily Carter at Northwell Health and adds the event to her Google Calendar. His Voice agent then "calls" him — opening an iPhone-style modal in the browser bound to a real Google Cloud Text-to-Speech audio stream. The caption shows his line: *"Dad, Sarah booked you a GP appointment for Tuesday at 10 AM, just to have your blood pressure checked..."*

All four Vita cohorts (Pregnancy / Baby / Adult / Senior) are exercised in three demo scenarios. The entire stack is Google — no third-party AI providers, no telephony provider, nothing external to the Google Cloud ecosystem.

### Technologies used

Gemini 2.5 Pro · Gemini 2.5 Flash · Gemini Live · Google Cloud Text-to-Speech · Agent Development Kit (ADK 2.x) · A2A Protocol · Model Context Protocol (MCP) · Vertex AI Vector Search · Firestore · Cloud Run · Cloud Tasks · Cloud Build · Artifact Registry · Identity Platform · Secret Manager · Google Calendar API · Google Search Grounding · Next.js 14 · Python 3.12 · TypeScript · FastAPI · Server-Sent Events.

**100% Google stack — zero third-party AI providers, zero telephony provider.**

### Data sources

- Clinical guidelines (cited via Google Search Grounding): ESC/ESH 2018 hypertension; ACOG Practice Bulletin 190 (GDM); CDC vaccination schedules; WHO; ESPGHAN.
- DrugBank (subset, for the Pharmacy MCP interaction-check stub).
- clinicaltrials.gov (Knowledge ring reference).
- Synthetic HealthKit/wearable time series for the three demo personas (Aylin / Ahmet / Selin) — no real patient data.
- Synthetic lab PDFs (week-26 OGTT for the pregnancy scenario).

### Findings and learnings

1. **A2A as a primitive changes the architecture.** Once we modeled the Diplomat as a real network node (not a pub/sub topic), the demos wrote themselves — "person A's agent talks to person B's agent" is now a first-class verb in our code.
2. **Consent must be modeled before data.** We built the ConsentGrid before the message router so we couldn't accidentally ship a "share-everything" prototype. This bled into the schema for every other component.
3. **Gemini Pro under hackathon traffic peaks gets 503'd.** We added a Pro → Flash fallback that runs on the 2nd retry. The clinical assessment still passes its ESC/ESH citation check on Flash, which surprised us.
4. **The "phone call" is the wow.** Replacing a planned Twilio integration with an in-browser Gemini-styled phone modal (backed by Cloud TTS) made the demo *more* impressive: real Google audio + reasoning chain visible alongside, in one screen.
5. **The simulated phone-call UI replaced our planned third-party telephony.** A Cloud-TTS-driven iPhone-style modal proved more compelling than an actual outbound call would have — judges see the agent reasoning chain *and* hear the agent voice, in one screen, on pure Google infrastructure.

### Third-party integrations

**None for AI or voice.** The entire stack is Google: Gemini Live, Cloud TTS, Vertex AI, Cloud Run, Firestore, Identity Platform, Secret Manager.

The only external service we touch is **Google Calendar API** — a Google-owned, OAuth-gated user resource. All clinical guideline content is cited and used under fair-use/research basis. HealthKit/lab data is synthetic.

---

## 🎯 Submission questions (judges-only)

| Question | Answer |
|---|---|
| GCP familiarity (1–5) | **4** |
| Google AI Studio familiarity (1–5) | **4** |
| Project readiness for launch | Beta-ready prototype. Public live demo URL. Production rollout planned through the existing Vita iOS app (com.tahsinbayraktar.tai), already shipping in 23 locales as the consumer surface for Graviti Labs' health AI. The Family Tier (US$24.99/mo) will gate the A2A coordination network for households. |
| Most critical Agent Platform feature you used | **The A2A protocol combined with ADK's hierarchical agent model.** It's the single thing that turned "a chatbot per person" into "a coordinated care network." Modeling each Diplomat as an A2A node — with the consent grid as a first-class capability check on the handshake — was the architectural pivot that made the whole demo work. |
| One thing the platform is missing | **Native cross-agent observability for multi-agent traces.** Right now we end up correlating logs across persona instances by hand to debug a stalled A2A coordination. A built-in trace explorer that shows a unified timeline of every agent's reasoning and tool calls per scenario would have saved a day. |
| One API capability that would have saved 2+ hours | **Native healthcare-vertical MCP server templates** — managed MCP servers for FHIR/HL7/EHR connectors, and a managed MCP server for Calendar specifically scoped to a per-user OAuth grant (instead of us wiring OAuth + service-account fallback by hand). |
| Anything else | The entire stack is intentionally Google-only. We built this with the constraint that *every* AI, voice, scheduling, vector, and runtime call goes through a Google service. The demo's "Google Cloud TTS · No telephony" chip is on the phone-call modal on purpose — judges can hear it's not browser TTS. We think this is what "built on Google" should look like. |

---

## 🧪 Live testing instructions (for judges)

1. Visit the demo URL (above)
2. Click **"The Cascade"** scenario card
3. Watch the multi-agent event stream populate in real time (Sentinel → Clinician → Diplomat → Concierge → Voice)
4. After ~7 seconds, a phone-call modal slides in showing **Ahmet — Baba**
5. The Turkish voice plays. *Tap once anywhere on the page first if audio is blocked by browser autoplay rules.*
6. Try the other two scenarios (Pregnancy, Coordination) — each exercises a different combination of cohorts and agents.

No login required — the demo is read-only and uses three pre-loaded personas.
