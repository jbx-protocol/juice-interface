import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

import ArchiveProject from 'components/ArchiveProject'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'

/**
 * V2 Wrapper around `ArchiveProject`.
 */
export default function ArchiveV2Project() {
  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()

  const { projectMetadata, projectId, projectOwnerAddress, cv } =
    useContext(V2ProjectContext)

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
