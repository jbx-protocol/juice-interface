import { t } from '@lingui/macro'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useEditV2ProjectHandleTx(): TransactorInstance<{
  ensName: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

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
