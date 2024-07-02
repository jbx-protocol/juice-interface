import { V1ContractName } from 'models/v1/contracts'
import { BigintIsh, bigintsDiff, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useTotalSupplyOfProjectToken(
  projectId: BigintIsh | undefined,
) {
  return useContractReader<bigint>({
    contract: V1ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    valueDidChange: bigintsDiff,
  })
}
