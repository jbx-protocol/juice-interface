import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useTransferTokensTx(): TransactorInstance<{
  amount: BigNumber
  to: string
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(ProjectContext)

  return ({ amount, to }, txOpts) => {
    if (!transactor || !projectId || !contracts?.Projects) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'transfer',
      [userAddress, projectId.toHexString(), amount.toHexString(), to],
      txOpts,
    )
  }
}
