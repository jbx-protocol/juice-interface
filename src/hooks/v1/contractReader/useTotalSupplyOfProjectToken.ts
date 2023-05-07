import { BigNumber, BigNumberish } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useTotalSupplyOfProjectToken(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: V1ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })
}
