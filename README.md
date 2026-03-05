# AI Systems Architecture Showcase

Soy Sergio Callier, Ingeniero en Electrónica y Telecomunicaciones (UTN). Llevo varios años trabajando en el cruce entre infraestructura de telecomunicaciones y automatización con IA, con foco en operaciones de live streaming y media digital.

Este repositorio muestra tres sistemas que construí para resolver problemas concretos en ese contexto.

---

## Qué hay acá

| Módulo | Archivo | Qué hace |
|---|---|---|
| 01 — Scraper | `module_01_scraper/scrape-por-nicho.js` | Extrae y califica leads de Google Maps por nicho |
| 02 — Pipeline n8n | `module_02_n8n_pipeline/MOTORES_INGESTA_Y_CAPTACION_V5.json` | Workflow de ingesta con human-in-the-loop vía Telegram |
| 03 — CommIntel | `module_03_comm_intel/comm_intel.py` | PoC de dispatcher MCP para estructurar comunicaciones organizacionales |

Cada módulo tiene su propio README con más detalle.

---

## Module 01 — Stealth Maps Scraper

Scraper de Google Maps que clasifica negocios según su presencia web. La lógica de scoring surgió de una observación real: los negocios sin web o con Wix son los que más necesitan los servicios que vendemos, y los que más fácil cierran.

Soporta 8 nichos y 6 países (AR, ES, CL, UY, MX, CO). Genera ~4.000 leads/día con deduplicación persistente.

**Stack:** Puppeteer + stealth plugin, Node.js, webhook a n8n

---

## Module 02 — Agentic n8n Pipeline

Workflow n8n que recibe los leads del scraper y los procesa: limpieza de datos, score-based triage, persistencia en Google Sheets y notificación vía Telegram para que un operador revise los leads de alto score antes de que toquen el CRM.

El human-in-the-loop es intencional — automatizar sin supervisión en etapa de ventas tiene un costo de reputación alto.

**Stack:** n8n, Google Sheets, Telegram Bot API

---

## Module 03 — Communication Intelligence (PoC)

Prueba de concepto de un sistema que convierte transcripts de Slack/Zoom en registros JSON estructurados para HubSpot. Implementa el patrón MCP dispatcher.

Aún es heurístico (regex + scoring), pero la arquitectura está lista para conectar un LLM real en la capa de clasificación.

**Stack:** Python, dataclasses, MCP pattern

---

## Contexto

La mayor parte de este trabajo surgió de proyectos reales de automatización para empresas de media y live streaming. Los sistemas aquí mostrados son versiones limpias y anonimizadas de piezas que están o estuvieron en producción.

Si algo te parece útil o querés hablar sobre alguno de los módulos, podés escribirme por GitHub o LinkedIn.
