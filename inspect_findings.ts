
import "dotenv/config";
import { getDb } from "./server/repositories/connection";
import { findings } from "./drizzle/schema";

async function inspect() {
  const db = await getDb();
  if (!db) {
    console.error("DB connection failed (env DATABASE_URL is required)");
    return;
  }

  const rows = await db.select().from(findings).limit(5);

  console.log("Found rows:", rows.length);
  rows.forEach(r => {
    console.log(`Finding ID: ${r.id}, Report ID: ${r.reportId}, Criterion ID: ${r.criterionId}, Reference: ${r.criterionReference}`);
  });
}

inspect().catch(console.error);
