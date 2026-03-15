---
critere_id: "11.2"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2"
nb_tests: 6
---

# Critère 11.2 — Formulaires

**Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2_

**Cas particuliers :**

- Il existe une gestion de cas particuliers pour le test 11.2.5 lorsque :
- {'ul': '- La ponctuation et les lettres majuscules sont présentes dans le texte de l’[intitulé visible : elles peuvent être ignorées dans le nom accessible sans porter à conséquence\xa0;', '- Le texte de l’intitulé visible sert de symbole\xa0: le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).']}
- Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).
- Ce cas particulier s’applique également au test 11.9.2.

---

## Test 11.2.1

Chaque balise `<label>` permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un élément `<label>` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2.1_

---

## Test 11.2.2

Chaque attribut `title` permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut `title` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2.2_

---

## Test 11.2.3

Chaque étiquette implémentée via l’attribut WAI-ARIA `aria-label` permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA `aria-label` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2.3_

---

## Test 11.2.4

Chaque passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA `aria-labelledby` ;
2. Pour chaque champ de formulaire, vérifier que le contenu du passage de texte référencé est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2.4_

---

## Test 11.2.5

Chaque champ de formulaire ayant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` du champ de formulaire contient au moins l’intitulé visible ;
- S’il est présent, le passage de texte lié au champ de formulaire via un attribut WAI-ARIA `aria-labelledby` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut `title` du champ de formulaire contient au moins l’intitulé visible ;
- S’il est présent le contenu de la balise `<label>` associé au champ de formulaire contient au moins l’intitulé visible.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie à la fois par un intitulé visible et par le contenu soit d’un élément `<label>`, soit d’un attribut `title` ou d’un attribut `aria-label` ou d’un attribut `aria-labelledby` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément `<label>` ou de l’attribut `title` ou de l’attribut `aria-label` ou de l’attribut `aria-labelledby` contient l’intitulé visible ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2.5_

---

## Test 11.2.6

Chaque bouton adjacent au champ de formulaire qui fournit une étiquette visible permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette visible est fournie par un bouton adjacent ;
2. Pour chaque champ de formulaire, vérifier que le contenu visible du bouton est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.2.6_

---
