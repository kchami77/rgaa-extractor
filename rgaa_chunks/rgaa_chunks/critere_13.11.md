---
critere_id: "13.11"
thematique: "Consultation"
thematique_id: 13
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.11"
nb_tests: 1
---

# Critère 13.11 — Consultation

**Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran peuvent-elles faire l’objet d’une annulation (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.11_

**Cas particuliers :**

- Il existe une gestion de cas particulier lorsque la fonctionnalité nécessite que le comportement attendu soit réalisé lors d’un événement descendant, par exemple, un émulateur de clavier dont les touches doivent s’activer à la pression comme sur un clavier physique. Dans ces situations, le critère est non applicable.

**Notes techniques :**

- Deux exemples de mécanisme mis en place pour annuler ou abandonner une action déclenchée au moyen d’un dispositif de pointage sur un point unique de l’écran :
- {'ul': ['- Une fenêtre modale permettant d’annuler l’action après son achèvement\xa0;', '- Pour une fonction de glisser/déposer, le fait d’abandonner l’action si l’utilisateur relâche l’élément en dehors de la zone cible.']}

---

## Test 13.11.1

Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran vérifient-elles l’une de ces conditions (hors cas particuliers) ?

- L’action est déclenchée au moment où le dispositif de pointage est relâché ou relevé ;
- L’action est déclenchée au moment où le dispositif de pointage est pressé ou posé puis annulée lorsque le dispositif de pointage est relâché ou relevé ;
- Un mécanisme est disponible pour abandonner (avant achèvement de l’action) ou annuler (après achèvement) l’exécution de l’action.

**Méthodologie :**

1. Retrouver dans le document les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran ;
2. Pour chaque action, vérifier que :
 - Soit l’action est déclenchée au moment où le dispositif de pointage est relâché ou relevé ;
 - Soit l’action est déclenchée au moment où le dispositif de pointage est pressé ou posé puis annulée lorsque le dispositif de pointage est relâché ou relevé ;
 - Soit il existe un mécanisme pour abandonner (avant achèvement de l’action) ou annuler (après achèvement) l’exécution de l’action ; par exemple, lors d’une interaction de type glisser-déposer un relâchement du dispositif de pointage doit permettre d’abandonner l’interaction en cours et une fois la zone de dépôt atteinte, l’utilisateur doit rester en mesure d’annuler son opération de dépôt au moyen d’un dialogue de confirmation (choix de confirmer ou d’annuler le dépôt) ou par le fait de pouvoir replacer l’élément déposé à sa position initiale.
3. Si c’est le cas pour chaque action déclenchée au moyen d’un dispositif de pointage sur un point unique de l’écran, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.11.1_

---
