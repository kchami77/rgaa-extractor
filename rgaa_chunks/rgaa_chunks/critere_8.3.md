---
critere_id: "8.3"
thematique: "Éléments obligatoires"
thematique_id: 8
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.3"
nb_tests: 1
---

# Critère 8.3 — Éléments obligatoires

**Dans chaque page web, la langue par défaut est-elle présente ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.3_

---

## Test 8.3.1

Pour chaque page web, l’indication de langue par défaut vérifie-t-elle une de ces conditions ?

- L’indication de la langue de la page (attribut `lang` et/ou `xml:lang`) est donnée pour l’élément `html` ;
- L’indication de la langue de la page (attribut `lang` et/ou `xml:lang`) est donnée sur chaque élément de texte ou sur l’un des éléments parents.

**Méthodologie :**

1. Retrouver dans le document l’indication de langue par défaut ;
2. Vérifier la présence d’une indication de langue :
 - Soit au moyen de l’attribut lang sur la balise html si le code est du HTML5 ou du HTML4 ;
 - Soit au moyen des attributs lang et xml:lang sur la balise html si le code est du XHTML 1.0 ;
 - Soit au moyen de l’attribut xml:lang sur la balise html si le code est du XHTML 1.1 ;
 - Sinon, vérifier la présence d’une indication de langue sur chaque élément de texte ou l’un de ses parents.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.3.1_

---
