---
critere_id: "11.8"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.8"
nb_tests: 3
---

# Critère 11.8 — Formulaires

**Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupés de manière pertinente ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.8_

**Notes techniques :**

- Il est possible d’utiliser une balise ayant un attribut WAI-ARIA `role="listbox"` en remplacement d’une balise `<select>`. En revanche, il est impossible de créer des groupes d’options via l’utilisation de WAI-ARIA. De ce fait, une liste nécessitant un regroupement d’options structurée à l’aide d’une balise ayant un attribut WAI-ARIA `role="listbox"` sera considérée comme non conforme au critère 11.8.

---

## Test 11.8.1

Pour chaque balise `<select>`, les items de même nature d’une liste de choix sont-ils regroupés avec une balise `<optgroup>`, si nécessaire ?

**Méthodologie :**

1. Retrouver dans le document les listes de sélection (élément `<select>`) ;
2. Pour chaque liste de sélection proposant des groupes d’items de même nature, vérifier que ces items sont regroupés au moyen d’éléments `<optgroup>` ;
3. Si c’est le cas pour chaque liste de sélection proposant des groupes d’items de même nature, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.8.1_

---

## Test 11.8.2

Dans chaque balise `<select>`, chaque balise `<optgroup>` possède-t-elle un attribut `label` ?

**Méthodologie :**

1. Retrouver dans le document les listes de sélection (élément `<select>`) qui possèdent des éléments `<optgroup>` ;
2. Pour chaque élément `<optgroup>`, vérifier qu’il possède un attribut `label` ;
3. Si c’est le cas pour chaque élément `<optgroup>`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.8.2_

---

## Test 11.8.3

Pour chaque balise `<optgroup>` ayant un attribut `label`, le contenu de l’attribut `label` est-il pertinent ?

**Méthodologie :**

1. Retrouver dans le document les listes de sélection (élément `<select>`) qui possèdent des éléments `<optgroup>` pourvus d’un attribut `label` ;
2. Pour chaque attribut `label`, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque attribut `label`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.8.3_

---
