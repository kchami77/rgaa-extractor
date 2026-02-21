/**
 * ChromaDB Client — Base vectorielle embarquée (PersistentClient)
 *
 * Mode PersistentClient : aucun serveur Python requis.
 * Les données persistent dans ./data/chromadb (configurable via Options).
 *
 * Collections :
 *   - rgaa_referential : critères RGAA 4.1 + WCAG 2.2
 *   - rgaa_findings    : constats validés des rapports
 *   - rgaa_expertise   : templates approuvés + AcceDe/MDN
 *   - rgaa_code        : snippets HTML/ARIA before/after
 */

import { ChromaClient, Collection } from "chromadb";
import { settingsService } from "./settingsService";

export type ChromaCollectionName =
  | "rgaa_referential"
  | "rgaa_findings"
  | "rgaa_expertise"
  | "rgaa_code";

// ─── Singleton ────────────────────────────────────────────────────────────────
let client: ChromaClient | null = null;
const collectionCache = new Map<string, Collection>();

async function getClient(): Promise<ChromaClient> {
  if (!client) {
    const path = await settingsService.get("chroma.path");
    client = new ChromaClient({ path });
  }
  return client;
}

// ─── Health check ──────────────────────────────────────────────────────────────
/**
 * Vérifie si ChromaDB est disponible.
 * Appelé AVANT chaque opération vectorielle — en cas d'échec, les outils
 * MCP basculent vers le mode SQL dégradé.
 */
export async function isChromaAvailable(): Promise<boolean> {
  const enabled = await settingsService.getBool("chroma.enabled");
  if (!enabled) return false;

  try {
    const c = await getClient();
    await c.heartbeat();
    return true;
  } catch {
    return false;
  }
}

// ─── Collections ──────────────────────────────────────────────────────────────
/**
 * Retourne (ou crée) une collection ChromaDB.
 * Idempotent — peut être appelé à chaque démarrage.
 */
export async function getOrCreateCollection(name: ChromaCollectionName): Promise<Collection> {
  if (collectionCache.has(name)) {
    return collectionCache.get(name)!;
  }

  const c = await getClient();
  const collection = await c.getOrCreateCollection({
    name,
    metadata: {
      description: COLLECTION_METADATA[name],
      "hnsw:space": "cosine",
    },
  });

  collectionCache.set(name, collection);
  return collection;
}

// ─── Upsert (idempotent) ──────────────────────────────────────────────────────
export interface ChromaDocument {
  id: string;          // signatureHash ou identifiant stable
  text: string;        // texte source (pour affichage)
  embedding: number[]; // vecteur pré-calculé
  metadata: Record<string, string | number | boolean>;
}

/**
 * Indexe un ou plusieurs documents dans une collection.
 * Utilise upsert (jamais de doublon, re-indexation idempotente).
 */
export async function upsertDocuments(
  collectionName: ChromaCollectionName,
  documents: ChromaDocument[]
): Promise<void> {
  const collection = await getOrCreateCollection(collectionName);
  await collection.upsert({
    ids:        documents.map(d => d.id),
    documents:  documents.map(d => d.text),
    embeddings: documents.map(d => d.embedding),
    metadatas:  documents.map(d => d.metadata),
  });
}

// ─── Query ────────────────────────────────────────────────────────────────────
export interface ChromaQueryResult {
  id: string;
  text: string;
  distance: number;
  metadata: Record<string, string | number | boolean>;
}

/**
 * Recherche sémantique dans une collection.
 */
export async function queryCollection(
  collectionName: ChromaCollectionName,
  queryEmbedding: number[],
  topK: number,
  where?: Record<string, string>
): Promise<ChromaQueryResult[]> {
  const collection = await getOrCreateCollection(collectionName);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where,
  });

  const ids = results.ids[0] ?? [];
  const documents = results.documents[0] ?? [];
  const distances = results.distances?.[0] ?? [];
  const metadatas = results.metadatas[0] ?? [];

  return ids.map((id: string, i: number) => ({
    id,
    text: documents[i] ?? "",
    distance: distances[i] ?? 1,
    metadata: (metadatas[i] ?? {}) as Record<string, string | number | boolean>,
  }));
}

// ─── Reset (tests / re-indexation) ────────────────────────────────────────────
export async function resetCollection(name: ChromaCollectionName): Promise<void> {
  const c = await getClient();
  try {
    await c.deleteCollection({ name });
  } catch { /* Collection n'existait pas */ }
  collectionCache.delete(name);
}

// ─── Métadonnées des collections ──────────────────────────────────────────────
const COLLECTION_METADATA: Record<ChromaCollectionName, string> = {
  rgaa_referential: "Critères RGAA 4.1, thématiques, obligations WCAG 2.2 — vérité immuable officielle",
  rgaa_findings:    "Constats validés des rapports d'audit — expertise capitalisée des auditeurs",
  rgaa_expertise:   "Templates approuvés, notices AcceDe Web, articles MDN — bonnes pratiques",
  rgaa_code:        "Snippets HTML/ARIA before/after par critère (WAI-ARIA APG) — enrichissement sémantique",
};
