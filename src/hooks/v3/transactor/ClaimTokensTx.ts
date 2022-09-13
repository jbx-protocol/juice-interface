import { BigNumber } from '@ethersproject/bignumber'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useClaimTokensTx(): TransactorInstance<{
  claimAmount: BigNumber
}> {
  const { transactor, contracts } = useContext(V3UserContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(V3ProjectContext)

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
