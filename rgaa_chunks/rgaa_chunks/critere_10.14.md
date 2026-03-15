---
critere_id: "10.14"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.14"
nb_tests: 2
---

# Critère 10.14 — Présentation de l’information

**Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.14_

---

## Test 10.14.1

Dans chaque page web, les contenus additionnels apparaissant au survol d’un composant d’interface via les styles CSS respectent-ils si nécessaire une de ces conditions ?

- Les contenus additionnels apparaissent également à l’activation du composant via le clavier et tout dispositif de pointage ;
- Les contenus additionnels apparaissent également à la prise de focus du composant ;
- Les contenus additionnels apparaissent également par le biais de l’activation ou de la prise de focus d’un autre composant.

**Méthodologie :**

1. Retrouver dans le document les contenus additionnels devenant visible au survol d’un composant d’interface au moyen d’un mécanisme CSS (`pseudo-classe :hover`) ;
2. Pour chaque contenu additionnel, vérifier que les contenus additionnels apparaissent également :
 - À l’activation du composant au moyen du clavier ou de tout autre dispositif de pointage ;
 - À la prise de focus du composant ;
 - À l’activation ou à la prise de focus d’un autre composant.
3. Si c’est le cas pour chaque contenu additionnel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.14.1_

---

## Test 10.14.2

Dans chaque page web, les contenus additionnels apparaissant au focus d’un composant d’interface via les styles CSS respectent-ils si nécessaire une de ces conditions ?

- Les contenus additionnels apparaissent également à l’activation du composant via le clavier et tout dispositif de pointage ;
- Les contenus additionnels apparaissent également au survol du composant ;
- Les contenus additionnels apparaissent également par le biais de l’activation ou du survol d’un autre composant.

**Méthodologie :**

1. Retrouver dans le document les contenus additionnels devenant visible à la prise de focus d’un composant d’interface au moyen d’un mécanisme CSS (`pseudo-classe :focus`) ;
2. Pour chaque contenu additionnel, vérifier que les contenus additionnels apparaissent également :

- À l’activation du composant au moyen du clavier ou de tout autre dispositif de pointage ;
- Au survol du composant ;
- À l’activation ou du survol d’un autre composant.

3. Si c’est le cas pour chaque contenu additionnel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.14.2_

---
