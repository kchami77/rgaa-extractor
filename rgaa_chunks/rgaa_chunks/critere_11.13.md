---
critere_id: "11.13"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.13"
nb_tests: 1
---

# Critère 11.13 — Formulaires

**La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.13_

**Notes techniques :**

- La liste des valeurs possibles pour l’attribut `autocomplete` repose sur la liste des valeurs présentes dans la spécification WCAG2.1 qui reprend elle-même la liste des valeurs de type “field name” de la spécification HTML5.2. Le critère WCAG demande à ce que l’une de ces valeurs soit présente pour qualifier un champ de saisie concernant l’utilisateur.
- Ce que le critère WCAG laisse implicite, ce sont les différentes règles de construction possibles pour obtenir une valeur (simple ou composée) pour l’attribut `autocomplete`. C’est cependant l’affaire du développeur de fournir à l’attribut `autocomplete` une valeur ou un ensemble de valeurs valides au regard des exigences de l’algorithme fourni par la spécification HTML5.2. Ainsi, un attribut `autocomplete` ne peut contenir qu’une seule valeur de type `“field name”`, comme `"name"` ou `"street-address"`. On peut avoir également un ensemble composé de différentes valeurs comme, par exemple, `autocomplete="shipping name"` ou `autocomplete="section-software shipping street-address"` : `"section-software"` renvoie à une valeur de type <span lang="en">“scope”</span> et `"shipping"` à une valeur de type <span lang="en">“hint set”</span>, mais toujours une seule valeur de type <span lang="en">“field name”</span>.

---

## Test 11.13.1

Chaque champ de formulaire dont l’objet se rapporte à une information concernant l’utilisateur vérifie-t-il ces conditions ?

- Le champ de formulaire possède un attribut `autocomplete `;
- L’attribut `autocomplete` est pourvu d’une valeur présente dans la liste des valeurs possibles pour l’attribut `autocomplete` associés à un champ de formulaire ;
- La valeur indiquée pour l’attribut `autocomplete` est pertinente au regard du type d’information attendu.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire qui se rapportent à une information concernant l’utilisateur (nom, prénom, numéro de téléphone, etc.) ;
2. Pour chaque champ de formulaire, vérifier que :
 - Le champ de formulaire possède un attribut `autocomplete` ;
 - L’attribut `autocomplete` est pourvu d’une valeur présente dans la <a rel="noreferrer noopener" target="_blank" title="liste des valeurs possibles - en anglais - nouvelle fenêtre" href="https://www.w3.org/TR/html52/sec-forms.html#autofill-processing-model">liste des valeurs possibles</a> ;
 - La valeur indiquée pour l’attribut `autocomplete` est pertinente au regard du type d’information attendu.
3. Si c’est le cas pour chaque champ de formulaire retrouvé, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.13.1_

---
