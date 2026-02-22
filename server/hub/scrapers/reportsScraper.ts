import { getDb } from "../../repositories/connection";
import { findings, rgaaCriteria, auditReports } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { makeScrapedDocumentId, type ScrapedDocument, type ScrapeResult } from "./types";

/**
 * Adaptateur pour indexer les rapports déjà présents en base de données.
 * Utile pour migrer l'historique d'audit vers le Hub sans ré-import.
 */
export async function scrapeReports(): Promise<{
  documents: ScrapedDocument[];
  result: ScrapeResult;
}> {
  const start = Date.now();
  const docs: ScrapedDocument[] = [];
  const errors: string[] = [];

  try {
    const db = await getDb();
    if (!db) throw new Error("Base de données MySQL indisponible");

    // Récupérer tous les constats avec leur référence de critère
    const rows = await db
      .select({
        id: findings.id,
        finding: findings.finding,
        solution: findings.solution,
        impact: findings.impact,
        criterionReference: rgaaCriteria.reference,
        reportTitle: auditReports.fileName,
        reportId: findings.reportId,
      })
      .from(findings)
      .innerJoin(rgaaCriteria, eq(findings.criterionId, rgaaCriteria.id))
      .innerJoin(auditReports, eq(findings.reportId, auditReports.id));

    const scrapedAt = new Date().toISOString();

    for (const row of rows) {
      const text = [
        row.finding,
        row.solution ? `Solution : ${row.solution}` : "",
      ].filter(Boolean).join("\n");

      // ID stable basé sur la source et le contenu
      const docId = makeScrapedDocumentId("reports", `finding-${row.id}`, text);

      docs.push({
        id: docId,
        text,
        collection: "rgaa_findings",
        metadata: {
          source: "reports",
          url: `/reports/${row.reportId}`, // Lien interne
          criterion: row.criterionReference ?? undefined,
          thematic: row.reportTitle ?? undefined, // On injecte le nom du rapport ici pour le RAG
          type: "notice",
          lang: "fr",
          scrapedAt,
        },
      });
    }

    return {
      documents: docs,
      result: {
        source: "reports",
        success: true,
        count: docs.length,
        errors,
        durationMs: Date.now() - start,
      },
    };
  } catch (e) {
    const msg = (e as Error).message;
    return {
      documents: [],
      result: {
        source: "reports",
        success: false,
        count: 0,
        errors: [msg],
        durationMs: Date.now() - start,
      },
    };
  }
}
