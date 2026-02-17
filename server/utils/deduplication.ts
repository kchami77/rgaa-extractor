import { createHash } from "crypto";

/**
 * Normalise le texte d'un constat pour la déduplication :
 * - Passage en minuscules
 * - Retrait de la ponctuation et des caractères spéciaux
 * - Retrait des espaces multiples
 * - Nettoyage des balises HTML éventuelles
 */
export function normalizeFindingText(text: string): string {
  if (!text) return "";
  
  return text
    .toLowerCase()
    // Supprimer les balises HTML
    .replace(/<[^>]*>?/gm, "")
    // Remplacer la ponctuation et caractères spéciaux par des espaces
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    // Normaliser les accents (é -> e)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Garder uniquement les lettres et chiffres
    .replace(/[^a-z0-9\s]/g, "")
    // Remplacer les espaces multiples par un seul espace
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Génère une signature unique (SHA-256) pour un constat.
 * La signature est basée sur le texte normalisé et l'ID du critère.
 */
export function generateFindingSignature(text: string, criterionId: number): string {
  const normalized = normalizeFindingText(text);
  const data = `${criterionId}|${normalized}`;
  
  return createHash("sha256").update(data).digest("hex");
}

/**
 * Vérifie si deux textes sont sémantiquement proches (Score 0-1)
 * Adapté pour de petits ajustements de texte.
 * (Utilise la distance de Levenshtein simplifiée)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeFindingText(str1);
  const s2 = normalizeFindingText(str2);
  
  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  const track = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - distance / maxLen;
}
