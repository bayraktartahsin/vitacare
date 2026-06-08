# VitaCare — Architecture

## High-level

```
                ┌──────────────────────────┐
                │ OUTER RING — KNOWLEDGE   │
                │ PubMed · Guidelines      │
                │ clinicaltrials.gov       │
                └────────────┬─────────────┘
                             │ (Google Search Grounding · A2A)
          ┌──────────────────┴──────────────────┐
          │ MIDDLE RING — CLINICAL              │
          │ Doctor Agent (Vita Praxis)          │
          │ Pharmacy · Lab · Insurer (MCP)      │
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

## Per-persona swarm (6 sub-agents)

```
                         ┌──────────────┐
        wearables  ────▶│  SENTINEL    │  triggers
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
        history    ◀────│  CHRONICLER  │  recall
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │  CLINICIAN   │  assess (Gemini 2.5 Pro + grounding)
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
       ┌────────────┐   ┌─────────────┐   ┌─────────────┐
       │ CONCIERGE  │   │  DIPLOMAT   │   │   VOICE     │
       │ MCP tools  │   │  A2A peers  │   │ Gemini Live │
       └────────────┘   └─────────────┘   └─────────────┘
```

## Runtime topology (Cloud Run)

```
            ┌─────────────────────────────────────┐
            │  vitacare-web (Next.js)             │
            │  Cloud Run · public                 │
            └────────────────┬────────────────────┘
                             │ HTTPS + SSE
                             ▼
            ┌─────────────────────────────────────┐
            │  vitacare-agents (FastAPI + ADK)    │
            │  Cloud Run · public (auth-gated)    │
            │  ├── Sentinel/Chronicler/Clinician  │
            │  ├── Concierge → MCP clients        │
            │  ├── Diplomat → A2A endpoint        │
            │  └── Voice → Gemini Live + Twilio   │
            └──┬──────────────┬──────────┬────────┘
               │              │          │
       ┌───────▼───┐  ┌───────▼───┐  ┌───▼─────────┐
       │ Vertex AI │  │ Firestore │  │ Twilio +    │
       │ Vector +  │  │ state +   │  │ Google Cal  │
       │ Embeddings│  │ consent   │  │ (real APIs) │
       └───────────┘  └───────────┘  └─────────────┘
```

## A2A message shape

```python
A2AMessage(
    from_persona="ahmet",
    to_persona="selin",
    intent="request_action",
    category="vitals",
    subject="Dad's BP elevated 3 mornings — please coordinate a GP visit",
    payload={...},
    requires_consent=True,
)
```

Consent grid is checked *before* the message leaves the Diplomat:

```python
if msg.requires_consent and not can_share(self.consent, msg.to_persona, msg.category):
    return A2AReply(accepted=False, reason="consent denied: vitals → selin")
```

## Demo deployment plan

1. `gcloud run deploy vitacare-agents --source agents/`
2. `gcloud run deploy vitacare-web --source web/ --set-env-vars NEXT_PUBLIC_AGENT_API=https://vitacare-agents-xxx.run.app`
3. Map `vitacare.gravitilabs.com` → vitacare-web via Cloud Run domain mapping
4. Wire Google Calendar OAuth + Twilio credentials in vitacare-agents env
