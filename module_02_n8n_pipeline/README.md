# Module 02 — n8n Ingestion Pipeline

**English** | [Español](#español)

n8n workflow that receives leads from the scraper, cleans them, and triages them before they reach the CRM.

The `.json` file is a workflow export — it can be imported directly into n8n.

## Flow overview

```
Webhook → JS Sanitizer → Google Sheets → VIP Filter → Telegram Alert → Deep Audit Bridge
```

- **Webhook Receiver**: listens for POST on `/maps-leads`
- **Data Sanitizer (JS)**: cleans the payload, normalizes strings, converts types
- **Google Sheets**: persists all leads (full auditability)
- **VIP Filter**: if score >= 3, routes to human review
- **Telegram Alert**: operator receives the lead and decides whether to continue
- **Deep Audit Bridge**: connects to the web audit system (explicit 30s timeout)

## Why Telegram for human-in-the-loop

Simple: that's where the team already was. We didn't want to add another tool. The operator approves or discards from their phone, and the workflow continues or stops accordingly.

## Reliability

- All records go to Sheets regardless of score → nothing gets lost
- Score-based filter prevents flooding the operator with low-quality leads
- Timeouts are explicit on every external node

---

<a name="español"></a>
## 🇦🇷 Español

Workflow n8n que recibe los leads del scraper, los limpia y los triega antes de que lleguen al CRM.

El archivo `.json` es el export del workflow — se puede importar directo en n8n.

### Flujo general

```
Webhook → JS Sanitizer → Google Sheets → VIP Filter → Telegram Alert → Deep Audit Bridge
```

- **Webhook Receiver**: escucha POST en `/maps-leads`
- **Data Sanitizer (JS)**: limpia el payload, normaliza strings, convierte tipos
- **Google Sheets**: persiste todos los leads (trazabilidad completa)
- **VIP Filter**: si el score >= 3, deriva a revisión humana
- **Telegram Alert**: el operador recibe el lead y decide si continuar
- **Deep Audit Bridge**: conecta con el sistema de auditoría web (30s timeout explícito)

### Por qué Telegram para human-in-the-loop

Simple: es donde ya estaba el equipo. No queríamos agregar otra herramienta. El operador aprueba o descarta desde el teléfono, y el workflow continúa o se detiene.

### Confiabilidad

- Todos los registros van a Sheets independientemente del score → no se pierde nada
- El filtro de score evita saturar al operador con leads de baja calidad
- Los timeouts son explícitos en cada nodo externo
