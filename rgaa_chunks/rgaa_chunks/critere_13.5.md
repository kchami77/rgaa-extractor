---
critere_id: "13.5"
thematique: "Consultation"
thematique_id: 13
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.5"
nb_tests: 1
---

# Critère 13.5 — Consultation

**Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.5_

---

## Test 13.5.1

Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) vérifie-t-il une de ces conditions ?

- Un attribut title est disponible ;
- Une définition est donnée par le contexte adjacent.

**Méthodologie :**

1. Retrouver dans le document les contenus cryptiques (art ASCII, émoticône, syntaxe cryptique) ;
2. Pour chaque contenu cryptique, vérifier que :
 - Soit une définition est disponible au moyen d’un attribut `title`, sur un lien, un contrôle de formulaire, une abréviation (élément `<abbr>`) par exemple ;
 - Soit une définition est donnée dans le contexte adjacent (immédiatement avant ou après).
3. Si c’est le cas pour chaque contenu cryptique, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#13.5.1_

---
