---
critere_id: "11.1"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.1"
nb_tests: 3
---

# Critère 11.1 — Formulaires

**Chaque champ de formulaire a-t-il une étiquette ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.1_

---

## Test 11.1.1

Chaque champ de formulaire vérifie-t-il une de ces conditions ?

- Le champ de formulaire possède un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte identifié ;
- Le champ de formulaire possède un attribut WAI-ARIA `aria-label` ;
- Une balise `<label>` ayant un attribut `for` est associée au champ de formulaire ;
- Le champ de formulaire possède un attribut `title` ;
- Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément `<label>` visuellement caché ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire ;
2. Pour chaque champ de formulaire, vérifier que le champ de formulaire :
 - Possède un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte identifié ;
 - Possède un attribut WAI-ARIA `aria-label` ;
 - Est associé à un élément `<label>` ayant un attribut `for` ;
 - Possède un attribut `title` ;
 - Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément `<label>` visuellement caché ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible.
3. Si c’est le cas pour champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.1.1_

---

## Test 11.1.2

Chaque champ de formulaire associé à une balise `<label>` ayant un attribut `for`, vérifie-t-il ces conditions ?

- Le champ de formulaire possède un attribut `id` ;
- La valeur de l’attribut `for` est égale à la valeur de l’attribut `id` du champ de formulaire associé.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire associé à un élément `<label>` ;
2. Pour chaque champ de formulaire, vérifier que :
 - Le champ de formulaire possède un attribut `id` ;
 - La valeur de l’attribut `for` de l’élément `<label>` est égale à la valeur de l’attribut `id`.
3. Si c’est le cas pour champ de formulaire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.1.2_

---

## Test 11.1.3

Chaque champ de formulaire ayant une étiquette dont le contenu n’est pas visible ou à proximité (masqué, `aria-label`) ou qui n’est pas accolé au champ (`aria-labelledby`), vérifie-t-il une de ses conditions ?

- Le champ de formulaire possède un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue ;
- Le champ de formulaire est accompagné d’un passage de texte accolé au champ qui devient visible à la prise de focus permettant de comprendre la nature de la saisie attendue ;
- Le champ de formulaire est accompagné d’un passage de texte visible accolé au champ permettant de comprendre la nature de la saisie attendue.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire dont l’étiquette n’est pas visible ou à proximité (masquée, utilisation de l’attribut aria-label) ou n’est pas accolée au champ (utilisation de l’attribut `aria-labelledby`) ;
2. Pour chaque champ de formulaire, vérifier que le champ de formulaire :
 - soit possède un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue ;
 - est accompagné d’un passage de texte accolé au champ qui devient visible à la prise de focus permettant de comprendre la nature de la saisie attendue ;
 - est accompagné d’un passage de texte visible accolé au champ permettant de comprendre la nature de la saisie attendue.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.1.3_

---
