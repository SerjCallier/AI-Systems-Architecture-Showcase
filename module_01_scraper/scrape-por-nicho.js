/**
 * Module 01 - Stealth Maps Scraper
 * Global Edition v2.4
 *
 * Scraper de Google Maps por nicho para generación de leads calificados.
 * Cubre AR, ES, CL, UY, MX, CO. Integra webhook a n8n para procesamiento posterior.
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const CONFIG = {
  MAX_LEADS: 250,
  WEBHOOK_URL: 'http://localhost:5678/webhook/maps-leads',
  YIELD_THRESHOLD: 5
};

const DB_PATH = path.join(__dirname, '..', 'data', 'scraped_leads_db.json');

const processedPlaces = new Set();
let totalLeadsFound = 0;

function loadHistoricalDB() {
  if (!fs.existsSync(DB_PATH)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    return new Set(data.map(l => (l.name || '').toLowerCase().trim()));
  } catch (e) { return new Set(); }
}

function saveToHistoricalDB(lead) {
  let current = [];
  if (fs.existsSync(DB_PATH)) {
    try { current = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch (e) {}
  }
  current.push(lead);
  fs.writeFileSync(DB_PATH, JSON.stringify(current, null, 2));
}

const COUNTRY_MAP = {
  'argentina': 'AR', 'chile': 'CL', 'espana': 'ES',
  'uruguay': 'UY', 'mexico': 'MX', 'colombia': 'CO'
};

// Nichos validados en producción. TODO: ampliar cobertura para CL y UY
const NICHES = {
  estetica: [
    "clinica medicina estetica madrid ES", "depilacion laser premium madrid ES",
    "clinica estetica barcelona ES", "barberia premium madrid ES",
    "clinica estetica recoleta AR", "spa boutique palermo AR",
    "clinica medicina estetica las condes CL", "barberia premium providencia CL",
    "clinica estetica polanco MX", "clinica estetica el poblado medellin CO"
  ],
  dental: [
    "clinica dental implantes madrid ES", "ortodoncia invisible barcelona ES",
    "odontologia lujo recoleta AR", "clinica dental las condes CL",
    "implantes dentales polanco MX", "odontologia premium bogota CO"
  ],
  reformas: [
    "reformas integrales lujo madrid ES", "reformas premium palermo AR",
    "reformas lujo las condes CL", "arquitectura interiores cdmx MX"
  ],
  legal: [
    "asesoria fiscal empresas madrid ES", "estudio contable puerto madero AR",
    "asesoria fiscal providencia CL", "consultoria fiscal polanco MX"
  ],
  inmobiliaria: [
    "inmobiliaria lujo madrid ES", "inmobiliaria puerto madero AR",
    "inmobiliaria las condes CL", "inmobiliaria polanco MX"
  ],
  logistica: [
    "empresa importacion madrid ES", "despachante aduana buenos aires AR",
    "logistica internacional cdmx MX", "importaciones bogota CO"
  ],
  industrial: [
    "maquinaria industrial madrid ES", "insumos industriales cordoba AR",
    "maquinaria industrial monterrey MX", "insumos industriales medellin CO"
  ],
  turismo: [
    "hotel boutique madrid ES", "hotel boutique palermo AR",
    "resort punta del este UY", "hoteles boutique cartagena CO"
  ]
};

/**
 * Scoring por presencia web (0-10).
 * Un negocio sin web o con presencia mínima puntúa más alto — mayor oportunidad.
 */
function scoreLeadByWebPresence(websiteUrl) {
  if (!websiteUrl) return 8;                                              // NO_WEBSITE
  if (/instagram|facebook|linktr/i.test(websiteUrl)) return 6;           // SOCIAL_ONLY
  if (/wix|webnode|tiendanube|jimdo/i.test(websiteUrl)) return 4;        // FREE_SUBDOMAIN
  return 0; // tiene web real → pasa a auditoría completa
}

async function scrapeNiche(page, query, historicalDB) {
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForTimeout(2000 + Math.random() * 1500);

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-result-index]')).map(el => ({
      name: el.querySelector('.fontHeadlineSmall')?.textContent?.trim() || '',
      website: el.querySelector('a[data-tooltip="Abrir sitio web"]')?.href || null,
      phone: el.querySelector('[data-tooltip*="Llamar"]')?.textContent?.trim() || null
    }));
  });

  for (const place of results) {
    if (!place.name) continue;
    const key = place.name.toLowerCase().trim();
    if (processedPlaces.has(key) || historicalDB.has(key)) continue;

    processedPlaces.add(key);
    const score = scoreLeadByWebPresence(place.website);
    const lead = { ...place, score, query, timestamp: new Date().toISOString() };
    saveToHistoricalDB(lead);

    if (score >= CONFIG.YIELD_THRESHOLD) {
      try {
        await axios.post(CONFIG.WEBHOOK_URL, lead, { timeout: 5000 });
        totalLeadsFound++;
      } catch (e) {
        console.warn(`Webhook error for "${place.name}": ${e.message}`);
      }
    }

    if (totalLeadsFound >= CONFIG.MAX_LEADS) return;
  }
}

async function main() {
  const historicalDB = loadHistoricalDB();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/119 Safari/537.36'
  ];
  await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
  await page.setViewport({ width: 1366, height: 768 });

  for (const [niche, queries] of Object.entries(NICHES)) {
    for (const query of queries) {
      if (totalLeadsFound >= CONFIG.MAX_LEADS) break;
      console.log(`[${niche}] → ${query}`);
      await scrapeNiche(page, query, historicalDB);
    }
  }

  await browser.close();
  console.log(`\nTotal leads generados: ${totalLeadsFound}`);
}

main().catch(console.error);
