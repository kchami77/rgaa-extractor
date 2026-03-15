---
critere_id: "11.4"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.4"
nb_tests: 3
---

# Critère 11.4 — Formulaires

**Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.4_

**Cas particuliers :**

- Les tests 11.4.2 et 11.4.3 seront considérés comme non applicables :
- {'ul': '- Dans le cas où l’[étiquette mélange une portion de texte qui se lit de droite à gauche avec une portion de texte qui se lit de gauche à droite\xa0;', '- Dans le cas où un formulaire contient des labels de plusieurs langues qui se liraient de droite à gauche et inversement. Par exemple, un formulaire de commande en arabe qui propose une liste de cases à cocher de produit en langue française ou mixant des produits en langue arabe ou en langue française\xa0;', '- Dans le cas où les champs de type `radio` ou `checkbox` et les balises ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"` ne sont pas visuellement présentés sous forme de bouton radio ou de case à cocher\xa0;', '- Dans le cas où les champs seraient utilisés dans un contexte où il pourrait être légitime, du point de vue de l’expérience utilisateur, de placer les étiquettes de manière différente à celle requise dans les tests 11.4.2 et 11.4.3.']}

---

## Test 11.4.1

Chaque étiquette de champ et son champ associé sont-ils accolés ?

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire ;
2. Pour chaque champ de formulaire, vérifier qu’il est accolé à son étiquette ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.4.1_

---

## Test 11.4.2

Chaque étiquette accolée à un champ (à l’exception des cases à cocher, bouton radio ou balises ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"`), vérifie-t-elle ces conditions (hors cas particuliers) ?

- L’étiquette est visuellement accolée immédiatement au-dessus ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
- L’étiquette est visuellement accolée immédiatement au-dessus ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire qui ne sont pas des éléments `<input>` de type `checkbox` ou de type `radio` ou des éléments ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch`";
2. Pour chaque champ de formulaire, vérifier que l’étiquette est visuellement accolée :
 - Immédiatement au-dessus ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
 - Immédiatement au-dessus ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.4.2_

---

## Test 11.4.3

Chaque étiquette accolée à un champ de type `checkbox` ou `radio` ou à une balise ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"`, vérifie-t-elle ces conditions (hors cas particuliers) ?

- L’étiquette est visuellement accolée immédiatement au-dessous ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
- L’étiquette est visuellement accolée immédiatement au-dessous ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire qui sont `<input>` de type `checkbox` ou de type `radio` ou des éléments ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch`";
2. Pour chaque champ de formulaire, vérifier que l’étiquette est visuellement accolée :
 - Immédiatement au-dessous ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
 - Immédiatement au-dessous ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.4.3_

---
