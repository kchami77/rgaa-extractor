---
critere_id: "5.8"
thematique: "Tableaux"
thematique_id: 5
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.8"
nb_tests: 1
---

# Critère 5.8 — Tableaux

**Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données. Cette règle est-elle respectée ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.8_

---

## Test 5.8.1

Chaque tableau de mise en forme (balise `<table>`) vérifie-t-il ces conditions ?

- Le tableau de mise en forme (balise `<table>`) n’a pas d’attribut `summary` (sinon vide) et ne contient pas de balises `<caption>`, `<th>`, `<thead>`, `<tfoot>` ou de balises ayant un attribut WAI-ARIA `role="rowheader"`, `role="columnheader"` ;
- Les cellules du tableau de mise en forme (balises `<td>`) ne possèdent pas d’attributs `scope`, `headers` et `axis`.

**Méthodologie :**

1. Retrouver dans le document les tableaux de mise en forme ;
2. Pour chaque tableau de mise en forme, vérifier que :
 - L’élément `<table>` ne possède pas d'attribut `summary`, d’éléments enfant `<caption>`, `<thead>`, `<th>`, `<tfoot>` ou d’éléments pourvus d’un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` ;
 - Les éléments `<td>` ne possèdent pas d’attributs `scope`, `headers` et `axis`.
3. Si c’est le cas pour chaque tableau de mise en forme, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.8.1_

---
