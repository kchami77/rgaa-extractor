/**
 * Ingestion Pipeline — Alimentation de ChromaDB
 *
 * Deux modes :
 *   1. indexReportFindings(reportId) — appelé en fire-and-forget post-import
 *   2. bootstrapFromExistingFindings() — migration one-shot des données v1.0
 *
 * Ces fonctions sont NON-BLOQUANTES pour l'import DOCX.
 * Une erreur ChromaDB ne remet JAMAIS en cause l'intégrité MySQL.
 */

import { getDb } from "../repositories/connection";
import { findings, findingTemplates, rgaaCriteria } from "../../drizzle/schema";
import { eq, isNotNull } from "drizzle-orm";
import { ragEngine } from "./ragEngine";
import { isChromaAvailable } from "./chromaClient";
import { generateFindingSignature } from "../utils/deduplication";
import type { ChromaCollectionName } from "./chromaClient";
import { upsertFindingTemplateFromFinding } from "../db";

export interface IngestionResult {
  success: boolean;
  indexed: number;
  skipped: number;
  errors: string[];
}

// ─── Indexation d'un rapport spécifique ──────────────────────────────────────

/**
 * Indexe tous les constats d'un rapport dans la collection rgaa_findings.
 * Appelé automatiquement après un import réussi (fire-and-forget dans audit.ts).
 */
async function indexReportFindings(reportId: number): Promise<IngestionResult> {
  const available = await isChromaAvailable();
  if (!available) {
    return { success: false, indexed: 0, skipped: 0, errors: ["ChromaDB indisponible"] };
  }

  const db = await getDb();
  if (!db) {
    return { success: false, indexed: 0, skipped: 0, errors: ["Connexion MySQL indisponible"] };
  }

  const result: IngestionResult = { success: true, indexed: 0, skipped: 0, errors: [] };

  try {
    const rows = await db
      .select({
        id: findings.id,
        finding: findings.finding,
        solution: findings.solution,
        impact: findings.impact,
        criterionId: findings.criterionId,
        criterionReference: rgaaCriteria.reference,
        thematicId: findings.thematicId,
        templateId: findings.templateId,
      })
      .from(findings)
      .innerJoin(rgaaCriteria, eq(findings.criterionId, rgaaCriteria.id))
      .where(eq(findings.reportId, reportId));

    if (rows.length === 0) {
      return result;
    }

    const documents = rows.map(row => {
      const text = [
        row.finding,
        row.solution ? `Solution : ${row.solution}` : "",
      ].filter(Boolean).join("\n");

      const signatureHash = generateFindingSignature(row.finding, row.criterionId);

      return {
        id: `finding-${signatureHash}`,
        text,
        collection: "rgaa_findings" as ChromaCollectionName,
        metadata: {
          criterionReference: row.criterionReference ?? "",
          impact: row.impact,
          reportId: reportId,
          thematicId: row.thematicId ?? 0,
          templateId: row.templateId ?? 0,
          confidenceLevel: 80,
          type: "finding",
        },
      };
    });

    await ragEngine.indexDocumentBatch(documents);
    result.indexed = documents.length;

    console.log(`[Hub] Rapport ${reportId} : ${result.indexed} constats indexés dans ChromaDB`);
  } catch (e) {
    const msg = (e as Error).message;
    result.errors.push(msg);
    result.success = false;
    console.error(`[Hub] Erreur indexation rapport ${reportId}:`, msg);
  }

  return result;
}

// ─── Bootstrap des données v1.0 ───────────────────────────────────────────────

/**
 * Migration one-shot : indexe tous les templates existants dans ChromaDB.
 * À appeler une seule fois depuis un script ou via un outil MCP admin.
 */
async function bootstrapFromExistingFindings(): Promise<IngestionResult> {
  const available = await isChromaAvailable();
  if (!available) {
    return { success: false, indexed: 0, skipped: 0, errors: ["ChromaDB indisponible"] };
  }

  const db = await getDb();
  if (!db) {
    return { success: false, indexed: 0, skipped: 0, errors: ["Connexion MySQL indisponible"] };
  }

  const result: IngestionResult = { success: true, indexed: 0, skipped: 0, errors: [] };

  try {
    const templates = await db
      .select({
        id: findingTemplates.id,
        finding: findingTemplates.finding,
        solution: findingTemplates.solution,
        impact: findingTemplates.impact,
        criterionId: findingTemplates.criterionId,
        thematicId: findingTemplates.thematicId,
        occurrenceCount: findingTemplates.occurrenceCount,
        confidenceLevel: findingTemplates.confidenceLevel,
        signatureHash: findingTemplates.signatureHash,
        status: findingTemplates.status,
        criterionReference: rgaaCriteria.reference,
      })
      .from(findingTemplates)
      .innerJoin(rgaaCriteria, eq(findingTemplates.criterionId, rgaaCriteria.id))
      .where(isNotNull(findingTemplates.signatureHash));

    console.log(`[Hub] Bootstrap : ${templates.length} templates à indexer`);

    const documents = templates.map(t => {
      const text = [
        t.finding,
        t.solution ? `Solution : ${t.solution}` : "",
      ].filter(Boolean).join("\n");

      const collection: ChromaCollectionName = "rgaa_findings";

      return {
        id: `template-${t.signatureHash}`,
        text,
        collection,
        metadata: {
          criterionReference: t.criterionReference ?? "",
          impact: t.impact,
          occurrenceCount: t.occurrenceCount ?? 1,
          confidenceLevel: t.confidenceLevel ?? 50,
          status: t.status,
          type: "template",
        },
      };
    });

    const BATCH_SIZE = 50;
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      await ragEngine.indexDocumentBatch(batch);
      result.indexed += batch.length;
      console.log(`[Hub] Bootstrap : ${result.indexed}/${documents.length} templates indexés`);
    }

    console.log(`[Hub] Bootstrap terminé : ${result.indexed} templates indexés`);
  } catch (e) {
    const msg = (e as Error).message;
    result.errors.push(msg);
    result.success = false;
    console.error("[Hub] Erreur bootstrap:", msg);
  }

  return result;
}

// ─── Indexation d'un constat validé (via validate_finding MCP) ───────────────

async function indexValidatedFinding(params: {
  finding: string;
  solution?: string;
  criterionReference: string;
  impact: "Bloquant" | "Majeur" | "Mineur";
  source?: string;
}): Promise<void> {
  // Guard cohérent avec indexReportFindings et bootstrapFromExistingFindings
  const available = await isChromaAvailable();
  if (!available) {
    console.warn("[Hub] indexValidatedFinding : ChromaDB indisponible — constat non indexé");
    return;
  }

  const text = [params.finding, params.solution ? `Solution : ${params.solution}` : ""]
    .filter(Boolean).join("\n");

  // S5-1 FIX : ID stable basé sur le hash du contenu pour éviter les doublons
  // generateFindingSignature attend un criterionId numérique — on utilise 0 pour les validations MCP
  const signatureHash = generateFindingSignature(params.finding, 0);
  const id = `validated-${signatureHash}`;

  // S5-2 FIX : Persister en MySQL AUSSI pour survivre à un reset ChromaDB
  // findingTemplates sert de source de vérité pour le futur bootstrap
  try {
    const db = await getDb();
    if (db) {
      // On cherche le criterionId depuis la référence
      const criteriaRows = await db
        .select({ id: rgaaCriteria.id, thematicId: rgaaCriteria.thematicId })
        .from(rgaaCriteria)
        .where(eq(rgaaCriteria.reference, params.criterionReference))
        .limit(1);

      if (criteriaRows.length > 0) {
        const criterion = criteriaRows[0];
        const stableHash = generateFindingSignature(params.finding, criterion.id);
        await upsertFindingTemplateFromFinding({
          criterionId: criterion.id,
          thematicId: criterion.thematicId,
          impact: params.impact,
          contentType: null,
          finding: params.finding,
          solution: params.solution ?? null,
          signatureHash: stableHash,
        });
        console.log(`[Hub] Constat validé persisté en MySQL (critère ${params.criterionReference})`);
      }
    }
  } catch (e) {
    // Ne pas bloquer l'indexation ChromaDB si MySQL échoue
    console.warn("[Hub] Persistance MySQL du constat validé échouée:", (e as Error).message);
  }

  await ragEngine.indexDocument({
    id,
    text,
    collection: "rgaa_findings",
    metadata: {
      criterionReference: params.criterionReference,
      impact: params.impact,
      confidenceLevel: 100,
      source: params.source ?? "manual-validation",
      type: "validated",
    },
  });
}

export const ingestionPipeline = {
  indexReportFindings,
  bootstrapFromExistingFindings,
  indexValidatedFinding,
};
