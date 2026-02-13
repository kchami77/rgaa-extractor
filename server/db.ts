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
} from "./repositories/referentialRepository";
export {
  createAuditReport,
  getAuditReportById,
  getUserAuditReports,
  updateAuditReportStatus,
  updateAuditReportFindingsCount,
  updateAuditReportSiteData,
  deleteAuditReport,
} from "./repositories/reportRepository";
export {
  createFinding,
  createFindingsBatch,
  getReportFindings,
  getFilteredFindings,
  getStatsByThematic,
  getStatsByImpact,
  getEnrichedFindings,
} from "./repositories/findingRepository";
