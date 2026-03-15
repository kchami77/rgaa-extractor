---
critere_id: "9.3"
thematique: "Structuration de l’information"
thematique_id: 9
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.3"
nb_tests: 3
---

# Critère 9.3 — Structuration de l’information

**Dans chaque page web, chaque liste est-elle correctement structurée ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.3_

**Notes techniques :**

- Les attributs WAI-ARIA `role="list"` et `role="listitem"` peuvent nécessiter l’utilisation des attributs WAI-ARIA `aria-setsize` et `aria-posinset` dans le cas où l’ensemble de la liste n’est pas disponible via le DOM généré au moment de la consultation.
- Les attributs WAI-ARIA `role="tree"`, `role="tablist"`, `role="menu"`, `role="combobox"` et `role="listbox"` ne sont pas équivalents à une liste HTML `<ul>` ou `<ol>`.

---

## Test 9.3.1

Dans chaque page web, les informations regroupées visuellement sous forme de liste non ordonnée vérifient-elles une de ces conditions ?

- La liste utilise les balises HTML `<ul>` et `<li>` ;
- La liste utilise les attributs WAI-ARIA `role="list"` et `role="listitem"`.

**Méthodologie :**

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste non ordonnée ;
2. Pour chaque liste, vérifier que la liste est structurée :
 - Soit au moyen des éléments `<ul>` et `<li>` ;
 - Soit au moyen d’éléments pourvus d’attributs WAI-ARIA `role="list"` et `role="listitem"`.
3. Si c’est le cas pour chaque liste non ordonnée, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.3.1_

---

## Test 9.3.2

Dans chaque page web, les informations regroupées visuellement sous forme de liste ordonnée vérifient-elles une de ces conditions ?

- La liste utilise les balises HTML `<ol>` et `<li>` ;
- La liste utilise les attributs WAI-ARIA `role="list"` et `role="listitem"`.

**Méthodologie :**

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste ordonnée ;
2. Pour chaque liste, vérifier que la liste est structurée :
 - Soit au moyen des éléments `<ol>` et `<li>` ;
 - Soit au moyen d’éléments pourvus d’attributs WAI-ARIA `role="list"` et `role="listitem"`.
3. Si c’est le cas pour chaque liste ordonnée, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.3.2_

---

## Test 9.3.3

Dans chaque page web, les informations regroupées sous forme de liste de description utilisent-elles les balises `<dl>` et `<dt>/<dd>` ?

**Méthodologie :**

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste de description ;
2. Pour chaque liste, vérifier que la liste est structurée au moyen des éléments `<dl>`, `<dt>` et `<dd>` ;
3. Si c’est le cas pour chaque liste de description, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#9.3.3_

---
