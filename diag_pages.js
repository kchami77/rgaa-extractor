
import { getDb } from "./server/repositories/connection.js";
import { auditReports, findings } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

async function diag() {
  const db = await getDb();
  if (!db) {
    console.error("No DB connection");
    return;
  }

  const allReports = await db.select().from(auditReports).limit(10);
  console.log("--- REPORTS SAMPLE ---");
  allReports.forEach(r => {
    console.log(`Report #${r.id}: ${r.fileName}`);
    console.log(`  auditedPages: ${r.auditedPages ? r.auditedPages.substring(0, 100) + "..." : "NULL"}`);
  });

  const allFindings = await db.select().from(findings).limit(10);
  console.log("\n--- FINDINGS SAMPLE ---");
  allFindings.forEach(f => {
    console.log(`Finding #${f.id} (Report #${f.reportId}): location="${f.location}"`);
  });

  process.exit(0);
}

diag().catch(console.error);
