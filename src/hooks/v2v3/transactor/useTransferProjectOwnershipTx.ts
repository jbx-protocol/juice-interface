import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'

import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { useV2ProjectTitle } from '../useProjectTitle'

export function useTransferProjectOwnershipTx(): TransactorInstance<{
  newOwnerAddress: string // new owner address
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  return ({ newOwnerAddress }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBProjects ||
      !newOwnerAddress
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.JBProjects
        ? 'contracts.JBProjects'
        : !newOwnerAddress
        ? 'newOwnerAddress'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${missingParam ?? 'parameter` not found'} in v2 transactor`,
        ),
      )

      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBProjects,
      'safeTransferFrom(address,address,uint256)',
      [projectOwnerAddress, newOwnerAddress, projectId],
      {
        ...txOpts,
        title: t`Transfer ownership of ${projectTitle}`,
      },
    )
  }
}
