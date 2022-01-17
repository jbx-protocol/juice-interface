import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useSetProjectHandleTx(): TransactorInstance<{
  handle: string
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId } = useContext(ProjectContext)

  return ({ handle }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'setHandle',
      [projectId.toHexString(), utils.formatBytes32String(handle)],
      txOpts,
    )
  }
}
