import { eq, and, or, like } from "drizzle-orm";
import { findingTemplates } from "../../drizzle/schema";
import { getDb } from "./connection";
import { getCriterionByReference } from "./referentialRepository";

/**
 * Recherche des modèles de constats (finding templates)
 */
export async function searchFindingTemplates(filters: {
  q?: string;
  criterionId?: number;
  impact?: "Bloquant" | "Majeur" | "Mineur";
  status?: "draft" | "approved" | "deprecated";
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.criterionId) {
    conditions.push(eq(findingTemplates.criterionId, filters.criterionId));
  }
  if (filters.impact) {
    conditions.push(eq(findingTemplates.impact, filters.impact));
  }
  if (filters.status) {
    conditions.push(eq(findingTemplates.status, filters.status));
  }
  if (filters.q) {
    conditions.push(
      or(
        like(findingTemplates.finding, `%${filters.q}%`),
        like(findingTemplates.solution, `%${filters.q}%`)
      )
    );
  }

  const query = db.select().from(findingTemplates);
  
  if (conditions.length > 0) {
    // @ts-ignore - complex drizzle conditions can sometimes trigger TS errors in development
    return await query.where(and(...conditions)).orderBy(findingTemplates.occurrenceCount);
  }
  return await query.orderBy(findingTemplates.occurrenceCount);
}

/**
 * Récupère les modèles de constats par référence de critère (ex: "1.1")
 */
export async function getFindingTemplatesByCriterion(criterionReference: string) {
  const db = await getDb();
  if (!db) return [];

  const criterion = await getCriterionByReference(criterionReference);
  if (!criterion) return [];

  return await db.select()
    .from(findingTemplates)
    .where(eq(findingTemplates.criterionId, criterion.id))
    .orderBy(findingTemplates.occurrenceCount);
}
