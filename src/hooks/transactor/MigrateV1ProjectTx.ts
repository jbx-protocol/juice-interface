import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useMigrateV1ProjectTx(): TransactorInstance<{
  newTerminalAddress: string
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId } = useContext(ProjectContext)

  return ({ newTerminalAddress }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TerminalV1,
      'migrate',
      [projectId.toHexString(), newTerminalAddress],
      txOpts,
    )
  }
}
