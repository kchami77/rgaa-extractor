---
critere_id: "10.13"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.13"
nb_tests: 3
---

# Critère 10.13 — Présentation de l’information

**Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d’un composant d’interface sont-ils contrôlables par l’utilisateur (hors cas particuliers) ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.13_

**Cas particuliers :**

- Lorsque le contenu additionnel est contrôlé par l’agent utilisateur (par exemple, attribut `title` ou validation native de formulaire) ou correspond à une fenêtre modale conforme au motif de conception WAI-ARIA `dialog`, le critère 10.13 est non applicable.
- Lorsque le contenu additionnel ne masque ou ne remplace aucun contenu porteur d’information, le test 10.13.1 est non applicable.

---

## Test 10.13.1

Chaque contenu additionnel devenant visible à la prise de focus ou au survol d’un composant d’interface peut-il être masqué par une action de l’utilisateur sans déplacer le focus ou le pointeur de la souris (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les contenus additionnels devenant visible à la prise de focus ou au survol d’un composant d’interface, à l’exception :
 - Des contenus additionnels contrôlés par l’agent utilisateur (par exemple, les infobulles associées à l’attribut `title` ou à la validation native d’un formulaire ;
 - Des contenus additionnels devenant visibles par une activation de l’utilisateur (par exemple, une fenêtre de dialogue).
2. Pour chaque contenu additionnel, vérifier que :
 - Soit le contenu additionnel est positionné de façon à ce qu’il ne gêne pas la consultation des autres contenus informatifs sur lesquels il viendrait se superposer (y compris le composant d’interface qui a déclenché son apparition), quelles que soient les conditions de consultation (y compris lors de l’utilisation d’un mécanisme de zoom) ;
 - Soit un mécanisme (au clavier) permet de faire disparaître le contenu additionnel (par exemple, la touche Echap).
3. Si c’est le cas pour chaque contenu additionnel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.13.1_

---

## Test 10.13.2

Chaque contenu additionnel qui apparait au survol d’un composant d’interface peut-il être survolé par le pointeur de la souris sans disparaître (hors cas particuliers) ?

**Méthodologie :**

1. Retrouver dans le document les contenus additionnels devenant visible au survol d’un composant d’interface, à l’exception :
 - Des contenus additionnels contrôlés par l’agent utilisateur (par exemple, les infobulles associées à l’attribut title ou à la validation native d’un formulaire) ;
 - Des contenus additionnels devenant visibles par une activation de l’utilisateur (par exemple, une fenêtre de dialogue).
2. Pour chaque contenu additionnel, vérifier qu’il peut être survolé par le pointeur de la souris sans disparaître ;
3. Si c’est le cas pour chaque contenu additionnel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.13.2_

---

## Test 10.13.3

Chaque contenu additionnel qui apparaît à la prise de focus ou au survol d’un composant d’interface vérifie-t-il une de ces conditions (hors cas particuliers) ?

- Le contenu additionnel reste visible jusqu’à ce que l’utilisateur retire le pointeur souris ou le focus du contenu additionnel et du composant d’interface ayant déclenché son apparition ;
- Le contenu additionnel reste visible jusqu’à ce que l’utilisateur déclenche une action masquant ce contenu sans déplacer le focus ou le pointeur de la souris du composant d’interface ayant déclenché son apparition ;
- Le contenu additionnel reste visible jusqu’à ce qu’il ne soit plus valide.

**Méthodologie :**

1. Retrouver dans le document les contenus additionnels devenant visible à la prise de focus ou au survol d’un composant d’interface, à l’exception :
 - Des contenus additionnels contrôlés par l’agent utilisateur (par exemple, les infobulles associées à l’attribut `title` ou à la validation native d’un formulaire) ;
 - Des contenus additionnels devenant visibles par une activation de l’utilisateur (par exemple, une fenêtre de dialogue).
2. Pour chaque contenu additionnel, vérifier qu’il reste visible :
 - Jusqu’à ce que l’utilisateur retire le pointeur souris ou le focus du contenu additionnel ou du composant d’interface ayant déclenché son apparition ;
 - Jusqu’à ce l’utilisateur déclenche le mécanisme prévu pour faire disparaître le contenu additionnel ;
 - Jusqu’à ce que l’information proposée par le contenu additionnel ne soit plus valide (par exemple un contenu additionnel signalant l’état “occupé” du composant d’interface que l’utilisateur souhaite activer ou encore un message d’erreur signalé sous la forme d’un contenu additionnel tant que l’utilisateur n’a pas rectifié sa saisie).
3. Si c’est le cas pour chaque contenu additionnel, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.13.3_

---
