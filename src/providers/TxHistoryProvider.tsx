import { TransactionResponse } from '@ethersproject/providers'
import { TransactionLog, TxStatus } from 'models/transaction'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { clearInterval, setInterval } from 'timers'

import { readProvider } from '../constants/readProvider'
import { TxHistoryContext } from '../contexts/txHistoryContext'

const nowSeconds = () => Math.round(new Date().valueOf() / 1000)

const KEY_TRANSACTIONS = 'transactions'

const SHORT_TERM_POLL_INTERVAL_MILLIS = 3 * 1000 // 3 sec
const LONG_TERM_POLL_INTERVAL_MILLIS = 12 * 1000 // 10 sec

// Arbitrary time to give folks a sense of tx history
const TX_HISTORY_TIME_SECS = 60 * 60 // 1 hr

export default function TxHistoryProvider({
  children,
}: {
  children: ReactNode
}) {
  const [transactions, setTransactions] = useState<TransactionLog[]>([])
  const [poller, setPoller] = useState<NodeJS.Timer>()

  // Sets TransactionLogs in both localStorage and state
  // Ensures localStorage is always up to date, so we can persist good data on refresh
  const _setTransactions = useCallback((txs: TransactionLog[]) => {
    localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(txs))
    setTransactions(txs)
  }, [])

  // Load initial state
  useEffect(() => {
    _setTransactions(
      JSON.parse(localStorage.getItem(KEY_TRANSACTIONS) || '[]')
        // Only persist txs that are failed/pending
        // or were created within history window
        .filter(
          (tx: TransactionLog) =>
            tx.status !== TxStatus.success ||
            nowSeconds() - TX_HISTORY_TIME_SECS < tx.createdAt,
        ) as TransactionLog[],
    )
  }, [_setTransactions])

  // Setup poller for refreshing transactions
  useEffect(() => {
    // Only set new poller if there are pending transactions
    // Succeeded/failed txs don't need to be refreshed
    if (!poller && transactions.some(tx => tx.status === TxStatus.pending)) {
      const threeMinutesAgo = nowSeconds() - 3 * 60 * 1000

      // If any pending txs were created less than 3 min ago, use short poll time
      // Otherwise use longer poll time
      // (Assume no need for quick UX if user has already waited 3 min)
      const pollInterval = transactions.some(
        tx => tx.status === TxStatus.pending && threeMinutesAgo < tx.createdAt,
      )
        ? SHORT_TERM_POLL_INTERVAL_MILLIS
        : LONG_TERM_POLL_INTERVAL_MILLIS

      setPoller(
        setInterval(
          async () =>
            _setTransactions(
              // Refresh all transactions
              await Promise.all(
                transactions.map(async txLog => {
                  // Only do refresh logic for pending txs
                  if (!txLog.tx.hash || txLog.status !== TxStatus.pending) {
                    return txLog
                  }

                  // If no response yet, get response
                  const response = (txLog.tx as TransactionResponse).wait
                    ? (txLog.tx as TransactionResponse)
                    : await readProvider.getTransaction(txLog.tx.hash)

                  let status = TxStatus.pending
                  try {
                    await response.wait()

                    // Tx has been mined
                    status = TxStatus.success
                  } catch (_) {
                    // Handle error thrown by ethers provider when a transaction fails
                    status = TxStatus.failed
                  }

                  return {
                    ...txLog,
                    tx: response,
                    status,
                  }
                }),
              ),
            ),
          pollInterval,
        ),
      )
    }

    // Clean up. Ensures we stop polling once all pending TXs have been refreshed
    return () => {
      if (poller) clearInterval(poller)
    }
  }, [poller, transactions, _setTransactions])

  const addTransaction = useCallback(
    (title: string, tx: TransactionResponse) => {
      _setTransactions([
        ...transactions,
        {
          // We use millis timestamp for id bcuz tx.hash may be undefined
          // UI couldn't create 2 txs at the same millisecond ...right?
          id: new Date().valueOf(),
          title,
          tx,
          createdAt: nowSeconds(),
          status: TxStatus.pending,
        },
      ])
    },
    [transactions, _setTransactions],
  )

  const removeTransaction = useCallback(
    (id: number) => _setTransactions(transactions.filter(tx => tx.id !== id)),
    [transactions, _setTransactions],
  )

  return (
    <TxHistoryContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TxHistoryContext.Provider>
  )
}
