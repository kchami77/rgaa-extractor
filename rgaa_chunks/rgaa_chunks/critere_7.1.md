---
critere_id: "7.1"
thematique: "Scripts"
thematique_id: 7
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.1"
nb_tests: 3
---

# Critère 7.1 — Scripts

**Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.1_

**Cas particuliers :**

- Il existe une gestion de cas particuliers pour le test 7.1.3 lorsque :
- {'ul': ['- La ponctuation et les lettres majuscules sont présentes dans le texte de l’intitulé visible : elles peuvent être ignorées dans le nom accessible sans porter à conséquence\xa0;', '- Le texte de l’intitulé visible sert de symbole : le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).']}
- Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).

**Notes techniques :**

- Le critère 7.1 implémente la notion de « compatible avec les technologies d’assistance » telle que définie par les WCAG, ainsi que le recours à WAI-ARIA pour rendre un composant ou une fonctionnalité accessible. Le bon usage de WAI-ARIA est vérifié via les tests 7.1.1, 7.1.2, 7.1.3.
- Note importante : dans un environnement HTML5, beaucoup de composants peuvent nécessiter JavaScript pour fonctionner ; en conséquence la fourniture d’une alternative à un composant JavaScript qui ne pourrait pas être rendu accessible devra bénéficier d’une méthode spécifique au composant en cause, permettant de le remplacer par une alternative accessible (et de le réactiver). Cela signifie que la désactivation de JavaScript pour l’ensemble de la page ne sera pas acceptée comme une méthode valable, à moins qu’elle ne remette pas en cause l’utilisation des autres composants.

---

## Test 7.1.1

Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il, si nécessaire, une de ces conditions ?

- Le nom, le rôle, la valeur, le paramétrage et les changements d’états sont accessibles aux technologies d’assistance via une API d’accessibilité ;
- Un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités est présent dans la page ;
- Une alternative accessible permet d’accéder aux mêmes fonctionnalités.

**Méthodologie :**

1. Retrouver dans le document tous les composants d’interface générés ou contrôlés au moyen de JavaScript ;
2. Vérifier que :
 - Le composant possède un rôle cohérent avec son usage (généralement un bouton ou un lien) ;
 - Le composant possède un nom explicite ;
 - Le nom du composant est cohérent avec l’état de la fonctionnalité ou des contenus contrôlés (par exemple pour une fonctionnalité permettant d’afficher ou de masquer une zone de contenu).
3. Sinon, vérifier la présence d’un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités ;
4. Sinon, vérifier la présence d’une alternative accessible permettant d’accéder aux mêmes fonctionnalités.
5. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.1.1_

---

## Test 7.1.2

Chaque script qui génère ou contrôle un composant d’interface respecte-t-il une de ces conditions ?

- Le composant d’interface est correctement restitué par les technologies d’assistance ;
- Une alternative accessible permet d’accéder aux mêmes fonctionnalités.

**Méthodologie :**

1. Pour chacun des composants d’interface ayant validé le test 7.1.1, vérifier que le composant d’interface est correctement restitué par les technologies d’assistance ;
2. Sinon, vérifier qu’une alternative accessible au composant d’interface permet d’accéder aux mêmes fonctionnalités ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.1.2_

---

## Test 7.1.3

Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il ces conditions (hors cas particuliers) ?

- Le composant possède un nom pertinent ;
- Le nom accessible du composant contient au moins l’intitulé visible ;
- Le composant possède un rôle pertinent.

**Méthodologie :**

1. Pour chacun des composants d’interface ayant validé le test 7.1.1, vérifier que le composant d’interface possède :
 - Un nom pertinent (intitulé visible) ;
 - Un rôle pertinent.
2. Si le composant d’interface possède un nom accessible, vérifier que ce nom est pertinent et contient au moins l’intitulé visible.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.1.3_

---
