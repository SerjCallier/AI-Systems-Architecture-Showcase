# Module 01 — Stealth Maps Scraper

**English** | [Español](#español)

A Google Maps scraper built with Puppeteer + stealth plugin that extracts businesses and classifies them by sales potential based on their web presence.

The idea came from a concrete problem: we needed qualified leads of businesses with **little or no digital presence** — those are the ideal customers for the services we sell.

## How it works

1. Iterates over a map of niches and cities (see `NICHES` in the code)
2. Searches Google Maps and extracts name, website and phone
3. Assigns a score (0–10) based on web presence:
   - No website → 8 pts (highest opportunity)
   - Social media only → 6 pts
   - Free website builder (Wix, Tiendanube...) → 4 pts
   - Real website → 0 pts (goes to full audit pipeline)
4. If the score exceeds the threshold, sends the lead via webhook to the n8n pipeline
5. Saves all results to a local JSON for persistent deduplication

## Stack

- `puppeteer-extra` + `puppeteer-extra-plugin-stealth`
- `axios` for the webhook
- n8n receives the data on the other end (see Module 02)

## Basic configuration

Edit the constants in `CONFIG`:
```js
const CONFIG = {
  MAX_LEADS: 250,         // leads per session
  WEBHOOK_URL: '...',     // n8n endpoint
  YIELD_THRESHOLD: 5      // minimum score to forward
};
```

> Runs in headless mode. Added user-agent rotation and random delays to avoid detection.

---

<a name="español"></a>
## 🇦🇷 Español

Scraper construido con Puppeteer + plugin stealth para extraer negocios de Google Maps y clasificarlos por potencial de venta.

La idea surgió de un problema concreto: queríamos leads calificados de negocios que **no tienen sitio web o tienen presencia digital mínima** — esos son los clientes ideales para los servicios que vendemos.

### Cómo funciona

1. Itera sobre un mapa de nichos y ciudades (ver `NICHES` en el código)
2. Busca en Google Maps y extrae nombre, web y teléfono
3. Asigna un score (0-10) según presencia web:
   - Sin web → 8 pts (máxima oportunidad)
   - Solo redes → 6 pts
   - Web gratuita (Wix, Tiendanube...) → 4 pts
   - Web real → 0 pts (pasa a auditoría completa)
4. Si el score supera el umbral, envía el lead via webhook al pipeline n8n
5. Guarda todos los resultados en un JSON local para deduplicación histórica

### Configuración básica

```js
const CONFIG = {
  MAX_LEADS: 250,         // leads por sesión
  WEBHOOK_URL: '...',     // endpoint n8n
  YIELD_THRESHOLD: 5      // score mínimo para enviar
};
```

> Corre en headless. Agregué rotación de user-agents y delays aleatorios para no levantar flags.
