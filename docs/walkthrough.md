# RGAA Knowledge Hub — Référence de Développement

> [!NOTE]
> Ce document est le guide de référence pour comprendre, installer et faire évoluer le Knowledge Hub. Il synthétise la vision produit, les choix d'architecture et les étapes de réalisation.

---

## 🏗️ 1. Vision du Projet

### 🌟 Utilité Fonctionnelle
Le **RGAA Knowledge Hub** transforme l'application d'un simple extracteur de données statiques en un **système expert d'audit augmenté**.
- **Problème** : Les auditeurs doivent jongler entre 106 critères RGAA, des centaines de techniques WCAG et des guides de code ARIA dispersés.
- **Solution** : Un moteur RAG (Retrieval-Augmented Generation) qui centralise toutes ces connaissances.
- **Bénéfice** : L'IA peut désormais répondre à des questions complexes ("Comment rendre ce bouton accessible ?"), analyser du code HTML en temps réel et suggérer des corrections basées sur les référentiels officiels.

### ⚙️ Architecture & Choix Techniques

| Technologie | Pourquoi ce choix ? |
|:--- |:--- |
| **tRPC** | Garantie de types de bout en bout (zéro erreur de schéma entre client et serveur). Rapidité de développement sans écrire de boilerplate REST. |
| **ChromaDB** | Base vectorielle haute performance permettant la **recherche sémantique**. Contrairement au SQL, elle trouve des concepts proches même si les mots-clés diffèrent. |
| **MCP SDK** | Interopérabilité. Permet aux agents IA externes (Claude, ChatGPT via MCP) d'utiliser nos outils d'expertise accessibilité nativement. |
| **Drizzle ORM** | Typage TypeScript strict des schémas SQL. Très léger, il évite la surcharge d'un gros ORM tout en sécurisant les accès MySQL. |
| **Playwright** | Indispensable pour scraper les sources modernes (SPA React) comme le W3C APG, là où un simple fetch échouerait. |

---

## 📋 2. Sommaire

1. [🏗️ Vision du Projet](#️-1-vision-du-projet)
2. [🚀 Guide d'Installation Locale](#-3-guide-dinstallation-locale)
3. [🧩 Structure du Code](#-4-structure-du-code)
4. [🛠️ Développement par Blocs](#️-5-développement-par-blocs)
6. [🛡️ Qualité & Résilience](#-6-qualité--résilience)
7. [🛠️ Commandes Utiles & Maintenance](#️-7-commandes-utiles--maintenance)
8. [🔮 Évolutions Futures](#-8-évolutions-futures)

---

## 🚀 3. Guide d'Installation Locale (Windows & XAMPP)

### 📋 Pré-requis
1. **Node.js 20+** : Téléchargez la version LTS sur [nodejs.org](https://nodejs.org/).
2. **pnpm** : Une fois Node installé, lancez `npm install -g pnpm` dans votre terminal.
3. **XAMPP** : Pour le serveur MySQL local. Téléchargez-le sur [apachefriends.org](https://www.apachefriends.org/).

---

### 📥 Étape 1 : Installation des dépendances
Ouvrez un terminal (PowerShell ou CMD) à la racine du projet :
```bash
# Installation des librairies Node
pnpm install

# Installation du moteur de navigation (Indispensable pour le Scraping)
pnpm exec playwright install chromium
```
> [!TIP]
> **Pourquoi cette commande ?** Le projet utilise un "robot" (**Playwright**) pour aller lire des sites web complexes. Ce robot a besoin d'un "véhicule" (**Chromium**, le moteur de Google Chrome) pour se déplacer sur le web et récupérer les informations d'accessibilité. Sans cela, la récupération de données (Scraping) ne pourra pas fonctionner.

---

### 🛠️ Étape 2 : Configuration MySQL (via XAMPP)
1. Ouvrez le **Panneau de contrôle XAMPP** et cliquez sur **Start** à côté de **MySQL**.
2. Allez sur [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
3. Créez une nouvelle base de données nommée `rgaa_extractor`.
4. Créez un fichier `.env` à la racine (en copiant `.env.example`) et configurez la connexion :
```env
# Format : mysql://utilisateur:motdepasse@host:port/nom_base
DATABASE_URL="mysql://root:@localhost:3306/rgaa_extractor"
```
> [!NOTE]
> Par défaut, XAMPP utilise l'utilisateur `root` sans mot de passe.

---

### 🧠 Étape 3 : Configuration de l'Intelligence Artificielle
Le Hub a besoin d'un moteur pour comprendre le texte. Deux options s'offrent à vous :
- **Local (Ollama)** : Téléchargez Ollama, lancez-le et faites `ollama pull llama3`.
- **Cloud (OpenAI)** : Renseignez votre clé API OpenAI dans le `.env`.

Exemple de config `.env` pour Ollama :
```env
EMBEDDINGS_PROVIDER="ollama"
OLLAMA_HOST="http://localhost:11434"
LLM_PROVIDER="ollama"
LLM_MODEL="llama3"
```

---

### 🔎 Étape 4 : Lancement de ChromaDB (Recherche Vectorielle)
Si vous ne souhaitez pas utiliser Docker, vous pouvez lancer Chroma via Python :
1. Installez Python sur votre système.
2. Dans un terminal séparé : `pip install chromadb`.
3. Lancez le serveur : `chroma run --path ./data/chromadb --port 8000`.

---

### ⚡ Étape 5 : Initialisation et Démarrage
1. **Synchronisez le schéma** de la base de données :
   ```bash
   pnpm db:push
   ```
2. **Lancez l'application** en mode développement :
   ```bash
   pnpm dev
   ```

*Note : Au premier lancement, le Hub détectera que la base vectorielle est vide. Il lancera automatiquement le scraping des référentiels (RGAA, WCAG...) en arrière-plan. Vous pourrez suivre la progression dans la console ou via la page des Paramètres (icône engrenage).*

---

## 🧩 4. Structure du Code

```mermaid
graph TD
    UI[React Options UI] -->|tRPC| Router[Routers Hub/Settings]
    Router -->|Service| SS[SettingsService]
    Router -->|Engine| RAG[RAG Engine]
    RAG -->|Vector Search| Chroma[ChromaDB]
    RAG -->|Tokens| Embed[Embeddings Provider]
    Scraper[Knowledge Scraper] -->|Bulk Index| Chroma
    Scraper -->|Sources| Web[RGAA, WCAG, MDN...]
```

### Fichiers Clés
- `server/hub/ragEngine.ts` : Le cerveau effectuant les recherches vectorielles.
- `server/hub/settingsService.ts` : Gestionnaire de configuration avec cache mémoire.
- `server/hub/knowledgeScraper.ts` : Orchestrateur de collecte de données.
- `client/src/pages/Options.tsx` : Tableau de bord de pilotage du Hub.

---

## 🛠️ 5. Développement par Blocs

### Bloc A : Fondations & Ingestion (Phases 0-6)
- **Refactoring** : Modularisation des routers tRPC pour une meilleure scalabilité.
- **Scrapers** : Implémentation d'adaptateurs pour 5 sources majeures (RGAA, WCAG, WAI-ARIA, AcceDe, MDN).
- **Pipeline** : Mise en place d'un système d'upsert idempotent (SHA-256) évitant tout doublon dans la base vectorielle.

### Bloc B : Moteur RAG & MCP (Phases 3-5)
- **Engine** : Algorithme de recherche hybride avec pondération par collection.
- **MCP** : Exposition des outils (`ask_accessibility`, `analyze_code`, `suggest_fix`) via le protocole open-source de Google-Anthropic.

### Bloc C : Contrôle & UI (Phases 7-9)
- **Settings UI** : Interface riche sous Tailwind/Shadcn pour configurer les providers LLM sans redémarrage.
- **Automatisme** : Intégration du bootstrap intelligent (auto-scrape au boot si vide).

---

## 🛡️ 6. Qualité & Résilience

Le projet a subi une **Double Review** systématique :

1. **Qualité du Code** :
   - Migration totale vers ES Modules (`import`).
   - Typage strict des réponses tRPC avec Zod.
   - Robustesse des boucles asynchrones (concurrence limitée à 5 pour ne pas saturer le CPU/GPU).

2. **Résilience Fonctionnelle** :
   - **Mode Dégradé** : Si ChromaDB est offline, le système bascule automatiquement sur une recherche SQL simplifiée.
   - **Fallback Réseau** : Le référentiel RGAA possède une copie JSON locale en cas d'indisponibilité du site officiel.
   - **Mutex de Scrape** : Empêche deux indexations concurrentes de corrompre les données.

> [!TIP]
> Pour vérifier l'intégrité du code à tout moment, lancez : `pnpm check` (ou `tsc --noEmit`).

---

## 🛠️ 7. Commandes Utiles & Maintenance

| Action | Commande |
|:--- |:--- |
| **Lancement Dev** | `pnpm dev` |
| **Vérification Types** | `pnpm check` |
| **Nouvelle Migration** | `pnpm db:push` |
| **Formatage Code** | `pnpm format` |
| **Installer Chromium** | `pnpm exec playwright install chromium` |

---

## 🔮 8. Évolutions Futures

Pour aller encore plus loin dans l'expertise accessibilité, les axes suivants sont envisagés :
1. **Multi-Langualité Étendue** : Support complet des référentiels anglais (WCAG pur) et espagnols (pour les projets internationaux).
2. **Auto-Correction** : Un outil MCP capable de modifier directement le fichier source HTML pour appliquer le patch suggéré par `suggest_fix`.
3. **Audit de Design (Figma)** : Intégration du Hub dans les outils de design pour valider les contrastes et les structures avant même le développement.
4. **Fine-Tuning** : Entraînement d'un modèle léger spécialisé RGAA sur les milliers de constats réels anonymisés pour une précision absolue.
