---
critere_id: "1.7"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7"
nb_tests: 6
---

# Critère 1.7 — Images

**Pour chaque image porteuse d’information ayant une description détaillée, cette description est-elle pertinente ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7_

---

## Test 1.7.1

Chaque image (balise `<img>`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

- La description détaillée via l’adresse référencée dans l’attribut `longdesc` est pertinente ;
- La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
- La description détaillée via un lien ou un bouton adjacent est pertinente ;
- Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` qui possèdent une description détaillée ;
2. Pour chaque image, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7.1_

---

## Test 1.7.2

Chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) porteur d’information, ayant une description détaillée, vérifie-t-il ces conditions ?

- La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
- La description détaillée via un lien ou un bouton adjacent est pertinente ;
- Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` qui possèdent une description détaillée ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7.2_

---

## Test 1.7.3

Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

- La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
- La description détaillée adjacente à l’image objet est pertinente ;
- La description détaillée via un lien ou un bouton adjacent est pertinente ;
- Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"` qui possèdent une description détaillée ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7.3_

---

## Test 1.7.4

Chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

- La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
- La description détaillée adjacente à l’image embarquée est pertinente ;
- La description détaillée via un lien ou un bouton adjacent est pertinente ;
- Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"` qui possèdent une description détaillée ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7.4_

---

## Test 1.7.5

Chaque image vectorielle (balise `<svg>`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

- La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
- La description détaillée dans la page et signalée par le texte contenu dans la balise `<desc>` ou `<title>` est pertinente ;
- La description détaillée adjacente contenue dans la balise `<desc>` est pertinente ;
- La description détaillée via un lien ou un bouton adjacent est pertinente ;
- Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<svg>` qui possèdent une description détaillée ;
2. Pour chaque élément `<svg>`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7.5_

---

## Test 1.7.6

Chaque image bitmap (balise `<canvas>`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

- La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
- La description détaillée dans la page et signalée par le texte contenu entre `<canvas>` et `</canvas>` est pertinente ;
- La description détaillée contenue entre `<canvas>` et `</canvas>` est pertinente ;
- La description détaillée adjacente à l’image bitmap est pertinente ;
- La description détaillée via un lien ou un bouton adjacent est pertinente ;
- Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` qui possèdent une description détaillée ;
2. Pour chaque élément `<canvas>`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.7.6_

---
