import { ArchiveProject } from 'components/Project/ArchiveProject'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import React, { useContext } from 'react'

export function ArchiveProjectSettingsPage() {
  const editV2ProjectDetailsTx = useEditProjectDetailsTx()
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  return (
    <ArchiveProject
      storeCidTx={editV2ProjectDetailsTx}
      owner={projectOwnerAddress}
    />
  )
}
