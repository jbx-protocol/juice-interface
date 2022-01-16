import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useDistributeTokensTx(): TransactorInstance<{}> {
  const { transactor, contracts } = useContext(UserContext)
  const { terminal, projectId } = useContext(ProjectContext)

  return (_, txOpts) => {
    if (!transactor || !terminal || !projectId || !contracts) {
      if (txOpts?.onDone) txOpts.onDone()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'printReservedTickets',
      [projectId.toHexString()],
      txOpts,
    )
  }
}
