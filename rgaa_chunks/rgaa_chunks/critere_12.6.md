---
critere_id: "12.6"
thematique: "Navigation"
thematique_id: 12
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.6"
nb_tests: 1
---

# Critère 12.6 — Navigation

**Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.6_

---

## Test 12.6.1

Dans chaque page web où elles sont présentes, la zone d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche respectent-elles au moins une de ces conditions ?

- La zone possède un rôle WAI-ARIA de type landmark correspondant à sa nature ;
- La zone possède un titre dont le contenu permet de comprendre la nature du contenu de la zone ;
- La zone peut être masquée par le biais d’un bouton précédent directement la zone dans l’ordre du code source ;
- La zone peut être évitée par le biais d’un lien d’évitement précédent directement la zone dans l’ordre du code source ;
- La zone peut être atteinte par le biais d’un lien d’accès rapide visible ou, à défaut, visible à la prise de focus.

**Méthodologie :**

1. Retrouver dans le document les zones de regroupement de contenus (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) ;
2. Pour chaque zone, vérifier que la zone :
 - Soit possède un rôle WAI-ARIA de type landmark correspondant à sa nature ;
 - Soit possède un titre de hiérarchie dont le contenu permet de comprendre la nature du contenu de la zone ;
 - Soit peut être masquée au moyen d’un bouton précédant directement la zone dans l’ordre du code source ;
 - Soit peut être évitée au moyen d’un lien d’évitement précédant directement la zone dans l’ordre du code source ;
 - Soit peut être atteinte au moyen d’un lien d’accès rapide soit visible par défaut, soit visible à la prise de focus lors d’une tabulation.
3. Si c’est le cas pour chaque zone de regroupement de contenus, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.6.1_

---
