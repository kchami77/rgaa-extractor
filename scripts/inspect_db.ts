import { queryCollection } from "../server/hub/chromaClient";
import { embed } from "../server/hub/embeddings";

async function inspectCriterion(ref: string) {
  console.log(`--- Inspection du critère ${ref} ---`);
  
  const queryEmbedding = await embed(`Critère ${ref}`);
  
  // 1. Chercher par filtre exact de métadonnées
  console.log("\n1. Recherche par MÉTADONNÉES exactes (criterion: " + ref + ") :");
  const exactResults = await queryCollection("rgaa_referential", queryEmbedding, 5, { criterion: ref });
  exactResults.forEach(r => {
    console.log(`- ID: ${r.id} | Type: ${r.metadata.type} | Text: ${r.text.slice(0, 150)}...`);
  });

  // 2. Recherche sémantique pure
  console.log("\n2. Recherche SÉMANTIQUE pure :");
  const semanticResults = await queryCollection("rgaa_referential", queryEmbedding, 5);
  semanticResults.forEach(r => {
    console.log(`- ID: ${r.id} | Distance: ${r.distance.toFixed(4)} | Criterion Meta: ${r.metadata.criterion} | Text: ${r.text.slice(0, 150)}...`);
  });
}

const target = process.argv[2] || "7.1";
inspectCriterion(target);
