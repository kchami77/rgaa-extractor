/**
 * RAG Engine — Moteur de Retrieval-Augmented Generation
 *
 * Flux :
 *   question → embed() → ChromaDB search (4 collections)
 *   → scoring (similarité × pondération × confidence)
 *   → construction du prompt enrichi
 *   → invokeHubLLM() → réponse + sources citées
 *
 * Tolérance aux pannes :
 *   - Si ChromaDB est hors ligne → réponse LLM sans contexte vectoriel
 *   - Si LLM échoue → erreur explicite retournée
 */

import { isChromaAvailable, queryCollection, upsertDocuments } from "./chromaClient";
import type { ChromaCollectionName, ChromaDocument, ChromaQueryResult } from "./chromaClient";
import { embed } from "./embeddings";
import { invokeHubLLM, buildHubSystemPrompt } from "./llmAdapter";
import { settingsService } from "./settingsService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RagSource {
  id: string;
  text: string;
  collection: ChromaCollectionName;
  score: number;
  metadata: Record<string, string | number | boolean>;
}

export interface RagResponse {
  answer: string;
  sources: RagSource[];
  mode: "rag" | "degraded"; // "degraded" si ChromaDB est hors ligne
  collections_queried: ChromaCollectionName[];
}

export interface IndexDocumentInput {
  id: string;           // signatureHash ou identifiant stable
  text: string;         // contenu à vectoriser
  collection: ChromaCollectionName;
  metadata: Record<string, string | number | boolean>;
}

// ─── Pondérations par collection ──────────────────────────────────────────────
async function getWeights(): Promise<Record<ChromaCollectionName, number>> {
  return {
    rgaa_referential: await settingsService.getNumber("rag.weightReferential"),
    rgaa_findings:    await settingsService.getNumber("rag.weightFindings"),
    rgaa_expertise:   await settingsService.getNumber("rag.weightExpertise"),  // FIX: clé dédiée
    rgaa_code:        await settingsService.getNumber("rag.weightCode"),
  };
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
function computeScore(
  distance: number,        // ChromaDB retourne distance cosine (0 = identique)
  weight: number,
  occurrenceCount = 1,
  confidenceLevel = 50,
): number {
  const similarity = 1 - distance;                     // convertir en similarité
  const occurrenceBoost = Math.min(Math.log1p(occurrenceCount) / 5, 0.3);
  const confidenceBoost = (confidenceLevel / 100) * 0.2;
  return similarity * weight + occurrenceBoost + confidenceBoost;
}

// ─── Recherche multi-collections ─────────────────────────────────────────────
async function searchAllCollections(
  queryEmbedding: number[],
  collections: ChromaCollectionName[],
  where?: Record<string, string>, // FIX: filtre ChromaDB optionnel transmis
): Promise<RagSource[]> {
  const topK = await settingsService.getNumber("rag.topK");
  const minSimilarity = await settingsService.getNumber("rag.minSimilarity");
  const weights = await getWeights();

  const allResults: RagSource[] = [];

  await Promise.allSettled(
    collections.map(async (col) => {
      try {
        const results = await queryCollection(col, queryEmbedding, topK, where); // FIX: where transmis
        for (const r of results) {
          const similarity = 1 - r.distance;
          if (similarity < minSimilarity) continue;

          const score = computeScore(
            r.distance,
            weights[col],
            Number(r.metadata.occurrenceCount ?? 1),
            Number(r.metadata.confidenceLevel ?? 50),
          );

          allResults.push({ id: r.id, text: r.text, collection: col, score, metadata: r.metadata });
        }
      } catch (e) {
        console.warn(`[RAG] Erreur collection ${col}:`, (e as Error).message);
      }
    })
  );

  const seen = new Set<string>();
  return allResults
    .sort((a, b) => b.score - a.score)
    .filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
}

// ─── Construction du prompt enrichi ──────────────────────────────────────────
function buildRagPrompt(question: string, sources: RagSource[]): string {
  if (sources.length === 0) {
    return `Question : ${question}\n\nAucun contexte spécifique trouvé dans la base de connaissance. Réponds en te basant sur tes connaissances générales RGAA/WCAG.`;
  }

  const contextBlocks = sources.slice(0, 8).map((s, i) => {
    const criterionRef = s.metadata.criterionReference as string ?? "";
    const tag = criterionRef ? `[${criterionRef}] ` : "";
    return `--- Source ${i + 1} (${s.collection}, score: ${s.score.toFixed(2)}) ---\n${tag}${s.text}`;
  }).join("\n\n");

  return `CONTEXTE ISSU DE LA BASE DE CONNAISSANCES RGAA :\n${contextBlocks}\n\n---\n\nQuestion : ${question}\n\nRéponds en utilisant le contexte ci-dessus. Cite les sources pertinentes sous forme de numéros [Source N].`;
}

// ─── API publique — Fonctions principales ─────────────────────────────────────

/**
 * Question libre → réponse RAG avec sources
 */
export async function askAccessibility(
  question: string,
  context?: string,
): Promise<RagResponse> {
  const chromaOk = await isChromaAvailable();
  const citeSources = await settingsService.getBool("rag.citeSources");

  let sources: RagSource[] = [];
  const collections: ChromaCollectionName[] = ["rgaa_referential", "rgaa_findings", "rgaa_expertise", "rgaa_code"];

  if (chromaOk) {
    const queryEmbedding = await embed(context ? `${question} ${context}` : question);
    sources = await searchAllCollections(queryEmbedding, collections);
  }

  const systemPrompt = await buildHubSystemPrompt();
  const userMessage = buildRagPrompt(question, sources);

  const answer = await invokeHubLLM({
    systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return {
    answer,
    sources: citeSources ? sources : [],
    mode: chromaOk ? "rag" : "degraded",
    collections_queried: chromaOk ? collections : [],
  };
}

/**
 * Analyse HTML → non-conformités RGAA détectées
 */
export async function analyzeCode(
  html: string,
  context?: string,
): Promise<RagResponse> {
  const chromaOk = await isChromaAvailable();
  let sources: RagSource[] = [];
  const collections: ChromaCollectionName[] = ["rgaa_referential", "rgaa_code", "rgaa_findings"];

  if (chromaOk) {
    const queryText = `analyse HTML accessibilité ${context ?? ""} ${html.slice(0, 500)}`;
    const queryEmbedding = await embed(queryText);
    sources = await searchAllCollections(queryEmbedding, collections);
  }

  const systemPrompt = await buildHubSystemPrompt();
  const userMessage = buildRagPrompt(
    `Analyse ce code HTML et identifie toutes les non-conformités RGAA 4.1 :\n\`\`\`html\n${html}\n\`\`\`${context ? `\n\nContexte : ${context}` : ""}`,
    sources,
  );

  const answer = await invokeHubLLM({ systemPrompt, messages: [{ role: "user", content: userMessage }] });

  return {
    answer,
    sources,
    mode: chromaOk ? "rag" : "degraded",
    collections_queried: chromaOk ? collections : [],
  };
}

/**
 * Problème décrit → correction concrète avec exemple de code
 */
export async function suggestFix(
  problem: string,
  criterionRef?: string,
): Promise<RagResponse> {
  const chromaOk = await isChromaAvailable();
  let sources: RagSource[] = [];
  const collections: ChromaCollectionName[] = ["rgaa_code", "rgaa_expertise", "rgaa_findings"];

  if (chromaOk) {
    const queryText = criterionRef ? `${problem} critère ${criterionRef}` : problem;
    const queryEmbedding = await embed(queryText);
    const whereFilter = criterionRef ? { criterionReference: criterionRef } : undefined;
    sources = await searchAllCollections(queryEmbedding, collections, whereFilter); // FIX: where transmis
  }

  const systemPrompt = await buildHubSystemPrompt();
  const userMessage = buildRagPrompt(
    `Propose une correction concrète pour ce problème d'accessibilité :\n${problem}${criterionRef ? `\n\nCritère RGAA concerné : ${criterionRef}` : ""}`,
    sources,
  );

  const answer = await invokeHubLLM({ systemPrompt, messages: [{ role: "user", content: userMessage }] });

  return {
    answer,
    sources,
    mode: chromaOk ? "rag" : "degraded",
    collections_queried: chromaOk ? collections : [],
  };
}

/**
 * Indexe un document dans ChromaDB.
 * Utilisé par ingestionPipeline et validate_finding.
 */
export async function indexDocument(input: IndexDocumentInput): Promise<void> {
  const embedding = await embed(input.text);
  const doc: ChromaDocument = {
    id: input.id,
    text: input.text,
    embedding,
    metadata: input.metadata,
  };
  await upsertDocuments(input.collection, [doc]);
}

/**
 * Indexe un lot de documents (plus efficace pour le bootstrap).
 */
export async function indexDocumentBatch(inputs: IndexDocumentInput[]): Promise<void> {
  // Vectoriser en batch par collection pour minimiser les appels API
  const byCollection = new Map<ChromaCollectionName, IndexDocumentInput[]>();
  for (const input of inputs) {
    const existing = byCollection.get(input.collection) ?? [];
    existing.push(input);
    byCollection.set(input.collection, existing);
  }

  for (const [col, docs] of Array.from(byCollection.entries())) {
    const embeddings = await Promise.all(docs.map((d: IndexDocumentInput) => embed(d.text)));
    const chromaDocs: ChromaDocument[] = docs.map((d: IndexDocumentInput, i: number) => ({
      id: d.id,
      text: d.text,
      embedding: embeddings[i],
      metadata: d.metadata,
    }));
    await upsertDocuments(col, chromaDocs);
  }
}

export const ragEngine = {
  askAccessibility,
  analyzeCode,
  suggestFix,
  indexDocument,
  indexDocumentBatch,
};
