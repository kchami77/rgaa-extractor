import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createAuditReport,
  getAuditReportById,
  getUserAuditReports,
  getReportFindings,
  getFilteredFindings,
  getEnrichedFindings,
  getAllCriteria,
  updateAuditReportStatus,
  updateAuditReportFindingsCount,
  updateAuditReportSiteData,
  deleteAuditReport,
  checkDuplicateReport,
  upsertFindingTemplateFromFinding,
  createFindingsBatch,
} from "../db";
import { generateFindingSignature } from "../utils/deduplication";
import { storagePut, storageGet, storageDelete } from "../storage";
import { parseAuditReportBuffer } from "../parser";

export const auditRouter = router({
  // Uploader un fichier d'audit
  uploadReport: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.union([
          z.instanceof(Buffer),
          z.instanceof(Uint8Array),
        ]).transform((data) => {
          if (data instanceof Uint8Array && !(data instanceof Buffer)) {
            return Buffer.from(data);
          }
          return data;
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const fileKey = `audit-reports/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, input.fileData, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        const report = await createAuditReport({
          fileName: input.fileName,
          fileKey,
          fileUrl: url,
          userId: ctx.user.id,
        });
        return report;
      } catch (error) {
        console.error("[Audit] Error uploading report:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to upload report" });
      }
    }),

  // Vérifier si un rapport existe déjà
  checkReportExists: protectedProcedure
    .input(z.object({ fileName: z.string() }))
    .query(async ({ input, ctx }) => {
      return await checkDuplicateReport(ctx.user.id, input.fileName);
    }),

  // Récupérer les rapports d'un utilisateur
  getUserReports: protectedProcedure.query(async ({ ctx }) => {
    return await getUserAuditReports(ctx.user.id);
  }),

  // Récupérer un rapport spécifique
  getReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .query(async ({ input }) => {
      return await getAuditReportById(input.reportId);
    }),

  // Récupérer les constats d'un rapport
  getReportFindings: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .query(async ({ input }) => {
      return await getReportFindings(input.reportId);
    }),

  // Filtrer les constats
  getFilteredFindings: protectedProcedure
    .input(
      z.object({
        thematicNumber: z.number().optional(),
        criterionReference: z.string().optional(),
        impact: z.enum(["Bloquant", "Majeur", "Mineur"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await getFilteredFindings(input);
    }),

  // Récupérer les constats enrichis
  getEnrichedFindings: protectedProcedure
    .input(
      z.object({
        reportId: z.number().optional(),
        reportIds: z.array(z.number()).optional(),
        pageNames: z.array(z.string()).optional(),
        thematicNumber: z.number().optional(),
        criterionReference: z.string().optional(),
        impact: z.enum(["Bloquant", "Majeur", "Mineur"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await getEnrichedFindings(input);
    }),

  // Traiter un rapport d'audit (parser et extraire les constats)
  processReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const report = await getAuditReportById(input.reportId);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });
        }
        if (report.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to process this report" });
        }

        await updateAuditReportStatus(input.reportId, "processing");

        const storageResult = await storageGet(report.fileKey);
        if (!storageResult || !storageResult.url) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve file from storage" });
        }

        let fileBuffer: Buffer;
        if (storageResult.url.startsWith("file://")) {
          const fs = await import("fs");
          const filePath = storageResult.url.replace("file://", "");
          fileBuffer = fs.readFileSync(filePath);
        } else {
          const response = await fetch(storageResult.url);
          if (!response.ok) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to download file from storage" });
          }
          fileBuffer = Buffer.from(await response.arrayBuffer());
        }

        const parseResult = await parseAuditReportBuffer(fileBuffer);

        for (const diag of parseResult.diagnostics) {
          if (diag.level === "error") console.error(`[Parser] ${diag.message}`);
          else if (diag.level === "warn") console.warn(`[Parser] ${diag.message}`);
          else console.log(`[Parser] ${diag.message}`);
        }

        if (parseResult.siteUrl || parseResult.auditedPages.length > 0) {
          await updateAuditReportSiteData(input.reportId, parseResult.siteUrl, parseResult.auditedPages);
        }

        const allCriteria = await getAllCriteria();
        const criteriaMap = new Map(allCriteria.map(c => [c.reference, c]));

        const findingsToInsert = [];
        for (const rawFinding of parseResult.findings) {
          const criterion = criteriaMap.get(rawFinding.criterionReference);
          if (!criterion) continue;

          const signatureHash = generateFindingSignature(rawFinding.finding, criterion.id);
          const templateId = await upsertFindingTemplateFromFinding({
            criterionId: criterion.id,
            thematicId: criterion.thematicId,
            impact: rawFinding.impact,
            contentType: rawFinding.contentType || null,
            finding: rawFinding.finding,
            solution: rawFinding.solution || null,
            signatureHash,
          });

          findingsToInsert.push({
            reportId: input.reportId,
            criterionId: criterion.id,
            thematicId: criterion.thematicId,
            subThematic: rawFinding.subThematic,
            impact: rawFinding.impact,
            location: rawFinding.location,
            contentType: rawFinding.contentType,
            userProblem: rawFinding.userProblem,
            finding: rawFinding.finding,
            solution: rawFinding.solution,
            thematicNumber: rawFinding.thematicNumber,
            criterionReference: rawFinding.criterionReference,
            templateId,
          });
        }

        const findingsCount = await createFindingsBatch(findingsToInsert);

        await updateAuditReportStatus(input.reportId, "completed");
        await updateAuditReportFindingsCount(input.reportId, findingsCount);

        // Hook post-import : indexation ChromaDB en tâche de fond (non bloquant)
        // Le Hub enrichit de façon asynchrone — une erreur ChromaDB ne fait JAMAIS échouer l'import
        setImmediate(async () => {
          try {
            const { ingestionPipeline } = await import("../hub/ingestionPipeline");
            await ingestionPipeline.indexReportFindings(input.reportId);
          } catch (e) {
            console.error("[Hub] Indexation ChromaDB non bloquante:", (e as Error).message);
          }
        });

        return { success: true, findingsCount };
      } catch (error) {
        console.error("[Audit] Error processing report:", error);
        const errorMessage = error instanceof Error ? error.message : "Processing failed";
        await updateAuditReportStatus(input.reportId, "failed", errorMessage);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: errorMessage });
      }
    }),

  // Supprimer un rapport
  deleteReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const report = await getAuditReportById(input.reportId);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });
        }
        if (report.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to delete this report" });
        }
        await storageDelete(report.fileKey);
        await deleteAuditReport(input.reportId);
        return { success: true };
      } catch (error) {
        console.error("[Audit] Error deleting report:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete report" });
      }
    }),
});
