---
critere_id: "10.5"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.5"
nb_tests: 3
---

# Critère 10.5 — Présentation de l’information

**Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.5_

---

## Test 10.5.1

Dans chaque page web, chaque déclaration CSS de couleurs de police (`color`), d’un élément susceptible de contenir du texte, est-elle accompagnée d’une déclaration de couleur de fond (`background`, `background-color`), au moins, héritée d’un parent ?

**Méthodologie :**

1. Retrouver dans le document les textes mis en couleur, à l’exception des couleurs par défaut (par exemple les liens, etc.) ;
2. Déterminer l’élément qui contient le texte et vérifier la présence d’une valeur calculée pour la propriété `background-color` de l’élément ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.5.1_

---

## Test 10.5.2

Dans chaque page web, chaque déclaration de couleur de fond (`background`, `background-color`), d’un élément susceptible de contenir du texte, est-elle accompagnée d’une déclaration de couleur de police (`color`) au moins, héritée d’un parent ?

**Méthodologie :**

1. Retrouver dans le document les textes mis en couleur, à l’exception des couleurs par défaut (par exemple les liens, etc.) ;
2. Déterminer l’élément qui contient le texte et vérifier la présence d’une valeur calculée pour la propriété `color` de l’élément ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.5.2_

---

## Test 10.5.3

Dans chaque page web, chaque utilisation d’une image pour créer une couleur de fond d’un élément susceptible de contenir du texte, via CSS (`background`, `background-image`), est-elle accompagnée d’une déclaration de couleur de fond (`background`, `background-color`), au moins, héritée d’un parent ?

**Méthodologie :**

1. Retrouver dans le document les textes dont l’arrière-plan est constitué d’une image (propriété background-image) ;
2. Déterminer l’élément qui contient le texte et vérifier que si l’image d’arrière-plan est absente, le texte reste lisible ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.5.3_

---
