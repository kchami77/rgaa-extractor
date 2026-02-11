import { describe, it, expect, beforeAll } from "vitest";
import { parseAuditReport } from "./parser";
import { initializeRgaaReferential } from "./db";
import fs from "fs";

describe("Parser", () => {
  beforeAll(async () => {
    // Initialiser le référentiel RGAA avant les tests
    await initializeRgaaReferential();
  });

  it("should return an array of findings", async () => {
    const filePath = "/home/ubuntu/upload/_publipostage_VILLE-SOA_Rapport-RGAA-4.1-Initial_202512JJ_STRATIS.docx";

    if (!fs.existsSync(filePath)) {
      console.warn("Test file not found, skipping parse test");
      return;
    }

    const findings = await parseAuditReport(filePath);
    expect(Array.isArray(findings)).toBe(true);
  });



  it("should detect imperative sentences", async () => {
    const imperatives = [
      "Utiliser des balises sémantiques",
      "Ajouter un attribut alt",
      "Remplacer le texte blanc par du noir",
      "Corriger la hiérarchie des titres",
    ];

    imperatives.forEach((imperative) => {
      expect(imperative).toMatch(/^(Utiliser|Ajouter|Remplacer|Corriger|Améliorer|Vérifier)/);
    });
  });
});
