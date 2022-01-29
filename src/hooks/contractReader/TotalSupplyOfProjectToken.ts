import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useTotalSupplyOfProjectToken(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: JuiceboxV1ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })
}
