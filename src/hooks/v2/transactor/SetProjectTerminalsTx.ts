import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useSetProjectTerminalsTx(): TransactorInstance<{
  terminals: string[]
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const projectTitle = useV2ProjectTitle()

  return ({ terminals }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBDirectory) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBDirectory,
      'setTerminalsOf',
      [projectId, terminals],
      {
        ...txOpts,
        title: t`Set terminals for ${projectTitle}`,
      },
    )
  }
}
