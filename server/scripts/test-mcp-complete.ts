/**
 * Script de test complet pour le MCP RGAA
 * Initialise la base de données, crée un utilisateur de test et teste toutes les fonctionnalités
 */

import { getDb } from "../repositories/connection";
import { initializeRgaaReferential, getAllCriteria } from "../repositories/referentialRepository";
import { upsertUser, getUserByOpenId } from "../repositories/userRepository";
import { appRouter } from "../routers";
import { users } from "../../drizzle/schema";

async function initializeTestEnvironment() {
  console.log("🔧 Initialisation de l'environnement de test...\n");

  // Vérifier la connexion à la base de données
  const db = await getDb();
  if (!db) {
    console.error("❌ Impossible de se connecter à la base de données.");
    console.error("Veuillez configurer la variable d'environnement DATABASE_URL.");
    process.exit(1);
  }

  console.log("✅ Base de données connectée.");

  // Créer un utilisateur de test
  const testUser = {
    openId: "dev-local-user",
    name: "Test User",
    email: "test@example.com",
    role: "admin" as const,
  };

  await upsertUser(testUser);
  console.log("✅ Utilisateur de test créé.");

  // Initialiser le référentiel RGAA
  await initializeRgaaReferential();
  console.log("✅ Référentiel RGAA initialisé.");

  return testUser;
}

async function createTestContext() {
  const user = await getUserByOpenId("dev-local-user");
  if (!user) {
    throw new Error("Test user not found");
  }

  return {
    req: { headers: {} } as any,
    res: {} as any,
    user,
  };
}

async function runTests() {
  console.log("🧪 Tests du MCP RGAA\n");
  console.log("=".repeat(80));

  try {
    // Initialiser l'environnement
    await initializeTestEnvironment();
    console.log("\n" + "=".repeat(80));

    // Créer le contexte et le caller
    const ctx = await createTestContext();
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

    // Test 7: Thématiques
    console.log("\n📚 Test 7: Liste des thématiques");
    const thematics = await caller.thematics.list();
    console.log(`✅ ${thematics.length} thématique(s) trouvée(s)`);
    console.log(`   Exemple: ${thematics[0]?.number} - ${thematics[0]?.name}`);

    // Test 8: Critères par thématique
    console.log("\n🎯 Test 8: Critères de la thématique 1 (Images)");
    const criteria1 = await caller.criteria.getByThematic({ thematicNumber: 1 });
    console.log(`✅ ${criteria1.length} critère(s) pour la thématique 1`);
    console.log(`   Exemple: ${criteria1[0]?.reference} - ${criteria1[0]?.label}`);

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
