---
critere_id: "5.3"
thematique: "Tableaux"
thematique_id: 5
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.3"
nb_tests: 1
---

# Critère 5.3 — Tableaux

**Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.3_

---

## Test 5.3.1

Chaque tableau de mise en forme vérifie-t-il ces conditions ?

- Le contenu linéarisé reste compréhensible ;
- La balise `<table>` possède un attribut `role="presentation"`.

**Méthodologie :**

1. Retrouver dans le document les tableaux de mise en forme ;
2. Pour chaque tableau de mise en forme, vérifier que :
 - L’ordre d’accès aux cellules est cohérent avec le contenu ;
 - L’élément `<table>` est pourvu d’un attribut WAI-ARIA `role="presentation"`.
3. Si c’est le cas pour chaque tableau de mise en forme, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.3.1_

---
