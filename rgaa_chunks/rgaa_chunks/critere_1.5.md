---
critere_id: "1.5"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.5"
nb_tests: 2
---

# Critère 1.5 — Images

**Pour chaque image utilisée comme CAPTCHA, une solution d’accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.5_

---

## Test 1.5.1

Chaque image (balises `<img>`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou possédant un attribut WAI-ARIA `role="img"`) utilisée comme CAPTCHA vérifie-t-elle une de ces conditions ?

- Il existe une autre forme de CAPTCHA non graphique, au moins ;
- Il existe une autre solution d’accès à la fonctionnalité qui est sécurisée par le CAPTCHA.

**Méthodologie :**

1. Retrouver dans le document les images (éléments `<img>`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou possédant un attribut WAI-ARIA `role="img"`) utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque image, vérifier qu’il existe :
 - Soit une autre forme de CAPTCHA non graphique, au moins ;
 - Soit une autre solution d’accès à la fonctionnalité qui est sécurisée par le CAPTCHA.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.5.1_

---

## Test 1.5.2

Chaque bouton associé à une image (balise `input` avec l’attribut `type="image"`) utilisée comme CAPTCHA vérifie-t-il une de ces conditions ?

- Il existe une autre forme de CAPTCHA non graphique, au moins ;
- Il existe une autre solution d’accès à la fonctionnalité sécurisée par le CAPTCHA.

**Méthodologie :**

1. Retrouver dans le document les boutons associés à une image (éléments `<input>` avec l’attribut `type="image"`) utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque bouton associé à une image, vérifier qu’il existe :
 - Soit une autre forme de CAPTCHA non graphique, au moins ;
 - Soit une autre solution d’accès à la fonctionnalité qui est sécurisée par le CAPTCHA.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.5.2_

---
