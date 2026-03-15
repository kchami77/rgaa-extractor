const fs = require('fs');
const OUT = 'C:/Users/user/.gemini/antigravity/brain/3b474862-673a-402a-a373-39c1ef12dceb/rapport_2.html';

const css = `
:root{--bg:#0d1117;--s1:#161b22;--s2:#21262d;--bd:#30363d;--p1:#58c4dc;--p2:#7c3aed;--t:#e6edf3;--m:#8b949e;--g:#3fb950}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--t);line-height:1.7}
#prog{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--p1),var(--p2));z-index:999;transition:width .1s}
#sb{position:fixed;top:0;left:0;width:252px;height:100vh;background:var(--s1);border-right:1px solid var(--bd);overflow-y:auto;z-index:100;padding-bottom:2rem}
#sb::-webkit-scrollbar{width:3px}#sb::-webkit-scrollbar-thumb{background:var(--bd)}
.sbh{padding:1rem 1.1rem;border-bottom:1px solid var(--bd);background:var(--s1);position:sticky;top:0}
.sbh h2{font-size:.78rem;color:var(--p1);font-weight:700}.sbh p{font-size:.65rem;color:var(--m);margin-top:.15rem}
.nst{padding:.5rem 1.1rem .1rem;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;color:var(--m);font-weight:600}
.na{display:block;padding:.33rem 1.1rem;font-size:.73rem;color:var(--m);text-decoration:none;cursor:pointer;border-left:2px solid transparent;transition:.15s}
.na:hover,.na.on{color:var(--p1);border-left-color:var(--p1);background:rgba(88,196,220,.05)}
.ns{padding-left:1.7rem;font-size:.68rem}
#main{margin-left:252px;padding:2rem 2.8rem;max-width:1000px}
.hero{background:linear-gradient(135deg,#0d1117,#0f1b2d 50%,#1a0a2e);border:1px solid var(--bd);border-radius:12px;padding:1.8rem 2.2rem;margin-bottom:2rem;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;top:-50px;right:-50px;width:200px;height:200px;background:radial-gradient(circle,rgba(124,58,237,.2),transparent 70%);pointer-events:none}
.badge{display:inline-block;padding:.18rem .65rem;background:rgba(88,196,220,.1);color:var(--p1);border:1px solid rgba(88,196,220,.25);border-radius:999px;font-size:.66rem;font-weight:600;margin-bottom:.7rem}
.hero h1{font-size:1.65rem;font-weight:800;background:linear-gradient(90deg,#fff,var(--p1));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--m);font-size:.82rem;margin-top:.3rem}
.parts{display:flex;gap:.8rem;margin:0 0 1.8rem;flex-wrap:wrap}
.pb{flex:1;min-width:130px;padding:.65rem .9rem;border-radius:9px;border:1px solid var(--bd);background:var(--s1);color:var(--m);cursor:pointer;font-size:.78rem;text-align:left;transition:.2s}
.pb.p1{border-color:rgba(88,196,220,.4);color:var(--p1)}.pb.p2{border-color:rgba(124,58,237,.4);color:#a78bfa}
.pb strong{display:block;font-size:.85rem;margin-bottom:.12rem}
.pl{display:inline-block;padding:.12rem .45rem;border-radius:4px;font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.45rem}
.l1{background:rgba(88,196,220,.15);color:var(--p1)}.l2{background:rgba(124,58,237,.2);color:#a78bfa}
h2{font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:.9rem;display:flex;align-items:center;gap:.45rem}
h2 .n{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;flex-shrink:0}
.n1{background:linear-gradient(135deg,var(--p1),#0ea5e9)}.n2{background:linear-gradient(135deg,var(--p2),#a78bfa)}
h3{font-size:.92rem;font-weight:600;color:var(--p1);margin:1.1rem 0 .55rem;padding-left:.55rem;border-left:2px solid var(--p1)}
.hc{color:#a78bfa;border-left-color:#a78bfa}h4{font-size:.83rem;font-weight:600;color:var(--t);margin:.8rem 0 .33rem}
p{color:var(--m);margin-bottom:.65rem;font-size:.85rem}strong{color:var(--t)}
hr{border:none;border-top:1px solid var(--bd);margin:1.8rem 0}
.sec{scroll-margin-top:1.2rem;margin-bottom:2.8rem}
.al{padding:.8rem .95rem;border-radius:8px;margin:.8rem 0;font-size:.8rem;border-left:3px solid}
.ai{background:rgba(59,130,246,.08);border-color:#3b82f6;color:#93c5fd}
.as{background:rgba(63,185,80,.08);border-color:var(--g);color:#6ee7b7}
.ak{color:#c4b5fd;background:rgba(124,58,237,.1);border-color:var(--p2)}
.aico{font-size:.62rem;text-transform:uppercase;font-weight:700;opacity:.8;display:block;margin-bottom:.2rem}
.tw{overflow-x:auto;border-radius:8px;border:1px solid var(--bd);margin:.75rem 0}
table{width:100%;border-collapse:collapse;font-size:.78rem}
th{padding:.55rem .85rem;text-align:left;background:var(--s2);color:var(--p1);font-size:.67rem;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
td{padding:.5rem .85rem;color:var(--m);border-top:1px solid var(--bd)}tr:hover td{background:rgba(255,255,255,.015)}
td code{background:rgba(88,196,220,.1);color:var(--p1);padding:.08rem .28rem;border-radius:3px;font-family:monospace;font-size:.8em}
pre{background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:.9rem 1.1rem;overflow-x:auto;margin:.75rem 0;font-size:.76rem;color:#c4b5fd;font-family:monospace;line-height:1.6}
code{background:rgba(88,196,220,.1);color:var(--p1);padding:.08rem .28rem;border-radius:3px;font-family:monospace;font-size:.84em}pre code{background:none;padding:0;color:inherit}
.mw{background:var(--s2);border:1px solid var(--bd);border-radius:10px;padding:1.1rem;margin:.85rem 0;overflow-x:auto;text-align:center}
.ml{font-size:.65rem;color:var(--m);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.55rem;font-weight:600}
ul,ol{margin:.35rem 0 .65rem 1.15rem;color:var(--m);font-size:.83rem}li{margin-bottom:.22rem}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin:.9rem 0}
.card{background:var(--s1);border:1px solid var(--bd);border-radius:9px;padding:.95rem 1.05rem;transition:.2s}
.card:hover{border-color:var(--p1);transform:translateY(-2px)}
.ci{font-size:1.2rem;margin-bottom:.3rem}.cn{font-weight:600;font-size:.83rem;color:var(--t)}
.cd{font-size:.74rem;color:var(--m);margin-top:.18rem}.cf{font-size:.66rem;color:var(--m);margin-top:.38rem;font-family:monospace}
.steps{margin:.65rem 0}.step{display:flex;gap:.7rem;margin-bottom:.72rem;align-items:flex-start}
.sn{width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,var(--p1),#0ea5e9);color:#0d1117;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;flex-shrink:0;margin-top:.12rem}
.sn2{background:linear-gradient(135deg,var(--p2),#a78bfa);color:#fff}
.sc .st{font-weight:600;font-size:.83rem;color:var(--t)}.sc p{margin-bottom:0;font-size:.78rem}
.chips{display:flex;flex-wrap:wrap;gap:.38rem;margin:.45rem 0}
.chip{padding:.18rem .6rem;border-radius:999px;font-size:.68rem;border:1px solid var(--bd);color:var(--m)}
.c1{background:rgba(88,196,220,.08);border-color:rgba(88,196,220,.3);color:var(--p1)}
.c2{background:rgba(124,58,237,.08);border-color:rgba(124,58,237,.3);color:#a78bfa}
.gl{display:grid;gap:.45rem}
.gi{background:var(--s1);border:1px solid var(--bd);border-radius:7px;padding:.7rem .9rem;display:grid;grid-template-columns:170px 1fr 1fr;gap:.45rem;align-items:start}
.gt{font-weight:600;color:var(--p1);font-size:.76rem}.gd,.ga{font-size:.76rem;color:var(--m)}.ga{font-style:italic;color:#6ee7b7}
.phases{display:grid;gap:.85rem}
.ph{background:var(--s1);border:1px solid var(--bd);border-radius:9px;padding:1rem 1.15rem;border-left:3px solid}
.ph1{border-left-color:var(--p1)}.ph2{border-left-color:var(--p2)}.ph3{border-left-color:#ec4899}
.ph .pt{font-weight:700;font-size:.85rem;color:var(--t);margin-bottom:.38rem}.ph li{font-size:.78rem;color:var(--m);margin-left:.9rem;margin-bottom:.18rem}
#btt{position:fixed;bottom:1.5rem;right:1.5rem;width:36px;height:36px;border-radius:50%;background:var(--p2);border:none;color:#fff;cursor:pointer;font-size:.95rem;z-index:200;opacity:0;transition:.3s;box-shadow:0 4px 12px rgba(124,58,237,.5)}
#btt.show{opacity:1}
@media(max-width:840px){#sb{display:none}#main{margin-left:0;padding:1.2rem}}
`;

const nav = `
<nav id="sb">
<div class="sbh"><h2>📘 Rapport 2</h2><p>RGAA Constat Extractor v1.0</p></div>
<div class="nst">🚀 Partie 1 — Vue d'ensemble</div>
<a class="na" onclick="go('p11')">P1.1 — Le Pitch</a>
<a class="na" onclick="go('p12')">P1.2 — Carte du Projet</a>
<a class="na" onclick="go('p13')">P1.3 — Modules</a>
<a class="na" onclick="go('p14')">P1.4 — Interface</a>
<a class="na" onclick="go('p15')">P1.5 — Parcours Utilisateur</a>
<a class="na" onclick="go('p16')">P1.6 — Technologies</a>
<div class="nst">📚 Partie 2 — Documentation</div>
<a class="na" onclick="go('p21')">P2.1 — Architecture</a>
<a class="na" onclick="go('p22')">P2.2 — Modules détail</a>
<a class="na ns" onclick="go('m1')">⤷ Parseur Word</a>
<a class="na ns" onclick="go('m2')">⤷ Dédoublonnage</a>
<a class="na ns" onclick="go('m3')">⤷ Stockage</a>
<a class="na ns" onclick="go('m4')">⤷ Knowledge Hub IA</a>
<a class="na ns" onclick="go('m5')">⤷ Serveur MCP</a>
<a class="na" onclick="go('p23')">P2.3 — API tRPC</a>
<a class="na" onclick="go('p24')">P2.4 — Base de Données</a>
<a class="na" onclick="go('p25')">P2.5 — Flux de Données</a>
<a class="na" onclick="go('p26')">P2.6 — Technologies</a>
<a class="na" onclick="go('p27')">P2.7 — Glossaire</a>
<a class="na" onclick="go('p28')">P2.8 — Roadmap</a>
</nav>`;

const part1 = `
<div class="sec" id="p11">
<span class="pl l1">Partie 1</span>
<h2><span class="n n1">P1</span>Le Pitch</h2>
<h3>Le problème</h3>
<p>Les experts en accessibilité web passent des heures à rédiger les mêmes rapports Word, audit après audit. Les mêmes erreurs reviennent, mais aucun outil ne capitalise cette connaissance. Résultat : travail répétitif, lent, expertise silotée dans des fichiers Word isolés.</p>
<div class="steps">
<div class="step"><div class="sn">1</div><div class="sc"><div class="st">Extraction automatique</div><p>Lit les rapports Word <code>.docx</code> et extrait toutes les erreurs structurées.</p></div></div>
<div class="step"><div class="sn">2</div><div class="sc"><div class="st">Capitalisation intelligente</div><p>Stocke les erreurs dans une bibliothèque dédupliquée — 1 entrée par erreur unique avec un compteur d'occurrences.</p></div></div>
<div class="step"><div class="sn">3</div><div class="sc"><div class="st">Augmentation IA</div><p>Assistant IA qui répond aux questions en s'appuyant sur vos audits passés et le RGAA officiel.</p></div></div>
</div>
<div class="al as"><span class="aico">💡 En une phrase</span>RGAA Constat Extractor transforme des rapports Word en une base de connaissance intelligente, augmentée par l'IA.</div>
</div>

<div class="sec" id="p12">
<span class="pl l1">Partie 1</span>
<h2><span class="n n1">P2</span>Carte du Projet</h2>
<div class="mw"><div class="ml">Vue macroscopique du système</div>
<div class="mermaid">
graph TB
User["👤 Auditeur"] --> App["🖥️ Application Web React"]
App --> Backend["⚙️ Serveur Node.js"]
Backend --> Word["📄 Lecture Word .docx"]
Backend --> IA["🧠 Assistant IA RAG"]
Backend --> DB[("🗄️ MySQL")]
Backend --> Files["📁 Fichiers .docx"]
IA --> VDB[("🔍 ChromaDB Vectorielle")]
</div></div>
<p>L'auditeur interagit avec l'<strong>application web</strong> qui communique avec un <strong>serveur</strong> orchestrant 4 responsabilités : lire les fichiers Word, gérer l'IA, stocker les données relationnelles (MySQL), et stocker les fichiers uploadés.</p>
</div>

<div class="sec" id="p13">
<span class="pl l1">Partie 1</span>
<h2><span class="n n1">P3</span>Modules — Qui fait quoi ?</h2>
<div class="g2">
<div class="card"><div class="ci">📄</div><div class="cn">Parseur Word</div><div class="cd">Lit un fichier .docx et extrait les erreurs d'accessibilité structurées</div><div class="cf">server/parser.ts</div></div>
<div class="card"><div class="ci">🔑</div><div class="cn">Dédoublonnage</div><div class="cd">Évite les doublons via empreinte SHA-256 unique par constat</div><div class="cf">utils/deduplication.ts</div></div>
<div class="card"><div class="ci">💾</div><div class="cn">Stockage</div><div class="cd">Sauvegarde les fichiers Word uploadés — local ou AWS S3</div><div class="cf">server/storage.ts</div></div>
<div class="card"><div class="ci">🧠</div><div class="cn">Knowledge Hub IA</div><div class="cd">Assistant IA qui répond aux questions avec votre historique d'audits</div><div class="cf">server/hub/</div></div>
<div class="card"><div class="ci">🔌</div><div class="cn">Serveur MCP</div><div class="cd">Connecte Claude, Cursor et autres IA externes aux outils RGAA</div><div class="cf">server/mcp.ts</div></div>
</div>
</div>

<div class="sec" id="p14">
<span class="pl l1">Partie 1</span>
<h2><span class="n n1">P4</span>L'Interface en 30 secondes</h2>
<div class="mw"><div class="ml">Les 6 onglets de l'application</div>
<div class="mermaid">
graph LR
H["🏠 Home.tsx"] --> A["📤 Upload"]
H --> B["📄 Rapports"]
H --> C["📚 Bibliothèque"]
H --> D["📊 Stats"]
H --> E["📈 Évolution"]
H --> F["💬 Chat Expert"]
</div></div>
<div class="tw"><table><thead><tr><th>Onglet</th><th>Fonctionnalités clés</th></tr></thead><tbody>
<tr><td>📤 Upload</td><td>Drag &amp; Drop .docx, anti-doublon, barre de progression</td></tr>
<tr><td>📄 Rapports</td><td>Statuts pending/processing/completed, détail des constats</td></tr>
<tr><td>📚 Bibliothèque</td><td>Filtres thématiques, recherche sémantique ChromaDB</td></tr>
<tr><td>📊 Stats</td><td>Recharts : répartition par thématique et par impact</td></tr>
<tr><td>📈 Évolution</td><td>Comparaison multi-rapports dans le temps</td></tr>
<tr><td>💬 Chat Expert</td><td>IA conversationnelle + analyse HTML + sources citées</td></tr>
</tbody></table></div>
</div>

<div class="sec" id="p15">
<span class="pl l1">Partie 1</span>
<h2><span class="n n1">P5</span>Parcours Utilisateur Type</h2>
<div class="steps">
<div class="step"><div class="sn">1</div><div class="sc"><div class="st">Connexion</div><p>L'auditeur se connecte avec son identifiant et mot de passe.</p></div></div>
<div class="step"><div class="sn">2</div><div class="sc"><div class="st">Upload</div><p>Il clique sur <strong>Upload</strong> et glisse-dépose son rapport Word <code>.docx</code>.</p></div></div>
<div class="step"><div class="sn">3</div><div class="sc"><div class="st">Anti-doublon</div><p>L'application vérifie si ce rapport a déjà été importé pour éviter les doublons.</p></div></div>
<div class="step"><div class="sn">4</div><div class="sc"><div class="st">Traitement</div><p>Il clique <strong>"Traiter le rapport"</strong> — le serveur lit le fichier, extrait et classe toutes les erreurs.</p></div></div>
<div class="step"><div class="sn">5</div><div class="sc"><div class="st">Consultation Rapports</div><p>L'onglet <strong>Rapports</strong> affiche les erreurs avec leurs niveaux de gravité.</p></div></div>
<div class="step"><div class="sn">6</div><div class="sc"><div class="st">Bibliothèque</div><p>Dans <strong>Bibliothèque</strong>, il filtre par thématique et voit combien de fois chaque erreur est revenue sur ses projets.</p></div></div>
<div class="step"><div class="sn">7</div><div class="sc"><div class="st">Chat IA</div><p>Il pose sa question au <strong>Chat Expert</strong> — l'IA répond avec des sources tirées de ses audits passés et du RGAA officiel.</p></div></div>
</div>
</div>

<div class="sec" id="p16">
<span class="pl l1">Partie 1</span>
<h2><span class="n n1">P6</span>Technologies en bref</h2>
<div class="tw"><table><thead><tr><th>Technologie</th><th>À quoi ça ressemble</th><th>Pourquoi ce choix</th></tr></thead><tbody>
<tr><td><strong>React 19</strong></td><td>Un kit Lego pour assembler des pièces d'interface</td><td>Standard du marché, très rapide</td></tr>
<tr><td><strong>Node.js</strong></td><td>Un moteur qui fait tourner JavaScript côté serveur</td><td>Même langage que le frontend</td></tr>
<tr><td><strong>MySQL</strong></td><td>Une feuille Excel très puissante et sécurisée</td><td>Fiable pour données relationnelles</td></tr>
<tr><td><strong>ChromaDB</strong></td><td>Un moteur de recherche qui trouve par "sens" et non par mot exact</td><td>Indispensable pour le RAG</td></tr>
<tr><td><strong>tRPC</strong></td><td>Un câble sécurisé et typé entre interface et serveur</td><td>Évite les erreurs de communication</td></tr>
<tr><td><strong>mammoth.js</strong></td><td>Un ouvre-boîtes universel pour fichiers Word</td><td>Seule lib capable de lire .docx</td></tr>
<tr><td><strong>SHA-256</strong></td><td>Une machine à empreintes digitales pour textes</td><td>Identifier doublons sans comparer mot à mot</td></tr>
</tbody></table></div>
</div>
<hr/>`;

const part2 = `
<div class="sec" id="p21">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.1</span>Architecture Technique Complète</h2>
<p>Le projet est un <strong>monorepo</strong> — un seul dépôt Git pour frontend et backend. La communication se fait via <strong>tRPC</strong>, un protocole qui génère automatiquement un pont type-safe sans écrire une API REST manuelle.</p>
<div class="mw"><div class="ml">Architecture complète avec tous les sous-modules</div>
<div class="mermaid">
graph TB
subgraph Client["🖥️ Frontend — React 19"]
UI["shadcn/ui + Radix"]
TQ["TanStack Query"]
TC["tRPC Client"]
end
subgraph Server["⚙️ Backend — Node.js + Express"]
TRPC["tRPC Routers × 6"]
subgraph Core["Modules Métier"]
PARSER["📄 parser.ts"]
DEDUP["🔑 deduplication.ts"]
STORAGE["💾 storage.ts"]
end
subgraph Hub["🧠 Knowledge Hub"]
EMBED["embeddings.ts"]
INGEST["ingestionPipeline.ts"]
RAG["ragEngine.ts"]
LLM["llmAdapter.ts"]
end
MCP["🔌 mcp.ts"]
end
subgraph Data["💾 Persistance"]
DB[("MySQL")]
VDB[("ChromaDB")]
STO["Fichiers"]
end
UI-->TQ-->TC-->TRPC
TRPC-->Core
TRPC-->Hub
Core-->DB
Core-->STO
Hub-->VDB
Hub-->DB
MCP-->Hub
</div></div>
<p><strong>Couches :</strong> Frontend React 19 + shadcn/ui · Backend Express + tRPC · MySQL relationnelle + ChromaDB vecteurs · Abstraction stockage Local/S3.</p>
</div>

<div class="sec" id="p22">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.2</span>Modules Fonctionnels — Détail Complet</h2>

<h3 class="hc" id="m1">Module 1 — Parseur Word <code>parser.ts</code></h3>
<p><strong>Rôle :</strong> Transformer un buffer binaire <code>.docx</code> en tableau <code>ExtractedFinding[]</code>.<br/><strong>Pourquoi :</strong> Les rapports sont en Word. L'application extrait des données structurées sans intervention humaine.</p>
<div class="mw"><div class="ml">Flux interne du parseur</div>
<div class="mermaid">
flowchart LR
A["Buffer .docx"] --> B["mammoth.js"]
B --> C["Texte brut"] & D["HTML + liens"]
C --> E["parseTextContent()"]
D --> F["extractAuditedPages()"]
E --> G["ExtractedFinding[]"]
F --> H["AuditedPage[]"]
G & H --> I["ParseResult"]
</div></div>
<div class="steps">
<div class="step"><div class="sn sn2">1</div><div class="sc"><div class="st">Double extraction</div><p>mammoth lit le .docx deux fois : texte brut (constats) + HTML (liens des pages auditées).</p></div></div>
<div class="step"><div class="sn sn2">2</div><div class="sc"><div class="st">Localisation de section</div><p>Utilise <code>lastIndexOf()</code> pour trouver la <em>dernière</em> occurrence de "Descriptions des erreurs" — la première est dans le sommaire.</p></div></div>
<div class="step"><div class="sn sn2">3</div><div class="sc"><div class="st">Détection critères</div><p>Regex <code>/^Critère\\s+[\\d.]+/i</code> pour identifier chaque critère RGAA.</p></div></div>
<div class="step"><div class="sn sn2">4</div><div class="sc"><div class="st">Extraction + séparation</div><p>Regex <code>Impact\\s*:\\s*(Bloquant|Majeur|Mineur)</code> pour les constats. Pattern <code>/[.!?][A-Z]/</code> sépare le constat de sa solution.</p></div></div>
</div>
<div class="tw"><table><thead><tr><th>Champ</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>thematicNumber</code></td><td>number</td><td>Numéro de thématique (1–13)</td></tr>
<tr><td><code>criterionReference</code></td><td>string</td><td>Référence ex: "1.1"</td></tr>
<tr><td><code>impact</code></td><td>Bloquant│Majeur│Mineur</td><td>Niveau de criticité</td></tr>
<tr><td><code>finding</code></td><td>string</td><td>Texte du constat</td></tr>
<tr><td><code>solution</code></td><td>string?</td><td>Correction suggérée</td></tr>
</tbody></table></div>

<h3 class="hc" id="m2">Module 2 — Dédoublonnage <code>deduplication.ts</code></h3>
<p><strong>Rôle :</strong> Générer une empreinte unique (<code>signatureHash</code>) pour chaque constat.<br/><strong>Pourquoi :</strong> Sans dédoublonnage, 50 audits avec la même erreur créeraient 50 entrées. On veut 1 entrée avec <code>occurrenceCount = 50</code>.</p>
<pre>// Étape 1 — Normalisation sévère
"L'image du Lôgo n'a PAS d'alt !" → "limage du logo na pas dalt"

// Étape 2 — Hash SHA-256
SHA-256("limage du logo na pas dalt" + criterionId) → "a3f8c1d9..."

// Étape 3 — Upsert
hash inconnu → INSERT finding_template (nouveau)
hash connu   → UPDATE occurrenceCount++ (existant)</pre>
<div class="al ak"><span class="aico">⚡ Important</span>La <code>signatureHash</code> est la clé de déduplication stockée dans MySQL et aussi l'ID stable dans ChromaDB.</div>

<h3 class="hc" id="m3">Module 3 — Stockage Hybride <code>storage.ts</code></h3>
<p><strong>Rôle :</strong> Abstraire le stockage des fichiers .docx — le reste du code appelle toujours <code>storagePut()</code>, <code>storageGet()</code>, <code>storageDelete()</code> sans savoir où les fichiers vont réellement.</p>
<div class="tw"><table><thead><tr><th>Variable d'env</th><th>Mode</th><th>Comportement</th></tr></thead><tbody>
<tr><td><code>FORGE_API_KEY</code> absent</td><td>Local</td><td>Fichiers dans <code>./uploads/{userId}/</code></td></tr>
<tr><td><code>FORGE_API_KEY</code> présent</td><td>Cloud S3</td><td>Proxy vers AWS S3 via l'API Forge</td></tr>
</tbody></table></div>

<h3 class="hc" id="m4">Module 4 — Knowledge Hub IA <code>server/hub/</code></h3>
<div class="al as"><span class="aico">💡 C'est quoi le RAG ?</span>Avant de répondre, l'IA cherche dans VOS données le contexte pertinent. La réponse est ancrée dans votre historique réel d'audits — pas juste dans les connaissances générales du modèle.</div>
<h4>A — Embeddings (<code>embeddings.ts</code>)</h4>
<p>Convertit du texte en vecteur (~1500 nombres). Deux textes sémantiquement proches ont des vecteurs proches → ChromaDB les trouve par similarité.</p>
<pre>"L'image n'a pas d'alt"     → [0.12, -0.87, 0.43, ...]
"Texte alternatif manquant" → [0.11, -0.85, 0.41, ...]  ← proches !</pre>
<h4>B — Pipeline d'Ingestion (<code>ingestionPipeline.ts</code>)</h4>
<div class="al ak"><span class="aico">⚡ Critique</span>L'indexation ChromaDB est toujours en <strong>fire-and-forget</strong> (<code>setImmediate</code>). Si ChromaDB est hors ligne, l'import MySQL réussit quand même. Le métier n'est jamais bloqué par l'IA.</div>
<h4>C — Moteur RAG (<code>ragEngine.ts</code>)</h4>
<div class="mw"><div class="ml">Flux complet du moteur RAG</div>
<div class="mermaid">
flowchart LR
Q["Question"] --> E["embed() → vecteur"]
E --> S["searchAllCollections()"]
S --> R["rgaa_referential"] & F["rgaa_findings"] & C["rgaa_code"]
R & F & C --> SC["computeScore()"]
SC --> PR["buildRagPrompt()"]
PR --> LM["invokeHubLLM()"]
LM --> A["Réponse + sources"]
</div></div>
<pre>score = (1 - distance_cosine) × poids_collection
      + log(occurrenceCount) / 5        ← boost fréquence
      + (confidenceLevel / 100) × 0.2   ← boost confiance</pre>
<p>Si la question contient une référence comme <code>"7.1"</code> → filtre métadonnées appliqué + boost <code>+1.0</code> sur les résultats exacts.</p>

<h3 class="hc" id="m5">Module 5 — Serveur MCP <code>mcp.ts</code></h3>
<p><strong>Rôle :</strong> Exposer les fonctionnalités du Hub aux outils IA externes via le protocole standardisé MCP.</p>
<div class="tw"><table><thead><tr><th>Type</th><th>Nom</th><th>Description</th></tr></thead><tbody>
<tr><td>Tool</td><td><code>search_criteria</code></td><td>Recherche sémantique dans le référentiel RGAA</td></tr>
<tr><td>Tool</td><td><code>propose_deduplication</code></td><td>Analyse de similarité entre constats</td></tr>
<tr><td>Tool</td><td><code>validate_finding</code></td><td>Valide et indexe définitivement un constat</td></tr>
<tr><td>Resource</td><td><code>rgaa://criteria/{id}</code></td><td>Accès direct au contenu d'un critère</td></tr>
</tbody></table></div>
</div>

<div class="sec" id="p23">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.3</span>Couche API — tRPC Complète</h2>
<h3 class="hc">auditRouter</h3>
<div class="tw"><table><thead><tr><th>Procédure</th><th>Type</th><th>Auth</th><th>Paramètres</th><th>Retour</th></tr></thead><tbody>
<tr><td><code>uploadReport</code></td><td>mutation</td><td>✅</td><td>fileName, fileData</td><td>{ reportId, fileUrl }</td></tr>
<tr><td><code>checkReportExists</code></td><td>query</td><td>✅</td><td>fileName</td><td>boolean</td></tr>
<tr><td><code>getUserReports</code></td><td>query</td><td>✅</td><td>—</td><td>AuditReport[]</td></tr>
<tr><td><code>getEnrichedFindings</code></td><td>query</td><td>✅</td><td>reportId?, q?, impact?</td><td>EnrichedFinding[]</td></tr>
<tr><td><code>processReport</code></td><td>mutation</td><td>✅</td><td>reportId</td><td>{ success, findingsCount }</td></tr>
<tr><td><code>deleteReport</code></td><td>mutation</td><td>✅</td><td>reportId</td><td>{ success }</td></tr>
</tbody></table></div>
<h3 class="hc">hubRouter</h3>
<div class="tw"><table><thead><tr><th>Procédure</th><th>Type</th><th>Auth</th><th>Paramètres</th><th>Retour</th></tr></thead><tbody>
<tr><td><code>ask</code></td><td>query</td><td>❌</td><td>question, context?</td><td>RagResponse</td></tr>
<tr><td><code>analyze</code></td><td>query</td><td>❌</td><td>html, context?</td><td>RagResponse</td></tr>
<tr><td><code>suggest</code></td><td>query</td><td>❌</td><td>problem, criterionRef?</td><td>RagResponse</td></tr>
<tr><td><code>triggerReindex</code></td><td>mutation</td><td>✅</td><td>source, reset?</td><td>{ success }</td></tr>
</tbody></table></div>
</div>

<div class="sec" id="p24">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.4</span>Base de Données</h2>
<div class="mw"><div class="ml">Diagramme Entité-Relation</div>
<div class="mermaid">
erDiagram
users ||--o{ audit_reports : "possède"
audit_reports ||--o{ findings : "contient"
findings }o--|| rgaa_criteria : "référence"
findings }o--o| finding_templates : "issu de"
finding_templates }o--|| rgaa_criteria : "appartient à"
rgaa_criteria }o--|| rgaa_thematics : "appartient à"
</div></div>
<div class="tw"><table><thead><tr><th>Table</th><th>Champs clés</th><th>Rôle</th></tr></thead><tbody>
<tr><td><code>users</code></td><td>email, passwordHash</td><td>Comptes utilisateurs authentification JWT</td></tr>
<tr><td><code>audit_reports</code></td><td>fileKey, status, findingsCount</td><td>Rapports importés avec statut</td></tr>
<tr><td><code>findings</code></td><td>finding, impact, templateId</td><td>Constats individuels d'un rapport</td></tr>
<tr><td><code>finding_templates</code></td><td>signatureHash, occurrenceCount</td><td>Bibliothèque dédupliquée</td></tr>
<tr><td><code>rgaa_criteria</code></td><td>reference, label</td><td>106 critères RGAA (données statiques)</td></tr>
<tr><td><code>app_settings</code></td><td>key, value</td><td>Config persistée (clés API, poids RAG…)</td></tr>
</tbody></table></div>
</div>

<div class="sec" id="p25">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.5</span>Flux de Données Critiques</h2>
<h3 class="hc">Flux 1 — Import complet d'un rapport</h3>
<div class="mw"><div class="ml">Séquence complète d'import .docx</div>
<div class="mermaid">
sequenceDiagram
actor User
participant UI as Frontend
participant API as tRPC API
participant Parser as Parseur Word
participant DB as MySQL
participant Hub as ChromaDB async
User->>UI: Dépose rapport .docx
UI->>API: uploadReport(fileName, fileData)
API->>API: storagePut() sauvegarde
API->>DB: createAuditReport() pending
API-->>UI: reportId
UI->>API: processReport(reportId)
API->>DB: updateStatus processing
API->>Parser: parseAuditReportBuffer(buffer)
Parser-->>API: findings[] auditedPages[] siteUrl
loop Pour chaque constat
API->>API: SHA-256 signature
API->>DB: upsertFindingTemplate()
end
API->>DB: createFindingsBatch()
API->>DB: updateStatus completed
API-->>UI: success findingsCount
Note over API,Hub: Fire-and-Forget non bloquant
API-)Hub: indexReportFindings(reportId)
Hub->>Hub: embed() + ChromaDB upsert
</div></div>
<h3 class="hc">Flux 2 — Question à l'assistant IA (RAG)</h3>
<div class="mw"><div class="ml">Séquence RAG complète</div>
<div class="mermaid">
sequenceDiagram
actor User
participant UI as HubChat
participant API as hubRouter
participant RAG as ragEngine
participant VDB as ChromaDB
participant LLM as LLM
User->>UI: Pose une question
UI->>API: hub.ask({ question })
API->>RAG: askAccessibility(question)
RAG->>RAG: Détection critère + embed()
RAG->>VDB: query 3 collections
VDB-->>RAG: Top 12 résultats + scores
RAG->>RAG: computeScore() + buildRagPrompt()
RAG->>LLM: invokeHubLLM()
LLM-->>RAG: Réponse
RAG-->>UI: answer + sources + mode
</div></div>
<div class="al ai"><span class="aico">ℹ️ Modes de réponse</span><strong>rag</strong> : contexte trouvé dans ChromaDB · <strong>rag-cold-start</strong> : ChromaDB vide · <strong>degraded</strong> : ChromaDB hors ligne</div>
</div>

<div class="sec" id="p26">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.6</span>Technologies — Référence Complète</h2>
<div class="chips">
<span class="chip c1">React 19</span><span class="chip c1">TypeScript 5.9</span><span class="chip c1">tRPC 11</span>
<span class="chip c1">Node.js</span><span class="chip c1">Express</span><span class="chip c1">Vite 7</span>
<span class="chip c2">MySQL 8</span><span class="chip c2">Drizzle ORM</span><span class="chip c2">ChromaDB</span>
<span class="chip">shadcn/ui</span><span class="chip">TanStack Query</span><span class="chip">Zod</span>
<span class="chip">mammoth.js</span><span class="chip">jose JWT</span><span class="chip">AWS S3</span>
<span class="chip">Recharts</span><span class="chip">Framer Motion</span><span class="chip">Vitest</span>
<span class="chip">MCP SDK</span><span class="chip">Wouter</span>
</div>
<div class="tw"><table><thead><tr><th>Couche</th><th>Technologie</th><th>Version</th><th>Rôle</th></tr></thead><tbody>
<tr><td>Frontend</td><td>React</td><td>19.2.1</td><td>Framework UI composant-based</td></tr>
<tr><td>Frontend</td><td>shadcn/ui + Radix</td><td>latest</td><td>Composants UI accessibles</td></tr>
<tr><td>Frontend</td><td>TanStack Query</td><td>5.90.2</td><td>Cache et sync données</td></tr>
<tr><td>Communication</td><td>tRPC</td><td>11.6.0</td><td>API type-safe sans REST</td></tr>
<tr><td>Communication</td><td>Zod</td><td>4.1.12</td><td>Validation des schémas</td></tr>
<tr><td>Backend</td><td>Node.js + Express</td><td>4.21.2</td><td>Serveur HTTP</td></tr>
<tr><td>Base de données</td><td>MySQL 8</td><td>8.x</td><td>Stockage relationnel principal</td></tr>
<tr><td>ORM</td><td>Drizzle ORM</td><td>0.44.5</td><td>Abstraction SQL type-safe</td></tr>
<tr><td>IA/Vecteurs</td><td>ChromaDB</td><td>3.3.1</td><td>Base vectorielle pour le RAG</td></tr>
<tr><td>Parsing</td><td>mammoth.js</td><td>1.11.0</td><td>Conversion .docx → texte/HTML</td></tr>
<tr><td>Auth</td><td>jose JWT</td><td>6.1.0</td><td>Sessions sécurisées via cookie</td></tr>
<tr><td>MCP</td><td>@modelcontextprotocol/sdk</td><td>1.26.0</td><td>Interface pour outils IA externes</td></tr>
</tbody></table></div>
</div>

<div class="sec" id="p27">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.7</span>Glossaire Technique — 22 entrées</h2>
<div class="gl">
<div class="gi"><div class="gt">RGAA</div><div class="gd">Référentiel légal — 106 critères d'accessibilité web en France sur 13 thématiques.</div><div class="ga">Le Code de la Route, mais pour les sites web.</div></div>
<div class="gi"><div class="gt">Constat</div><div class="gd">Erreur d'accessibilité identifiée lors d'un audit.</div><div class="ga">Un PV dressé par un inspecteur.</div></div>
<div class="gi"><div class="gt">Finding Template</div><div class="gd">Version générique et dédupliquée d'un constat, réutilisable entre audits.</div><div class="ga">Un modèle de courrier type à compléter à chaque fois.</div></div>
<div class="gi"><div class="gt">React</div><div class="gd">Bibliothèque JavaScript pour construire des interfaces interactives.</div><div class="ga">Un kit Lego pour assembler des pièces d'interface.</div></div>
<div class="gi"><div class="gt">tRPC</div><div class="gd">Protocole de communication type-safe entre frontend et backend, sans REST manuel.</div><div class="ga">Un câble garantissant que les deux bouts parlent le même langage.</div></div>
<div class="gi"><div class="gt">Drizzle ORM</div><div class="gd">Outil qui transforme des tables SQL en objets TypeScript typés.</div><div class="ga">Un interprète bilingue entre votre code et la base de données.</div></div>
<div class="gi"><div class="gt">mammoth.js</div><div class="gd">Bibliothèque Node.js pour lire et convertir les fichiers Word .docx.</div><div class="ga">Un ouvre-boîtes universel pour fichiers Word.</div></div>
<div class="gi"><div class="gt">Zod</div><div class="gd">Bibliothèque de validation de schémas TypeScript, vérifie les données à l'entrée.</div><div class="ga">Un douanier qui contrôle chaque colis entrant.</div></div>
<div class="gi"><div class="gt">ChromaDB</div><div class="gd">Base de données vectorielle — stocke et recherche par sens, pas par mot-clé.</div><div class="ga">Un bibliothécaire trouvant un livre par thème, même sans le titre.</div></div>
<div class="gi"><div class="gt">RAG</div><div class="gd">Retrieval-Augmented Generation — l'IA cherche dans vos données avant de répondre.</div><div class="ga">Un expert consultant ses notes avant de vous conseiller.</div></div>
<div class="gi"><div class="gt">Embedding</div><div class="gd">Représentation numérique (vecteur) d'un texte capturant son sens.</div><div class="ga">Les coordonnées GPS de la signification d'un texte.</div></div>
<div class="gi"><div class="gt">LLM</div><div class="gd">Large Language Model — modèle d'IA génératif (GPT-4, Gemini…).</div><div class="ga">Le cerveau de l'assistant qui comprend et génère du texte.</div></div>
<div class="gi"><div class="gt">MCP</div><div class="gd">Model Context Protocol — standard pour connecter des outils à des IA externes.</div><div class="ga">Une prise universelle pour brancher n'importe quelle IA sur vos outils.</div></div>
<div class="gi"><div class="gt">Fire-and-Forget</div><div class="gd">Lancer une tâche asynchrone sans attendre ni gérer sa fin.</div><div class="ga">Poster une lettre sans attendre la livraison pour continuer sa journée.</div></div>
<div class="gi"><div class="gt">Upsert</div><div class="gd">INSERT si la donnée n'existe pas, UPDATE si elle existe déjà.</div><div class="ga">Ajouter un contact ou mettre à jour son numéro s'il est déjà dans le répertoire.</div></div>
<div class="gi"><div class="gt">SHA-256</div><div class="gd">Algorithme de hachage générant un code unique de 64 caractères par entrée.</div><div class="ga">Une machine à empreintes digitales : unique pour chaque texte.</div></div>
<div class="gi"><div class="gt">JWT</div><div class="gd">JSON Web Token — jeton signé prouvant l'identité d'un utilisateur connecté.</div><div class="ga">Un badge d'accès numérique infalsifiable.</div></div>
<div class="gi"><div class="gt">Monorepo</div><div class="gd">Un seul dépôt Git contenant plusieurs sous-projets (frontend + backend).</div><div class="ga">Un seul classeur avec plusieurs sections plutôt qu'un classeur par matière.</div></div>
<div class="gi"><div class="gt">SPA</div><div class="gd">Single Page Application — une page HTML unique dont le contenu change dynamiquement.</div><div class="ga">Une télé dont l'écran change de contenu sans changer de chaîne.</div></div>
<div class="gi"><div class="gt">TanStack Query</div><div class="gd">Bibliothèque de gestion du cache et de la synchronisation des requêtes côté client.</div><div class="ga">Un assistant retenant vos commandes récentes pour ne pas les répéter.</div></div>
<div class="gi"><div class="gt">Vite</div><div class="gd">Outil de build ultra-rapide pour les applications frontend modernes.</div><div class="ga">Un four à pizza turbo comparé à un four classique.</div></div>
<div class="gi"><div class="gt">signatureHash</div><div class="gd">Empreinte numérique unique générée par SHA-256 pour identifier un constat sans ambiguïté.</div><div class="ga">L'ADN numérique d'un constat.</div></div>
</div>
</div>

<div class="sec" id="p28">
<span class="pl l2">Partie 2</span>
<h2><span class="n n2">2.8</span>Roadmap &amp; Évolutions Futures</h2>
<div class="phases">
<div class="ph ph1"><div class="pt">🔵 Phase 1 — RAG Multi-Agents Spécialisés</div><ul>
<li><strong>RAG Référentiel :</strong> Vérité immuable du RGAA 4.1 et WCAG 2.1.</li>
<li><strong>RAG Expertise :</strong> Constats capitalisés de tous les audits passés.</li>
<li><strong>RAG Pédagogique :</strong> Explications simplifiées + exemples de code conformes.</li>
<li><strong>RAG Patterns :</strong> Détection de patterns de code non-accessibles récurrents.</li>
</ul></div>
<div class="ph ph2"><div class="pt">🟣 Phase 2 — Anti-Hallucination &amp; Fiabilité</div><ul>
<li><strong>Seuils stricts (&gt;85%) :</strong> L'IA ne répond que si le contexte est suffisamment pertinent.</li>
<li><strong>Citations obligatoires :</strong> Chaque affirmation liée à un critère RGAA ou un audit source.</li>
<li><strong>Prompt Guards :</strong> L'IA admet explicitement son ignorance si les données manquent.</li>
</ul></div>
<div class="ph ph3"><div class="pt">🟠 Phase 3 — Intégrations Avancées</div><ul>
<li><strong>Computer Vision :</strong> Analyser des captures d'écran pour mapper visuellement les erreurs.</li>
<li><strong>Knowledge Graph :</strong> Passer de vecteurs à un graphe de liens logiques entre critères et solutions.</li>
<li><strong>Connecteur MCP Global :</strong> Interface pour Claude, ChatGPT, Copilot… directement dans l'IDE.</li>
</ul></div>
</div>
</div>`;

const script = `
<script>
const go=id=>{const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth'})};
window.addEventListener('scroll',()=>{
  const d=document.documentElement,p=(d.scrollTop/(d.scrollHeight-d.clientHeight))*100;
  document.getElementById('prog').style.width=p+'%';
  document.getElementById('btt').classList.toggle('show',d.scrollTop>400);
  const secs=document.querySelectorAll('.sec'),nas=document.querySelectorAll('.na');
  let cur='';
  secs.forEach(s=>{if(window.scrollY>=s.offsetTop-150)cur=s.id});
  nas.forEach(n=>{const m=n.getAttribute('onclick')?.match(/go\\('([^']+)'\\)/);n.classList.toggle('on',m&&m[1]===cur)});
});
mermaid.initialize({startOnLoad:true,theme:'dark',themeVariables:{
  primaryColor:'#1e3a5f',primaryTextColor:'#e6edf3',primaryBorderColor:'#58c4dc',
  lineColor:'#58c4dc',mainBkg:'#21262d',fontFamily:'-apple-system,sans-serif',fontSize:'12px',
  nodeBorder:'#58c4dc',edgeLabelBackground:'#161b22',actorBkg:'#21262d',
  actorBorder:'#58c4dc',actorTextColor:'#e6edf3',signalColor:'#58c4dc',
  noteBkgColor:'#1a237e',noteTextColor:'#e6edf3'
}});
<\/script>`;

const footer = `
<footer style="text-align:center;padding:1.8rem 0 1rem;color:var(--m);font-size:.73rem;border-top:1px solid var(--bd);margin-top:1.5rem;">
  Rapport 2 · RGAA Constat Extractor · 14 mars 2026 · Généré avec le prompt fonctionnel v2 (structure 2 parties)
</footer>`;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Rapport 2 — RGAA Constat Extractor</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script>
<style>${css}</style>
</head>
<body>
<div id="prog"></div>
${nav}
<main id="main">
<div class="hero">
<div class="badge">📄 Rapport 2 · 14 mars 2026</div>
<h1>RGAA Constat Extractor</h1>
<p>Structure 2 parties · Développeurs (tous niveaux), Product Owners, Chefs de projet</p>
</div>
<div class="parts">
<div class="pb p1" onclick="go('p11')"><strong>🚀 PARTIE 1</strong>Vue d'ensemble — 5 min de lecture</div>
<div class="pb p2" onclick="go('p21')"><strong>📚 PARTIE 2</strong>Documentation technique détaillée</div>
</div>
${part1}
${part2}
${footer}
</main>
<button id="btt" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>
${script}
</body>
</html>`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Generated:', OUT);
console.log('Size:', html.length, 'chars');
