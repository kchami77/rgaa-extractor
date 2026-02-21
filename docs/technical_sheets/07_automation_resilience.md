# Fiche Technique 07 — Automatisation, Amorce & Résilience (Phase 9)

## Objectif
Garantir que le Knowledge Hub est opérationnel dès l'installation, sans intervention manuelle, et assurer sa stabilité face aux redémarrages ou aux pannes réseau.

---

## 🚀 Le Bootstrap Automatique (Self-Healing)

Au démarrage du serveur (`server/_core/index.ts`), un processus intelligent vérifie l'état de santé des données.

### Logique d'Amorce (Cold Start)
1. **Contrôle** : Le serveur appelle `shouldReindex("all")`.
2. **Détection** : Si ChromaDB est vide (zéro document dans les collections de base), le système considère qu'il s'agit d'un "Cold Start" (premier lancement).
3. **Action** : Déclenchement automatique de `scrapeAndIndex("all")`.

### Exécution Non-Bloquante
Le scraping peut être long (plusieurs minutes). Pour ne pas empêcher le serveur web de répondre aux utilisateurs, nous utilisons un pattern **Fire-and-Forget** :
```ts
// Exécution asynchrone détachée du démarrage
scrapeAndIndex("all").catch(err => {
    // Log uniquement en cas d'erreur grave
    console.error("[Hub] Échec de l'amorce automatique", err);
});
```

---

## 🛠️ Résilience des Données

### 1. Fallback Local RGAA
En cas de coupure réseau lors du premier lancement, le système ne reste pas vide. Il charge un fichier JSON local (`server/hub/data/rgaa-4.1.2.json`) contenant l'intégralité du référentiel officiel. Cela garantit un **service minimum garanti**.

### 2. Idempotence des Migrations
Lors de chaque déploiement, `pnpm db:push` synchronise le schéma MySQL. Si la table `hub_settings` existe déjà, elle n'est pas écrasée ; seules les nouvelles clés manquantes sont ajoutées (via le `seedDefaultSettings`).

---

## 🛡️ Gestion des Processus (Playwright)

Le scraping du WAI-ARIA nécessite Chromium (via Playwright). Pour assurer la résilience :
- **Auto-installation** : Documentée dans le guide d'installation pour éviter les crashs de binaire manquant (`pnpm exec playwright install`).
- **Isolation des Processus** : Chaque instance de Chromium est lancée de manière isolée, et un `AbortController` global s'assure qu'aucun processus fantôme (zombie) ne reste en mémoire si une tâche est annulée.
