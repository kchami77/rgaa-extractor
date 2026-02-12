import { eq, and, inArray, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, rgaaThematics, rgaaCriteria, auditReports, findings, findingTemplates } from "../drizzle/schema";
import { ENV } from './_core/env';
import { RGAA_THEMATICS, RGAA_CRITERIA } from "./rgaa-data";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Initialise le référentiel RGAA 4.1 dans la base de données
 */
export async function initializeRgaaReferential() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot initialize RGAA referential: database not available");
    return;
  }

  try {
    // Insérer les thématiques
    for (const thematic of RGAA_THEMATICS) {
      await db.insert(rgaaThematics).values({
        number: thematic.number,
        name: thematic.name,
        description: thematic.description,
      }).onDuplicateKeyUpdate({
        set: {
          name: thematic.name,
          description: thematic.description,
        },
      });
    }

    // Insérer les critères
    for (const criterion of RGAA_CRITERIA) {
      await db.insert(rgaaCriteria).values({
        reference: criterion.reference,
        label: criterion.label,
        thematicId: criterion.thematicNumber,
        description: criterion.description,
      }).onDuplicateKeyUpdate({
        set: {
          label: criterion.label,
          thematicId: criterion.thematicNumber,
          description: criterion.description,
        },
      });
    }

    console.log("[Database] RGAA referential initialized successfully");
  } catch (error) {
    console.error("[Database] Failed to initialize RGAA referential:", error);
    throw error;
  }
}

/**
 * Récupère toutes les thématiques RGAA
 */
export async function getAllThematics() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rgaaThematics).orderBy(rgaaThematics.number);
}

/**
 * Récupère une thématique par son numéro
 */
export async function getThematicByNumber(number: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(rgaaThematics).where(eq(rgaaThematics.number, number)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Récupère tous les critères RGAA
 */
export async function getAllCriteria() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rgaaCriteria).orderBy(rgaaCriteria.reference);
}

/**
 * Récupère un critère par sa référence (ex: "1.1")
 */
export async function getCriterionByReference(reference: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(rgaaCriteria).where(eq(rgaaCriteria.reference, reference)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Récupère les critères d'une thématique
 */
export async function getCriteriaByThematic(thematicId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rgaaCriteria)
    .where(eq(rgaaCriteria.thematicId, thematicId))
    .orderBy(rgaaCriteria.reference);
}

/**
 * Crée un nouveau rapport d'audit
 */
export async function createAuditReport(data: {
  fileName: string;
  fileKey: string;
  fileUrl?: string;
  userId: number;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(auditReports).values({
    fileName: data.fileName,
    fileKey: data.fileKey,
    fileUrl: data.fileUrl,
    userId: data.userId,
    status: "pending",
  });

  return result;
}

/**
 * Récupère un rapport d'audit par son ID
 */
export async function getAuditReportById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(auditReports).where(eq(auditReports.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Récupère tous les rapports d'audit d'un utilisateur
 */
export async function getUserAuditReports(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(auditReports)
    .where(eq(auditReports.userId, userId))
    .orderBy(auditReports.createdAt);
}

/**
 * Met à jour le statut d'un rapport d'audit
 */
export async function updateAuditReportStatus(
  reportId: number,
  status: "pending" | "processing" | "completed" | "failed",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) return;

  const updateData: any = { status };
  if (errorMessage) {
    updateData.errorMessage = errorMessage;
  }

  await db.update(auditReports)
    .set(updateData)
    .where(eq(auditReports.id, reportId));
}

/**
 * Met à jour le nombre de constats d'un rapport
 */
export async function updateAuditReportFindingsCount(
  reportId: number,
  count: number
) {
  const db = await getDb();
  if (!db) return;

  await db.update(auditReports)
    .set({ findingsCount: count })
    .where(eq(auditReports.id, reportId));
}

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
 * Met à jour l'URL du site et les pages auditées d'un rapport
 */
export async function updateAuditReportSiteData(
  reportId: number,
  siteUrl: string,
  auditedPages: { name: string; url: string }[]
) {
  const db = await getDb();
  if (!db) return;

  await db.update(auditReports)
    .set({
      siteUrl,
      auditedPages: JSON.stringify(auditedPages),
    })
    .where(eq(auditReports.id, reportId));
}

/**
 * Récupère les constats enrichis avec les données du rapport et du critère
 * Effectue un JOIN entre findings, audit_reports et rgaa_criteria
 */
export async function getEnrichedFindings(filters: {
  reportId?: number; // Kept for backward compatibility if needed, but we'll use reportIds mainly
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
    // Filter by page names using LIKE for partial matches
    // We combine conditions with OR so if any page matches, the finding is returned
    const pageConditions = filters.pageNames.map(pageName => 
      // MySQL LIKE is case-insensitive by default with most collations
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

/**
 * Supprime un rapport d'audit et ses constats associés
 */
export async function deleteAuditReport(reportId: number) {
  const db = await getDb();
  if (!db) return;

  // Supprimer d'abord les constats associés
  await db.delete(findings).where(eq(findings.reportId, reportId));
  
  // Supprimer le rapport
  await db.delete(auditReports).where(eq(auditReports.id, reportId));
}
