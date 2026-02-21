/**
 * RGAA Knowledge Hub — Router composition
 *
 * Architecture modulaire : chaque domaine métier a son propre fichier.
 * Règle de dépendances : repositories/ ← hub/ ← routers/ ← mcp.ts
 *
 * Routers disponibles :
 *   - audit          : upload, process, delete rapports
 *   - criteria       : référentiel RGAA (thématiques, critères)
 *   - findingTemplates : bibliothèque de constats
 *   - hub            : RAG engine (ask, analyze, suggest, validate)
 *   - settings       : configuration persistée du Hub
 */

import { router } from "../_core/trpc";
import { publicProcedure } from "../_core/trpc";
import { getSessionCookieOptions } from "../_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "../_core/systemRouter";
import { auditRouter } from "./audit";
import { criteriaRouter } from "./criteria";
import { findingTemplatesRouter } from "./findingTemplates";
// Ces deux routers seront activés en Phase 3 & 7
// import { hubRouter } from "./hub";
// import { settingsRouter } from "./settings";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  audit: auditRouter,
  criteria: criteriaRouter,
  findingTemplates: findingTemplatesRouter,
  // hub: hubRouter,       // Phase 3 — RAG Engine tools
  // settings: settingsRouter, // Phase 7 — Options UI
});

export type AppRouter = typeof appRouter;
