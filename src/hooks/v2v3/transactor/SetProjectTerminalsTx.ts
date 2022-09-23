import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useSetProjectTerminalsTx(): TransactorInstance<{
  terminals: string[]
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

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
