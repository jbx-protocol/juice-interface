import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useSetProjectTerminalsTx(): TransactorInstance<{
  terminals: string[]
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

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
