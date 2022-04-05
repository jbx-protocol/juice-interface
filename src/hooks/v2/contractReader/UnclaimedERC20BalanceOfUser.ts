import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'

import useContractReader from './V2ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUnclaimedERC20BalanceOfUser() {
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)
  const { contracts } = useContext(V2UserContext)

  return useContractReader<BigNumber>({
    contract: contracts?.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // updateOn: TODO: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
