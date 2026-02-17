/**
 * Service d'IA pour le nettoyage et la généralisation des constats.
 * Logic de rédaction déportée/suspendue.
 */

export interface CleaningResult {
  original: string;
  cleaned: string;
  changes: string[];
}

export class GeneralizationPipeline {
  /**
   * Pipeline principal de transformation pour la bibliothèque
   */
  async generalize(text: string): Promise<CleaningResult> {
    let current = text;
    const changes: string[] = [];

    const anonymized = this.ruleAnonymize(current);
    if (anonymized !== current) {
      changes.push("Retrait des noms spécifiques");
      current = anonymized;
    }

    const aligned = this.ruleAlignTone(current);
    if (aligned !== current) {
      changes.push("Alignement professionnel");
      current = aligned;
    }

    return {
      original: text,
      cleaned: current,
      changes
    };
  }

  private ruleAnonymize(text: string): string {
    return text.replace(/«\s*[^»]+\s*»/gi, "").replace(/\s+/g, " ").trim();
  }

  private ruleAlignTone(text: string): string {
    if (!text) return text;
    let result = text.trim();
    result = result.charAt(0).toUpperCase() + result.slice(1);
    if (!result.endsWith(".") && !result.endsWith("!") && !result.endsWith("?")) {
      result += ".";
    }
    return result;
  }
}

export const aiService = new GeneralizationPipeline();
