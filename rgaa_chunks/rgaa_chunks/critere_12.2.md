---
critere_id: "12.2"
thematique: "Navigation"
thematique_id: 12
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.2"
nb_tests: 1
---

# Critère 12.2 — Navigation

**Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.2_

**Cas particuliers :**

- Il existe une gestion de cas particuliers lorsque :
- {'ul': ['- La page est la page d’accueil\xa0;', '- Le site web est constitué d’une seule page\xa0;', '- Le changement fait suite à une modification initiée par l’utilisateur.']}
- Dans ces situations, le critère est non applicable.

---

## Test 12.2.1

Dans chaque ensemble de pages, chaque page disposant d’un menu et les barres de navigation vérifie-t-elle ces conditions (hors cas particuliers) ?

- Le menu et les barres de navigation sont toujours à la même place dans la présentation ;
- Le menu et les barres de navigation se présentent toujours dans le même ordre relatif dans le code source.

**Méthodologie :**

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer visuellement les deux pages et vérifier que le menu ou les barres de navigation sont toujours à la même place dans la présentation ;
3. Comparer le code source (généré côté client) des deux pages et vérifier que le menu ou les barres de navigation se présentent toujours dans le même ordre relatif dans la structure ;
4. Si c’est le cas, **le test est validé**.

Note : le critère est non applicable dans les situations où :

- Les pages d'un ensemble de pages sont le résultat ou une partie d'un processus (un processus de paiement ou de prise de commande, par exemple) ;
- La page est la page d'accueil ;
- Le site web est constitué d'une seule page.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.2.1_

---
