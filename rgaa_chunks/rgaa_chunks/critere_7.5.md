---
critere_id: "7.5"
thematique: "Scripts"
thematique_id: 7
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.5"
nb_tests: 3
---

# Critère 7.5 — Scripts

**Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d’assistance ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.5_

**Notes techniques :**

- Les rôles WAI-ARIA `log`, `status` et `alert` ont implicitement une valeur d’attribut WAI-ARIA `aria-live` et `aria-atomic`. On pourra donc considérer (conformément à la spécification WAI-ARIA 1.1) que :
- {'ul': ['- Un attribut WAI-ARIA `aria-live="polite"` associé à un message de statut peut valoir pour un rôle WAI-ARIA `log`\xa0;', '- Un attribut WAI-ARIA `aria-live="polite"` et un attribut WAI-ARIA `aria-atomic="true"` associés à un message de statut peuvent valoir pour un rôle WAI-ARIA `status`\xa0;', '- Un attribut WAI-ARIA `aria-live="assertive"` et un attribut WAI-ARIA `aria-atomic="true"` associés à un message de statut peuvent valoir pour un rôle WAI-ARIA `alert`.']}
- C’est sous réserve que la nature du message de statut satisfasse bien à la correspondance implicitement établie. Dans le cas d’un message de statut indiquant la progression d’un processus et matérialisé graphiquement par une barre de progression, un rôle WAI-ARIA `progressbar` explicite est nécessaire.

---

## Test 7.5.1

Chaque message de statut qui informe de la réussite, du résultat d’une action ou bien de l’état d’une application utilise-t-il l’attribut WAI-ARIA `role="status"` ?

**Méthodologie :**

1. Retrouver dans le document les messages qui valent pour message de statut.
2. Pour chacun de ces messages, déterminer la nature de l’information dont est porteur le message :
3. Si le message informe de la réussite, du résultat d’une action ou bien de l’état d’une application, vérifier que l’élément qui contient le message :
 - Soit utilise l’attribut WAI-ARIA `role=”status”` ;
 - Soit utilise les attributs WAI-ARIA `aria-live=”polite”` et `aria-atomic=”true”`.
4. Si le message présente une suggestion, ou avertit de l’existence d’une erreur, vérifier que l’élément qui contient le message :
 - Soit utilise l’attribut WAI-ARIA `role=”alert”` ;
 - Soit utilise les attributs `aria-live=”assertive”` et `aria-atomic=”true”`.
5. Si le message indique la progression d’un processus, vérifier que l’élément qui contient le message :
 - Soit utilise l’un des attributs WAI-ARIA `role=”log”`, `role=”progressbar”` ou `role=”status”` ;
 - Soit utilise l’attribut WAI-ARIA `aria-live=”polite”` si l’intention est de signaler l’équivalent d’un `rôle “log”` ;
 - Soit utilise les attributs WAI-ARIA `aria-live=”polite”` et aria-atomic=”true si l’intention est de signaler l’équivalent d’un rôle “status”.
6. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.5.1_

---

## Test 7.5.2

Chaque message de statut qui présente une suggestion, ou avertit de l’existence d’une erreur utilise-t-il l’attribut WAI-ARIA `role="alert"` ?

**Méthodologie :**

Tests identiques à 7.5.1

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.5.2_

---

## Test 7.5.3

Chaque message de statut qui indique la progression d’un processus utilise-t-il l’un des attributs WAI-ARIA `role="log"`, `role="progressbar"` ou `role="status"` ?

**Méthodologie :**

Tests identiques à 7.5.1

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.5.3_

---
