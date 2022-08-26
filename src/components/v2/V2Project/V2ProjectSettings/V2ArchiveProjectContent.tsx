import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

import ArchiveProject from 'components/ArchiveProject'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'

/**
 * V2 Wrapper around `ArchiveProject`.
 */
export default function V2ArchiveProjectContent() {
  const { projectMetadata, projectId, projectOwnerAddress, cv } =
    useContext(V2ProjectContext)

  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()

  return (
    <ArchiveProject
      storeCidTx={editV2ProjectDetailsTx}
      metadata={projectMetadata}
      projectId={projectId}
      owner={projectOwnerAddress}
      cv={cv ?? '2'}
      showHeader={false}
    />
  )
}
