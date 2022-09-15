import { V2ProjectContext } from 'contexts/v2/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'

import ArchiveProject from 'components/ArchiveProject'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'

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
  const { projectId, projectOwnerAddress, cv } = useContext(V2ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

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
