import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useJBProjectHandles } from 'hooks/JBProjectHandles/contracts/JBProjectHandles'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useEditV2V3ProjectHandleTx(): TransactorInstance<{
  ensName: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const JBProjectHandles = useJBProjectHandles()
  const projectTitle = useV2ProjectTitle()

  return ({ ensName }, txOpts) => {
    if (!transactor || !projectId || !JBProjectHandles) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const ensNameParts = ensName.split('.').reverse()

    return transactor(
      JBProjectHandles,
      'setEnsNamePartsFor',
      [projectId, ensNameParts],
      {
        ...txOpts,
        title: t`Edit handle of ${projectTitle}`,
      },
    )
  }
}
