---
critere_id: "11.11"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.11"
nb_tests: 2
---

# Critère 11.11 — Formulaires

**Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.11_

**Notes techniques :**

- Certains types de contrôles en HTML5 proposent des messages d’aide à la saisie automatique : par exemple le type `email` affiche un message du type « veuillez saisir une adresse e-mail valide » dans le cas où l’adresse e-mail saisie ne correspond pas au format attendu. Ces messages sont personnalisables via l’API Constraint Validation, ce qui permet de personnaliser les messages d’erreur et de valider le critère. L’attribut `pattern` permet d’effectuer automatiquement des contrôles de format (via des expressions régulières) et affiche un message d’aide personnalisable via l’attribut `title` : ce dispositif valide également le critère.

---

## Test 11.11.1

Pour chaque erreur de saisie, les types et les formats de données sont-ils suggérés, si nécessaire ?

**Méthodologie :**

1. Retrouver dans le document les messages d’erreur ;
2. Pour chaque message d’erreur, vérifier que les types et les formats de données attendus sont suggérés ;
3. Si c’est le cas pour chaque message d’erreur , **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.11.1_

---

## Test 11.11.2

Pour chaque erreur de saisie, des exemples de valeurs attendues sont-ils suggérés, si nécessaire ?

**Méthodologie :**

1. Retrouver dans le document les messages d’erreur ;
2. Pour chaque message d’erreur, vérifier que des exemples de valeurs attendues sont suggérés ;
3. Si c’est le cas pour chaque message d’erreur , **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.11.2_

---
