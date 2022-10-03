import { useExecutedSafeTransactions } from 'hooks/safe/ExecutedSafeTransaction'
import { SafeTransactionType } from '.'
import { SafeTransaction } from './SafeTransaction'

export function ExecutedSafeTransactionsListing({
  safeAddress,
}: {
  safeAddress: string
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
          />
        ),
      )}
    </>
  )
}
