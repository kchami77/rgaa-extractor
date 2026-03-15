---
critere_id: "11.6"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.6"
nb_tests: 1
---

# Critère 11.6 — Formulaires

**Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.6_

---

## Test 11.6.1

Chaque regroupement de champs de même nature possède-t-il une légende ?

**Méthodologie :**

1. Retrouver dans le document les groupes de champs de formulaire de même nature ;
2. Pour chaque groupe de champs de formulaire de même nature, vérifier que :
 - Si le regroupement utilise un élément `<fieldset>`, l’élément `<fieldset>` possède un élément `<legend>` ;
 - Si l’élément de regroupement utilise un attribut WAI-ARIA `role="group"` ou `"radiogroup"`, il possède un attribut WAI-ARIA `aria-label` ou `aria-labelledby`.
3. Sinon, pour chacun des champs de même nature, vérifier la présence :
 - Soit d’un attribut title permettant de déterminer l’appartenance du champ au groupement de champ ;
 - Soit d’un attribut `aria-label` permettant de déterminer l’appartenance du champ au groupement de champ ;
 - Soit d’un attribut `aria-labelledby` qui référence un passage de texte permettant de déterminer l’appartenance du champ au groupement de champ ;
 - Soit d’un attribut `aria-describedby` qui référence un passage de texte permettant de déterminer l’appartenance du champ au groupement de champ.
4. Si c’est le cas pour chaque groupe de champs de formulaire ou pour chacun des champs de même nature, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.6.1_

---
