---
critere_id: "1.1"
thematique: "Images"
thematique_id: 1
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1"
nb_tests: 8
---

# Critère 1.1 — Images

**Chaque image porteuse d’information a-t-elle une alternative textuelle ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1_

---

## Test 1.1.1

Chaque image (balise `<img>` ou balise possédant l’attribut WAI-ARIA `role="img"`) porteuse d’information a-t-elle une alternative textuelle ?

**Méthodologie :**

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` ou d’un élément possédant l’attribut WAI-ARIA `role="img"` ;
2. Pour chaque image, déterminer si l’image est porteuse d’information ;
3. Dans le cas où il s’agit d’un élément `<img>`, vérifier que l’image est pourvue au moins d’une alternative textuelle parmi les suivantes :
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label` ;
 - Contenu de l’attribut `alt` ;
 - Contenu de l’attribut `title`.
4. Dans le cas où il s’agit d’un élément possédant l’attribut WAI-ARIA `role="img"`, vérifier que l’image est pourvue au moins d’une alternative textuelle parmi les suivantes :
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label`.
5. Si au moins une alternative textuelle est trouvée, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.1_

---

## Test 1.1.2

Chaque zone d’une image réactive (balise `<area>`) porteuse d’information a-t-elle une alternative textuelle ?

**Méthodologie :**

1. Retrouver dans le document les éléments `<area>` ;
2. Pour chaque élément `<area>`, déterminer si la zone réactive est porteuse d’information ;
3. Vérifier que la zone réactive est pourvue au moins d’une alternative textuelle parmi les suivantes :
 - Contenu de l’attribut WAI-ARIA `aria-label` ;
 - Contenu de l’attribut `alt` ;
4. Si au moins une alternative textuelle est trouvée, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.2_

---

## Test 1.1.3

Chaque bouton de type `image` (balise `<input>` avec l’attribut `type="image"`) a-t-il une alternative textuelle ?

**Méthodologie :**

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` ;
2. Pour chaque élément `<input>` pourvu de l’attribut type="image", déterminer si l’image utilisée est porteuse d’information ;
3. Vérifier que l’élément `<input>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label` ;
 - Contenu de l’attribut `alt` ;
 - Contenu de l’attribut `title`.
4. Si au moins une alternative textuelle est trouvée, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.3_

---

## Test 1.1.4

Chaque zone cliquable d’une image réactive côté serveur est-elle doublée d’un mécanisme utilisable quel que soit le dispositif de pointage utilisé et permettant d’accéder à la même destination ?

**Méthodologie :**

1. Retrouver dans le document les éléments `<img>` pourvus de l’attribut `ismap` ;
2. Pour chaque élément `<img>` pourvu de l’attribut `ismap`, vérifier la présence d’un lien ou d’un ensemble de liens (ou bien d’un autre type de composant d’interface qui jouerait un rôle similaire comme une liste de sélection, par exemple) permettant d’accéder aux mêmes ressources que lorsque l’image fait l’objet d’un clic.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.4_

---

## Test 1.1.5

Chaque image vectorielle (balise `<svg>`) porteuse d’information, vérifie-t-elle ces conditions ?

- La balise `<svg>` possède un attribut WAI-ARIA `role="img"` ;
- La balise `<svg>` a une alternative textuelle.

**Méthodologie :**

1. Retrouver dans le document les éléments `<svg>` ;
2. Pour chaque élément `<svg>`, déterminer si l’image est porteuse d’information ;
3. S’assurer que l’élément `<svg>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
4. Si ce n’est pas le cas, le test est invalidé.
5. Le cas échéant, vérifier que l’élément `<svg>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
 - Contenu de l'élément `<title>` ;
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label` ;
6. Si au moins une alternative textuelle est trouvée, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.5_

---

## Test 1.1.6

Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, vérifie-t-elle une de ces conditions ?

- La balise `<object>` possède une alternative textuelle et un attribut `role="img"` ;
- L’élément `<object>` est immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
- Un mécanisme permet à l’utilisateur de remplacer l’élément `<object>` par un contenu alternatif.

**Méthodologie :**

1. Retrouver dans le document les balises ouvrantes `<object>` pourvues de l'attribut `type="image/…"` ;
2. Pour chaque balise ouvrante `<object>` pourvue de l'attribut `type="image/…"`, déterminer si l’image utilisée est porteuse d'information ;
3. Vérifier que l’élément `<object>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
4. Vérifier que l’élément `<object>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label` ;
 - Contenu de l’attribut `title`.
5. Si au moins une alternative textuelle est trouvée, **le test est validé** ;
6. Sinon, vérifier que l'élément `<object>` est :
 - Soit immédiatement suivi d'un lien ou bouton adjacent permettant d'accéder à un contenu alternatif ;
 - Soit un mécanisme permet à l'utilisateur de remplacer l'élément `<object>` par un contenu alternatif.
7. Si c'est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.6_

---

## Test 1.1.7

Chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, vérifie-t-elle une de ces conditions ?

- La balise `<embed>` possède une alternative textuelle et un attribut `role="img"` ;
- L’élément `<embed>` est immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
- Un mécanisme permet à l’utilisateur de remplacer l’élément `<embed>` par un contenu alternatif.

**Méthodologie :**

1. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, déterminer si l’image utilisée est porteuse d’information ;
2. Vérifier que l’élément `<embed>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
3. Vérifier que l’élément `<embed>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label` ;
 - Contenu de l’attribut `title`.
4. Si au moins une alternative textuelle est trouvée, **le test est validé** ;
5. Sinon, vérifier que l’élément `<embed>` est :
 - Soit immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
 - Soit un mécanisme permet à l’utilisateur de remplacer l’élément `<embed>` par un contenu alternatif.
6. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.7_

---

## Test 1.1.8

Chaque image bitmap (balise `<canvas>`) porteuse d’information, vérifie-t-elle une de ces conditions ?

- La balise `<canvas>` possède une alternative textuelle et un attribut `role="img"` ;
- Un contenu alternatif est présent entre les balises `<canvas>` et `</canvas>` ;
- L’élément `<canvas>` est immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
- Un mécanisme permet à l’utilisateur de remplacer l’élément `<canvas>` par un contenu alternatif.

**Méthodologie :**

1. Retrouver dans le document les éléments `<canvas>` ;
2. Pour chaque élément `<canvas>`, déterminer si l’image utilisée est porteuse d’information ;
3. Vérifier que l’élément `<canvas>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
4. Vérifier que la balise ouvrante `<canvas>` est pourvue au moins d’une alternative textuelle parmi les suivantes :
 - Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
 - Contenu de l’attribut WAI-ARIA `aria-label`.
5. Si au moins une alternative textuelle est trouvée, **le test est validé**.
6. Si les étapes 3 et 4 ne sont pas satisfaites, vérifier que l’élément `<canvas>` est :
 - Soit pourvu d’un contenu alternatif présent entre les balises `<canvas>` et `</canvas>` ;
 - Soit immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
 - Soit un mécanisme permet à l’utilisateur de remplacer l’élément `<canvas>` par un contenu alternatif.
7. Si c’est le cas, **le test est validé**.

Note : si l'élément `<canvas>` dispose d'un rôle `img`, son alternative ne peut être fournie que par les techniques listées à l'étape 4.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#1.1.8_

---
