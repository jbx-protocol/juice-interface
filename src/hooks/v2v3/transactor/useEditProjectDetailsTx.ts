import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'

import invariant from 'tiny-invariant'
import { useV2ProjectTitle } from '../useProjectTitle'

export function useEditProjectDetailsTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { cv } = useContext(V2V3ContractsContext)

  const projectTitle = useV2ProjectTitle()

  return ({ cid }, txOpts) => {
    try {
      invariant(transactor && contracts && projectId)
      return transactor(
        contracts.JBProjects,
        'setMetadataOf',
        [projectId, [cid, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN]],
        {
          ...txOpts,
          title: t`Edit details of ${projectTitle}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !contracts?.JBProjects
        ? 'JBProjects'
        : !projectId
        ? 'projectId'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'setMetadataOf',
        cv,
      })
    }
  }
}
