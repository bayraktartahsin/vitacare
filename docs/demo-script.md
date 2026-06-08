# VitaCare — Demo Video Script (3 min)

Target length: 3:00. Recorded on the live Cloud Run demo at `vitacare.gravitilabs.com`.

## 0:00 — Cold open (15 s)
- Title card: "VitaCare — The Agent-to-Agent Care Network"
- Voice-over (EN): "Healthcare's biggest unsolved problem isn't diagnosis. It's coordination — across people. Today, the pregnant daughter, the hypertensive father, and the burnt-out caregiver all operate in silos. We connected them."

## 0:15 — Architecture flash (15 s)
- 3-ring diagram appears, builds outward (Family → Clinical → Knowledge)
- VO: "Every family member runs six personal agents. Their Diplomats talk over Google's A2A protocol. A shared Family Health Graph holds the patterns no single doctor sees."

## 0:30 — Scenario 1: The Cascade (60 s)
- Click "Cascade" in the demo UI
- Watch the event stream populate:
  - `sentinel.trigger` (BP elevated 3 mornings)
  - `clinician.assessment` (ESC guideline cited)
  - `diplomat.a2a.send` → Selin
  - `concierge.gp_booked` (real Google Calendar event appears in a side window)
  - `voice.call_placed` — a simulated phone-call modal opens ("Ahmet's phone, ringing..."), a Gemini Live audio session connects, the Turkish line streams in real time with a live waveform and word-by-word captions
- VO: "The agent doesn't just message Ahmet — it calls him. In Turkish. Live. Powered by Gemini Live in the browser. No telephony provider, no third-party service. Pure Google."

## 1:30 — Scenario 2: The Pregnancy (45 s)
- Click "Pregnancy"
- Stream shows glucose pattern → ACOG-grounded assessment → OB booked → partner agent pinged
- Highlight the Family Health Graph update on screen
- VO: "Now Aylin's pregnancy. Glucose pattern matches an early signal. Her clinician agent grounds against ACOG. Her OB is booked. Her husband's agent gets a polite note about groceries."

## 2:15 — Scenario 3: The Coordination (30 s)
- Click "Coordination"
- Show inbound A2A messages collapsing into Selin's morning brief
- VO: "Selin's morning. Two inbound messages from two parents become one 7pm block. Her agent offers to make the calls itself."

## 2:45 — Close (15 s)
- Show the consent mesh visualization
- VO: "Built on Gemini, ADK, A2A, MCP, and Vertex AI. The first network of personal health agents. By Graviti Labs."
- End card: vitacare.gravitilabs.com · github.com/bayraktartahsin/vitacare
