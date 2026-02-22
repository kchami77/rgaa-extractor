/**
 * knowledgeScraper.ts
 * Orchestrateur central du Knowledge Scraper.
 *
 * Expose :
 *  - scrapeAndIndex(source)   → Lance le scraping et indexe dans ChromaDB
 *  - getScrapeStatus()        → Statut temps-réel (polling UI Options)
 *  - shouldReindex(source)    → Vérifie si une re-indexation est nécessaire
 *
 * Flux :
 *   [Adaptateur] → ScrapedDocument[] → embed() → ChromaDB upsert
 *
 * Déclencheurs :
 *   - server/index.ts (auto au démarrage si collections vides)
 *   - server/routers/settings.ts (bouton Options UI)
 *   - mcp.ts (outil trigger_reindex)
 */

import { isChromaAvailable, getOrCreateCollection, resetCollection } from "./chromaClient";
import type { ChromaCollectionName } from "./chromaClient";
import { embedBatch } from "./embeddings";
import type { ScraperSource, ScraperRunResult, ScraperStatus, ScrapeResult, ScrapedDocument } from "./scrapers/types";
import { QUALITY_GATES } from "./scrapers/types";
import { scrapeRgaa } from "./scrapers/rgaaScraper";
import { scrapeWaiAria } from "./scrapers/waiAriaScraper";
import { scrapeReports } from "./scrapers/reportsScraper";

// ─── Statut global (thread-safe pour Node.js single-threaded) ────────────────

let _status: ScraperStatus = {
  phase: "idle",
  progress: 0,
  totalIndexed: 0,
};

/** Retourne le statut actuel du scraper (pour polling UI). */
export function getScrapeStatus(): ScraperStatus {
  return { ..._status };
}

/** Indique si un scraping est déjà en cours. */
export function isScraping(): boolean {
  return _status.phase === "running";
}

// ─── Vérification de nécessité de re-indexation ──────────────────────────────

/**
 * Retourne la liste des sources qui doivent être ré-indexées :
 * - Si la collection ChromaDB cible est vide (0 docs)
 */
export async function shouldReindex(source: ScraperSource = "all"): Promise<ScraperSource[]> {
  if (!(await isChromaAvailable())) return [];

  const needed: ScraperSource[] = [];

  const mapping: Record<Exclude<ScraperSource, "all">, ChromaCollectionName[]> = {
    rgaa: ["rgaa_referential"],
    reports: ["rgaa_findings"],
    "wai-aria": ["rgaa_code"]
  };

  const sourcesToCheck: Exclude<ScraperSource, "all">[] =
    source === "all" ? SOURCE_ORDER : [source as Exclude<ScraperSource, "all">];

  for (const src of sourcesToCheck) {
    const cols = mapping[src] || [];
    let isEmpty = false;

    for (const colName of cols) {
      try {
        const col = await getOrCreateCollection(colName);
        const count = await col.count();
        if (count === 0) {
          console.log(`[Hub] Source ${src} (Collection ${colName}) vide → re-indexation recommandée`);
          isEmpty = true;
          break;
        }
      } catch {
        isEmpty = true;
        break;
      }
    }

    if (isEmpty) {
      needed.push(src);
    }
  }

  return needed;
}

// ─── Indexation d'un lot de documents dans ChromaDB ─────────────────────────

const EMBED_BATCH_SIZE = 20;

async function indexDocuments(docs: ScrapedDocument[]): Promise<number> {
  if (docs.length === 0) return 0; // Guard early-return

  if (!(await isChromaAvailable())) {
    console.warn("[Hub] ChromaDB indisponible — skip indexation");
    return 0;
  }

  let indexed = 0;

  // Grouper par collection
  const byCollection = new Map<string, ScrapedDocument[]>();
  for (const doc of docs) {
    const arr = byCollection.get(doc.collection) ?? [];
    arr.push(doc);
    byCollection.set(doc.collection, arr);
  }

  for (const [collectionName, colDocs] of Array.from(byCollection.entries())) {
    let collection;
    try {
      collection = await getOrCreateCollection(collectionName as ChromaCollectionName);
    } catch (e) {
      console.error(`[Hub] Impossible d'obtenir la collection ${collectionName}:`, (e as Error).message);
      continue;
    }

    // Traiter par batches pour l'embedding
    for (let i = 0; i < colDocs.length; i += EMBED_BATCH_SIZE) {
      const batch = colDocs.slice(i, i + EMBED_BATCH_SIZE);
      const texts = batch.map((d: ScrapedDocument) => d.text);

      try {
        const embeddings = await embedBatch(texts);

        await collection.upsert({
          ids: batch.map((d: ScrapedDocument) => d.id),
          embeddings,
          documents: texts,
          metadatas: batch.map((d: ScrapedDocument) => d.metadata as Record<string, string>),
        });

        indexed += batch.length;

        // Mise à jour du statut (totalIndexed cumulé)
        _status.totalIndexed = (_status.totalIndexed ?? 0) + batch.length;
      } catch (e) {
        console.error(`[Hub] Erreur embedding/upsert batch (${collectionName}):`, (e as Error).message);
      }
    }
  }

  return indexed;
}

// ─── Adaptateurs par source ──────────────────────────────────────────────────

type AdapterFn = () => Promise<{
  documents: ScrapedDocument[];
  result: ScrapeResult;
  usedFallback?: boolean;
}>;

const ADAPTERS: Record<Exclude<ScraperSource, "all">, AdapterFn> = {
  rgaa:       scrapeRgaa,
  "wai-aria": scrapeWaiAria,
  reports:    scrapeReports,
};

const SOURCE_ORDER: Exclude<ScraperSource, "all">[] = [
  "rgaa",        // Priorité 1 — référentiel cœur
  "reports",     // Priorité 2 — données historiques (MySQL)
  "wai-aria",    // Priorité 3 — patterns (playwright, plus lent)
];

// ─── Point d'entrée principal ─────────────────────────────────────────────────

/**
 * Lance le scraping et l'indexation ChromaDB pour une ou toutes les sources.
 *
 * @param source  Source à scraper ("rgaa" | "wcag" | ... | "all")
 * @returns Résultat global agrégé
 */
export async function scrapeAndIndex(
  source: ScraperSource = "all",
  reset: boolean = false,
): Promise<ScraperRunResult> {
  if (_status.phase === "running") {
    throw new Error("[Scraper] Un scraping est déjà en cours");
  }

  const startedAt = new Date().toISOString();
  const results: ScrapeResult[] = [];
  let totalIndexed = 0;
  let hadFallback = false;

  const sourcesToRun: Exclude<ScraperSource, "all">[] =
    source === "all" ? SOURCE_ORDER : [source as Exclude<ScraperSource, "all">];

  // Initialiser le statut
  _status = {
    phase: "running",
    progress: 0,
    totalIndexed: 0,
    currentSource: sourcesToRun[0],
    lastRunAt: startedAt,
  };

  console.log(`[Hub] Démarrage scraping : [${sourcesToRun.join(", ")}]`);

  try {
    // Exécution parallélisée des scrapers
    const promises = sourcesToRun.map(async (src) => {
      // Reset de la collection si demandé
      if (reset) {
        const colMap: Record<Exclude<ScraperSource, "all">, ChromaCollectionName[]> = {
          rgaa: ["rgaa_referential"],
          reports: ["rgaa_findings"],
          "wai-aria": ["rgaa_code"]
        };
        const cols = colMap[src] || [];
        for (const col of cols) {
          console.log(`[Hub] Reset collection ${col} before ${src}...`);
          await resetCollection(col);
        }
      }

      console.log(`[Hub] Scraping ${src} (Asynchrone)...`);

      try {
        const adapter = ADAPTERS[src];
        if (!adapter) {
          return { source: src, success: false, count: 0, errors: [`Source inconnue: ${src}`], durationMs: 0 };
        }

        const { documents, result, usedFallback: fallbackUsed } = await adapter();
        if (fallbackUsed) hadFallback = true;

        // Indexer dans ChromaDB
        if (documents.length > 0) {
          const indexedCount = await indexDocuments(documents);
          totalIndexed += indexedCount;
          return { ...result, count: indexedCount };
        } else {
          return result;
        }
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`[Hub] Erreur pour ${src}:`, msg);
        return {
          source: src,
          success: false,
          count: 0,
          errors: [msg],
          durationMs: 0,
        };
      }
    });

    const settledResults = await Promise.all(promises);
    results.push(...settledResults);

    // S20-1 FIX : Mémoriser la date de succès
    const completedAt = new Date().toISOString();
    try {
      const { setSetting } = await import("../repositories/settingsRepository");
      await setSetting("hub.lastScrapeAt", completedAt);
    } catch (e) {
      console.warn("[Hub] Impossible de sauvegarder l'horodatage du scraping:", (e as Error).message);
    }

    _status = {
      phase: "done",
      progress: 100,
      totalIndexed,
      lastRunAt: completedAt,
    };

    console.log(
      `[Hub] Scraping terminé : ${totalIndexed} documents indexés au total`,
    );

    return {
      source,
      totalIndexed,
      results,
      startedAt,
      completedAt,
      hadFallback,
    };
  } catch (e) {
    const msg = (e as Error).message;
    _status = {
      phase: "error",
      progress: 0,
      totalIndexed,
      lastError: msg,
      lastRunAt: new Date().toISOString(),
    };
    throw e;
  }
}
