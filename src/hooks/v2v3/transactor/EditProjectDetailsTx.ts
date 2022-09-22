import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'

import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'

import { useV2ProjectTitle } from '../ProjectTitle'

export function useEditProjectDetailsTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  return ({ cid }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBProjects) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBProjects,
      'setMetadataOf',
      [projectId, [cid, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN]],
      {
        ...txOpts,
        title: t`Edit details of ${projectTitle}`,
      },
    )
  }
}
