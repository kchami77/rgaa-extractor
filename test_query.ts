
import "dotenv/config";
import { getDb } from "./server/repositories/connection";
import { findings, auditReports, rgaaCriteria } from "./drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

async function testQuery() {
  const db = await getDb();
  if (!db) return;

  console.time("QueryDuration");
  
  const query = db
    .select({
      id: findings.id,
      thematicNumber: findings.thematicNumber,
      criterionReference: findings.criterionReference,
      reportAuditedPages: auditReports.auditedPages,
    })
    .from(findings)
    .leftJoin(auditReports, eq(findings.reportId, auditReports.id))
    .leftJoin(rgaaCriteria, eq(findings.criterionId, rgaaCriteria.id));

  const results = await query.orderBy(findings.thematicNumber, findings.criterionReference);
  
  console.timeEnd("QueryDuration");
  console.log("Results count:", results.length);
  if (results.length > 0) {
    console.log("First result:", results[0]);
  }
}

testQuery().catch(console.error);
