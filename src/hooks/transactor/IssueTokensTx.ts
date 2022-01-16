import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useIssueTokensTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId } = useContext(ProjectContext)

  return ({ name, symbol }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      if (txOpts?.onDone) txOpts.onDone()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'issue',
      [projectId.toHexString(), name, symbol],
      txOpts,
    )
  }
}
