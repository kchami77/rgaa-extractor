---
critere_id: "12.7"
thematique: "Navigation"
thematique_id: 12
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.7"
nb_tests: 2
---

# Critère 12.7 — Navigation

**Dans chaque page web, un lien d’évitement ou d’accès rapide à la zone de contenu principal est-il présent (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.7_

**Cas particuliers :**

- Il existe une gestion de cas particuliers lorsque le site web est constitué d’une seule page.
- Dans ce cas de figure, l’obligation de la présence d’un lien d’accès rapide est liée au contexte de la page : présence ou absence de navigation ou de contenus additionnels, par exemple. Le critère peut être considéré comme non applicable lorsqu’il est avéré qu’un lien d’accès rapide est inutile.

---

## Test 12.7.1

Dans chaque page web, un lien permet-il d’éviter la zone de contenu principal ou d’y accéder (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document la zone de contenu principal (indiquée par l’élément main visible) ;
2. Vérifier que la zone :
 - Soit peut être évitée au moyen d’un lien d’évitement précédant directement la zone dans l’ordre du code source ;
 - Soit peut être atteinte au moyen d’un lien d’accès rapide visible à la prise de focus lors d’une tabulation.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.7.1_

---

## Test 12.7.2

Dans chaque ensemble de pages, le lien d’évitement ou d’accès rapide à la zone de contenu principal vérifie-t-il ces conditions (hors cas particuliers) ?

- Le lien est situé à la même place dans la présentation ;
- Le lien se présente toujours dans le même ordre relatif dans le code source ;
- Le lien est visible ou, à défaut, visible à la prise de focus ;
- Le lien est fonctionnel.

**Méthodologie :**

1. Retrouver dans le document la zone de contenu principal (indiquée par l’élément main visible) ;
2. Vérifier que le lien d’évitement ou d’accès rapide à la zone est :
 - Situé à la même place dans la présentation ;
 - Présent toujours dans le même ordre relatif dans le code source (généré côté client) ;
 - Visible à la prise de focus lors d’une tabulation ;
 - Fonctionnel.
3. Si c’est le cas, **le test est validé**.

Note : lorsque le site web est constitué d'une seule page, l'obligation de la présence d'un lien d'accès rapide est liée au contexte de la page (présence ou absence de navigation ou de contenus additionnels, par exemple). Le critère peut être considéré comme non applicable lorsqu'il est avéré qu'un lien d'accès rapide est inutile.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.7.2_

---
