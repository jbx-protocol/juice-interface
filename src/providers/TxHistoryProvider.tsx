import { TransactionResponse } from '@ethersproject/providers'
import { useWallet } from 'hooks/Wallet'
import { TransactionLog, TxStatus } from 'models/transaction'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { clearInterval, setInterval } from 'timers'

import { readProvider } from '../constants/readProvider'
import { TxHistoryContext } from '../contexts/txHistoryContext'

const nowSeconds = () => Math.round(new Date().valueOf() / 1000)

const SHORT_POLL_INTERVAL_MILLISECONDS = 3 * 1000 // 3 sec
const LONG_POLL_INTERVAL_MILLISECONDS = 12 * 1000 // 12 sec

// Arbitrary time to give folks a sense of tx history
const TX_HISTORY_TIME_SECS = 60 * 60 // 1 hr

export default function TxHistoryProvider({
  children,
}: {
  children: ReactNode
}) {
  const { userAddress, chain } = useWallet()
  const [transactions, setTransactions] = useState<TransactionLog[]>([])

  const localStorageKey = useMemo(
    () =>
      chain && userAddress
        ? `transactions_${chain?.id}_${userAddress}`
        : undefined,
    [chain, userAddress],
  )

  // Sets TransactionLogs in both localStorage and state
  // Ensures localStorage is always up to date, so we can persist good data on refresh
  const _setTransactions = useCallback(
    (txs: TransactionLog[]) => {
      if (!localStorageKey) return

      localStorage.setItem(localStorageKey, JSON.stringify(txs))
      setTransactions(txs)
    },
    [localStorageKey],
  )

  // Load initial state
  useEffect(() => {
    if (!localStorageKey) return

    _setTransactions(
      JSON.parse(localStorage.getItem(localStorageKey) || '[]')
        // Only persist txs that are failed/pending
        // or were created within history window
        .filter(
          (tx: TransactionLog) =>
            tx.status !== TxStatus.success ||
            nowSeconds() - TX_HISTORY_TIME_SECS < tx.createdAt,
        ) as TransactionLog[],
    )
  }, [_setTransactions, localStorageKey])

  // Setup poller for refreshing transactions
  useEffect(() => {
    // Only set new poller if there are pending transactions
    // Succeeded/failed txs don't need to be refreshed
    if (!transactions.some(tx => tx.status === TxStatus.pending)) return

    // If any pending txs were created less than 3 min ago, use short poll time
    // Otherwise use longer poll time
    // (Assume no need for quick UX if user has already waited 3 min)
    const threeMinutesAgo = nowSeconds() - 3 * 60
    const pollInterval = transactions.some(
      tx => tx.status === TxStatus.pending && threeMinutesAgo < tx.createdAt,
    )
      ? SHORT_POLL_INTERVAL_MILLISECONDS
      : LONG_POLL_INTERVAL_MILLISECONDS

    console.info('TxHistoryProvider::Setting poller', pollInterval)

    const poller = setInterval(async () => {
      console.info('TxHistoryProvider::poller::polling for tx updates...')

      const transactionLogs = await Promise.all(
        transactions.map(async txLog => {
          // Only do refresh logic for pending txs
          // tx.hash shouldn't ever be undefined but it's optional typed :shrug:
          if (!txLog.tx.hash || txLog.status !== TxStatus.pending) {
            return txLog
          }

          // If no response yet, get response.
          // We know tx is a TransactionResponse if `.wait` is defined.
          const response = (txLog.tx as TransactionResponse).wait
            ? (txLog.tx as TransactionResponse)
            : await readProvider.getTransaction(txLog.tx.hash)

          let status = TxStatus.pending
          try {
            // Tx has been mined
            status = TxStatus.success
          } catch (_) {
            // ethers provider throws error when a transaction fails
            status = TxStatus.failed
          }

          return {
            ...txLog,
            tx: response,
            status,
          }
        }),
      )

      console.info(
        'TxHistoryProvider::poller::settings transactions',
        transactionLogs,
      )

      _setTransactions(transactionLogs)
    }, pollInterval)

    // Clean up
    return () => {
      console.info('TxHistoryProvider::poller::removing poller')

      clearInterval(poller)
    }
  }, [transactions, _setTransactions])

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
