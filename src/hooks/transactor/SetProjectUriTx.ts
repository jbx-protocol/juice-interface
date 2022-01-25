import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useSetProjectUriTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId } = useContext(ProjectContext)

  return ({ cid }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'setUri',
      [projectId.toHexString(), cid],
      txOpts,
    )
  }
}
