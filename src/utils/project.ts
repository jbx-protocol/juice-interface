import { PV_V1, PV_V1_1, PV_V2 } from 'constants/pv'
import { PID, PV } from 'models/project'

/**
 * Get the subgraph representation of a project ID, based on given [pv] and [projectId]
 *
 * Reference implementation: https://github.com/jbx-protocol/juice-subgraph/blob/main/src/utils.ts#L84
 *
 * @param pv Project version
 * @param projectId the on-chain project ID
 */
export const idForProject = ({
  pv,
  projectId,
}: {
  pv?: PV
  projectId?: number
}) => {
  return pv && projectId ? (`${pv}-${projectId}` as PID) : undefined
}

/**
 * Checks if a string argument is a valid PV.
 * @param x String to check
 * @returns true if string is valid PV, else false
 */
export const isPV = (x: string): x is PV => {
  return new Set([PV_V1, PV_V1_1, PV_V2] as string[]).has(x)
}

/**
 * Checks if a string argument matches PID pattern.
 * @param x String to check
 * @returns true if string is PID, else false
 */
export const isPID = (x: string): x is PID => {
  const parts = x.split('-')

  if (parts.length !== 2) return false

  const [pv, projectId] = parts

  if (!isPV(pv)) return false

  const _projectId = parseInt(projectId)

  if (!(Number.isInteger(_projectId) && _projectId > 0)) return false

  return true
}
