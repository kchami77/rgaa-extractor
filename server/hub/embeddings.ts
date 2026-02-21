/**
 * Embeddings Service — Vectorisation de texte
 *
 * Interface abstraite : le Hub ne sait pas quel moteur il utilise.
 * La sélection est pilotée par settingsService.get("embed.provider").
 *
 * Providers supportés :
 *   - ollama : nomic-embed-text (local, gratuit, dim=768) — défaut
 *   - openai : text-embedding-3-small (cloud, dim=1536)
 */

import { settingsService } from "./settingsService";

// ─── Interface abstraite ──────────────────────────────────────────────────────
export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
  readonly dimension: number;
  readonly name: string;
}

// ─── Provider : Ollama ────────────────────────────────────────────────────────
class OllamaEmbeddingProvider implements EmbeddingProvider {
  readonly dimension = 768;
  readonly name = "ollama";

  async embed(text: string): Promise<number[]> {
    const host = await settingsService.get("embed.ollamaHost");
    const model = await settingsService.get("embed.model");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch(`${host}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: text }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`[Embeddings/Ollama] HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json() as { embedding: number[] };
      return data.embedding;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Ollama ne supporte pas le batch natif — concurrence limitée à 5 pour éviter le goulot
    const CONCURRENCY = 5;
    const results: number[][] = [];
    for (let i = 0; i < texts.length; i += CONCURRENCY) {
      const chunk = texts.slice(i, i + CONCURRENCY);
      results.push(...await Promise.all(chunk.map(t => this.embed(t))));
    }
    return results;
  }
}

// ─── Provider : OpenAI ───────────────────────────────────────────────────────
class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly dimension = 1536;
  readonly name = "openai";

  async embed(text: string): Promise<number[]> {
    const results = await this.embedBatch([text]);
    return results[0];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const apiKey = await settingsService.get("embed.apiKey");
    const model  = await settingsService.get("embed.model");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ input: texts, model }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`[Embeddings/OpenAI] HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json() as { data: { embedding: number[] }[] };
      return data.data.map(d => d.embedding);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// ─── Factory — sélection dynamique depuis les settings ───────────────────────
let _provider: EmbeddingProvider | null = null;
let _lastProviderName = "";

/**
 * Retourne le provider actif selon embed.provider en base.
 * Si le provider change dans les Options, la prochaine requête
 * instancie automatiquement le bon provider.
 */
async function getProvider(): Promise<EmbeddingProvider> {
  const providerName = await settingsService.get("embed.provider");

  if (_provider && _lastProviderName === providerName) {
    return _provider;
  }

  switch (providerName) {
    case "openai":
      _provider = new OpenAIEmbeddingProvider();
      break;
    case "ollama":
    default:
      _provider = new OllamaEmbeddingProvider();
      break;
  }

  _lastProviderName = providerName;
  console.log(`[Embeddings] Provider actif : ${providerName} (${_provider.dimension}d)`);
  return _provider;
}

// ─── API publique ─────────────────────────────────────────────────────────────
export async function embed(text: string): Promise<number[]> {
  const provider = await getProvider();
  return provider.embed(text);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const provider = await getProvider();
  return provider.embedBatch(texts);
}

export async function getEmbeddingDimension(): Promise<number> {
  const provider = await getProvider();
  return provider.dimension;
}

export const embeddingService = { embed, embedBatch, getEmbeddingDimension };
