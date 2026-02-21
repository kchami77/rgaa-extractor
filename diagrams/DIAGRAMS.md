# Diagrammes Visuels - RGAA Constat Extractor

Ce dossier contient les diagrammes Mermaid pour visualiser l'architecture et les flux de données du projet.

## Architecture Globale

```mermaid
flowchart TB
    subgraph Client["🖥️ CLIENT - React 19"]
        C1[Upload Section]
        C2[Findings Library]
        C3[Reports Management]
        C4[Drafting Assistant]
        C5[Stats Overview]
        C6[MCP Capabilities]
        
        subgraph UI["🎨 UI Components"]
            RAD["Radix UI + Tailwind"]
        end
    end
    
    subgraph Communication["📡 Communication"]
        TRPC["tRPC Client/Server"]
        RQ["React Query"]
    end
    
    subgraph Server["⚙️ SERVER - Express + tRPC"]
        subgraph Core["🔧 Core Modules"]
            AUTH["Auth (OAuth/JWT)"]
            COOK["Cookies"]
            ENV["Environment"]
        end
        
        subgraph Business["💼 Business Logic"]
            ROUTERS["Routers (tRPC)"]
            PARSER["Parser (Mammoth.js)"]
            AI["AI Service"]
            MCP["MCP Server"]
        end
        
        subgraph Data["💾 Data Access"]
            REPOS["Repositories"]
            DB[("Drizzle ORM")]
        end
        
        subgraph Storage["🗄️ Storage"]
            S3["S3 / Forge"]
            LOCAL["Local Filesystem"]
        end
    end
    
    subgraph External["🌐 External"]
        OAUTH["OAuth Provider"]
        MCP_CLIENT["MCP Clients\n(Claude Desktop)"]
    end
    
    subgraph Database["🗃️ DATABASE"]
        MYSQL[("MySQL")]
        subgraph Tables["Tables"]
            T1[users]
            T2[audit_reports]
            T3[findings]
            T4[finding_templates]
            T5[rgaa_criteria]
            T6[rgaa_thematics]
        end
    end
    
    Client --> Communication
    Communication --> Server
    Server --> Database
    
    AUTH <--> OAUTH
    MCP <--> MCP_CLIENT
    
    style Client fill:#e3f2fd
    style Server fill:#fff3e0
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

## Flux de Données - Upload et Parsing

```mermaid
sequenceDiagram
    actor User
    participant UI as Client UI
    participant TRPC as tRPC Router
    participant Storage as Storage Module
    participant Parser as Parser
    participant DB as Database
    
    User->>UI: Upload fichier Word
    UI->>TRPC: audit.uploadReport(file)
    TRPC->>Storage: storagePut(fileBuffer)
    Storage-->>TRPC: {fileKey, url}
    TRPC->>DB: createAuditReport(metadata)
    DB-->>TRPC: reportId
    TRPC-->>UI: Rapport créé (status: pending)
    
    User->>UI: Lancer le traitement
    UI->>TRPC: audit.processReport(reportId)
    TRPC->>DB: updateStatus(processing)
    TRPC->>Storage: storageGet(fileKey)
    Storage-->>TRPC: fileBuffer
    TRPC->>Parser: parseAuditReportBuffer(buffer)
    
    Note over Parser: Mammoth.js extraction
    Parser->>Parser: extractRawText()
    Parser->>Parser: convertToHtml()
    Parser->>Parser: parseTextContent()
    Parser->>Parser: extractAuditedPages()
    
    Parser-->>TRPC: {findings[], pages[], diagnostics[]}
    
    loop Pour chaque constat
        TRPC->>TRPC: generateFindingSignature()
        TRPC->>DB: upsertFindingTemplate()
        TRPC->>DB: createFinding(templateId)
    end
    
    TRPC->>DB: updateStatus(completed)
    TRPC->>DB: updateFindingsCount(count)
    TRPC-->>UI: {success: true, findingsCount}
    UI-->>User: Affichage des constats
```

## Architecture MCP (Model Context Protocol)

```mermaid
flowchart LR
    subgraph MCP_Client["MCP Client (Claude Desktop)"]
        REQ[Requête JSON-RPC]
    end
    
    subgraph Transport["Transport"]
        STDIO[Stdio Transport]
    end
    
    subgraph MCP_Server["MCP Server (server/mcp.ts)"]
        HANDLER[Request Handler]
        
        subgraph Resources["Resources"]
            R1[rgaa://criteria]
            R2[rgaa://reports]
        end
        
        subgraph Tools["Tools"]
            T1[search_rgaa_expertise]
            T2[get_expertise_by_criterion]
            T3[get_report_findings]
            T4[search_findings]
            T5[propose_deduplication]
        end
        
        CONTEXT[Internal Context]
        CALLER[tRPC Caller]
    end
    
    subgraph Backend["Backend tRPC"]
        ROUTER[appRouter]
        REPOS[Repositories]
        DB[(Database)]
    end
    
    REQ --> STDIO
    STDIO --> HANDLER
    
    HANDLER --> Resources
    HANDLER --> Tools
    
    Tools --> CONTEXT
    CONTEXT --> CALLER
    CALLER --> ROUTER
    ROUTER --> REPOS
    REPOS --> DB
    
    style MCP_Client fill:#e3f2fd
    style MCP_Server fill:#fff3e0
    style Backend fill:#e8f5e9
```

## Schéma Entité-Relation

```mermaid
erDiagram
    USERS ||--o{ AUDIT_REPORTS : creates
    USERS {
        int id PK
        string openId UK
        string name
        string email
        enum role
        timestamp createdAt
        timestamp lastSignedIn
    }
    
    AUDIT_REPORTS ||--o{ FINDINGS : contains
    AUDIT_REPORTS {
        int id PK
        string fileName
        string fileKey
        string fileUrl
        int userId FK
        string siteUrl
        json auditedPages
        int findingsCount
        enum status
        text errorMessage
        timestamp createdAt
    }
    
    RGAA_THEMATICS ||--o{ RGAA_CRITERIA : contains
    RGAA_THEMATICS {
        int id PK
        int number UK
        string name
        text description
    }
    
    RGAA_CRITERIA ||--o{ FINDINGS : categorizes
    RGAA_CRITERIA ||--o{ FINDING_TEMPLATES : generates
    RGAA_CRITERIA {
        int id PK
        string reference UK
        string label
        int thematicId FK
        text description
    }
    
    FINDINGS }o--|| FINDING_TEMPLATES : uses
    FINDINGS {
        int id PK
        int reportId FK
        int criterionId FK
        int thematicId FK
        string subThematic
        enum impact
        string location
        string contentType
        text userProblem
        text finding
        text solution
        int templateId FK
    }
    
    FINDING_TEMPLATES {
        int id PK
        int criterionId FK
        int thematicId FK
        enum impact
        string contentType
        text finding
        text solution
        int occurrenceCount
        enum status
        int confidenceLevel
        text originalFinding
        string signatureHash UK
    }
```

## Flow de Dédoublonnage

```mermaid
flowchart TD
    A[Constat extrait du parser] --> B{Template existe?}
    B -->|Non| C[Générer signature hash]
    B -->|Oui| D[Réutiliser templateId]
    
    C --> E[Créer nouveau template]
    E --> F[occurrenceCount = 1]
    E --> G[status = draft]
    
    D --> H[Incrémenter occurrenceCount]
    
    F --> I[Créer finding avec templateId]
    G --> I
    H --> I
    
    I --> J[Insertion batch en DB]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style E fill:#e8f5e9
    style I fill:#fce4ec
```

## Architecture Parser Word

```mermaid
flowchart TD
    A[Buffer Word .docx] --> B[Mammoth.js]
    
    B --> C[extractRawText]
    B --> D[convertToHtml]
    
    C --> E[parseTextContent]
    D --> F[extractAuditedPages]
    
    E --> G[Détection Section 3]
    G --> H[lastIndexOf patterns]
    H --> I[Extraction critères]
    
    I --> J[Regex: Critère X.Y.]
    J --> K[Extraction constats]
    
    K --> L[Regex: Impact]
    L --> M[Structuration données]
    
    F --> N[Parse HTML liens]
    N --> O[Extraction URLs]
    
    M --> P[Résultat: findings[]]
    O --> Q[Résultat: pages[]]
    
    P --> R[Diagnostics]
    Q --> R
    
    R --> S[Retour: ParseResult]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style S fill:#e8f5e9
```

## Pipeline AI - Généralisation

```mermaid
flowchart LR
    A[Constat brut] --> B[Anonymisation]
    B -->|Retrait guillemets| C[« texte » → ""]
    
    C --> D[Alignement ton]
    D -->|Capitalisation| E[Première lettre majuscule]
    D -->|Ponctuation| F[Ajout point final]
    
    F --> G[Template générique]
    
    G --> H{Review?}
    H -->|Auto| I[status: draft]
    H -->|Expert| J[status: approved]
    
    I --> K[Bibliothèque]
    J --> K
    
    style A fill:#e3f2fd
    style G fill:#fff3e0
    style K fill:#e8f5e9
```

---

## Utilisation des Diagrammes

Ces diagrammes peuvent être visualisés avec :
- **Mermaid Live Editor** : https://mermaid.live
- **Intégration Markdown** : Fonctionne dans GitHub, Notion, et autres
- **Export** : Utilisez le Mermaid CLI pour générer des PNG/SVG

### Exemple de rendu

Pour générer une image à partir d'un diagramme :

```bash
# Installation
npm install -g @mermaid-js/mermaid-cli

# Génération
mmdc -i architecture.mmd -o architecture.png
```
