import { ArchiveProject } from 'components/Project/ArchiveProject'
import { TransactorInstance } from 'hooks/useTransactor'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useContext } from 'react'

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
  const { handle, terminal, owner } = useContext(V1ProjectContext)

  const canTakePaymentsWhenArchived = !(terminal?.version === '1.1')

  return (
    <ArchiveProject
      storeCidTx={setUriTx}
      owner={owner}
      handle={handle}
      canTakePaymentsWhenArchived={canTakePaymentsWhenArchived}
    />
  )
}
