import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useSetProjectTerminalsTx(): TransactorInstance<{
  terminals: string[]
}> {
  const { transactor, contracts } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

  return ({ terminals }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBDirectory) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBDirectory,
      'setTerminalsOf',
      [projectId, terminals],
      txOpts,
    )
  }
}
