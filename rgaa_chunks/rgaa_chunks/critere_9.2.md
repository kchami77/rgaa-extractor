---
critere_id: "9.2"
thematique: "Structuration de l’information"
thematique_id: 9
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.2"
nb_tests: 1
---

# Critère 9.2 — Structuration de l’information

**Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.2_

**Cas particuliers :**

- Lorsque le doctype déclaré dans la page n’est pas le doctype HTML5, ce critère est non applicable.

**Notes techniques :**

- La balise `<main>` peut être utilisée plusieurs fois dans le même document HTML. Néanmoins, il ne peut y avoir en permanence qu’une seule balise visible et lisible par les technologies d’assistances, les autres devant disposer d’un attribut `hidden` ou d’un style permettant de les masquer aux technologies d’assistances. À noter cependant que l’utilisation d’un style seul restera insuffisante pour assurer l’unicité d’une balise `<main>` visible en cas de désactivation des feuilles de styles.

---

## Test 9.2.1

Dans chaque page web, la structure du document vérifie-t-elle ces conditions (hors cas particuliers) ?

- La zone d’en-tête de la page est structurée via une balise `<header>` ;
- Les zones de navigation principales et secondaires sont structurées via une balise `<nav>` ;
- La balise `<nav>` est réservée à la structuration des zones de navigation principales et secondaires ;
- La zone de contenu principal est structurée via une balise `<main>` ;
- La structure du document utilise une balise `<main>` visible unique ;
- La zone de pied de page est structurée via une balise `<footer>`.

**Méthodologie :**

1. Vérifier que la zone d’en-tête est structurée au moyen d’un élément `<header>` ;
2. Vérifier que les zones de navigation principales et secondaires sont structurées au moyen d’un élément `<nav>` ;
3. Vérifier que l’élément `<nav>` n’est pas utilisé en dehors de la structuration des zones de navigation principales et secondaires ;
4. Vérifier que la zone de contenu principal est structurée au moyen d’un élément `<main>` ;
5. Si le document possède plusieurs éléments `<main>`, vérifier qu’un seul de ces éléments est visible (les autres occurrences de l’élément sont pourvues d’un attribut `hidden`) ;
6. Vérifier que la zone de pied de page est structurée au moyen d’un élément `<footer>`.
7. Si c’est le cas pour chaque zone de contenu, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.2.1_

---
