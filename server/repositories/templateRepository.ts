import { eq, and, or, like, isNull } from "drizzle-orm";
import { findingTemplates, findings } from "../../drizzle/schema";
import { getDb } from "./connection";
import { getCriterionByReference } from "./referentialRepository";
import { generateFindingSignature } from "../utils/deduplication";

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

/**
 * Récupère un modèle par sa signature unique
 */
export async function getFindingTemplateBySignature(signatureHash: string) {
  const db = await getDb();
  if (!db) return null;

  const results = await db.select()
    .from(findingTemplates)
    .where(eq(findingTemplates.signatureHash, signatureHash));
  
  return results[0] || null;
}

/**
 * Crée ou met à jour un modèle de constat (incrémente le compteur si existe)
 */
export async function upsertFindingTemplateFromFinding(data: {
  criterionId: number;
  thematicId: number;
  impact: "Bloquant" | "Majeur" | "Mineur";
  contentType: string | null;
  finding: string;
  solution: string | null;
  signatureHash: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getFindingTemplateBySignature(data.signatureHash);

  if (existing) {
    // Si approuvé, on ne touche pas au texte, on incrémente juste
    await db.update(findingTemplates)
      .set({ 
        occurrenceCount: (existing.occurrenceCount || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(findingTemplates.id, existing.id));
    return existing.id;
  }

  // Sinon, on crée un nouveau template en mode 'draft'
  const result = await db.insert(findingTemplates).values({
    ...data,
    originalFinding: data.finding, // Sauvegarde la première version
    status: "draft",
    occurrenceCount: 1,
  });

  return (result[0] as any).insertId as number;
}

/**
 * Met à jour manuellement un modèle de constat (par un auditeur)
 */
export async function updateFindingTemplate(id: number, data: {
  finding?: string;
  solution?: string | null;
  impact?: "Bloquant" | "Majeur" | "Mineur";
  status?: "draft" | "approved" | "deprecated";
  contentType?: string | null;
}) {
  const db = await getDb();
  if (!db) return null;

  await db.update(findingTemplates)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(findingTemplates.id, id));

  return id;
}

/**
 * Synchronise tous les constats existants vers la bibliothèque de modèles.
 * Utile pour peupler la bibliothèque à partir de rapports importés précédemment.
 */
export async function syncTemplatesFromFindings() {
  const db = await getDb();
  if (!db) return { count: 0 };

  // Récupérer les constats qui n'ont pas encore de templateId
  const findingsToSync = await db.select()
    .from(findings)
    .where(isNull(findings.templateId));

  let syncedCount = 0;

  for (const f of findingsToSync) {
    const signatureHash = generateFindingSignature(f.finding, f.criterionId);

    const templateId = await upsertFindingTemplateFromFinding({
      criterionId: f.criterionId,
      thematicId: f.thematicId,
      impact: f.impact,
      contentType: f.contentType,
      finding: f.finding,
      solution: f.solution,
      signatureHash
    });

    if (templateId) {
      await db.update(findings)
        .set({ templateId })
        .where(eq(findings.id, f.id));
      syncedCount++;
    }
  }

  return { count: syncedCount };
}

/**
 * Nettoie tous les modèles en mode 'draft' via l'IA.
 * Sauvegarde la version d'origine si ce n'est pas déjà fait.
 */
export async function bulkGeneralizeTemplates(aiService: any) {
  const db = await getDb();
  if (!db) return { processed: 0, updated: 0 };

  const drafts = await db.select()
    .from(findingTemplates)
    .where(eq(findingTemplates.status, "draft"));

  let updatedCount = 0;

  for (const t of drafts) {
    // Si on n'a pas encore de backup de l'original, on le crée
    if (!t.originalFinding) {
      await db.update(findingTemplates)
        .set({ originalFinding: t.finding })
        .where(eq(findingTemplates.id, t.id));
    }

    // Appel au service d'IA (Pipeline de généralisation)
    const result = await aiService.generalize(t.finding);
    
    if (result.cleaned !== t.finding) {
      await db.update(findingTemplates)
        .set({ 
          finding: result.cleaned,
          updatedAt: new Date()
        })
        .where(eq(findingTemplates.id, t.id));
      updatedCount++;
    }
  }

  return { processed: drafts.length, updated: updatedCount };
}

/**
 * Restaure la phrase d'origine d'un modèle.
 */
export async function resetTemplateToOriginal(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [template] = await db.select()
    .from(findingTemplates)
    .where(eq(findingTemplates.id, id));

  if (!template || !template.originalFinding) return null;

  await db.update(findingTemplates)
    .set({ 
      finding: template.originalFinding,
      status: "draft",
      updatedAt: new Date()
    })
    .where(eq(findingTemplates.id, id));

  return id;
}
