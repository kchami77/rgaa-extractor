/**
 * Script de test direct pour le MCP RGAA
 * Teste les fonctions du MCP sans passer par le serveur stdio
 */

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

async function runTests() {
  console.log("🧪 Tests du MCP RGAA (mode direct)\n");
  console.log("=".repeat(80));

  try {
    // Créer le contexte et le caller
    const ctx = await createInternalContext();
    const caller = appRouter.createCaller(ctx);

    // Test 1: Liste des critères RGAA
    console.log("\n📋 Test 1: Liste des critères RGAA");
    const criteria = await caller.criteria.list();
    console.log(`✅ ${criteria.length} critères RGAA chargés`);
    console.log(`   Exemple: ${criteria[0]?.reference} - ${criteria[0]?.label}`);

    // Test 2: Liste des rapports d'audit
    console.log("\n📄 Test 2: Liste des rapports d'audit");
    const reports = await caller.audit.getUserReports();
    console.log(`✅ ${reports.length} rapport(s) d'audit trouvé(s)`);

    // Test 3: Recherche de templates (critère 1.1)
    console.log("\n🔍 Test 3: Recherche de templates pour le critère 1.1");
    const templates = await caller.findingTemplates.search({ q: "image alternative" });
    console.log(`✅ ${templates.length} template(s) trouvé(s)`);
    if (templates.length > 0) {
      console.log(`   Exemple: ${templates[0]?.finding?.substring(0, 100)}...`);
    }

    // Test 4: Récupération des constats d'un rapport (si disponible)
    if (reports.length > 0) {
      console.log("\n📊 Test 4: Récupération des constats du premier rapport");
      const reportId = reports[0].id;
      const findings = await caller.audit.getEnrichedFindings({ reportId });
      console.log(`✅ ${findings.length} constat(s) trouvé(s) pour le rapport ${reportId}`);
      if (findings.length > 0) {
        console.log(`   Premier constat: ${findings[0]?.finding?.substring(0, 100)}...`);
      }

      // Test 5: Filtrer les constats par critère 1.1
      console.log("\n🎯 Test 5: Filtrer les constats par critère 1.1");
      const findings11 = await caller.audit.getEnrichedFindings({
        reportId,
        criterionReference: "1.1",
      });
      console.log(`✅ ${findings11.length} constat(s) pour le critère 1.1`);
      if (findings11.length > 0) {
        console.log(`   Premier constat: ${findings11[0]?.finding?.substring(0, 100)}...`);
      }
    }

    // Test 6: Statistiques
    console.log("\n📈 Test 6: Statistiques");
    const stats = await caller.audit.getStats();
    console.log(`✅ Statistiques globales récupérées`);
    console.log(`   Total rapports: ${stats.totalReports}`);
    console.log(`   Total constats: ${stats.totalFindings}`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ Tous les tests terminés avec succès !");
    console.log("=".repeat(80) + "\n");
  } catch (error) {
    console.error("\n❌ Erreur lors des tests:", error);
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
    }
    process.exit(1);
  }
}

runTests();
