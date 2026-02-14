import { getFilteredFindings } from "../repositories/findingRepository";
import { getDb } from "../repositories/connection";

async function main() {
  console.log("🔍 Recherche des erreurs RGAA pour le critère 1.1...\n");

  // Vérifier la connexion à la base de données
  const db = await getDb();
  if (!db) {
    console.error("❌ Impossible de se connecter à la base de données.");
    console.error("Vérifiez que la variable d'environnement DATABASE_URL est configurée.");
    process.exit(1);
  }

  console.log("✅ Connexion à la base de données réussie.\n");

  // Interroger les constats pour le critère 1.1
  const findings = await getFilteredFindings({
    criterionReference: "1.1",
  });

  // Afficher les résultats
  console.log(`📊 Résultats : ${findings.length} erreur(s) trouvée(s) pour le critère 1.1\n`);
  console.log("=".repeat(80));

  if (findings.length === 0) {
    console.log("Aucune erreur trouvée pour le critère 1.1.");
    console.log("\nLe critère 1.1 du RGAA 4.1 est :");
    console.log('"Chaque image porteuse d\'information a-t-elle une alternative textuelle ?"');
    return;
  }

  // Analyser les résultats par niveau d'impact
  const impactCounts = {
    Bloquant: 0,
    Majeur: 0,
    Mineur: 0,
  };

  findings.forEach((finding) => {
    impactCounts[finding.impact]++;
  });

  console.log("\n📈 Distribution par niveau d'impact :");
  console.log(`   • Bloquant : ${impactCounts.Bloquant}`);
  console.log(`   • Majeur   : ${impactCounts.Majeur}`);
  console.log(`   • Mineur   : ${impactCounts.Mineur}`);
  console.log("\n" + "=".repeat(80) + "\n");

  // Afficher le détail de chaque constat
  findings.forEach((finding, index) => {
    console.log(`\n${"─".repeat(80)}`);
    console.log(`ERREUR #${index + 1}`);
    console.log(`${"─".repeat(80)}`);
    console.log(`📍 Impact      : ${finding.impact}`);
    console.log(`📍 Localisation: ${finding.location || "Non spécifié"}`);
    console.log(`📍 Type contenu: ${finding.contentType || "Non spécifié"}`);

    if (finding.userProblem) {
      console.log(`👤 Problème utilisateur: ${finding.userProblem}`);
    }

    console.log(`\n📝 Constat :`);
    console.log(`${finding.finding}`);

    if (finding.solution) {
      console.log(`\n💡 Solution :`);
      console.log(`${finding.solution}`);
    }
  });

  console.log(`\n${"=".repeat(80)}`);
  console.log("✅ Analyse terminée");
  console.log(`${"=".repeat(80)}\n`);
}

main().catch((error) => {
  console.error("❌ Erreur lors de l'exécution :", error);
  process.exit(1);
});
