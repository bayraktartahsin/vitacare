# 🎬 VitaCare Demo Video — Recording Guide

Target: a **3-minute cinematic demo** that lands the wow moment. The pattern is **Setup → Watch → Payoff**: you set up the story *before* each click, the visuals play *silently* (Cloud TTS plays itself), and you deliver the payoff *after*. Total time on your side: **~45 minutes**.

---

## STEP 0 · What you need (5 min)

- **Chrome** browser
- **Loom desktop app** → https://www.loom.com/desktop (free, captures system audio + mic at 1080p)
- **Headphones** (so the modal's Cloud TTS audio doesn't bleed into your mic)
- **Quiet room** for ~10 minutes
- This document open on your phone or a second monitor

---

## STEP 1 · Pre-flight checklist (3 min)

Open Chrome and do these IN ORDER:

1. Go to **https://vitacare-web-205100594497.europe-west1.run.app**. Wait for the page to fully load. **Click anywhere on the body once** — this primes browser autoplay so the Cloud TTS audio works first try.
2. Open these in additional tabs (single-click switch during recording):
   - `/diagram` (architecture)
   - `/pitch` (5-slide deck)
   - `/praxis` (doctor-side mock)
3. Resize Chrome to roughly fill the screen. Bookmarks bar visible, no other UI distractions.
4. **Sound ON** at comfortable volume — you're recording system audio.
5. Open Loom. Settings:
   - **Recording type:** Screen + Mic + System Audio (Settings → Audio → "Capture system audio")
   - **Camera:** OFF
   - **Resolution:** 1080p

---

## STEP 2 · The recording (10–12 min, including 1–2 retakes)

### 🎙️ How to read the script

- **Read each block in one breath.** Don't pause mid-sentence.
- **The bracketed cues `[CLICK]` `[WATCH]` `[WAIT]` are stage directions** — don't read them aloud.
- During `[WATCH]` and `[WAIT]` periods, **say nothing**. The visuals + the Cloud TTS audio carry the moment.
- If you fluff a line, say *"let me say that again"* and continue. Trim in Loom after.

---

### 🎬 0:00 — Cold open (15 sec)

**Show:** the home page, fully loaded, scrolled to the top. Hold for 2 seconds before you speak.

**Say:**

> *"Healthcare's biggest unsolved problem isn't diagnosis. It's coordination — across the people who actually care for each other. Today the pregnant daughter, the hypertensive father, and the burnt-out caregiver all live in fragmented silos. VitaCare is the world's first agent-to-agent care network — and it's built on a hundred percent Google stack."*

---

### 🎬 0:15 — The architecture (15 sec)

**Show:** switch to `/diagram` tab. Hold on the three-ring diagram.

**Say:**

> *"Three concentric rings. The inner ring is the family — every member runs a personal swarm of six agents. The middle ring is clinical — pharmacy, lab, insurer, the doctor's own agent. The outer ring is the world's clinical knowledge, surfaced live via Google Search Grounding. The Family Health Graph at the center uses real three-thousand-and-seventy-two-dimensional Gemini embeddings."*

---

### 🎬 0:30 — Meet the family (12 sec)

**Show:** switch back to home. Scroll to the persona row so Emma, Robert, Sarah are centered on screen.

**Say:**

> *"Three people. Emma — thirty-two, pregnant. Robert — sixty, hypertensive. Sarah — twenty-eight, the daughter caring for both of them. Six agents per person. Eighteen total. One graph."*

---

### 🎬 0:42 — Setup The Cascade — *before* you click (25 sec)

**Show:** scroll down to the scenarios row. Hover your cursor over **The Cascade** card. **Do not click yet.**

**Say (slow, confident, set up the stakes):**

> *"Here's the scenario. Robert wakes up in Phoenix. His blood-pressure cuff has reported elevated readings three mornings in a row. His daughter Sarah lives in San Francisco — and until VitaCare, this is what would happen: nothing. Robert would forget. Sarah would never know. Now — watch what sixteen seconds looks like."*

**Pause for half a beat.**

---

### 🎬 1:07 — Run The Cascade — *silent watching* (~20 sec)

**Show:** **[CLICK "The Cascade"]**

**Say nothing.** Let the trace stream in silence. You'll see:

1. Sentinel triggers populate (BP elevated × 3)
2. Family Health Graph card lands with score bars + the live graph visualization
3. Clinician card with the AHA/ACC citation
4. Diplomat A2A from Robert → Sarah
5. Concierge appointment booked
6. **The phone modal slides up.** Wait for "Ringing…" → "Connected." Cloud TTS audio plays for ~10 seconds.

**Stay silent the entire time.** This is the wow — *don't* talk over it. Let viewers hear the agent voice.

---

### 🎬 1:27 — The payoff — *after* the audio finishes (25 sec)

**Show:** the phone modal is still visible. **Click the red end-call button**. Modal closes, trace is on screen.

**Say (with confidence — list the chain):**

> *"In sixteen seconds: his Sentinel agent detected the pattern. The Family Health Graph recalled his father's heart attack at fifty-eight and his current medication. The Clinician grounded against the actual A-H-A two-thousand-twenty-five guideline. The Diplomat sent a consent-gated message to Sarah's Diplomat. Her Concierge booked a doctor for Tuesday. And then her father got a call — voice generated by Gemini, spoken by Cloud Text-to-Speech, played inside the browser. No Twilio. No telephony provider. Everything you just heard is Google."*

---

### 🎬 1:52 — Pregnancy — fast pass (20 sec)

**Show:** scroll back up to the scenarios row.

**Say (set up, then click):**

> *"Same pattern, different cohort. Emma's glucose pattern matches an early gestational-diabetes signal — and her Diplomat doesn't just call her doctor. It quietly asks her partner's agent to handle the heavy lifting this week. Watch."*

**[CLICK "The Pregnancy"]**

**Stay silent ~10 seconds.** Let the trace stream. The voice line will render in the trace (no modal for this scenario — that's by design).

**Say (over the final events):**

> *"Same A2A protocol. Same consent grid. Different family member, different agent — coordinated automatically."*

---

### 🎬 2:12 — Who's behind this (25 sec)

**Show:** scroll down to **04 · Who's behind this**. Hold on the three cards so the chips read: `STUDIO · LIVE SHIPPING · PROTOTYPE`.

**Say (slow, calibrated — don't oversell):**

> *"VitaCare is built by Graviti Labs — an independent software studio that ships consumer and B2B health products end-to-end. Our consumer-facing product Vita is already live on the iOS App Store in twenty-three locales — VitaCare's safety pipeline is inherited directly from it. Vita Praxis, our doctor-facing sibling, is in active prototype — designed as the clinic-side endpoint that will receive these same A2A handoffs."*

**Optional 5-second click:** click the **"B2B side (Vita Praxis)"** CTA. Let the doctor-side mock land on screen for 3 seconds. Then click back to home.

---

### 🎬 2:37 — The business case (15 sec)

**Show:** back at the home page, scroll to the trust strip near the top so the numbers are visible.

**Say:**

> *"Family Tier subscription: twenty-five dollars per month per household. Forty million unpaid caregivers in the US alone — a twelve-billion-dollar addressable market. And Vita's existing twenty-three-locale distribution is our day-zero on-ramp."*

---

### 🎬 2:52 — Close (8 sec)

**Show:** back at the hero. Hold on the gradient `VitaCare` mark.

**Say (slow, deliberate, this is the closing line):**

> *"One AI per person. A network for the people you love. The world's first agent-to-agent care network. By Graviti Labs."*

**Stop recording.**

---

## STEP 3 · Light edit (5 min)

In Loom:
1. **Trim** any awkward silence at the start or end
2. **Cut** any "let me say that again" segment
3. **Optional title page:** Loom's 1-click "Add a title" with:
   > **VitaCare**
   > The Agent-to-Agent Care Network
   > Google for Startups AI Agents Challenge

**Do not add music.** Voice + the Cloud TTS audio + silence are enough — adding music will fight with the Cloud TTS call moment.

---

## STEP 4 · Share + paste into Devpost (2 min)

1. **Share → Get shareable link → Anyone with the link can view**
2. Copy the URL (`https://www.loom.com/share/...`)
3. Paste into the **Video** field on Devpost
4. Save

Loom videos play inline on Devpost — no upload needed.

---

## STEP 5 · IF SOMETHING GOES WRONG MID-RECORD

| Problem | Fix |
|---|---|
| Cloud TTS audio doesn't play | Click anywhere on the page once, end the call, click **The Cascade** again. Browsers need one user gesture before allowing autoplay. |
| Phone modal doesn't open within ~25 seconds | Gemini overload. End the recording. Wait 30 sec. Refresh the page. Click anywhere once. Try again. |
| Trace events arrive slower than the script implies | Pause your narration. Wait for the event. Continue. The script's *order* matters; the *timing* is flexible. |
| You fluffed a line | Say *"let me say that again"* and continue. Trim in Loom after. |

---

## STEP 6 · Final shipping checklist

- [ ] Total runtime is **between 2:45 and 3:15**
- [ ] **You stayed silent while the Cloud TTS audio played.** This is the single most important rule. Don't talk over the agent voice.
- [ ] You said the words **"world's first agent-to-agent care network"** at least once
- [ ] You said **"100% Google stack"** or **"Pure Google"** at least once
- [ ] The Cloud TTS call audio is clearly audible
- [ ] Loom share link is set to **public / anyone with the link**
- [ ] Pasted into Devpost Video field

You're done. Go submit.

---

## 🎯 Why this structure beats narrating-during-events

| Narrating *during* the run | Narrating *around* the run |
|---|---|
| Demo runs in 16 seconds — you can't fit the explanation | You explain *before*, watch *during*, recap *after* — natural pacing |
| You talk over the Cloud TTS voice (the wow!) | The agent voice gets its own moment — and lands as a real call |
| Feels rushed and cluttered | Feels confident and cinematic |
| Viewers can't process events + your voice at the same time | One stimulus at a time → comprehension up, retention up |

This is exactly how Apple, Linear, and Stripe demo products. **Show the story. Then say what just happened.**
