import { eq, and, inArray, or, sql } from "drizzle-orm";
import { findings, auditReports, rgaaCriteria } from "../../drizzle/schema";
import { getDb } from "./connection";

/**
 * Crée un nouveau constat
 */
export async function createFinding(data: {
  reportId: number;
  criterionId: number;
  thematicId: number;
  subThematic?: string;
  impact: "Bloquant" | "Majeur" | "Mineur";
  location?: string;
  contentType?: string;
  userProblem?: string;
  finding: string;
  solution?: string;
  thematicNumber?: number;
  criterionReference?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(findings).values(data);
  return result;
}

type FindingInput = Parameters<typeof createFinding>[0];

/**
 * Insère un lot de constats dans une transaction MySQL.
 * Si une insertion échoue, tout le lot est annulé (rollback).
 * Retourne le nombre de constats insérés.
 */
export async function createFindingsBatch(items: FindingInput[]): Promise<number> {
  const db = await getDb();
  if (!db || items.length === 0) return 0;

  let count = 0;
  await db.transaction(async (tx) => {
    for (const data of items) {
      await tx.insert(findings).values(data);
      count++;
    }
  });

  return count;
}

/**
 * Récupère tous les constats d'un rapport
 */
export async function getReportFindings(reportId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(findings)
    .where(eq(findings.reportId, reportId))
    .orderBy(findings.thematicNumber, findings.criterionReference);
}

/**
 * Récupère les constats filtrés par thématique et/ou critère
 */
export async function getFilteredFindings(filters: {
  thematicNumber?: number;
  criterionReference?: string;
  impact?: "Bloquant" | "Majeur" | "Mineur";
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.thematicNumber !== undefined) {
    conditions.push(eq(findings.thematicNumber, filters.thematicNumber));
  }
  if (filters.criterionReference) {
    conditions.push(eq(findings.criterionReference, filters.criterionReference));
  }
  if (filters.impact) {
    conditions.push(eq(findings.impact, filters.impact));
  }

  const query = conditions.length > 0 ? db.select().from(findings).where(and(...conditions)) : db.select().from(findings);
  return await query.orderBy(findings.thematicNumber, findings.criterionReference);
}

/**
 * Compte les constats par thématique
 */
export async function getStatsByThematic() {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    thematicNumber: findings.thematicNumber,
    count: findings.id,
  }).from(findings).groupBy(findings.thematicNumber);
}

/**
 * Compte les constats par impact
 */
export async function getStatsByImpact() {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    impact: findings.impact,
    count: findings.id,
  }).from(findings).groupBy(findings.impact);
}

/**
 * Récupère les constats enrichis avec les données du rapport et du critère
 * Effectue un JOIN entre findings, audit_reports et rgaa_criteria
 */
export async function getEnrichedFindings(filters: {
  reportId?: number;
  reportIds?: number[];
  pageNames?: string[];
  thematicNumber?: number;
  impact?: "Bloquant" | "Majeur" | "Mineur";
  criterionReference?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.reportId !== undefined) {
    conditions.push(eq(findings.reportId, filters.reportId));
  }
  if (filters.reportIds !== undefined && filters.reportIds.length > 0) {
    conditions.push(inArray(findings.reportId, filters.reportIds));
  }
  if (filters.pageNames !== undefined && filters.pageNames.length > 0) {
    const pageConditions = filters.pageNames.map(pageName => 
      sql`${findings.location} LIKE ${`%${pageName}%`}`
    );
    conditions.push(or(...pageConditions));
  }
  if (filters.thematicNumber !== undefined) {
    conditions.push(eq(findings.thematicNumber, filters.thematicNumber));
  }
  if (filters.impact) {
    conditions.push(eq(findings.impact, filters.impact));
  }
  if (filters.criterionReference) {
    conditions.push(eq(findings.criterionReference, filters.criterionReference));
  }

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
      // Report data
      reportFileName: auditReports.fileName,
      reportSiteUrl: auditReports.siteUrl,
      reportAuditedPages: auditReports.auditedPages,
      // Criterion data
      criterionLabel: rgaaCriteria.label,
    })
    .from(findings)
    .leftJoin(auditReports, eq(findings.reportId, auditReports.id))
    .leftJoin(rgaaCriteria, eq(findings.criterionId, rgaaCriteria.id));

  if (conditions.length > 0) {
    return await query.where(and(...conditions)).orderBy(findings.thematicNumber, findings.criterionReference);
  }
  return await query.orderBy(findings.thematicNumber, findings.criterionReference);
}
