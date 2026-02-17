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

// --- Mock Context for tRPC Caller ---
async function createInternalContext() {
  // En mode POC, on utilise l'utilisateur dev par défaut
  const devOpenId = "dev-local-user";
  const user = await getUserByOpenId(devOpenId);
  
  return {
    req: { headers: {} } as any,
    res: {} as any,
    user: user ?? null,
  };
}

const server = new Server(
  {
    name: "rgaa-extractor-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * Liste des ressources disponibles
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
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
    ],
  };
});

/**
 * Lecture d'une ressource
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const ctx = await createInternalContext();
  const caller = appRouter.createCaller(ctx);
  const uri = request.params.uri;

  if (uri === "rgaa://criteria") {
    const criteria = await caller.criteria.list();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(criteria, null, 2),
        },
      ],
    };
  }

  if (uri === "rgaa://reports") {
    const reports = await caller.audit.getUserReports();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(reports, null, 2),
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

/**
 * Liste des outils disponibles
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_rgaa_expertise",
        description: "Rechercher des solutions génériques et modèles de constats (expertise) dans la bibliothèque centrale. À utiliser pour trouver comment rédiger un constat de manière professionnelle.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Terme technique ou fonctionnel (ex: 'carousel', 'pagination', 'iframe')" },
          },
        },
      },
      {
        name: "get_expertise_by_criterion",
        description: "Récupérer tous les modèles de constats validés pour un critère RGAA spécifique (ex: '1.1'). Utile pour voir les meilleures manières d'auditer un critère précis.",
        inputSchema: {
          type: "object",
          properties: {
            criterionReference: { type: "string", description: "Référence du critère (ex: '8.3')" },
          },
          required: ["criterionReference"],
        },
      },
      {
        name: "get_report_findings",
        description: "Récupérer les constats d'un rapport d'audit spécifique",
        inputSchema: {
          type: "object",
          properties: {
            reportId: { type: "number" },
          },
          required: ["reportId"],
        },
      },
      {
        name: "search_findings",
        description: "Rechercher des constats à travers tous les rapports avec des filtres (critère, impact, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            criterionReference: { type: "string", description: "Référence du critère (ex: '1.1')" },
            impact: { type: "string", enum: ["Bloquant", "Majeur", "Mineur"] },
            reportId: { type: "number" },
          },
        },
      },
      {
        name: "propose_deduplication",
        description: "Analyser un constat spécifique pour trouver des modèles similaires dans la bibliothèque. Aide à fusionner les doublons sémantiques.",
        inputSchema: {
          type: "object",
          properties: {
            findingText: { type: "string" },
            criterionReference: { type: "string" },
          },
          required: ["findingText", "criterionReference"],
        },
      },
    ],
  };
});

/**
 * Appel d'un outil
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const ctx = await createInternalContext();
  const caller = appRouter.createCaller(ctx);
  const { name, arguments: args } = request.params;

  try {
    if (name === "search_rgaa_expertise") {
      const q = args?.q as string;
      const templates = await caller.findingTemplates.search({ q, status: "approved" });
      return {
        content: [{ type: "text", text: JSON.stringify(templates, null, 2) }],
      };
    }

    if (name === "get_expertise_by_criterion") {
      const ref = args?.criterionReference as string;
      const templates = await caller.findingTemplates.getByCriterion({ criterionReference: ref });
      return {
        content: [{ type: "text", text: JSON.stringify(templates, null, 2) }],
      };
    }

    if (name === "get_report_findings") {
      const reportId = args?.reportId as number;
      const findings = await caller.audit.getEnrichedFindings({ reportId });
      return {
        content: [{ type: "text", text: JSON.stringify(findings, null, 2) }],
      };
    }

    if (name === "search_findings") {
      const findings = await caller.audit.getEnrichedFindings(args as any);
      return {
        content: [{ type: "text", text: JSON.stringify(findings, null, 2) }],
      };
    }

    if (name === "propose_deduplication") {
      const { findingText, criterionReference } = args as any;
      
      // 1. Récupérer les templates du critère
      const templates = await caller.findingTemplates.getByCriterion({ criterionReference });
      
      // 2. Calculer la similitude sémantique (via utilitaire)
      const { calculateSimilarity } = await import("./utils/deduplication");
      const suggestions = templates
        .map(t => ({
          templateId: t.id,
          finding: t.finding,
          similarity: calculateSimilarity(findingText, t.finding),
          status: t.status
        }))
        .filter(s => s.similarity > 0.6) // Seuil de pertinence
        .sort((a, b) => b.similarity - a.similarity);

      return {
        content: [{ type: "text", text: JSON.stringify(suggestions, null, 2) }],
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

/**
 * Démarrage du serveur sur stdio
 */
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RGAA MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
