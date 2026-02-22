/**
 * LLM Adapter — Appel LLM configurable dynamiquement pour le Hub
 *
 * Contrairement à invokeLLM (hardcodé sur Forge/Gemini),
 * ce module fait un fetch direct vers l'endpoint configuré dans settingsService.
 * Cela permet au Hub d'utiliser OpenRouter, OpenAI, Ollama ou Forge
 * selon la configuration de l'utilisateur.
 *
 * NOTE : invokeLLM (llm.ts) reste intact — il est utilisé par les autres
 * features (parser, AI, etc.) avec Forge. Ce wrapper est exclusif au Hub.
 */

import type { Message } from "../_core/llm";
import { settingsService } from "./settingsService";

export type { Message };

export interface HubLLMResponse {
  content: string;
  model: string;
  provider: string;
}

// ─── Résolution de l'URL complète selon le provider ──────────────────────────
async function resolveEndpointUrl(provider: string): Promise<string> {
  const customUrl = await settingsService.get("llm.baseUrl");
  if (customUrl) return customUrl.replace(/\/$/, "") + "/chat/completions";

  switch (provider) {
    case "openrouter": return "https://openrouter.ai/api/v1/chat/completions";
    case "openai":     return "https://api.openai.com/v1/chat/completions";
    case "ollama":     {
      const ollamaHost = await settingsService.get("embed.ollamaHost");
      return `${ollamaHost.replace(/\/$/, "")}/v1/chat/completions`;
    }
    case "forge":
    default: {
      const forgeUrl = process.env.FORGE_API_URL ?? "https://forge.manus.im";
      return `${forgeUrl.replace(/\/$/, "")}/v1/chat/completions`;
    }
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
 * Fait un fetch direct (n'utilise pas invokeLLM) pour respecter la config.
 */
export async function invokeHubLLM(params: InvokeHubParams): Promise<string> {
  const provider    = await settingsService.get("llm.provider");
  const model       = params.overrideModel ?? await settingsService.get("llm.model");
  const apiKey      = await settingsService.get("llm.apiKey");
  const maxTokens   = await settingsService.getNumber("llm.maxTokens") || 4096;
  const temperature = await settingsService.getNumber("llm.temperature") || 0.3;
  const reasoning   = await settingsService.getBool("llm.reasoning");
  const endpointUrl = await resolveEndpointUrl(provider);

  // Construire les messages avec system prompt si fourni
  const messages: Array<{ role: string; content: string }> = [];
  if (params.systemPrompt) {
    messages.push({ role: "system", content: params.systemPrompt });
  }
  for (const m of params.messages) {
    messages.push({
      role: m.role,
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    });
  }

  const payload: any = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  };

  // S12-1 FIX : Ajout du support OpenRouter Reasoning
  if (provider === "openrouter" && reasoning) {
    payload.reasoning = { enabled: true };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60_000); // 60s max pour un LLM

  let response: Response;
  try {
    response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        ...extraHeaders(provider),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    let friendlyMessage = `[Hub/LLM] ${provider}/${model} HTTP ${response.status}: ${errorText}`;

    // S12-2 FIX : Détection spécifique de l'erreur de politique de données OpenRouter
    if (provider === "openrouter" && errorText.includes("data policy")) {
      friendlyMessage = `[Hub/LLM] Erreur de politique OpenRouter. Les modèles gratuits exigent d'activer le partage de données dans vos réglages : https://openrouter.ai/settings/privacy (activez "Free model publication").`;
    }

    throw new Error(friendlyMessage);
  }

  const result = await response.json() as {
    choices: Array<{
      message: { content: string | null };
    }>;
  };

  const rawContent = result.choices?.[0]?.message?.content ?? "";

  // S3-1 FIX : réponse vide = erreur explicite (content:null = context trop long ou tool_call)
  if (!rawContent) {
    throw new Error(
      `[Hub/LLM] Réponse vide du modèle ${model} (provider: ${provider}). ` +
      `Vérifiez la clé API, les limites de tokens, ou réduisez la taille du prompt.`
    );
  }

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
