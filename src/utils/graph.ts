import { PV } from 'models/pv'
import { isBigintIsh } from './bigNumbers'

/**
 * Get the subgraph representation of a project ID, based on given [pv] and [projectId]
 *
 * Reference implementation: https://github.com/jbx-protocol/juice-subgraph/blob/main/src/utils.ts#L84
 *
 * @param pv Contracts version
 * @param projectId the on-chain project ID
 */
export const getSubgraphIdForProject = (pv: PV, projectId: number) => {
  return `${pv}-${projectId}`
}

export const parsebigintKeyVals = <T extends object, K extends keyof T>(
  json: T,
  keys: K[],
) => {
  return keys.reduce(
    (acc, k) => ({
      ...acc,
      ...parsebigintKeyVal(k, json[k]),
    }),
    {} as { [k in K]: bigint },
  )
}

/**
 * Parse a key value pair from an object
 * @param key Name of key
 * @param val Value to convert to bigint
 * @returns Key value pair, where value is a bigint
 */
export const parsebigintKeyVal = <K extends string | number | symbol>(
  key: K,
  val: unknown,
) => {
  let output

  try {
    if ((val as { type: 'bigint'; hex: string }).type === 'bigint') {
      // Patch to allow this to work with responses already parsed by the Apollo client. Eventually this parsing layer should be removed entirely in favor of using just the Apollo client.
      output = { [key]: BigInt((val as { hex: string }).hex) }
    } else if (isBigintIsh(val)) {
      output = { [key]: BigInt(val) }
    }
  } catch (e) {
    output = {}
  }

  return output as { [k in K]: bigint }
}
