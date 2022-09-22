import ArchiveProject from 'components/ArchiveProject'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import React, { useContext } from 'react'

export function ArchiveProjectSettingsPage() {
  const editV2ProjectDetailsTx = useEditProjectDetailsTx()
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId, cv } = useContext(ProjectMetadataContext)

  if (!cv) return null

  return (
    <ArchiveProject
      storeCidTx={editV2ProjectDetailsTx}
      metadata={projectMetadata}
      projectId={projectId}
      owner={projectOwnerAddress}
      cv={cv}
    />
  )
}
