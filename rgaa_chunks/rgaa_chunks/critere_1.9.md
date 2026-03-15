---
critere_id: "1.9"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9"
nb_tests: 5
---

# Critère 1.9 — Images

**Chaque légende d’image est-elle, si nécessaire, correctement reliée à l’image correspondante ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9_

**Notes techniques :**

- L’implémentation d’un attribut WAI-ARIA `role="group"` ou `role="figure"` sur l’élément parent `<figure>` est destiné à pallier le manque de support actuel des éléments `<figure>` par les technologies d’assistance. L’utilisation d’un élément `<figcaption>` pour associer une légende à une image impose au minimum l’utilisation d’un attribut WAI-ARIA `aria-label` sur l’élément parent `<figure>` dont le contenu sera identique au contenu de l’élément `<figcaption>`. Pour s’assurer d’un support optimal, il peut également être fait une association explicite entre le contenu de l’alternative textuelle de l’image et le contenu de l’élément `<figcaption>`, par exemple :
- `<img src="image.png" alt="Photo : soleil couchant" /><figcaption>Photo : crédit xxx</figcaption>`
- Les attributs WAI-ARIA `aria-labelledby` et `aria-describedby` ne peuvent pas être utilisés actuellement par manque de support par les technologies d’assistance.
- Note : les images légendées doivent par ailleurs respecter le critère 1.1 et le critère 1.3 relatifs aux images porteuses d’information.

---

## Test 1.9.1

Chaque image pourvue d’une légende (balise `<img>`, `<input>` avec l’attribut `type="image"` ou possédant un attribut WAI-ARIA `role="img"` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

- L’image (balise `<img>`, `<input>` avec l’attribut `type="image"` ou possédant un attribut WAI-ARIA `role="img"`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
- La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
- La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
- La légende est contenue dans une balise `<figcaption>`.

**Méthodologie :**

1. Retrouver dans le document les images pourvues d’une légende structurées au moyen d’élément `<img>`, d’un élément `<input>` avec l’attribut `type="image"` ou d’un élément possédant l’attribut WAI-ARIA `role="img"` ;
2. Pour chaque image, vérifier que :
 - L’image et sa légende sont contenues dans une balise `<figure>` ;
 - La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
 - La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
 - La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9.1_

---

## Test 1.9.2

Chaque image objet pourvue d’une légende (balise `<object>` avec l’attribut `type="image/…"` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

- L’image objet et sa légende adjacente sont contenues dans une balise `<figure>` ;
- La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
- La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
- La légende est contenue dans une balise `<figcaption>`.

**Méthodologie :**

1. Retrouver dans le document les images objet pourvues d’une légende (élément `<object>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
 - L’image et sa légende sont contenues dans une balise `<figure>` ;
 - La balise `<figure>` possède une propriété WAI-ARIA `role="figure`" ou `role="group"` ;
 - La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
 - La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9.2_

---

## Test 1.9.3

Chaque image embarquée pourvue d’une légende (balise `<embed>` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

- L’image embarquée (balise `<embed>`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
- La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
- La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
- La légende est contenue dans une balise `<figcaption>`.

**Méthodologie :**

1. Retrouver dans le document les images embarquées pourvues d’une légende (élément `<embed>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
 - L’image et sa légende sont contenues dans une balise `<figure>` ;
 - La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
 - La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
 - La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9.3_

---

## Test 1.9.4

Chaque image vectorielle pourvue d’une légende (balise `<svg>` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

- L’image vectorielle (balise `<svg>`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
- La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
- La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
- La légende est contenue dans une balise `<figcaption>`.

**Méthodologie :**

1. Retrouver dans le document les images vectorielles pourvues d’une légende (élément `<svg>`) ;
2. Pour chaque image, vérifier que :
 - L’image et sa légende sont contenues dans une balise `<figure>` ;
 - La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
 - La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
 - La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9.4_

---

## Test 1.9.5

Chaque image bitmap pourvue d’une légende (balise `<canvas>` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

- L’image bitmap (balise `<canvas>`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
- La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
- La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
- La légende est contenue dans une balise `<figcaption>`.

**Méthodologie :**

1. Retrouver dans le document les images bitmap (élément `<canvas>`) ;
2. Pour chaque image, vérifier que :
 - L’image et sa légende sont contenues dans une balise `<figure>` ;
 - La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
 - La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
 - La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.9.5_

---
