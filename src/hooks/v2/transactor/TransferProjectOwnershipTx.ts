import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useTransferProjectOwnershipTx(): TransactorInstance<{
  newOwnerAddress: string // new owner address
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId, projectOwnerAddress } = useContext(V2ProjectContext)
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
