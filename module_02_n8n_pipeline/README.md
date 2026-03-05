# Module 02 — n8n Ingestion Pipeline

Workflow n8n que recibe los leads del scraper, los limpia y los triega antes de que lleguen al CRM.

El archivo `.json` es el export del workflow — se puede importar directo en n8n.

## Flujo general

```
Webhook → JS Sanitizer → Google Sheets → VIP Filter → Telegram Alert → Deep Audit Bridge
```

- **Webhook Receiver**: escucha POST en `/maps-leads`
- **Data Sanitizer (JS)**: limpia el payload, normaliza strings, convierte tipos
- **Google Sheets**: persiste todos los leads (trazabilidad completa)
- **VIP Filter**: si el score >= 3, deriva a revisión humana
- **Telegram Alert**: el operador recibe el lead y decide si continuar con auditoría
- **Deep Audit Bridge**: conecta con el sistema de auditoría web (30s timeout explícito)

## Por qué Telegram para human-in-the-loop

Simple: es donde ya estaba el equipo. No queríamos agregar otra herramienta. El operador aprueba o descarta desde el teléfono, y el workflow continúa o se detiene.

## Confiabilidad

- Todos los registros van a Sheets independientemente del score → no se pierde nada
- El filtro de score evita saturar al operador con leads de baja calidad
- Los timeouts son explícitos en cada nodo externo
