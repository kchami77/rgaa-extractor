
import "dotenv/config";
import { getDb } from "./server/repositories/connection";
import { rgaaCriteria, auditReports } from "./drizzle/schema";
import { sql } from "drizzle-orm";

async function diag() {
  const db = await getDb();
  if (!db) return;

  const cRows = await db.select().from(rgaaCriteria).limit(5);
  console.log("Criteria count (limit 5):", cRows.length);
  cRows.forEach(c => console.log(`Criterion ID: ${c.id}, Ref: ${c.reference}, Label: ${c.label.substring(0, 30)}...`));

  const reports = await db.select().from(auditReports).limit(1);
  if (reports[0]) {
    const pages = reports[0].auditedPages || "";
    console.log(`Report #1 auditedPages length: ${pages.length} characters`);
  }
}

diag().catch(console.error);
