/**
 * Settings Router — tRPC
 * Gère la configuration persistée du Hub.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { settingsService } from "../hub/settingsService";
import { seedDefaultSettings } from "../repositories/settingsRepository";

export const settingsRouter = router({
  /** Retourne tous les paramètres (pour la page Options). */
  getAll: protectedProcedure.query(async () => {
    return settingsService.getAll();
  }),

  /** Met à jour un paramètre spécifique. */
  update: protectedProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      await settingsService.set(input.key, input.value);
      return { success: true };
    }),

  /** Réinitialise tous les paramètres aux valeurs d'usine. */
  resetToDefaults: protectedProcedure.mutation(async () => {
    await seedDefaultSettings(); // Récrée les manquants
    await settingsService.reload(); // Invalide le cache
    return { success: true };
  }),
});
