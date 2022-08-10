import { useWallet } from 'hooks/Wallet'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { V1ContractName } from 'models/v1/contracts'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUnclaimedBalanceOfUser() {
  const { userAddress } = useWallet()
  const { projectId, terminal } = useContext(V1ProjectContext)

  return useContractReader<BigNumber>({
    contract: V1ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
