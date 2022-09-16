import { V2ProjectContext } from 'contexts/v2/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'

import ArchiveProject from 'components/ArchiveProject'
import { CV_V2 } from 'constants/cv'
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
  const { projectOwnerAddress } = useContext(V2ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  return (
    <ArchiveProject
      storeCidTx={editV2ProjectDetailsTx}
      metadata={projectMetadata}
      projectId={projectId}
      owner={projectOwnerAddress}
      cv={CV_V2}
    />
  )
}
