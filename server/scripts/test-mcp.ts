/**
 * Script de test pour le MCP RGAA
 * Teste les ressources et outils disponibles
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { appRouter } from "../routers";
import { getUserByOpenId } from "../db";

async function createInternalContext() {
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
    name: "rgaa-extractor-mcp-test",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_templates",
        description: "Rechercher des modèles de constats (finding templates) dans la bibliothèque d'expertise",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Terme de recherche (ex: 'image', 'couleur')" },
            criterionReference: { type: "string", description: "Référence d'un critère (ex: '1.1')" },
          },
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
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const ctx = await createInternalContext();
  const caller = appRouter.createCaller(ctx);
  const { name, arguments: args } = request.params;

  try {
    if (name === "search_templates") {
      const q = args?.q as string;
      const templates = await caller.findingTemplates.search({ q });
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

    throw new Error(`Tool not found: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
    };
  }
});

async function runTests() {
  console.log("🧪 Tests du MCP RGAA\n");
  console.log("=".repeat(80));

  try {
    // Test 1: Liste des ressources
    console.log("\n📋 Test 1: Liste des ressources");
    const listResourcesResult = await server.request(
      { method: "resources/list", params: {} },
      ListResourcesRequestSchema
    );
    console.log("✅ Ressources disponibles:", listResourcesResult.resources.map((r) => r.name).join(", "));

    // Test 2: Lecture du référentiel RGAA
    console.log("\n📚 Test 2: Lecture du référentiel RGAA");
    const criteriaResult = await server.request(
      { method: "resources/read", params: { uri: "rgaa://criteria" } },
      ReadResourceRequestSchema
    );
    const criteriaData = JSON.parse(criteriaResult.contents[0].text);
    console.log(`✅ ${criteriaData.length} critères RGAA chargés`);
    console.log(`   Exemple: ${criteriaData[0]?.reference} - ${criteriaData[0]?.label}`);

    // Test 3: Liste des outils
    console.log("\n🔧 Test 3: Liste des outils");
    const listToolsResult = await server.request(
      { method: "tools/list", params: {} },
      ListToolsRequestSchema
    );
    console.log("✅ Outils disponibles:", listToolsResult.tools.map((t) => t.name).join(", "));

    // Test 4: Recherche de templates (critère 1.1)
    console.log("\n🔍 Test 4: Recherche de templates pour le critère 1.1");
    const searchResult = await server.request(
      { method: "tools/call", params: { name: "search_templates", arguments: { q: "image alternative" } } },
      CallToolRequestSchema
    );
    if (searchResult.isError) {
      console.log(`⚠️  Erreur de recherche: ${searchResult.content[0].text}`);
    } else {
      const templates = JSON.parse(searchResult.content[0].text);
      console.log(`✅ ${templates.length} template(s) trouvé(s)`);
      if (templates.length > 0) {
        console.log(`   Exemple: ${templates[0]?.finding?.substring(0, 100)}...`);
      }
    }

    // Test 5: Liste des rapports
    console.log("\n📄 Test 5: Liste des rapports d'audit");
    const reportsResult = await server.request(
      { method: "resources/read", params: { uri: "rgaa://reports" } },
      ReadResourceRequestSchema
    );
    const reportsData = JSON.parse(reportsResult.contents[0].text);
    console.log(`✅ ${reportsData.length} rapport(s) d'audit trouvé(s)`);

    // Test 6: Récupération des constats d'un rapport (si disponible)
    if (reportsData.length > 0) {
      console.log("\n📊 Test 6: Récupération des constats du premier rapport");
      const reportId = reportsData[0].id;
      const findingsResult = await server.request(
        { method: "tools/call", params: { name: "get_report_findings", arguments: { reportId } } },
        CallToolRequestSchema
      );
      if (findingsResult.isError) {
        console.log(`⚠️  Erreur de récupération: ${findingsResult.content[0].text}`);
      } else {
        const findings = JSON.parse(findingsResult.content[0].text);
        console.log(`✅ ${findings.length} constat(s) trouvé(s) pour le rapport ${reportId}`);
        if (findings.length > 0) {
          console.log(`   Premier constat: ${findings[0]?.finding?.substring(0, 100)}...`);
        }
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ Tous les tests terminés avec succès !");
    console.log("=".repeat(80) + "\n");
  } catch (error) {
    console.error("\n❌ Erreur lors des tests:", error);
    process.exit(1);
  }
}

runTests();
