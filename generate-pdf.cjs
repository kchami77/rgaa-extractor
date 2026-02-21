const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const { marked } = await import('marked');

  console.log('🚀 Démarrage de la génération du PDF...');

  // ── 1. Lire et convertir le Markdown ──────────────────────────────
  const mdPath = path.join(__dirname, 'RAPPORT_TECHNIQUE_RGAA_EXTRACTOR.md');
  const markdown = fs.readFileSync(mdPath, 'utf-8');

  // Configurer marked pour ajouter des IDs aux titres (ancres)
  const renderer = new marked.Renderer();
  const headingIds = [];

  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const rawText = tokens.map(t => t.raw || t.text || '').join('');
    const id = rawText
      .toLowerCase()
      .replace(/[^\w\sàâäéèêëïîôùûüÿç-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    headingIds.push({ id, text, depth });

    // Saut de page avant chaque chapitre principal (h1 -> # N. Titre)
    const pageBreak = depth === 1 && headingIds.length > 2 ? 'page-break-before: always;' : '';

    return `<h${depth} id="${id}" style="${pageBreak}">${text}</h${depth}>`;
  };

  marked.setOptions({ renderer, gfm: true, breaks: false });

  // Séparer les blocs mermaid du reste du markdown
  // On les remplace par des placeholders dans le HTML
  let mermaidCounter = 0;
  const mermaidBlocks = [];
  const processedMd = markdown.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const idx = mermaidCounter++;
    mermaidBlocks.push(code.trim());
    return `<div class="mermaid-placeholder" data-idx="${idx}"></div>`;
  });

  const htmlContent = marked(processedMd);

  // Générer la Table des Matières
  const tocItems = headingIds
    .filter(h => h.depth >= 1 && h.depth <= 3)
    .map(h => {
      const indent = (h.depth - 1) * 20;
      const fontSize = h.depth === 1 ? '12pt' : h.depth === 2 ? '10.5pt' : '9.5pt';
      const weight = h.depth <= 2 ? '600' : '400';
      const color = h.depth === 1 ? '#1a365d' : '#2d3748';
      return `<div style="margin-left:${indent}px; padding: 4px 0; font-size:${fontSize}; font-weight:${weight}; color:${color}; display:flex; align-items:baseline;">
        <a href="#${h.id}" style="color:${color}; text-decoration:none; flex:1;">${h.text}</a>
        <span style="flex:0 0 auto; border-bottom: 1px dotted #cbd5e0; flex-grow:1; margin: 0 8px;"></span>
      </div>`;
    })
    .join('\n');

  // ── 2. Construire le HTML complet ──────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport Technique — RGAA Constat Extractor</title>
  <style>
    /* ─── Reset & Base ──────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4;
      margin: 22mm 18mm 25mm 18mm;
    }

    @page :first {
      margin: 0;
    }

    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.7;
      color: #1a202c;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ─── Page de couverture ─────────────────────────── */
    .cover-page {
      width: 210mm;
      height: 297mm;
      background: linear-gradient(160deg, #1a365d 0%, #2b6cb0 40%, #4299e1 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }

    .cover-page::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 80%;
      height: 150%;
      background: radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%);
    }

    .cover-page::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f6e05e, #ed8936, #e53e3e);
    }

    .cover-logo {
      font-size: 52pt;
      margin-bottom: 10px;
    }

    .cover-title {
      font-size: 30pt;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .cover-subtitle {
      font-size: 18pt;
      font-weight: 300;
      opacity: 0.92;
      margin-bottom: 40px;
    }

    .cover-divider {
      width: 80px;
      height: 3px;
      background: rgba(255,255,255,0.5);
      margin: 0 auto 40px;
      border-radius: 2px;
    }

    .cover-project {
      font-size: 15pt;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      opacity: 0.85;
      margin-bottom: 10px;
    }

    .cover-version {
      font-size: 11pt;
      opacity: 0.7;
      margin-bottom: 50px;
    }

    .cover-meta {
      font-size: 10pt;
      opacity: 0.65;
      line-height: 1.8;
    }

    /* ─── Table des matières ────────────────────────── */
    .toc-page {
      page-break-after: always;
      padding-top: 10px;
    }

    .toc-page h1 {
      font-size: 22pt;
      color: #1a365d;
      border-bottom: 3px solid #2b6cb0;
      padding-bottom: 10px;
      margin-bottom: 25px;
    }

    /* ─── Typographie ──────────────────────────────── */
    h1 {
      font-size: 22pt;
      font-weight: 700;
      color: #1a365d;
      border-bottom: 2.5px solid #2b6cb0;
      padding-bottom: 8px;
      margin-top: 15px;
      margin-bottom: 18px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 15pt;
      font-weight: 600;
      color: #2c5282;
      margin-top: 22px;
      margin-bottom: 12px;
      border-left: 4px solid #4299e1;
      padding-left: 12px;
    }

    h3 {
      font-size: 12.5pt;
      font-weight: 600;
      color: #2d3748;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    h4 {
      font-size: 11pt;
      font-weight: 600;
      color: #4a5568;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-bottom: 8px;
      text-align: justify;
      hyphens: auto;
    }

    strong { color: #1a202c; }

    /* ─── Code ─────────────────────────────────────── */
    code {
      background-color: #edf2f7;
      padding: 1.5px 5px;
      border-radius: 3px;
      font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
      font-size: 9pt;
      color: #9b2c2c;
      white-space: nowrap;
    }

    pre {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-left: 3px solid #4299e1;
      border-radius: 6px;
      padding: 14px 16px;
      margin: 12px 0 14px;
      overflow-x: auto;
      font-size: 8.5pt;
      line-height: 1.5;
    }

    pre code {
      background: transparent;
      padding: 0;
      color: #2d3748;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    /* ─── Tableaux ─────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    thead th {
      background: linear-gradient(180deg, #2b6cb0, #2c5282);
      color: white;
      padding: 9px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    thead th:first-child {
      border-radius: 6px 0 0 0;
    }

    thead th:last-child {
      border-radius: 0 6px 0 0;
    }

    tbody td {
      padding: 7px 12px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }

    tbody tr:nth-child(even) {
      background-color: #f7fafc;
    }

    tbody tr:hover {
      background-color: #ebf8ff;
    }

    tbody tr:last-child td:first-child {
      border-radius: 0 0 0 6px;
    }

    tbody tr:last-child td:last-child {
      border-radius: 0 0 6px 0;
    }

    /* ─── Citations / Blockquotes ──────────────────── */
    blockquote {
      border-left: 4px solid #4299e1;
      margin: 12px 0;
      padding: 10px 16px;
      background-color: #ebf8ff;
      color: #2c5282;
      border-radius: 0 6px 6px 0;
      font-size: 9.5pt;
    }

    blockquote strong {
      color: #2b6cb0;
    }

    /* ─── Listes ──────────────────────────────────── */
    ul, ol {
      margin: 8px 0 10px;
      padding-left: 22px;
    }

    li {
      margin: 4px 0;
    }

    /* ─── Liens ──────────────────────────────────── */
    a {
      color: #2b6cb0;
      text-decoration: none;
    }

    /* ─── Séparateurs ─────────────────────────────── */
    hr {
      border: none;
      border-top: 1.5px solid #e2e8f0;
      margin: 22px 0;
    }

    /* ─── Diagrammes Mermaid ───────────────────────── */
    .mermaid-container {
      margin: 16px 0;
      padding: 16px;
      background: #fefefe;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      text-align: center;
      page-break-inside: avoid;
    }

    .mermaid-container svg {
      max-width: 100%;
      height: auto;
    }

    .mermaid-label {
      font-size: 8pt;
      color: #a0aec0;
      text-align: center;
      margin-top: 6px;
      font-style: italic;
    }

    /* ─── Utilitaires d'impression ─────────────────── */
    h1, h2, h3, h4 {
      page-break-after: avoid;
    }

    table, pre, .mermaid-container {
      page-break-inside: avoid;
    }

    /* ─── En-tête et pied de page (via Playwright) ── */
  </style>
</head>
<body>

  <!-- ═══ PAGE DE COUVERTURE ═══ -->
  <div class="cover-page">
    <div class="cover-logo">📘</div>
    <div class="cover-title">Rapport Technique<br>&amp; Fonctionnel</div>
    <div class="cover-subtitle">Architecture, Modules et Approche Technique</div>
    <div class="cover-divider"></div>
    <div class="cover-project">RGAA Constat Extractor</div>
    <div class="cover-version">Version 1.0 — Février 2026</div>
    <div class="cover-meta">
      Accessibilité Numérique · Référentiel RGAA 4.1<br>
      Application Web Fullstack · React · tRPC · MySQL · MCP
    </div>
  </div>

  <!-- ═══ TABLE DES MATIÈRES ═══ -->
  <div class="toc-page">
    <h1>📑 Table des Matières</h1>
    ${tocItems}
  </div>

  <!-- ═══ CONTENU PRINCIPAL ═══ -->
  ${htmlContent}

</body>
</html>`;

  // ── 3. Lancer Playwright et rendre les Mermaid ─────────────────────
  console.log('🌐 Lancement du navigateur...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle' });

  // Injecter Mermaid.js depuis CDN et rendre les diagrammes
  if (mermaidBlocks.length > 0) {
    console.log(`🎨 Rendu de ${mermaidBlocks.length} diagrammes Mermaid...`);

    await page.addScriptTag({
      url: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    });

    await page.evaluate(async (blocks) => {
      // Initialiser mermaid
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#dbeafe',
          primaryTextColor: '#1e3a5f',
          primaryBorderColor: '#3b82f6',
          lineColor: '#64748b',
          secondaryColor: '#f0fdf4',
          tertiaryColor: '#fefce8',
          fontFamily: 'Segoe UI, Helvetica Neue, Arial, sans-serif',
          fontSize: '13px',
          noteBkgColor: '#fef3c7',
          noteBorderColor: '#f59e0b',
        },
        flowchart: { curve: 'basis', padding: 15 },
        sequence: { mirrorActors: false },
        er: { useMaxWidth: true },
      });

      // Remplacer chaque placeholder par le SVG rendu
      const placeholders = document.querySelectorAll('.mermaid-placeholder');
      for (const ph of placeholders) {
        const idx = parseInt(ph.getAttribute('data-idx'));
        const code = blocks[idx];
        try {
          const { svg } = await window.mermaid.render(`mermaid-${idx}`, code);
          const container = document.createElement('div');
          container.className = 'mermaid-container';
          container.innerHTML = svg;
          const label = document.createElement('div');
          label.className = 'mermaid-label';
          label.textContent = `Diagramme ${idx + 1}`;
          container.appendChild(label);
          ph.replaceWith(container);
        } catch (e) {
          // En cas d'erreur de rendu, afficher le code source
          const fallback = document.createElement('pre');
          fallback.style.cssText = 'background:#fef2f2; border-color:#fecaca; border-left-color:#ef4444; font-size:8pt;';
          fallback.innerHTML = `<code>⚠️ Diagramme non rendu\n\n${code}</code>`;
          ph.replaceWith(fallback);
          console.warn(`Mermaid render error for diagram ${idx}:`, e.message);
        }
      }
    }, mermaidBlocks);

    // Laisser le temps aux SVGs de se stabiliser
    await page.waitForTimeout(1500);
  }

  // ── 4. Générer le PDF ──────────────────────────────────────────────
  console.log('📄 Génération du PDF...');

  const pdfPath = path.join(__dirname, 'RAPPORT_TECHNIQUE_RGAA_EXTRACTOR.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width:100%; font-size:7.5pt; color:#94a3b8; padding: 0 18mm; display:flex; justify-content:space-between; font-family: Segoe UI, Arial, sans-serif;">
        <span>RGAA Constat Extractor v1.0</span>
        <span>Rapport Technique &amp; Fonctionnel</span>
      </div>
    `,
    footerTemplate: `
      <div style="width:100%; font-size:7.5pt; color:#94a3b8; padding: 0 18mm; display:flex; justify-content:space-between; font-family: Segoe UI, Arial, sans-serif;">
        <span>Février 2026 — Confidentiel</span>
        <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '22mm',
      right: '18mm',
      bottom: '22mm',
      left: '18mm',
    },
  });

  await browser.close();

  // Infos sur le PDF généré
  const stats = fs.statSync(pdfPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log('');
  console.log('┌────────────────────────────────────────────────┐');
  console.log('│  ✅  PDF généré avec succès !                  │');
  console.log('├────────────────────────────────────────────────┤');
  console.log(`│  📁 ${path.basename(pdfPath).padEnd(42)}│`);
  console.log(`│  📐 ${(sizeMB + ' MB').padEnd(42)}│`);
  console.log(`│  🎨 ${mermaidBlocks.length} diagrammes Mermaid rendus${' '.repeat(20)}│`);
  console.log('└────────────────────────────────────────────────┘');
}

generatePDF().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
