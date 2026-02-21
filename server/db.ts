/**
 * Barrel re-export — point d'entrée unique pour toutes les fonctions d'accès BDD.
 *
 * Les fonctions sont organisées dans des repositories séparés :
 *   - repositories/connection.ts       → getDb()
 *   - repositories/userRepository.ts   → upsertUser, getUserByOpenId
 *   - repositories/referentialRepository.ts → initializeRgaaReferential, getAllThematics, etc.
 *   - repositories/reportRepository.ts → createAuditReport, getUserAuditReports, etc.
 *   - repositories/findingRepository.ts → createFinding, getEnrichedFindings, etc.
 */

export { getDb } from "./repositories/connection";
export { upsertUser, getUserByOpenId } from "./repositories/userRepository";
export {
  initializeRgaaReferential,
  getAllThematics,
  getThematicByNumber,
  getAllCriteria,
  getCriterionByReference,
  getCriteriaByThematic,
  searchCriteria,
} from "./repositories/referentialRepository";
export {
  createAuditReport,
  getAuditReportById,
  getUserAuditReports,
  updateAuditReportStatus,
  updateAuditReportFindingsCount,
  updateAuditReportSiteData,
  deleteAuditReport,
  checkDuplicateReport,
} from "./repositories/reportRepository";
export {
  createFinding,
  createFindingsBatch,
  getReportFindings,
  getFilteredFindings,
  getStatsByThematic,
  getStatsByImpact,
  getEnrichedFindings,
  searchSimilarFindings,
} from "./repositories/findingRepository";
export {
  searchFindingTemplates,
  getFindingTemplatesByCriterion,
  getFindingTemplateBySignature,
  upsertFindingTemplateFromFinding,
  updateFindingTemplate,
  syncTemplatesFromFindings,
  bulkGeneralizeTemplates,
  resetTemplateToOriginal,
} from "./repositories/templateRepository";
export {
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  setSetting,
  seedDefaultSettings,
} from "./repositories/settingsRepository";
