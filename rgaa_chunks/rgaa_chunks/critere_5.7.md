---
critere_id: "5.7"
thematique: "Tableaux"
thematique_id: 5
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7"
nb_tests: 5
---

# Critère 5.7 — Tableaux

**Pour chaque tableau de données, la technique appropriée permettant d’associer chaque cellule avec ses en-têtes est-elle utilisée (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7_

**Cas particuliers :**

- Dans le cas de tableaux de données ayant des en-têtes sur une seule ligne ou une seule colonne, les en-têtes peuvent être structurés à l’aide de balise `<th>` sans attribut `scope`.

**Notes techniques :**

- Si l’attribut `headers` est implémenté sur une cellule déjà reliée à un en-tête (de ligne ou de colonne) avec l’attribut `scope` (avec la valeur `col` ou `row`), c’est l’en-tête ou les en-têtes référencés par l’attribut `headers` qui seront restitués aux technologies d’assistance. Les en-têtes reliés avec l’attribut `scope` seront ignorés.

---

## Test 5.7.1

Pour chaque contenu de balise `<th>` s’appliquant à la totalité de la ligne ou de la colonne, la balise `<th>` respecte-t-elle une de ces conditions (hors cas particuliers) ?

- La balise `<th>` possède un attribut `id` unique ;
- La balise `<th>` possède un attribut `scope` ;
- La balise `<th>` possède un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"`.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) s’appliquant à la totalité de la ligne ou de la colonne, vérifier que l’élément `<th>` possède :
 - Soit un attribut `id` unique ;
 - Soit un attribut scope ;
 - Soit un attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7.1_

---

## Test 5.7.2

Pour chaque contenu de balise `<th>` s’appliquant à la totalité de la ligne ou de la colonne et possédant un attribut `scope`, la balise `<th>` vérifie-t-elle une de ces conditions ?

- La balise `<th>` possède un attribut `scope` avec la valeur `"row"` pour les en-têtes de ligne ;
- La balise `<th>` possède un attribut `scope` avec la valeur `"col"` pour les en-têtes de colonne.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut `scope`, vérifier que l’attribut `scope` possède :
 - Soit une valeur `"row"` pour les en-têtes de ligne ;
 - Soit une valeur `"col"` pour les en-têtes de colonne.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut `scope`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7.2_

---

## Test 5.7.3

Pour chaque contenu de balise `<th>` ne s’appliquant pas à la totalité de la ligne ou de la colonne, la balise `<th>` vérifie-t-elle ces conditions ?

- La balise `<th>` ne possède pas d’attribut `scope` ;
- La balise `<th>` ne possède pas d’attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` ;
- La balise `<th>` possède un attribut `id` unique.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) ne s’appliquant pas à la totalité de la ligne ou de la colonne, vérifier que l’élément `<th>` :
 - Possède un attribut `id` unique ;
 - Et ne possède pas d’attribut `scope `;
 - Et ne possède pas d’attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`.
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7.3_

---

## Test 5.7.4

Pour chaque contenu de balise `<td>` ou `<th>` associée à un ou plusieurs en-têtes possédant un attribut `id`, la balise vérifie-t-elle ces conditions ?

- La balise possède un attribut `headers` ;
- L’attribut `headers` possède la liste des valeurs d’attribut `id` des en-têtes associés.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque élément `<td>` ou `<th>` associé à un ou plusieurs en-têtes possédant un attribut `id`, vérifier que :
 - L’élément `<td>` ou `<th>` possède un attribut `headers` ;
 - Et l’attribut `headers` possède la liste des valeurs d’attribut `id` des en-têtes associés.
3. Si c’est le cas pour chaque élément `<td>` ou `<th>` associé à un ou plusieurs en-têtes possédant un attribut `id`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7.4_

---

## Test 5.7.5

Pour chaque balise pourvue d’un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` dont le contenu s’applique à la totalité de la ligne ou de la colonne, la balise vérifie-t-elle une de ces conditions ?

- La balise possède un attribut WAI-ARIA `role="rowheader"` pour les en-têtes de ligne ;
- La balise possède un attribut WAI-ARIA `role="columnheader"` pour les en-têtes de colonne.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`, vérifier que l’élément possède :
 - Soit un attribut WAI-ARIA `role="rowheader"` pour les en-têtes de ligne ;
 - Soit un attribut WAI-ARIA `role="columnheader"` pour les en-têtes de colonne.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.7.5_

---
