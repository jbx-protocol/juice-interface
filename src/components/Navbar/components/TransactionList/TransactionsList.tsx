import { BoltIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Divider } from 'antd'
import BadgeIcon from 'components/BadgeIcon'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
import {
  TxHistoryContext,
  timestampForTxLog,
} from 'contexts/Transaction/TxHistoryContext'
import { TxStatus } from 'models/transaction'
import { useContext, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { etherscanLink } from 'utils/etherscan'
import { formatHistoricalDate } from 'utils/format/formatDate'
import TxStatusIcon from './TxStatusIcon'

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

  if (!transactions?.length) return null

  return (
    <div className="relative md:order-4">
      <div
        className={
          'flex cursor-pointer select-none items-center transition-colors'
        }
        role="button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <BadgeIcon
          icon={
            hasPendingTxs ? (
              <Loading size="default" />
            ) : (
              <BoltIcon className="h-6 w-6" role="button" />
            )
          }
          className="cursor-pointer hover:text-bluebs-400"
          badgeNumber={transactions?.length}
        />
        <span className="ml-4 text-sm font-medium md:hidden">
          <Trans>Transactions</Trans>
        </span>
      </div>

      {isExpanded && (
        <div
          className={twMerge(
            'z-10 rounded-lg border border-smoke-300 bg-white pt-5 shadow-lg ring-1 ring-black ring-opacity-5 dark:border-slate-300 dark:bg-slate-800',
            listClassName,
          )}
        >
          <div className="mb-4 flex items-center justify-between px-5">
            <h4 className="m-0">Transactions</h4>
            <ChevronUpIcon
              className="block h-5 w-5 cursor-pointer"
              onClick={() => setIsExpanded(false)}
            />
          </div>

          <Divider className="m-0" />

          <div className="max-h-[296px] overflow-auto py-3">
            {transactions
              .sort((a, b) =>
                timestampForTxLog(a) > timestampForTxLog(b) ? -1 : 1,
              )
              .map(tx => (
                <ExternalLink
                  key={`txitem-${tx.id}`}
                  href={
                    tx.tx?.hash ? etherscanLink('tx', tx.tx.hash) : undefined
                  }
                  className="block px-5 py-3 text-black hover:bg-smoke-50 dark:text-grey-50 dark:hover:bg-slate-600"
                >
                  <div className="flex w-full items-center justify-between gap-5 text-sm last:border-0 last:pb-0 dark:border-slate-200">
                    <TxStatusIcon status={tx.status} />

                    <div className="flex-1">
                      {tx.title}

                      <div className="text-xs text-grey-400 dark:text-slate-200">
                        {formatHistoricalDate(timestampForTxLog(tx) * 1000)}
                      </div>
                    </div>

                    <div
                      role="button"
                      className="py-2 pl-3 text-grey-400 hover:text-bluebs-500 dark:text-slate-200 dark:hover:text-bluebs-400"
                      onClick={
                        removeTransaction
                          ? e => {
                              e.stopPropagation()
                              e.preventDefault()
                              removeTransaction(tx.id)

                              // Close menu if removing last tx
                              if (transactions.length === 1 && isExpanded) {
                                setIsExpanded(false)
                              }
                            }
                          : undefined
                      }
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </div>
                  </div>
                </ExternalLink>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
