---
critere_id: "7.3"
thematique: "Scripts"
thematique_id: 7
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.3"
nb_tests: 2
---

# Critère 7.3 — Scripts

**Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.3_

**Cas particuliers :**

- Il existe une gestion de cas particuliers lorsque la fonctionnalité dépend de l’utilisation d’un gestionnaire d’événement sans équivalent universel ; par exemple, une application de dessin à main levée ne pourra pas être rendue contrôlable au clavier. Dans ces situations, le critère est non applicable.

---

## Test 7.3.1

Chaque élément possédant un gestionnaire d’événement contrôlé par un script vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’élément est accessible par le clavier et tout dispositif de pointage ;
- Un élément accessible par le clavier et tout dispositif de pointage permettant de réaliser la même action est présent dans la page.

**Méthodologie :**

1. Retrouver dans le document, tous les éléments sur lesquels est implémenté un gestionnaire d’événements JavaScript (par exemple click, focus, mouseover, blur, keydown, touch, …).
2. Vérifier que l’élément est accessible au moyen du clavier :
 - Il est atteignable avec la touche de tabulation (tab) ;
 - Si l’élément gère une action simple, il est activable au clavier avec la touche entrée (Entrée) ;
 - Si l’élément gère une action complexe, il est utilisable avec le clavier (généralement avec les touches de direction).
3. Sinon, vérifier qu’un élément accessible par le clavier permettant de réaliser la même action est présent dans la page.
4. Vérifier que l’élément est accessible par tout dispositif de pointage (souris, toucher, stylet, …).
5. Sinon, vérifier qu’un élément accessible au moyen d’un dispositif de pointage et permettant de réaliser la même action est présent dans la page.
6. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.3.1_

---

## Test 7.3.2

Un script ne doit pas supprimer le focus d’un élément qui le reçoit. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Activer, l’un après l’autre, tous les éléments capables de recevoir le focus.
2. Vérifier que le focus n’est pas supprimé via une fonctionnalité JavaScript.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.3.2_

---
