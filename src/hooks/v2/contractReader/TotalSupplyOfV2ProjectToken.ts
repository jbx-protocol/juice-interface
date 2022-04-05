import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V2ContractReader'

/** Returns total supply of tokens for project with `projectId`. */
export default function useTotalSupplyOfV2ProjectToken(
  projectId: BigNumberish | undefined,
) {
  const { contracts } = useContext(V2UserContext)

  return useContractReader<BigNumber>({
    contract: contracts?.JBTokenStore,
    functionName: 'totalSupplyOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })
}
