---
critere_id: "1.4"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4"
nb_tests: 7
---

# Critère 1.4 — Images

**Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d’identifier la nature et la fonction de l’image ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4_

---

## Test 1.4.1

Pour chaque image (balise `<img>`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` pourvues d’une alternative textuelle et utilisées comme CAPTCHA ou comme image-test ;
2. Pour chaque image, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.1_

---

## Test 1.4.2

Pour chaque zone (balise `<area>`) d’une image réactive utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<area>` pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<area>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.2_

---

## Test 1.4.3

Pour chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) utilisé comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` et d’une alternative textuelle, et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.3_

---

## Test 1.4.4

Pour chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent le contenu alternatif est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle, et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.4_

---

## Test 1.4.5

Pour chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent le contenu alternatif est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle, et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.5_

---

## Test 1.4.6

Pour chaque image vectorielle (balise `<svg>`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<svg>` pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<svg>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.6_

---

## Test 1.4.7

Pour chaque image bitmap (balise `<canvas>`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?

- S’il est présent, le contenu de l’attribut `alt` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent ;
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent le contenu alternatif est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<canvas>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.4.7_

---
