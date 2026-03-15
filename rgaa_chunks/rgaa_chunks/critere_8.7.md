---
critere_id: "8.7"
thematique: "Éléments obligatoires"
thematique_id: 8
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.7"
nb_tests: 1
---

# Critère 8.7 — Éléments obligatoires

**Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.7_

**Cas particuliers :**

- Il y a une gestion de cas particuliers sur le changement de langue pour les cas suivants :
- {'ul': '- Nom propre, le critère est non applicable\xa0;', '- Nom commun de langue étrangère présent dans le dictionnaire officiel de la langue (voir note 1 ci-dessous) par défaut de la page web, le critère est non applicable\xa0;', '- Le terme de langue étrangère soumis, via un [champ de formulaire et rappelé dans la page (par exemple comme indication du terme recherché dans le cas d’un moteur de recherche), le critère est non applicable\xa0;', '- Passage de texte dont la langue ne peut pas être déterminée : le critère est non applicable\xa0;', '- Terme ou passage de texte issus d’une langue morte ou imaginaire pour laquelle il n’existe pas d’interprétation vocale : le critère est non applicable.']}
- Note 1 : le dictionnaire officiel est celui recommandé par l’académie en charge de la langue en question. Pour la France, par exemple, le lien vers le dictionnaire officiel se trouve sur le site de l’Académie française à l’adresse suivante : http://www.academie-francaise.fr/le-dictionnaire/la-9e-edition. Pour toute demande auprès du service du dictionnaire de l’Académie française, utiliser le formulaire de contact du service du dictionnaire.
- Note 2 : pour les noms communs de langue étrangère, absents dans le dictionnaire officiel de la langue par défaut de la page web, et qui sont passés dans le langage commun (exemple : newsletter) : le critère est applicable, uniquement lorsque l’absence d’indication de langue peut provoquer une incompréhension pour la restitution.

---

## Test 8.7.1

Dans chaque page web, chaque texte écrit dans une langue différente de la langue par défaut vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’indication de langue est donnée sur l’élément contenant le texte (attribut `lang` et/ou `xml:lang`) ;
- L’indication de langue est donnée sur un des éléments parents (attribut `lang` et/ou `xml:lang`)

**Méthodologie :**

1. Retrouver les passages de texte en langue étrangère, à l’exception :
 - Des noms propres ;
 - Des mots d’origine étrangère, présents dans le dictionnaire de la langue du document ;
 - Des mots d’origine étrangère et d’usage courant dont la prononciation ne provoque pas d’incompréhension.
 - Vérifier que chaque passage de texte retenu possède une indication de langue (attribut `lang` et/ou `xml:lang` sur l’élément lui-même ou l’un de ses parents).
2. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#8.7.1_

---
