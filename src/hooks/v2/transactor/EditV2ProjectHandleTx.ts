import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useEditV2ProjectHandleTx(): TransactorInstance<{
  ensName: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ ensName }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBProjectHandles) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const ensNameParts = ensName.split('.').reverse()

    return transactor(
      contracts.JBProjectHandles,
      'setEnsNamePartsFor',
      [projectId, ensNameParts],
      txOpts,
    )
  }
}
