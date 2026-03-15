---
critere_id: "10.1"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.1"
nb_tests: 3
---

# Critère 10.1 — Présentation de l’information

**Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.1_

---

## Test 10.1.1

Dans chaque page web, les balises servant à la présentation de l’information ne doivent pas être présentes dans le code source généré des pages. Cette règle est-elle respectée ?

**Méthodologie :**

1. Vérifier l’absence des éléments de présentation `<basefont>`, `<big>`, `<blink>`, `<center>`, `<font>`, `<marquee>`, `<s>`, `<strike>`, `<tt>` ;
2. Vérifier l’absence de l’élément `<u>` uniquement si le DOCTYPE du document ne correspond pas à HTML 5 ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.1.1_

---

## Test 10.1.2

Dans chaque page web, les attributs servant à la présentation de l’information ne doivent pas être présents dans le code source généré des pages. Cette règle est-elle respectée ?

**Méthodologie :**

1. Vérifier l’absence des attributs de présentation : `align`, `alink`, `background`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, `char`, `charoff`, `clear`, `color`, `compact`, `frameborder`, `hspace`, `link`, `marginheight`, `marginwidth`, `text`, `valign`, `vlink`, `vspace`, `size`(exception faite de l'élément `<select>`), `width` (exception faite des éléments `<img>`, `<object>`, `<embed>`, `<canvas>` et `<svg>`), `height` (exception faite des éléments `<img>`, `<object>`, `<embed>`, `<canvas>` et `<svg>`) ;
2. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.1.2_

---

## Test 10.1.3

Dans chaque page web, l’utilisation des espaces vérifie-t-elle ces conditions ?

- Les espaces ne sont pas utilisées pour séparer les lettres d’un mot ;
- Les espaces ne sont pas utilisées pour simuler des tableaux ;
- Les espaces ne sont pas utilisées pour simuler des colonnes de texte.

**Méthodologie :**

1. Désactiver les styles (CSS) du document ;
2. Vérifier l’absence d’espaces utilisées :
 - Entre les lettres d’un mot ;
 - Pour créer des effets de marges ou d’alignement ;
 - Pour simuler des tableaux ou des colonnes.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.1.3_

---
