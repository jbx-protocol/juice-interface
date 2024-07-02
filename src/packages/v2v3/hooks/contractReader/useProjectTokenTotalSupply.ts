import { V2V3ContractName } from 'packages/v2v3/models/contracts'

import { BigintIsh } from '@sushiswap/sdk'
import { bigintsDiff, toHexString } from 'utils/bigNumbers'
import useContractReader from './useV2ContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useProjectTokenTotalSupply(
  projectId: BigintIsh | undefined,
) {
  return useContractReader<bigint>({
    contract: V2V3ContractName.JBTokenStore,
    functionName: 'totalSupplyOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    valueDidChange: bigintsDiff,
  })
}
