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

import { isChromaAvailable, getOrCreateCollection } from "./chromaClient";
import type { ChromaCollectionName } from "./chromaClient";
import { embedBatch } from "./embeddings";
import type { ScraperSource, ScraperRunResult, ScraperStatus, ScrapeResult, ScrapedDocument } from "./scrapers/types";
import { QUALITY_GATES } from "./scrapers/types";
import { scrapeRgaa } from "./scrapers/rgaaScraper";
import { scrapeWcag } from "./scrapers/wcagScraper";
import { scrapeWaiAria } from "./scrapers/waiAriaScraper";
import { scrapeAccedeWeb } from "./scrapers/accedeWebScraper";
import { scrapeMdn } from "./scrapers/mdnScraper";

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
 * Retourne true si la source doit être ré-indexée :
 * - La collection ChromaDB cible est vide (0 docs)
 * - Ou le dernier scraping date de plus de 30 jours (basé sur metadata.scrapedAt)
 */
export async function shouldReindex(_source: ScraperSource = "all"): Promise<boolean> {
  if (!(await isChromaAvailable())) return false; // Pas de ChromaDB = pas de scraping utile

  const collections = [
    "rgaa_referential",
    "rgaa_expertise",
    "rgaa_code",
  ] as const;

  for (const colName of collections) {
    try {
      const col = await getOrCreateCollection(colName);
      const count = await col.count();
      if (count === 0) {
        console.log(`[Hub] Collection ${colName} vide → re-indexation recommandée`);
        return true;
      }
    } catch {
      // Collection inexistante = vide
      return true;
    }
  }

  // TODO Phase 7 : vérifier metadata.scrapedAt pour la fraîcheur
  return false;
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
  wcag:       scrapeWcag,
  "wai-aria": scrapeWaiAria,
  accede:     scrapeAccedeWeb,
  mdn:        scrapeMdn,
};

const SOURCE_ORDER: Exclude<ScraperSource, "all">[] = [
  "rgaa",        // Priorité 1 — référentiel cœur
  "wcag",        // Priorité 2 — techniques W3C
  "accede",      // Priorité 3 — expertise FR
  "mdn",         // Priorité 4 — guides techniques
  "wai-aria",    // Priorité 5 — patterns (playwright, plus lent)
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
    for (let i = 0; i < sourcesToRun.length; i++) {
      const src = sourcesToRun[i];
      _status.currentSource = src;
      // Progression : scraping = 0→80%, indexation = 80→90% par source
      const baseProgress = Math.round((i / sourcesToRun.length) * 80);
      _status.progress = baseProgress;

      console.log(`[Hub] [${i + 1}/${sourcesToRun.length}] Scraping ${src}...`);

      // Vérifier les Quality Gates
      const minDocs = QUALITY_GATES[src] ?? 0;

      try {
        const adapter = ADAPTERS[src];
        if (!adapter) {
          results.push({ source: src, success: false, count: 0, errors: [`Source inconnue: ${src}`], durationMs: 0 });
          continue;
        }

        const { documents, result, usedFallback } = await adapter();

        if (usedFallback) hadFallback = true;

        // Log quality gate
        if (result.count < minDocs) {
          console.warn(
            `[Hub] Quality Gate ${src}: ${result.count}/${minDocs} docs — indexation partielle`,
          );
        }

        // Indexer dans ChromaDB
        if (documents.length > 0) {
          const indexedCount = await indexDocuments(documents);
          totalIndexed += indexedCount;
          results.push({ ...result, count: indexedCount });
          console.log(`[Hub] ${src}: ${indexedCount} documents indexés`);
        } else {
          results.push(result);
          console.warn(`[Hub] ${src}: 0 documents produits`);
        }
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`[Hub] Erreur irrécupérable pour ${src}:`, msg);
        results.push({
          source: src,
          success: false,
          count: 0,
          errors: [msg],
          durationMs: 0,
        });
        // Continuer avec les autres sources
      }
    }

    const completedAt = new Date().toISOString();

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
