import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { TransactorInstance } from '../../Transactor'

export function useTransferUnclaimedTokensTx(): TransactorInstance<{
  amount: BigNumber
  to: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ amount, to }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBTokenStore) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBTokenStore,
      'transferFrom',
      [userAddress, projectId.toHexString(), to, amount.toHexString()],
      txOpts,
    )
  }
}
