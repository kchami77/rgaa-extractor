---
critere_id: "1.2"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2"
nb_tests: 6
---

# Critère 1.2 — Images

**Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2_

**Notes techniques :**

- Lorsqu'une image est associée à une légende, la note technique WCAG recommande de prévoir systématiquement une alternative textuelle (cf. critère 1.9). Dans ce cas le critère 1.2 est non applicable.
- Dans le cas d'une image vectorielle (balise `<svg>`) de décoration qui serait affichée au travers d'un élément `<use href="…">` enfant de l'élément `<svg>`, le test 1.2.4 s'appliquera également à l'élément `<svg>` associée par le biais de l'élément `<use>`.
- Un attribut WAI-ARIA `role="presentation"` peut être utilisé sur les images de décoration et les zones non cliquables de décoration. Le rôle `"none"` introduit en ARIA 1.1 et synonyme du rôle `"presentation"` peut être aussi utilisé. Il reste préférable cependant d'utiliser le rôle `"presentation"` en attendant un support satisfaisant du rôle `"none"`.

---

## Test 1.2.1

Chaque image (balise `<img>`) de décoration, sans légende, vérifie-t-elle une de ces conditions ?

- La balise `<img>` possède un attribut `alt` vide (`alt=""`) et est dépourvue de tout autre attribut permettant de fournir une alternative textuelle ;
- La balise `<img>` possède un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.

**Méthodologie :**

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<img>` ;
2. Pour chaque image, vérifier que l’image ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’elle possède :
 - Soit un attribut `alt` vide (`alt=""`) ;
 - Soit un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2.1_

---

## Test 1.2.2

Chaque zone non cliquable (balise `<area>` sans attribut `href`) de décoration, vérifie-t-elle une de ces conditions ?

- La balise `<area>` possède un attribut `alt` vide (`alt=""`) et est dépourvue de tout autre attribut permettant de fournir une alternative textuelle ;
- La balise `<area>` possède un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.

**Méthodologie :**

1. Retrouver dans le document les images décoratives structurées au moyen d’un élément `<area>` (sans attribut `href`) ;
2. Pour chaque image, vérifier que l’élément `<area>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’il possède :
 - Soit un attribut `alt` vide (`alt=""`) ;
 - Soit un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2.2_

---

## Test 1.2.3

Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) de décoration, sans légende, vérifie-t-elle ces conditions ?

- La balise `<object>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
- La balise `<object>` est dépourvue d’alternative textuelle ;
- Il n’y a aucun texte faisant office d’alternative textuelle entre `<object>` et `</object>`.

**Méthodologie :**

1. Retrouver dans le document les images décoratives structurées dépourvues de légende au moyen d’un élément `<object>` (avec un attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que la balise ouvrante `<object>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’elle :
 - Possède un attribut WAI-ARIA `aria-hidden="true"` ;
 - Et est dépourvue d’alternative textuelle ;
 - Et est dépourvue d’un contenu alternatif présent entre les balises `<object>` et `</object>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2.3_

---

## Test 1.2.4

Chaque image vectorielle (balise `<svg>`) de décoration, sans légende, vérifie-t-elle ces conditions ?

- La balise `<svg>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
- La balise `<svg>` et ses enfants sont dépourvus d’alternative textuelle ;
- Les balises `<title>` et `<desc>` sont absentes ou vides ;
- La balise `<svg>` et ses enfants sont dépourvus d’attribut `title`.

**Méthodologie :**

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<svg>` ;
2. Pour chaque image, vérifier que l’élément `<svg>` ne possède pas d’attributs `aria-labelledby` ou `aria-label` et qu’il :
 - Possède un attribut WAI-ARIA `aria-hidden="true"` ;
 - Et est dépourvu d’alternative textuelle (ainsi que ses éléments enfants) ;
 - Et ne contient pas d’éléments `<title>` et `<desc>` à moins que vides de contenu ;
 - Et est dépourvu d’attribut `title` (ainsi que ses éléments enfants).
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2.4_

---

## Test 1.2.5

Chaque image bitmap (balise `<canvas>`) de décoration, sans légende, vérifie-t-elle ces conditions ?

- La balise `<canvas>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
- La balise `<canvas>` et ses enfants sont dépourvus d’alternative textuelle ;
- Il n’y a aucun texte faisant office d’alternative textuelle entre `<canvas>` et `</canvas>`.

**Méthodologie :**

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<canvas>` ;
2. Pour chaque image, vérifier que l’élément `<canvas>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’il :
 - Possède un attribut WAI-ARIA `aria-hidden="true"` ;
 - Et est dépourvu d’alternative textuelle ;
 - Et est dépourvu d’un contenu alternatif présent entre les balises `<canvas>` et `</canvas>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2.5_

---

## Test 1.2.6

Chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) de décoration, sans légende, vérifie-t-elle ces conditions ?

- La balise `<embed>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
- La balise `<embed>` et ses enfants sont dépourvus d’alternative textuelle.

**Méthodologie :**

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<embed>` (avec un attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que l’élément `<embed>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’il :
 - Possède un attribut WAI-ARIA `aria-hidden="true"` ;
 - Et est dépourvu d’alternative textuelle ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.2.6_

---
