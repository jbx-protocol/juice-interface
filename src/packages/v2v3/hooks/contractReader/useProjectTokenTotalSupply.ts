import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './useV2ContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useProjectTokenTotalSupply(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: V2V3ContractName.JBTokenStore,
    functionName: 'totalSupplyOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })
}
