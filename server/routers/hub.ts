/**
 * Hub Router — tRPC
 * Expose les fonctionnalités RAG et le pilotage du Scraper.
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { ragEngine } from "../hub/ragEngine";
import { 
  getScrapeStatus, 
  scrapeAndIndex, 
  shouldReindex, 
  isScraping 
} from "../hub/knowledgeScraper";
import { ScraperSourceSchema } from "../hub/scrapers/types";

export const hubRouter = router({
  // ─── Recherche & Assistance (RAG) ──────────────────────────────────────────

  /** Pose une question libre sur l'accessibilité. */
  ask: publicProcedure
    .input(z.object({
      question: z.string().min(3),
      context: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return ragEngine.askAccessibility(input.question, input.context);
    }),

  /** Analyse un fragment de code HTML pour détecter des non-conformités. */
  analyze: publicProcedure
    .input(z.object({
      html: z.string().min(5),
      context: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return ragEngine.analyzeCode(input.html, input.context);
    }),

  /** Suggère une correction pour un problème identifié. */
  suggest: publicProcedure
    .input(z.object({
      problem: z.string().min(3),
      criterionRef: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return ragEngine.suggestFix(input.problem, input.criterionRef);
    }),

  // ─── Pilotage du Scraper ────────────────────────────────────────────────────

  /** Retourne le statut actuel du scraper (phase, progress, count). */
  getScrapeStatus: publicProcedure.query(() => {
    return getScrapeStatus();
  }),

  /** Indique si le Hub a besoin d'être (re)indexé. */
  shouldReindex: publicProcedure
    .input(z.object({ source: ScraperSourceSchema }))
    .query(async ({ input }) => {
      return shouldReindex(input.source);
    }),

  /** Lance manuellement le scraping et l'indexation. */
  triggerReindex: protectedProcedure
    .input(z.object({ source: ScraperSourceSchema }))
    .mutation(async ({ input }) => {
      if (isScraping()) {
        throw new Error("Un scraping est déjà en cours.");
      }
      
      // On lance en tâche de fond pour ne pas bloquer la requête HTTP,
      // l'UI polle via getScrapeStatus.
      setImmediate(() => {
        scrapeAndIndex(input.source).catch(err => {
          console.error("[Hub/Router] Erreur triggerReindex async:", err);
        });
      });

      return { success: true };
    }),
});
