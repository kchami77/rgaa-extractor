---
critere_id: "5.6"
thematique: "Tableaux"
thematique_id: 5
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.6"
nb_tests: 4
---

# Critère 5.6 — Tableaux

**Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.6_

---

## Test 5.6.1

Pour chaque tableau de données, chaque en-tête de colonne s’appliquant à la totalité de la colonne vérifie-t-il une de ces conditions ?

- L’en-tête de colonnes est structuré au moyen d’une balise `<th>` ;
- L’en-tête de colonnes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA `role="columnheader"`.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête de colonnes s’appliquant à la totalité de la colonne, vérifier que l’en-tête de colonne est structuré au moyen :
 - Soit d’un élément `<th>` ;
 - Soit d’un élément pourvu d’un attribut WAI-ARIA `role="columnheader"`.
3. Si c’est le cas pour chaque en-tête de colonne s’appliquant à la totalité de la colonne, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.6.1_

---

## Test 5.6.2

Pour chaque tableau de données, chaque en-tête de ligne s’appliquant à la totalité de la ligne vérifie-t-il une de ces conditions ?

- L’en-tête de lignes est structuré au moyen d’une balise `<th>` ;
- L’en-tête de lignes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA `role="rowheader"`.

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête de ligne s’appliquant à la totalité de la ligne, vérifier que l’en-tête de ligne est structuré au moyen :
 - Soit d’un élément `<th>` ;
 - Soit d’un élément pourvu d’un attribut WAI-ARIA `role="rowheader"`.
3. Si c’est le cas pour chaque en-tête de ligne s’appliquant à la totalité de la ligne, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.6.2_

---

## Test 5.6.3

Pour chaque tableau de données, chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne est-il structuré au moyen d’une balise `<th>` ?

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, vérifier que l’en-tête de ligne est structuré au moyen d’un élément `<th>` ;
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.6.3_

---

## Test 5.6.4

Pour chaque tableau de données, chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise `<td>` ou `<th>` ?

**Méthodologie :**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise `<th>` ou `<td>` ;
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.6.4_

---
