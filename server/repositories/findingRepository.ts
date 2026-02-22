import { findings, auditReports, rgaaCriteria, findingTemplates } from "../../drizzle/schema";
import { getDb } from "./connection";
import { searchSimilarFindingsInChroma } from "../hub/ragEngine";

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
  q?: string; // Nouvelle recherche textuelle
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

  // RECHERCHE SÉMANTIQUE (Phase 18)
  if (filters.q?.trim()) {
    try {
      const vectorResults = await searchSimilarFindingsInChroma(filters.q, 50);

      if (vectorResults.length > 0) {
        // Extraire les hashes des IDs (finding-xxxxx ou validated-xxxxx)
        const hashes = vectorResults.map((r: { id: string }) => r.id.replace(/^(finding|validated)-/, ""));

        // Trouver les templateIds correspondants aux hashes
        const templateRows = await db
          .select({ id: findingTemplates.id })
          .from(findingTemplates)
          .where(inArray(findingTemplates.signatureHash, hashes));

        const templateIds = templateRows.map(t => t.id);

        if (templateIds.length > 0) {
          conditions.push(inArray(findings.templateId, templateIds));
        } else {
          // Fallback lexical si aucun template ne correspond (cas rare)
          conditions.push(sql`${findings.finding} LIKE ${`%${filters.q}%`}`);
        }
      } else {
        // Fallback lexical si ChromaDB ne retourne rien
        conditions.push(sql`${findings.finding} LIKE ${`%${filters.q}%`}`);
      }
    } catch (e) {
      console.warn("[Hub] Recherche sémantique dégradée en lexical:", (e as Error).message);
      conditions.push(sql`${findings.finding} LIKE ${`%${filters.q}%`}`);
    }
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

/**
 * Recherche des constats similaires par mots-clés
 */
export async function searchSimilarFindings(query: string, criterionReference: string) {
  const db = await getDb();
  if (!db || !query) return [];

  const { like, and } = await import("drizzle-orm");
  const words = query.toLowerCase().split(/[\s,',.!?;]+/).filter(w => w.length >= 3);
  
  // Si le draft est trop court, on cherche juste par critère
  if (words.length === 0) {
    return await db.select().from(findings)
      .where(eq(findings.criterionReference, criterionReference))
      .limit(5);
  }

  const conditions = words.map(word => like(findings.finding, `%${word}%`));
  
  return await db.select().from(findings)
    .where(and(
      eq(findings.criterionReference, criterionReference),
      ...conditions
    ))
    .limit(10);
}
