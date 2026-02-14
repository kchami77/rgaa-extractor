import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Thématiques RGAA 4.1
 * Les 13 thématiques principales du référentiel d'accessibilité
 */
export const rgaaThematics = mysqlTable("rgaa_thematics", {
  id: int("id").autoincrement().primaryKey(),
  /** Numéro de la thématique (1-13) */
  number: int("number").notNull().unique(),
  /** Nom de la thématique (ex: "Images", "Liens", "Scripts") */
  name: varchar("name", { length: 255 }).notNull(),
  /** Description de la thématique */
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RgaaThematic = typeof rgaaThematics.$inferSelect;
export type InsertRgaaThematic = typeof rgaaThematics.$inferInsert;

/**
 * Critères RGAA 4.1
 * Chaque critère est associé à une thématique
 */
export const rgaaCriteria = mysqlTable("rgaa_criteria", {
  id: int("id").autoincrement().primaryKey(),
  /** Référence du critère (ex: "1.1", "6.2", "10.7") */
  reference: varchar("reference", { length: 10 }).notNull().unique(),
  /** Libellé complet du critère */
  label: text("label").notNull(),
  /** ID de la thématique associée */
  thematicId: int("thematic_id").notNull(),
  /** Description détaillée du critère */
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RgaaCriterion = typeof rgaaCriteria.$inferSelect;
export type InsertRgaaCriterion = typeof rgaaCriteria.$inferInsert;

/**
 * Rapports d'audit importés
 * Chaque rapport représente un fichier Word uploadé
 */
export const auditReports = mysqlTable("audit_reports", {
  id: int("id").autoincrement().primaryKey(),
  /** Nom du fichier uploadé */
  fileName: varchar("file_name", { length: 255 }).notNull(),
  /** Clé S3 du fichier stocké */
  fileKey: varchar("file_key", { length: 255 }).notNull(),
  /** URL publique du fichier */
  fileUrl: text("file_url"),
  /** ID de l'utilisateur qui a uploadé le rapport */
  userId: int("user_id").notNull(),
  /** URL du site audité (déduite du document) */
  siteUrl: varchar("site_url", { length: 500 }),
  /** Pages auditées extraites de la section Contexte (JSON: [{name, url}]) */
  auditedPages: text("audited_pages"),
  /** Nombre de constats extraits */
  findingsCount: int("findings_count").default(0).notNull(),
  /** Statut du traitement (pending, processing, completed, failed) */
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  /** Message d'erreur en cas d'échec */
  errorMessage: text("error_message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AuditReport = typeof auditReports.$inferSelect;
export type InsertAuditReport = typeof auditReports.$inferInsert;

/**
 * Constats d'accessibilité
 * Chaque constat représente une non-conformité détectée
 */
export const findings = mysqlTable("findings", {
  id: int("id").autoincrement().primaryKey(),
  /** ID du rapport d'audit source */
  reportId: int("report_id").notNull(),
  /** ID du critère RGAA associé */
  criterionId: int("criterion_id").notNull(),
  /** ID de la thématique RGAA */
  thematicId: int("thematic_id").notNull(),
  /** Sous-thématique (ex: "Alternatives aux images porteuses d'information") */
  subThematic: varchar("sub_thematic", { length: 255 }),
  /** Niveau d'impact (Bloquant, Majeur, Mineur) */
  impact: mysqlEnum("impact", ["Bloquant", "Majeur", "Mineur"]).notNull(),
  /** Localisation du problème (ex: "Page Accueil") */
  location: varchar("location", { length: 255 }),
  /** Type de contenu impacté (ex: "Images", "Rédactionnel", "Liens") */
  contentType: varchar("content_type", { length: 255 }),
  /** Problème utilisateur : description de l'impact pour l'usager */
  userProblem: text("user_problem"),
  /** Description textuelle du constat (la non-conformité détectée) */
  finding: text("finding").notNull(),
  /** Action corrective (solution formulée à l'impératif) */
  solution: text("solution"),
  /** Numéro de la thématique (dénormalisé pour les requêtes) */
  thematicNumber: int("thematic_number"),
  /** Référence du critère (dénormalisé pour les requêtes) */
  criterionReference: varchar("criterion_reference", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Finding = typeof findings.$inferSelect;
export type InsertFinding = typeof findings.$inferInsert;

/**
 * Bibliothèque de constats génériques
 * Constats réutilisables extraits de plusieurs rapports
 */
export const findingTemplates = mysqlTable("finding_templates", {
  id: int("id").autoincrement().primaryKey(),
  /** ID du critère RGAA associé */
  criterionId: int("criterion_id").notNull(),
  /** ID de la thématique RGAA */
  thematicId: int("thematic_id").notNull(),
  /** Niveau d'impact */
  impact: mysqlEnum("impact", ["Bloquant", "Majeur", "Mineur"]).notNull(),
  /** Type de contenu impacté */
  contentType: varchar("content_type", { length: 255 }),
  /** Description générique du constat */
  finding: text("finding").notNull(),
  /** Solution générique */
  solution: text("solution"),
  /** Nombre de fois que ce constat a été rencontré */
  occurrenceCount: int("occurrence_count").default(1).notNull(),
  /** Statut d'approbation (draft, approved, deprecated) */
  status: mysqlEnum("status", ["draft", "approved", "deprecated"]).default("draft").notNull(),
  /** Niveau de confiance (0-100) ou labels simples */
  confidenceLevel: int("confidence_level").default(0),
  /** Contexte d'usage optionnel pour aider l'IA */
  usageContext: text("usage_context"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FindingTemplate = typeof findingTemplates.$inferSelect;
export type InsertFindingTemplate = typeof findingTemplates.$inferInsert;
