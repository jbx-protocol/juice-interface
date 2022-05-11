import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useStakeTokensTx(): TransactorInstance<{
  amount: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V1ProjectContext)

  return ({ amount }, txOpts) => {
    if (!transactor || !projectId || !userAddress || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'stake',
      [
        userAddress,
        BigNumber.from(projectId).toHexString(),
        amount.toHexString(),
      ],
      txOpts,
    )
  }
}
