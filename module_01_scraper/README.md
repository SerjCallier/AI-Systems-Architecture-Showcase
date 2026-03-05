# Module 01 — Stealth Maps Scraper

Scraper construido con Puppeteer + plugin stealth para extraer negocios de Google Maps y clasificarlos por potencial de venta.

La idea surgió de un problema concreto: queríamos leads calificados de negocios que **no tienen sitio web o tienen presencia digital mínima** — esos son los clientes ideales para los servicios que vendemos.

## Cómo funciona

1. Itera sobre un mapa de nichos y ciudades (ver `NICHES` en el código)
2. Busca en Google Maps y extrae nombre, web y teléfono
3. Asigna un score (0-10) según presencia web:
   - Sin web → 8 pts (máxima oportunidad)
   - Solo redes → 6 pts
   - Web gratuita (Wix, Tiendanube...) → 4 pts
   - Web real → 0 pts (pasa a auditoría completa)
4. Si el score supera el umbral, envía el lead via webhook al pipeline n8n
5. Guarda todos los resultados en un JSON local para deduplicación histórica

## Stack

- `puppeteer-extra` + `puppeteer-extra-plugin-stealth`
- `axios` para el webhook
- n8n recibe la data en el otro extremo (ver Module 02)

## Configuración básica

Editar las constantes en `CONFIG`:
```js
const CONFIG = {
  MAX_LEADS: 250,               // leads por sesión
  WEBHOOK_URL: '...',           // endpoint n8n
  YIELD_THRESHOLD: 5            // score mínimo para enviar
};
```

> El scraper corre en headless. Agregué rotación de user-agents y delays aleatorios para no levantar flags.
