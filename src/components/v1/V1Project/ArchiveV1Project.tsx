import { V1ProjectContext } from 'contexts/v1/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'

import ArchiveProject from 'components/ArchiveProject'
import { CV_V1 } from 'constants/cv'

/**
 * V1 Wrapper around `ArchiveProject`.
 */
export default function ArchiveV1Project({
  setUriTx,
}: {
  setUriTx: TransactorInstance<{
    cid: string
  }>
}) {
  const { metadata, projectId, handle, terminal, owner } =
    useContext(V1ProjectContext)

  const canTakePaymentsWhenArchived = !(terminal?.version === '1.1')

  return (
    <ArchiveProject
      storeCidTx={setUriTx}
      metadata={metadata}
      projectId={projectId}
      owner={owner}
      handle={handle}
      canTakePaymentsWhenArchived={canTakePaymentsWhenArchived}
      cv={CV_V1}
    />
  )
}
