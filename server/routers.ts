import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import {
  createAuditReport,
  getUserAuditReports,
  getAuditReportById,
  getReportFindings,
  getFilteredFindings,
  getEnrichedFindings,
  getAllThematics,
  getAllCriteria,
  getCriterionByReference,
  getThematicByNumber,
  getCriteriaByThematic,
  initializeRgaaReferential,
  createFindingsBatch,

  updateAuditReportStatus,
  updateAuditReportFindingsCount,
  updateAuditReportSiteData,
  deleteAuditReport,
  checkDuplicateReport,

  searchFindingTemplates,
  getFindingTemplatesByCriterion,
  getFindingTemplateBySignature,
  upsertFindingTemplateFromFinding,
  updateFindingTemplate,
  syncTemplatesFromFindings,
  bulkGeneralizeTemplates,
  resetTemplateToOriginal,
  searchCriteria,
  searchSimilarFindings,
} from "./db";
import { aiService } from "./services/aiService";
import { generateFindingSignature } from "./utils/deduplication";
import { storagePut, storageGet, storageDelete } from "./storage";
import { parseAuditReportBuffer } from "./parser";
import { systemRouter } from "./_core/systemRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  audit: router({
    // Uploader un fichier d'audit
    uploadReport: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.union([
            z.instanceof(Buffer),
            z.instanceof(Uint8Array),
          ]).transform((data) => {
            // Convertir Uint8Array en Buffer si nécessaire
            if (data instanceof Uint8Array && !(data instanceof Buffer)) {
              return Buffer.from(data);
            }
            return data;
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Stocker le fichier en S3
          const fileKey = `audit-reports/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, input.fileData, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

          // Créer l'entrée du rapport en base de données
          const report = await createAuditReport({
            fileName: input.fileName,
            fileKey,
            fileUrl: url,
            userId: ctx.user.id,
          });

          return report;
        } catch (error) {
          console.error("[Audit] Error uploading report:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload report",
          });
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
    getFilteredFindings: publicProcedure
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

    // Récupérer les constats enrichis (avec données rapport + critère)
    getEnrichedFindings: publicProcedure
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
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Report not found",
            });
          }

          // Vérifier que l'utilisateur est propriétaire du rapport
          if (report.userId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to process this report",
            });
          }

          // Mettre à jour le statut en "processing"
          await updateAuditReportStatus(input.reportId, "processing");

          // Récupérer l'URL de téléchargement du fichier depuis le stockage
          const storageResult = await storageGet(report.fileKey);
          if (!storageResult || !storageResult.url) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to retrieve file from storage",
            });
          }

          // Lire le contenu du fichier (local ou distant)
          let fileBuffer: Buffer;
          if (storageResult.url.startsWith("file://")) {
            // Stockage local : lire le fichier depuis le disque
            const fs = await import("fs");
            const filePath = storageResult.url.replace("file://", "");
            fileBuffer = fs.readFileSync(filePath);
          } else {
            // Stockage distant (S3) : télécharger via HTTP
            const response = await fetch(storageResult.url);
            if (!response.ok) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to download file from storage",
              });
            }
            fileBuffer = Buffer.from(await response.arrayBuffer());
          }

          // Parser le document Word
          const parseResult = await parseAuditReportBuffer(fileBuffer);

          // Afficher les diagnostics du parser dans les logs serveur
          for (const diag of parseResult.diagnostics) {
            if (diag.level === "error") console.error(`[Parser] ${diag.message}`);
            else if (diag.level === "warn") console.warn(`[Parser] ${diag.message}`);
            else console.log(`[Parser] ${diag.message}`);
          }

          // Sauvegarder les données du site (URL + pages auditées)
          if (parseResult.siteUrl || parseResult.auditedPages.length > 0) {
            await updateAuditReportSiteData(
              input.reportId,
              parseResult.siteUrl,
              parseResult.auditedPages
            );
          }

          // Charger tous les critères en une seule requête (élimine le N+1)
          const allCriteria = await getAllCriteria();
          const criteriaMap = new Map(allCriteria.map(c => [c.reference, c]));

          // Préparer les constats à insérer avec déduplication intelligente
          const findingsToInsert = [];
          for (const rawFinding of parseResult.findings) {
            const criterion = criteriaMap.get(rawFinding.criterionReference);
            if (!criterion) continue;

            // 1. Générer la signature unique
            const signatureHash = generateFindingSignature(rawFinding.finding, criterion.id);

            // 2. Chercher ou créer/incrémenter le modèle (Template)
            const templateId = await upsertFindingTemplateFromFinding({
              criterionId: criterion.id,
              thematicId: criterion.thematicId,
              impact: rawFinding.impact,
              contentType: rawFinding.contentType || null,
              finding: rawFinding.finding,
              solution: rawFinding.solution || null,
              signatureHash
            });

            // 3. Préparer le constat à insérer (lié au template)
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
              templateId
            });
          }

          // Insérer en une seule transaction (rollback automatique si erreur)
          const findingsCount = await createFindingsBatch(findingsToInsert);

          // Mettre à jour le statut en "completed" et le nombre de constats
          await updateAuditReportStatus(input.reportId, "completed");
          await updateAuditReportFindingsCount(input.reportId, findingsCount);

          return {
            success: true,
            findingsCount,
          };
        } catch (error) {
          console.error("[Audit] Error processing report:", error);
          const errorMessage = error instanceof Error ? error.message : "Processing failed";
          await updateAuditReportStatus(input.reportId, "failed", errorMessage);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: errorMessage,
          });
        }
      }),

    // Supprimer un rapport
    deleteReport: protectedProcedure
      .input(z.object({ reportId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const report = await getAuditReportById(input.reportId);
          if (!report) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Report not found",
            });
          }

          // Vérifier que l'utilisateur est propriétaire du rapport
          if (report.userId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to delete this report",
            });
          }

          // Supprimer le fichier du stockage
          await storageDelete(report.fileKey);

          // Supprimer le rapport et ses constats de la base de données
          await deleteAuditReport(input.reportId);

          return { success: true };
        } catch (error) {
          console.error("[Audit] Error deleting report:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete report",
          });
        }
      }),
  }),

  criteria: router({
    list: publicProcedure.query(async () => {
      return await getAllCriteria();
    }),
    getByReference: publicProcedure
      .input(z.object({ reference: z.string() }))
      .query(async ({ input }) => {
        return await getCriterionByReference(input.reference);
      }),
    listThematics: publicProcedure.query(async () => {
      return await getAllThematics();
    }),
    getThematic: publicProcedure
      .input(z.object({ number: z.number() }))
      .query(async ({ input }) => {
        return await getThematicByNumber(input.number);
      }),
    getByThematic: publicProcedure
      .input(z.object({ thematicId: z.number() }))
      .query(async ({ input }) => {
        return await getCriteriaByThematic(input.thematicId);
      }),
  }),

  findingTemplates: router({
    search: publicProcedure
      .input(
        z.object({
          q: z.string().optional(),
          criterionId: z.number().optional(),
          impact: z.enum(["Bloquant", "Majeur", "Mineur"]).optional(),
          status: z.enum(["draft", "approved", "deprecated"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return await searchFindingTemplates(input);
      }),
    getByCriterion: publicProcedure
      .input(z.object({ criterionReference: z.string() }))
      .query(async ({ input }) => {
        return await getFindingTemplatesByCriterion(input.criterionReference);
      }),
    updateTemplate: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          finding: z.string().optional(),
          solution: z.string().nullable().optional(),
          impact: z.enum(["Bloquant", "Majeur", "Mineur"]).optional(),
          status: z.enum(["draft", "approved", "deprecated"]).optional(),
          contentType: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateFindingTemplate(id, data);
      }),
    generalizeTemplate: protectedProcedure
      .input(z.object({ id: z.number(), finding: z.string() }))
      .mutation(async ({ input }) => {
        const result = await aiService.generalize(input.finding);
        return result;
      }),
    syncTemplates: protectedProcedure
      .mutation(async () => {
        return await syncTemplatesFromFindings();
      }),

    bulkGeneralize: protectedProcedure
      .mutation(async () => {
        return await bulkGeneralizeTemplates(aiService);
      }),

    resetTemplate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await resetTemplateToOriginal(input.id);
      }),
    
    generateFromDraft: protectedProcedure
      .input(z.object({ draft: z.string() }))
      .mutation(async ({ input }) => {
        // 1. Identifier les critères probables (Referentiel Ranking v1.3)
        const initialCriteria = await searchCriteria(input.draft);
        if (initialCriteria.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Aucun critère correspondant trouvé pour ces mots-clés.",
          });
        }

        const top3 = initialCriteria.slice(0, 3);
        
        // 2. Recherche Croisée dans l'historique (Knowledge-Base) pour affiner le ranking
        const criteriaWithHistory = await Promise.all(top3.map(async (c) => {
          const similarFindings = await searchSimilarFindings(input.draft, (c as any).reference);
          
          const historyScore = similarFindings.length * 15; 
          const combinedScore = (c as any).matchScore + historyScore;
          
          return {
            ...c,
            similarFindings,
            combinedScore
          };
        }));

        // Ré-ordonnancement basé sur le score combiné (Ref + Histoire)
        criteriaWithHistory.sort((a, b) => b.combinedScore - a.combinedScore);

        const bestMatch = criteriaWithHistory[0];
        const otherMatches = criteriaWithHistory.slice(1, 4);
        
        // Calcul de confiance basé sur l'écart de score combiné
        let confidence = 0.5;
        if (criteriaWithHistory.length > 1) {
          const s1 = criteriaWithHistory[0].combinedScore || 1;
          const s2 = criteriaWithHistory[1].combinedScore || 0;
          confidence = Math.min(0.95, (s1 / (s1 + s2)) * 0.9 + 0.1);
        } else {
          confidence = 0.8;
        }

        // 3. Synthèse Contextuelle (Knowledge-Base Driven)
        // On utilise les constats réels trouvés comme base de synthèse
        // 3. Synthèse (Suspendue - Design Only)
        const refined = input.draft;
        const sourceUsed = "Action suspendue (Design Only)";

        return {
          suggestedFinding: refined,
          criterion: bestMatch,
          otherCriteria: otherMatches,
          confidence,
          templateUsed: sourceUsed
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
