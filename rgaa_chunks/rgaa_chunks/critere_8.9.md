---
critere_id: "8.9"
thematique: "Éléments obligatoires"
thematique_id: 8
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.9"
nb_tests: 1
---

# Critère 8.9 — Éléments obligatoires

**Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.9_

---

## Test 8.9.1

Dans chaque page web les balises (à l’exception de `<div>`, `<span>` et `<table>`) ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?

**Méthodologie :**

1. Retrouver dans le document l’ensemble des éléments sémantiques utilisés à des fins de présentation ;
2. Pour chacun de ces éléments, vérifier que :
 - L’élément est pourvu d’un attribut `role="presentation"` ;
 - L’utilisation de cet élément à des fins de présentation reste justifée.
3. Si c’est le cas, **le test est validé**.

Note : Quelques exemples, non exhaustifs de détournement de balisage : un élément `<div>` utilisé comme paragraphe, un titre utilisé comme légende, un élément `<blockquote>` ou des paragraphes vides ou encore des espaces utilisés pour créer des effets de marges.
L'utilisation d'un `role="presentation"` est formellement déconseillée, mais peut toutefois se justifier dans de rares cas. Cela peut être acceptable sur un élément `<blockquote>` ou un paragraphe vide, mais sera considéré comme non-conforme sur un titre.

Le cas des tableaux : à noter que ce test aborde les tableaux de présentation qui ne devraient finalement pas apparaître au sein de la thématique Tableaux.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.9.1_

---
