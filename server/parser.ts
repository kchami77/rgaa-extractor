import mammoth from "mammoth";
import { getCriterionByReference, getThematicByNumber } from "./db";

/**
 * Structure d'un constat extrait du document
 */
export interface ExtractedFinding {
  thematicNumber: number;
  thematicName: string;
  subThematic?: string;
  criterionReference: string;
  criterionLabel: string;
  impact: "Bloquant" | "Majeur" | "Mineur";
  location?: string;
  contentType?: string;
  userProblem?: string;
  finding: string;
  solution?: string;
}

/**
 * Page auditée extraite de la section Contexte du document
 */
export interface AuditedPage {
  name: string;
  url: string;
}

/**
 * Résultat complet du parsing d'un rapport d'audit
 */
export interface ParseResult {
  findings: ExtractedFinding[];
  auditedPages: AuditedPage[];
  siteUrl: string;
}

/**
 * Extrait les constats, pages auditées et URL du site d'un buffer Word
 */
export async function parseAuditReportBuffer(fileBuffer: Buffer): Promise<ParseResult> {
  try {
    // Extraire le texte brut pour parser les constats (section 3)
    const rawResult = await mammoth.extractRawText({ buffer: fileBuffer });
    const text = rawResult.value;

    // Extraire le HTML pour récupérer les liens (section Contexte)
    const htmlResult = await mammoth.convertToHtml({ buffer: fileBuffer });
    const html = htmlResult.value;

    // Parser les constats depuis le texte brut
    const findings = parseTextContent(text);

    // Extraire les pages auditées depuis le HTML
    const auditedPages = extractAuditedPages(html);

    // Déduire l'URL du site depuis les pages auditées
    const siteUrl = extractSiteUrl(auditedPages);

    console.log(`[Parser] Résultat : ${findings.length} constats, ${auditedPages.length} pages auditées, site: ${siteUrl || "non trouvé"}`);

    return { findings, auditedPages, siteUrl };
  } catch (error) {
    console.error("[Parser] Error parsing document:", error);
    throw error;
  }
}

/**
 * Extrait les pages auditées depuis le HTML mammoth (section Contexte)
 * Recherche la liste <ul> qui suit "L'audit a porté sur un échantillon de pages"
 */
function extractAuditedPages(html: string): AuditedPage[] {
  const pages: AuditedPage[] = [];

  // Chercher la section Contexte dans le HTML (dernière occurrence, hors sommaire)
  const contexteIdx = html.lastIndexOf("Contexte</h1>");
  if (contexteIdx === -1) {
    // Essayer avec h2 ou h3
    const altIdx = html.lastIndexOf("Contexte</h2>") !== -1
      ? html.lastIndexOf("Contexte</h2>")
      : html.lastIndexOf("Contexte</h3>");
    if (altIdx === -1) {
      console.warn("[Parser] Section Contexte non trouvée dans le HTML");
      return pages;
    }
  }

  // Chercher "échantillon" qui précède la liste des pages
  const sampleIdx = html.indexOf("chantillon", contexteIdx !== -1 ? contexteIdx : 0);
  if (sampleIdx === -1) {
    console.warn("[Parser] Texte 'échantillon de pages' non trouvé");
    return pages;
  }

  // Trouver la première <ul> après "échantillon"
  const ulStart = html.indexOf("<ul>", sampleIdx);
  const ulEnd = html.indexOf("</ul>", ulStart);
  if (ulStart === -1 || ulEnd === -1) {
    console.warn("[Parser] Liste <ul> des pages auditées non trouvée");
    return pages;
  }

  const ulContent = html.substring(ulStart, ulEnd + 5);

  // Extraire chaque <li><a href="...">...</a></li>
  const linkRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  while ((match = linkRegex.exec(ulContent)) !== null) {
    const url = match[1];
    const name = match[2].trim();
    // Ignorer les liens internes (#...) et les liens vers le RGAA
    if (url.startsWith("http") && !url.includes("accessibilite.numerique.gouv.fr")) {
      pages.push({ name, url });
    }
  }

  return pages;
}

/**
 * Déduit l'URL de base du site depuis la liste des pages auditées
 */
function extractSiteUrl(pages: AuditedPage[]): string {
  if (pages.length === 0) return "";
  try {
    const firstUrl = new URL(pages[0].url);
    return firstUrl.origin;
  } catch {
    return "";
  }
}

/**
 * Parse le contenu texte du document pour extraire les constats (section 3)
 */
function parseTextContent(text: string): ExtractedFinding[] {
  const findings: ExtractedFinding[] = [];

  // Chercher la section "Descriptions des erreurs d'accessibilité"
  // IMPORTANT : utiliser lastIndexOf car la première occurrence est dans le sommaire
  const sectionPatterns = [
    "Descriptions des erreurs d'accessibilité",
    "Descriptions des erreurs d\u2019accessibilité",
    "Descriptions des erreurs d\u2018accessibilité",
    "Description des erreurs d'accessibilité",
    "Description des erreurs d\u2019accessibilité",
  ];

  let section3Start = -1;
  let matchedPattern = "";
  for (const pattern of sectionPatterns) {
    section3Start = text.lastIndexOf(pattern);
    if (section3Start !== -1) {
      matchedPattern = pattern;
      break;
    }
  }

  // Aussi chercher avec une regex pour plus de flexibilité
  if (section3Start === -1) {
    const regex = /[Dd]escription[s]?\s+des\s+erreurs\s+d['\u2019\u2018]accessibilit[ée]/gi;
    let match;
    let lastMatch = null;
    while ((match = regex.exec(text)) !== null) {
      lastMatch = match;
    }
    if (lastMatch && lastMatch.index !== undefined) {
      section3Start = lastMatch.index;
      matchedPattern = lastMatch[0];
    }
  }

  // Chercher la fin de la section
  const notesStart = text.indexOf("Notes techniques", section3Start + 1);

  if (section3Start === -1) {
    console.warn("[Parser] Section 3 not found in document");
    return findings;
  }

  console.log(`[Parser] Section 3 trouvée à la position ${section3Start}`);

  const section3End = notesStart !== -1 ? notesStart : text.length;
  const section3Text = text.substring(section3Start, section3End);

  // Diviser en lignes et nettoyer
  const lines = section3Text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Extraire les critères et leurs constats
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Chercher un critère RGAA (ex: "Critère 1.2. Chaque image de décoration...")
    const criterionMatch = line.match(/^Crit[eè]re\s+([\d.]+)[\.:\s\-–]+\s*(.+?)(\?|$)/i);
    if (criterionMatch) {
      const criterionReference = criterionMatch[1].replace(/\.$/, '');
      const criterionLabel = criterionMatch[2].trim();

      // Extraire les constats pour ce critère
      const blockResult = extractFindingsForCriterion(
        lines,
        i + 1,
        criterionReference,
        criterionLabel
      );

      if (blockResult) {
        findings.push(...blockResult.findings);
        i = blockResult.nextIndex;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }

  return findings;
}

/**
 * Extrait les constats pour un critère spécifique
 * Format typique du document :
 *   "Contenus impactés :"
 *   "Page d'accueil :"
 *   "Impact : MajeurDans le bloc mise en avant, l'image... Changer l'attribut role."
 *   "Rédactionnel - Impact : MajeurSupprimer l'alternative textuelle..."
 */
function extractFindingsForCriterion(
  lines: string[],
  startIndex: number,
  criterionReference: string,
  criterionLabel: string
): { findings: ExtractedFinding[]; nextIndex: number } | null {
  const findings: ExtractedFinding[] = [];
  let i = startIndex;

  const thematicNumber = parseInt(criterionReference.split(".")[0]);
  const thematicName = getThematicName(thematicNumber);

  let currentLocation = "";
  let userProblem = "";

  while (i < lines.length) {
    const line = lines[i];

    // Arrêt si on rencontre un nouveau critère
    if (line.match(/^Crit[eè]re\s+[\d.]+/i)) {
      break;
    }

    // Détection du "Problème utilisateur"
    if (line.startsWith("Problème utilisateur :") || line.startsWith("Problème utilisateur\u00a0:")) {
      userProblem = line.substring(line.indexOf(":") + 1).trim();
      i++;
      continue;
    }

    // Ignorer certains titres
    if (line === "Contenus impactés :" || line === "Contenus impactés:" || line.match(/^Recommandation\s*:/)) {
      i++;
      continue;
    }

    // Détection des lignes contenant "Impact :" — c'est un constat
    const impactRegex = /^(?:(.+?)\s*-\s*)?Impact\s*:\s*(Bloquant|Majeur|Mineur)(.*)/i;
    const impactMatch = line.match(impactRegex);

    if (impactMatch) {
      const contentType = impactMatch[1]?.trim() || "";
      const impact = impactMatch[2] as "Bloquant" | "Majeur" | "Mineur";
      const findingText = impactMatch[3]?.trim() || "";

      if (findingText) {
        findings.push({
          thematicNumber,
          thematicName,
          criterionReference,
          criterionLabel,
          impact,
          location: currentLocation || "Non spécifié",
          contentType: contentType || undefined,
          userProblem: userProblem || undefined,
          finding: findingText,
          solution: undefined,
        });
      }

      i++;
      continue;
    }

    // Détection de la localisation (ex: "Page d'accueil :", "Toutes les pages :")
    if (line.match(/^.+\s*:\s*$/) && !line.match(/^(Note|Attention|Recommandation)/i)) {
      currentLocation = line.replace(/\s*:\s*$/, "").trim();
      i++;
      continue;
    }

    i++;
  }

  return findings.length > 0 ? { findings, nextIndex: i } : null;
}

/**
 * Retourne le nom de la thématique en fonction de son numéro
 */
function getThematicName(number: number): string {
  const thematics: Record<number, string> = {
    1: "Images",
    2: "Cadres",
    3: "Couleurs",
    4: "Multimédia",
    5: "Tableaux",
    6: "Liens",
    7: "Scripts",
    8: "Éléments obligatoires",
    9: "Structuration de l'information",
    10: "Présentation de l'information",
    11: "Formulaires",
    12: "Navigation",
    13: "Consultation",
  };

  return thematics[number] || `Thématique ${number}`;
}
