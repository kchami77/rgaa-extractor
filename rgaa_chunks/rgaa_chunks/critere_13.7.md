---
critere_id: "13.7"
thematique: "Consultation"
thematique_id: 13
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.7"
nb_tests: 3
---

# Critère 13.7 — Consultation

**Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.7_

---

## Test 13.7.1

Dans chaque page web, chaque image ou élément multimédia (balise `<video>`, balise `<img>`, balise `<svg>`, balise `<canvas>`, balise `<embed>` ou balise `<object>`) qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?

- La fréquence de l’effet est inférieure à 3 par seconde ;
- La surface totale cumulée des effets est inférieure ou égale à 21824 pixels.

**Méthodologie :**

1. Retrouver dans le document les contenus clignotants ou qui provoquent des effets de flash de type image animée, vidéo (cf. note) ou animation (éléments `<img>`, `<svg>`, `<canvas>`, `<embed>`, `<object>` ou `<video>`) ;
2. Pour chaque contenu clignotant ou provoquant des effets de flash, vérifier que :
 - Soit la fréquence de l’effet est inférieur à 3 par seconde ;
 - Soit la surface cumulée est inférieure à 21824 pixels.
3. Si c’est le cas pour chaque contenu clignotant ou provoquant des effets de flash, **le test est validé**.

Note : l'évaluation de ce critère peut être complexe. Lorsque l'effet est géré par un script ou au moyen de CSS, l'analyse du code est suffisante. L'outil PEAT permet d'analyser les vidéos au format .avi, par exemple. Un exemple de vidéo ayant provoquée des crises d'épilepsie peut être consulté ici : London 2012 Olympics Seizure (https://www.youtube.com/watch?v=vs0hfhSje9M).

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.7.1_

---

## Test 13.7.2

Dans chaque page web, chaque script qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?

- La fréquence de l’effet est inférieure à 3 par seconde ;
- La surface totale cumulée des effets est inférieure ou égale à 21824 pixels.

**Méthodologie :**

1. Retrouver dans le document les contenus clignotants ou qui provoquent des effets de flash obtenus au moyen d’un script ;
2. Pour chaque contenu clignotant ou provoquant des effets de flash, vérifier que :
 - Soit la fréquence de l’effet est inférieur à 3 par seconde ;
 - Soit la surface cumulée est inférieure à 21824 pixels.
3. Si c’est le cas pour chaque contenu clignotant ou provoquant des effets de flash, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.7.2_

---

## Test 13.7.3

Dans chaque page web, chaque mise en forme CSS qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?

- La fréquence de l’effet est inférieure à 3 par seconde ;
- La surface totale cumulée des effets est inférieure ou égale à 21824 pixels.

**Méthodologie :**

1. Retrouver dans le document les contenus clignotants ou qui provoquent des effets de flash obtenus au moyen d’une animation CSS ;
2. Pour chaque contenu clignotant ou provoquant des effets de flash, vérifier que :
 - Soit la fréquence de l’effet est inférieur à 3 par seconde ;
 - Soit la surface cumulée est inférieure à 21824 pixels.
3. Si c’est le cas pour chaque contenu clignotant ou provoquant des effets de flash, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.7.3_

---
