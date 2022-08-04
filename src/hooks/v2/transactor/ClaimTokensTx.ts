import { useAccount } from 'wagmi'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { TransactorInstance } from '../../Transactor'

export function useClaimTokensTx(): TransactorInstance<{
  claimAmount: BigNumber
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { address: userAddress } = useAccount()
  const { projectId } = useContext(V2ProjectContext)

  return ({ claimAmount }, txOpts) => {
    if (!transactor || !userAddress || !projectId || !contracts?.JBTokenStore) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBTokenStore,
      'claimFor',
      [userAddress, projectId, claimAmount.toHexString()],
      txOpts,
    )
  }
}
