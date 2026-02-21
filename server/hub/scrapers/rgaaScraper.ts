/**
 * rgaaScraper.ts
 * Scrape les critères, tests et glossaire RGAA 4.1.2.
 * Collection cible : rgaa_referential
 *
 * Stratégie :
 *  1. Fetch https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/
 *  2. Parse HTML → extrait thématiques + critères + tests
 *  3. Quality Gate : si < 80 critères → fallback rgaa-4.1.2.json (committé)
 *  4. Fetch https://accessibilite.numerique.gouv.fr/methode/glossaire/ → entrées glossaire
 *
 * IDs   : sha256("rgaa|{criterionRef}|{text_preview}")
 * Fallback : server/hub/data/rgaa-4.1.2.json (toujours disponible)
 */

import * as path from "path";
import * as fs from "fs/promises";
import { fetchWithRetry, makeScrapedDocumentId, stripHtml } from "./types";
import type { ScrapedDocument, ScrapeResult } from "./types";

const RGAA_CRITERIA_URL =
  "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/";
const RGAA_GLOSSARY_URL =
  "https://accessibilite.numerique.gouv.fr/methode/glossaire/";

const FALLBACK_JSON_PATH = path.join(
  __dirname,
  "..",
  "data",
  "rgaa-4.1.2.json",
);

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

// ─── Parse HTML live ──────────────────────────────────────────────────────────

interface ParsedCriterion {
  reference: string;
  thematic: string;
  title: string;
  tests: string[];
  raw: string;
}

function parseRgaaHtml(html: string): ParsedCriterion[] {
  const criteria: ParsedCriterion[] = [];

  // L'URL présente les critères sous des ancres #1, #1.1, etc.
  // Structure : sections h2 (thématiques) → sections article/div (critères)

  // Chercher les blocs de critères via pattern Critère X.Y
  // Le HTML est généré par un framework (Vue/Nuxt) mais lisible en statique
  const criterionPattern =
    /Crit[eè]re\s+(\d+\.\d+)[^<]*<\/[^>]+>([\s\S]*?)(?=Crit[eè]re\s+\d+\.\d+|<\/(?:section|article)>|$)/gi;

  // Extraire les thématiques (h2 ou strong with "1. Images" etc.)
  const thematicMap = new Map<string, string>();
  const thematicPattern =
    /<h2[^>]*>\s*(\d+)\.\s+([^<]+)<\/h2>/gi;
  let thMatch: RegExpExecArray | null;
  while ((thMatch = thematicPattern.exec(html)) !== null) {
    thematicMap.set(thMatch[1], stripHtml(thMatch[2]).trim());
  }

  let cMatch: RegExpExecArray | null;
  while ((cMatch = criterionPattern.exec(html)) !== null) {
    const ref = cMatch[1];
    const rawBlock = cMatch[2];

    // Extraire le numéro de thématique depuis la référence (ex: "1.3" → "1")
    const thematicNum = ref.split(".")[0];
    const thematic = thematicMap.get(thematicNum) ?? `Thématique ${thematicNum}`;

    // Extraire la question du critère (premier fragment de texte significatif)
    const title = stripHtml(rawBlock).slice(0, 250).trim();

    // Extraire les tests mentionnés (pattern "1.1.1", "1.1.2")
    const testRefs = Array.from(rawBlock.matchAll(/\b(\d+\.\d+\.\d+)\b/g)).map(
      (m) => m[1],
    );

    const raw = `Critère RGAA ${ref} [${thematic}] : ${title}`;

    if (ref && title.length > 10) {
      criteria.push({ reference: ref, thematic, title, tests: testRefs, raw });
    }
  }

  // Fallback si le pattern HTML a raté — essayer avec les ancres de liens
  if (criteria.length < 10) {
    const anchorPattern =
      /#(\d+\.\d+)['"]/g;
    const anchorRefs = new Set<string>();
    let aMatch: RegExpExecArray | null;
    while ((aMatch = anchorPattern.exec(html)) !== null) {
      anchorRefs.add(aMatch[1]);
    }

    // Si aucun critère parsé mais des refs trouvées → le HTML est probablement SSR
    // Dans ce cas le fallback JSON sera utilisé automatiquement
    console.warn(
      `[Scraper/RGAA] Parse HTML: seulement ${criteria.length} critères (${anchorRefs.size} refs détectées)`,
    );
  }

  return criteria;
}

interface GlossaryEntry {
  term: string;
  definition: string;
}

function parseGlossaryHtml(html: string): GlossaryEntry[] {
  const entries: GlossaryEntry[] = [];

  // Motif : <dt>...</dt><dd>...</dd>
  const dtddPattern = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
  let match: RegExpExecArray | null;

  while ((match = dtddPattern.exec(html)) !== null) {
    const term = stripHtml(match[1]).trim();
    const def = stripHtml(match[2]).trim();
    if (term && def.length > 10) {
      entries.push({ term, definition: def.slice(0, 600) });
    }
  }

  // Fallback : h3 + section
  if (entries.length < 5) {
    const termPattern =
      /<h[23][^>]*id="([^"]+)"[^>]*>([^<]+)<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((match = termPattern.exec(html)) !== null) {
      const term = stripHtml(match[2]).trim();
      const def = stripHtml(match[3]).trim();
      if (term && def.length > 10) {
        entries.push({ term, definition: def.slice(0, 600) });
      }
    }
  }

  return entries;
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

function buildDocumentsFromFallback(
  data: RgaaFallbackData,
  scrapedAt: string,
): ScrapedDocument[] {
  const docs: ScrapedDocument[] = [];

  for (const thematic of data.thematics) {
    // 1 doc par thématique (résumé)
    const thematicText = `Thématique RGAA ${thematic.id}. ${thematic.name} — ${thematic.criteria.length} critères`;
    docs.push({
      id: makeScrapedDocumentId("rgaa", `thematic-${thematic.id}`, thematicText),
      text: thematicText,
      collection: "rgaa_referential",
      metadata: {
        source: "rgaa",
        url: `${RGAA_CRITERIA_URL}#${thematic.id}`,
        thematic: thematic.name,
        type: "criterion",
        lang: "fr",
        scrapedAt,
      },
    });

    // 1 doc par critère
    for (const criterion of thematic.criteria) {
      const wcagRef = criterion.mappings?.wcag?.join(", ") ?? "";
      const testsList = criterion.tests?.join(", ") ?? "";
      const text = [
        `Critère RGAA ${criterion.reference} [${thematic.name}] : ${criterion.title}`,
        criterion.wcagLevel ? `Niveau WCAG : ${criterion.wcagLevel}` : "",
        wcagRef ? `Correspondances WCAG : ${wcagRef}` : "",
        testsList ? `Tests : ${testsList}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      docs.push({
        id: makeScrapedDocumentId("rgaa", criterion.reference, text),
        text,
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
    }
  }

  // Entrées glossaire
  if (data.glossary) {
    for (const entry of data.glossary) {
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
  }

  return docs;
}

// ─── Scraping live ────────────────────────────────────────────────────────────

async function scrapeRgaaLive(
  scrapedAt: string,
): Promise<{ documents: ScrapedDocument[]; errors: string[] }> {
  const documents: ScrapedDocument[] = [];
  const errors: string[] = [];

  // Critères
  try {
    const res = await fetchWithRetry(RGAA_CRITERIA_URL, {}, 3, 30_000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const criteria = parseRgaaHtml(html);

    for (const c of criteria) {
      const text = c.raw + (c.tests.length > 0 ? `\nTests : ${c.tests.join(", ")}` : "");
      documents.push({
        id: makeScrapedDocumentId("rgaa", c.reference, text),
        text: text.slice(0, 1200),
        collection: "rgaa_referential",
        metadata: {
          source: "rgaa",
          url: `${RGAA_CRITERIA_URL}#${c.reference}`,
          criterion: c.reference,
          thematic: c.thematic,
          type: "criterion",
          lang: "fr",
          scrapedAt,
        },
      });
    }
  } catch (e) {
    errors.push(`critères: ${(e as Error).message}`);
  }

  // Glossaire
  try {
    const res = await fetchWithRetry(RGAA_GLOSSARY_URL, {}, 3, 30_000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const glossary = parseGlossaryHtml(html);

    for (const entry of glossary) {
      const text = `Glossaire RGAA — ${entry.term} : ${entry.definition}`;
      documents.push({
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
  } catch (e) {
    errors.push(`glossaire: ${(e as Error).message}`);
  }

  return { documents, errors };
}

// ─── Point d'entrée public ───────────────────────────────────────────────────

export async function scrapeRgaa(): Promise<{
  documents: ScrapedDocument[];
  result: ScrapeResult;
  usedFallback: boolean;
}> {
  const startedAt = Date.now();
  const scrapedAt = new Date().toISOString();
  let usedFallback = false;

  // 1 — Tentative scraping live
  console.log("[Scraper/RGAA] Tentative de scraping live...");
  const { documents: liveDocs, errors } = await scrapeRgaaLive(scrapedAt);

  const criteriaCount = liveDocs.filter(
    (d) => d.metadata.type === "criterion",
  ).length;

  // 2 — Quality Gate : < 80 critères → fallback JSON
  if (criteriaCount < QUALITY_GATE_MIN) {
    console.warn(
      `[Scraper/RGAA] Quality Gate échoué : ${criteriaCount} critères (min: ${QUALITY_GATE_MIN}) → fallback JSON`,
    );
    const fallback = await loadFallbackJson();

    if (fallback) {
      usedFallback = true;
      const fallbackDocs = buildDocumentsFromFallback(fallback, scrapedAt);

      console.log(
        `[Scraper/RGAA] Fallback JSON : ${fallbackDocs.length} documents (v${fallback.version})`,
      );

      return {
        documents: fallbackDocs,
        result: {
          source: "rgaa",
          success: true,
          count: fallbackDocs.length,
          errors: [`Fallback JSON utilisé (live: ${criteriaCount} critères)`, ...errors],
          durationMs: Date.now() - startedAt,
        },
        usedFallback: true,
      };
    }

    // Si le fallback JSON est aussi absent, retourner ce qu'on a
    console.error("[Scraper/RGAA] Fallback JSON introuvable ET live insuffisant");
  }

  const success = liveDocs.length > 0;
  console.log(
    `[Scraper/RGAA] Live : ${liveDocs.length} documents (${criteriaCount} critères)`,
  );

  return {
    documents: liveDocs,
    result: {
      source: "rgaa",
      success,
      count: liveDocs.length,
      errors,
      durationMs: Date.now() - startedAt,
    },
    usedFallback,
  };
}
