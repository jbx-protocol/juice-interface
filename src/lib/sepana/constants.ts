/**
 * Max number of attempts to resolve IPFS metadata for a project in sepana
 */
export const MAX_METADATA_RETRIES = 3

/**
 * Current version of sepana project model. Any projects not matching the current version will be forced to update.
 */
export const CURRENT_VERSION = '1'

export const SEPANA_DEFAULT_SCORE_SCRIPT =
  "3 * Math.max(0, doc['totalPaid.keyword'].value.length() - 17) + 3 * Math.max(0, doc['trendingScore.keyword'].value.length() - 18)" // Prioritize matches with higher totalPaid and trendingScore
