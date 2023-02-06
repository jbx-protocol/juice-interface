import { CaretDownOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { timestampForTxLog, TxHistoryContext } from 'contexts/txHistoryContext'
import { TxStatus } from 'models/transaction'
import { useContext, useEffect, useMemo, useState } from 'react'
import { classNames } from 'utils/classNames'
import Loading from '../../Loading'
import { TransactionItem } from './TransactionItem'

export function TransactionsList({
  listClassName,
}: {
  listClassName?: string
}) {
  const { transactions, removeTransaction } = useContext(TxHistoryContext)
  const [isExpanded, setIsExpanded] = useState<boolean>()

  const hasPendingTxs = useMemo(
    () => transactions?.some(tx => tx.status === TxStatus.pending),
    [transactions],
  )

  useEffect(() => {
    // Auto expand if pending tx is added
    if (hasPendingTxs) {
      setIsExpanded(true)
    }
  }, [hasPendingTxs])

  const hasTransactions = !!transactions?.length
  if (!hasTransactions) return null

  return (
    <div>
      <div
        className={classNames(
          'flex h-8 cursor-pointer select-none items-center justify-evenly rounded-full border border-solid border-smoke-300 pl-3 pr-1 transition-colors hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100',
        )}
        role="button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="mt-0.5 flex items-center justify-center">
          {hasPendingTxs ? (
            <Loading size="small" />
          ) : (
            <ThunderboltOutlined className="text-lg leading-none text-grey-400 dark:text-slate-200" />
          )}
        </span>
        <span
          className={classNames(
            'text-grey-black min-w-[20px] text-center font-medium dark:text-slate-100',
          )}
        >
          {isExpanded ? <CaretDownOutlined /> : transactions.length}
        </span>
      </div>

      {isExpanded && (
        <div className={classNames('z-10 flex flex-col gap-2', listClassName)}>
          {transactions?.length ? (
            transactions
              .sort((a, b) =>
                timestampForTxLog(a) > timestampForTxLog(b) ? -1 : 1,
              )
              .map(tx =>
                tx ? (
                  <TransactionItem
                    key={`txitem-${tx.id}`}
                    tx={tx}
                    onRemoveTransaction={
                      removeTransaction
                        ? () => {
                            removeTransaction(tx.id)

                            // Close menu if removing last tx
                            if (transactions.length === 1 && isExpanded) {
                              setIsExpanded(false)
                            }
                          }
                        : undefined
                    }
                  />
                ) : null,
              )
          ) : (
            <div className="font-medium">
              <Trans>No transaction history</Trans>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
