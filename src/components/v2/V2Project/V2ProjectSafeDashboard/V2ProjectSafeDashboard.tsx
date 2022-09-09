import { Trans } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { useContext } from 'react'

interface SafeTransaction {
  safe: string
  dataDecoded: { method: string }
  //todo flesh out
}

export function V2ProjectSafeDashboard() {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
  const { data: queuedSafeTransactions } = useQueuedSafeTransactions({
    safeAddress: projectOwnerAddress,
  })

  return (
    <div>
      <h1>
        <Trans>Safe transactions</Trans>
      </h1>

      <div>
        {queuedSafeTransactions.results.map(
          (tx: SafeTransaction) => tx.dataDecoded.method,
        )}
      </div>
    </div>
  )
}
