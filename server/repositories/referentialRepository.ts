import { eq } from "drizzle-orm";
import { rgaaThematics, rgaaCriteria } from "../../drizzle/schema";
import { RGAA_THEMATICS, RGAA_CRITERIA } from "../rgaa-data";
import { getDb } from "./connection";

/**
 * Initialise le référentiel RGAA 4.1 dans la base de données
 */
export async function initializeRgaaReferential() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot initialize RGAA referential: database not available");
    return;
  }

  try {
    // Insérer les thématiques
    for (const thematic of RGAA_THEMATICS) {
      await db.insert(rgaaThematics).values({
        number: thematic.number,
        name: thematic.name,
        description: thematic.description,
      }).onDuplicateKeyUpdate({
        set: {
          name: thematic.name,
          description: thematic.description,
        },
      });
    }

    // Insérer les critères
    for (const criterion of RGAA_CRITERIA) {
      await db.insert(rgaaCriteria).values({
        reference: criterion.reference,
        label: criterion.label,
        thematicId: criterion.thematicNumber,
        description: criterion.description,
      }).onDuplicateKeyUpdate({
        set: {
          label: criterion.label,
          thematicId: criterion.thematicNumber,
          description: criterion.description,
        },
      });
    }

    console.log("[Database] RGAA referential initialized successfully");
  } catch (error) {
    console.error("[Database] Failed to initialize RGAA referential:", error);
    throw error;
  }
}

/**
 * Récupère toutes les thématiques RGAA
 */
export async function getAllThematics() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rgaaThematics).orderBy(rgaaThematics.number);
}

/**
 * Récupère une thématique par son numéro
 */
export async function getThematicByNumber(number: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(rgaaThematics).where(eq(rgaaThematics.number, number)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Récupère tous les critères RGAA
 */
export async function getAllCriteria() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rgaaCriteria).orderBy(rgaaCriteria.reference);
}

/**
 * Récupère un critère par sa référence (ex: "1.1")
 */
export async function getCriterionByReference(reference: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(rgaaCriteria).where(eq(rgaaCriteria.reference, reference)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Récupère les critères d'une thématique
 */
export async function getCriteriaByThematic(thematicId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rgaaCriteria)
    .where(eq(rgaaCriteria.thematicId, thematicId))
    .orderBy(rgaaCriteria.reference);
}
