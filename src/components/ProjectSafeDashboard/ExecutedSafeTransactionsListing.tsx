import { LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { useExecutedSafeTransactions } from 'hooks/safe/useExecutedSafeTransaction'
import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { getUniqueNonces } from '../../utils/safe'
import { SafeNonceRow } from './SafeNonceRow'

export function ExecutedSafeTransactionsListing({
  safe,
  selectedTx,
}: {
  safe: GnosisSafe
  selectedTx: string | undefined
}) {
  const { data: executedSafeTransactions, isLoading } =
    useExecutedSafeTransactions({
      safeAddress: safe.address,
    })

  if (isLoading) {
    return (
      <div className="mt-5">
        <LoadingOutlined />
      </div>
    )
  }

  const uniqueNonces = getUniqueNonces(executedSafeTransactions)

  if (!isLoading && !uniqueNonces.length) {
    return (
      <div>
        <Trans>This Safe has no past transactions.</Trans>
      </div>
    )
  }

  return (
    <>
      {uniqueNonces?.map((nonce: number, idx: number) => {
        const transactionsOfNonce = executedSafeTransactions?.filter(
          (tx: SafeTransactionType) =>
            tx.nonce === nonce && tx.dataDecoded && tx.isExecuted,
        )

        if (!transactionsOfNonce) return null

        return (
          <SafeNonceRow
            key={`safe-${nonce}-${idx}`}
            nonce={nonce}
            transactions={transactionsOfNonce}
            safeThreshold={safe.threshold}
            isHistory
            selectedTx={selectedTx}
          />
        )
      })}
    </>
  )
}
