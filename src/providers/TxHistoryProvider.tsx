import { TransactionResponse } from '@ethersproject/providers'
import { TransactionLog, TxStatus } from 'models/transaction'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { clearInterval, setInterval } from 'timers'

import { readProvider } from '../constants/readProvider'
import { TxHistoryContext } from '../contexts/txHistoryContext'

const KEY_TRANSACTIONS = 'transactions'

const POLL_INTERVAL_MILLIS = 15 * 1000 // 15 sec

const nowSeconds = () => new Date().valueOf() / 1000

const getLocalStorageTxLogs = () =>
  JSON.parse(localStorage.getItem(KEY_TRANSACTIONS) || '[]') as TransactionLog[]

// Arbitrary time to give folks a sense of tx history
// (manually removed txs won't persist)
const TX_HISTORY_TIME_SECS = 60 * 60 // 1 hr

// Only persist txs that are failed/pending or were created within history window
const txShouldPersistOnRefresh = (tx: TransactionLog) =>
  tx.status !== TxStatus.success ||
  nowSeconds() - TX_HISTORY_TIME_SECS < tx.createdAt

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

  // Set poller to periodically refresh stored transactions
  useEffect(() => {
    async function refreshTransactions() {
      const txs = getLocalStorageTxLogs().filter(txShouldPersistOnRefresh)

      _setTransactions(
        await Promise.all(
          txs.map(async txLog => {
            // We only care to refresh the pending txs
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
      )
    }

    // Settle down, only 1 poller at a time
    if (poller) return

    // Single initial refresh before setting interval
    refreshTransactions()

    setPoller(
      setInterval(() => {
        refreshTransactions()
      }, POLL_INTERVAL_MILLIS),
    )

    // Clean up after yourself
    return () => {
      if (poller) clearInterval(poller)
    }
  }, [poller, _setTransactions])

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
    (id: number) =>
      _setTransactions(transactions.filter(record => record.id !== id)),
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
