---
critere_id: "5.1"
thematique: "Tableaux"
thematique_id: 5
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.1"
nb_tests: 1
---

# Critère 5.1 — Tableaux

**Chaque tableau de données complexe a-t-il un résumé ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.1_

**Notes techniques :**

- La spécification HTML propose plusieurs méthodes pour lier un résumé à un tableau (tableau lié à un passage de texte avec l’attribut `aria-describedby`, tableau groupé dans un élément `figure` avec un résumé présent dans un élément `figcaption` ou un élément `p`, résumé présent dans un élément `details` contenu dans l’élément `caption`). Ces méthodes n’ont pas un support suffisant pour être utilisées actuellement.

---

## Test 5.1.1

Pour chaque tableau de données complexe, un résumé est-il disponible ?

**Méthodologie :**

1. Retrouver dans le document les tableaux de données complexes (tableau de données - élément `<table>` ou élément pourvu d’un attribut WAI-ARIA `role="table"` - contenant des en-têtes qui ne sont pas répartis uniquement sur la première ligne et/ou la première colonne de la grille ou dont la portée n’est pas valable pour l’ensemble de la colonne ou de la ligne) ;
2. Pour chaque tableau de données complexe, vérifier qu’un passage de texte permettant de comprendre la nature et la structure du tableau, est présent :
 - Soit dans l’élément `<caption>` ;
 - Soit dans l’attribut `summary` de l’élément `<table>` (dans les versions de HTML et de XHTML antérieures à HTML 5) ;
 - Soit dans un passage de texte lié au tableau avec l’attribut `aria-describedby`.
3. Si c’est le cas pour chaque tableau de données complexe, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#5.1.1_

---
