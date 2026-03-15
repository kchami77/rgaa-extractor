---
critere_id: "12.8"
thematique: "Navigation"
thematique_id: 12
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.8"
nb_tests: 2
---

# Critère 12.8 — Navigation

**Dans chaque page web, l’ordre de tabulation est-il cohérent ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.8_

---

## Test 12.8.1

Dans chaque page web, l’ordre de tabulation dans le contenu est-il cohérent ?

**Méthodologie :**

1. Parcourir dans le document l’ensemble des contenus au moyen de la touche de tabulation vers l’avant (touche Tab) et vers l’arrière (touches Maj+Tab) ;
2. Vérifier que l’ordre de déplacement du focus reste cohérent relativement au contenu considéré (par exemple, l’ordre de tabulation dans une fenêtre modale ne doit considérer que les éléments d’interface présents au sein de cette fenêtre) ;
3. Si c’est le cas, **le test est validé**.

Note : il n'est pas obligatoire que la tabulation suive l'ordre de lecture naturel (de gauche à droite et de haut en bas par exemple) tant que les éléments sont accessibles dans un ordre cohérent.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.8.1_

---

## Test 12.8.2

Pour chaque script qui met à jour ou insère un contenu, l’ordre de tabulation reste-t-il cohérent ?

**Méthodologie :**

1. Retrouver dans le document l’ensemble des contenus insérés au moyen d’un script (affichage d’éléments masqués, mise jour de contenu via AJAX par exemple) ;
2. Positionner la tabulation sur l’élément déclencheur et l’activer ;
3. Après l’affichage du contenu mis à jour, vérifier que la tabulation reste cohérente (repositionnement correct du focus) ;
4. Si c’est le cas, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#12.8.2_

---
