import { getOrCreateCollection } from "../server/hub/chromaClient";
import { embed } from "../server/hub/embeddings";

async function debug71() {
  console.log("--- Diagnostic RAG pour le critère 7.1 ---");

  try {
    const colName = "rgaa_referential";
    const collection = await getOrCreateCollection(colName);
    
    // 1. Recherche thématique "Structuration de l'information"
    console.log("\n1. Recherche sémantique sur 'Structuration de l'information'...");
    const queryEmbedding1 = await embed("Structuration de l'information");
    const results1 = await collection.query({
      queryEmbeddings: [queryEmbedding1],
      nResults: 5
    });
    
    console.log("Résultats pour 'Structuration de l'information' :");
    results1.ids[0].forEach((id, i) => {
      console.log(`- [${id}] (distance: ${results1.distances![0][i]}) : ${results1.documents![0][i]?.slice(0, 150)}...`);
      console.log(`  Metadata: ${JSON.stringify(results1.metadatas![0][i])}`);
    });

    // 2. Recherche sur le texte hallucinogène
    console.log("\n2. Recherche sémantique sur l'intitulé faux...");
    const hallucinationText = "Pour chaque page web, l'information doit-elle être présentée de manière à ce que la structure soit lisible par les technologies d'assistance";
    const queryEmbedding2 = await embed(hallucinationText);
    const results2 = await collection.query({
      queryEmbeddings: [queryEmbedding2],
      nResults: 5
    });
    
    console.log("Résultats pour l'hallucination :");
    results2.ids[0].forEach((id, i) => {
      console.log(`- [${id}] (distance: ${results2.distances![0][i]}) : ${results2.documents![0][i]?.slice(0, 150)}...`);
      console.log(`  Metadata: ${JSON.stringify(results2.metadatas![0][i])}`);
    });

  } catch (error) {
    console.error("Erreur durant le diagnostic :", error);
  }
}

debug71();
