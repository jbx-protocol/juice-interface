import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useStakeTokensTx(): TransactorInstance<{
  amount: BigNumber
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(ProjectContext)

  return ({ amount }, txOpts) => {
    if (!transactor || !projectId || !userAddress || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'stake',
      [userAddress, projectId.toHexString(), amount.toHexString()],
      txOpts,
    )
  }
}
