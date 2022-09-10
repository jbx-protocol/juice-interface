import { BigNumber } from '@ethersproject/bignumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useClaimTokensTx(): TransactorInstance<{
  claimAmount: BigNumber
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useWallet()
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
