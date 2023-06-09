import { BigNumber } from 'ethers'
import { PV } from 'models/pv'
import { isBigNumberish } from './bigNumbers'

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

export const parseBigNumberKeyVals = <T extends object, K extends keyof T>(
  json: T,
  keys: K[],
) => {
  return keys.reduce(
    (acc, k) => ({
      ...acc,
      ...parseBigNumberKeyVal(k, json[k]),
    }),
    {} as { [k in K]: BigNumber },
  )
}

/**
 * Parse a key value pair from an object
 * @param key Name of key
 * @param val Value to convert to BigNumber
 * @returns Key value pair, where value is a BigNumber
 */
export const parseBigNumberKeyVal = <K extends string | number | symbol>(
  key: K,
  val: unknown,
) => {
  let output

  try {
    if ((val as { type: 'BigNumber'; hex: string }).type === 'BigNumber') {
      // Patch to allow this to work with responses already parsed by the Apollo client. Eventually this parsing layer should be removed entirely in favor of using just the Apollo client.
      output = { [key]: BigNumber.from((val as { hex: string }).hex) }
    } else if (isBigNumberish(val)) {
      output = { [key]: BigNumber.from(val) }
    }
  } catch (e) {
    output = {}
  }

  return output as { [k in K]: BigNumber }
}
