import { useExecutedSafeTransactions } from 'hooks/safe/ExecutedSafeTransaction'
import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { SafeTransaction } from './SafeTransaction'

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
            isPastTransaction
          />
        ),
      )}
    </>
  )
}
