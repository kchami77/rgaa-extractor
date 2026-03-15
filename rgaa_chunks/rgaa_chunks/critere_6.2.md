---
critere_id: "6.2"
thematique: "Liens"
thematique_id: 6
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.2"
nb_tests: 1
---

# Critère 6.2 — Liens

**Dans chaque page web, chaque lien a-t-il un intitulé ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.2_

**Notes techniques :**

- Une ancre n’est pas un lien même si pendant longtemps l’élément `<a>` a servi de support à cette technique. Elle n’est donc pas concernée par le présent critère.

---

## Test 6.2.1

Dans chaque page web, chaque lien a-t-il un intitulé entre `<a>` et `</a>` ?

**Méthodologie :**

1. Retrouver dans le document les liens quels qu’ils soient ;
2. Pour chaque lien, vérifier que le contenu de l’élément `<a>` (ou d’un élément pourvu d’un attribut WAI-ARIA `role=link`) contient un intitulé (texte ou alternative) ;
3. Si c’est le cas pour chaque lien, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.2.1_

---
