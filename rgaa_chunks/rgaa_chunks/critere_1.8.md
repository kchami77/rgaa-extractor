---
critere_id: "1.8"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8"
nb_tests: 6
---

# Critère 1.8 — Images

**Chaque image texte porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8_

**Cas particuliers :**

- Pour ce critère, il existe une gestion de cas particulier lorsque le texte fait partie du logo, d’une dénomination commerciale, d’un CAPTCHA, d’une image-test ou d’une image dont l’exactitude graphique serait considérée comme essentielle à la bonne transmission de l’information véhiculée par l’image. Dans ces situations, le critère est non applicable pour ces éléments.

**Notes techniques :**

- Le texte dans les images vectorielles étant du texte réel, il n’est pas concerné par ce critère.

---

## Test 1.8.1

Chaque image texte (balise `<img>` ou possédant un attribut WAI-ARIA `role="img"`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les images texte structurées au moyen d’un élément `<img>` (ou d’un élément possédant l’attribut WAI-ARIA `role="img"`) ;
2. Pour chaque image, vérifier que :
 - Soit il existe un mécanisme de remplacement ;
 - Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8.1_

---

## Test 1.8.2

Chaque bouton « image texte » (balise `<input>` avec l’attribut `type="image"`) porteur d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacé par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les boutons “images texte” (élément `<input>` avec l’attribut `type="image"`) ;
2. Pour chaque image, vérifier que :
 - Soit il existe un mécanisme de remplacement ;
 - Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8.2_

---

## Test 1.8.3

Chaque image texte objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les images texte objet (élément `<object>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
 - Soit il existe un mécanisme de remplacement ;
 - Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8.3_

---

## Test 1.8.4

Chaque image texte embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les images texte embarquées (élément `<embed>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
 - Soit il existe un mécanisme de remplacement ;
 - Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8.4_

---

## Test 1.8.5

Chaque image texte bitmap (balise `<canvas>`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les images texte bitmap (élément `<canvas>`) ;
2. Pour chaque image, vérifier que :
 - Soit il existe un mécanisme de remplacement ;
 - Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8.5_

---

## Test 1.8.6

Chaque image texte SVG (balise `<svg>`) porteuse d’information et dont le texte n’est pas complètement structuré au moyen d’éléments `<text>`, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les images texte vectorielle (élément `<svg>`) porteuse d’information et dont le texte n’est pas complètement structuré au moyen d’éléments `<text>` ;
2. Pour chaque image, vérifier que :
 - Soit il existe un mécanisme de remplacement ;
 - Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.8.6_

---
