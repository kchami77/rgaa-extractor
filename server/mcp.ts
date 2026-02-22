import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { appRouter } from "./routers";
import { getUserByOpenId } from "./db";
import { ragEngine } from "./hub/ragEngine";
import { ingestionPipeline } from "./hub/ingestionPipeline";
import { isChromaAvailable } from "./hub/chromaClient";
import { settingsService } from "./hub/settingsService";
import { calculateSimilarity } from "./utils/deduplication";

// ─── Context interne ──────────────────────────────────────────────────────────
async function createInternalContext() {
  const devOpenId = "dev-local-user";
  const user = await getUserByOpenId(devOpenId);
  return {
    req: { headers: {} } as any,
    res: {} as any,
    user: user ?? null,
  };
}

// ─── Serveur MCP ──────────────────────────────────────────────────────────────
const server = new Server(
  { name: "rgaa-knowledge-hub-mcp", version: "2.0.0" },
  { capabilities: { resources: {}, tools: {} } }
);

// ─── Ressources ───────────────────────────────────────────────────────────────
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "rgaa://criteria",
      name: "Référentiel RGAA 4.1",
      mimeType: "application/json",
      description: "Liste complète des critères d'accessibilité du RGAA 4.1",
    },
    {
      uri: "rgaa://reports",
      name: "Rapports d'audit",
      mimeType: "application/json",
      description: "Liste des rapports d'audit importés dans le système",
    },
    {
      uri: "rgaa://hub-config",
      name: "Configuration du Hub",
      mimeType: "application/json",
      description: "Paramètres actifs du RGAA Knowledge Hub",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const ctx = await createInternalContext();
  const caller = appRouter.createCaller(ctx);
  const uri = request.params.uri;

  if (uri === "rgaa://criteria") {
    const criteria = await caller.criteria.list();
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(criteria, null, 2) }] };
  }

  if (uri === "rgaa://reports") {
    const reports = await caller.audit.getUserReports();
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(reports, null, 2) }] };
  }

  if (uri === "rgaa://hub-config") {
    const config = await settingsService.getAll();
    // Masquer les clés API
    const safeConfig = Object.fromEntries(
      Object.entries(config).map(([k, v]) =>
        k.toLowerCase().includes("apikey") || k.toLowerCase().includes("password")
          ? [k, v ? "***" : ""]
          : [k, v]
      )
    );
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(safeConfig, null, 2) }] };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// ─── Liste des outils ─────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ── Outils existants (v1.0) ──────────────────────────────────────────────
    {
      name: "get_report_findings",
      description: "Récupérer les constats d'un rapport d'audit spécifique.",
      inputSchema: {
        type: "object",
        properties: { reportId: { type: "number" } },
        required: ["reportId"],
      },
    },
    {
      name: "search_findings",
      description: "Rechercher des constats à travers tous les rapports avec des filtres.",
      inputSchema: {
        type: "object",
        properties: {
          criterionReference: { type: "string" },
          impact: { type: "string", enum: ["Bloquant", "Majeur", "Mineur"] },
          reportId: { type: "number" },
        },
      },
    },
    // ── Nouveaux outils Hub (v2.0) ───────────────────────────────────────────
    {
      name: "ask_accessibility",
      description: "Poser une question en langage naturel sur l'accessibilité RGAA/WCAG. Le Hub répond en utilisant sa base de connaissances (référentiel + constats). Retourne une réponse experte avec sources citées.",
      inputSchema: {
        type: "object",
        properties: {
          question: { type: "string", description: "Question en langage naturel (ex: 'Comment tester le critère 3.1 ?')" },
          context: { type: "string", description: "Contexte optionnel (ex: type de composant audité)" },
        },
        required: ["question"],
      },
    },
    {
      name: "analyze_code",
      description: "Analyser du code HTML et identifier les non-conformités RGAA 4.1. Retourne la liste des critères violés avec leur impact et des suggestions de correction.",
      inputSchema: {
        type: "object",
        properties: {
          html: { type: "string", description: "Code HTML à analyser" },
          context: { type: "string", description: "Contexte optionnel (ex: 'carrousel d'images', 'formulaire de contact')" },
        },
        required: ["html"],
      },
    },
    {
      name: "suggest_fix",
      description: "Demander une correction concrète pour un problème d'accessibilité. Retourne du code corrigé et les références normatives (RGAA, WCAG, ARIA).",
      inputSchema: {
        type: "object",
        properties: {
          problem: { type: "string", description: "Description du problème d'accessibilité" },
          criterionRef: { type: "string", description: "Référence du critère RGAA si connu (ex: '1.1')" },
        },
        required: ["problem"],
      },
    },
    {
      name: "validate_finding",
      description: "Soumettre un constat validé par un auditeur pour l'intégrer dans la base de connaissances. Ce mécanisme de capitalisation continue enrichit les réponses futures du Hub.",
      inputSchema: {
        type: "object",
        properties: {
          finding: { type: "string", description: "Texte du constat validé" },
          solution: { type: "string", description: "Solution proposée (optionnel)" },
          criterionReference: { type: "string", description: "Référence du critère RGAA (ex: '1.1')" },
          impact: { type: "string", enum: ["Bloquant", "Majeur", "Mineur"] },
        },
        required: ["finding", "criterionReference", "impact"],
      },
    },
  ],
}));

// ─── Dispatch des outils ──────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const ctx = await createInternalContext();
  const caller = appRouter.createCaller(ctx);
  const { name, arguments: args } = request.params;

  try {
    // ── Outils v1.0 (conservés) ───────────────────────────────────────────────


    if (name === "get_report_findings") {
      const findings = await caller.audit.getEnrichedFindings({ reportId: args?.reportId as number });
      return { content: [{ type: "text", text: JSON.stringify(findings, null, 2) }] };
    }

    if (name === "search_findings") {
      const findings = await caller.audit.getEnrichedFindings(args as any);
      return { content: [{ type: "text", text: JSON.stringify(findings, null, 2) }] };
    }


    // ── Nouveaux outils Hub v2.0 ──────────────────────────────────────────────

    if (name === "ask_accessibility") {
      const { question, context } = args as { question: string; context?: string };
      const result = await ragEngine.askAccessibility(question, context);
      const response = {
        answer: result.answer,
        mode: result.mode,
        sources_count: result.sources.length,
        sources: result.sources.slice(0, 5).map(s => ({
          collection: s.collection,
          criterion: s.metadata.criterionReference,
          score: s.score.toFixed(2),
          preview: s.text.slice(0, 120) + (s.text.length > 120 ? "…" : ""),
        })),
      };
      return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
    }

    if (name === "analyze_code") {
      const { html, context } = args as { html: string; context?: string };
      const result = await ragEngine.analyzeCode(html, context);
      const response = {
        analysis: result.answer,
        mode: result.mode,
        sources_count: result.sources.length,
      };
      return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
    }

    if (name === "suggest_fix") {
      const { problem, criterionRef } = args as { problem: string; criterionRef?: string };
      const result = await ragEngine.suggestFix(problem, criterionRef);
      const response = {
        suggestion: result.answer,
        mode: result.mode,
        sources_count: result.sources.length,
      };
      return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
    }

    if (name === "validate_finding") {
      const { finding, solution, criterionReference, impact } = args as {
        finding: string;
        solution?: string;
        criterionReference: string;
        impact: "Bloquant" | "Majeur" | "Mineur";
      };

      const chromaAvailable = await isChromaAvailable();
      if (!chromaAvailable) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              message: "ChromaDB indisponible — le constat n'a pas pu être indexé. Il reste accessible via MySQL.",
            }),
          }],
        };
      }

      await ingestionPipeline.indexValidatedFinding({ finding, solution, criterionReference, impact, source: "mcp-validate" });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Constat validé indexé dans la base de connaissances (critère ${criterionReference}, impact ${impact}). Il enrichira les réponses futures du Hub.`,
            confidence: 100,
          }),
        }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
    };
  }
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RGAA Knowledge Hub MCP Server v2.0 — running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
