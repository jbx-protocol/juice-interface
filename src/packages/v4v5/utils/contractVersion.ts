/**
 * Utility for getting contract version string
 * Converts numeric version (4 or 5) to string for jbContractAddress lookup
 */
export function getContractVersionString(version: 4 | 5): '4' | '5' {
  return version.toString() as '4' | '5'
}