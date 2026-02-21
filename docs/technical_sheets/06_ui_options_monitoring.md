# Fiche Technique 06 — Interface Options & Monitoring (Phase 7)

## Objectif
Offrir un centre de pilotage intuitif et performant pour gérer les réglages complexes du Hub et surveiller l'état de l'indexation en temps réel.

---

## 🎨 Architecture React & Composants

L'interface se trouve dans `client/src/pages/Options.tsx`. Elle est découpée en trois zones majeures gérées par un état centralisé.

### 1. Le Monitoring du Hub (Temps Réel)
Pour éviter de recharger la page, l'UI utilise un **polling** (interrogation régulière) :
- **Mécanisme** : `useEffect` avec un `setInterval` de 3 secondes.
- **Donnée** : Appelle `getScrapeStatus` via tRPC pour récupérer le pourcentage de progression et les logs récents du scraper.
- **Feedback** : Barre de progression dynamique de Radix UI et listes d'activités défilantes.

### 2. Le Formulaire Dynamique des Réglages
Plutôt que de coder chaque champ manuellement, nous utilisons un **moteur de rendu de formulaire** :
- **Grouper par Catégorie** : Les réglages sont triés par `category` (LLM, RAG, Sources, etc.).
- **Auto-détection du Type** :
    - `boolean` → Switch (Interrupteur)
    - `number` → Input Numérique
    - `password` → Input Password (avec masquage)
    - `select` → Sélecteur (Dropdown)
- **Validation** : Synchronisation immédiate avec le serveur via des `mutations` tRPC.

---

## 🛠️ Performance & Optimisations

### Dépendances de Rendu
L'interface utilise `react-query` (via tRPC) pour la mise en cache des données. Lorsqu'un réglage est modifié, nous utilisons `utils.hub.getSettings.invalidate()` pour forcer la mise à jour des composants dépendants sans rafraîchir la page.

### Gestion des États de Chargement (Skeleton UI)
Pendant que les réglages sont récupérés depuis MySQL, l'utilisateur voit des "Skeletons" (zones grisées animées) pour éviter les sauts de mise en page (Layout Shift).

---

## ✅ Résilience & UX
- **Feedback de Sauvegarde** : Chaque modification déclenche un "Toast" (notification temporaire) pour confirmer que le réglage a été persisté en base de données.
- **Sécurité** : Les clés API ne sont jamais affichées en clair, même après saisie. Seul un placeholder ou une série d'astérisques est renvoyé par le serveur.
- **Mode Mobile** : La grille de réglages passe d'une vue multi-colonnes à une colonne unique sur mobile pour garantir l'accessibilité de l'administration.
