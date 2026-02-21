/**
 * Point d'entrée backwards-compatible.
 * Le code est maintenant organisé dans server/routers/*.ts
 * Ce fichier re-exporte tout pour ne pas casser les imports existants.
 */
export { appRouter } from "./routers/index";
export type { AppRouter } from "./routers/index";
