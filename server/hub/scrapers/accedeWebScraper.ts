/**
 * accedeWebScraper.ts
 * Scrape les notices AcceDe Web (accede-web.com).
 * Collection cible : rgaa_expertise
 *
 * Stratégie :
 *  1. Fetch l'index des notices HTML (pages statiques)
 *  2. Extrait les URLs des notices individuelles
 *  3. Fetch + parse chaque notice → documents
 */

import { fetchWithRetry, makeScrapedDocumentId, stripHtml } from "./types";
import type { ScrapedDocument, ScrapeResult } from "./types";

const ACCEDE_BASE = "https://www.accede-web.com";

/** URLs des notices connues et stables (source fiable). */
const ACCEDE_NOTICE_URLS: Array<{ url: string; slug: string; category: string }> = [
  { url: "/notices/html-et-css/", slug: "html-css", category: "HTML & CSS" },
  { url: "/notices/html-et-css/1-structure/", slug: "html-structure", category: "Structure" },
  { url: "/notices/html-et-css/2-alternatives-textuelles/", slug: "html-alternatives", category: "Alternatives textuelles" },
  { url: "/notices/html-et-css/3-couleurs/", slug: "html-couleurs", category: "Couleurs" },
  { url: "/notices/html-et-css/4-tableaux/", slug: "html-tableaux", category: "Tableaux" },
  { url: "/notices/html-et-css/5-liens/", slug: "html-liens", category: "Liens" },
  { url: "/notices/html-et-css/6-scripts/", slug: "html-scripts", category: "Scripts" },
  { url: "/notices/html-et-css/7-mise-en-forme/", slug: "html-mise-en-forme", category: "Mise en forme" },
  { url: "/notices/html-et-css/8-formulaires/", slug: "html-formulaires", category: "Formulaires" },
  { url: "/notices/html-et-css/9-navigation/", slug: "html-navigation", category: "Navigation" },
  { url: "/notices/interfaces-riches-et-javascript/", slug: "js-interfaces", category: "Interfaces riches" },
  { url: "/notices/interfaces-riches-et-javascript/1-aria/", slug: "js-aria", category: "ARIA" },
  { url: "/notices/interfaces-riches-et-javascript/2-gestion-du-focus/", slug: "js-focus", category: "Focus" },
  { url: "/notices/interfaces-riches-et-javascript/3-contenu-genere/", slug: "js-contenu", category: "Contenu généré" },
  { url: "/notices/concepteurs/", slug: "concepteurs", category: "Conception" },
  { url: "/notices/editeurs/", slug: "editeurs", category: "Édition" },
];

interface NoticeSection {
  title: string;
  content: string;
  url: string;
}

/**
 * Extrait les recommandations d'une page de notice AcceDe Web.
 */
function parseNoticePage(html: string, baseUrl: string): NoticeSection[] {
  const sections: NoticeSection[] = [];

  // Extraire le contenu principal (div.article-content ou main article)
  const mainMatch =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    html.match(/<div[^>]+class="[^"]*(?:content|article)[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

  if (!mainMatch) return sections;

  const content = mainMatch[1];

  // Découper par sections h2/h3
  const sectionPattern = /<h[23][^>]*>([^<]+)<\/h[23]>([\s\S]*?)(?=<h[23]|$)/gi;
  let match: RegExpExecArray | null;

  while ((match = sectionPattern.exec(content)) !== null) {
    const title = stripHtml(match[1]).trim();
    const body = stripHtml(match[2]).trim();

    if (title && body.length > 30) {
      sections.push({ title, content: body.slice(0, 800), url: baseUrl });
    }
  }

  // Si aucune section trouvée, prendre le contenu global
  if (sections.length === 0) {
    const text = stripHtml(content).trim();
    if (text.length > 50) {
      sections.push({ title: "Notice", content: text.slice(0, 1200), url: baseUrl });
    }
  }

  return sections;
}

// ─── Point d'entrée public ───────────────────────────────────────────────────

export async function scrapeAccedeWeb(): Promise<{ documents: ScrapedDocument[]; result: ScrapeResult }> {
  const startedAt = Date.now();
  const documents: ScrapedDocument[] = [];
  const errors: string[] = [];
  const scrapedAt = new Date().toISOString();

  console.log(`[Scraper/AcceDe] Scraping ${ACCEDE_NOTICE_URLS.length} notices...`);

  // Concurrence limitée à 3 pour respecter le serveur
  const CONCURRENCY = 3;

  for (let i = 0; i < ACCEDE_NOTICE_URLS.length; i += CONCURRENCY) {
    const batch = ACCEDE_NOTICE_URLS.slice(i, i + CONCURRENCY);

    await Promise.allSettled(
      batch.map(async ({ url, slug, category }) => {
        const fullUrl = `${ACCEDE_BASE}${url}`;
        try {
          const res = await fetchWithRetry(fullUrl, {}, 2, 20_000);
          if (!res.ok) {
            errors.push(`${slug}: HTTP ${res.status}`);
            return;
          }

          const html = await res.text();
          const sections = parseNoticePage(html, fullUrl);

          for (const section of sections) {
            const text = `[AcceDe Web — ${category}] ${section.title}\n${section.content}`;
            const id = makeScrapedDocumentId("accede", slug + "|" + section.title, text);

            documents.push({
              id,
              text,
              collection: "rgaa_expertise",
              metadata: {
                source: "accede",
                url: fullUrl,
                type: "notice",
                lang: "fr",
                scrapedAt,
              },
            });
          }
        } catch (e) {
          errors.push(`${slug}: ${(e as Error).message}`);
        }
      }),
    );

    // Pause 800ms entre les batches (site externe)
    if (i + CONCURRENCY < ACCEDE_NOTICE_URLS.length) {
      await new Promise(r => setTimeout(r, 800));
    }
  }

  const success = documents.length > 0;
  console.log(`[Scraper/AcceDe] ${documents.length} sections indexées, ${errors.length} erreurs`);

  return {
    documents,
    result: {
      source: "accede",
      success,
      count: documents.length,
      errors,
      durationMs: Date.now() - startedAt,
    },
  };
}
