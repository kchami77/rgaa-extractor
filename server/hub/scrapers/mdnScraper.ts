/**
 * mdnScraper.ts
 * Scrape les guides MDN Web Docs sur l'accessibilité.
 * Collection cible : rgaa_expertise
 *
 * Stratégie :
 *  1. API MDN Search pour obtenir la liste des articles accessibilité
 *  2. Utiliser l'API MDN Kuma pour récupérer le contenu JSON structuré
 *     (https://developer.mozilla.org/api/v1/doc/ — retourne du HTML + metadata)
 *  3. Filtrer : articles d'accessibilité, ARIA, HTML sémantique
 *  4. Produit ~40-50 documents maximum
 */

import { fetchWithRetry, makeScrapedDocumentId, stripHtml } from "./types";
import type { ScrapedDocument, ScrapeResult } from "./types";

const MDN_SEARCH_URL = "https://developer.mozilla.org/api/v1/search";
const MDN_DOC_BASE   = "https://developer.mozilla.org";

const MDN_MAX_ARTICLES = 50;

// Requêtes de recherche ciblées pour l'accessibilité WCAG/RGAA
const MDN_SEARCH_QUERIES = [
  { q: "accessibility ARIA", locale: "fr" },
  { q: "accessibility HTML semantics", locale: "fr" },
  { q: "ARIA roles attributes", locale: "fr" },
  { q: "keyboard navigation accessibility", locale: "fr" },
  { q: "alternative text images", locale: "fr" },
  { q: "accessible forms labels", locale: "fr" },
  { q: "color contrast accessibility", locale: "fr" },
  { q: "focus management accessibility", locale: "fr" },
];

// Slugs MDN prioritaires (couvrent les critères RGAA les plus fréquents)
const PRIORITY_MDN_SLUGS = [
  "/fr/docs/Web/Accessibility/ARIA",
  "/fr/docs/Web/Accessibility/ARIA/Roles",
  "/fr/docs/Web/Accessibility/ARIA/Roles/button_role",
  "/fr/docs/Web/Accessibility/ARIA/Roles/navigation_role",
  "/fr/docs/Web/Accessibility/ARIA/Roles/main_role",
  "/fr/docs/Web/Accessibility/ARIA/Attributes/aria-label",
  "/fr/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby",
  "/fr/docs/Web/Accessibility/ARIA/Attributes/aria-describedby",
  "/fr/docs/Web/Accessibility/ARIA/Attributes/aria-hidden",
  "/fr/docs/Web/Accessibility/ARIA/Attributes/aria-expanded",
  "/fr/docs/Web/Accessibility/Understanding_WCAG",
  "/fr/docs/Web/HTML/Element/img",
  "/fr/docs/Web/HTML/Element/button",
  "/fr/docs/Web/HTML/Element/input",
  "/fr/docs/Web/HTML/Element/label",
  "/fr/docs/Web/HTML/Element/nav",
  "/fr/docs/Web/HTML/Element/main",
  "/fr/docs/Web/HTML/Element/header",
  "/fr/docs/Web/HTML/Element/footer",
  "/fr/docs/Web/HTML/Element/Heading_Elements",
  "/en-US/docs/Web/Accessibility",
  "/en-US/docs/Web/Accessibility/ARIA/Roles",
  "/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets",
  "/en-US/docs/Web/Accessibility/Understanding_WCAG/Text_alternatives",
  "/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable",
];

interface MdnSearchResult {
  documents: Array<{
    mdn_url: string;
    title: string;
    summary: string;
    locale: string;
  }>;
}

interface MdnDocResult {
  doc: {
    title: string;
    summary: string;
    body: Array<{
      type: string;
      value: { content?: string; id?: string; title?: string };
    }>;
  };
}

/**
 * Fetch l'API MDN Search pour un terme et locale.
 */
async function searchMdn(q: string, locale: string): Promise<string[]> {
  const url = `${MDN_SEARCH_URL}?q=${encodeURIComponent(q)}&locale=${locale}&size=10`;
  try {
    const res = await fetchWithRetry(url, {}, 2, 15_000);
    if (!res.ok) return [];

    const data = (await res.json()) as MdnSearchResult;
    return (data.documents ?? []).map((d) => d.mdn_url);
  } catch {
    return [];
  }
}

/**
 * Fetch le contenu JSON d'un article MDN via l'API doc.
 */
async function fetchMdnDoc(mdnUrl: string): Promise<{ title: string; text: string } | null> {
  // L'API JSON de MDN : ajouter /index.json à l'URL
  const apiUrl = `${MDN_DOC_BASE}${mdnUrl}/index.json`;

  try {
    const res = await fetchWithRetry(apiUrl, {}, 2, 15_000);
    if (!res.ok) return null;

    const data = (await res.json()) as MdnDocResult;
    const doc = data.doc;
    if (!doc?.title) return null;

    // Extraire le contenu des sections pertinentes
    const contentParts: string[] = [doc.title];

    if (doc.summary) {
      contentParts.push(doc.summary);
    }

    // Extraire les sections du body (prose, code, note)
    if (Array.isArray(doc.body)) {
      for (const section of doc.body.slice(0, 8)) {
        const content = section.value?.content ?? "";
        if (content && typeof content === "string") {
          const text = stripHtml(content).trim();
          if (text.length > 20) {
            contentParts.push(text.slice(0, 400));
          }
        }
      }
    }

    return {
      title: doc.title,
      text: contentParts.join("\n").slice(0, 1500),
    };
  } catch {
    return null;
  }
}

// ─── Point d'entrée public ───────────────────────────────────────────────────

export async function scrapeMdn(): Promise<{ documents: ScrapedDocument[]; result: ScrapeResult }> {
  const startedAt = Date.now();
  const documents: ScrapedDocument[] = [];
  const errors: string[] = [];
  const scrapedAt = new Date().toISOString();

  // 1 — Collecter les URLs via l'API Search
  const urlSet = new Set<string>(PRIORITY_MDN_SLUGS);

  console.log("[Scraper/MDN] Récupération des URLs via MDN Search API...");
  for (const { q, locale } of MDN_SEARCH_QUERIES) {
    const urls = await searchMdn(q, locale);
    urls.forEach((u) => urlSet.add(u));
  }

  // Prendre les prioritaires en premier, limiter le total
  const allUrls = [
    ...PRIORITY_MDN_SLUGS.filter((u) => urlSet.has(u)),
    ...Array.from(urlSet).filter((u) => !PRIORITY_MDN_SLUGS.includes(u)),
  ].slice(0, MDN_MAX_ARTICLES);

  console.log(`[Scraper/MDN] ${allUrls.length} articles à indexer`);

  // 2 — Fetch individuel avec concurrence = 5
  const CONCURRENCY = 5;
  for (let i = 0; i < allUrls.length; i += CONCURRENCY) {
    const batch = allUrls.slice(i, i + CONCURRENCY);

    await Promise.allSettled(
      batch.map(async (mdnUrl) => {
        try {
          const docData = await fetchMdnDoc(mdnUrl);
          if (!docData || docData.text.length < 50) return;

          const lang = mdnUrl.startsWith("/fr/") ? "fr" : "en";
          const slug = mdnUrl.replace(/^\/[a-z-]+\/docs\//, "").replace(/\//g, "-");
          const id = makeScrapedDocumentId("mdn", slug, docData.text);

          documents.push({
            id,
            text: `[MDN — ${docData.title}]\n${docData.text}`,
            collection: "rgaa_expertise",
            metadata: {
              source: "mdn",
              url: `${MDN_DOC_BASE}${mdnUrl}`,
              type: "guide",
              lang,
              scrapedAt,
            },
          });
        } catch (e) {
          errors.push(`${mdnUrl}: ${(e as Error).message}`);
        }
      }),
    );

    // Pause courtoise entre les batches
    if (i + CONCURRENCY < allUrls.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  const success = documents.length > 0;
  console.log(`[Scraper/MDN] ${documents.length} articles indexés, ${errors.length} erreurs`);

  return {
    documents,
    result: {
      source: "mdn",
      success,
      count: documents.length,
      errors,
      durationMs: Date.now() - startedAt,
    },
  };
}
