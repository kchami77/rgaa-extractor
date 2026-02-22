import { queryCollection } from "../server/hub/chromaClient";
import { embed } from "../server/hub/embeddings";

async function dumpCriteria() {
  console.log("--- DUMP DES CRITÈRES INDEXÉS ---");
  const queryEmbedding = await embed("Critère");
  
  // Chercher largement dans le référentiel
  const results = await queryCollection("rgaa_referential", queryEmbedding, 50);
  
  results.forEach(r => {
    const crit = r.metadata.criterion || "N/A";
    const type = r.metadata.type || "N/A";
    console.log(`[${crit}] (${type}) -> ${r.text.slice(0, 100)}...`);
  });
}

dumpCriteria();
