# Module 03 — Communication Intelligence (PoC)

**English** | [Español](#español)

A Python script implementing an MCP dispatcher pattern to convert Slack, Zoom, and Email messages into structured JSON records ready for HubSpot CRM.

The goal: too much valuable information gets buried in chats and calls. This is a first attempt at capturing it automatically.

## How it works

1. Receives raw text from any source (Slack, Zoom transcript, email)
2. Detects the origin (`classify_source`)
3. Extracts participants and decisions with regex
4. Assigns a `confidence_score` based on the number of entities found
5. If above threshold (0.75), the record is classified as `DECISION` and queued for CRM
6. Returns a `CommRecord` serialized as JSON

## Example: Input → Output

**Input** (raw Slack message):
```
[Slack] @javier decided: migrate all automation flows to n8n before Q2.
@lucia will handle the transition plan. @marcos to document current workflows.
```

**Output** (structured `CommRecord`):
```json
{
  "record_id": "a3f1c2d4-7e6b-4c3a-9f2e-1b0d8c5a7f3e",
  "source_type": "slack",
  "record_type": "decision",
  "summary": "",
  "action_items": [],
  "confidence_score": 0.9
}
```

> `confidence_score` = 3 participants × 0.2 + 1 decision × 0.3 = 0.9 → above threshold → routed as `decision` to HubSpot.

## Current limitations (this is a PoC)

- Classification is heuristic (regex), no NLP model yet
- The 0.75 threshold is arbitrary — needs calibration with real data
- No persistence: each run is independent

> Natural next step: replace `extract_entities` with an LLM call for real semantic classification.

---

<a name="español"></a>
## 🇦🇷 Español

Script Python que implementa un dispatcher MCP para convertir mensajes de Slack, Zoom y Email en registros JSON estructurados listos para HubSpot.

La idea es simple: hay demasiada información valiosa que queda sepultada en chats y calls. Esto es un primer intento de capturarla automáticamente.

## Ejemplo: Input → Output

**Input** (mensaje Slack crudo):
```
[Slack] @javier decided: migrate all automation flows to n8n before Q2.
@lucia will handle the transition plan. @marcos to document current workflows.
```

**Output** (`CommRecord` estructurado):
```json
{
  "record_id": "a3f1c2d4-7e6b-4c3a-9f2e-1b0d8c5a7f3e",
  "source_type": "slack",
  "record_type": "decision",
  "summary": "",
  "action_items": [],
  "confidence_score": 0.9
}
```

> `confidence_score` = 3 participantes × 0.2 + 1 decisión × 0.3 = 0.9 → supera umbral → se rutea como `decision` a HubSpot.

## Cómo funciona

1. Recibe texto crudo de cualquier fuente (Slack, Zoom transcript, email)
2. Detecta el origen (`classify_source`)
3. Extrae participantes y decisiones con regex
4. Asigna un `confidence_score` basado en la cantidad de entidades encontradas
5. Si supera el umbral (0.75), el registro se clasifica como `DECISION` y va a CRM
6. Devuelve un `CommRecord` serializado en JSON

## Limitaciones actuales (es un PoC)

- La clasificación es heurística (regex), no hay modelo de NLP todavía
- El threshold de 0.75 es arbitrario — habría que calibrar con datos reales
- No hay persistencia: cada run es independiente

> Próximo paso natural: reemplazar `extract_entities` con un llamado a un LLM para clasificación semántica real.
