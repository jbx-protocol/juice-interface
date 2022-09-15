import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useEditV2ProjectHandleTx(): TransactorInstance<{
  ensName: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const projectTitle = useV2ProjectTitle()

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
      {
        ...txOpts,
        title: t`Edit handle of ${projectTitle}`,
      },
    )
  }
}
