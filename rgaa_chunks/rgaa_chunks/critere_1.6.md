---
critere_id: "1.6"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6"
nb_tests: 10
---

# Critère 1.6 — Images

**Chaque image porteuse d’information a-t-elle, si nécessaire, une description détaillée ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6_

**Notes techniques :**

- Dans le cas du SVG, le manque de support de l’élément `<title>` et `<desc>` par les technologies d’assistance crée une difficulté dans le cas de l’implémentation de l’alternative textuelle de l’image et de sa description détaillée. Dans ce cas, il est recommandé d’utiliser l’attribut WAI-ARIA `aria-label` pour implémenter à la fois l’alternative textuelle courte et la référence à la description détaillée adjacente ou l’attribut WAI-ARIA `aria-labelledby` pour associer les passages de texte faisant office d’alternative courte et de description détaillée.
- L’utilisation de l’attribut WAI-ARIA aria-describedby n’est pas recommandée pour lier une image (`<img>`, `<object>`, `<embed>`, `<canvas>`) à sa description détaillée, par manque de support des technologies d’assistance. Néanmoins, lorsqu’il est utilisé, l’attribut devra nécessairement faire référence à l’`id` de la zone contenant la description détaillée.
- La description détaillée adjacente peut être implémentée via une balise `<figcaption>`, dans ce cas le critère 1.9 doit être vérifié (utilisation de `<figure>` et des attributs WAI-ARIA `role="figure"` et `aria-label`, notamment).
- L'attribut `longdesc` qui constitue une des conditions du test 1.6.1 (et dont la pertinence est vérifiée avec le test 1.7.1) est désormais considéré comme obsolète par la spécification HTML en cours. La vérification de cet attribut ne sera donc requise que pour les versions de la spécification HTML antérieure à HTML 5.

---

## Test 1.6.1

Chaque image (balise `<img>`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

- Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
- Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
- Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` (ou d’un élément possédant l’attribut WAI-ARIA `role="img"`) porteuses d’information qui nécessitent une description détaillée ;
2. Pour chaque image, vérifier qu’il existe :
 - Soit un attribut longdesc qui donne l’adresse (url) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
 - Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.1_

---

## Test 1.6.2

Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

- Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
- Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
- Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"`, porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier qu’il existe :
 - Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la descript on détaillée.
3. Si c’est le cas pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.2_

---

## Test 1.6.3

Chaque image embarquée (balise `<embed>`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

- Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
- Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
- Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"`, porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier qu’il existe :
 - Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.3_

---

## Test 1.6.4

Chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) porteur d’information, qui nécessite une description détaillée, vérifie-t-il une de ces conditions ?

- Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
- Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
- Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"`, porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier qu’il existe :
 - Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée ;
 - Soit un attribut WAI-ARIA aria-describedby associant un passage de texte faisant office de description détaillée.
3. Si c’est le cas pour chaque élément `<input>` pourvu de l’attribut `type="image"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.4_

---

## Test 1.6.5

Chaque image vectorielle (balise `<svg>`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

- Il existe un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
- Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
- Il existe un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
- Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les éléments `<svg>` porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<svg>`, vérifier qu’il existe :
 - Soit un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
 - Soit un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
 - Soit un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<svg>`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.5_

---

## Test 1.6.6

Pour chaque image vectorielle (balise `<svg>`) porteuse d’information, ayant une description détaillée, la référence éventuelle à la description détaillée dans l’attribut WAI-ARIA `aria-label` et la description détaillée associée par l’attribut WAI-ARIA `aria-labelledby` ou `aria-describedby` sont-elles correctement restituées par les technologies d’assistance ?

**Méthodologie :**

1. Retrouver dans le document les éléments `<svg>` porteurs d’information dont la description détaillée est fournie au moyen d’un attribut `aria-label`, `aria-labelledby` ou `aria-describedby` ;
2. Pour chaque élément `<svg>`, vérifier que le contenu de la description détaillée est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque élément `<svg>`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.6_

---

## Test 1.6.7

Chaque image bitmap (balise `<canvas>`), porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

- Il existe un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
- Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
- Il existe un contenu textuel entre `<canvas>` et `</canvas>` faisant référence à une description détaillée adjacente à l’image bitmap ;
- Il existe un contenu textuel entre `<canvas>` et `</canvas>` faisant office de description détaillée ;
- Il existe un lien ou bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<canvas>`, vérifier qu’il existe :
 - Soit un attribut WAI-ARIA aria-label contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
 - Soit un attribut WAI-ARIA aria-labelledby associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
 - Soit un contenu textuel entre `<canvas>` et `</canvas>` faisant référence à une description détaillée adjacente à l’image bitmap ;
 - Soit un contenu textuel entre `<canvas>` et `</canvas>` faisant office de description détaillée ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<canvas>`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.7_

---

## Test 1.6.8

Pour chaque image bitmap (balise `<canvas>`) porteuse d’information, qui implémente une référence à une description détaillée adjacente, cette référence est-elle correctement restituée par les technologies d’assistance ?

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` porteurs d’information dont la description détaillée est fournie au moyen d’un attribut `aria-label`, `aria-labelledby` ou `aria-describedby` ;
2. Pour chaque élément `<canvas>`, vérifier que le contenu de la description détaillée est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque élément `<canvas>`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.8_

---

## Test 1.6.9

Pour chaque image (balise `<img>`, `<input>` avec l’attribut `type="image"`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>`, ou possédant un attribut WAI-ARIA `role="img"`) porteuse d’information, qui est accompagnée d’une description détaillée et qui utilise un attribut WAI-ARIA `aria-describedby`, l’attribut WAI-ARIA `aria-describedby` associe-t-il la description détaillée ?

**Méthodologie :**

1. Retrouver dans le document les images (éléments `<img>`, `<input>` avec l’attribut `type="image"`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou possédant un attribut WAI-ARIA `role="img"`) porteuses d’information dont la description détaillée utilise un attribut WAI-ARIA `aria-describedby` ;
2. Pour chaque image, vérifier que le contenu de la description détaillée est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.9_

---

## Test 1.6.10

Chaque balise possédant un attribut WAI-ARIA `role="img"` porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

- Il existe un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
- Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
- Il existe un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
- Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

**Méthodologie :**

1. Retrouver dans le document les éléments pourvu d’un attribut WAI-ARIA `role="img"` porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `role="img"`, vérifier qu’il existe :
 - Soit un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
 - Soit un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
 - Soit un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
 - Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `role="img"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.6.10_

---
