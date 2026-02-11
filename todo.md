# RGAA Constat Extractor - TODO

## Phase 1: Architecture et Modèle de Données
- [x] Concevoir le schéma de base de données (Thématiques, Critères, Constats)
- [x] Définir les entités et relations
- [x] Intégrer le référentiel RGAA 4.1 (13 thématiques, critères)

## Phase 2: Initialisation du Projet
- [x] Initialiser le projet web
- [x] Configurer la base de données
- [x] Mettre en place l'authentification

## Phase 3: Parser de Documents Word
- [x] Développer le parser pour extraire la section 3
- [x] Implémenter l'extraction des thématiques et critères
- [x] Implémenter l'extraction des constats (impact, problème, solution)
- [x] Normaliser les données extraites
- [x] Créer les tests unitaires pour le parser

## Phase 4: Interface Utilisateur
- [x] Créer la page d'upload de fichiers Word
- [x] Implémenter la validation des fichiers
- [x] Créer la page de visualisation de la bibliothèque
- [x] Implémenter le filtrage par thématique et critère
- [x] Ajouter les détails des constats
- [x] Créer le composant de gestion des rapports
- [x] Créer le composant de statistiques

## Phase 5: Référentiel RGAA 4.1
- [x] Extraire et intégrer le référentiel officiel
- [x] Valider les critères extraits contre le référentiel
- [x] Implémenter la validation des données

## Phase 6: Traitement des Rapports Uploadés
- [x] Implémenter le traitement automatique des rapports
- [x] Afficher les rapports uploadés avec statut
- [x] Implémenter le parsing automatique des constats
- [x] Stocker les constats en base de données
- [x] Afficher les constats extraits
- [ ] Ajouter la suppression de rapports

## Améliorations Futures
- [ ] Améliorer la détection des sections dans les documents Word
- [ ] Gérer les différents formats de rapports
- [ ] Export des constats en CSV/Excel
- [ ] Gestion des versions de rapports
- [ ] Recherche full-text
- [ ] Notifications utilisateur


## Bugs à Corriger
- [x] Parser n'extrait pas les constats du nouveau fichier PARIS-TERRE-DENVOL (0 constat détecté) - Identifié comme template sans constats
- [x] Vérifier la détection de la section 3 dans les différents formats de rapports - Corrigé avec nouveau parser
- [x] Améliorer la robustesse du parser pour gérer les variations de structure - Parser réécrit
