import mammoth from "mammoth";

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
 * Diagnostic de parsing — signale ce qui a échoué ou semble anormal
 */
export interface ParserDiagnostic {
  level: "info" | "warn" | "error";
  message: string;
}

/**
 * Résultat complet du parsing d'un rapport d'audit
 */
export interface ParseResult {
  findings: ExtractedFinding[];
  auditedPages: AuditedPage[];
  siteUrl: string;
  diagnostics: ParserDiagnostic[];
}

/**
 * Extrait les constats, pages auditées et URL du site d'un buffer Word
 */
export async function parseAuditReportBuffer(fileBuffer: Buffer): Promise<ParseResult> {
  const diagnostics: ParserDiagnostic[] = [];

  try {
    // Extraire le texte brut pour parser les constats (section 3)
    const rawResult = await mammoth.extractRawText({ buffer: fileBuffer });
    const text = rawResult.value;

    // Extraire le HTML pour récupérer les liens (section Contexte)
    const htmlResult = await mammoth.convertToHtml({ buffer: fileBuffer });
    const html = htmlResult.value;

    // Signaler les avertissements de mammoth
    for (const msg of [...rawResult.messages, ...htmlResult.messages]) {
      if (msg.type === "warning" || msg.type === "error") {
        diagnostics.push({ level: "warn", message: `[Mammoth] ${msg.message}` });
      }
    }

    // Parser les constats depuis le texte brut
    const findings = parseTextContent(text, diagnostics);

    // Extraire les pages auditées depuis le HTML
    const auditedPages = extractAuditedPages(html, diagnostics);

    // Déduire l'URL du site depuis les pages auditées
    const siteUrl = extractSiteUrl(auditedPages);

    // Diagnostics de synthèse
    if (findings.length === 0) {
      diagnostics.push({
        level: "warn",
        message: "Aucun constat extrait du document. Vérifiez que le format du rapport suit le modèle RGAA 4.1 attendu (section \"Descriptions des erreurs d'accessibilité\" avec des lignes \"Impact : Bloquant/Majeur/Mineur\").",
      });
    }

    if (auditedPages.length === 0) {
      diagnostics.push({
        level: "warn",
        message: "Aucune page auditée trouvée dans la section Contexte.",
      });
    }

    diagnostics.push({
      level: "info",
      message: `Résultat : ${findings.length} constats, ${auditedPages.length} pages auditées, site: ${siteUrl || "non trouvé"}`,
    });

    console.log(`[Parser] ${diagnostics.filter(d => d.level === "warn").length} avertissements, ${findings.length} constats, ${auditedPages.length} pages`);

    return { findings, auditedPages, siteUrl, diagnostics };
  } catch (error) {
    console.error("[Parser] Error parsing document:", error);
    diagnostics.push({
      level: "error",
      message: `Erreur fatale de parsing : ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}

/**
 * Extrait les pages auditées depuis le HTML mammoth (section Contexte)
 * Recherche la liste <ul> qui suit "L'audit a porté sur un échantillon de pages"
 */
function extractAuditedPages(html: string, diagnostics: ParserDiagnostic[]): AuditedPage[] {
  const pages: AuditedPage[] = [];

  // Chercher la section Contexte avec regex pour tolérer "1 Contexte", "1. Contexte", etc.
  const contexteRegex = /Contexte<\/h[1-3]>/gi;
  let contexteIdx = -1;
  let match;
  while ((match = contexteRegex.exec(html)) !== null) {
    contexteIdx = match.index; // prend la dernière occurrence (hors sommaire)
  }

  if (contexteIdx === -1) {
    diagnostics.push({ level: "warn", message: "Section \"Contexte\" non trouvée dans le HTML (attendu : <h1>…Contexte</h1>)." });
    return pages;
  }

  // Chercher "échantillon" qui précède la liste des pages (tolérer accents et nbsp)
  const normalizedHtml = html.replace(/\u00a0/g, " ");
  const sampleIdx = normalizedHtml.indexOf("chantillon", contexteIdx);
  if (sampleIdx === -1) {
    diagnostics.push({ level: "warn", message: "Texte \"échantillon de pages\" non trouvé après la section Contexte." });
    return pages;
  }

  // Trouver la première <ul> après "échantillon"
  const ulStart = html.indexOf("<ul>", sampleIdx);
  const ulEnd = html.indexOf("</ul>", ulStart);
  if (ulStart === -1 || ulEnd === -1) {
    diagnostics.push({ level: "warn", message: "Liste <ul> des pages auditées non trouvée après \"échantillon\"." });
    return pages;
  }

  const ulContent = html.substring(ulStart, ulEnd + 5);

  // Extraire chaque <li><a href="...">...</a></li>
  const linkRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(ulContent)) !== null) {
    const url = linkMatch[1];
    const name = linkMatch[2].trim();
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
 * Normalise les espaces insécables et les apostrophes typographiques
 */
function normalize(text: string): string {
  return text
    .replace(/\u00a0/g, " ")   // nbsp → espace normal
    .replace(/[\u2019\u2018]/g, "'"); // apostrophes courbes → apostrophe droite
}

/**
 * Parse le contenu texte du document pour extraire les constats (section 3)
 */
function parseTextContent(text: string, diagnostics: ParserDiagnostic[]): ExtractedFinding[] {
  const findings: ExtractedFinding[] = [];

  const normalizedText = normalize(text);

  // Chercher la section "Descriptions des erreurs d'accessibilité"
  // IMPORTANT : utiliser lastIndexOf car la première occurrence est dans le sommaire
  const sectionPatterns = [
    "Descriptions des erreurs d'accessibilité",
    "Description des erreurs d'accessibilité",
  ];

  let section3Start = -1;
  for (const pattern of sectionPatterns) {
    section3Start = normalizedText.lastIndexOf(pattern);
    if (section3Start !== -1) break;
  }

  // Aussi chercher avec une regex pour plus de flexibilité
  if (section3Start === -1) {
    const regex = /[Dd]escription[s]?\s+des\s+erreurs\s+d['']accessibilit[ée]/gi;
    let regexMatch;
    let lastMatch = null;
    while ((regexMatch = regex.exec(normalizedText)) !== null) {
      lastMatch = regexMatch;
    }
    if (lastMatch && lastMatch.index !== undefined) {
      section3Start = lastMatch.index;
    }
  }

  if (section3Start === -1) {
    diagnostics.push({
      level: "error",
      message: "Section \"Descriptions des erreurs d'accessibilité\" introuvable dans le document. Le parsing des constats est impossible.",
    });
    return findings;
  }

  // Chercher la fin de la section
  const notesStart = normalizedText.indexOf("Notes techniques", section3Start + 1);
  const section3End = notesStart !== -1 ? notesStart : normalizedText.length;
  const section3Text = normalizedText.substring(section3Start, section3End);

  // Diviser en lignes et nettoyer
  const lines = section3Text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Compteurs de diagnostic
  let criteriaFound = 0;
  let findingsSkipped = 0;

  // Extraire les critères et leurs constats
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Chercher un critère RGAA (ex: "Critère 1.2. Chaque image de décoration...")
    const criterionMatch = line.match(/^Crit[eè]re\s+([\d.]+)[\.:\s\-–]+\s*(.+?)(\?|$)/i);
    if (criterionMatch) {
      criteriaFound++;
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
        findingsSkipped += blockResult.skipped;
        i = blockResult.nextIndex;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }

  // Diagnostics de détail
  if (criteriaFound === 0) {
    diagnostics.push({
      level: "warn",
      message: "Aucun critère RGAA trouvé (format attendu : \"Critère X.Y. ...\"). Le format du document est peut-être différent du modèle attendu.",
    });
  } else {
    diagnostics.push({
      level: "info",
      message: `${criteriaFound} critères RGAA analysés, ${findings.length} constats extraits.`,
    });
  }

  if (findingsSkipped > 0) {
    diagnostics.push({
      level: "warn",
      message: `${findingsSkipped} lignes \"Impact :\" sans texte de constat ont été ignorées.`,
    });
  }

  return findings;
}

/**
 * Extrait les constats pour un critère spécifique
 */
function extractFindingsForCriterion(
  lines: string[],
  startIndex: number,
  criterionReference: string,
  criterionLabel: string
): { findings: ExtractedFinding[]; nextIndex: number; skipped: number } | null {
  const findings: ExtractedFinding[] = [];
  let i = startIndex;
  let skipped = 0;

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
    if (line.startsWith("Problème utilisateur :") || line.startsWith("Problème utilisateur\u00a0:") || line.startsWith("Problème utilisateur :")) {
      userProblem = line.substring(line.indexOf(":") + 1).trim();
      i++;
      continue;
    }

    // Ignorer certains titres
    if (/^Contenus?\s+impact[ée]s?\s*:/i.test(line) || line.match(/^Recommandation\s*:/)) {
      i++;
      continue;
    }

    // Détection des lignes contenant "Impact :" — c'est un constat
    // Tolère : espaces, nbsp, casse variée
    const impactRegex = /^(?:(.+?)\s*[-–—]\s*)?Impact\s*[:：]\s*(Bloquant|Majeur|Mineur)(.*)/i;
    const impactMatch = line.match(impactRegex);

    if (impactMatch) {
      const contentType = impactMatch[1]?.trim() || "";
      const rawImpact = impactMatch[2];
      // Normaliser la casse du impact
      const impact = (rawImpact.charAt(0).toUpperCase() + rawImpact.slice(1).toLowerCase()) as "Bloquant" | "Majeur" | "Mineur";
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
      } else {
        skipped++;
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

  return findings.length > 0 ? { findings, nextIndex: i, skipped } : null;
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
