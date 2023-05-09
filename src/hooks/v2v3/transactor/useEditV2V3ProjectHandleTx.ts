import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useJBProjectHandles } from 'hooks/JBProjectHandles/contracts/useJBProjectHandles'
import { TransactorInstance } from 'hooks/useTransactor'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../useProjectTitle'

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
