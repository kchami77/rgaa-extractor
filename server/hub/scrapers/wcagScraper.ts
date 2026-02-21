/**
 * wcagScraper.ts
 * Scrape les techniques WCAG 2.2 depuis W3C (index statique + pages individuelles).
 * Collection cible : rgaa_referential
 *
 * Stratégie :
 *  1. Fetch l'index HTML de https://www.w3.org/WAI/WCAG22/Techniques/
 *  2. Extrait tous les liens de techniques (G*, H*, ARIA*, F*, C*, SCR*)
 *  3. Fetch les 200 techniques les plus pertinentes pour l'audit RGAA
 *  4. Produit 1 document par technique
 */

import { fetchWithRetry, makeScrapedDocumentId, stripHtml } from "./types";
import type { ScrapedDocument, ScrapeResult } from "./types";

const WCAG_TECHNIQUES_URL = "https://www.w3.org/WAI/WCAG22/Techniques/";

// Prefixes pertinents pour l'audit RGAA francophone
const RELEVANT_PREFIXES = ["G", "H", "ARIA", "F", "C", "SCR", "PDF", "SVG"];

// Limite max de techniques pour maîtriser les coûts d'embedding
const MAX_TECHNIQUES = 200;


interface WcagTechnique {
  id: string;
  title: string;
  url: string;
  prefix: string;
}

/**
 * Parse l'index HTML et extrait les techniques disponibles.
 */
function parseIndex(html: string, baseUrl: string): WcagTechnique[] {
  const techniques: WcagTechnique[] = [];

  // Regex sur les liens de techniques : href="../techniques/aria/ARIA1"
  const linkPattern = /href="([^"]*\/([A-Z]+\d+))[^"]*"[^>]*>([^<]+)</g;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) !== null) {
    const rawHref = match[1];
    const id = match[2];
    const title = match[3].trim();

    if (!id || !title) continue;

    const prefix = id.replace(/\d+$/, "");
    if (!RELEVANT_PREFIXES.includes(prefix)) continue;

    // Construire l'URL absolue
    const url = rawHref.startsWith("http")
      ? rawHref
      : new URL(rawHref, baseUrl).href;

    // Éviter les doublons
    if (!techniques.find(t => t.id === id)) {
      techniques.push({ id, title, url, prefix });
    }
  }

  // Trier par priorité : générales > HTML > ARIA > Colorés > Failures
  const priorityScore = (t: WcagTechnique): number => {
    if (/^G/.test(t.id)) return 0;
    if (/^H/.test(t.id)) return 1;
    if (/^ARIA/.test(t.id)) return 2;
    if (/^C/.test(t.id)) return 3;
    if (/^SCR/.test(t.id)) return 4;
    if (/^F/.test(t.id)) return 5;
    return 6;
  };

  return techniques
    .sort((a, b) => priorityScore(a) - priorityScore(b))
    .slice(0, MAX_TECHNIQUES);
}

/**
 * Fetch une page de technique et extrait son contenu utile.
 */
async function fetchTechnique(tech: WcagTechnique): Promise<string> {
  const res = await fetchWithRetry(tech.url, {}, 2, 15_000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();

  // Extraire le contenu principal (section #body ou article.sc-wrapper)
  const contentMatch =
    html.match(/<section[^>]+id="[^"]*"[^>]*>([\s\S]*?)<\/section>/i) ||
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

  const rawContent = contentMatch ? contentMatch[1] : html;

  // Sections intéressantes : description, applicability, procedure
  const descMatch = rawContent.match(/<section[^>]+class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
  const appMatch = rawContent.match(/<section[^>]+id="[^"]*applicab[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
  const procMatch = rawContent.match(/<section[^>]+id="[^"]*procedure[^"]*"[^>]*>([\s\S]*?)<\/section>/i);

  const parts = [
    `Technique WCAG ${tech.id} : ${tech.title}`,
    descMatch ? stripHtml(descMatch[1]).slice(0, 600) : "",
    appMatch ? `Applicabilité : ${stripHtml(appMatch[1]).slice(0, 300)}` : "",
    procMatch ? `Procédure : ${stripHtml(procMatch[1]).slice(0, 300)}` : "",
  ].filter(Boolean);

  return parts.join("\n");
}

// ─── Point d'entrée public ───────────────────────────────────────────────────

export async function scrapeWcag(): Promise<{ documents: ScrapedDocument[]; result: ScrapeResult }> {
  const startedAt = Date.now();
  const documents: ScrapedDocument[] = [];
  const errors: string[] = [];
  const scrapedAt = new Date().toISOString();

  try {
    // 1 — Fetch l'index
    const indexRes = await fetchWithRetry(WCAG_TECHNIQUES_URL, {}, 3, 30_000);
    if (!indexRes.ok) {
      throw new Error(`Index HTTP ${indexRes.status}`);
    }
    const indexHtml = await indexRes.text();
    const techniques = parseIndex(indexHtml, WCAG_TECHNIQUES_URL);

    console.log(`[Scraper/WCAG] ${techniques.length} techniques identifiées, fetch individuel...`);

    // 2 — Fetch individuel avec concurrence = 5
    const CONCURRENCY = 5;
    for (let i = 0; i < techniques.length; i += CONCURRENCY) {
      const batch = techniques.slice(i, i + CONCURRENCY);

      await Promise.allSettled(
        batch.map(async (tech) => {
          try {
            const text = await fetchTechnique(tech);
            if (text.length < 50) return; // Contenu vide, ignorer

            const id = makeScrapedDocumentId("wcag", tech.id, text);

            documents.push({
              id,
              text: text.slice(0, 1500), // Limiter pour l'embedding
              collection: "rgaa_referential",
              metadata: {
                source: "wcag",
                url: tech.url,
                type: tech.prefix === "F" ? "technique" : "technique",
                lang: "en",
                scrapedAt,
              },
            });
          } catch (e) {
            errors.push(`${tech.id}: ${(e as Error).message}`);
          }
        }),
      );

      // Pause courtoise entre les batches pour ne pas DDoSer W3C
      if (i + CONCURRENCY < techniques.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    console.log(`[Scraper/WCAG] ${documents.length} techniques indexées, ${errors.length} erreurs`);

    return {
      documents,
      result: {
        source: "wcag",
        success: true,
        count: documents.length,
        errors,
        durationMs: Date.now() - startedAt,
      },
    };
  } catch (e) {
    const msg = (e as Error).message;
    console.error(`[Scraper/WCAG] Échec: ${msg}`);

    return {
      documents,
      result: {
        source: "wcag",
        success: false,
        count: 0,
        errors: [msg, ...errors],
        durationMs: Date.now() - startedAt,
      },
    };
  }
}
