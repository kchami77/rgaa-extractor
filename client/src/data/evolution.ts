export interface Milestone {
  id: string;
  title: string;
  date: string;
  summary: string;
  functional: string[];
  technical: string[];
  status: "completed" | "in-progress" | "planned";
}

export const evolutionData: Milestone[] = [
  {
    id: "mcp-integration",
    title: "Connexion du Cerveau : Serveur MCP",
    date: "14 Février 2026",
    summary: "Mise en place de l'infrastructure permettant à l'IA d'interagir directement avec le code et la base de données via le protocole MCP (Model Context Protocol).",
    functional: [
      "L'IA peut maintenant lire le référentiel RGAA 4.1 directement.",
      "Capacité de recherche sémantique dans les modèles de constats.",
      "Accès aux outils d'édition pour l'auditeur virtuel."
    ],
    technical: [
      "Implémentation d'un serveur MCP side-car en Node.js.",
      "Architecture 'tRPC Caller' : le serveur MCP utilise les mêmes routeurs que le frontend pour garantir la sécurité.",
      "Configuration dynamique via mcp_config.json pour Windows (contournement des restrictions PowerShell)."
    ],
    status: "completed"
  },
  {
    id: "smart-deduplication",
    title: "Moteur de Déduplication Intelligente",
    date: "14-15 Février 2026",
    summary: "Création d'un système capable de reconnaître les constats identiques à travers des milliers de pages de rapports Word, éliminant ainsi le travail redondant.",
    functional: [
      "Regroupement automatique des problèmes similaires.",
      "Compteur d'occurrences pour prioriser les problèmes les plus fréquents.",
      "Signature unique par critère pour éviter les faux positifs."
    ],
    technical: [
      "Moteur de normalisation de texte (retrait ponctuation, accents, stop-words).",
      "Génération de signatures cryptographiques SHA-256.",
      "Algorithme de similarité de Levenshtein pour détecter les variantes mineures."
    ],
    status: "completed"
  },
  {
    id: "expertise-library",
    title: "Bibliothèque d'Expertise & Rétro-population",
    date: "15 Février 2026",
    summary: "Transformation des données brutes en base de connaissances. Possibilité d'aspirer tout l'historique des anciens rapports pour créer instantanément une bibliothèque d'audit.",
    functional: [
      "Interface dédiée pour gérer les phrases 'types' (templates).",
      "Bouton 'Synchroniser depuis l'historique' pour peupler la base en un clic.",
      "Distinction entre modèles 'Brouillon', 'Approuvé' et 'Obsolète'."
    ],
    technical: [
      "Repository pattern dédié (templateRepository.ts) pour le découplage.",
      "Liaison relationnelle forte (ID technique) vs Liaison sémantique (Hash).",
      "Migration de base de données pour supporter les métadonnées d'expertise."
    ],
    status: "completed"
  },
  {
    id: "ai-clean-pipeline",
    title: "Nettoyage Expert IA (AI Magic 🪄)",
    date: "15 Février 2026",
    summary: "Module d'intelligence artificielle qui transforme un constat brut (nom de site, fautes de frappe, contexte local) en une recommandation experte propre et réutilisable.",
    functional: [
      "Bouton ✨ pour généraliser une phrase instantanément.",
      "Anonymisation automatique (retrait des noms de projets ou d'IDs spécifiques).",
      "Alignement du ton sur le standard professionnel RGAA."
    ],
    technical: [
      "Pipeline de transformation modulaire extensible (GeneralizationPipeline).",
      "Règles d'anonymisation basées sur des expressions régulières avancées.",
      "Système de diff pour validation humaine avant application."
    ],
    status: "completed"
  },
  {
    id: "bulk-safe-cleaning",
    title: "Nettoyage par Lot 'Bulk Safe' 🛡️",
    date: "15 Février 2026",
    summary: "Mise à l'échelle du nettoyage IA pour traiter des centaines de modèles d'un coup, avec un mécanisme de sauvegarde et de restauration.",
    functional: [
      "Bouton 'Nettoyage IA Groupé' pour traiter toute la bibliothèque.",
      "Sécurité 'Retour à l'original' : possibilité d'annuler une correction IA.",
      "Protection des modèles déjà validés manuellement."
    ],
    technical: [
      "Evolution du schéma SQL (original_finding) pour le backup.",
      "Gestion des transactions de masse en base de données.",
      "UI réactive avec indicateurs de progression et confirmations."
    ],
    status: "completed"
  }
];
