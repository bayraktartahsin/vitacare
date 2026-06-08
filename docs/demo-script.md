# VitaCare — Demo Video Script (final, 3:00 cut)

**Recording target:** Loom or QuickTime screen capture at 1920×1080.
**Browser:** Chrome at 1600×1000 viewport, scroll-locked to top, audio output to system speakers via Loopback or screen-record-with-audio.
**Pre-roll:** Tab open at the live Cloud Run demo URL, agents backend warm (visit `/healthz` once).
**Click once anywhere on the page before recording** to satisfy browser autoplay rules.

---

## 0:00 — Cold open (12 sec)

**Screen:** title card on a black background:

> **VitaCare**
> The Agent-to-Agent Care Network
>
> Google for Startups AI Agents Challenge · Track 1

**Voice-over (EN, calm, confident):**

> *Healthcare's biggest unsolved problem isn't diagnosis. It's coordination — across the people who actually care for each other. Today, the pregnant daughter, the hypertensive father, and the burnt-out caregiver all live in fragmented silos. We connected them.*

---

## 0:12 — Architecture flash (15 sec)

**Screen:** cut to the `/diagram` page, hold on the three concentric rings for 5 sec, then on the six-agent swarm panel for 5 sec, then on the runtime panel for 5 sec.

**Voice-over:**

> *Every family member runs a personal swarm of six agents — Sentinel, Chronicler, Clinician, Concierge, Diplomat, Voice — built on Google's Agent Development Kit. The Diplomats coordinate across people over the new A2A protocol. A shared Family Health Graph holds the patterns no single doctor sees.*

---

## 0:27 — The Family (8 sec)

**Screen:** back to `/`. Pan across the three persona cards — Emma · Robert · Sarah. Hover briefly on each so the cohort chip is readable.

**Voice-over:**

> *Three personas. A pregnant daughter, a hypertensive father, and the caregiver who carries them both. Each one has six agents. All three share one health graph.*

---

## 0:35 — Scenario 1: The Cascade (1:05)

**Screen action:** click **"The Cascade"** scenario card.

**0:36** Sentinel triggers populate (3 BP-elevated events).

**Voice-over:** *"Robert's blood pressure has been elevated three mornings in a row. His Sentinel agent notices the pattern."*

**0:42** `clinician.assessment` lands. Highlight the ESC/ESH 2018 citation in the trace.

**Voice-over:** *"His Clinician — Gemini 2.5 Pro — confirms it's clinically meaningful, citing the 2018 European Hypertension Guidelines. It never diagnoses. It always frames as 'consider seeing a doctor.'"*

**0:50** `diplomat.a2a.send` lands. Highlight `from: robert → to: sarah`.

**Voice-over:** *"His Diplomat reaches across the network via A2A — straight to his daughter's Diplomat. Consent-gated, category-scoped."*

**0:56** `concierge.gp_booked` lands.

**Voice-over:** *"Sarah's Concierge auto-books a GP slot with Dr. Emily Carter for Tuesday morning and writes it into her Google Calendar."*

**1:04** `voice.draft` lands; then `voice.call_placed` triggers the phone modal sliding up.

**Voice-over:** *"And then — her father gets a call."*

**1:08** Modal connects. English audio plays (~9 sec). Let the line play cleanly:

> *"Dad, Sarah booked you a GP appointment for Tuesday at 10 AM — just a quick check on your blood pressure. Nothing to worry about, she's got it handled."*

**1:24** Audio finishes. Highlight the "Google Cloud TTS · No telephony" chip on the modal.

**Voice-over:** *"That voice is real Google Cloud Text-to-Speech. The call is a UI — there's no Twilio, no telephony provider. Everything you just saw is Google."*

**1:36** Click red end-call button. Modal closes.

---

## 1:40 — Scenario 2: The Pregnancy (45 sec)

**Screen action:** click **"The Pregnancy"** scenario card. Let it stream.

**Voice-over (overlaying the stream):**

> *Now Emma. Trimester three. Her glucose pattern matches an early gestational-diabetes signal.*
>
> *Her Clinician grounds against ACOG. Her Chronicler retrieves last month's week-26 OGTT. Her Concierge books her OB appointment.*
>
> *Then her Diplomat reaches out to her partner's agent — not to alarm him, just to say: "this week, you handle the heavy lifting."*

**2:20** `voice.speak` event — captioned English line: *"Emma, your OB check-up is Tuesday at 2pm — added to your calendar. No heavy lifting this week, I've already asked your partner to handle the groceries."*

**Voice-over:** *"Spoken in her own voice, by her own agent."*

---

## 2:25 — Scenario 3: The Coordination (25 sec)

**Screen action:** click **"The Coordination"**. Two `diplomat.a2a.recv` events land back-to-back. Then a `concierge.daily_block` event.

**Voice-over:**

> *Sarah's morning. Two A2A messages have already arrived from her parents' agents — Emma's flu shot is due, Dad's labs are back.*
>
> *Her swarm collapses both into one 7pm block on her calendar. And her Voice agent offers to make the calls itself.*

**2:48** `voice.speak` event — caption: *"Good morning, Sarah. Three things on your plate. I can call Emma about her flu shot myself if you prefer — just say the word."*

---

## 2:50 — Close (10 sec)

**Screen:** cut back to title card.

> **VitaCare**
> One AI per person. A network for the people you love.
>
> github.com/bayraktartahsin/vitacare
> Graviti Labs · 2026

**Voice-over:**

> *Six agents per person. A2A across the family. Vertex, Gemini, ADK, MCP — and a phone call that isn't. This is what care coordination looks like when AI agents talk to each other.*

---

## Production checklist

- [ ] Demo Cloud Run URL live + warm (`/health` returns 200)
- [ ] Browser at 1600×1000, scroll locked to top of `/`
- [ ] Single click on page made before recording to satisfy autoplay
- [ ] Audio system level set so Cloud TTS English is clearly audible
- [ ] Outro card holds for 5 sec at the end
- [ ] Final cut exported at 1080p, ≤ 100MB so Devpost upload doesn't hiccup
- [ ] Loom/YouTube unlisted link, viewable without login
