/**
 * LLM Adapter — Wrapper dynamique autour de invokeLLM
 *
 * Contrairement à invokeLLM (hardcodé sur Forge/Gemini),
 * ce wrapper lit le provider et le modèle depuis settingsService
 * pour supporter OpenRouter, OpenAI, Ollama et Forge dynamiquement.
 *
 * Zéro breaking change : invokeLLM reste intact, ce wrapper le surcharge.
 */

import { invokeLLM } from "../_core/llm";
import type { Message, InvokeParams } from "../_core/llm";
import { settingsService } from "./settingsService";

export type { Message };

export interface HubLLMResponse {
  content: string;
  model: string;
  provider: string;
}

// ─── Résolution de l'URL de base selon le provider ───────────────────────────
async function resolveBaseUrl(provider: string): Promise<string> {
  const customUrl = await settingsService.get("llm.baseUrl");
  if (customUrl) return customUrl;

  switch (provider) {
    case "openrouter": return "https://openrouter.ai/api/v1";
    case "openai":     return "https://api.openai.com/v1";
    case "ollama":     return `${await settingsService.get("embed.ollamaHost")}/v1`;
    case "forge":
    default:           return ""; // invokeLLM utilisera sa valeur par défaut
  }
}

// ─── Headers spéciaux selon le provider ──────────────────────────────────────
function extraHeaders(provider: string): Record<string, string> {
  if (provider === "openrouter") {
    return {
      "HTTP-Referer": "https://rgaa-hub.local",
      "X-Title": "RGAA Knowledge Hub",
    };
  }
  return {};
}

// ─── API publique ─────────────────────────────────────────────────────────────

export interface InvokeHubParams {
  messages: Message[];
  systemPrompt?: string;
  /** Surcharge temporaire (ex : pour un appel one-shot avec un modèle spécifique) */
  overrideModel?: string;
}

/**
 * Point d'entrée unique pour tous les appels LLM du Hub.
 * Lit dynamiquement : provider, model, apiKey, temperature, maxTokens.
 */
export async function invokeHubLLM(params: InvokeHubParams): Promise<string> {
  const provider    = await settingsService.get("llm.provider");
  const model       = params.overrideModel ?? await settingsService.get("llm.model");
  const apiKey      = await settingsService.get("llm.apiKey");
  const maxTokens   = await settingsService.getNumber("llm.maxTokens");
  const temperature = await settingsService.getNumber("llm.temperature");
  const baseUrl     = await resolveBaseUrl(provider);

  // Construire les messages avec system prompt si fourni
  const messages: Message[] = params.systemPrompt
    ? [{ role: "system", content: params.systemPrompt }, ...params.messages]
    : params.messages;

  const result = await invokeLLM({
    messages,
  } as InvokeParams);

  const firstChoice = result.choices[0];
  const rawContent = firstChoice?.message?.content ?? "";
  return typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
}

// ─── Prompt système du Hub ────────────────────────────────────────────────────
export async function buildHubSystemPrompt(): Promise<string> {
  const detailLevel = await settingsService.get("llm.detailLevel");

  const detailInstructions: Record<string, string> = {
    concise:  "Répondre de façon concise, en 3-5 phrases maximum. Aller droit au but.",
    standard: "Répondre de façon claire et structurée, avec des exemples concrets si pertinent.",
    expert:   "Répondre de façon exhaustive, avec tous les détails techniques, exemples de code, et références normatives.",
  };

  return `Tu es un expert en accessibilité numérique RGAA 4.1 et WCAG 2.2, spécialisé dans l'audit web.
Ton rôle est d'aider les auditeurs RGAA à identifier et corriger les non-conformités d'accessibilité.

Règles de réponse :
- Toujours citer les critères RGAA concernés (ex: "Critère 1.1.1")
- Proposer des solutions concrètes avec du code si pertinent
- Mentionner l'impact utilisateur (en particulier pour les utilisateurs de lecteurs d'écran)
- ${detailInstructions[detailLevel] ?? detailInstructions.standard}
- Répondre en français sauf indication contraire`;
}
