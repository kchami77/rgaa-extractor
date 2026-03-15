---
critere_id: "8.10"
thematique: "Éléments obligatoires"
thematique_id: 8
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.10"
nb_tests: 2
---

# Critère 8.10 — Éléments obligatoires

**Dans chaque page web, les changements du sens de lecture sont-ils signalés ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.10_

---

## Test 8.10.1

Dans chaque page web, chaque texte dont le sens de lecture est différent du sens de lecture par défaut est contenu dans une balise possédant un attribut `dir` ?

**Méthodologie :**

1. Retrouver dans le document les passages de textes qui utilisent une langue qui se lit dans le sens inverse de la langue du document (comme l’arabe ou l’hébreu pour le français par exemple).
2. Pour chaque passage de texte, vérifier que le passage de texte est contenu dans une balise qui possède un attribut `dir`.
3. Si c’est le cas pour chaque passage de texte, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.10.1_

---

## Test 8.10.2

Dans chaque page web, chaque changement du sens de lecture (attribut `dir`) vérifie-t-il ces conditions ?

- La valeur de l’attribut `dir` est conforme (`rtl` ou `ltr`) ;
- La valeur de l’attribut `dir` est pertinente.

**Méthodologie :**

1. Pour chaque passage de texte validé au test 8.10.1, vérifier que :
 - L’indication de sens de lecture est conforme (ltr, pour le sens « de gauche à droite » et rtl pour le sens « de droite à gauche ») ;
 - L’indication de sens de lecture est pertinente.
2. Si c’est le cas pour chaque passage de texte, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.10.2_

---
