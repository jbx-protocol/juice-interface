import { Trans } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { useContext } from 'react'
import { SafeTransaction } from './SafeTransaction'

export interface SafeTransactionType {
  nonce: number
  origin: string
  data?: string
  dataDecoded?: {
    method: string
    parameters: object[]
  }
  isExecuted: boolean
  safeTxHash: string
  submissionDate: string
  executionDate: string
  confirmations?: {
    owner: string
    submissionDate: string
    transactionHash: string
    signature: string
    signatureType: string
  }[]
}

export function V2ProjectSafeDashboard() {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
  const { data: queuedSafeTransactions, isLoading } = useQueuedSafeTransactions(
    {
      safeAddress: projectOwnerAddress,
    },
  )

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto' }}>
      <h1>
        <Trans>Safe transactions</Trans>
      </h1>

      {isLoading && <span>Loading...</span>}

      {!isLoading && (
        <div>
          {queuedSafeTransactions?.results.map(
            (transaction: SafeTransactionType, idx: number) => (
              <SafeTransaction
                key={`safe-${transaction.nonce}-${idx}`}
                transaction={transaction}
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}
