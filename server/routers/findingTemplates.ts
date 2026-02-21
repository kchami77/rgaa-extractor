import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  searchFindingTemplates,
  getFindingTemplatesByCriterion,
  updateFindingTemplate,
  syncTemplatesFromFindings,
  bulkGeneralizeTemplates,
  resetTemplateToOriginal,
  searchCriteria,
  searchSimilarFindings,
} from "../db";
import { aiService } from "../services/aiService";

export const findingTemplatesRouter = router({
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

  syncTemplates: protectedProcedure.mutation(async () => {
    return await syncTemplatesFromFindings();
  }),

  bulkGeneralize: protectedProcedure.mutation(async () => {
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
      const initialCriteria = await searchCriteria(input.draft);
      if (initialCriteria.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Aucun critère correspondant trouvé pour ces mots-clés." });
      }

      const top3 = initialCriteria.slice(0, 3);

      const criteriaWithHistory = await Promise.all(top3.map(async (c) => {
        const similarFindings = await searchSimilarFindings(input.draft, (c as any).reference);
        const historyScore = similarFindings.length * 15;
        const combinedScore = (c as any).matchScore + historyScore;
        return { ...c, similarFindings, combinedScore };
      }));

      criteriaWithHistory.sort((a, b) => b.combinedScore - a.combinedScore);

      const bestMatch = criteriaWithHistory[0];
      const otherMatches = criteriaWithHistory.slice(1, 4);

      let confidence = 0.5;
      if (criteriaWithHistory.length > 1) {
        const s1 = criteriaWithHistory[0].combinedScore || 1;
        const s2 = criteriaWithHistory[1].combinedScore || 0;
        confidence = Math.min(0.95, (s1 / (s1 + s2)) * 0.9 + 0.1);
      } else {
        confidence = 0.8;
      }

      const refined = input.draft;
      const sourceUsed = "Action suspendue (Design Only)";

      return {
        suggestedFinding: refined,
        criterion: bestMatch,
        otherCriteria: otherMatches,
        confidence,
        templateUsed: sourceUsed,
      };
    }),
});
