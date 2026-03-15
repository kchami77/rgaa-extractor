---
critere_id: "9.1"
thematique: "Structuration de l’information"
thematique_id: 9
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.1"
nb_tests: 3
---

# Critère 9.1 — Structuration de l’information

**Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.1_

**Notes techniques :**

- WAI-ARIA permet de définir des titres via le rôle `heading` et l’attribut `aria-level` (indication du niveau de titre). Bien qu’il soit préférable d’utiliser l’élément de titre natif en HTML `<hx>`, l’utilisation du rôle WAI-ARIA `heading` est compatible avec l’accessibilité.

---

## Test 9.1.1

Dans chaque page web, la hiérarchie entre les titres (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level`) est-elle pertinente ?

**Méthodologie :**

1. Retrouver dans le document les titres (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level`) ;
2. Vérifier que la hiérarchie entre les titres est pertinente ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.1.1_

---

## Test 9.1.2

Dans chaque page web, le contenu de chaque titre (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level`) est-il pertinent ?

**Méthodologie :**

1. Pour chaque titre identifié au test 9.1.1, vérifier que son contenu est pertinent ;
2. Si c’est le cas pour chaque titre, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.1.2_

---

## Test 9.1.3

Dans chaque page web, chaque passage de texte constituant un titre est-il structuré à l’aide d’une balise `<hx>` ou d’une balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level` ?

**Méthodologie :**

1. Pour chaque titre identifié au test 9.1.1, vérifier que :
 - Soit il est structuré au moyen d’une balise `<hx>` (“x” désignant une valeur numérique comprise entre 1 et 6);
 - Soit il est structuré au moyen d’une balise possédant un attribut WAI-ARIA `role="heading"` et un attribut WAI-ARIA `aria-level=x` (“x” désignant une valeur numérique).
2. Si c’est le cas pour chaque titre, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.1.3_

---
