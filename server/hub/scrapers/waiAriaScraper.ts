/**
 * waiAriaScraper.ts
 * Scrape les WAI-ARIA APG Design Patterns via Playwright (site React/SSR).
 * Collection cible : rgaa_code (snippets HTML/ARIA par pattern)
 *
 * Stratégie :
 *  1. Lancer chromium headless via playwright
 *  2. Fetch https://www.w3.org/WAI/ARIA/apg/patterns/
 *  3. Extraire la liste des patterns
 *  4. Pour chaque pattern : description + exemple de code ARIA/HTML
 *  5. Fermer le navigateur proprement (toujours, même en cas d'erreur)
 *
 * Note : playwright@1.58.2 est déjà dans package.json.
 *        chromium est téléchargé par `pnpm exec playwright install chromium`.
 */

import { makeScrapedDocumentId, stripHtml } from "./types";
import type { ScrapedDocument, ScrapeResult } from "./types";

const APG_PATTERNS_URL = "https://www.w3.org/WAI/ARIA/apg/patterns/";
const BROWSER_TIMEOUT_MS = 120_000; // 2 min max pour le navigateur entier
const PAGE_TIMEOUT_MS   = 30_000;  // 30s par page individuelle
const MAX_PATTERNS = 50;           // Limite raisonnable pour les coûts embedding

// ─── Point d'entrée public ───────────────────────────────────────────────────

export async function scrapeWaiAria(): Promise<{ documents: ScrapedDocument[]; result: ScrapeResult }> {
  const startedAt = Date.now();
  const documents: ScrapedDocument[] = [];
  const errors: string[] = [];
  const scrapedAt = new Date().toISOString();

  // Import dynamique pour ne pas crasher si playwright n'est pas installé
  let chromium: typeof import("playwright").chromium;
  try {
    const playwright = await import("playwright");
    chromium = playwright.chromium;
  } catch {
    const msg = "playwright non disponible — exécuter: pnpm exec playwright install chromium";
    console.warn(`[Scraper/WAI-ARIA] ${msg}`);
    return {
      documents: [],
      result: { source: "wai-aria", success: false, count: 0, errors: [msg], durationMs: Date.now() - startedAt },
    };
  }

  // Timer global pour le navigateur entier
  const globalController = new AbortController();
  const globalTimeout = setTimeout(() => globalController.abort(), BROWSER_TIMEOUT_MS);

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent: "RGAA-Hub/1.0 (Playwright; accessibility research)",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);

    // ── 1. Récupérer la liste des patterns ───────────────────────────────────
    await page.goto(APG_PATTERNS_URL, { waitUntil: "domcontentloaded" });

    // Attendre que la liste soit rendue
    await page.waitForSelector("a[href*='/patterns/']", { timeout: 15_000 }).catch(() => null);

    const patternLinks = await page.$$eval(
      "a[href*='/WAI/ARIA/apg/patterns/']",
      (anchors) =>
        anchors
          .map((a) => ({
            href: (a as HTMLAnchorElement).href,
            title: (a as HTMLAnchorElement).textContent?.trim() ?? "",
          }))
          .filter(
            ({ href, title }) =>
              href.includes("/patterns/") &&
              !href.endsWith("/patterns/") &&
              title.length > 3,
          ),
    );

    // Dédupliquer par href
    const seen = new Set<string>();
    const uniquePatterns = patternLinks.filter(({ href }) => {
      if (seen.has(href)) return false;
      seen.add(href);
      return true;
    }).slice(0, MAX_PATTERNS);

    console.log(`[Scraper/WAI-ARIA] ${uniquePatterns.length} patterns identifiés`);

    // ── 2. Scraper chaque pattern ─────────────────────────────────────────────
    for (const { href, title } of uniquePatterns) {
      if (globalController.signal.aborted) break;

      try {
        await page.goto(href, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT_MS });

        // Extraire la description du pattern
        const description = await page.$eval(
          "main p, .pattern-description, [class*='description'] p, article > p",
          (el) => el.textContent?.trim() ?? "",
        ).catch(() => "");

        // Extraire les exemples de code HTML/ARIA
        const codeSnippets = await page.$$eval(
          "pre code, .example pre, [class*='example'] code, details[class*='example'] code",
          (elements) =>
            elements
              .slice(0, 3) // Max 3 snippets par pattern
              .map((el) => el.textContent?.trim() ?? "")
              .filter((t) => t.length > 20),
        ).catch(() => [] as string[]);

        // Extraire les rôles ARIA mentionnés
        const ariaRoles = await page.$$eval(
          "[class*='role'], code[class*='aria'], .aria-attributes li",
          (elements) => elements.map((el) => el.textContent?.trim() ?? "").filter(Boolean),
        ).catch(() => [] as string[]);

        // Construire le texte indexable
        const slug = href.split("/patterns/")[1]?.replace(/\/$/, "") ?? title;
        const textParts = [
          `WAI-ARIA APG Pattern : ${title}`,
          description ? `Description : ${description.slice(0, 400)}` : "",
          ariaRoles.length > 0 ? `Rôles ARIA : ${ariaRoles.slice(0, 5).join(", ")}` : "",
          codeSnippets.length > 0
            ? `Exemple HTML/ARIA :\n${codeSnippets[0].slice(0, 600)}`
            : "",
        ].filter(Boolean);

        const text = textParts.join("\n");
        if (text.length < 30) continue;

        const id = makeScrapedDocumentId("wai-aria", slug, text);

        documents.push({
          id,
          text: text.slice(0, 1500),
          collection: "rgaa_code",
          metadata: {
            source: "wai-aria",
            url: href,
            type: "pattern",
            lang: "en",
            scrapedAt,
          },
        });
      } catch (e) {
        errors.push(`${href}: ${(e as Error).message}`);
      }
    }

    await context.close();
  } catch (e) {
    errors.push(`browser: ${(e as Error).message}`);
  } finally {
    clearTimeout(globalTimeout);
    await browser.close();
  }

  const success = documents.length > 0;
  console.log(`[Scraper/WAI-ARIA] ${documents.length} patterns indexés, ${errors.length} erreurs`);

  return {
    documents,
    result: {
      source: "wai-aria",
      success,
      count: documents.length,
      errors,
      durationMs: Date.now() - startedAt,
    },
  };
}
