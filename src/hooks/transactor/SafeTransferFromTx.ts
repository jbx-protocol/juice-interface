import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useSafeTransferFromTx(): TransactorInstance<{
  to: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId, owner } = useContext(V1ProjectContext)

  return ({ to }, txOpts) => {
    if (!transactor || !projectId || !contracts?.Projects) {
      txOpts?.onDone?.()
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
