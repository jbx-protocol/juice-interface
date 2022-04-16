import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V2ContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useProjectTokenTotalSupply(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: V2ContractName.JBTokenStore,
    functionName: 'totalSupplyOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })
}
