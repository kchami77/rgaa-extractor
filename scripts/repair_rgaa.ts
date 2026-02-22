import { scrapeRgaa } from "../server/hub/scrapers/rgaaScraper";
import { upsertDocuments, resetCollection } from "../server/hub/chromaClient";
import { embed } from "../server/hub/embeddings";

async function repairReferential() {
  console.log("--- RÉPARATION DU RÉFÉRENTIEL RGAA ---");
  
  // 1. Vider la collection
  console.log("[Repair] Nettoyage de rgaa_referential...");
  await resetCollection("rgaa_referential");

  // 2. Scraper (forcé sur le JSON fallback pour la stabilité)
  console.log("[Repair] Scraping des données (JSON Fallback)...");
  const { documents } = await scrapeRgaa();
  
  console.log(`[Repair] ${documents.length} documents à indexer.`);

  // 3. Indexer avec embeddings réels
  let count = 0;
  for (const doc of documents) {
    const embedding = await embed(doc.text);
    await upsertDocuments(doc.collection as any, [{
      id: doc.id,
      text: doc.text,
      embedding,
      metadata: doc.metadata
    }]);
    count++;
    if (count % 10 === 0) console.log(`[Repair] Progress : ${count}/${documents.length}`);
  }

  console.log("--- RÉPARATION TERMINÉE ---");
}

repairReferential();
