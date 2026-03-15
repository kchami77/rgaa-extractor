---
critere_id: "4.1"
thematique: "Multimédia"
thematique_id: 4
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.1"
nb_tests: 3
---

# Critère 4.1 — Multimédia

**Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.1_

**Cas particuliers :**

- Il existe une gestion de cas particulier lorsque :
- {'ul': '- Le [média temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information)\xa0;', '- Le média temporel est lui-même une alternative à un contenu de la page (une vidéo en langue des signes ou la vocalisation d’un texte, par exemple)\xa0;', '- Le média temporel est utilisé pour accéder à une version agrandie\xa0;', '- Le média temporel est utilisé comme un CAPTCHA\xa0;', '- Le média temporel fait partie d’un test qui deviendrait inutile si la transcription textuelle, les sous-titres synchronisés ou l’audiodescription étaient communiqués\xa0;', '- Pour les services de l’État, les collectivités territoriales et leurs établissements\xa0: si le média temporel a été publié entre le 23 septembre 2019 et le 23 septembre 2020 sur un site internet, intranet ou extranet créé depuis le 23 septembre 2018, il est exempté de l’obligation d’accessibilité\xa0;', '- Pour les personnes de droit privé mentionnées aux 2° à 4° du I de l’article 47 de la loi du 11 février 2005\xa0: si le média temporel a été publié avant le 23 septembre 2020, il est exempté de l’obligation d’accessibilité.']}
- Dans ces situations, le critère est non applicable.
- Ce cas particulier s’applique également aux critères 4.2, 4.3, 4.5.

---

## Test 4.1.1

Chaque média temporel pré-enregistré seulement audio, vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?

- Il existe une transcription textuelle accessible via un lien ou bouton adjacent ;
- Il existe une transcription textuelle adjacente clairement identifiable.

**Méthodologie :**

1. Retrouver dans le document les médias temporels (éléments `<audio>`, `<video>` ou `<object>`) seulement audio qui nécessitent une transcription textuelle ;
2. Pour chaque média temporel seulement audio, vérifier la présence d’une transcription textuelle :
 - Soit accessible au moyen d’un bouton ou d'un lien adjacent (une URL ou une ancre) ;
 - Soit adjacente clairement identifiable.
3. Si c’est le cas pour chaque média temporel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.1.1_

---

## Test 4.1.2

Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?

- Il existe une version alternative « audio seulement » accessible via un lien ou bouton adjacent ;
- Il existe une version alternative « audio seulement » adjacente clairement identifiable ;
- Il existe une transcription textuelle accessible via un lien ou bouton adjacent ;
- Il existe une transcription textuelle adjacente clairement identifiable ;
- Il existe une audiodescription synchronisée ;
- Il existe une version alternative avec une audiodescription synchronisée accessible via un lien ou bouton adjacent.

**Méthodologie :**

1. Retrouver dans le document les médias temporels (éléments `<video>` ou `<object>`) seulement vidéo qui nécessitent une transcription textuelle ;
2. Pour chaque média temporel seulement vidéo, vérifier la présence :
 - Soit d’une version alternative audio seulement accessible au moyen d’un lien ou bouton adjacent (une URL ou une ancre) ;
 - Soit d’une version alternative audio seulement adjacente ;
 - Soit d’une transcription textuelle accessible au moyen d’un bouton ou d'un lien adjacent (une URL ou une ancre) ;
 - Soit d’une transcription textuelle adjacente clairement identifiable ;
 - Soit d’une audiodescription synchronisée ;
 - Soit d’une version alternative avec une audiodescription synchronisée accessible au moyen d’un bouton ou d'un lien adjacent (une URL ou une ancre).
3. Si c’est le cas pour chaque média temporel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.1.2_

---

## Test 4.1.3

Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?

- Il existe une transcription textuelle accessible via un lien ou bouton adjacent ;
- Il existe une transcription textuelle adjacente clairement identifiable ;
- Il existe une audiodescription synchronisée ;
- Il existe une version alternative avec une audiodescription synchronisée accessible via un lien ou bouton adjacent.

**Méthodologie :**

1. Retrouver dans le document les médias temporels (éléments `<video>` ou `<object>`) synchronisés qui nécessitent une transcription textuelle ;
2. Pour chaque média temporel synchronisé, vérifier la présence :
 - Soit d’une transcription textuelle accessible au moyen d’un lien ou bouton adjacent (une URL ou une ancre) ;
 - Soit d’une transcription textuelle adjacente clairement identifiable ;
 - Soit d’une audiodescription synchronisée ;
 - Soit d’une version alternative avec une audiodescription synchronisée accessible au moyen d’un bouton ou d'un lien adjacent (une URL ou une ancre).
3. Si c’est le cas pour chaque média temporel, **le test est validé**.

Note : le critère est non applicable dans les situations où :

- Le média temporel est utilisé à des fins décoratives (c'est-à-dire qu'il n'apporte aucune information) ;
- Le média temporel est lui-même une alternative à un contenu de la page (une vidéo en langue des signes ou la vocalisation d'un texte, par exemple) ;
- Le média temporel est utilisé pour accéder à une version agrandie ;
- Le média temporel est utilisé comme un CAPTCHA ;
- Le média temporel fait partie d'un test qui deviendrait inutile si la transcription textuelle, les sous-titres synchronisés ou l'audiodescription étaient communiqués ;
- Pour les services de l’État, les collectivités territoriales et leurs établissements : si le média temporel a été publié entre le 23 septembre 2019 et le 23 septembre 2020 sur un site internet, intranet ou extranet créé depuis le 23 septembre 2018, il est exempté de l’obligation d’accessibilité ;
- Pour les personnes de droit privé mentionnées aux 2° à 4° du I de l’article 47 de la loi du 11 février 2005 : si le média temporel a été publié avant le 23 septembre 2020, il est exempté de l’obligation d’accessibilité.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#4.1.3_

---
