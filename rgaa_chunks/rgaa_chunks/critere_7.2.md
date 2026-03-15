---
critere_id: "7.2"
thematique: "Scripts"
thematique_id: 7
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.2"
nb_tests: 2
---

# Critère 7.2 — Scripts

**Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.2_

---

## Test 7.2.1

Chaque script débutant par la balise `<script>` et ayant une alternative vérifie-t-il une de ces conditions ?

- L’alternative entre `<noscript>` et `</noscript>` permet d’accéder à des contenus et des fonctionnalités similaires ;
- La page affichée, lorsque JavaScript est désactivé, permet d’accéder à des contenus et des fonctionnalités similaires ;
- La page alternative permet d’accéder à des contenus et des fonctionnalités similaires ;
- Le langage de script côté serveur permet d’accéder à des contenus et des fonctionnalités similaires ;
- L’alternative présente dans la page permet d’accéder à des contenus et des fonctionnalités similaires.

**Méthodologie :**

1. Retrouver les alternatives aux fonctionnalités JavaScript :
2. Chercher dans la page, les alternatives à un composant ou une fonctionnalité JavaScript mises à disposition.
3. Désactiver JavaScript dans le document et retrouver les alternatives proposées.
4. Pour chacune des alternatives proposées, vérifier qu’elle permet d’accéder aux mêmes contenus et à des fonctionnalités similaires.
5. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.2.1_

---

## Test 7.2.2

Chaque élément non textuel mis à jour par un script (dans la page, ou dans un cadre) et ayant une alternative vérifie-t-il ces conditions ?

- L’alternative de l’élément non textuel est mise à jour ;
- L’alternative mise à jour est pertinente.

**Méthodologie :**

1. Retrouver dans le document tous les éléments non textuels mis à jour par une fonctionnalité JavaScript.
2. Si l'élément non textuel a une alternative, vérifier que :
 - L'alternative est mise à jour lorsque le contenu non textuel est mis à jour ;
 - L'alternative mise à jour est pertinente.
3. Si c'est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#7.2.2_

---
