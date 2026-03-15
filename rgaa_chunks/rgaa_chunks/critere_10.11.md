---
critere_id: "10.11"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.11"
nb_tests: 2
---

# Critère 10.11 — Présentation de l’information

**Pour chaque page web, les contenus peuvent-ils être présentés sans perte d’information ou de fonctionnalité et sans avoir recours soit à un défilement vertical pour une fenêtre ayant une hauteur de 256 px, soit à un défilement horizontal pour une fenêtre ayant une largeur de 320 px (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.11_

**Cas particuliers :**

- L'objectif de ce critère est de garantir un défilement dans une unique direction pour une lecture facilitée selon le sens de l'écriture.
- Font exception à ce critère, les contenus dont l'agencement requiert deux dimensions pour être compris ou utilisés comme :
- {'ul': ['- Les images, les graphiques ou les vidéos\xa0;', '- Les jeux (jeux de plateforme, par exemple)\xa0;', '- Les présentations (type diaporama, par exemple)\xa0;', '- Les tableaux de données\xa0;', "- Les interfaces où il est nécessaire d'avoir un ascenseur horizontal lors de la manipulation de l'interface."]}
- Note : la majorité des navigateurs sur les systèmes d'exploitation sur mobile (Android, iOS) ne gère pas correctement la redistribution en cas de zoom. Dans ce contexte, le critère sera considéré comme non applicable sur ces environnements.

**Notes techniques :**

- Lorsqu'il est ici question de pixel, il s'agit du pixel CSS tel que défini par le W3C https://www.w3.org/TR/css3-values/

---

## Test 10.11.1

Pour chaque page web, lorsque le contenu dont le sens de lecture est horizontal est affiché dans une fenêtre réduite à une largeur de 320 px, l’ensemble des informations et des fonctionnalités sont-elles disponibles sans aucun défilement horizontal (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document si son contenu est conçu pour défiler verticalement (le sens de lecture du texte est horizontal), les informations et fonctionnalités ;
2. Réduire la fenêtre d’affichage à une largeur de 320px et vérifier que les informations et les fonctionnalités restent disponibles sans aucun défilement horizontal ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.11.1_

---

## Test 10.11.2

Pour chaque page web, lorsque le contenu dont le sens de lecture est vertical est affiché dans une fenêtre réduite à une hauteur de 256 px, l’ensemble des informations et des fonctionnalités sont-elles disponibles sans aucun défilement vertical (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document si son contenu est conçu pour défiler horizontalement (le sens de lecture du texte est vertical), les informations et fonctionnalités ;
2. Réduire la fenêtre d’affichage à une hauteur de 256px et vérifier que les informations et les fonctionnalités restent disponibles sans aucun défilement vertical ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.11.2_

---
