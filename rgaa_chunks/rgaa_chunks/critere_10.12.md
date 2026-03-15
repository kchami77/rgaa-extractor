---
critere_id: "10.12"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.12"
nb_tests: 1
---

# Critère 10.12 — Présentation de l’information

**Dans chaque page web, les propriétés d’espacement du texte peuvent-elles être redéfinies par l’utilisateur sans perte de contenu ou de fonctionnalité (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.12_

**Cas particuliers :**

- Font exception à ce critère, les contenus pour lesquels l’utilisateur n’a pas de possibilité de personnalisation :
- {'ul': ['- Les sous-titres directement intégrés à une vidéo\xa0;', '- Les images texte\xa0;', '- Le texte au sein d’une balise `<canvas>`.']}

---

## Test 10.12.1

Dans chaque page web, le texte reste-t-il lisible lorsque l’affichage est modifié selon ces conditions (hors cas particuliers) ?

- L’espacement entre les lignes (`line-height`) est augmenté jusqu’à 1,5 fois la taille de la police ;
- L’espacement suivant les paragraphes (balise `<p>`) est augmenté jusqu’à 2 fois la taille de la police ;
- L’espacement des lettres (`letter-spacing`) est augmenté jusqu’à 0,12 fois la taille de la police ;
- L’espacement des mots (`word-spacing`) est augmenté jusqu’à 0,16 fois la taille de la police.

**Méthodologie :**

1. Modifier les styles du document en donnant :
 - Une valeur de 1.5 à la propriété `line-height` de tous les éléments du document ;
 - Une valeur de 2em à la propriété `margin-bottom` des éléments `<p>` ;
 - Une valeur de 0.12em à la propriété `letter-spacing` de tous les éléments du document ;
 - Une valeur de 0.16em à la propriété `word-spacing` de tous les éléments du document ;
2. Pour chaque passage de texte, vérifier qu’il reste lisible, à l’exception :
 - Des sous-titres directement intégrés à une vidéo ;
 - Des images texte ;
 - Des textes au sein d’une balise `<canvas>`.
3. Si c’est le cas pour chaque passage de texte, **le test est validé**.

Note : une implémentation de ces règles de modification est disponible dans les ressources du critère de succès WCAG 1.4.12 (https://github.com/alastc/adaptation-scripts/blob/master/scripts/text-adaptation.js).

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.12.1_

---
