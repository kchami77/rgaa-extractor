/**
 * Settings Service — Cache mémoire des paramètres du Hub
 *
 * Principe :
 *   - Premier appel → charge TOUS les settings depuis MySQL (warmupCache)
 *   - Appels suivants → lecture depuis le Map en mémoire (< 1µs)
 *   - setSetting() → écrit en BDD ET invalide le cache local
 *   - Si MySQL est KO au démarrage → fallback silencieux sur les valeurs ENV/défaut
 *
 * Règle : ce service ne doit JAMAIS faire crasher le serveur.
 */

import { ENV } from "../_core/env";
import {
  getAllSettings,
  getSetting as dbGetSetting,
  setSetting as dbSetSetting,
  seedDefaultSettings,
} from "../repositories/settingsRepository";

// ─── Cache mémoire ────────────────────────────────────────────────────────────
const cache = new Map<string, string>();
let initialized = false;
let initializing = false;

// ─── Valeurs ENV disponibles comme fallback de dernier recours ───────────────
const ENV_FALLBACKS: Record<string, string> = {
  "llm.apiKey":       ENV.forgeApiKey ?? "",
  "embed.ollamaHost": process.env.OLLAMA_HOST ?? "http://localhost:11434",
  "chroma.path":      process.env.CHROMA_PATH  ?? "./data/chromadb",
  "llm.provider":     "openrouter",
  "llm.model":        "openai/gpt-oss-120b:free",
  "llm.maxTokens":    "4096",
  "llm.temperature":  "0.3",
  "embed.provider":   "ollama",
  "embed.model":      "nomic-embed-text",
  "chroma.enabled":   "true",
  "rag.topK":         "5",
  "rag.minSimilarity":"0.65",
  "rag.weightFindings":"1.5",
  "rag.weightReferential":"1.0",
  "rag.weightCode":   "0.8",
  "rag.citeSources":  "true",
};

// ─── Initialisation ───────────────────────────────────────────────────────────

/**
 * Charge tous les settings en mémoire depuis MySQL.
 * Appelé une seule fois au démarrage (lazy, thread-safe par flag).
 */
async function warmupCache(): Promise<void> {
  if (initialized || initializing) return;
  initializing = true;

  try {
    await seedDefaultSettings();
    const rows = await getAllSettings();
    for (const row of rows) {
      cache.set(row.key, row.value);
    }
    initialized = true;
    console.log(`[SettingsService] Cache chargé — ${cache.size} paramètres`);
  } catch (err) {
    // MySQL indisponible → on continue avec les fallbacks ENV
    console.warn("[SettingsService] MySQL indisponible au démarrage — fallback ENV activé");
    for (const [k, v] of Object.entries(ENV_FALLBACKS)) {
      if (!cache.has(k)) cache.set(k, v);
    }
    initialized = true; // éviter les retry infinis
  } finally {
    initializing = false;
  }
}

// ─── API publique ─────────────────────────────────────────────────────────────

/** Récupère un paramètre. Jamais null grâce aux fallbacks. */
export async function getSetting(key: string): Promise<string> {
  if (!initialized) await warmupCache();
  return cache.get(key) ?? ENV_FALLBACKS[key] ?? "";
}

/** Récupère un booléen. */
export async function getSettingBool(key: string): Promise<boolean> {
  const v = await getSetting(key);
  return v === "true" || v === "1";
}

/** Récupère un nombre. */
export async function getSettingNumber(key: string): Promise<number> {
  const v = await getSetting(key);
  return parseFloat(v) || 0;
}

/** Met à jour un paramètre en BDD ET invalide le cache local. */
export async function setSetting(key: string, value: string): Promise<void> {
  await dbSetSetting(key, value);
  cache.set(key, value); // invalidation locale immédiate
}

/** Retourne tous les paramètres du cache (pour l'UI Options). */
export async function getAllCachedSettings(): Promise<Record<string, string>> {
  if (!initialized) await warmupCache();
  return Object.fromEntries(cache);
}

/** Force le rechargement du cache depuis MySQL (après import en masse). */
export async function reloadCache(): Promise<void> {
  initialized = false;
  cache.clear();
  await warmupCache();
}

/** Expose le settingsService comme objet pour faciliter les imports */
export const settingsService = {
  get: getSetting,
  getBool: getSettingBool,
  getNumber: getSettingNumber,
  set: setSetting,
  getAll: getAllCachedSettings,
  reload: reloadCache,
};
