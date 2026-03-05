# Module 03 — Communication Intelligence (PoC)

Script Python que implementa un dispatcher MCP para convertir mensajes de Slack, Zoom y Email en registros JSON estructurados listos para HubSpot.

La idea es simple: hay demasiada información valiosa que queda sepultada en chats y calls. Esto es un primer intento de capturarla automáticamente.

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

## Ejemplo de output

```json
{
  "record_id": "a3f1...",
  "source_type": "slack",
  "record_type": "decision",
  "summary": "",
  "action_items": [],
  "confidence_score": 0.5
}
```

> Próximo paso natural: reemplazar `extract_entities` con un llamado a un LLM para clasificación semántica real.
