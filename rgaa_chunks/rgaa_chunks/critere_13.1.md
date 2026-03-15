---
critere_id: "13.1"
thematique: "Consultation"
thematique_id: 13
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.1"
nb_tests: 4
---

# Critère 13.1 — Consultation

**Pour chaque page web, l’utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.1_

**Cas particuliers :**

- Il existe une gestion de cas particuliers lorsque la limite de temps est essentielle, notamment lorsqu’elle ne pourrait pas être supprimée sans changer fondamentalement le contenu ou les fonctionnalités liées au contenu.
- Dans ces situations, le critère est non applicable. Par exemple, le rafraîchissement d’un flux RSS dans une page n’est pas une limite de temps essentielle ; le critère est applicable. En revanche, une redirection automatique qui amène vers la nouvelle version d’une page à partir d’une URL obsolète est essentielle ; le critère est non applicable.

---

## Test 13.1.1

Pour chaque page web, chaque procédé de rafraîchissement (balise `<object>`, balise `<embed>`, balise `<svg>`, balise `<canvas>`, balise `<meta>`) vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’utilisateur peut arrêter ou relancer le rafraîchissement ;
- L’utilisateur peut augmenter la limite de temps entre deux rafraîchissements de dix fois, au moins ;
- L’utilisateur est averti de l’imminence du rafraîchissement et dispose de vingt secondes, au moins, pour augmenter la limite de temps avant le prochain rafraîchissement ;
- La limite de temps entre deux rafraîchissements est de vingt heures, au moins.

**Méthodologie :**

1. Retrouver dans le document les rafraîchissements initiés dans le contenu par un élément `<object>`, `<embed>`, `<svg>`, `<canvas>` ou par un élément `<meta http-equiv="refresh" content="[compteur]">` (dans l’élément `<head>` de la page) ;
2. Pour chaque rafraîchissement, vérifier que :
 - Soit la présence d’un mécanisme permet à l’utilisateur de stopper et de relancer le rafraîchissement ;
 - Soit la présence d’un mécanisme permet à l’utilisateur d’augmenter la limite de temps entre deux rafraîchissements de dix fois, au moins ;
 - Soit la présence d’un mécanisme qui avertit l’utilisateur de l’imminence du rafraîchissement, laisse 20 secondes, au moins, à l’utilisateur, pour augmenter la limite de temps avant le prochain rafraîchissement ;
 - Soit la limite de temps entre deux rafraîchissements est de vingt heures, au moins.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.1.1_

---

## Test 13.1.2

Pour chaque page web, chaque procédé de redirection effectué via une balise `<meta>` est-il immédiat (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document une redirection automatique initiée par un élément `<meta http-equiv="refresh" content="0;URL='[URL ciblée]'" />` ;
2. Vérifier que la redirection est immédiate ;
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.1.2_

---

## Test 13.1.3

Pour chaque page web, chaque procédé de redirection effectué via un script vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’utilisateur peut arrêter ou relancer la redirection ;
- L’utilisateur peut augmenter la limite de temps avant la redirection de dix fois, au moins ;
- L’utilisateur est averti de l’imminence de la redirection et dispose de vingt secondes, au moins, pour augmenter la limite de temps avant la prochaine redirection ;
- La limite de temps avant la redirection est de vingt heures, au moins.

**Méthodologie :**

1. Retrouver dans le document les redirections automatiques initiées par un script (sous la forme d’un décompte par exemple) ;
2. Pour chaque redirection automatique, vérifier que :
 - Soit la présence d’un mécanisme permet à l’utilisateur de stopper et relancer la redirection ;
 - Soit la présence d’un mécanisme permet à l’utilisateur d’augmenter la limite de temps avant le rafraîchissement de dix fois, au moins ;
 - Soit la présence d’un mécanisme qui avertit l’utilisateur de l’imminence du rafraîchissement, laisse 20 secondes, au moins, à l’utilisateur, pour augmenter la limite de temps avant le prochain rafraîchissement ;
 - Soit la limite de temps avant la redirection est de vingt heures, au moins.
3. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.1.3_

---

## Test 13.1.4

Pour chaque page web, chaque procédé limitant le temps d’une session vérifie-t-il une de ces conditions (hors cas particuliers) ?

- L’utilisateur peut supprimer la limite de temps ;
- L’utilisateur peut augmenter la limite de temps ;
- La limite de temps avant la fin de la session est de vingt heures au moins.

**Méthodologie :**

1. Retrouver dans le document les procédés limitant le temps d’une session (par exemple, après une authentification) ;
2. Pour chaque procédé, vérifier que :
 - Soit la présence d’un mécanisme permet à l’utilisateur de supprimer la limite de temps ;
 - Soit la présence d’un mécanisme permet à l’utilisateur d’augmenter la limite de temps ;
 - Soit la limite de temps est de vingt heures, au moins.
3. Si c’est le cas, **le test est validé**.

Note : lorsque la limite de temps est essentielle, notamment lorsqu'elle ne pourrait pas être supprimée sans changer fondamentalement le contenu ou les fonctionnalités liées au contenu, le critère est non applicable. Par exemple, le rafraîchissement d'un flux RSS dans une page n'est pas une limite de temps essentielle ; le critère est applicable. En revanche, une redirection automatique qui amène vers la nouvelle version d'une page à partir d'une url obsolète est essentielle ; le critère est non applicable.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.1.4_

---
