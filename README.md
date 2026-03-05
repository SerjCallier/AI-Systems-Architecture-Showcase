# AI Systems Architecture Showcase

**English** | [Español](#español)

I'm Sergio Callier, Electronics & Telecommunications Engineer (UTN, Argentina). I've spent several years working at the intersection of telecom infrastructure and AI automation, with a focus on live streaming operations and digital media.

This repository shows three systems I built to solve concrete problems in that context.

---

## What's here

| Module | File | What it does |
|---|---|---|
| 01 — Scraper | `module_01_scraper/scrape-por-nicho.js` | Extracts and scores leads from Google Maps by niche |
| 02 — n8n Pipeline | `module_02_n8n_pipeline/MOTORES_INGESTA_Y_CAPTACION_V5.json` | Ingestion workflow with human-in-the-loop via Telegram |
| 03 — CommIntel | `module_03_comm_intel/comm_intel.py` | MCP dispatcher PoC for structuring organizational communications |

Each module has its own README with more detail.

---

## Module 01 — Stealth Maps Scraper

Google Maps scraper that classifies businesses by their web presence. The scoring logic came from a real observation: businesses with no website or minimal digital presence are the easiest to close for the services we sell.

Covers 8 niches across 6 countries (AR, ES, CL, UY, MX, CO). Generates ~4,000 scored leads/day with persistent deduplication.

**Stack:** Puppeteer + stealth plugin, Node.js, n8n webhook

---

## Module 02 — Agentic n8n Pipeline

n8n workflow that receives leads from the scraper and processes them: data cleaning, score-based triage, persistence to Google Sheets, and a Telegram notification so an operator can review high-score leads before they reach the CRM.

The human-in-the-loop is intentional — automating without oversight in a sales context carries a real reputational cost.

**Stack:** n8n, Google Sheets, Telegram Bot API

---

## Module 03 — Communication Intelligence (PoC)

Proof of concept: a system that converts Slack/Zoom transcripts into structured JSON records for HubSpot. Implements the MCP dispatcher pattern.

Still heuristic-based (regex + scoring), but the architecture is ready to plug in a real LLM at the classification layer.

**Stack:** Python, dataclasses, MCP pattern

---

## Background

Most of this work came from real automation projects for media and live streaming companies. The systems shown here are cleaned, anonymized versions of pieces that were or are in production.

If something looks useful or you want to talk through any of the modules, feel free to reach out via GitHub or LinkedIn.

---

<a name="español"></a>
## 🇦🇷 Español

Soy Sergio Callier, Ingeniero en Electrónica y Telecomunicaciones (UTN). Llevo varios años trabajando en el cruce entre infraestructura de telecomunicaciones y automatización con IA, con foco en operaciones de live streaming y media digital.

Este repositorio muestra tres sistemas que construí para resolver problemas concretos en ese contexto.

### Qué hay acá

| Módulo | Archivo | Qué hace |
|---|---|---|
| 01 — Scraper | `module_01_scraper/scrape-por-nicho.js` | Extrae y califica leads de Google Maps por nicho |
| 02 — Pipeline n8n | `module_02_n8n_pipeline/MOTORES_INGESTA_Y_CAPTACION_V5.json` | Workflow de ingesta con human-in-the-loop vía Telegram |
| 03 — CommIntel | `module_03_comm_intel/comm_intel.py` | PoC de dispatcher MCP para estructurar comunicaciones organizacionales |

Cada módulo tiene su propio README con más detalle.

### Module 01 — Stealth Maps Scraper

Scraper de Google Maps que clasifica negocios según su presencia web. La lógica de scoring surgió de una observación real: los negocios sin web o con presencia mínima son los que más fácil cierran para los servicios que vendemos.

Soporta 8 nichos y 6 países. Genera ~4.000 leads/día con deduplicación persistente.

### Module 02 — Agentic n8n Pipeline

Workflow n8n que recibe los leads del scraper y los procesa: limpieza de datos, triage por score, persistencia en Google Sheets y alerta Telegram para que un operador revise los leads de alto score antes de que lleguen al CRM.

El human-in-the-loop es intencional — automatizar sin supervisión en ventas tiene un costo de reputación alto.

### Module 03 — Communication Intelligence (PoC)

PoC de un sistema que convierte transcripts de Slack/Zoom en registros JSON estructurados para HubSpot. Implementa el patrón MCP dispatcher.

Aún es heurístico, pero la arquitectura está lista para conectar un LLM real en la capa de clasificación.

### Contexto

La mayor parte de este trabajo surgió de proyectos reales de automatización para empresas de media y live streaming. Los sistemas aquí mostrados son versiones limpias y anonimizadas de piezas que están o estuvieron en producción.

Si algo te parece útil o querés hablar sobre alguno de los módulos, podés escribirme por GitHub o LinkedIn.
