/**
 * Settings Service — Cache mémoire des paramètres du Hub
 *
 * Principe :
 *   - Premier appel → charge TOUS les settings depuis MySQL (warmupCache)
 *   - Appels suivants → lecture depuis le Map en mémoire (< 1µs)
 *   - setSetting() → écrit en BDD ET met à jour le cache local
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
import type { HubSetting } from "../../drizzle/schema";

// ─── Cache mémoire ────────────────────────────────────────────────────────────
const cache = new Map<string, HubSetting>();
let initialized = false;
let initializing = false;

// ─── Valeurs ENV disponibles comme fallback de dernier recours ───────────────
const ENV_FALLBACKS: Record<string, string> = {
  "llm.apiKey":       ENV.forgeApiKey ?? "",
  "embed.ollamaHost": process.env.OLLAMA_HOST ?? "http://localhost:11434",
  "chroma.host":      process.env.CHROMA_HOST  ?? "http://localhost:8000",
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
  "rag.weightExpertise":"1.3",
  "rag.weightCode":   "0.8",
  "rag.citeSources":  "true",
};

// ─── Initialisation (Promise singleton — thread-safe) ────────────────────────
let _warmupPromise: Promise<void> | null = null;

async function _doWarmup(): Promise<void> {
  initializing = true;
  try {
    await seedDefaultSettings();
    const rows = await getAllSettings();
    for (const row of rows) {
      cache.set(row.key, row);
    }
    initialized = true;
    console.log(`[SettingsService] Cache chargé — ${cache.size} paramètres`);
  } catch (err) {
    console.warn("[SettingsService] MySQL indisponible au démarrage — fallback ENV activé");
    // On marque quand même comme initialisé pour autoriser le service à répondre via ENV
    initialized = true;
  } finally {
    initializing = false;
  }
}

/**
 * Charge tous les settings en mémoire depuis MySQL.
 * Utilise un singleton Promise pour éviter les lancements multiples simultanés.
 */
async function warmupCache(): Promise<void> {
  if (initialized) return;
  if (!_warmupPromise) _warmupPromise = _doWarmup();
  return _warmupPromise;
}

// ─── API publique ─────────────────────────────────────────────────────────────

/** Récupère la valeur d'un paramètre. */
export async function getSetting(key: string): Promise<string> {
  if (!initialized) await warmupCache();
  return cache.get(key)?.value ?? ENV_FALLBACKS[key] ?? "";
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

/** Met à jour un paramètre en BDD ET rafraîchit le cache local. */
export async function setSetting(key: string, value: string): Promise<void> {
  if (!initialized) await warmupCache();
  
  // Tentative en BDD
  await dbSetSetting(key, value).catch(err => {
     console.error(`[SettingsService] Échec persistence BDD pour ${key}:`, err.message);
     // On continue pour mettre à jour le cache même si la BDD a échoué (mode dégradé)
  });

  const existing = cache.get(key);
  if (existing) {
    cache.set(key, { ...existing, value, updatedAt: new Date() });
  } else {
    // Si la clé n'existe pas encore dans le cache (setting custom)
    cache.set(key, { 
      key, 
      value, 
      type: "string", 
      category: "custom", 
      description: null, 
      updatedAt: new Date() 
    });
  }
}

/** Retourne tous les paramètres complets (pour l'UI Options). */
export async function getAllCachedSettings(): Promise<HubSetting[]> {
  if (!initialized) await warmupCache();
  return Array.from(cache.values());
}

/** Force le rechargement du cache depuis MySQL. */
export async function reloadCache(): Promise<void> {
  initialized = false;
  _warmupPromise = null;
  cache.clear();
  await warmupCache();
}

/** Expose le settingsService comme objet */
export const settingsService = {
  get: getSetting,
  getBool: getSettingBool,
  getNumber: getSettingNumber,
  set: setSetting,
  getAll: getAllCachedSettings,
  reload: reloadCache,
};
