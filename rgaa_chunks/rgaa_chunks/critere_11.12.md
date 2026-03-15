---
critere_id: "11.12"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.12"
nb_tests: 2
---

# Critère 11.12 — Formulaires

**Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.12_

---

## Test 11.12.1

Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques, la saisie des données vérifie-t-elle une de ces conditions ?

- L’utilisateur peut modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ;
- L’utilisateur peut vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ;
- Un mécanisme de confirmation explicite, via une case à cocher (balise `<input>` de type `checkbox` ou balise ayant un attribut WAI-ARIA `role="checkbox"`) ou une étape supplémentaire, est présent.

**Méthodologie :**

1. Retrouver dans le document les formulaires qui modifient ou suppriment des données, ou qui transmettent des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques ;
2. Pour chaque formulaire, vérifier que l’utilisateur peut :
 - Soit modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ;
 - Soit vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ;
 - Soit disposer d’un mécanisme de confirmation explicite (par exemple, une case à cocher ou une étape supplémentaire).
3. Si c’est le cas pour chaque formulaire retrouvé, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.12.1_

---

## Test 11.12.2

Chaque formulaire dont la validation modifie ou supprime des données à caractère financier, juridique ou personnel vérifie-t-il une de ces conditions ?

- Un mécanisme permet de récupérer les données supprimées ou modifiées par l’utilisateur ;
- Un mécanisme de demande de confirmation explicite de la suppression ou de la modification, via un champ de formulaire ou une étape supplémentaire, est proposé.

**Méthodologie :**

1. Retrouver dans le document les formulaires qui modifient ou suppriment des données à caractère financier, juridique ou personnel ;
2. Pour chaque formulaire, vérifier que l’utilisateur dispose :
 - Soit d’un mécanisme qui permet de récupérer les données supprimées ou modifiées ;
 - Soit d’un mécanisme de demande de confirmation explicite de la suppression ou de la modification (par exemple, une case à cocher ou une étape supplémentaire).
3. Si c’est le cas pour chaque formulaire retrouvé, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.12.2_

---
