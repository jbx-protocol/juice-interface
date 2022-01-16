import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useSafeTransferFromTx(): TransactorInstance<{
  to: string
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId, owner } = useContext(ProjectContext)

  return ({ to }, txOpts) => {
    if (!transactor || !projectId || !contracts?.Projects) {
      if (txOpts?.onDone) txOpts.onDone()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'safeTransferFrom(address,address,uint256)',
      [owner, to, projectId.toHexString()],
      txOpts,
    )
  }
}
