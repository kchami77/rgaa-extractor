# RGAA Extractor

RGAA Extractor est un outil "AI-Native" conçu pour extraire, analyser, capitaliser et gérer les données liées au Référentiel Général d'Amélioration de l'Accessibilité (RGAA). 

Ce projet permet de désenclaver les données des documents d'audit (fichiers Word), dédoublonne l'expertise pour créer une bibliothèque de composants, et propose un "Knowledge Hub" augmenté par l'IA (RAG) pour assister les auditeurs.

## 🚀 Fonctionnalités Principales

- **Parsing Word Intelligent** : Extraction automatisée des critères, impacts, et constats depuis les rapports d'audit Word (`.docx`).
- **Dédoublonnage & Bibliothèque d'Expertise** : Identification et fusion de constats similaires (via signature SHA-256 et distance de Levenshtein) pour capitaliser sur les solutions existantes.
- **Knowledge Hub & RAG (Retrieval-Augmented Generation)** : Espace vectoriel de connaissances interrogeant simultanément la loi (Référentiel RGAA), l'expérience (Audits passés), et les solutions (Snippets de code).
- **Architecture AI-Ready (MCP)** : Serveur Model Context Protocol exposant les outils d'audit aux IA externes.

---

## 🏗️ Architecture et Modules

Le projet intègre un écosystème complet, monolithique dans son exécution, mais parfaitement séparé en différents modules architecturaux :

### 1. Frontend (Client)
Interface utilisateur moderne, réactive et fortement typée.
- **Technologies** : React 19, Radix UI (shadcn), TailwindCSS, Embla Carousel.
- **Gestion d'état & Flux** : TanStack Query, wouter (routing client), et tRPC Client pour une communication Typesafe avec le backend.

### 2. Backend (Serveur)
API modulaire gérant la logique métier critique, l'intelligence artificielle et la persistance.
- **Technologies** : Node.js, Express.js.
- **Services Internes** : 
  - **Word Parser** : Utilise `mammoth` pour lire docx et extraire des structures de données via regex et analyse DOM.
  - **Deduplication Engine** : Analyse de similarités pour consolider les constats.
- **Knowledge Hub Core (Noyau RAG)** :
  - **Moteur RAG Multi-Collection** : Moteur de recherche vectoriel spécialisé.
  - **Service d'Embedding**.
  - **Knowledge Scraper** : Pour l'ingestion de la documentation.

### 3. Persistance & Infrastructure (Data)
- **Base de données relationnelle** : Gérée via **Drizzle ORM** (support MySQL/PostgreSQL/SQLite).
- **Base de données vectorielle** : **ChromaDB** encapsulé en local, dédié à la recherche sémantique du Knowledge Hub.
- **Stockage Hybride** : Abstraction pour le stockage des fichiers bruts (`/uploads` local ou proxy Cloud S3).

---

## 💻 Prérequis

- **Node.js** (version 20+ recommandée)
- **pnpm** (Gestionnaire de paquets)
- Une base de données opérationnelle ou locale (SQLite par défaut via Drizzle).

## 🛠️ Installation & Démarrage

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-depot>
   cd rgaa-extractor
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Environnement**
   Créez et configurez vos variables d'environnement (connexions de test, clés IA, etc.) :
   ```bash
   cp .env.example .env  # (Si applicable)
   ```

4. **Synchroniser la base de données (Drizzle)**
   Cela créera les tables nécessaires.
   ```bash
   pnpm run db:push
   ```

5. **Démarrer l'environnement de développement** (Frontend + Backend en parallèle via tsx)
   ```bash
   pnpm run dev
   ```

---

## 📦 Autres Commandes Utiles

| Commande | Action |
| :--- | :--- |
| `pnpm run build` | Construit le projet pour la production (Vite + esbuild). |
| `pnpm run start` | Démarre le serveur de production final à partir de `dist`. |
| `pnpm run test` | Lance la suite de tests (Vitest). |
| `pnpm run check` | Vérification de la validité du typage TypeScript (`tsc --noEmit`). |

---

## 🧠 Vision Future : Le "RGAA Audit Brain"

La roadmap du projet prévoit une évolution vers des "Agents RAG" spécialisés (Référentiel strict, Expertise cumulée, Pédagogie), des intégrations de Computer Vision pour analyser des captures d'écran UI, et des filtres anti-hallucinations plus avancés.

## 📄 Licence
Ce projet est sous licence MIT.
