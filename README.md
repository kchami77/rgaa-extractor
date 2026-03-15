# RGAA Extractor

RGAA Extractor est un outil conçu pour extraire, analyser et gérer les données liées au Référentiel Général d'Amélioration de l'Accessibilité (RGAA).

## À propos

Ce projet intègre un écosystème complet comprenant un frontend et un backend, développé avec des technologies web modernes (React, Vite, TypeScript, Node.js) pour répondre aux besoins d'accessibilité numérique. 

Ses principales fonctionnalités incluent :
- Une gestion complète des critères RGAA.
- L'importation et l'exportation de données d'audit.
- (Plus de détails à venir selon les évolutions du projet)

## Prérequis

- Node.js (version recommandée ou spécifiée dans `.nvmrc` si existant)
- `pnpm` comme gestionnaire de paquets

## Installation

1. Cloner le dépôt.
2. Installer les dépendances :
   ```bash
   pnpm install
   ```

## Commandes disponibles

- **Démarrer l'environnement de développement** (frontend + backend) :
  ```bash
  pnpm run dev
  ```
- **Construire le projet pour la production** :
  ```bash
  pnpm run build
  ```
- **Démarrer le serveur de production** :
  ```bash
  pnpm run start
  ```
- **Lancer les tests** :
  ```bash
  pnpm run test
  ```
- **Synchroniser la base de données (Drizzle)** :
  ```bash
  pnpm run db:push
  ```

## Technologies utilisées

- **Frontend** : React, TailwindCSS, Radix UI, Vite
- **Backend** : Node.js, Express, tRPC, Drizzle ORM
- **Base de données** : PostgreSQL / SQLite (via Drizzle), ChromaDB
- **Langage** : TypeScript

## Licence

Ce projet est sous licence MIT.
