---
critere_id: "11.9"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.9"
nb_tests: 2
---

# Critère 11.9 — Formulaires

**Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.9_

**Cas particuliers :**

- Pour le test 11.9.2, voir cas particuliers critère 11.2.

---

## Test 11.9.1

L’intitulé de chaque bouton vérifie-t-il ces conditions (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte lié au bouton via un attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent, le contenu de l’attribut `value` d’une balise `<input>` de type `submit`, `reset` ou `button` est pertinent ;
- S’il est présent, le contenu de la balise `<button>` est pertinent ;
- S’il est présent, le contenu de l’attribut `alt` d’une balise `<input>` de type `image` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent.

**Méthodologie :**

1. Retrouver dans le document les boutons présents au sein d’un formulaire ;
2. Pour chaque bouton, vérifier que son intitulé visible et son nom accessible sont pertinents ;
3. Si c’est le cas pour chaque bouton, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.9.1_

---

## Test 11.9.2

Chaque bouton affichant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?

- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label `contient au moins l’intitulé visible ;
- S’il est présent, le passage de texte lié au bouton via un attribut WAI-ARIA `aria-labelledby` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut value d’une balise `<input>` de type `submit`, `reset` ou `button` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de la balise `<button>` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut `alt` d’une balise `<input>` de type `image` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut `title` contient au moins l’intitulé visible.

**Méthodologie :**

1. Retrouver dans le document les boutons présents au sein d’un formulaire ;
2. Pour chaque bouton, vérifier que son nom accessible contient au moins son intitulé visible ;
3. Si c’est le cas pour chaque bouton, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.9.2_

---
