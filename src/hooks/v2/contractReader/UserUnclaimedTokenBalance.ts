import { BigNumber } from '@ethersproject/bignumber'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { V2ContractName } from 'models/v2/contracts'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import useContractReader from './V2ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUserUnclaimedTokenBalance() {
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

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
