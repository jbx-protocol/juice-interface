import { BigNumber } from '@ethersproject/bignumber'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V3ProjectContext } from 'contexts/v3/projectContext'

import { V3ContractName } from 'models/v3/contracts'

import useContractReader from './V3ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUserUnclaimedTokenBalance() {
  const { userAddress } = useWallet()
  const { projectId } = useContext(V3ProjectContext)

  return useContractReader<BigNumber>({
    contract: V3ContractName.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // updateOn: TODO: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
