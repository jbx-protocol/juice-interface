import { SafeTransactionType } from 'models/safe'
import { classNames } from 'utils/classNames'
import { SafeTransaction } from './SafeTransaction'

export function SafeNonceRow({
  nonce,
  transactions,
  selectedTx,
  isHistory,
  safeThreshold,
}: {
  nonce: number
  transactions: SafeTransactionType[]
  isHistory?: boolean
  selectedTx: string | undefined
  safeThreshold: number
}) {
  const containsSelectedTx = transactions.some(
    (tx: SafeTransactionType) => tx.safeTxHash === selectedTx,
  )

  return (
    <div
      className={classNames(
        'flex w-full justify-between border-b font-normal text-black transition-colors duration-100 ease-in-out dark:text-slate-100',
        containsSelectedTx
          ? 'border-b-bluebs-500 dark:border-b-bluebs-500'
          : 'border-b-grey-300 dark:border-b-slate-200',
      )}
      id={`safe-nonce-${nonce}`}
    >
      <div
        className={classNames(
          'pr-8 pt-5 text-grey-500 dark:text-grey-300',
          'min-w-[3.6.rem]', // account for double/triple digit nonces (keep tx titles in line)
        )}
      >
        {nonce}
      </div>
      <div className="w-full">
        {transactions.map((tx: SafeTransactionType, idx: number) => (
          <div
            className={classNames(
              idx !== 0 ? 'border-t border-smoke-200 dark:border-grey-600' : '',
            )}
            key={idx}
          >
            <SafeTransaction
              transaction={{ ...tx, threshold: safeThreshold }}
              selected={selectedTx === tx.safeTxHash}
              isPastTransaction={isHistory}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
