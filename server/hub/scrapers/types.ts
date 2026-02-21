import { z } from "zod";
import { createHash } from "crypto";
import type { ChromaCollectionName } from "../chromaClient";

// ─── Document produit par un adaptateur ─────────────────────────────────────

export interface ScrapedDocument {
  /**
   * ID stable basé sur le hash SHA-256 du contenu.
   * Garantit l'idempotence des upserts ChromaDB (pas de doublons si re-scraping).
   */
  id: string;

  /** Texte indexable : nettoyé, sans HTML, normalisé en UTF-8. */
  text: string;

  /** Collection ChromaDB cible. */
  collection: ChromaCollectionName;

  metadata: {
    /** Identifiant de la source. */
    source: "rgaa" | "wcag" | "wai-aria" | "accede" | "mdn";

    /** URL de la page source (pour citation). */
    url?: string;

    /** Référence du critère RGAA (ex: "1.1", "3.2"). */
    criterion?: string;

    /** Thématique RGAA (ex: "Images", "Couleurs"). */
    thematic?: string;

    /** Sous-type de document dans la source. */
    type: "criterion" | "technique" | "pattern" | "notice" | "guide" | "glossary";

    /** Langue du document. */
    lang: "fr" | "en";

    /** Date de scraping ISO 8601. */
    scrapedAt: string;
  };
}

// ─── Résultat d'un adaptateur ───────────────────────────────────────────────

export interface ScrapeResult {
  source: string;
  success: boolean;
  count: number;
  errors: string[];
  durationMs: number;
}

// ─── Sources disponibles ────────────────────────────────────────────────────

export const SCRAPER_SOURCES = ["rgaa", "wcag", "wai-aria", "accede", "mdn", "all"] as const;
export type ScraperSource = (typeof SCRAPER_SOURCES)[number];
export const ScraperSourceSchema = z.enum(SCRAPER_SOURCES);

// ─── Statut temps-réel (polling UI Options) ─────────────────────────────────

export type ScraperPhase = "idle" | "running" | "done" | "error";

export interface ScraperStatus {
  phase: ScraperPhase;
  currentSource?: string;
  progress: number;           // 0–100
  totalIndexed: number;
  lastRunAt?: string;         // ISO 8601
  lastError?: string;
}

// ─── Résultat global de l'orchestrateur ─────────────────────────────────────

export interface ScraperRunResult {
  source: ScraperSource;
  totalIndexed: number;
  results: ScrapeResult[];
  startedAt: string;
  completedAt: string;
  hadFallback: boolean;     // true si fallback JSON utilisé pour RGAA
}

// ─── Seuils de qualité (Quality Gates) ─────────────────────────────────────

export const QUALITY_GATES: Record<string, number> = {
  rgaa:      80,   // Minimum 80 critères RGAA
  wcag:      50,   // Minimum 50 techniques WCAG
  "wai-aria": 20,  // Minimum 20 patterns APG
  accede:    10,   // Minimum 10 notices AcceDe
  mdn:       20,   // Minimum 20 articles MDN
};

// ─── Utilitaires ─────────────────────────────────────────────────────────────

/** Génère un ID stable SHA-256 pour un document de scraping. */
export function makeScrapedDocumentId(source: string, key: string, text: string): string {
  return createHash("sha256")
    .update(`${source}|${key}|${text.slice(0, 256)}`)
    .digest("hex");
}

/** Retire les balises HTML et normalise les espaces. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Fetch avec timeout et retry. */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeoutMs = 30_000,
): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": "RGAA-Hub/1.0 (+https://github.com/rgaa-hub)",
          "Accept": "text/html,application/json,*/*",
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err as Error;

      if (attempt < retries - 1) {
        // Backoff exponentiel : 1s, 2s, 4s
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError ?? new Error(`[Scraper] fetch failed after ${retries} retries: ${url}`);
}
