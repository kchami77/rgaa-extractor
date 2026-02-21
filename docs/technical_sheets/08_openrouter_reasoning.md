# Fiche Technique 08 — Intelligence Avancée : OpenRouter & Reasoning (Phase 12)

## Objectif
Permettre au Knowledge Hub d'exploiter la puissance des modèles LLM de "raisonnement" (comme DeepSeek R1 ou GPT-o1) via OpenRouter, pour une analyse plus fine des critères d'accessibilité complexes.

---

## 🧠 Le Concept de "Reasoning"

Contrairement aux modèles standards qui prédisent le mot suivant, les modèles de "Reasoning" génèrent une chaîne de pensée interne avant de donner la réponse.
- **Avantage pour l'Audit** : Meilleure déduction sur des critères croisés (ex : contraste dépendant d'un état ARIA dynamique).
- **Interopérabilité** : Utilisation du fournisseur **OpenRouter** pour accéder aux meilleurs modèles du marché avec une API unifiée.

---

## 🛠️ Implémentation de l'Adapter (`llmAdapter.ts`)

L'intégration a été optimisée pour respecter scrupuleusement le format de requête requis par OpenRouter.

### Injection Dynamique du Payload
Nous avons implémenté une logique qui modifie le corps de la requête HTTP juste avant l'envoi :

```ts
// Récupération de l'état du switch dans les réglages
const reasoning = await settingsService.getBool("llm.reasoning");

// Si activé et que le provider est OpenRouter
if (provider === "openrouter" && reasoning) {
    // Injection du paramètre spécifique
    payload.reasoning = { enabled: true };
}
```

---

## ⚙️ Configuration & Paramétrage

Le système expose deux leviers de contrôle dans l'UI :
1. **Modèle (`llm.model`)** : Permet de choisir précisément le modèle (ex : `openai/gpt-4o`, `deepseek/deepseek-r1`).
2. **Switch Reasoning (`llm.reasoning`)** : Active ou désactive la pensée logique.

### Pourquoi séparer les deux ?
Certains modèles sont rapides et n'ont pas besoin de "reasoning" pour des tâches simples. En séparant l'option du modèle, l'auditeur peut optimiser ses coûts et sa vitesse de réponse en fonction de la complexité de sa question.

---

## ✅ Validation & Qualité
- **Double Review** : Le code a été vérifié pour s'assurer que le champ `reasoning` n'est jamais envoyé à d'autres fournisseurs (comme Ollama ou OpenAI direct) qui pourraient rejeter la requête avec une erreur 400.
- **Typage** : Utilisation d'un type extensible pour le `payload` afin de supporter les évolutions futures des API LLM sans casser la structure du code.
