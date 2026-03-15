---
critere_id: "4.10"
thematique: "Multimédia"
thematique_id: 4
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.10"
nb_tests: 1
---

# Critère 4.10 — Multimédia

**Chaque son déclenché automatiquement est-il contrôlable par l’utilisateur ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.10_

---

## Test 4.10.1

Chaque séquence sonore déclenchée automatiquement via une balise `<object>`, `<video>`, `<audio>`, `<embed>`, `<bgsound>` ou un code JavaScript vérifie-t-elle une de ces conditions ?

- La séquence sonore a une durée inférieure ou égale à 3 secondes ;
- La séquence sonore peut être stoppée sur action de l’utilisateur ;
- Le volume de la séquence sonore peut être contrôlé par l’utilisateur indépendamment du contrôle de volume du système.

**Méthodologie :**

1. Au chargement du document, si un son se déclenche automatiquement, vérifier que :
 - Soit la séquence sonore a une durée inférieure ou égale à 3 secondes ;
 - Soit un dispositif (un bouton par exemple), sur l’élément ayant déclenché le son (voir note), ou dans la page, permet de le stopper ;
 - Soit le volume de la séquence peut être contrôlé par l’utilisateur, indépendamment du contrôle de volume du système.
2. Si c’est le cas, **le test est validé**.

Note : les éléments suivants sont susceptibles de déclencher des sons au chargement de la page : éléments `<audio>`, `<video>`, `<object>`, `<embed>`, `<bgsound>` ou un code JavaScript (utilisation de la Web Audio API, par exemple).

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.10.1_

---
