import { ArchiveProject } from 'components/Project/ArchiveProject'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useEditProjectDetailsTx } from 'packages/v2v3/hooks/transactor/useEditProjectDetailsTx'
import { useContext } from 'react'

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
