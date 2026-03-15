---
critere_id: "4.8"
thematique: "Multimédia"
thematique_id: 4
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.8"
nb_tests: 2
---

# Critère 4.8 — Multimédia

**Chaque média non temporel a-t-il, si nécessaire, une alternative (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.8_

**Cas particuliers :**

- Il existe une gestion de cas particulier lorsque :
- {'ul': '- Le [média non temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information)\xa0;', '- Le média non temporel est diffusé dans un environnement maîtrisé\xa0;', '- Le média non temporel est inséré via JavaScript en vérifiant la présence et la version du plug-in, en remplacement d’un contenu alternatif déjà présent.']}
- Dans ces situations, le critère est non applicable.

---

## Test 4.8.1

Chaque média non temporel vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?

- Un lien ou un bouton adjacent, clairement identifiable, permet d’accéder à une page contenant une alternative ;
- Un lien ou un bouton adjacent, clairement identifiable, permet d’accéder à une alternative dans la page.

**Méthodologie :**

1. Retrouver dans le document les médias non temporels ;
2. Pour chaque média non temporel, vérifier qu’un lien ou un bouton adjacent, clairement identifiable :
 - Soit contient l’adresse (url) d’une page contenant une alternative ;
 - Soit permet d’accéder à une alternative dans la page.
3. Si c’est le cas pour chaque média non temporel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.8.1_

---

## Test 4.8.2

Chaque média non temporel associé à une alternative vérifie-t-il une de ces conditions (hors cas particuliers) ?

- La page référencée par le lien ou bouton adjacent est accessible ;
- L’alternative dans la page, référencée par le lien ou bouton adjacent, est accessible.

**Méthodologie :**

1. Retrouver dans le document les médias non temporels associés à une alternative ;
2. Pour chaque média non temporel, vérifier que :
 - La page référencée par le lien ou le bouton adjacent est accessible ;
 - L’alternative dans la page, référencée par le lien ou le bouton adjacent, est accessible.
3. Si c’est le cas pour chaque média non temporel, **le test est validé**.

Note : le critère est non applicable dans les situations où :

- Le média non temporel est utilisé à des fins décoratives (c'est-à-dire qu'il n'apporte aucune information) ;
- Le média non temporel est diffusé dans un environnement maîtrisé ;
- Le média non temporel est inséré via JavaScript en vérifiant la présence et la version du plug-in, en remplacement d'un contenu alternatif déjà présent.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.8.2_

---
