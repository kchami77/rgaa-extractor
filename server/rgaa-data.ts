/**
 * Référentiel RGAA 4.1 complet
 * Source: https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/
 * 
 * Contient les 13 thématiques et tous les critères associés
 */

export interface RgaaThematicData {
  number: number;
  name: string;
  description: string;
}

export interface RgaaCriterionData {
  reference: string;
  label: string;
  thematicNumber: number;
  description?: string;
}

export const RGAA_THEMATICS: RgaaThematicData[] = [
  {
    number: 1,
    name: "Images",
    description: "Fournir des alternatives textuelles aux images et gérer correctement les images décoratives",
  },
  {
    number: 2,
    name: "Cadres",
    description: "Assurer que les cadres sont correctement titrés et identifiables",
  },
  {
    number: 3,
    name: "Couleurs",
    description: "Gérer les contrastes de couleurs et ne pas véhiculer l'information uniquement par la couleur",
  },
  {
    number: 4,
    name: "Multimédia",
    description: "Fournir des alternatives aux contenus multimédias (transcriptions, sous-titres, audiodescriptions)",
  },
  {
    number: 5,
    name: "Tableaux",
    description: "Structurer correctement les tableaux de données et fournir des résumés",
  },
  {
    number: 6,
    name: "Liens",
    description: "Rendre les liens explicites et clairs pour tous les utilisateurs",
  },
  {
    number: 7,
    name: "Scripts",
    description: "Assurer la compatibilité des scripts avec les technologies d'assistance",
  },
  {
    number: 8,
    name: "Éléments obligatoires",
    description: "Respecter les éléments obligatoires du HTML et valider le code source",
  },
  {
    number: 9,
    name: "Structuration de l'information",
    description: "Structurer l'information avec des titres, listes et autres éléments sémantiques",
  },
  {
    number: 10,
    name: "Présentation de l'information",
    description: "Assurer la lisibilité et la compréhension de l'information sur tous les appareils",
  },
  {
    number: 11,
    name: "Formulaires",
    description: "Rendre les formulaires accessibles et faciliter leur utilisation",
  },
  {
    number: 12,
    name: "Navigation",
    description: "Faciliter la navigation et l'orientation dans le site",
  },
  {
    number: 13,
    name: "Consultation",
    description: "Assurer l'accessibilité des documents en téléchargement et des contenus consultables",
  },
];

export const RGAA_CRITERIA: RgaaCriterionData[] = [
  // Thématique 1 : Images
  {
    reference: "1.1",
    label: "Chaque image porteuse d'information a-t-elle une alternative textuelle ?",
    thematicNumber: 1,
  },
  {
    reference: "1.2",
    label: "Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ?",
    thematicNumber: 1,
  },
  {
    reference: "1.3",
    label: "Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?",
    thematicNumber: 1,
  },
  {
    reference: "1.4",
    label: "Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d'identifier la nature et la fonction de l'image ?",
    thematicNumber: 1,
  },
  {
    reference: "1.5",
    label: "Pour chaque image porteuse d'information ayant une description détaillée, celle-ci est-elle pertinente ?",
    thematicNumber: 1,
  },
  {
    reference: "1.6",
    label: "Pour chaque image porteuse d'information, la description détaillée doit-elle si nécessaire, être accompagnée d'une indication de sa localisation ?",
    thematicNumber: 1,
  },
  {
    reference: "1.7",
    label: "Chaque image-texte porteuse d'information a-t-elle, si nécessaire, un mécanisme de remplacement ou une alternative textuelle ?",
    thematicNumber: 1,
  },
  {
    reference: "1.8",
    label: "Chaque image objet a-t-elle, si nécessaire, une alternative textuelle ou une description détaillée ?",
    thematicNumber: 1,
  },
  {
    reference: "1.9",
    label: "Chaque image vectorielle porteuse d'information a-t-elle une alternative textuelle ?",
    thematicNumber: 1,
  },

  // Thématique 2 : Cadres
  {
    reference: "2.1",
    label: "Chaque cadre a-t-il un titre de cadre ?",
    thematicNumber: 2,
  },
  {
    reference: "2.2",
    label: "Pour chaque cadre ayant un titre de cadre, ce titre est-il pertinent ?",
    thematicNumber: 2,
  },

  // Thématique 3 : Couleurs
  {
    reference: "3.1",
    label: "L'information n'est-elle pas donnée uniquement par la couleur ?",
    thematicNumber: 3,
  },
  {
    reference: "3.2",
    label: "Le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisant (hors cas particuliers) ?",
    thematicNumber: 3,
  },
  {
    reference: "3.3",
    label: "Le contraste entre la couleur d'un composant d'interface ou d'un élément graphique porteur d'information et la couleur de son arrière-plan est-il suffisant (hors cas particuliers) ?",
    thematicNumber: 3,
  },

  // Thématique 4 : Multimédia
  {
    reference: "4.1",
    label: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription ?",
    thematicNumber: 4,
  },
  {
    reference: "4.2",
    label: "Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchronisée, celles-ci sont-elles pertinentes ?",
    thematicNumber: 4,
  },
  {
    reference: "4.3",
    label: "Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés ?",
    thematicNumber: 4,
  },
  {
    reference: "4.4",
    label: "Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ceux-ci sont-ils pertinents ?",
    thematicNumber: 4,
  },
  {
    reference: "4.5",
    label: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée ?",
    thematicNumber: 4,
  },
  {
    reference: "4.6",
    label: "Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?",
    thematicNumber: 4,
  },
  {
    reference: "4.7",
    label: "Chaque média en direct a-t-il, si nécessaire, une transcription textuelle ou une audiodescription ?",
    thematicNumber: 4,
  },
  {
    reference: "4.8",
    label: "Chaque média temporel en direct synchronisé a-t-il, si nécessaire, des sous-titres synchronisés ?",
    thematicNumber: 4,
  },
  {
    reference: "4.9",
    label: "Chaque média temporel en direct a-t-il, si nécessaire, une audiodescription synchronisée ?",
    thematicNumber: 4,
  },
  {
    reference: "4.10",
    label: "Chaque son déclenché automatiquement lors du chargement d'une page est-il contrôlable par l'utilisateur ?",
    thematicNumber: 4,
  },
  {
    reference: "4.11",
    label: "Chaque contenu en mouvement ou clignotant est-il contrôlable par l'utilisateur ?",
    thematicNumber: 4,
  },
  {
    reference: "4.12",
    label: "Chaque contenu en mouvement ou clignotant qui dure plus de 5 secondes est-il contrôlable par l'utilisateur ?",
    thematicNumber: 4,
  },
  {
    reference: "4.13",
    label: "Chaque objet intégré a-t-il, si nécessaire, une alternative textuelle ou une description détaillée ?",
    thematicNumber: 4,
  },

  // Thématique 5 : Tableaux
  {
    reference: "5.1",
    label: "Chaque tableau de données a-t-il un titre ?",
    thematicNumber: 5,
  },
  {
    reference: "5.2",
    label: "Pour chaque tableau de données ayant un titre, ce titre est-il pertinent ?",
    thematicNumber: 5,
  },
  {
    reference: "5.3",
    label: "Chaque tableau de données a-t-il un résumé ?",
    thematicNumber: 5,
  },
  {
    reference: "5.4",
    label: "Pour chaque tableau de données ayant un résumé, ce résumé est-il pertinent ?",
    thematicNumber: 5,
  },
  {
    reference: "5.5",
    label: "Chaque tableau de données complexe a-t-il des en-têtes de lignes et de colonnes identifiés ?",
    thematicNumber: 5,
  },
  {
    reference: "5.6",
    label: "Pour chaque tableau de données, la structure du tableau est-elle pertinente ?",
    thematicNumber: 5,
  },
  {
    reference: "5.7",
    label: "Chaque tableau utilisé à des fins de mise en page ne contient-il pas de balises de structuration de tableau ?",
    thematicNumber: 5,
  },

  // Thématique 6 : Liens
  {
    reference: "6.1",
    label: "Chaque lien est-il explicite ?",
    thematicNumber: 6,
  },
  {
    reference: "6.2",
    label: "Dans chaque page web, chaque lien a-t-il un intitulé ?",
    thematicNumber: 6,
  },

  // Thématique 7 : Scripts
  {
    reference: "7.1",
    label: "Chaque script est-il, si nécessaire, compatible avec les technologies d'assistance ?",
    thematicNumber: 7,
  },
  {
    reference: "7.2",
    label: "Pour chaque script ayant une fonctionnalité, l'accès à cette fonctionnalité est-il possible sans script ?",
    thematicNumber: 7,
  },
  {
    reference: "7.3",
    label: "Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?",
    thematicNumber: 7,
  },
  {
    reference: "7.4",
    label: "Chaque script est-il exempt de piège au clavier ?",
    thematicNumber: 7,
  },
  {
    reference: "7.5",
    label: "Chaque script qui provoque une mise à jour du contenu de la page est-il compatible avec les technologies d'assistance ?",
    thematicNumber: 7,
  },

  // Thématique 8 : Éléments obligatoires
  {
    reference: "8.1",
    label: "Chaque page web est-elle définie par un type de document ?",
    thematicNumber: 8,
  },
  {
    reference: "8.2",
    label: "Pour chaque page web, le code source généré est-il valide selon le type de document spécifié (hors cas particuliers) ?",
    thematicNumber: 8,
  },
  {
    reference: "8.3",
    label: "Chaque page web a-t-elle un titre de page ?",
    thematicNumber: 8,
  },
  {
    reference: "8.4",
    label: "Pour chaque page web, le titre de page est-il pertinent ?",
    thematicNumber: 8,
  },
  {
    reference: "8.5",
    label: "Chaque page web a-t-elle une langue par défaut ?",
    thematicNumber: 8,
  },
  {
    reference: "8.6",
    label: "Pour chaque page web ayant une langue par défaut, cette langue est-elle correctement déclarée ?",
    thematicNumber: 8,
  },
  {
    reference: "8.7",
    label: "Chaque changement de langue est-il explicitement signalé ?",
    thematicNumber: 8,
  },
  {
    reference: "8.8",
    label: "Chaque page web a-t-elle un mécanisme permettant d'identifier et d'accéder au contenu principal ?",
    thematicNumber: 8,
  },
  {
    reference: "8.9",
    label: "Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?",
    thematicNumber: 8,
  },
  {
    reference: "8.10",
    label: "Chaque page web a-t-elle un mécanisme permettant d'identifier et d'accéder à la liste des liens de la page ?",
    thematicNumber: 8,
  },

  // Thématique 9 : Structuration de l'information
  {
    reference: "9.1",
    label: "Chaque page web a-t-elle au moins un titre (balise Hx) ?",
    thematicNumber: 9,
  },
  {
    reference: "9.2",
    label: "La structure du document utilise-t-elle correctement les balises de titre (Hx) ?",
    thematicNumber: 9,
  },
  {
    reference: "9.3",
    label: "Dans chaque page web, chaque liste est-elle correctement structurée ?",
    thematicNumber: 9,
  },
  {
    reference: "9.4",
    label: "Chaque citation est-elle correctement signalée ?",
    thematicNumber: 9,
  },

  // Thématique 10 : Présentation de l'information
  {
    reference: "10.1",
    label: "Chaque page web est-elle lisible sans feuille de style ?",
    thematicNumber: 10,
  },
  {
    reference: "10.2",
    label: "Pour chaque page web, l'ordre de lecture du contenu est-il pertinent sans feuille de style ?",
    thematicNumber: 10,
  },
  {
    reference: "10.3",
    label: "Dans chaque page web, l'information ne doit pas être donnée uniquement par la forme, la taille ou la position. Cette règle est-elle respectée ?",
    thematicNumber: 10,
  },
  {
    reference: "10.4",
    label: "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu'à 200 %, sans perte de contenu ou de fonctionnalité (hors cas particuliers) ?",
    thematicNumber: 10,
  },
  {
    reference: "10.5",
    label: "Les décorationsapportées par les images d'arrière-plan via CSS sont-elles ignorées par les technologies d'assistance ?",
    thematicNumber: 10,
  },
  {
    reference: "10.6",
    label: "Dans chaque page web, chaque lien dont la nature n'est pas évidente est-il visible par rapport au texte environnant ?",
    thematicNumber: 10,
  },
  {
    reference: "10.7",
    label: "Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?",
    thematicNumber: 10,
  },
  {
    reference: "10.8",
    label: "Pour chaque page web, les éléments qui ont la même fonctionnalité sont-ils identifiés de manière cohérente ?",
    thematicNumber: 10,
  },
  {
    reference: "10.9",
    label: "Dans chaque page web, les contenus additionnels apparaissant au survol ou à la prise de focus sont-ils contrôlables par l'utilisateur (hors cas particuliers) ?",
    thematicNumber: 10,
  },
  {
    reference: "10.10",
    label: "Chaque page web a-t-elle une structure pertinente ?",
    thematicNumber: 10,
  },
  {
    reference: "10.11",
    label: "Pour chaque page web, les listes ne sont-elles pas utilisées à des fins de présentation ?",
    thematicNumber: 10,
  },
  {
    reference: "10.12",
    label: "Dans chaque page web, les propriétés d'espacement du texte peuvent-elles être redéfinies par l'utilisateur sans perte de contenu ou de fonctionnalité (hors cas particuliers) ?",
    thematicNumber: 10,
  },
  {
    reference: "10.13",
    label: "Dans chaque page web, les contenus additionnels apparaissant au survol ou à la prise de focus restent-ils visibles jusqu'à ce que l'utilisateur les masque ou mette à jour le contenu de la page (hors cas particuliers) ?",
    thematicNumber: 10,
  },

  // Thématique 11 : Formulaires
  {
    reference: "11.1",
    label: "Chaque champ de formulaire a-t-il une étiquette ?",
    thematicNumber: 11,
  },
  {
    reference: "11.2",
    label: "Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?",
    thematicNumber: 11,
  },
  {
    reference: "11.3",
    label: "Dans chaque formulaire, chaque étiquette associée à un champ de saisie est-elle accolée au champ correspondant ?",
    thematicNumber: 11,
  },
  {
    reference: "11.4",
    label: "Dans chaque formulaire, chaque bouton est-il clairement identifiable ?",
    thematicNumber: 11,
  },
  {
    reference: "11.5",
    label: "Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?",
    thematicNumber: 11,
  },
  {
    reference: "11.6",
    label: "Chaque formulaire a-t-il, si nécessaire, des indications relatives à la saisie obligatoire des champs et au format attendu ?",
    thematicNumber: 11,
  },
  {
    reference: "11.7",
    label: "Pour chaque formulaire ayant des indications relatives à la saisie obligatoire des champs et au format attendu, ces indications sont-elles pertinentes ?",
    thematicNumber: 11,
  },
  {
    reference: "11.8",
    label: "Chaque formulaire a-t-il, si nécessaire, des messages d'erreur permettant à l'utilisateur d'identifier le ou les champs en erreur et, si possible, de corriger l'erreur ?",
    thematicNumber: 11,
  },
  {
    reference: "11.9",
    label: "Pour chaque formulaire ayant des messages d'erreur, ces messages d'erreur sont-ils pertinents ?",
    thematicNumber: 11,
  },
  {
    reference: "11.10",
    label: "Chaque formulaire a-t-il, si nécessaire, un mécanisme permettant à l'utilisateur de demander de l'aide ?",
    thematicNumber: 11,
  },
  {
    reference: "11.11",
    label: "Pour chaque formulaire ayant un mécanisme permettant à l'utilisateur de demander de l'aide, ce mécanisme est-il pertinent ?",
    thematicNumber: 11,
  },
  {
    reference: "11.12",
    label: "Chaque formulaire a-t-il, si nécessaire, un mécanisme de confirmation permettant à l'utilisateur de valider sa saisie ?",
    thematicNumber: 11,
  },
  {
    reference: "11.13",
    label: "Pour chaque formulaire ayant un mécanisme de confirmation, ce mécanisme est-il pertinent ?",
    thematicNumber: 11,
  },

  // Thématique 12 : Navigation
  {
    reference: "12.1",
    label: "Chaque ensemble de pages a-t-il un menu de navigation ?",
    thematicNumber: 12,
  },
  {
    reference: "12.2",
    label: "Le menu de navigation est-il présent à la même place dans chaque page ?",
    thematicNumber: 12,
  },
  {
    reference: "12.3",
    label: "Chaque menu de navigation est-il correctement structuré ?",
    thematicNumber: 12,
  },
  {
    reference: "12.4",
    label: "Chaque page a-t-elle un fil d'Ariane (sauf la page d'accueil) ?",
    thematicNumber: 12,
  },
  {
    reference: "12.5",
    label: "Dans chaque page web, chaque fil d'Ariane est-il pertinent ?",
    thematicNumber: 12,
  },
  {
    reference: "12.6",
    label: "Chaque page a-t-elle un moteur de recherche ?",
    thematicNumber: 12,
  },
  {
    reference: "12.7",
    label: "Chaque ensemble de pages a-t-il un plan du site ?",
    thematicNumber: 12,
  },
  {
    reference: "12.8",
    label: "Chaque page a-t-elle un lien vers la page d'accueil ?",
    thematicNumber: 12,
  },
  {
    reference: "12.9",
    label: "Chaque page a-t-elle un titre pertinent ?",
    thematicNumber: 12,
  },
  {
    reference: "12.10",
    label: "Pour chaque page web ayant un titre pertinent, ce titre est-il correctement restitué par les technologies d'assistance ?",
    thematicNumber: 12,
  },

  // Thématique 13 : Consultation
  {
    reference: "13.1",
    label: "Chaque page web a-t-elle une langue par défaut ?",
    thematicNumber: 13,
  },
  {
    reference: "13.2",
    label: "Chaque document en téléchargement a-t-il, si nécessaire, un titre pertinent ?",
    thematicNumber: 13,
  },
  {
    reference: "13.3",
    label: "Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible (hors cas particuliers) ?",
    thematicNumber: 13,
  },
];
