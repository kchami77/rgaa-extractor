import { eq, and } from "drizzle-orm";
import { auditReports, findings } from "../../drizzle/schema";
import { getDb } from "./connection";

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

/**
 * Vérifie si un rapport avec le même nom de fichier existe déjà pour cet utilisateur
 */
export async function checkDuplicateReport(userId: number, fileName: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select()
    .from(auditReports)
    .where(and(eq(auditReports.userId, userId), eq(auditReports.fileName, fileName)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
