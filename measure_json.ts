
import "dotenv/config";
import { getDb } from "./server/repositories/connection";
import { findings, auditReports, rgaaCriteria } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function measure() {
  const db = await getDb();
  if (!db) return;

  const query = db
    .select({
      id: findings.id,
      reportId: findings.reportId,
      criterionId: findings.criterionId,
      thematicId: findings.thematicId,
      subThematic: findings.subThematic,
      impact: findings.impact,
      location: findings.location,
      contentType: findings.contentType,
      userProblem: findings.userProblem,
      finding: findings.finding,
      solution: findings.solution,
      thematicNumber: findings.thematicNumber,
      criterionReference: findings.criterionReference,
      createdAt: findings.createdAt,
      reportFileName: auditReports.fileName,
      reportSiteUrl: auditReports.siteUrl,
      reportAuditedPages: auditReports.auditedPages,
      criterionLabel: rgaaCriteria.label,
    })
    .from(findings)
    .leftJoin(auditReports, eq(findings.reportId, auditReports.id))
    .leftJoin(rgaaCriteria, eq(findings.criterionId, rgaaCriteria.id));

  const results = await query.orderBy(findings.thematicNumber, findings.criterionReference);
  
  const json = JSON.stringify(results);
  const sizeKB = json.length / 1024;
  console.log(`JSON size for ${results.length} results: ${sizeKB.toFixed(2)} KB`);
  
  // Check if some results are missing labels
  const missingLabels = results.filter(r => !r.criterionLabel).length;
  console.log("Results missing criterionLabel:", missingLabels);
}

measure().catch(console.error);
