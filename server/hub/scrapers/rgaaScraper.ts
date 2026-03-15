/**
 * rgaaScraper.ts
 * Scrape les critères, tests et glossaire RGAA 4.1.2
 * Collection cible : rgaa_referential
 *
 * Stratégie (par ordre de priorité) :
 *  1. Chunks locaux (chunksScraper)  — 0 réseau, ~600 docs riches avec méthodologies
 *  2. Fetch live RGAA                — fallback si chunks absents
 *  3. Fallback JSON local            — dernier recours (server/hub/data/rgaa-4.1.2.json)
 *
 * IDs   : sha256("rgaa|{key}|{text_preview}") via makeScrapedDocumentId
 */

import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs/promises";
import { fetchWithRetry, makeScrapedDocumentId, stripHtml } from "./types";
import type { ScrapedDocument, ScrapeResult } from "./types";
import { scrapeFromChunks } from "./chunksScraper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RGAA_CRITERIA_URL = "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/";
const RGAA_GLOSSARY_URL = "https://accessibilite.numerique.gouv.fr/methode/glossaire/";
const FALLBACK_JSON_PATH = path.join(__dirname, "..", "data", "rgaa-4.1.2.json");
const QUALITY_GATE_MIN = 80;

// ─── Types du fallback JSON ───────────────────────────────────────────────────

interface RgaaFallbackCriterion {
  reference: string;
  title: string;
  wcagLevel?: string;
  tests?: string[];
  mappings?: { wcag?: string[] };
}

interface RgaaFallbackThematic {
  id: number;
  name: string;
  criteria: RgaaFallbackCriterion[];
}

interface RgaaFallbackGlossaryEntry {
  term: string;
  definition: string;
}

interface RgaaFallbackData {
  version: string;
  thematics: RgaaFallbackThematic[];
  glossary?: RgaaFallbackGlossaryEntry[];
}

// ─── Fallback JSON local ──────────────────────────────────────────────────────

async function loadFallbackJson(): Promise<RgaaFallbackData | null> {
  try {
    const raw = await fs.readFile(FALLBACK_JSON_PATH, "utf-8");
    return JSON.parse(raw) as RgaaFallbackData;
  } catch {
    console.warn("[Scraper/RGAA] Fallback JSON introuvable:", FALLBACK_JSON_PATH);
    return null;
  }
}

function buildDocumentsFromFallback(data: RgaaFallbackData, scrapedAt: string): ScrapedDocument[] {
  const docs: ScrapedDocument[] = [];

  for (const thematic of data.thematics) {
    for (const criterion of thematic.criteria) {
      const wcagRef = criterion.mappings?.wcag?.join(", ") ?? "";
      const critText = [
        `Critère RGAA ${criterion.reference} [${thematic.name}] : ${criterion.title}`,
        criterion.wcagLevel ? `Niveau WCAG : ${criterion.wcagLevel}` : "",
        wcagRef ? `Correspondances WCAG : ${wcagRef}` : "",
      ].filter(Boolean).join("\n");

      docs.push({
        id: makeScrapedDocumentId("rgaa", `crit-${criterion.reference}`, critText),
        text: critText,
        collection: "rgaa_referential",
        metadata: {
          source: "rgaa",
          url: `${RGAA_CRITERIA_URL}#${criterion.reference}`,
          criterion: criterion.reference,
          thematic: thematic.name,
          type: "criterion",
          lang: "fr",
          scrapedAt,
        },
      });

      if (criterion.tests) {
        for (const testRef of criterion.tests) {
          const testText = `Test RGAA ${testRef} [${thematic.name}] : Ce test vérifie la conformité au critère ${criterion.reference} (${criterion.title}).`;
          docs.push({
            id: makeScrapedDocumentId("rgaa", `test-${testRef}`, testText),
            text: testText,
            collection: "rgaa_referential",
            metadata: {
              source: "rgaa",
              url: `${RGAA_CRITERIA_URL}#${testRef}`,
              criterion: criterion.reference,
              test: testRef,
              thematic: thematic.name,
              type: "test",
              lang: "fr",
              scrapedAt,
            },
          });
        }
      }
    }
  }

  // Glossaire
  for (const entry of data.glossary ?? []) {
    const text = `Glossaire RGAA — ${entry.term} : ${entry.definition}`;
    docs.push({
      id: makeScrapedDocumentId("rgaa", `glossary-${entry.term}`, text),
      text: text.slice(0, 1200),
      collection: "rgaa_referential",
      metadata: {
        source: "rgaa",
        url: RGAA_GLOSSARY_URL,
        type: "glossary",
        lang: "fr",
        scrapedAt,
      },
    });
  }

  return docs;
}

// ─── Scraping live (fallback réseau) ─────────────────────────────────────────

const RGAA_THEME_NAMES: Record<string, string> = {
  "1": "Images", "2": "Cadres", "3": "Couleurs", "4": "Multimédia",
  "5": "Tableaux", "6": "Liens", "7": "Scripts", "8": "Éléments obligatoires",
  "9": "Structuration de l'information", "10": "Présentation de l'information",
  "11": "Formulaires", "12": "Navigation", "13": "Consultation",
};

async function scrapeRgaaLive(scrapedAt: string): Promise<{ documents: ScrapedDocument[]; errors: string[] }> {
  const documents: ScrapedDocument[] = [];
  const errors: string[] = [];

  // Critères
  try {
    const res = await fetchWithRetry(RGAA_CRITERIA_URL, {}, 3, 30_000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const criterionPattern = /Crit[eè]re\s+(\d+\.\d+)[^<]*<\/[^>]+>([\s\S]*?)(?=Crit[eè]re\s+\d+\.\d+|<\/(?:section|article)>|$)/gi;

    const thematicMap = new Map<string, string>();
    const thematicPattern = /<h2[^>]*>\s*(\d+)\.\s+([^<]+)<\/h2>/gi;
    let thMatch: RegExpExecArray | null;
    while ((thMatch = thematicPattern.exec(html)) !== null) {
      thematicMap.set(thMatch[1], stripHtml(thMatch[2]).trim());
    }

    let cMatch: RegExpExecArray | null;
    while ((cMatch = criterionPattern.exec(html)) !== null) {
      const ref = cMatch[1];
      const rawBlock = cMatch[2];
      const thematicNum = ref.split(".")[0];
      const thematic = thematicMap.get(thematicNum) ?? RGAA_THEME_NAMES[thematicNum] ?? `Thématique ${thematicNum}`;
      const title = stripHtml(rawBlock).slice(0, 250).trim();
      const testRefs = Array.from(new Set(Array.from(rawBlock.matchAll(/\b(\d+\.\d+\.\d+)\b/g)).map(m => m[1])));

      if (!ref || title.length <= 10) continue;

      const critText = `Critère RGAA ${ref} [${thematic}] : ${title}`;
      documents.push({
        id: makeScrapedDocumentId("rgaa", `crit-${ref}`, critText),
        text: critText,
        collection: "rgaa_referential",
        metadata: { source: "rgaa", url: `${RGAA_CRITERIA_URL}#${ref}`, criterion: ref, thematic, type: "criterion", lang: "fr", scrapedAt },
      });

      for (const testRef of testRefs) {
        const testText = `Test RGAA ${testRef} [${thematic}] : Ce test est rattaché au critère ${ref}.`;
        documents.push({
          id: makeScrapedDocumentId("rgaa", `test-${testRef}`, testText),
          text: testText,
          collection: "rgaa_referential",
          metadata: { source: "rgaa", url: `${RGAA_CRITERIA_URL}#${testRef}`, criterion: ref, test: testRef, thematic, type: "test", lang: "fr", scrapedAt },
        });
      }
    }
  } catch (e) {
    errors.push(`critères: ${(e as Error).message}`);
  }

  // Glossaire
  try {
    const res = await fetchWithRetry(RGAA_GLOSSARY_URL, {}, 3, 30_000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const dtddPattern = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
    let match: RegExpExecArray | null;
    while ((match = dtddPattern.exec(html)) !== null) {
      const term = stripHtml(match[1]).trim();
      const def = stripHtml(match[2]).trim();
      if (!term || def.length <= 10) continue;
      const text = `Glossaire RGAA — ${term} : ${def.slice(0, 600)}`;
      documents.push({
        id: makeScrapedDocumentId("rgaa", `glossary-${term}`, text),
        text: text.slice(0, 1200),
        collection: "rgaa_referential",
        metadata: { source: "rgaa", url: RGAA_GLOSSARY_URL, type: "glossary", lang: "fr", scrapedAt },
      });
    }
  } catch (e) {
    errors.push(`glossaire: ${(e as Error).message}`);
  }

  return { documents, errors };
}

// ─── Point d'entrée public ───────────────────────────────────────────────────

/**
 * Priorité :
 *  1. Chunks locaux (riches, 0-réseau)
 *  2. Scraping live RGAA (fallback réseau)
 *  3. JSON embarqué (dernier recours)
 */
export async function scrapeRgaa(): Promise<{
  documents: ScrapedDocument[];
  result: ScrapeResult;
  usedFallback: boolean;
}> {
  const startedAt = Date.now();
  const scrapedAt = new Date().toISOString();

  // ── 1. Tentative chunks locaux ────────────────────────────────────────────
  console.log("[Scraper/RGAA] Tentative chunks locaux...");
  const { documents: chunkDocs, result: chunkResult } = await scrapeFromChunks();
  const chunkCriteria = chunkDocs.filter(d => d.metadata.type === "criterion").length;

  if (chunkCriteria >= QUALITY_GATE_MIN) {
    console.log(`[Scraper/RGAA] Chunks locaux OK : ${chunkDocs.length} documents (${chunkCriteria} critères)`);
    return { documents: chunkDocs, result: { ...chunkResult, source: "rgaa" }, usedFallback: false };
  }

  console.warn(`[Scraper/RGAA] Chunks insuffisants (${chunkCriteria} critères) → fallback live`);

  // ── 2. Scraping live RGAA ────────────────────────────────────────────────
  console.log("[Scraper/RGAA] Tentative scraping live...");
  const { documents: liveDocs, errors } = await scrapeRgaaLive(scrapedAt);
  const liveCriteria = liveDocs.filter(d => d.metadata.type === "criterion").length;

  if (liveCriteria >= QUALITY_GATE_MIN) {
    console.log(`[Scraper/RGAA] Live OK : ${liveDocs.length} documents`);
    return {
      documents: liveDocs,
      result: { source: "rgaa", success: true, count: liveDocs.length, errors, durationMs: Date.now() - startedAt },
      usedFallback: false,
    };
  }

  // ── 3. Fallback JSON embarqué ─────────────────────────────────────────────
  console.warn(`[Scraper/RGAA] Live insuffisant (${liveCriteria} critères) → fallback JSON`);
  const fallback = await loadFallbackJson();

  if (fallback) {
    const fallbackDocs = buildDocumentsFromFallback(fallback, scrapedAt);
    console.log(`[Scraper/RGAA] Fallback JSON : ${fallbackDocs.length} documents (v${fallback.version})`);
    return {
      documents: fallbackDocs,
      result: {
        source: "rgaa",
        success: true,
        count: fallbackDocs.length,
        errors: [`Fallback JSON utilisé (chunks: ${chunkCriteria}, live: ${liveCriteria})`, ...errors],
        durationMs: Date.now() - startedAt,
      },
      usedFallback: true,
    };
  }

  // Aucune source disponible
  console.error("[Scraper/RGAA] Toutes les sources ont échoué");
  return {
    documents: [],
    result: { source: "rgaa", success: false, count: 0, errors: ["Chunks, live et JSON indisponibles"], durationMs: Date.now() - startedAt },
    usedFallback: true,
  };
}
