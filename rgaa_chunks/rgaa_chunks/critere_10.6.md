---
critere_id: "10.6"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.6"
nb_tests: 1
---

# Critère 10.6 — Présentation de l’information

**Dans chaque page web, chaque lien dont la nature n’est pas évidente est-il visible par rapport au texte environnant ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.6_

---

## Test 10.6.1

Dans chaque page web, chaque lien texte signalé uniquement par la couleur, et dont la nature n’est pas évidente, vérifie-t-il ces conditions ?

- La couleur du lien a un rapport de contraste supérieur ou égal à 3:1 par rapport au texte environnant ;
- Le lien dispose d’une indication visuelle au survol autre qu’un changement de couleur ;
- Le lien dispose d’une indication visuelle au focus autre qu’un changement de couleur.

**Méthodologie :**

1. Retrouver dans le document les éléments de type lien (élément `<a>` ou élément pourvu d’un attribut WAI-ARIA `role="link"`) ;
2. Pour chaque élément de type lien, s’il peut être confondu avec un texte normal lorsqu’il est signalé uniquement par la couleur, vérifier que le contraste entre la couleur de police du lien et la couleur de police du texte environnant est de 3:1, au moins ;
3. Cette vérification doit être faite pour les différents états du lien s’ils sont présentés au moyen d’une couleur différente : l’état non visité, l’état visité, l’état activé, l’état au survol et l’état à la prise de focus ;
4. Si c’est le cas pour chaque élément de type lien, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.6.1_

---
