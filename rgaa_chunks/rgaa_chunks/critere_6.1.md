---
critere_id: "6.1"
thematique: "Liens"
thematique_id: 6
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1"
nb_tests: 5
---

# Critère 6.1 — Liens

**Chaque lien est-il explicite (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1_

**Cas particuliers :**

- Il existe une gestion de cas particuliers pour les tests 6.1.1, 6.1.2, 6.1.3 et 6.1.4 lorsque le lien est ambigu pour tout le monde. Dans cette situation, où il n’est pas possible de rendre le lien explicite dans son contexte, le critère est non applicable.
- Il existe une gestion de cas particuliers pour le test 6.1.5 lorsque :
- {'ul': '- La ponctuation et les lettres majuscules sont présentes dans le texte de l’[intitulé visible\xa0: elles peuvent être ignorées dans le nom accessible sans porter à conséquence\xa0;', '- Le texte de l’intitulé visible sert de symbole\xa0: le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).']}
- Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).

**Notes techniques :**

- Lorsque l’intitulé visible est complété par une autre expression dans le nom accessible :
- {'ul': ['- WCAG insiste sur le placement de l’intitulé visible au début du nom accessible sans toutefois réserver l’exclusivité de cet emplacement\xa0;', '- WCAG considère comme un cas d’échec une correspondance non exacte de la chaîne de caractères de l’intitulé visible au sein du nom accessible.']}
- Par exemple, si l’on considère l’intitulé visible « Commander maintenant » complété dans le nom accessible par l’expression « produit X », on peut avoir les différents cas suivants :
- {'ul': ['- «\xa0Commander maintenant produit X\xa0» est valide (bonne pratique)\xa0;', '- «\xa0Produit X : commander maintenant\xa0» est valide\xa0;', '- «\xa0Commander produit X maintenant\xa0» est non valide.']}

---

## Test 6.1.1

Chaque lien texte vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
- L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

**Méthodologie :**

1. Retrouver dans le document les liens texte ;
2. Pour chaque lien texte, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
 - Soit l’intitulé du lien seul ;
 - Soit le contexte du lien.
3. Si c’est le cas pour chaque lien texte, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1.1_

---

## Test 6.1.2

Chaque lien image vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
- L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

**Méthodologie :**

1. Retrouver dans le document les liens image (lien avec pour contenu un élément `<img>` ou un élément ayant l’attribut WAI-ARIA `role="img"`, un élément `<area>` possédant un attribut `href`, un élément `<object>`, un élément `<canvas>` ou un élément `<svg>`) ;
2. Pour chaque lien image, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
 - Soit l’intitulé du lien seul, fourni par l’alternative textuelle de l’image ;
 - Soit le contexte du lien.
3. Si c’est le cas pour chaque lien image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1.2_

---

## Test 6.1.3

Chaque lien composite vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
- L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

**Méthodologie :**

1. Retrouver dans le document les liens composites (lien composé à la fois de contenu texte et d’éléments de type image) ;
2. Pour chaque lien composite, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
 - Soit l’intitulé du lien seul, fourni par la combinaison du contenu texte et de l’alternative textuelle de l’image ;
 - Soit le contexte du lien.
3. Si c’est le cas pour chaque lien composite, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1.3_

---

## Test 6.1.4

Chaque lien SVG vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
- L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

**Méthodologie :**

1. Retrouver dans le document les liens SVG (élément `<svg>` qui possède un élément `<a>` pourvu d’un attribut `xlink-href` (SVG 1.1) ou `href` (SVG 2)) ;
2. Pour chaque lien SVG, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
 - Soit l’intitulé du lien seul, fourni par le nom accessible de l’élément `<svg>` (résolu généralement à partir du contenu d’un élément `<text>`) ;
 - Soit le contexte du lien.
3. Si c’est le cas pour chaque lien SVG, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1.4_

---

## Test 6.1.5

Pour chaque lien ayant un intitulé visible, le nom accessible du lien contient-il au moins l’intitulé visible (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les liens autres que SVG dont le contenu est fourni à la fois par un intitulé visible et par le contenu soit d’un attribut title ou d’un attribut `aria-label` ou d’un attribut `aria-labelledby` ;
2. Pour chaque lien, vérifier que le contenu de l’attribut `title` ou de l’attribut `aria-label` ou de l’attribut `aria-labelledby` contient l’intitulé visible ;
3. Si c’est le cas pour chaque lien, **le test est validé** pour les liens autres que SVG.
4. Retrouver dans le document les liens SVG dont le contenu est fourni à la fois par un intitulé visible et par le contenu soit d’un attribut `aria-labelledby`, ou d’un attribut `aria-label` ou d’un élément title (enfant direct de l’élément `<svg>`) ou d’un attribut x-link:title (SVG 1.1) ou d’un ou plusieurs éléments `<text>`;
5. Pour chaque lien SVG, vérifier que le contenu de l’attribut `aria-labelledby` ou de l’attribut `aria-label` ou de l’élément `<title>` ou de l’attribut `x-link:title` ou d’un ou plusieurs éléments `<text>` contient l’intitulé visible ;
6. Si c’est le cas pour chaque lien SVG, **le test est validé** pour les liens SVG.
7. Si le test est validé à la fois pour les liens non SVG et pour les liens SVG, le test est globalement validé.

Note : considérant la détermination du nom accessible, il existe deux cas particuliers et une particularité liée aux expressions mathématiques :

- La ponctuation et les lettres majuscules présentes dans le texte de l’intitulé visible peuvent être ignorées dans le nom accessible sans porter à conséquence.
- Si le texte de l’intitulé visible sert de symbole, il ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, "B" au niveau d'un éditeur de texte aura pour nom accessible "Mettre en gras", le signe ">" en fonction du contexte signifiera "Suivant" ou "Lancer la vidéo"). Le cas des symboles mathématiques fait cependant exception (voir le point ci-dessous).
- Si l'étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d'étiquette au nom accessible (par exemple, "A>B"). Il est laissé à l'utilisateur le soin d'opérer la correspondance entre l'expression et ce qu'il doit épeler compte tenu de la connaissance qu'il a du fonctionnement de son logiciel de saisie vocale ("A plus grand que B" ou "A supérieur à B").

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#6.1.5_

---
