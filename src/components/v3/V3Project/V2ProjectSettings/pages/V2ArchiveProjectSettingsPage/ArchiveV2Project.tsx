import { V3ProjectContext } from 'contexts/v3/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'

import ArchiveProject from 'components/ArchiveProject'

/**
 * V2 Wrapper around `ArchiveProject`.
 */
export function V2ArchiveProject({
  editV2ProjectDetailsTx,
}: {
  editV2ProjectDetailsTx: TransactorInstance<{
    cid: string
  }>
}) {
  const { projectMetadata, projectId, projectOwnerAddress, cv } =
    useContext(V3ProjectContext)

  return (
    <ArchiveProject
      storeCidTx={editV2ProjectDetailsTx}
      metadata={projectMetadata}
      projectId={projectId}
      owner={projectOwnerAddress}
      cv={cv ?? '2'}
    />
  )
}
