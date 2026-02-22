
import { getDb } from "./server/repositories/connection";
import { findings, auditReports, rgaaCriteria } from "./drizzle/schema";

async function diag() {
  const db = await getDb();
  if (!db) {
    console.error("DB connection failed");
    return;
  }

  const fCount = await db.select({ count: sql`count(*)` }).from(findings);
  const rCount = await db.select({ count: sql`count(*)` }).from(auditReports);
  const cCount = await db.select({ count: sql`count(*)` }).from(rgaaCriteria);

  console.log("Findings count:", fCount[0].count);
  console.log("Reports count:", rCount[0].count);
  console.log("Criteria count:", cCount[0].count);
}

import { sql } from "drizzle-orm";
diag().catch(console.error);
