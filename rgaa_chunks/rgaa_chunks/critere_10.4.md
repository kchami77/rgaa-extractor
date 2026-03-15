---
critere_id: "10.4"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.4"
nb_tests: 2
---

# Critère 10.4 — Présentation de l’information

**Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200 %, au moins (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.4_

**Cas particuliers :**

- Font exception à ce critère, les contenus pour lesquels l’utilisateur n’a pas de possibilité de personnalisation :
- {'ul': ['- Les sous-titres incrustés dans une vidéo\xa0;', '- Les textes en image\xa0;', '- Le texte au sein d’une balise `<canvas>`.']}

---

## Test 10.4.1

Dans chaque page web, l’augmentation de la taille des caractères jusqu’à 200 %, au moins, ne doit pas provoquer de perte d’information. Cette règle est-elle respectée selon une de ces conditions (hors cas particuliers) ?

- Lors de l’utilisation de la fonction d’agrandissement du texte du navigateur ;
- Lors de l’utilisation des fonctions de zoom graphique du navigateur ;
- Lors de l’utilisation d’un composant d’interface propre au site permettant d’agrandir le texte ou de zoomer.

**Méthodologie :**

1. Vérifier dans le document si les textes restent présents et lisibles lorsque :
 - Le zoom texte du navigateur est réglé à 200% ;
 - Le zoom graphique du navigateur est réglé à 200% ;
 - Les fonctionnalités de zoom personnalisées proposé par le document sont utilisés.
2. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.4.1_

---

## Test 10.4.2

Dans chaque page web, l’augmentation de la taille des caractères jusqu’à 200 %, au moins, doit être possible pour l’ensemble du texte dans la page. Cette règle est-elle respectée selon une de ces conditions (hors cas particuliers) ?

- Lors de l’utilisation de la fonction d’agrandissement du texte du navigateur ;
- Lors de l’utilisation des fonctions de zoom graphique du navigateur ;
- Lors de l’utilisation d’un composant d’interface propre au site permettant d’agrandir le texte ou de zoomer.

**Méthodologie :**

1. Vérifier dans le document si les textes sont effectivement agrandis lorsque :
 - Le zoom texte du navigateur est réglé à 200% ;
 - Le zoom graphique du navigateur est réglé à 200% ;
 - Les fonctionnalités de zoom personnalisées proposé par le document sont utilisés.
2. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.4.2_

---
