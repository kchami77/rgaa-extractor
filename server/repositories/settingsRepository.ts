import { eq } from "drizzle-orm";
import { getDb } from "./connection";
import { hubSettings, type HubSetting, type InsertHubSetting } from "../../drizzle/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Valeurs par défaut — servent de seed initial ET de fallback si MySQL est KO
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: Omit<InsertHubSetting, "updatedAt">[] = [
  // LLM
  { key: "llm.provider",    value: "openrouter", type: "select",   category: "llm",    description: "Fournisseur LLM (openrouter | openai | ollama | forge)" },
  { key: "llm.model",       value: "google/gemini-2.0-flash-exp:free", type: "string", category: "llm", description: "Identifiant du modèle LLM" },
  { key: "llm.apiKey",      value: "",           type: "password", category: "llm",    description: "Clé API du fournisseur LLM" },
  { key: "llm.baseUrl",     value: "",           type: "string",   category: "llm",    description: "URL de base de l'API (auto si vide)" },
  { key: "llm.maxTokens",   value: "4096",       type: "number",   category: "llm",    description: "Nombre maximum de tokens en sortie" },
  { key: "llm.temperature", value: "0.3",        type: "number",   category: "llm",    description: "Température (créativité) entre 0 et 1" },
  { key: "llm.reasoning",   value: "false",      type: "boolean",  category: "llm",    description: "Activer le mode reasoning (pensée) pour les modèles OpenRouter compatibles (ex: DeepSeek R1, GPT-o1)." },
  { key: "llm.detailLevel", value: "standard",   type: "select",   category: "llm",    description: "Niveau de détail des réponses (concise | standard | expert)" },
  // Embeddings
  { key: "embed.provider",  value: "ollama",     type: "select",   category: "embed",  description: "Fournisseur d'embeddings (openai | ollama)" },
  { key: "embed.model",     value: "nomic-embed-text", type: "string", category: "embed", description: "Modèle d'embeddings" },
  { key: "embed.apiKey",    value: "",           type: "password", category: "embed",  description: "Clé OpenAI (si provider=openai)" },
  { key: "embed.ollamaHost",value: "http://localhost:11434", type: "string", category: "embed", description: "URL du serveur Ollama" },
  // ChromaDB
  { key: "chroma.host",     value: "http://localhost:8000", type: "string", category: "chroma", description: "URL du serveur ChromaDB (ex: http://localhost:8000)" },
  { key: "chroma.enabled",  value: "true",       type: "boolean",  category: "chroma", description: "Activer la base vectorielle ChromaDB" },
  // RAG
  { key: "rag.topK",             value: "5",    type: "number",  category: "rag", description: "Nb de documents récupérés par collection" },
  { key: "rag.minSimilarity",    value: "0.65", type: "number",  category: "rag", description: "Seuil de similarité minimum (0-1)" },
  { key: "rag.weightFindings",   value: "1.5",  type: "number",  category: "rag", description: "Pondération des constats auditeurs" },
  { key: "rag.weightReferential",value: "1.0",  type: "number",  category: "rag", description: "Pondération du référentiel officiel" },
  { key: "rag.weightExpertise",  value: "1.3",  type: "number",  category: "rag", description: "Pondération des templates approuvés et notices AcceDe" },
  { key: "rag.weightCode",       value: "0.8",  type: "number",  category: "rag", description: "Pondération des snippets de code" },
  { key: "rag.citeSources",      value: "true", type: "boolean", category: "rag", description: "Inclure les sources dans la réponse" },
  // Sources
  { key: "sources.rgaa",      value: "true",  type: "boolean", category: "sources", description: "Activer ingestion RGAA 4.1.2" },
  { key: "sources.wcag",      value: "true",  type: "boolean", category: "sources", description: "Activer ingestion WCAG 2.2 Techniques" },
  { key: "sources.waiAria",   value: "true",  type: "boolean", category: "sources", description: "Activer ingestion WAI-ARIA APG" },
  { key: "sources.accedeWeb", value: "true",  type: "boolean", category: "sources", description: "Activer ingestion AcceDe Web" },
  { key: "sources.mdn",       value: "true",  type: "boolean", category: "sources", description: "Activer ingestion MDN Accessibility" },
  // MCP
  { key: "mcp.enabled",      value: "true",  type: "boolean", category: "mcp", description: "Activer le serveur MCP" },
  { key: "mcp.toolAsk",      value: "true",  type: "boolean", category: "mcp", description: "Activer l'outil ask_accessibility" },
  { key: "mcp.toolAnalyze",  value: "true",  type: "boolean", category: "mcp", description: "Activer l'outil analyze_code" },
  { key: "mcp.toolSuggest",  value: "true",  type: "boolean", category: "mcp", description: "Activer l'outil suggest_fix" },
  { key: "mcp.toolValidate", value: "true",  type: "boolean", category: "mcp", description: "Activer l'outil validate_finding" },
  // UI
  { key: "ui.theme",    value: "system", type: "select", category: "ui", description: "Thème (light | dark | system)" },
  { key: "ui.language", value: "fr",     type: "select", category: "ui", description: "Langue de l'interface (fr | en)" },
  { key: "ui.density",  value: "comfortable", type: "select", category: "ui", description: "Densité de l'interface (compact | comfortable)" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllSettings(): Promise<HubSetting[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hubSettings);
}

export async function getSettingsByCategory(category: string): Promise<HubSetting[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hubSettings).where(eq(hubSettings.category, category));
}

export async function getSetting(key: string): Promise<HubSetting | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(hubSettings).where(eq(hubSettings.key, key)).limit(1);
  return rows[0];
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // S6-1 FIX : UPDATE silencieux si la clé n'existe pas → upsert idempotent
  await db
    .insert(hubSettings)
    .values({ key, value, type: "string", category: "custom", description: null })
    .onDuplicateKeyUpdate({ set: { value } });
}

/**
 * Seed initial : insère les paramètres par défaut s'ils n'existent pas encore.
 * Appelé automatiquement au démarrage du serveur.
 */
export async function seedDefaultSettings(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  for (const setting of DEFAULT_SETTINGS) {
    await db
      .insert(hubSettings)
      .values(setting)
      .onDuplicateKeyUpdate({ set: { description: setting.description } });
  }
}
