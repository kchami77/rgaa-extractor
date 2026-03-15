---
critere_id: "10.8"
thematique: "Présentation de l’information"
thematique_id: 10
url: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.8"
nb_tests: 1
---

# Critère 10.8 — Présentation de l’information

**Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?**

_Source : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.8_

**Notes techniques :**

- WAI-ARIA propose un attribut `aria-hidden` (`true` ou `false`) qui permet d’inhiber la restitution d’un contenu en direction des technologies d’assistance, sans action sur sa visibilité en direction des agents utilisateurs : un contenu avec `aria-hidden="true"` ne sera donc plus vocalisable, mais restera visible.
- Sauf si le contenu contrôlé par `aria-hidden` n’a pas vocation à être restitué par les technologies d’assistance, la valeur de l’attribut `aria-hidden` doit être cohérente avec l’état affiché ou masqué du contenu à l’écran.
- La spécification HTML5 propose un attribut `hidden` qui permet de rendre indisponible (quand l’attribut `hidden` est présent) un contenu dans le DOM généré (de manière similaire au `type="hidden"` sur un contrôle de formulaire).
- Il est possible d’avoir des situations où un contenu contrôlé par `hidden` ou `aria-hidden` se trouve momentanément dans un état incohérent avec le statut affiché ou masqué du contenu, par exemple si l’on désire rendre disponible un élément, mais que son affichage à l’écran reste dépendant d’une action ultérieure. Dans ce cas, c’est l’état final du contenu qui doit être considéré.

---

## Test 10.8.1

Dans chaque page web, chaque contenu caché vérifie-t-il une de ces conditions ?

- Le contenu caché a vocation à être ignoré par les technologies d’assistance ;
- Le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance et est rendu restituable par les technologies d’assistance suite à une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ou suite à un repositionnement du focus dessus.

**Méthodologie :**

1. Retrouver les contenus cachés (éléments pourvus de l’attribut hidden ou de l’attribut WAI-ARIA aria-hidden, ou bien d’une classe ou d’un ensemble de styles CSS susceptibles de masquer le contenu).
2. Pour chaque contenu caché, vérifier que :
 - Soit le contenu caché a vocation à être ignoré par les technologies d’assistance (un élément statistique de visites par exemple) ;
 - Soit le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance, et dans ce cas il est rendu restituable par les technologies d’assistance au moyen :
 - Soit d’une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ;
 - Soit d’une fonction de programmation qui repositionne le focus sur le contenu.
3. Si c’est le cas pour chaque contenu caché, **le test est validé**.

_Réf : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests#10.8.1_

---
