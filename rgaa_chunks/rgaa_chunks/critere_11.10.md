---
critere_id: "11.10"
thematique: "Formulaires"
thematique_id: 11
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10"
nb_tests: 7
---

# Critère 11.10 — Formulaires

**Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10_

**Cas particuliers :**

- Le test 11.10.1 et le test 11.10.2 seront considérés comme non applicables lorsque le formulaire comporte un seul champ de formulaire ou qu’il indique les champs optionnels de manière :
- {'ul': '- Visible\xa0;', '- Dans la balise `<label>` ou dans la [légende associée au champ.']}
- Dans le cas où l’ensemble des champs d’un formulaire sont obligatoires, les tests 11.10.1 et 11.10.2 restent applicables.

**Notes techniques :**

- Dans un long formulaire dont la majorité des champs sont obligatoires, on pourrait constater que ce sont les quelques champs restés facultatifs qui sont explicitement signalés comme tels. Dans ce cas, il faudrait s’assurer que :
- {'ul': ['- Un message précise visuellement en haut de formulaire que “tous les champs sont obligatoires sauf ceux indiqués comme étant facultatifs”\xa0;', '- Une mention “facultatif” est présente visuellement dans le libellé des champs facultatifs ou dans la légende d’un groupe de champs facultatifs\xa0;', '- Un attribut `required` ou `aria-required="true"` reste associé à chaque champ qui n’est pas concerné par ce caractère facultatif.']}

---

## Test 11.10.1

Les indications du caractère obligatoire de la saisie des champs vérifient-elles une de ces conditions (hors cas particuliers) ?

- Une indication de champ obligatoire est visible et permet d’identifier nommément le champ concerné préalablement à la validation du formulaire ;
- Le champ obligatoire dispose de l’attribut `aria-required="true"` ou `required` préalablement à la validation du formulaire.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire obligatoires ;
2. Pour chaque champ de formulaire, vérifier que préalablement à la validation du formulaire :
 - Soit une indication de champ obligatoire est visible et permet d’identifier nommément le champ concerné ;
 - Soit le champ possède un attribut `aria-required="true"` ou `required`.
3. Si c’est le cas pour chaque champ de formulaire obligatoire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.1_

---

## Test 11.10.2

Les champs obligatoires ayant l’attribut `aria-required="true"` ou `required` vérifient-ils une de ces conditions ?

- Une indication de champ obligatoire est visible et située dans l’étiquette associée au champ préalablement à la validation du formulaire ;
- Une indication de champ obligatoire est visible et située dans le passage de texte associé au champ préalablement à la validation du formulaire.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire obligatoires qui possèdent un attribut `aria-required="true"` ou `required` ;
2. Pour chaque champ de formulaire, vérifier que préalablement à la validation du formulaire :
 - Soit une indication de champ obligatoire est visible et située dans l’étiquette associée au champ ;
 - Soit une indication de champ obligatoire est visible et située dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire qui possèdent un attribut `aria-required="true"` ou `required`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.2_

---

## Test 11.10.3

Les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire vérifient-ils une de ces conditions ?

- Le message d’erreur indiquant l’absence de saisie d’un champ obligatoire est visible et permet d’identifier nommément le champ concerné ;
- Le champ obligatoire dispose de l’attribut `aria-invalid="true"`.

**Méthodologie :**

1. Retrouver dans le document les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire ;
2. Pour chaque message d’erreur, vérifier que :
 - Soit le message d’erreur est visible et permet d’identifier nommément le champ concerné ;
 - Soit le champ obligatoire associé au message d’erreur possède un attribut `aria-invalid="true"`.
3. Si c’est le cas pour chaque message d’erreur indiquant l’absence de saisie d’un champ obligatoire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.3_

---

## Test 11.10.4

Les champs obligatoires ayant l’attribut `aria-invalid="true"` vérifient-ils une de ces conditions ?

- Le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans l’étiquette associée au champ ;
- Le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans le passage de texte associé au champ.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire obligatoires qui possèdent un attribut `aria-invalid="true"` ;
2. Pour chaque champ de formulaire, vérifier que :
 - Soit le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans l’étiquette associée au champ ;
 - Soit le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire qui possède un attribut `aria-invalid="true"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.4_

---

## Test 11.10.5

Les instructions et indications du type de données et/ou de format obligatoires vérifient-elles une de ces conditions ?

- Une instruction ou une indication du type de données et/ou de format obligatoire est visible et permet d’identifier nommément le champ concerné préalablement à la validation du formulaire ;
- Une instruction ou une indication du type de données et/ou de format obligatoire est visible dans l’étiquette ou le passage de texte associé au champ préalablement à la validation du formulaire.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire obligatoires auxquels est associée une instruction ou une indication du type de données et/ou de format obligatoire ;
2. Pour chaque champ de formulaire, vérifier que l’instruction ou l’indication du type de données et/ou de format obligatoire est préalablement à la validation du formulaire :
 - Soit visible et permet d’identifier nommément le champ concerné ;
 - Soit visible dans l’étiquette ou le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire auxquel est associée une instruction ou une indication du type de données et/ou de format obligatoire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.5_

---

## Test 11.10.6

Les messages d’erreurs fournissant une instruction ou une indication du type de données et/ou de format obligatoire des champs vérifient-ils une de ces conditions ?

- Le message d’erreur fournissant une instruction ou une indication du type de données et/ou de format obligatoires est visible et identifie le champ concerné ;
- Le champ dispose de l’attribut `aria-invalid="true"`.

**Méthodologie :**

1. Retrouver dans le document les messages d’erreur fournissant une instruction ou une indication du type de données et/ou de format obligatoire d’un champ ;
2. Pour chaque message d’erreur, vérifier que :
 - Soit le message d’erreur est visible et permet d’identifier nommément le champ concerné ;
 - Soit le champ associé au message d’erreur possède un attribut `aria-invalid="true"`.
3. Si c’est le cas pour chaque message d’erreur indiquant l’absence de saisie d’un champ obligatoire, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.6_

---

## Test 11.10.7

Les champs ayant l’attribut `aria-invalid="true"` dont la saisie requiert un type de données et/ou de format obligatoires vérifient-ils une de ces conditions ?

- Une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans la balise `<label>` associée au champ ;
- Une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans le passage de texte associé au champ.

**Méthodologie :**

1. Retrouver dans le document les champs de formulaire qui possèdent un attribut `aria-invalid="true"` ;
2. Pour chaque champ de formulaire, vérifier que :
 - Soit une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans l’élément `<label>` associé au champ ;
 - Soit une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire qui possède un attribut `aria-invalid="true"`, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#11.10.7_

---
