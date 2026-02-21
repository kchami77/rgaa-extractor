import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAllThematics,
  getAllCriteria,
  getCriterionByReference,
  getThematicByNumber,
  getCriteriaByThematic,
} from "../db";

export const criteriaRouter = router({
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
});
