import { askAccessibility } from "../server/hub/ragEngine";
import { settingsService } from "../server/hub/settingsService";

async function testHybridRecovery() {
  console.log("--- Test de Récupération Hybride (Perfection) ---");
  
  // S'assurer que les sources sont citées pour le debug
  await settingsService.set("rag.citeSources", "true");
  
  const question = "Explique le critère 7.1 et donne moi des exemples depuis mes rapports";
  console.log(`Question : "${question}"`);
  
  try {
    const response = await askAccessibility(question);
    
    console.log("\n--- RÉPONSE IA ---");
    console.log(response.answer);
    
    console.log("\n--- SOURCES UTILISÉES ---");
    response.sources.forEach((s, i) => {
      console.log(`[${i+1}] ${s.collection} | ${s.metadata.type} | Score: ${s.score.toFixed(2)}`);
      console.log(`    Text: ${s.text.slice(0, 100)}...`);
    });
    
  } catch (error) {
    console.error("Erreur durant le test :", error);
  }
}

testHybridRecovery();
