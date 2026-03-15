/**
 * chunksScraper.ts
 * Lit les fichiers Markdown pré-générés dans rgaa_chunks/ et les indexe dans rgaa_referential.
 *
 * Avantages vs scraping web :
 *  - 0 dépendance réseau (lecture fs locale idempotente)
 *  - Contenu riche : question du critère + étapes de méthodologie complètes par test
 *  - ~600 documents vs ~120 avec l'ancien scraper HTML
 *  - Stable et versionnable (généré depuis les JSON officiels DISIC)
 *
 * Structure produite (par fichier critere_X.Y.md) :
 *  → 1 document "criterion"  : titre + cas particuliers + notes techniques
 *  → N documents "test"      : 1 par section "## Test X.Y.Z" avec méthodologie
 *
 * Chemin attendu : <project_root>/rgaa_chunks/rgaa_chunks/ (106 fichiers + index.json)
 */

import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs/promises";
import { makeScrapedDocumentId, type ScrapedDocument, type ScrapeResult } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin absolu vers le dossier des chunks (3 niveaux au-dessus de server/hub/scrapers/)
const CHUNKS_DIR = path.join(__dirname, "../../../rgaa_chunks/rgaa_chunks");
const INDEX_JSON = path.join(CHUNKS_DIR, "index.json");

// ─── Types internes ───────────────────────────────────────────────────────────

interface ChunkIndex {
  criteres: ChunkIndexEntry[];
}

interface ChunkIndexEntry {
  fichier: string;
  critere_id: string;
  critere_titre: string;
  thematique: string;
  thematique_id: number;
  nb_tests: number;
  url: string;
}

interface ParsedChunk {
  critereId: string;
  thematique: string;
  url: string;
  criterionText: string;
  tests: ParsedTest[];
}

interface ParsedTest {
  testId: string;
  url: string;
  content: string;
}

// ─── Parsing YAML front matter ────────────────────────────────────────────────

/**
 * Extrait les métadonnées du YAML front matter (entre les deux "---").
 * Parsing minimal ciblé sur les clés connues — pas de dépendance js-yaml.
 */
function parseFrontMatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const result: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    result[key] = value;
  }
  return result;
}

// ─── Parsing des sections de tests ────────────────────────────────────────────

/**
 * Extrait le texte du critère (avant le premier "---" après le front matter)
 * et toutes les sections "## Test X.Y.Z".
 */
function parseChunkFile(content: string, meta: ChunkIndexEntry): ParsedChunk {
  // Supprimer le front matter
  const bodyStart = content.indexOf("\n---\n", content.indexOf("---") + 3);
  const body = bodyStart !== -1 ? content.slice(bodyStart + 5) : content;

  // Extraire le texte d'en-tête du critère (avant la première section "## Test")
  const firstTestIdx = body.search(/^## Test \d+\.\d+\.\d+/m);
  const criterionHeader = (firstTestIdx > 0 ? body.slice(0, firstTestIdx) : body)
    .replace(/^#.*\n/m, "")           // Supprimer la ligne de titre h1
    .replace(/^_Source.*\n/m, "")     // Supprimer la ligne source
    .replace(/---\n/g, "")            // Supprimer les séparateurs
    .trim();

  // Assembler le texte du document critère
  const criterionText = [
    `Critère RGAA ${meta.critere_id} — ${meta.thematique}`,
    `${meta.critere_titre}`,
    criterionHeader,
  ].filter(s => s.trim()).join("\n\n");

  // Extraire les sections de tests (## Test X.Y.Z jusqu'au prochain ## Test ou fin)
  const testPattern = /^## (Test \d+\.\d+\.\d+)([\s\S]*?)(?=^## Test \d+|^## [^T]|$)/gm;
  const tests: ParsedTest[] = [];

  let match: RegExpExecArray | null;
  while ((match = testPattern.exec(body)) !== null) {
    const testLabel = match[1]; // "Test 1.1.1"
    const testId = testLabel.replace("Test ", ""); // "1.1.1"
    const rawContent = match[2].trim();

    // Nettoyer les liens de référence au bas de la section
    const cleanContent = rawContent
      .replace(/^_Réf :.*$/m, "")
      .replace(/^---\s*$/m, "")
      .trim();

    if (cleanContent.length > 20) {
      tests.push({
        testId,
        url: `https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#${testId}`,
        content: `${testLabel} — Critère ${meta.critere_id} [${meta.thematique}]\n\n${cleanContent}`,
      });
    }
  }

  return {
    critereId: meta.critere_id,
    thematique: meta.thematique,
    url: meta.url,
    criterionText,
    tests,
  };
}

// ─── Point d'entrée public ────────────────────────────────────────────────────

export async function scrapeFromChunks(): Promise<{
  documents: ScrapedDocument[];
  result: ScrapeResult;
}> {
  const startedAt = Date.now();
  const docs: ScrapedDocument[] = [];
  const errors: string[] = [];
  const scrapedAt = new Date().toISOString();

  // 1. Vérifier l'existence du dossier
  try {
    await fs.access(CHUNKS_DIR);
  } catch {
    return {
      documents: [],
      result: {
        source: "rgaa",
        success: false,
        count: 0,
        errors: [`Dossier rgaa_chunks introuvable : ${CHUNKS_DIR}`],
        durationMs: Date.now() - startedAt,
      },
    };
  }

  // 2. Lire l'index
  let index: ChunkIndex;
  try {
    const raw = await fs.readFile(INDEX_JSON, "utf-8");
    index = JSON.parse(raw) as ChunkIndex;
  } catch (e) {
    return {
      documents: [],
      result: {
        source: "rgaa",
        success: false,
        count: 0,
        errors: [`Impossible de lire index.json : ${(e as Error).message}`],
        durationMs: Date.now() - startedAt,
      },
    };
  }

  console.log(`[ChunksScraper] ${index.criteres.length} critères détectés dans l'index`);

  // 3. Traiter chaque fichier critère
  for (const entry of index.criteres) {
    const filePath = path.join(CHUNKS_DIR, entry.fichier);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = parseChunkFile(content, entry);

      // Document du critère (résumé + cas particuliers + notes)
      docs.push({
        id: makeScrapedDocumentId("rgaa", `chunks-crit-${parsed.critereId}`, parsed.criterionText),
        text: parsed.criterionText,
        collection: "rgaa_referential",
        metadata: {
          source: "rgaa",
          criterion: parsed.critereId,
          thematic: parsed.thematique,
          url: parsed.url,
          type: "criterion",
          lang: "fr",
          scrapedAt,
        },
      });

      // 1 document par test (avec méthodologie complète)
      for (const test of parsed.tests) {
        docs.push({
          id: makeScrapedDocumentId("rgaa", `chunks-test-${test.testId}`, test.content),
          text: test.content,
          collection: "rgaa_referential",
          metadata: {
            source: "rgaa",
            criterion: parsed.critereId,
            test: test.testId,
            thematic: parsed.thematique,
            url: test.url,
            type: "test",
            lang: "fr",
            scrapedAt,
          },
        });
      }
    } catch (e) {
      const msg = `${entry.fichier}: ${(e as Error).message}`;
      errors.push(msg);
      console.warn(`[ChunksScraper] Erreur lecture ${msg}`);
    }
  }

  const criterionCount = docs.filter(d => d.metadata.type === "criterion").length;
  const testCount = docs.filter(d => d.metadata.type === "test").length;

  console.log(
    `[ChunksScraper] ${criterionCount} critères + ${testCount} tests → ${docs.length} documents total`
  );

  return {
    documents: docs,
    result: {
      source: "rgaa",
      success: criterionCount >= 80,
      count: docs.length,
      errors,
      durationMs: Date.now() - startedAt,
    },
  };
}
