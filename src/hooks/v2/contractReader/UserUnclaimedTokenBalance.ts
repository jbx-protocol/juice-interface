import { useWallet } from 'hooks/Wallet'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { V2ContractName } from 'models/v2/contracts'

import useContractReader from './V2ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUserUnclaimedTokenBalance() {
  const { userAddress } = useWallet()
  const { projectId } = useContext(V2ProjectContext)

  return useContractReader<BigNumber>({
    contract: V2ContractName.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // updateOn: TODO: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
