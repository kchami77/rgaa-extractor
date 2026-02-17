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

/**
 * Recherche des critères par mots-clés avec ranking sémantique
 */
export async function searchCriteria(query: string) {
  const db = await getDb();
  if (!db || !query) return [];

  const { like, or } = await import("drizzle-orm");
  
  // Stop words français courants à ignorer pour le matching technique
  const stopWords = new Set(["pas", "sont", "est", "des", "pour", "aux", "dans", "une", "les", "sur", "avec", "tout", "tous", "chaque", "de", "le", "la", "les", "du", "au"]);
  const words = query.toLowerCase()
    .split(/[\s,',.!?;]+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2 && !stopWords.has(w));
  
  if (words.length === 0) return [];

  // Recherche large
  const conditions = words.flatMap(word => [
    like(rgaaCriteria.label, `%${word}%`),
    like(rgaaCriteria.description, `%${word}%`)
  ]);
  
  const results = await db.select().from(rgaaCriteria)
    .where(or(...conditions))
    .limit(30);

  // Mots techniques à fort poids (sujets de l'audit)
  const techSubjects = new Set(["bouton", "lien", "image", "logo", "formulaire", "champ", "vidéo", "iframe", "tableau", "liste", "menu", "titre", "focus", "clavier", "souris", "niveau", "structure", "hiérarchie", "ordre", "alt", "texte", "alternative", "contraste"]);
  // Mots "méta" de l'audit à faible poids
  const auditMetaWords = new Set(["pertinent", "visible", "accessible", "présent", "absent", "correct", "conforme", "chaque", "possède"]);

  const rankedResults = results.map(c => {
    let score = 0;
    const labelLower = c.label.toLowerCase();
    const descLower = (c.description || "").toLowerCase();
    const text = (labelLower + " " + descLower).toLowerCase();
    
    words.forEach(word => {
      if (text.includes(word)) {
        let weight = word.length > 5 ? 3 : 1;
        if (techSubjects.has(word)) weight += 10;
        if (auditMetaWords.has(word)) weight = 1;

        score += weight;
        if (labelLower.includes(word)) {
            score += techSubjects.has(word) ? 15 : 5;
        }
      }
    });

    return { ...c, matchScore: score };
  })
  .sort((a, b) => b.matchScore - a.matchScore);

  return rankedResults;
}
