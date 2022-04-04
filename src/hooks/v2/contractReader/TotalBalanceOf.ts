import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V2ContractReader'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
) {
  const { contracts } = useContext(V2UserContext)

  return useContractReader<BigNumber>({
    contract: contracts?.JBTokenStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // TODO: updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
