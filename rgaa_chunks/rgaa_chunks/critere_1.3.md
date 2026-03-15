---
critere_id: "1.3"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3"
nb_tests: 9
---

# Critère 1.3 — Images

**Pour chaque image porteuse d’information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3_

**Cas particuliers :**

- Il existe une gestion de cas particuliers lorsque l’image est utilisée comme CAPTCHA ou comme image-test. Dans cette situation, où il n’est pas possible de donner une alternative pertinente sans détruire l’objet du CAPTCHA ou du test, le critère est non applicable.
- Note : le cas des CAPTCHA et des images-test est traité de manière spécifique par le critère 1.4.

---

## Test 1.3.1

Chaque image (balise `<img>` ou balise possédant l’attribut WAI-ARIA `role="img"`) porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` (ou d’un élément possédant l’attribut WAI-ARIA `role="img"`) pourvues d’une alternative textuelle ;
2. Pour chaque image, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.1_

---

## Test 1.3.2

Pour chaque zone (balise `<area>`) d’une image réactive porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<area>` pourvus d’une alternative textuelle ;
2. Pour chaque élément `<area>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.2_

---

## Test 1.3.3

Pour chaque bouton de type `image` (balise `<input>` avec l’attribut `type="image"`), ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` et d’une alternative textuelle ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.3_

---

## Test 1.3.4

Pour chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent le contenu alternatif est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.4_

---

## Test 1.3.5

Pour chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent le contenu alternatif est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.5_

---

## Test 1.3.6

Pour chaque image vectorielle (balise `<svg>`) porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l'élément `<title>` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<svg>` pourvus d’une alternative textuelle ;
2. Pour chaque élément `<svg>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.6_

---

## Test 1.3.7

Pour chaque image bitmap (balise `<canvas>`) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent le contenu alternatif est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` pourvus d’une alternative textuelle ;
2. Pour chaque élément `<canvas>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.7_

---

## Test 1.3.8

Pour chaque image bitmap (balise `<canvas>`) porteuse d’information et ayant un contenu alternatif entre `<canvas>` et `</canvas>`, ce contenu alternatif est-il correctement restitué par les technologies d’assistance ?

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` pourvus d’un contenu alternatif entre les balises `<canvas>` et `</canvas>` ;
2. Pour chaque élément `<canvas>`, vérifier que le contenu alternatif est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.8_

---

## Test 1.3.9

Pour chaque image porteuse d’information et ayant une alternative textuelle, l’alternative textuelle est-elle courte et concise (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les images pourvues d’une alternative textuelle ;
2. Pour chaque image, vérifier l’alternative textuelle est courte et concise ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.3.9_

---
