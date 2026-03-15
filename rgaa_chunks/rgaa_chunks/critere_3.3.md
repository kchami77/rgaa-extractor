---
critere_id: "3.3"
thematique: "Couleurs"
thematique_id: 3
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#3.3"
nb_tests: 4
---

# Critère 3.3 — Couleurs

**Dans chaque page web, les couleurs utilisées dans les composants d’interface ou les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#3.3_

**Cas particuliers :**

- Les cas suivants sont non applicables pour ce critère :
- {'ul': '- Composant d’interface inactif (par exemple, un bouton avec un attribut `disabled`) sur lequel aucune action n’est possible\xa0;', '- Composant d’interface pour lequel l’apparence est gérée par les styles natifs du navigateur sans aucune modification par l’auteur (par exemple, le style au focus natif dans Chrome ou Firefox)\xa0;', '- Composant d’interface pour lequel la couleur n’est pas nécessaire pour identifier le composant ou son état (par exemple, un groupe de liens faisant office de navigation dont la position dans la page, la taille et la couleur du texte permettent de comprendre qu’il s’agit de liens même si la couleur du soulignement des liens avec le fond blanc n’a pas un ratio de 3:1 et que le texte lui a un ratio de 4.5:1)\xa0;', '- [Élément graphique ou parties d’élément graphique non porteur d’information ou ayant une alternative (description longue, informations identiques visibles dans la page)\xa0;', '- Élément graphique ou parties d’élément graphique faisant partie d’un logo ou du nom de marque d’un organisme ou d’une société\xa0;', '- Élément graphique ou parties d’élément graphique dont la présentation est essentielle à l’information véhiculée (par exemple, drapeaux, logotypes, photos de personnes ou de scènes, captures d’écran, diagrammes médicaux, carte de chaleurs)\xa0;', '- Élément graphique ou parties d’élément graphique dynamiques dont le contraste au survol / focus est suffisant.']}

---

## Test 3.3.1

Dans chaque page web, le rapport de contraste entre les couleurs d’un composant d’interface dans ses différents états et la couleur d’arrière-plan contiguë vérifie-t-il une de ces conditions (hors cas particuliers) ?

- Le rapport de contraste est de 3:1, au moins ;
- Un mécanisme permet un rapport de contraste de 3:1, au moins.

**Méthodologie :**

1. Retrouver dans le document les composants d’interface qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces composants, vérifier que :
 - Soit le rapport de contraste entre les couleurs du composant dans ses différents états et la couleur d’arrière-plan contiguë est de 3:1, au moins ;
 - Soit un mécanisme permet à l’utilisateur d’afficher le composant avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque composant, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#3.3.1_

---

## Test 3.3.2

Dans chaque page web, le rapport de contraste des différentes couleurs composant un élément graphique, lorsqu’elles sont nécessaires à sa compréhension, et la couleur d’arrière-plan contiguë, vérifie-t-il une de ces conditions (hors cas particuliers) ?

- Le rapport de contraste est de 3:1, au moins ;
- Un mécanisme permet un rapport de contraste de 3:1, au moins.

**Méthodologie :**

1. Retrouver dans le document les éléments graphiques qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces éléments, vérifier que :
 - Soit le rapport de contraste entre les couleurs de l’élément graphique nécessaires à sa compréhension et la couleur d’arrière-plan contiguë est de 3:1, au moins ;
 - Soit un mécanisme permet à l’utilisateur d’afficher l’élément graphique avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque composant, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#3.3.2_

---

## Test 3.3.3

Dans chaque page web, le rapport de contraste des différentes couleurs contiguës entre elles d’un élément graphique, lorsqu’elles sont nécessaires à sa compréhension, vérifie-t-il une de ces conditions (hors cas particuliers) ?

- Le rapport de contraste est de 3:1, au moins ;
- Un mécanisme permet un rapport de contraste de 3:1, au moins.

**Méthodologie :**

1. Retrouver dans le document les éléments graphiques qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces éléments, vérifier que :
 - Soit le rapport de contraste des différentes couleurs contiguës de l’élément graphique entre elles, lorsqu’elles sont nécessaires à sa compréhension, est de 3:1, au moins ;
 - Soit un mécanisme permet à l’utilisateur d’afficher l’élément graphique avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque élément graphique, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#3.3.3_

---

## Test 3.3.4

Dans le mécanisme qui permet d’afficher un rapport de contraste conforme, les couleurs du composant ou des éléments graphiques porteurs d’informations qui le composent, sont-elles suffisamment contrastées ?

**Méthodologie :**

1. Retrouver dans le document les mécanismes qui permettent d’afficher un rapport de contraste conforme ;
2. Pour chacun de ces mécanismes, vérifier que le rapport de contraste entre les couleurs du composant ou des éléments graphiques porteurs d’informations qui le composent est suffisamment élevé ;
3. Si c’est le cas pour chaque mécanisme, **le test est validé**.

Note : le critère est non applicable dans ces situations :

- Composant d'interface inactif (par exemple, un bouton avec un attribut `disabled`) sur lequel aucune action n'est possible ;
- Composant d'interface pour lequel l'apparence est gérée par les styles natifs du navigateur sans aucune modification par l'auteur (par exemple, le style au focus natif dans Chrome ou Firefox) ;
- Composant d'interface pour lequel la couleur n'est pas nécessaire pour identifier le composant ou son état (par exemple, un groupe de liens faisant office de navigation dont la position dans la page, la taille et la couleur du texte permettent de comprendre qu'il s'agit de liens même si la couleur du soulignement des liens avec le fond blanc n'a pas un ratio de 3:1 et que le texte lui a un ratio de 4.5:1) ;
- Élément graphique ou parties d'élément graphique non porteur d'information ou ayant une alternative (description longue, informations identiques visibles dans la page) ;
- Élément graphique ou parties d'élément graphique faisant partie d'un logo ou du nom de marque d'un organisme ou d'une société ;
- Élément graphique ou parties d'élément graphique dont la présentation est essentielle à l'information véhiculée (exemple drapeaux, logotypes, photos de personnes ou de scènes, captures d'écran, diagrammes médicaux, carte de chaleurs) ;
- Élément graphique ou parties d'élément graphique dynamiques dont le contraste au survol / focus est suffisant.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#3.3.4_

---
