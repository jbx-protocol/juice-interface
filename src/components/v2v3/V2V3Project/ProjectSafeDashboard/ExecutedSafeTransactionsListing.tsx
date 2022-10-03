import { useExecutedSafeTransactions } from 'hooks/safe/ExecutedSafeTransaction'
import { SafeTransactionType } from '.'
import { SafeTransaction } from './SafeTransaction'

export function ExecutedSafeTransactionsListing({
  safeAddress,
  selectedTx,
}: {
  safeAddress: string
  selectedTx: string | undefined
}) {
  const { data: executedSafeTransactions, isLoading } =
    useExecutedSafeTransactions({
      safeAddress,
    })

  if (isLoading) {
    return <div style={{ marginTop: 20 }}>Loading...</div>
  }

  return (
    <>
      {executedSafeTransactions?.map(
        (transaction: SafeTransactionType, idx: number) => (
          <SafeTransaction
            key={`safe-${transaction.nonce}-${idx}`}
            transaction={transaction}
            selected={selectedTx === transaction.safeTxHash}
          />
        ),
      )}
    </>
  )
}
