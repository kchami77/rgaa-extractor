---
critere_id: "4.3"
thematique: "Multimédia"
thematique_id: 4
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.3"
nb_tests: 2
---

# Critère 4.3 — Multimédia

**Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.3_

**Cas particuliers :**

- Voir cas particuliers critère 4.1.

---

## Test 4.3.1

Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?

- Le média temporel synchronisé possède des sous-titres synchronisés ;
- Il existe une version alternative possédant des sous-titres synchronisés accessible via un lien ou bouton adjacent.

**Méthodologie :**

1. Retrouver dans le document les médias temporels pré-enregistrés synchronisés ;
2. Pour chaque média temporel synchronisé, vérifier la présence :
 - Soit de sous-titres synchronisés ;
 - Soit d’une version alternative possédant des sous-titres synchronisés accessible au moyen d’un lien ou d’un bouton adjacent.
3. Si c’est le cas pour chaque média temporel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.3.1_

---

## Test 4.3.2

Pour chaque média temporel synchronisé pré-enregistré possédant des sous-titres synchronisés diffusés via une balise `<track>`, la balise `<track>` possède-t-elle un attribut `kind="captions"` ?

**Méthodologie :**

1. Retrouver dans le document les médias temporels synchronisés possédant des sous-titres synchronisés au moyen d’un élément `<track>` ;
2. Pour chaque média temporel synchronisé, vérifier que la balise `<track>` possède un attribut `kind="caption"` ;
3. Si c’est le cas pour chaque média temporel synchronisé, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.3.2_

---
