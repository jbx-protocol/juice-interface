import { t } from '@lingui/macro'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { toHexString } from 'utils/bigNumbers'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useSafeTransferFromTx(): TransactorInstance<{
  newOwnerAddress: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { owner } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

  return ({ newOwnerAddress }, txOpts) => {
    if (!transactor || !projectId || !contracts?.Projects) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.Projects
        ? 'contracts.Projects'
        : !newOwnerAddress
        ? 'newOwnerAddress'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${
            missingParam ?? 'parameter` not found'
          } in v1 SafeTransferFromTx`,
        ),
      )

      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'safeTransferFrom(address,address,uint256)',
      [owner, newOwnerAddress, toHexString(BigInt(projectId))],
      {
        ...txOpts,
        title: t`Transfer ownership of ${projectTitle}`,
      },
    )
  }
}
